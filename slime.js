class Slime {
    
    constructor(x, y) {
        Object.assign(this, {x, y});

        // sprite frames per row = 8
        // sprite width = 64
        // sprite height = 64
        // padding = 0

        this.spritesheet = ASSET_MANAGER.getAsset("./assets/slime.png");
        this.state = 0;         // left = 0, right = 1, idle = 2
        this.dead = false;

        this.speed = 50;
        this.velocity = { x: 0, y: 0};

        this.animations = [];
        this.loadAnimations(this.spritesheet)
    }

    loadAnimations(spritesheet) {

        for (var i = 0; i < 3; i++) { // 3 states
            this.animations.push([]);
        }
        
        // sprite frames per row = 8
        // sprite width = 64
        // sprite height = 64
        // padding = 0
        this.width = 64;
        this.height = 64;
        this.frameCount = 8;
        this.totalTime = 1;
        this.framePadding = 0;

        // walk left
        this.animations[0] = new Animator(spritesheet, 0, 0,  this.width, this.height, this.frameCount, this.totalTime, this.framePadding, false, true);
        
        // walk right
        this.animations[1] = new Animator(spritesheet, 0, 65,  this.width, this.height, this.frameCount, this.totalTime, this.framePadding, false, true);
        
        // idle
        this.animations[2] = new Animator(spritesheet, 0, 129,  this.width, this.height, this.frameCount, this.totalTime, this.framePadding, false, true);

    }

    update() {
        let TICK = gameEngine.clockTick;

        // update velocity
        if (this.state == 0) {
            this.velocity.x -= this.speed * TICK;
        }
        if (this.state == 1) {
            this.velocity.x += this.speed * TICK;
        }
        if (this.x < 200 ) {
            this.state = 1;
            this.velocity.x = 0;
            this.velocity.x += this.speed * TICK;
        }
        if (this.x > 600 ) {
            this.state = 0;
            this.velocity.x = 0;
            this.velocity.x -= this.speed * TICK;
        }
        // update position
        this.x += this.velocity.x * TICK * PARAMS.SCALE;

    }

    draw(ctx) {
        let scale = 3;
        let tick = gameEngine.clockTick;

        // left walk
        this.animations[this.state].drawFrame(tick, ctx, this.x, this.y, 1, false);

    }

}