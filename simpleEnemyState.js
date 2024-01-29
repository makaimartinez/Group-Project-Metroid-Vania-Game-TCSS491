//Author: Thomas Tien
//use this as a simple example for complex state machines

class Enemy {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y});
        this.currentState = new EnemyFall(this);//new EnemyFall(this);
        this.stateName = "fall";//states: idle, walk, fall

        this.velocity = {x:0, y:0};

        this.fallAC = 50;

        this.BB;
        this.lastBB;
    }
    
    update() {
        const TICK = this.game.clockTick;
        // console.log("Enemy " + this.x + " " + this.y);
        let newState = this.currentState.update(TICK);

        //if it's a new state, switch to that state
        if(newState != this.stateName) {
            this.stateName = newState.name;
            delete this.currentState;
            this.currentState = newState;
            this.currentState.onEnter();
        }
        this.physics();
        this.updateLastBB();
        this.updateBB();
        this.collide();
    }

    draw(ctx) {
        this.currentState.draw(ctx);
    }

    updateBB() {
        this.BB = new BoundingBox(this.x, this.y, 42, 86);
    }

    updateLastBB() {
        this.lastBB = this.BB;
    }

    physics() {
        const TICK = this.game.clockTick;

        // console.log("x " + this.x + "\ty " + this.y + "\nvel" + this.velocity.x + "\t" + this.velocity.y);

        this.velocity.y += this.fallAC * TICK;

        this.y+= this.velocity.y * TICK * 2;
        this.x+= this.velocity.x * TICK * 2;
    }

    collide() {
        let that = this;
        this.game.entities.forEach(function(entity) {
            if(entity.BB && entity.BB != that && that.BB.collide(entity.BB)) {
                if(entity instanceof Ground) {
                    // console.log("hit ground");
                    that.y = entity.BB.top - 86;
                    that.velocity.y = 0;
                    if(that.stateName == "fall") {
                        that.currentState = new EnemyIdle(that);
                        that.stateName = "idle";
                    }
                }
            }
        })
    }
}

class EnemyIdle {
    constructor(stateManager) {
        Object.assign(this, {stateManager});
        this.name = "idle";
        //on enter
        this.idleTime = 0;
        this.idleDuration = 300;
    }

    onEnter() {
        this.stateManager.velocity.x *=2;
    }

    update(TICK) {
        //update stuff
        this.idleTime++;
        
        //condition to exit
        if(this.idleTime >= this.idleDuration) {
            // return "walk";
            return new EnemyWalk(this.stateManager);
        }
        if(this.stateManager.velocity.y >0) {
            // return "fall";
            return new EnemyFall(this.stateManager);
        }
        return this.name;
    }

    draw(ctx) {
        ctx.fillStyle = "Green";
        ctx.fillRect(this.stateManager.x, this.stateManager.y, 42, 86);
    }
}

class EnemyWalk {
    constructor(stateManager) {
        Object.assign(this, {stateManager});
        this.name = "walk";

        this.wanderTime = 0;
        this.wanderDuration = 150;
        this.direction = 1;
        if(this.stateManager.velocity.x > 0) {
            this.direction = -1;
        }
        this.walkTime = 0;
        this.walkDuration = 450;
    }

    onEnter() {

    }

    update(TICK) {
        //update stuff
        this.wanderTime++;
        this.walkTime++;
        if(this.wanderTime == this.wanderDuration) {
            this.direction *=-1;
            this.stateManager.velocity.x *= 0.5
            this.wanderTime = 0;
        }
        this.stateManager.velocity.x +=this.direction /2;

        //condition to exit
        if(this.walkTime >= this.walkDuration) {
            return new EnemyIdle(this.stateManager);
        }
        if(this.stateManager.velocity.y > 0) {
            // return "fall";
            return new EnemyFall(this.stateManager);
        }
        return this.name;
    }

    draw(ctx) {
        ctx.strokeStyle = "Red";
        ctx.strokeRect(this.stateManager.x, this.stateManager.y, 42, 86);
    }
}

class EnemyFall {
    constructor(stateManager) {
        Object.assign(this, {stateManager});
        this.name = "fall";
    }

    onEnter() {
        this.stateManager.velocity.x *=0.5;
    }

    update(TICK) {
        return this.name;
    }

    draw(ctx) {
        ctx.strokeStyle = "Blue";
        ctx.strokeRect(this.stateManager.x, this.stateManager.y, 42, 86);
    }
}