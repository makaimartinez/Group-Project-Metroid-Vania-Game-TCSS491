class Player {
    constructor(game, x, y, spritesheet) {
        Object.assign(this, { game, x, y, spritesheet});
        
        this.velocity = {x:0, y:0};
        this.JUMPVELOCITY = -120;
        this.MIN_WALK = 30;
        this.MAX_WALK = 100;
        this.MAX_RUN = 130;
        this.ACC_WALK = 50;
        this.ACC_RUN = 60;
        this.DEC_SKID = 200;
        this.DEC_REL = 120;

        this.overchargeHealth = 20;
        this.maxHealth = 10;
        this.health = 5;
        this.scale = 3;
        this.dead = false;
        this.respawn = false;
        this.facing = false; //facing true: left false: right
        this.currentState = new playerIdle(this); 
        this.radius = 60;
        this.BB = new BoundingBox(this.x, this.y, 42, 86, "player");
        this.lastBB;
        this.dmgBB;
        this.state = this.currentState.name; //0 = idle, 1 = walk, 2 = run, 3= jump, 4= fall, 5= land, 6= attackDown, 7= attackUp, 8 = hurt, 9 = defeat
        this.newState;
        this.animations = [];

        //speed potion
        this.speedEnable = false;
        this.speedDuration = 4;
        this.speedCountup = 0;
        this.speedVal = 1.5;

        this.loadAnimations();
        this.updateBB();
        this.updateLastBB();
        
        this.elaspedDeadTime = 0;
        this.deadDuration = 5;
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
        // this.animations[6] = new Animator(this.spritesheet, 0 + 62 * 3, 71, 62, 40, 1, 0.16, 0, false, true)//6= attacking //down cut
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
            ctx.strokeRect(this.x - 70 - this.game.camera.x, this.y - 30, 180, 105);
        }
    }

    updateloop() {
        const TICK = this.game.clockTick;
        let game = this.game;
        this.newState = this.currentState.update(game,TICK);

        //if click, turn off click
        if(this.game.leftclick) this.game.leftclick = false;
        // if(this.game.leftclick && !this.game.titleActive) this.game.leftclick = false;        

        console.log(this.speedEnable)
        if (this.speedEnable) {
            this.updateCooldown(TICK);
        }

        // console.log("x " + this.x + "\ty " + this.y + "\nvel" + this.velocity.x + "\t" + this.velocity.y);
        this.physics(TICK);        
        this.updateLastBB();
        this.updateBB();
        
        this.collide(game);
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
        if(this.state != 10 && !this.dead) this.updateloop();
         //if outside the screen or if dead, trigger death screen
         if(this.y > 640 + 50) this.dead = true;
         if(this.dead)  { //then talk to scenemanager
            this.elaspedDeadTime+=this.game.TICK;
            if(this.elaspedDeadTime >= this.deadDuration) {
                this.respawn = true;
                this.removeFromWorld = true;
            }  
         }
    }

    updateCooldown(tick) {
        this.speedCountup += tick;
        // increase speed
        if(this.speedCountup >= this.speedDuration) {
            this.speedCountup = 0; 
            this.speedEnable = false;
        }
    }

    draw(ctx) {
        this.adjustSpritePosition(ctx, this.scale);
        if(PARAMS.DEBUG) {
            ctx.strokeStyle = "orange";
            // ctx.strokeRect(this.x - this.game.camera.x - 70, this.y - 30, 180, 105);
            this.BB.draw(ctx, this.game.camera);
            ctx.font = "15px serif";
            ctx.fillStyle = "Black";
            ctx.textAlign = "right";
            ctx.fillText("HP " + this.health, this.x + 30 - this.game.camera.x, this.y + 0);
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.arc(this.x - this.game.camera.x + 21, this.y + 43, 60, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.setLineDash([]);
            // ctx.strokeRect(this.x + 20, this.y + 10 - 100, 42, 86);
        }   
    }

    resetPlayer(startX, startY) {
        this.x = startX;
        this.y= startY;
        this.health = 5
        this.dead = false;
        this.currentState = new playerIdle(this);
        this.state = 0;
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
        //natural fall rate
        this.velocity.y += 130 * TICK;

        this.y+= this.velocity.y * TICK * 2;
        if (this.speedEnable) {
            this.x+= this.velocity.x * TICK * 2 * this.speedVal;
        } else {
            this.x+= this.velocity.x * TICK * 2;
        }
    }

    collide(theGame) {
        let that = this;
        this.game.entities.forEach(function(entity) {
            if(entity.BB && entity != that && that.BB.collide(entity.BB)) {
                if(entity.BB.name == "ground" && (that.lastBB.bottom) <= entity.BB.top)  {
                    that.y = entity.BB.top - that.BB.height; 

                    that.velocity.y = 0;
                    if(that.stateName == 4 || that.state == 3) {
                        that.newState = new playerLand(that);
                    }
                } else if (entity.BB.name == "ground" && (that.lastBB.top) >= entity.BB.bottom) {
                    that.y = entity.BB.bottom;
                    that.velocity.y = 0; 
                }else if(entity.BB.name == "ground" && (that.lastBB.right) >= entity.BB.left)  {
                    that.x = entity.BB.right; 
                    that.velocity.x = 0;
                } else if(entity.BB.name == "ground" && (that.lastBB.left) <= entity.BB.right)  {
                    console.log("collide");
                    that.x = entity.BB.left - that.BB.width - 0.1; 
                    that.velocity.x = 0;
                }
                if(entity.BB.name == "slime" || entity.BB.name == "" || entity.BB.name == "skelly") {
                    if(!entity.dead){
                        if(that.state != 8 && that.state != 9) that.newState = new playerHurt(that, entity.BB);
                    }
                }
                if(entity.BB.name == "healthpotion" && entity.visible == true && (that.health < that.overchargeHealth)) {
                    // increase player health (permanent)
                    entity.collect();
                    that.health += 5;
                    if(that.health > that.overchargeHealth) that.health = that.overchargeHealth;
                }
                if(entity.BB.name == "speedpotion") {
                    // increase player speed (temporarily)
                    entity.collect();
                    that.speedCountup = 0; 
                    that.speedEnable = true;
                }

                if (entity.BB.name == "door") {
                    theGame.levelAdvance();
                }

            }

            if(that.dmgBB && entity.BB && entity.BB != that && that.dmgBB.collide(entity.BB)) {
                if(entity.BB.name == "slime" || entity.BB.name == "specter" || entity.BB.name == "skelly" || entity.BB.name == "chest") {
                    entity.hit();
                    // if(that.state != 8) that.newState = new playerHurt(that, entity);
                }
            }

            if(entity.dmgBB && that.BB.collide(entity.dmgBB) && entity.dmgBB.name == "specter slash") {
                if(!entity.dead){
                    if(that.state != 8 && that.state != 9) that.newState = new playerHurt(that, entity.dmgBB);
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
            const ACC_WALK = 40;
            this.stateManager.velocity.x += direction * ACC_WALK;
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
        if(game.leftclick) {
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
        
    }

    update(game, TICK) {
        const MIN_WALK = this.stateManager.MIN_WALK;
        const MAX_WALK = this.stateManager.MAX_WALK;
        const ACC_WALK = this.stateManager.ACC_WALK;
        const DEC_SKID = this.stateManager.DEC_SKID;
        const DEC_REL = this.stateManager.DEC_REL;

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
        if(Math.abs(stateManager.velocity.x) == MAX_WALK) {
            return new playerRun(stateManager,this.direction);
        }
        if(Math.abs(stateManager.velocity.x) <= MIN_WALK) {
            return new playerIdle(stateManager);
        }
        if(game.up) {
            // return "jump";
            return new playerJump(this.stateManager);
        }
        if(game.leftclick) {
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
    constructor(stateManager, direction) {
        this.stateManager = stateManager;
        this.name = 2;

        this.direction = direction;
    }

    onEnter() {
        const ACC_WALK = 40;
        this.stateManager.velocity.x += this.direction * ACC_WALK;
    }

    update(game, TICK) {
        const MIN_WALK = this.stateManager.MIN_WALK;
        const MAX_RUN = 130;
        const MAX_WALK = this.stateManager.MAX_WALK;
        const ACC_WALK = this.stateManager.ACC_WALK;
        const DEC_SKID = this.stateManager.DEC_SKID;
        const DEC_REL = this.stateManager.DEC_REL;
        // const MIN_WALK = 30;
        // 
        // const MAX_WALK = 120;
        // const ACC_WALK = 40;
        // const DEC_SKID = 200;
        // const DEC_REL = 100;

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

        // if (stateManager.velocity.x >= MAX_RUN) stateManager.velocity.x = MAX_RUN;
        // if (stateManager.velocity.x <= -1 * MAX_RUN) stateManager.velocity.x = -MAX_RUN;

        // if (stateManager.velocity.x < 0) stateManager.facing = true;
        // if (stateManager.velocity.x > 0) stateManager.facing = false;

        // condition to leave
        if(Math.abs(stateManager.velocity.x) < MAX_WALK) {
            return new playerWalk(stateManager,this.direction);
        }
        if(game.up) {
            // return "jump";
            return new playerJump(this.stateManager);
        }
        // if(game.leftclick) {
        //     // return attack
        //     return new playerAttackDown(this.stateManager, this);
        // }
        if(this.stateManager.velocity.y > 0) {
            // return "fall";
            return new playerFall(this.stateManager);
        }
        return this.name;
    }

    onExit() {

    }
}

class playerJump {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.name = 3;
    }

    onEnter() {
        this.stateManager.velocity.y = this.stateManager.JUMPVELOCITY;
    }

    update(game, TICK) {
        //air physics
        const MAX_WALK = this.stateManager.MAX_WALK;
        const ACC_WALK = this.stateManager.ACC_WALK;
        const ACC_RUN = this.stateManager.ACC_RUN;

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
        const MAX_WALK = this.stateManager.MAX_WALK;
        const ACC_WALK = this.stateManager.ACC_WALK;
        const ACC_RUN = this.stateManager.ACC_RUN;

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
            this.stateManager.dmgBB = new BoundingBox(x - 70, y - 30, 180, 105, "player attack down");
            // if(PARAMS.DEBUG) this.stateManager.dmgBB.draw(ctx) 
        } else {
            this.stateManager.dmgBB = null;
        }

        if(this.elaspedTime >= this.duration) {
            // return this.calledState;
            return new playerIdle(this.stateManager);
        }
        if(game.leftclick) {
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
        let dmgRecieved = 1;
        if(this.dmgSource.name == "specter slash") dmgRecieved = 2;
        this.stateManager.health -=dmgRecieved;
        if(this.stateManager.health > 0) {
            let dmgDirection = this.dmgSource.center.x < this.stateManager.x;
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
        if(this.stateManager.health < 0) this.stateManager.health = 0;
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
        this.game = stateManager.game;
    }

    onEnter() {
        console.log("death by " + this.dmgSource.name)
        let dmgDirection = this.dmgSource.center.x < this.stateManager.x;
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
        this.game.respawnRestart();
    }
}