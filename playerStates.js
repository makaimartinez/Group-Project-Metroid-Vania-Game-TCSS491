class Player {
    constructor() {
        this.x = 0;
        this.y = 0;

        this.States = {
            Idle: "idle",
            Walking: "walking",
            Attack: "attack",
            Jumping: "jumping",
            Falling: "falling",
            Damage: "damage"
        }
    }

    update() {



        switch (this.States) {
            case this.States.Idle:
                // Switch to Idle animation
                
                break;

            case this.States.Walking:
            // Switch to Walking animation
                
                break;

            case this.States.Attack:
            // Switch to Attack animation
                
                break;

            case this.States.Jumping:
            // Switch to Jumping animation
                
                break;

            case this.States.Falling:
            // Switch to Falling animation
                
                break;

            case this.States.Damage:
            // Switch to Damage animation
                
                break;
        }

    }

    draw(theCtx, theGame) {

    }
    
}

class IdleState {

}

class WalkingState {

}

class AttackState {

}

class JumpingState {

}
class FallingState {

}

class DamageState {

}