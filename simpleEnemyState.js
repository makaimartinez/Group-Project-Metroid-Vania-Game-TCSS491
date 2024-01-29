//Author: Thomas Tien
//use this as a simple example for complex state machines

class Enemy {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y});
        this.currentState = new EnemyIdle(this);
        this.stateName = "idle";//states: idle, walk
        this.BB;
        this.lastBB;
    }
    
    update() {
        // console.log("Enemy " + this.x + " " + this.y);
        let newState = this.currentState.update();

        //if it's a new state, switch to that state
        if(newState != this.stateName) {
            this.stateName = newState.name;
            delete this.currentState;
            this.currentState = newState;
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

        this.y+= 4 * TICK * 2;
    }

    collide() {
        let that = this;
        this.game.entities.forEach(function(entity) {
            if(entity.BB && entity.BB != that && that.BB.collide(entity.BB)) {
                if(entity instanceof Ground) {
                    console.log("hit ground");
                }
            }
        })
    }
}

class EnemyIdle {
    constructor(stateManager) {
        //on enter
        Object.assign(this, {stateManager});
        this.name = "idle";

        this.idleTime = 0;
        this.idleDuration = 300;
    }

    update() {
        //update stuff
        this.idleTime++;
        let output = this.name;
        
        //condition to exit
        if(this.idleTime >= this.idleDuration) {
            // return "walk";
            return new EnemyWalk(this.stateManager);
        }
        return output;
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
        this.walkTime = 0;
        this.walkDuration = 300;
    }

    update() {
        //update stuff
        this.wanderTime++;
        this.walkTime++;
        let output = this.name;
        if(this.wanderTime == this.wanderDuration) {
            this.direction *=-1;
            this.wanderTime = 0;
        }
        this.stateManager.x +=this.direction /2;

        //condition to exit
        if(this.walkTime >= this.walkDuration) {
            return new EnemyIdle(this.stateManager);
        }
        return output;
    }

    draw(ctx) {
        ctx.strokeStyle = "Red";
        ctx.strokeRect(this.stateManager.x, this.stateManager.y, 42, 86);
    }
}