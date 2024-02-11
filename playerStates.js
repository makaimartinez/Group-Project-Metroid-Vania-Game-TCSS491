class Player {
    constructor(game, x, y, spritesheet) {
        Object.assign(this, { game, x, y, spritesheet});
        
        this.velocity = {x:0, y:0};

        this.facing = false; //facing true: left false: right
        this.currentState = new playerIdle(this); 
        this.BB;
        this.lastBB;
        this.state = 0; //0 = idle, 1 = walk, 2 = run, 3= jump, 4= fall, 5= land, 6= attackDown, 7= attackUp, 8 = hurt, 9 = defeat
        this.newState;
        this.animations = [];
        this.loadAnimations();
    }

    loadAnimations() {
        for (let i = 0; i < 10; i++) { //9 total animations
            this.animations.push([]);
        }
        //spritesheet, xStart, yStart, width, height, frameCount, frameDuration, framePadding, reverse, loop
        this.animations[0] = new Animator(this.spritesheet, 0 + 22 * 4 + 1, 283, 21, 32, 2, 0.6, 1, false, true); //0 = idle
        this.animations[1] = new Animator(this.spritesheet, 0, 0, 20, 32, 6, 0.25, 2, false, true); //1 = walking
        this.animations[2] = new Animator(this.spritesheet, 0, 34, 28, 36, 6, 0.4, 2, false, true);//2 = running
        this.animations[3] = new Animator(this.spritesheet, 0, 216, 23, 35, 3, 0.9, 2, false, true);//3= jump
        this.animations[4] = new Animator(this.spritesheet, 5 + 2 * 23, 216, 23, 35, 1, 0.4, 2, false, true);//4= falling 
        this.animations[5] = new Animator(this.spritesheet, 5 + 2 * 23, 216, 23, 35, 3, 0.4, 2, false, true);//5= landing 
        this.animations[6] = new Animator(this.spritesheet, 0, 71, 62, 40, 5, 0.25, 0, false, true)//6= attacking //down cut
        this.animations[7] = new Animator(this.spritesheet, 0, 112, 64, 40, 6, 0.25, 0, false, true);//7= attacking //up cit
        this.animations[8] = new Animator(this.spritesheet, 0, 252, 22, 30, 3, 0.4, 2, false, true);//8= hurt
        this.animations[9] = new Animator(this.spritesheet, 0, 144, 45, 41, 5, 0.5, 2, false, true); //defeat
    }

    adjustSpritePosition(ctx, scale) {
        // this.state = 8;
        let direction = 1;
        if(this.facing) direction = -1;

        let disjointX = 0;
        let alignX = 0;
        let alignY = 0;
        switch(this.state) {
            case 0:
                disjointX = -1;
                alignX = -10;
                alignY = -8;
                break;
            case 1:
                disjointX = 4;
                alignX = -10;
                alignY = -5;
                break;
            case 2:
                disjointX = -4;
                alignX = -2;
                alignY = 5;
                break;
            case 3:
            case 4:
            case 5:
                disjointX = 2;
                alignX = -8;
                alignY = -2;
                break;
            case 6:
                disjointX = 3;
                alignX = 51;
                alignY = 15;
                break;
            case 7:
                disjointX = -16;
                alignX = 54;
                alignY = -10;
                break;
            case 8:
                disjointX = 0;
                alignX = -8;
                alignY = -10;
                break;
            case 9:
                disjointX = 5;
                alignX = 25;
                alignY = 20;
                break;
        }
        this.animations[this.state].drawFrame(this.game.clockTick, ctx, this.x - (disjointX * direction) - alignX, this.y - alignY, scale, this.facing);
        // this.animations[this.state].drawFrame(this.game.clockTick, ctx, this.x - (disjointX * -1) - alignX, this.y - alignY, scale, true);
        // this.animations[this.state].drawFrame(this.game.clockTick, ctx, this.x - (disjointX * 1) - alignX, this.y - alignY - 100, scale, false);
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
        this.adjustSpritePosition(ctx, 3);
        ctx.strokeRect(this.x + 20, this.y + 10, 42, 86);
        ctx.beginPath();
        ctx.arc(this.x + 20 + 21, this.y + 5 + 43, 200, 0, 2 * Math.PI);
        ctx.stroke();
        // ctx.strokeRect(this.x + 20, this.y + 10 - 100, 42, 86);   
    }
    updateBB() {
        this.BB = new BoundingBox(this.x + 20, this.y + 10, 42, 86, "player");
    }
    updateLastBB() {
        this.lastBB = this.BB;
    }

    physics(TICK) {
        //falling
        this.velocity.y += 100 * TICK;

        this.y+= this.velocity.y * TICK * 2;
        this.x+= this.velocity.x * TICK * 2;

        // if (this.velocity.x < 0) this.facing = true;
        // if (this.velocity.x > 0) this.facing = false;
    }

    collide() {
        let that = this;
        this.game.entities.forEach(function(entity) {
            // if(entity.BB.name == "slime") console.log("slime")
            if(entity.BB && entity.BB != that && that.BB.collide(entity.BB)) {
                if(entity.BB.name == "ground")  {//&& (that.lastBB.bottom) <= entity.BB.top)
                    // fix bug where "landing" on the side puts character on top
                    // console.log(that.lastBB.bottom + " " + entity.BB.top)
                    that.y = entity.BB.top - 96;
                    that.velocity.y = 0;
                    if(that.stateName == 4 || that.state == 3) {
                        console.log(that.y + " " + entity.BB.top)
                        that.newState = new playerLand(that);
                    }
                }
                if(entity.BB.name == "slime" || entity.BB.name == "specter") {
                    // console.log("hurt");
                    if(that.state != 8) that.newState = new playerHurt(that, entity);
                }
                if(entity.BB.name == "healthpotion") {
                    console.log("healthpotion");
                    // increase player health (permanent)
                }
                if(entity.BB.name == "speedpotion") {
                    console.log("speedpotion");
                    // increase player speed (temporarily)
                    // setInterval(function, milliseconds)
                }
            }
        })
    }
    
}

class playerIdle {
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
            return new playerWalk(this.stateManager, direction);
        }
        if(this.stateManager.velocity.y > 0) {
            // return fall
            return new playerFall(this.stateManager);
        }
        if(game.up) {
            // return jump
            return new playerJump(this.stateManager);
        }
        if(game.Z) {
            // return new playerDance(this.stateManager);
        }
        if(game.click) {
            // return attack
            return new playerAttackDown(this.stateManager, this);
        }
        return this.name;
    }

    onExit() {

    }
}

class playerWalk {
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

        if (stateManager.velocity.x < 0) stateManager.facing = true;
        if (stateManager.velocity.x > 0) stateManager.facing = false;

        // condition to leave
        if(Math.abs(stateManager.velocity.x) <= MIN_WALK) {
            return new playerIdle(stateManager);
        }
        if(game.up) {
            // return "jump";
            return new playerJump(this.stateManager);
        }
        if(game.click) {
            // return attack
            return new playerAttackDown(this.stateManager, this);
        }
        if(this.stateManager.velocity.y > 0) {
            // return "fall";
            return new playerFall(this.stateManager);
        }

        return this.name;
    }

    onExit() {

    }
}

class playerRun {

}

class playerJump {
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
            return new playerFall(stateManager);
        }
        if(Math.abs(stateManager.velocity.y) == 0) {
            return new playerIdle(stateManager);
        }

        return this.name;
    }
    
    onExit() {

    }
}

class playerFall {
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
        const ACC_RUN = 60;

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
            return new playerLand(stateManager);
        }

        return this.name;
    }

    onExit() {
        
    }
}

class playerLand {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.name = 5;

        this.landingDuration = 15;
        this.landingTime = 0;
    }

    onEnter() {
        this.stateManager.velocity.x = 0;
    }

    update(game, TICK) {
        // console.log("landing " + this.landingTime);
        this.landingTime++;

        if(game.left || game.right) {
            // let direction = 1;
            // if(game.left) direction = -1;
            // return new playerWalk(this.stateManager, direction);
            this.landingTime+=2;
        }

        //condition to leave
        if(this.landingTime > this.landingDuration) {
            return new playerIdle(this.stateManager);
        }
        return this.name;
    }
    
    onExit() {

    }
}

class playerAttackDown {
    constructor(statemanager, calledState) {
        this.statemanager = statemanager;
        this.calledState = calledState;
        this.name = 6;
        this.duration = 205;
        this.time = 0;
        this.direction = 1;
    }

    onEnter() {
        this.statemanager.velocity.x =0;
        if(this.statemanager.facing) {//facing left
            this.direction = -1;
        }
        // if(Math.abs(this.statemanager.velocity.x) > 0) this.statemanager.velocity.x +=5 * -1 * this.direction; 
    }

    update(game) {
        this.time++;    

        // console.log(this.time);
        if(this.time >= this.duration) {
            // return this.calledState;
            return new playerIdle(this.statemanager);
        }
        if(game.click) {
            // return attack
            // return new playerAttackUp(this.stateManager, this);
        }
        return this.name;
    }

    onExit() {
        this.statemanager.velocity.x = 0;
    }
}

class playerAttackUp {

}

class playerHurt {
    constructor(statemanager, dmgSource) {
        this.statemanager = statemanager;
        this.dmgSource = dmgSource;
        this.name = 8;
        this.duration = 180;
        this.time = 0;
    }

    onEnter() {
        let dmgDirection = this.dmgSource.BB.center.x < this.statemanager.x;
        // console.log(dmgDirection);
        if(dmgDirection) {
            this.statemanager.velocity.x = 50;
        } else {
            this.statemanager.velocity.x = -50;
        }
    }

    update() {
        this.time++;
        if(this.time >= this.duration) {
            return new playerIdle(this.statemanager);
        }
        return this.name;
    }

    onExit() {

    }
}