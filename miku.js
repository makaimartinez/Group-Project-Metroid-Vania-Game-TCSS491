class Miku {
    constructor(game, x, y, spritesheet) {
        Object.assign(this, { game, x, y, spritesheet});
        
        this.velocity = {x:0, y:0};

        this.facing = false; //facing true: left false: right
        this.currentState = new mikuIdle(this); 
        this.BB;
        this.lastBB;
        this.state = 0; //0 = idle, 1 = walk, 2 = run, 3= jump, 4= fall, 5= land, 6= attack, 7= dance, //8 = jumping
        this.newState;
        this.animations = [];
        this.loadAnimations();
    }

    loadAnimations() {
        for (let i = 0; i < 9; i++) { //9 total animations
            this.animations.push([]);
        }
        //spritesheet, xStart, yStart, width, height, frameCount, frameDuration, framePadding, reverse, loop
        this.animations[0] = new Animator(this.spritesheet, 0, 1, 59, 64, 10, 0.2, 0, false, true); //0 = idle
        this.animations[1] = new Animator(this.spritesheet, 2, 65, 75, 67, 8, 0.2, 2, false, true); //1 = walking
        this.animations[2] = new Animator(this.spritesheet, 2, 65, 75, 67, 8, 0.1, 2, false, true);//2 = running 
        this.animations[3] = new Animator(this.spritesheet, 1, 134, 74, 100, 6, 0.25, 4, false, true);//3= jump
        this.animations[4] = new Animator(this.spritesheet, 395, 134, 75, 100, 2, 0.23, 2.25, false, true);//4= falling 
        this.animations[5] = new Animator(this.spritesheet, 552, 134, 75, 100, 2, 0.325, 2.25, false, true);//5= landing 
        this.animations[6] = new Animator(this.spritesheet, 5, 236, 82, 65, 8, 0.2, 2.25, false, true);//6= attacking
        this.animations[7] = new Animator(this.spritesheet, 0, 432, 83.5, 64, 12, 0.25, 0.45, false, true);//7= dancing 
        this.animations[8] = new Animator(this.spritesheet, 1, 134, 74, 100, 9, 0.23, 4, false, true);//8 = jumping
        this.defeatAnim = new Animator(this.spritesheet, 0, 370, 86, 60, 3, 0.6, 0, false, true);
    }

    adjustSpritePosition(ctx, scale) {
        let direction = 1;
        if(this.facing) direction = -1;

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
                alignX = 15;
                break;
        }
        this.animations[this.state].drawFrame(this.game.clockTick, ctx, this.x - (disjointX * direction) - alignX, this.y - alignY, scale, this.facing);
    }

    update() {
        const TICK = this.game.clockTick;
        let game = this.game;
        this.newState = this.currentState.update(game,TICK);

        //if click, turn off click
        if(this.game.click) this.game.click = false;

        // console.log("x " + this.x + "\ty " + this.y + "\nvel" + this.velocity.x + "\t" + this.velocity.y);
        this.physics(TICK);
        this.updateLastBB();
        this.updateBB();
        this.collide();

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
        this.adjustSpritePosition(ctx, 1.5);
        ctx.strokeStyle = "rgb(225,40,133)";
        ctx.strokeRect(this.x + 25, this.y, 42, 86);
    }

    updateBB() {
        this.BB = new BoundingBox(this.x + 25, this.y, 42, 86);
    }

    updateLastBB() {
        this.lastBB = this.BB;
    }

    physics(TICK) {
        //falling
        this.velocity.y += 100 * TICK;

        this.y+= this.velocity.y * TICK * 2;
        this.x+= this.velocity.x * TICK * 2;

        if (this.velocity.x < 0) this.facing = true;
        if (this.velocity.x > 0) this.facing = false;
    }

    collide() {
        let that = this;
        this.game.entities.forEach(function(entity) {
            if(entity.BB && entity.BB != that && that.BB.collide(entity.BB)) {
                if(entity.BB.name == "ground") {//&& (that.lastBB.bot) <= entity.BB.top
                    // fix bug where "landing" on the side puts character on top
                    that.y = entity.BB.top - 86;
                    that.velocity.y = 0;
                    if(that.stateName == 4 || that.state == 3) {
                        that.newState = new mikuLand(that);
                    }
                }
            }
        })
    }
}

class mikuIdle {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.name = 0;
    }

    onEnter() {
        this.stateManager.velocity.x = 0;
        this.stateManager.velocity.y = 0;
    }
    
    update(game, TICK) {
        //check for left and right
        if(game.left || game.right) {
            let direction = 1;
            if(game.left) direction = -1;
            return new mikuWalk(this.stateManager, direction);
        }
        if(this.stateManager.velocity.y > 0) {
            // return fall
            return new mikuFall(this.stateManager);
        }
        if(game.up) {
            // return jump
            return new mikuJump(this.stateManager);
        }
        if(game.Z) {
            return new mikuDance(this.stateManager);
        }
        if(game.click) {
            // return attack
            return new mikuAttack(this.stateManager, this);
        }
        return this.name;
    }

    onExit() {

    }
}

class mikuWalk {
    constructor(stateManager, direction) {
        this.stateManager = stateManager;
        this.name = 1;

        this.direction = direction;
    }

    onEnter() {
        const ACC_WALK = 40;
        this.stateManager.velocity.x += this.direction * ACC_WALK;
    }

    update(game, TICK) {
        const MIN_WALK = 30;
        const MAX_WALK = 160;
        const ACC_WALK = 40;
        const DEC_SKID = 200;
        const DEC_REL = 70;

        let stateManager = this.stateManager;
        if(!stateManager.facing) {
            if (game.right && !game.left && !game.down) {
                stateManager.velocity.x += ACC_WALK * TICK;
            } else if (game.left && !game.right && !game.down) {
                stateManager.velocity.x -= DEC_SKID * TICK;
            } else {
                stateManager.velocity.x -= DEC_REL * TICK;
            }
        } else {
            if (game.left && !game.right && !game.down) {
                stateManager.velocity.x -= ACC_WALK * TICK;
            } else if (game.right && !game.left && !game.down) {
                stateManager.velocity.x += DEC_SKID * TICK;
            } else {
                stateManager.velocity.x += DEC_REL * TICK;
            }
        }

        if (stateManager.velocity.x >= MAX_WALK) stateManager.velocity.x = MAX_WALK;
        if (stateManager.velocity.x <= -1 * MAX_WALK) stateManager.velocity.x = -MAX_WALK;

        // condition to leave
        if(Math.abs(stateManager.velocity.x) <= MIN_WALK) {
            return new mikuIdle(stateManager);
        }
        if(game.up) {
            // return "jump";
            return new mikuJump(this.stateManager);
        }
        if(game.click) {
            // return attack
            return new mikuAttack(this.stateManager, this);
        }
        if(this.stateManager.velocity.y > 0) {
            // return "fall";
            return new mikuFall(this.stateManager);
        }

        return this.name;
    }

    onExit() {

    }
}

class mikuRun {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.name = 2;
    }

    onEnter() {
        
    }

    update(game, TICK) {

    }
    
    onExit() {

    }
}

class mikuJump {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.name = 3;
    }

    onEnter() {
        this.stateManager.velocity.y = -80;
    }

    update(game, TICK) {
        //air physics
        const MAX_WALK = 160;
        const ACC_WALK = 40;

        let stateManager = this.stateManager;
        // horizontal physics
        if (game.right && !game.left) {
            if (Math.abs(stateManager.velocity.x) > MAX_WALK) {
                stateManager.velocity.x += ACC_RUN * TICK;
            } else stateManager.velocity.x += ACC_WALK * TICK;
        } else if (game.left && !game.right) {
            if (Math.abs(stateManager.velocity.x) > MAX_WALK) {
                stateManager.velocity.x -= ACC_RUN * TICK;
            } else stateManager.velocity.x -= ACC_WALK * TICK;
        } else {
            // do nothing
        }

        // condition to leave
        if(stateManager.velocity.y > 0) {
            return new mikuFall(stateManager);
        }
        if(Math.abs(stateManager.velocity.y) == 0) {
            return new mikuIdle(stateManager);
        }

        return this.name;
    }
    
    onExit() {

    }
}

class mikuFall {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.name = 4;
    }

    onEnter() {
        // this.stateManager.velocity.x *=0.5;
    }

    update(game, TICK) {
        
        //air physics
        const MAX_WALK = 160;
        const ACC_WALK = 40;

        let stateManager = this.stateManager;
        // horizontal physics
        if (game.right && !game.left) {
            if (Math.abs(stateManager.velocity.x) > MAX_WALK) {
                stateManager.velocity.x += ACC_RUN * TICK;
            } else stateManager.velocity.x += ACC_WALK * TICK;
        } else if (game.left && !game.right) {
            if (Math.abs(stateManager.velocity.x) > MAX_WALK) {
                stateManager.velocity.x -= ACC_RUN * TICK;
            } else stateManager.velocity.x -= ACC_WALK * TICK;
        } else {
            // do nothing
        }

        // if (stateManager.velocity.x >= MAX_WALK) stateManager.velocity.x = MAX_WALK;
        // if (stateManager.velocity.x <= -1 * MAX_WALK) stateManager.velocity.x = -MAX_WALK;

        // condition to leave
        if(Math.abs(stateManager.velocity.y) == 0) {
            return new mikuLand(stateManager);
        }

        return this.name;
    }

    onExit() {
        
    }
}

class mikuLand {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.name = 5;

        this.landingDuration = 0.65;
        this.landingTime = 0;
    }

    onEnter() {
        this.stateManager.velocity.x = 0;
    }

    update(game, TICK) {
        // console.log("landing " + this.landingTime);
        this.landingTime+=TICK;

        if(game.left || game.right) {
            // let direction = 1;
            // if(game.left) direction = -1;
            // return new mikuWalk(this.stateManager, direction);
            this.landingTime+=2;
        }

        //condition to leave
        if(this.landingTime > this.landingDuration) {
            return new mikuIdle(this.stateManager);
        }
        return this.name;
    }
    
    onExit() {

    }
}

class mikuAttack {
    constructor(stateManager, calledState) {
        this.stateManager = stateManager;
        this.calledState = calledState;
        this.name = 6;
        this.attackDuration = 1.6;
        this.attackTime = 0;

        this.direction = 1;
    }

    onEnter() {
        
        if(this.stateManager.facing) {
            this.direction = -1;
        }

        const ACC_WALK = 40;
        // this.stateManager.velocity.x += this.direction * ACC_WALK;
        // this.stateManager.velocity.x /= 2;
    }

    update(game, TICK) {
        this.attackTime+=TICK;

        const MIN_WALK = 30;
        const MAX_WALK = 160;
        const ACC_WALK = 40;
        const DEC_SKID = 200;
        const DEC_REL = 70;

        let stateManager = this.stateManager;
        if(this.calledState instanceof mikuWalk) {
            if(!stateManager.facing) {
                if (game.right && !game.left && !game.down) {
                    stateManager.velocity.x += ACC_WALK * TICK;
                } else if (game.left && !game.right && !game.down) {
                    stateManager.velocity.x -= DEC_SKID * TICK;
                } else {
                    stateManager.velocity.x -= DEC_REL * TICK;
                }
            } else {
                if (game.left && !game.right && !game.down) {
                    stateManager.velocity.x -= ACC_WALK * TICK;
                } else if (game.right && !game.left && !game.down) {
                    stateManager.velocity.x += DEC_SKID * TICK;
                } else {
                    stateManager.velocity.x += DEC_REL * TICK;
                }
            }
            if(Math.abs(this.stateManager.velocity.x) < 1) {
                this.calledState = new mikuIdle();
            } 
        }

        if(this.attackTime > this.attackDuration) {
            // console.log(this.calledState);
            // return this.calledState;
            return new mikuIdle(this.stateManager);
        }
        if(this.stateManager.velocity.y > 0) {
            // return "fall";
            return new mikuFall(this.stateManager);
        }
        return this.name;
    }
    
    onExit() {
        this.stateManager.game.click = false;
    }
}

class mikuDance {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.name = 7;
        this.danceDuration = 3;
        this.danceTime = 0;
    }

    onEnter() {

    }

    update(game, TICK) {
        this.danceTime+=TICK;

        if(this.danceTime >= this.danceDuration) {
            this.danceTime = 0;
            console.log("exit");
            return new mikuIdle(this.stateManager);
        }

        return this.name;
    }
    
    onExit() {

    }
}