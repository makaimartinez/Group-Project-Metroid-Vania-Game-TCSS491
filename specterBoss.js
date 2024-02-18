class SpecterBoss {
    constructor(game, x, y, spritesheet) {
        Object.assign(this, { game, x, y, spritesheet});
        this.facing = false;
        this.currentState = new SpecBossIdle(this);

        this.BB = new BoundingBox(this.x + 50, this.y + 5, 42, 90, "specter");
        this.lastBB;
        this.state = 0;
        this.animations = []; //0 = idle, 1 = foward, 2= backward, 3 = attack, 4 = spawn, 5 = death;
        this.loadAnimations();
    }

    loadAnimations() {
        for (let i = 0; i < 9; i++) { //9 total animations//0-5 states, unused 6-9
            this.animations.push([]);
        }

        this.animations[0] = new Animator(this.spritesheet, 2, 68, 68, 69, 4, 0.2, 2, false, true); //weapon idle
        this.animations[1] = new Animator(this.spritesheet, 2, 139, 71, 72, 4, 0.2, 2, false, true); // forward
        this.animations[2] = new Animator(this.spritesheet, 2, 212, 78, 72, 4, 0.2, 2, false, true); // backward
        this.animations[3] = new Animator(this.spritesheet, 2, 478, 161, 82, 3, 0.28, 2, false, true); //slash
        this.animations[4] = new Animator(this.spritesheet, 2, 348, 74, 62, 7, 0.128, 2, false, true); //appear
        this.animations[5] = new Animator(this.spritesheet, 2, 285, 64, 62, 10, 0.14, 2, false, true); //dissappear
        
        this.animations[6] = new Animator(this.spritesheet, 2, 2, 41, 64, 4, 0.2, 2, false, true); //idle
        this.animations[7] = new Animator(this.spritesheet, 2, 412, 68, 64, 4, 0.285, 2, false, true); //prepare slash
        this.animations[8] = new Animator(this.spritesheet, 2, 649, 86, 65, 7, 0.2, 2, false, false); //throw weapon
        this.animations[9] = new Animator(this.spritesheet, 721, 649, 67, 67, 8, 0.1, 2, false, true); //become weapon O_O // this.weaponSpin 
    }

    adjustSpritePosition(ctx, scale) {
        // this.adjustTime++;
        // if(this.adjustTime >= this.adjustDuration) {
        //     this.state++;
        //     this.adjustTime = 0;
        //     if(this.state == 6) this.state = 0;
        // }

        let direction = 1;
        if(this.facing) direction = -1;

        let disjointX = 0;
        let alignX = 0;
        let alignY = 0;
        switch(this.state) {
            case 0:
                disjointX = 18;
                alignX = -20;
                alignY = 0;
                break;
            case 1:
                disjointX = 15;
                alignX = -17;
                alignY = 0;
                break;
            case 2:
                disjointX = 18;
                alignX = -13;
                alignY = 0;
                break;
            case 3:
                disjointX = -40;
                alignX = 50;
                alignY = 0;
                break;
            case 4:
                disjointX = 9;
                alignX = 10;
                alignY = 50;
                break;
            case 5:
                disjointX = 0;
                alignX = 15;
                alignY = 50;
                break;
            case 6:
                disjointX = 20;
                alignX = 18;
                break;
            case 7:
                alignX - 15;
                break;
        }
        
        this.animations[this.state].drawFrame(this.game.clockTick, ctx, this.x - (disjointX * direction) - alignX - this.game.camera.x, this.y - alignY, scale, this.facing);
    }

    update() {
        const TICK = this.game.clockTick;
        let game = this.game;
        this.newState = this.currentState.update(game,TICK);

        // console.log("x " + this.x + "\ty " + this.y + "\nvel" + this.velocity.x + "\t" + this.velocity.y);
        // this.physics(TICK);
        this.collide();
        this.updateBB();

        //if it's a new state, switch to that state
        if(this.newState != this.state) {
            // console.log(newState.name);
            this.state = this.newState.name;
            this.currentState.onExit();
            delete this.currentState;
            this.currentState = this.newState;
            this.currentState.onEnter();
        }
    }

    draw(ctx) {
        this.adjustSpritePosition(ctx,1.5);
        this.BB.draw(ctx, this.game.camera);
    }

    updateBB() {
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.x + 50, this.y + 5, 42, 90, "specter");
    }

    collide() {
        let that = this;
        this.game.entities.forEach(function(entity) {
            if(entity.BB && entity.BB != that && that.BB.collide(entity.BB)) {
                if(entity.BB.name == "ground" && (that.lastBB.bottom) <= entity.BB.top) {//&& (that.lastBB.bot) <= entity.BB.top
                    // fix bug where "landing" on the side puts character on top
                    that.y = entity.BB.top - 90;
                    if(that.stateName == 4 || that.state == 3) {
                       
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

        this.idleDuration = 1.6;
        this.idleTime = 0;
    }
    
    onEnter() {

    }

    update(game,TICK) {
        this.idleTime+=TICK;
        if(this.idleTime >= this.idleDuration) {
            console.log("forward");
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
        this.forwardDuration = 1.6;
        this.forwardTime = 0;
    }
    
    onEnter() {

    }

    update(game,TICK) {
        this.forwardTime+=TICK;
        this.direction = 1;
        if(this.stateManager.facing) this.direction = -1;
        this.stateManager.x+=0.5 * this.direction;

        if(this.forwardTime >= this.forwardDuration) {
            return new SpecBossIdle(this.stateManager);
        }
        return this.name;
    }

    onExit() {

    }
}

