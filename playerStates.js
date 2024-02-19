class Player {
    constructor(game, x, y, spritesheet) {
        Object.assign(this, { game, x, y, spritesheet});
        
        this.velocity = {x:0, y:0};
        this.health = 5;
        this.scale = 3;
        this.dead = false;
        this.facing = false; //facing true: left false: right
        this.currentState = new playerIdle(this); 
        this.BB = new BoundingBox(this.x, this.y, 42, 86, "player");
        this.lastBB;
        this.dmgBB;
        this.state = 0; //0 = idle, 1 = walk, 2 = run, 3= jump, 4= fall, 5= land, 6= attackDown, 7= attackUp, 8 = hurt, 9 = defeat
        this.newState;
        this.animations = [];
        this.loadAnimations();
        this.updateBB();
        this.updateLastBB();
    }

    loadAnimations() {

        for (let i = 0; i < 10; i++) { //9 total animations
            this.animations.push([]);
        }
        //spritesheet, xStart, yStart, width, height, frameCount, frameDuration, framePadding, reverse, loop
        this.animations[0] = new Animator(this.spritesheet, 0 + 22 * 4 + 1, 283, 21, 32, 2, 0.6, 1, false, true); //0 = idle
        this.animations[1] = new Animator(this.spritesheet, 0, 0, 20, 32, 6, 0.2, 2, false, true); //1 = walking
        this.animations[2] = new Animator(this.spritesheet, 0, 34, 28, 36, 6, 0.15, 2, false, true);//2 = running
        this.animations[3] = new Animator(this.spritesheet, 0, 216, 23, 35, 3, 0.5, 2, false, true);//3= jump
        this.animations[4] = new Animator(this.spritesheet, 5 + 2 * 23, 216, 23, 35, 1, 0.15, 2, false, true);//4= falling 
        this.animations[5] = new Animator(this.spritesheet, 5 + 2 * 23, 216, 23, 35, 3, 0.15, 2, false, true);//5= landing 
        this.animations[6] = new Animator(this.spritesheet, 0, 71, 62, 40, 5, 0.16, 0, false, true)//6= attacking //down cut
        this.animations[7] = new Animator(this.spritesheet, 0, 112, 64, 40, 6, 0.16, 0, false, true);//7= attacking //up cit
        this.animations[8] = new Animator(this.spritesheet, 0, 252, 22, 30, 3, 0.2, 2, false, true);//8= hurt
        this.animations[9] = new Animator(this.spritesheet, 0, 144, 45, 41, 5, 0.35, 2, false, true); //defeat
        this.animations[10] = new Animator(this.spritesheet, (45 + 2) * 4, 144, 45, 41, 1, 0.5, 2, false, true); //very very dead
    }

    adjustSpritePosition(ctx, scale) {
        // this.state = 6;
        let direction = 1;
        if(this.facing) direction = -1;

        let disjointX = 0;
        let alignX = 0;
        let alignY = 0;
        switch(this.state) {
            case 0:
                disjointX = -2;
                alignX = 10;
                alignY = 5;
                break;
            case 1:
                disjointX = 5;
                alignX = 8;
                alignY = 8;
                break;
            case 2:
                disjointX = -5;
                alignX = 20;
                alignY = 15;
                break;
            case 3:
            case 4:
            case 5:
                disjointX = 5;
                alignX = 10;
                alignY = 12;
                break;
            case 6:
                disjointX = 0;
                alignX = 72;
                alignY = 30;
                break;
            case 7:
                disjointX = -20;
                alignX = 75;
                alignY = 5;
                break;
            case 8:
                disjointX = 5;
                alignX = 15;
                // alignY = -10;
                break;
            case 9:
            case 10:
                alignX = 40;
                alignY = 35;
                break;
        }
        this.animations[this.state].drawFrame(this.game.clockTick, ctx, this.x - (disjointX * direction) - alignX - this.game.camera.x, this.y - alignY, scale, this.facing);
        // this.animations[this.state].drawFrame(this.game.clockTick, ctx, this.x - (disjointX * -1) - alignX, this.y - alignY, scale, true);
        // this.animations[this.state].drawFrame(this.game.clockTick, ctx, this.x - (disjointX * 1) - alignX, this.y - alignY - 100, scale, false);

        if(PARAMS.DEBUG && this.state == 6 && this.animations[this.state].currentFrame() == 3) {    
            ctx.strokeRect(this.x - 50 - this.game.camera.x, this.y - 20, 180, 105);
        }
    }

    updateloop() {
        const TICK = this.game.clockTick;
        let game = this.game;
        this.newState = this.currentState.update(game,TICK);

        //if click, turn off click
        // if(this.game.click && !this.game.titleActive) this.game.click = false;
        if(this.game.click) this.game.click = false;        

        // console.log("x " + this.x + "\ty " + this.y + "\nvel" + this.velocity.x + "\t" + this.velocity.y);
        this.physics(TICK);        
        this.updateLastBB();
        this.updateBB();
        
        this.collide();
        this.updateLastBB();
        this.updateBB();

        //if it's a new state, switch to that state
        if(this.newState != this.state) {
            // console.log(newState.name);
            this.state = this.newState.name;
            this.currentState.onExit();
            // delete this.currentState;
            this.currentState = this.newState;
            this.currentState.onEnter();
        }
    }
    
    update() {
        if(this.state != 10) this.updateloop();
        //if outside screen the screen or if dead, trigger death screen
    }

    draw(ctx) {
        this.adjustSpritePosition(ctx, this.scale);
        if(PARAMS.DEBUG) {
            this.BB.draw(ctx, this.game.camera);
            ctx.font = "15px serif";
            ctx.fillStyle = "Black";
            ctx.textAlign = "right";
            ctx.fillText("HP " + this.health, this.x + 30 - this.game.camera.x, this.y + 0);
            // ctx.beginPath();
            // ctx.arc(this.x + 20 + 21, this.y + 5 + 43, 200, 0, 2 * Math.PI);
            // ctx.stroke();
            // ctx.strokeRect(this.x + 20, this.y + 10 - 100, 42, 86);
        }   
    }

    updateBB() {
        // this.BB = new BoundingBox(this.x + 20, this.y + 10, 42, 86, "player");
        this.BB = new BoundingBox(this.x, this.y, 42, 86, "player");
        // this.BB = new BoundingBox(this.x, this.y, 21 * this.scale, 32 * this.scale, "player");
    }

    updateLastBB() {
        this.lastBB = this.BB;
    }

    physics(TICK) {
        //falling
        this.velocity.y += 100 * TICK;

        this.y+= this.velocity.y * TICK * 2;
        this.x+= this.velocity.x * TICK * 2;
    }

    collide() {
        let that = this;
        this.game.entities.forEach(function(entity) {
            if(entity.BB && entity != that && that.BB.collide(entity.BB)) {
                if(entity.BB.name == "ground" && (that.lastBB.bottom) <= entity.BB.top)  {
                    // console.log(" lastBB " + that.lastBB.bottom + " entity top " + entity.BB.top)
                    // that.y = entity.BB.top - that.BB.height //-10;//that.BB.top;
                    // console.log("y " + that.y + " combined " + (entity.BB.top - that.BB.height));
                    console.log(that.lastBB.bottom + " " + entity.BB.top)
                    that.y = entity.BB.top - that.BB.height; //that.BB.top;
                    // that.x = entity.BB.left - that.BB.width;
                    // that.y = entity.BB.top + that.BB.height;

                    that.velocity.y = 0;
                    if(that.stateName == 4 || that.state == 3) {
                        // console.log(that.y + " " + entity.BB.top)
                        that.newState = new playerLand(that);
                    }
                }
                if(entity.BB.name == "slime" || entity.BB.name == "specter" || entity.BB.name == "skelly") {
                    if(!entity.dead){
                        if(that.state != 8 && that.state != 9) that.newState = new playerHurt(that, entity);
                    }
                }
                if(entity.BB.name == "healthpotion") {
                    // increase player health (permanent)
                    that.health += 50;
                }
                if(entity.BB.name == "speedpotion") {
                    // increase player speed (temporarily)
                    // this.elapsed += this.game.clockTick;
                    //    if (this.elapsed > 100) ...
    
                }
            }
            // if(that.dmgBB && entity.BB && entity.BB.name == "skelly")
            // console.log(that.dmgBB.name + " " + entity.BB.name + " " + that.dmgBB.collide(entity.BB))
            if(that.dmgBB && entity.BB && entity.BB != that && that.dmgBB.collide(entity.BB)) {
                if(entity.BB.name == "slime" || entity.BB.name == "specter" || entity.BB.name == "skelly") {
                    entity.hit();
                    // if(that.state != 8) that.newState = new playerHurt(that, entity);
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
        // this.stateManager.velocity.y = 0;
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
        // console.log("velx " + this.stateManager.velocity.x);
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

        this.duration = this.stateManager.animations[this.name].totalTime; //measured in seconds
        this.elaspedTime = 0;
    }

    onEnter() {
        this.stateManager.velocity.x = 0;
    }

    update(game, TICK) {
        // console.log("landing " + this.elaspedTime);
        this.elaspedTime+=TICK;

        if(game.left || game.right) {
            // let direction = 1;
            // if(game.left) direction = -1;
            // return new playerWalk(this.stateManager, direction);
            this.elaspedTime+=0.1;
        }

        //condition to leave
        if(this.elaspedTime > this.duration) {
            return new playerIdle(this.stateManager);
        }
        return this.name;
    }
    
    onExit() {

    }
}

class playerAttackDown {
    constructor(stateManager, calledState) {
        this.stateManager = stateManager;
        this.calledState = calledState;
        this.name = 6;
        this.duration = this.stateManager.animations[this.name].totalTime; //measured in seconds
        this.elaspedTime = 0;
        this.direction = 1;
    }

    onEnter() {
        this.stateManager.velocity.x =0;
        if(this.stateManager.facing) {//facing left
            this.direction = -1;
        } 
    }

    update(game,TICK) {
        this.elaspedTime+=TICK;
        if(this.stateManager.animations[this.name].currentFrame() == 3) {
            let x = this.stateManager.x;
            let y = this.stateManager.y    
            this.stateManager.dmgBB = new BoundingBox(x - 50, y - 15, 180, 105, "player attack down");
        } else {
            this.stateManager.dmgBB = null;
        }

        if(this.elaspedTime >= this.duration) {
            // return this.calledState;
            return new playerIdle(this.stateManager);
        }
        if(game.click) {
            // return attack
            // return new playerAttackUp(this.stateManager, this);
        }
        return this.name;
    }

    onExit() {
        this.stateManager.velocity.x = 0;
    }
}

class playerAttackUp {

}

class playerHurt {
    constructor(stateManager, dmgSource) {
        this.stateManager = stateManager;
        this.dmgSource = dmgSource;
        this.name = 8;
        this.duration = this.stateManager.animations[this.name].totalTime; //measured in seconds
        this.elaspedTime = 0;
    }

    onEnter() {
        this.stateManager.health -=1;
        if(this.stateManager.health > 0) {
            let dmgDirection = this.dmgSource.BB.center.x < this.stateManager.x;
            // console.log(dmgDirection);
            if(dmgDirection) {
            this.stateManager.velocity.x = 50;
        } else {
            this.stateManager.velocity.x = -50;
        }
        }
    }

    update(game,TICK) {
        this.elaspedTime+=TICK;
        if(this.elaspedTime >= this.duration) {
            return new playerIdle(this.stateManager);
        }
        if(this.stateManager.health <= 0) {
            return new playerDeath(this.stateManager,this.dmgSource);
        }
        return this.name;
    }

    onExit() {

    }
}

class playerDeath {
    constructor(stateManager, dmgSource) {
        this.stateManager = stateManager;
        this.dmgSource = dmgSource;
        this.name = 9;
        this.duration = this.stateManager.animations[this.name].totalTime -0.1; //measured in seconds
        this.elaspedTime = 0;
        this.lastElasped = 0;
    }

    onEnter() {
        let dmgDirection = this.dmgSource.BB.center.x < this.stateManager.x;
        // console.log(dmgDirection);
        if(dmgDirection) {
            this.stateManager.velocity.x = 20;
        } else {
            this.stateManager.velocity.x = -20;
        }
    }

    update(game,TICK) {
        this.elaspedTime+=TICK;
        if(this.elaspedTime - this.lastElasped >= 0.5) {
            this.stateManager.velocity.x /=2;
        }
        if(this.elaspedTime >= this.duration) {
            return new playerIdle(this.stateManager);
        }
        return this.name;
    }

    onExit() {
        this.stateManager.state = 10;
        this.stateManager.dead = true;
    }
}