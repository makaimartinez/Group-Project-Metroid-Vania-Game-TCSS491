//Author: Thomas Tien
//use this as a simple example for complex state machines

class skelly {
    constructor(game, x, y, spritesheet) {
        Object.assign(this, { game, x, y,spritesheet});
        this.currentState = new skellyFall(this);//new EnemyFall(this);
        this.state = 2;//states: idle, walk, fall, attack, hurt, death
        this.health = 3;
        this.dead = false;
        this.hurt = false;

        this.newState = this.state;
        this.facing = false;

        this.velocity = {x:0, y:0};

        this.fallAC = 50;

        this.BB = new BoundingBox(this.x, this.y + 25, 44, 65,"skelly");
        this.BBName = "skelly";
        this.lastBB;
        this.animations = [];
        this.loadAnimations();
    }

    loadAnimations() {
        for (let i = 0; i < 10; i++) { //9 total animations
            this.animations.push([]);
        }
        //spritesheet, xStart, yStart, width, height, frameCount, frameDuration, framePadding, reverse, loop
        // this.animations[0] = new Animator(this.spritesheet, 0, 33, 21, 32, 4, 0.2, 1, false, true); //react
        this.animations[0] = new Animator(this.spritesheet, 0, 66, 22.9, 32, 11, 0.2, 1.1, false, true); //idle
        this.animations[1] = new Animator(this.spritesheet, 1, 0, 21, 32, 13, 0.12, 1, false, true); //1 = walk
        this.animations[2] = new Animator(this.spritesheet, 0, 66, 22.9, 32, 1, 0.2, 1.1, false, true); //2 = fall
        this.animations[3] = new Animator(this.spritesheet, 0, 165, 42, 38, 10, 0.2, 1, false, true); //3 = attack
        this.animations[4] = new Animator(this.spritesheet, 0, 99, 29, 32, 8, 0.15, 1, false, true); //4 = hurt
        this.animations[5] = new Animator(this.spritesheet, 0, 132, 32, 32, 15, 0.2, 1, false, true); //5 =death
    }

    adjustSpritePosition(ctx, scale) {
        let direction = 1;
        if(this.facing) direction = -1;

        let disjointX = 0;
        let alignX = 0;
        let alignY = 0;
        switch(this.state) {
            case 0:
            case 2:
                disjointX = -10;
                alignX = 10;
                alignY = 0;
                break;
            case 1:
                disjointX = -7.5;
                alignX = 7.5;
                alignY = 0;
                break;
            case 3:
                disjointX = -30;
                alignX = 38;
                alignY = 15;
                break;
            case 4:
                disjointX = -6;
                alignX = 18;                
                break
            case 5:
                disjointX = -2;
                alignX = 22;                
                break
        }
        this.animations[this.state].drawFrame(this.game.clockTick, ctx, this.x - (disjointX * direction) - alignX, this.y - alignY, scale, this.facing);
        // this.animations[this.state].drawFrame(this.game.clockTick, ctx, this.x - (disjointX * -1) - alignX, this.y - alignY, scale, true);
        // this.animations[this.state].drawFrame(this.game.clockTick, ctx, this.x - (disjointX * 1) - alignX, this.y - alignY - 100, scale, false);
    }
    
    hit() {
        this.hurt = true;
    }

    receive() {
        if(this.hurt && this.health <= 0 && this.state != 5) {
            this.newState = new skellyDeath(this);
        } else if(this.hurt && (this.state != 4 && this.state != 5)) {
            this.newState = new skellyHurt(this);
        } 
    }

    update() {
        const TICK = this.game.clockTick;
        this.newState = this.currentState.update(TICK);

        this.receive();
        this.physics();
        this.updateBB();
        this.collide();
        
        //if it's a new state, switch to that state
        if(this.newState != this.state) {
            this.state = this.newState.name;
            this.currentState.onExit();
            this.currentState = this.newState;
            this.currentState.onEnter();
        }
        // console.log(this.x + " " + this.y);
    }

    draw(ctx) {
        this.adjustSpritePosition(ctx,2.8);
        if(PARAMS.DEBUG) {
            ctx.font = "15px serif";
            ctx.fillStyle = "Black";
            ctx.textAlign = "right";
            if(!this.dead) {
                ctx.strokeRect(this.x, this.y + 25, 44, 65);    
            }
            ctx.fillText("HP " + this.health, this.x + 30, this.y + 20);
        }
    }

    updateBB() {
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.x, this.y + 25, 44, 65,"skelly");
    }

    // updateLastBB() {
    //     // this.lastBB = this.BB;
    // }

    physics() {
        const TICK = this.game.clockTick;

        this.velocity.y += this.fallAC * TICK;

        this.y+= this.velocity.y * TICK * 2;
        this.x+= this.velocity.x * TICK * 2;
    }

    collide() {
        let that = this;
        this.game.entities.forEach(function(entity) {
            if(entity.BB && entity.BB != that && that.BB.collide(entity.BB)) {
                if(entity.BB.name == "ground")  {
                    that.y = entity.BB.top - 90;
                    that.velocity.y = 0;
                    if(that.state == 2) {
                        that.newState = new skellyIdle(that);
                    }
                }
            }
        })
    }
}

class skellyIdle {
    constructor(stateManager) {
        Object.assign(this, {stateManager});
        this.name = 0;
        let intervalLength = this.stateManager.animations[this.name].totalTime;
        this.idleDuration = 2 * intervalLength;
        this.idleTime = 0;
    }

    onEnter() {
        this.stateManager.velocity.x *=2;
    }

    update(TICK) {
        //update stuff
        this.idleTime+=TICK;
        
        //condition to exit
        if(this.idleTime >= this.idleDuration) {
            // return "walk";
            this.stateManager.facing = !this.stateManager.facing;
            return new skellyWalk(this.stateManager);
        }
        if(this.stateManager.velocity.y >0) {
            // return "fall";
            return new skellyFall(this.stateManager);
        }
        return this.name;
    }

    onExit() {

    }
}

class skellyWalk {
    constructor(stateManager) {
        Object.assign(this, {stateManager});
        this.name = 1;
        let intervalLength = this.stateManager.animations[this.name].totalTime;
        this.walkDuration = intervalLength * 3;
        this.walkTime = 0;
    }

    onEnter() {
    }

    update(TICK) {
        //update stuff
        this.walkTime+=TICK;
        this.direction = 1;
        if(this.stateManager.facing) this.direction = -1;
        this.stateManager.x+=0.2 * this.direction;

        if(this.walkTime >= this.walkDuration) {
            return new skellyIdle(this.stateManager);
        }

        return this.name;
    }
    onExit() {

    }
}

class skellyFall {
    constructor(stateManager) {
        Object.assign(this, {stateManager});
        this.name = 2;
    }

    onEnter() {

    }

    update(TICK) {
        return this.name;
    }
    onExit() {

    }
}

class skellyAttack {
    constructor(stateManager) {
        Object.assign(this, {stateManager});
        this.name = 3;
    }

    onEnter() {
        this.stateManager.velocity.x *=0.5;
    }

    update(TICK) {
        return this.name;
    }
    onExit() {

    }
}

class skellyHurt {
    constructor(stateManager) {
        Object.assign(this, {stateManager});
        this.name = 4;
        this.duration = this.stateManager.animations[this.name].totalTime;
        this.elaspedTime = 0;
    }

    onEnter() {
        this.stateManager.health-=1;
        // this.stateManager.velocity.x = dmgDirection * 4; 
    }

    update(TICK) {
        this.elaspedTime+=TICK;
        // console.log(this.elaspedTime);
        if(this.elaspedTime >= this.duration) {
            return new skellyIdle(this.stateManager);
        }

        return this.name;
    }

    onExit() {
        console.log("hurt");
        this.stateManager.hurt = false;
        
    }
}

class skellyDeath {
    constructor(stateManager) {
        Object.assign(this, {stateManager});
        this.name = 5;
        this.duration = 3;
        this.elaspedTime = 0;
    }
    onEnter() {
        console.log("enter");
        this.stateManager.dead = true;
        this.stateManager.BBName = "defeatedEnemy";
    }

    update(TICK) {
        this.elaspedTime+=TICK;
        if(this.elaspedTime >= this.duration) {
            return new skellyIdle(this.stateManager);
        }
        return this.name;
    }
    onExit() {
        this.stateManager.removeFromWorld = true;
    }
}