class Miku2 {
    constructor(game, x, y, spritesheet) {
        Object.assign(this, { game, x, y, spritesheet});
        
        this.velocity = {x:0, y:0};

        // this.facing = false; //facing true: left false: right
        // this.state = 0; //0 = idle, 1 = walking, 2 = running, 3= jump, 4= falling, 5= landing, 6= attacking, 7= dancing, 8 = jumping
        
        this.currentState = new mikuIdle(this); 
        this.stateName = "idle";

        const MIN_WALK = 30;
        const MAX_WALK = 160;
        const ACC_WALK = 40;
        const DEC_SKID = 200;
        const DEC_REL = 70;
        
        this.fall_acc = 100;
        const MIN_FALL = 20;
        const MAX_FALL = 100;

        // this.defeat = false;
        // this.flickerflag = true; //when hurt
        //defeat
        // this.fall_acc = 30;
        
        // this.animations = [];
        // this.elaspedTime = 0;
        // this.elaspedTimeFlicker = 0;
        //loop length
        // this.loadAnimations();
        // this.currentAnimation = this.idle;
    }

    loadAnimations() {
        for (let i = 0; i < 9; i++) { //9 total animations
            this.animations.push([]);
        }
        //spritesheet, xStart, yStart, width, height, frameCount, frameDuration, framePadding, reverse, loop
        this.animations[0] = new Animator(this.spritesheet, 0, 1, 59, 64, 10, 0.2, 0, false, true); //0 = idle
        this.animations[1] = new Animator(this.spritesheet, 2, 65, 75, 67, 8, 0.2, 2, false, true); //1 = walking
        this.animations[2] = new Animator(this.spritesheet, 2, 65, 75, 67, 8, 0.1, 2, false, true);//2 = running 
        this.animations[3] = new Animator(this.spritesheet, 1, 134, 74, 100, 6, 0.23, 4, false, true);//3= jump
        this.animations[4] = new Animator(this.spritesheet, 395, 134, 75, 100, 2, 0.23, 2.25, false, true);//4= falling 
        this.animations[5] = new Animator(this.spritesheet, 552, 134, 75, 100, 2, 0.23, 2.25, false, true);//5= landing 
        this.animations[6] = new Animator(this.spritesheet, 5, 236, 82, 65, 8, 0.2, 2.25, false, true);//6= attacking
        this.animations[7] = new Animator(this.spritesheet, 0, 432, 83.5, 64, 12, 0.25, 0.45, false, true);//7= dancing 
        this.animations[8] = new Animator(this.spritesheet, 1, 134, 74, 100, 9, 0.23, 4, false, true);//8 = jumping
        this.defeatAnim = new Animator(this.spritesheet, 0, 370, 86, 60, 3, 0.6, 0, false, true);
    }

    adjustSpritePosition(ctx, scale) {
        let facing = 1;
        if(this.facing) facing = -1;

        let disjointX = 0;
        let alignX = 0;
        let alignY = 0;
        switch(this.state) {
            case 0:
                disjointX = 3;
                break;
            case 1:
            case 2:
                disjointX = 25;
                alignX = 13;
                alignY = 3;
                break;
            case 3:
                disjointX = 17;
                alignX = 12;
                alignY = 50;
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
        this.animations[this.state].drawFrame(this.game.clockTick, ctx, this.x - (disjointX * facing) - alignX, this.y - alignY, scale, this.facing);
    }

    update(){
        const TICK = this.game.clockTick;
        let game = this.game;
        let newState;
        if(this.stateName != "idle") {
            newState = this.currentState.update(TICK,game);
        } else {
            newState = this.currentState.update();
        }

        //if it's a new state, switch to that state
        if(newState != this.stateName) {
            console.log(newState.name);
            this.stateName = newState.name;
            delete this.currentState;
            this.currentState = newState;
        }
        console.log("x " + this.x + "\ty " + this.y + "\nvel" + this.velocity.x + "\t" + this.velocity.y);

        this.y+= this.velocity.y * TICK * 2;
        this.x+= this.velocity.x * TICK * 2;
    }

    draw(ctx) {
        // this.adjustSpritePosition(ctx, 1.5);
        ctx.strokeStyle = "rgb(225,40,133)";
        ctx.strokeRect(this.x + 25, this.y + 5, 42, 86);
    }
}

class mikuIdle {
    constructor(mainMiku) {
        this.mainMiku = mainMiku;
        this.name = "idle";

        //on enter
        this.mainMiku.velocity.x = 0;
        this.mainMiku.velocity.y = 0;
    }

    update() {
        //check for left and right
        let mainMiku = this.mainMiku;
        if(mainMiku.game.left || mainMiku.game.right) {
            let direction = 1;
            if(mainMiku.game.left) direction = -1;
            // console.log(mainMiku)
            return new mikuWalk(mainMiku, direction);
        }
        return "idle";
    }

    draw(ctx) {

    }
}

class mikuWalk {
    constructor(mainMiku, direction) {
        this.mainMiku = mainMiku;
        this.name = "walk";
        this.mainMiku.velocity.x += direction * 5;
    }

    update(TICK, game) {
        mainMiku = this.mainMiku;
        // if (game.right && !game.left && !game.down) {
        //     mainMiku.velocity.x += 1;
        // } else if (game.left && !game.right && !game.down) {
        //     mainMiku.velocity.x -= 1;
        // } else {
        //     mainMiku.velocity.x -= 1;
        // }

        // if (game.left && !game.right && !game.down) {
        //     mainMiku.velocity.x -= 1;
        // } else if (game.right && !game.left && !game.down) {
        //     mainMiku.velocity.x += 1;
        // } else {
        //     mainMiku.velocity.x += 1;
        // }

        // if (mainMiku.velocity.x >= mainMiku.MAX_WALK) mainMiku.velocity.x = mainMiku.MAX_WALK;
        // if (mainMiku.velocity.x <= -1 * mainMiku.MAX_WALK) mainMiku.velocity.x = -mainMiku.MAX_WALK;

        //condition to leave
        if(Math.abs(mainMiku.velocity.x) <= 10) {
            console.log("idle");
            // return new mikuIdle(mainMiku);
        }
        return "walk";
    }
}

class mikuFall {
    constructor(mainMiku) {
        this.mainMiku = mainMiku;
        this.name = "fall";
    }

    update() {

    }
}