class SpecterKnight {
    constructor(game, x, y, spritesheet) {
        Object.assign(this, { game, x, y, spritesheet});

        this.velocity = {x:0, y:0};

        this.facing = false;
        this.hurt = false;
        this.sightRange = 300;
        this.attackRange = 100;
        this.target = null;

        this.BB = new BoundingBox(this.x + 25, this.y, 55, 100, "specter");
        this.lastBB = this.BB;
        this.dmgBB = null;
        this.animations = []; //0 = idle, 1 = foward, 2= backward, 3 = attack, 4 = spawn, 5 = death;
        this.loadAnimations();

        this.currentState = new SpecKnightIdle(this);
        // this.currentState = new SpecKnightAttack(this);
        this.animation = this.currentState.animation;
        this.state = this.currentState.name; //idle, forward, follow, attack, hurt, death
    }

    loadAnimations() {
        

        for (let i = 0; i < 9; i++) { //9 total animations//0-5 states, unused 6-9
            this.animations.push([]);
        }

        this.animations[0] = new Animator(this.spritesheet, 2, 68, 68, 69, 4, 0.25, 2, false, true); //weapon idle
        this.animations[1] = new Animator(this.spritesheet, 2, 139, 71, 72, 4, 0.25, 2, false, true); // forward
        this.animations[2] = new Animator(this.spritesheet, 2, 212, 78, 72, 4, 0.25, 2, false, true); // backward
        this.animations[3] = new Animator(this.spritesheet, 2, 478, 161, 82, 3, 0.32, 2, false, true); //slash
        // this.animations[3] = new Animator(this.spritesheet, 2 + 162 * 1, 478, 161, 82, 1, 0.32, 2, false, true); //slash
        this.animations[4] = new Animator(this.spritesheet, 2, 348, 74, 62, 7, 0.3, 2, false, true); //appear
        this.animations[5] = new Animator(this.spritesheet, 2, 285, 64, 62, 10, 0.3, 2, false, true); //dissappear
        
        this.animations[6] = new Animator(this.spritesheet, 2, 2, 41, 64, 4, 0.2, 2, false, true); //idle
        this.animations[7] = new Animator(this.spritesheet, 2, 412, 68, 64, 4, 0.285, 2, false, true); //prepare slash
        this.animations[8] = new Animator(this.spritesheet, 2, 649, 86, 65, 7, 0.2, 2, false, false); //throw weapon
        this.animations[9] = new Animator(this.spritesheet, 721, 649, 67, 67, 8, 0.1, 2, false, true); //become weapon O_O // this.weaponSpin 
    }

    adjustSpritePosition(ctx, scale) {
        // this.animation = 7;
        let direction = 1;
        if(this.facing) direction = -1;

        let disjointX = 0;
        let alignX = 0;
        let alignY = 0;
        switch(this.animation) {
            case 0:
                disjointX = 18;
                break;
            case 1:
                disjointX = 20;
                break;
            case 2:
                alignX = 5;
                disjointX = 19;
                break;
            case 3:
                alignX = 65;
                alignY = 20;
                disjointX = -38;
                break;
            case 4:
                disjointX = -5;
                break;
            case 5:
                alignX = -5;
                alignY = -10;
                break;
            case 6:
                alignX = -20;
                break;
            case 7:
                disjointX = 3;
                alignX = -2;
                break;
        }
        this.animations[this.animation].drawFrame(this.game.clockTick, ctx, this.x - (disjointX * direction) - alignX - this.game.camera.x, this.y - alignY, scale, this.facing);
        // this.animations[this.animation].drawFrame(this.game.clockTick, ctx, this.x - (disjointX * -1) - alignX - this.game.camera.x, this.y - alignY, scale, true);
        // this.animations[this.animation].drawFrame(this.game.clockTick, ctx, this.x - (disjointX * 1) - alignX - this.game.camera.x, this.y - alignY + 100, scale, false);
        if(PARAMS.DEBUG && this.state == 3 && this.animations[this.state].currentFrame() == 1) {    
            if(this.facing) ctx.strokeRect(this.x - 101 - this.game.camera.x, this.y + 15, 237, 69);
            if(!this.facing) ctx.strokeRect(this.x - 25 - this.game.camera.x, this.y + 15, 237, 69);
        }
    }

    hit() {
        this.hurt = true;
    }
    updateloop() {
        const TICK = this.game.clockTick;
        let game = this.game;
        this.newState = this.currentState.update(game,TICK);

        // console.log("x " + this.x + "\ty " + this.y + "\nvel" + this.velocity.x + "\t" + this.velocity.y);
        this.physics(TICK);
        this.collide();
        this.updateBB();

        //if it's a new state, switch to that state
        //change the current animation
        if(this.newState != this.state) {
            // console.log(this.newState);
            this.state = this.newState.name;
            this.animation = this.newState.animation;
            this.currentState.onExit();
            delete this.currentState;
            this.currentState = this.newState;
            this.currentState.onEnter();
        }
    }

    //need to define more states
    update() {
        this.updateloop();
    }

    draw(ctx) {
        this.adjustSpritePosition(ctx,1.5);
        if(PARAMS.DEBUG) {
            this.BB.draw(ctx, this.game.camera);
            // ctx.strokeRect(this.x + 25 - this.game.camera.x, this.y + 100, 55, 100)
            // ctx.strokeRect(this.x - 101 - this.game.camera.x, this.y + 15, 237, 69)
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.arc(this.BB.center.x - this.game.camera.x, this.BB.center.y, this.sightRange, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(this.BB.center.x - this.game.camera.x, this.BB.center.y, this.attackRange, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }

    updateBB() {
        this.lastBB = this.BB;
        // this.BB = new BoundingBox(this.x + 50, this.y + 5, 42, 90, "specter");
        this.BB = new BoundingBox(this.x + 25, this.y, 55, 100, "specter");
    }

    physics(TICK) {
        this.y+= this.velocity.y * TICK * 2;
        this.x+= this.velocity.x * TICK * 2;
    }

    //specter is allowed to pass through terrain
    //if target is within...
    collide() {
        let that = this;
        this.game.entities.forEach(function(entity) {
            if(entity.BB && entity.BB != that){
                if(that.state != 2 && that.state != 3) {
                    if(entity.BB.name == "player" && getDistance(entity.BB.center, that.BB.center) <= that.sightRange) {
                        that.target = entity;
                        that.newState = new SpecKnightFollow(that);
                    }   
                }
    
                if(that.BB.collide(entity.BB)) {                
                    //attack
                }
            }
        })
    }

}

class SpecKnightIdle {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.name = 0;
        this.animation = 0;
        //wander
        this.idleDuration = 1.6;
        this.idleTime = 0;
    }
    
    onEnter() {
        this.stateManager.velocity.x = 0;
        this.stateManager.velocity.y = 0;
    }

    update(game,TICK) {
        this.idleTime+=TICK;
        if(this.idleTime >= this.idleDuration) {
            this.stateManager.facing = !this.stateManager.facing;
            return new SpecKnightFoward(this.stateManager);
        }
        return this.name;
    }

    onExit() {

    }
}

class SpecKnightFoward {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.name = 1;
        this.animation = 1;
        this.forwardDuration = 2;
        this.forwardTime = 0;
    }
    
    onEnter() {
        this.direction = 1;
        if(this.stateManager.facing) this.direction = -1;
    }

    update(game,TICK) {
        const wanderSpeed = 40;
        let manager = this.stateManager;
        // const 

        this.forwardTime+=TICK;
        manager.velocity.x+=wanderSpeed * TICK * this.direction;

        if(this.forwardTime >= this.forwardDuration) {
            return new SpecKnightIdle(this.stateManager);
        }

        if (manager.velocity.x >= wanderSpeed) manager.velocity.x = wanderSpeed;
        if (manager.velocity.x <= -wanderSpeed) manager.velocity.x = -wanderSpeed;

        return this.name;
    }

    onExit() {

    }
}

class SpecKnightFollow {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.name = 2;
        this.animation = 1;
        this.target = stateManager.target
    }

    onEnter() {
        //reset velocity
        this.stateManager.velocity.x = 0;
        this.stateManager.velocity.y = 0;

        //determine inital direction
        var dist = getDistance(this.stateManager, this.target);
        var difX = (this.target.x - this.stateManager.x) / dist;
        var difY = (this.target.y - this.stateManager.y) / dist;

        if(this.target != null) {
            // console.log("target spotted, following");
        } else {
            // console.log("error, target unknown");
        }
    }

    update(game,TICK) {
        const verticalSpeed = 30;
        const MAX_VERTICAL = 20000;
        let manager = this.stateManager;
        //close distance
        // console.log(this.stateManager.velocity.y);
        // if(manager.y < this.target.y) {
        //     manager.velocity.y += verticalSpeed * TICK;
        // }
        var dist = getDistance(manager, this.target);
        var difX = (this.target.x - manager.x) / dist;
        var difY = (this.target.y - manager.y) / dist;
        manager.velocity.x += difX * MAX_VERTICAL / (dist * dist);
        manager.velocity.y += difY * MAX_VERTICAL / (dist * dist);

        if (manager.velocity.y >= MAX_VERTICAL) manager.velocity.y = MAX_VERTICAL;
        if (manager.velocity.y <= -MAX_VERTICAL) manager.velocity.y = -MAX_VERTICAL;
        
        if (manager.velocity.x < 0) manager.facing = true;
        if (manager.velocity.x > 0) manager.facing = false;

        if(getDistance(manager,manager.target) > manager.sightRange) {
            return new SpecKnightIdle(manager);
        }

        if(getDistance(manager,manager.target) <= manager.attackRange) {
            return new SpecKnightAttack(manager);
        }

        return this.name;
    }

    onExit() {
    }
}

class SpecKnightAttack {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.name = 3;
        this.animation = 3;
        
        this.duration = this.stateManager.animations[this.name].totalTime - 0.1;
        this.elaspedTime = 0;
    }

    onEnter() {
        this.stateManager.velocity.x = 0;
        this.stateManager.velocity.y = 0;
        // if(this.facing) ctx.strokeRect(this.x - 101 - this.game.camera.x, this.y + 15, 237, 69);
        // if(!this.facing) ctx.strokeRect(this.x - 25 - this.game.camera.x, this.y + 15, 237, 69);
    }

    update(game,TICK) {
        this.elaspedTime+=TICK;

        if(this.stateManager.animations[this.name].currentFrame() == 1) {
            let x = this.stateManager.x;
            let y = this.stateManager.y;

            if(this.stateManager.facing) this.stateManager.dmgBB = new BoundingBox(x - 101, y + 15, 237, 69, "specter slash");
            if(!this.stateManager.facing) this.stateManager.dmgBB = new BoundingBox(x - 25, y + 15, 237, 69, "specter slash");
            // if(this.facing) ctx.strokeRect(this.x - 101 - this.game.camera.x, this.y + 15, 237, 69);
            // if(!this.facing) ctx.strokeRect(this.x - 25 - this.game.camera.x, this.y + 15, 237, 69); 
        } else {
            this.stateManager.dmgBB = null;
        }

        if(this.elaspedTime >= this.duration) {
            return new SpecKnightIdle(this.stateManager)
        }

        return this.name;
    }

    onExit() {

    }
}

class SpecKnightHurt {
    constructor(stateManager) {
        Object.assign(this, {stateManager});
        this.name = 4;
        this.animation = 0;
    }

    onEnter() {
        this.stateManager.health-=1;
        // this.stateManager.velocity.x = dmgDirection * 4; 
    }

    update(TICK) {
        //flicker for duration

        this.elaspedTime+=TICK;
        
        if(this.elaspedTime >= this.duration) {
            return new SpecKnightIdle(this.stateManager);
        }

        return this.name;
    }

    onExit() {
        this.stateManager.hurt = false;
    }
}

class SpecKnightDeath {
    constructor(stateManager) {
        Object.assign(this, {stateManager});
        this.name = 5;
        this.animation = 5
        this.duration = this.stateManager.animations[this.name].totalTime - 0.1;
        this.elaspedTime = 0;
    }
    onEnter() {
        this.stateManager.dead = true;
        this.stateManager.BBName = "defeatedEnemy";
    }

    update(TICK) {
        this.elaspedTime+=TICK;
        if(this.elaspedTime >= this.duration) {
            return new SpecKnightIdle(this.stateManager);
        }
        return this.name;
    }
    onExit() {
        this.stateManager.removeFromWorld = true;
    }
}
