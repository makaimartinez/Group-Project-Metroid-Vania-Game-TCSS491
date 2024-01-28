class Enemy {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y});
        
        this.States = {
            Idle: "idle",
            Walking: "walking",
            Attack: "attack",
            Jumping: "jumping",
            Falling: "falling",
            Damage: "damage"
        }

        this.currentState = this.States.Idle;
    }

    update() {
        switch(this.currentState) {
            case this.States.Idle:
                this.Idle();
                break;
        }
    }

    draw(ctx) {
        switch(this.currentState) {
            case this.States.Idle:
                
                break;
        }
    }

    Idle() {

    }
}