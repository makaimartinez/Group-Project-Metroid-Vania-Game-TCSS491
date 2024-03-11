class SpecterBoss {
    constructor(game, x, y, spritesheet) {
        Object.assign(this, { game, x, y, spritesheet});

        this.velocity = {x:0, y:0};

        this.facing = true;
        this.hurt = false;
        this.engageRange = 300;
        this.disengageRange = 600;
        this.attackRange = 80;
        this.attackCD = 2;
        this.attackCDCountDown = 0;
        this.target = null;
        
        this.light = true;
        this.radius = this.engageRange

        this.health = 10;
        this.hurt = false;

        this.BB = new BoundingBox(this.x + 25, this.y, 55, 100, "specterBoss");
        this.lastBB = this.BB;
        this.dmgBB = null;
        this.animations = []; //0 = idle, 1 = foward, 2= backward (unused), 3 = attack, 4 = spawn (unused), 5 = death;
        this.loadAnimations();

        this.currentState = new SpecBossIdle(this);
        // this.currentState = new SpecBossAttack(this);
        this.animation = this.currentState.animation;
        this.state = this.currentState.name; //0 = idle, 1 = forward, 2 = follow, 3 = attack, 4 = hurt, 5 = death
    }

    loadAnimations() {
        for (let i = 0; i < 9; i++) { //9 total animations//0-5 states, unused 6-9
            this.animations.push([]);
        }

        this.animations[0] = new Animator(this.spritesheet, 2, 68, 68, 69, 4, 0.25, 2, false, true); //weapon idle
        this.animations[1] = new Animator(this.spritesheet, 2, 139, 71, 72, 4, 0.25, 2, false, true); // forward
        this.animations[2] = new Animator(this.spritesheet, 2, 212, 78, 72, 4, 0.25, 2, false, true); // backward
        this.animations[3] = new Animator(this.spritesheet, 2, 478, 161, 82, 3, 0.32, 2, false, true); //slash
        this.animations[4] = new Animator(this.spritesheet, 2, 348, 74, 62, 7, 0.3, 2, false, true); //appear
        this.animations[5] = new Animator(this.spritesheet, 2, 285, 64, 62, 10, 0.225, 2, false, true); //dissappear
        
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

    cooldowns(TICK) {
        this.attackCDCountDown-=TICK;
    }

    hit() {
        this.hurt = true;
    }

    receive() {
        if(this.hurt && this.health <= 0 && this.state != 5) {
            this.newState = new SpecBossDeath(this);
        } else if(this.hurt && (this.state != 4 && this.state != 5)) {
            // console.log("state " + this.state);
            this.newState = new SpecBossHurt(this);
        } 
    }

    updateloop() {
        const TICK = this.game.clockTick;
        let game = this.game;
        this.newState = this.currentState.update(game,TICK);

        this.physics(TICK);
        this.collide();
        this.updateBB();
        this.cooldowns(TICK);
        this.receive();

        //if it's a new state, switch to that state
        //change the current animation
        if(this.newState != this.state) {
            console.log("new State " + this.newState.name);
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
            ctx.strokeStyle = "orange";
            if(this.target != null)
            ctx.arc(this.BB.center.x - this.game.camera.x, this.BB.center.y, this.disengageRange, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.strokeStyle = "skyblue";
            ctx.beginPath();
            ctx.arc(this.BB.center.x - this.game.camera.x, this.BB.center.y, this.engageRange, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(this.BB.center.x - this.game.camera.x, this.BB.center.y, this.attackRange, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }

    updateBB() {
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.x + 25, this.y, 55, 100, "specterBoss");
    }

    physics(TICK) {
        this.y+= this.velocity.y * TICK * 2;
        this.x+= this.velocity.x * TICK * 2;
    }

    //specter is allowed to pass through terrain
    //changes state depending on closeness with player
    //player detection based state change
    collide() {
        let that = this;
        this.game.entities.forEach(function(entity) {
            if(entity.BB && entity.BB != that){
                if(entity.BB.name == "player") {
                    if(that.state != 4 && that.state != 5){//not hurt or dead 
                        if(that.state == 2 || that.state == 3) {
                            if(!(that.BB.circleCollide(entity, that.disengageRange, entity.radius))) {
                                that.target = null
                                that.newState = new SpecBossIdle(that);
                            }
                        }
                        if(that.state != 2 && that.state != 3) {
                            if(that.BB.circleCollide(entity, that.engageRange, entity.radius)) {
                                that.target = entity;
                                that.newState = new SpecBossFollow(that);
                            }
                            
                        }
                        if(that.state != 3) {
                            if(that.BB.circleCollide(entity, that.attackRange, entity.radius) && that.attackCDCountDown <= 0) {
                                that.attackCDCountDown = that.attackCD;
                                that.newState = new SpecBossAttack(that);
                            }
                        }
                    }
                }
            }
        })
    }

}

class SpecBossIdle {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.name = 0;
        this.animation = 0;
        //wander
        this.idleDuration = 1.6;
        this.idleTime = 0;
    }
    
    onEnter() {
        this.stateManager.radius = this.stateManager.engageRange;
        this.stateManager.velocity.x = 0;
        this.stateManager.velocity.y = 0;
    }

    update(game,TICK) {
        this.idleTime+=TICK;
        if(this.idleTime >= this.idleDuration) {
            this.stateManager.facing = !this.stateManager.facing;
            return new SpecBossFoward(this.stateManager);
        }
        return this.name;
    }

    onExit() {

    }
}

class SpecBossFoward {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.name = 1;
        this.animation = 1;
        this.forwardDuration = 5;
        this.forwardTime = 0;
    }
    
    onEnter() {
        this.direction = 1;
        if(this.stateManager.facing) this.direction = -1;
    }

    update(game,TICK) {
        const wanderSpeed = 15;
        const maxWanderSpeed = 40
        let manager = this.stateManager;
        // const 

        this.forwardTime+=TICK;
        manager.velocity.x+=wanderSpeed * TICK * this.direction;

        if(this.forwardTime >= this.forwardDuration) {
            return new SpecBossIdle(this.stateManager);
        }

        if (manager.velocity.x >= maxWanderSpeed) manager.velocity.x = maxWanderSpeed;
        if (manager.velocity.x <= -maxWanderSpeed) manager.velocity.x = -maxWanderSpeed;

        return this.name;
    }

    onExit() {

    }
}

class SpecBossFollow {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.name = 2;
        this.animation = 1;
        this.target = stateManager.target
    }

    onEnter() {
        //full stop
        this.stateManager.velocity.x = 0;
        this.stateManager.velocity.y = 0;
        this.stateManager.radius = this.stateManager.disengageRange;
        //determine inital direction        
    }

    update(game,TICK) {
        this.radialChase();
        return this.name;
    }

    radialChase() {
        const verticalSpeed = 2000;
        const MAX_VERTICAL = 20000;
        const MIN_X = 20;
        const MAX_X = 1000;
        const MAX_Y = 50;
        const CHASE_RANGE = 100;
        
        let manager = this.stateManager;
        let target = this.target;
        let facing = manager.facing;

        var dist = getDistance(manager, this.target);
        var difX = (this.target.x - manager.x) / dist;
        var difY = (this.target.y - manager.y) / dist;
        manager.velocity.x += difX * MAX_VERTICAL / (dist * dist);
        manager.velocity.y += difY * MAX_VERTICAL / (dist * dist);

        let xDirection = target.x - manager.x
        let yDirection = target.y - manager.y

        //stop when too close
        if(Math.abs(xDirection) <= CHASE_RANGE) manager.velocity.x = 0
        // if(facing && manager.velocity.x >= -MIN_X) manager.velocity.x = -MIN_X;

        if(manager.velocity.x >= MAX_X) manager.velocity.x = MAX_X;
        if(manager.velocity.x <= -MAX_X) manager.velocity.x = -MAX_X;
        
        if(manager.velocity.y >= MAX_Y) manager.velocity.y = MAX_Y;
        if(manager.velocity.y <= -MAX_Y) manager.velocity.y = -MAX_Y;
        
        if (manager.velocity.x < 0) manager.facing = true;
        if (manager.velocity.x > 0) manager.facing = false;

        if(!manager.BB.circleCollide(manager.target,manager.engageRange,this.target.radius)) {    
            return new SpecBossIdle(manager);
        }
    }

    onExit() {
        this.stateManager.velocity.x = 0;
        this.stateManager.velocity.y = 0;
    }
}

class SpecBossAttack {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.name = 3;
        this.animation = 3;
        
        this.duration = this.stateManager.animations[this.name].totalTime - 0.1;
        this.elaspedTime = 0;
    }

    onEnter() {
        // this.stateManager.radius = this.stateManager.attackRange;
        this.stateManager.velocity.x = 0;
        this.stateManager.velocity.y = 0;
        //rest animation frame
        this.stateManager.animations[this.name].elaspedTime = 0;
        // if(this.facing) ctx.strokeRect(this.x - 101 - this.game.camera.x, this.y + 15, 237, 69);
        // if(!this.facing) ctx.strokeRect(this.x - 25 - this.game.camera.x, this.y + 15, 237, 69);
    }

    update(game,TICK) {
        this.elaspedTime+=TICK;

        if(this.stateManager.animations[this.name].currentFrame() == 1) {
            let x = this.stateManager.x;
            let y = this.stateManager.y;
            let left = 0;
            let width = 237;
            let top = y + 15;
            let height = 69;
            
            if(this.stateManager.facing) {
                left = x - 101;
            }
            if(!this.stateManager.facing) { 
                left = x - 25;
            }
            let targetBB = this.stateManager.target.BB
            if(!this.stateManager.target.dead)
            // console.log("slash position: L" + this.roundD(left,1) + " R" + this.roundD((left + width),1) 
            //         + " T" + this.roundD(top,1) + " B" + this.roundD((top + height),1)
            //         + "\nplayer position: L" + this.roundD(targetBB.left,1) + " R" + this.roundD(targetBB.right,1) 
            //         + " T" + this.roundD(targetBB.top,1) + " B" + this.roundD(targetBB.bottom,1));
            this.stateManager.dmgBB = new BoundingBox(left, top, width, height, "specter slash");
            
            // if(this.facing) ctx.strokeRect(this.x - 101 - this.game.camera.x, this.y + 15, 237, 69);
            // if(!this.facing) ctx.strokeRect(this.x - 25 - this.game.camera.x, this.y + 15, 237, 69); 
        }
        if(this.stateManager.animations[this.name].currentFrame() != 1) this.stateManager.dmgBB = null;

        if(this.elaspedTime >= this.duration) {
            return new SpecBossIdle(this.stateManager)
        }

        return this.name;
    }

    roundD(num, d) {
        return Math.round(num * Math.pow(10,2))/Math.pow(10,2)
    }
    onExit() {
        this.stateManager.dmgBB = null;
    }
}

class SpecBossHurt {
    constructor(stateManager) {
        Object.assign(this, {stateManager});
        this.name = 4;
        this.animation = 0;
        //stunnedDuration
        this.duration = 0.4;
        this.elaspedTime = 0;
    }

    onEnter() {
        this.stateManager.health-=1;
        // this.stateManager.velocity.x = dmgDirection * 4; 
    }

    update(game, TICK) {
        //flicker for duration
        this.elaspedTime+=TICK;
        if(this.elaspedTime >= this.duration) {
            // console.log("exit");
            return new SpecBossIdle(this.stateManager);
        }

        return this.name;
    }

    onExit() {
        this.stateManager.hurt = false;
    }
}

class SpecBossDeath {
    constructor(stateManager) {
        Object.assign(this, {stateManager});
        this.name = 5;
        this.animation = 5
        this.duration = this.stateManager.animations[this.animation].totalTime - 0.1;
        this.elaspedTime = 0;
    }
    onEnter() {
        
        this.stateManager.dead = true;
        this.stateManager.BBName = "defeatedEnemy";
    }

    update(game, TICK) {
        this.elaspedTime+=TICK;
        // console.log("elasped " + this.elaspedTime)
        if(this.elaspedTime >= this.duration) {
            return new SpecBossIdle(this.stateManager);
        }
        return this.name;
    }
    onExit() {
        console.log("total time " + this.duration);
        console.log("exit" + this.elaspedTime)
        this.stateManager.removeFromWorld = true;
    }
}
