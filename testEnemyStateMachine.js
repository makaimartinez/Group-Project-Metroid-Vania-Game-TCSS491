class Enemy {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y});

        this.currentState = new EnemyIdle(this.game, this.x, this.y);
        this.stateName = "idle";
    }
    
    update() {
        console.log("Enemy " + this.x + " " + this.y);
        let newState = this.currentState.update();
        
        //update position so other classses can see
        this.x = this.currentState.x;
        this.y = this.currentState.y;

        if(newState != this.stateName) {
            // console.log(newState.name);
            this.stateName = newState.name;
            this.currentState = newState;
        }
    }

    draw(ctx) {
        this.currentState.draw(ctx);
    }
}

class EnemyIdle {
    constructor(game, x, y) {
        //on enter
        Object.assign(this, { game, x, y});
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
            return new EnemyWalk(this.game, this.x, this.y);
        }
        return output;
    }

    draw(ctx) {
        ctx.fillStyle = "Green";
        ctx.fillRect(this.x, this.y, 42, 86);
    }
}

class EnemyWalk {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y});
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
        this.x +=this.direction /2;

        //condition to exit
        if(this.walkTime >= this.walkDuration) {
            return new EnemyIdle(this.game, this.x, this.y);
        }
        return output;
    }

    draw(ctx) {
        ctx.strokeStyle = "Red";
        ctx.strokeRect(this.x, this.y, 42, 86);
    }
}