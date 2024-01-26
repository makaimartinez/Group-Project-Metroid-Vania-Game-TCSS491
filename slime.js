class Slime {
    
    constructor(x, y) {
        Object.assign(this, {x, y});

        // sprite frames per row = 8
        // sprite width = 64
        // sprite height = 64
        // padding = 0

        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/slime.png");
        this.state = 0;         // left = 0, right = 1, idle = 2
        this.dead = false;


        this.speed = 50;
        this.velocity = { x: 0, y: 0};
        // this.fallAcc = 


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
        
        // idel
        this.animations[2] = new Animator(spritesheet, 0, 129,  this.width, this.height, this.frameCount, this.totalTime, this.framePadding, false, true);

    }

    update() {
        // update velocity
        this.x -= this.speed * gameEngine.clockTick;
        if (this.x < 100 ) {
            this.x = 800;
        }
        // update position
    }

    draw(ctx) {
        let scale = 3;
        let tick = gameEngine.clockTick;

        // left walk
        this.animations[0].drawFrame(tick, ctx, this.x, this.y, 1, false);

    }

}