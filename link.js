class Link {
    
    constructor() {
        this.x = 100;
        this.y = 100;
        this.speed = 100;

        // sprite frames per row = 12
        // sprite row width = 288
        // sprite height = 23 (but they all have space in between)
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/linksprites.png");

        // add character state variables (facing, size, state, dead)
        this.direction = 0;     // right = 0, left = 1, up = 2, down = 3
        this.state = 0;         // alive, hurt, and dead
        this.dead = false;
        this.cycle = 0;



        this.velocity = { x: 0, y: 0};
        // this.fallAcc = 


        this.animations = [];
        this.loadAnimations(this.spritesheet)



    }

    loadAnimations(spritesheet) {

        for (var i = 0; i < 4; i++) { // 4 directions
            this.animations.push([]);
            for (var j = 0; j < 2; j++) { // 2 variations
                this.animations[i].push([]);
            }
        }
        
        // sprite frames per row = 12
        // sprite row width = 288
        // 288 / 12 = 24 frame width
        // sprite height = 24
        this.width = 23;
        this.height = 26;
        this.frameCount = 12;
        this.totalTime = 0.5;
        this.framePadding = 1;
        this.reverse = new Boolean(false);
        this.loop = new Boolean(true);

        // Essentially we use animator class to represent 1 frame, some values on the end dont matter.
        // walk right
        this.animations[0][0] = new Animator(spritesheet, 0, 38,  this.width, this.height, this.frameCount, this.totalTime, this.framePadding, false, true);
        this.animations[0][1] = new Animator(spritesheet, 0, 165,  this.width, this.height, this.frameCount, this.totalTime, this.framePadding, false, true);

        // walk left
        this.animations[1][0] = new Animator(spritesheet, 1, 102,  this.width, this.height, this.frameCount, this.totalTime, this.framePadding, false, true);
        this.animations[1][1] = new Animator(spritesheet, 1, 229,  this.width, this.height, this.frameCount, this.totalTime, this.framePadding, false, true);


        // walk up
        this.animations[2][0] = new Animator(spritesheet, 0, 5,  this.width, 27, this.frameCount, this.totalTime, this.framePadding, false, true);
        this.animations[2][1] = new Animator(spritesheet, 0, 134,  this.width, 27, this.frameCount, this.totalTime, this.framePadding, false, true);

        // walk down
        this.animations[3][0] = new Animator(spritesheet, 0, 69,  this.width, 27, this.frameCount, this.totalTime, this.framePadding, false, true);
        this.animations[3][1] = new Animator(spritesheet, 0, 197,  this.width, 27, this.frameCount, this.totalTime, this.framePadding, false, true);

        // dead (not yet implemented)
        this.deadAnim = new Animator(this.spritesheet, 0, 69,  this.width, 27, this.frameCount, this.totalTime, this.framePadding, false, true);
    }

    update() {
        // update velocity
        this.x += this.speed * gameEngine.clockTick;
        if (this.x > 800) {
            this.x = 0;
        }
        // update position
    }

    draw() {
        let scale = 3;
        let tick = gameEngine.clockTick;

        if (this.dead) {
            this.deadAnim.drawFrame(tick, this.x, this.y, scale);
        }   else {
            this.animations[this.direction][this.cycle].drawFrame(tick, this.x, this.y, scale);
        }
        // HitBox?
        //if(PARAMS.DEBUG) {
         ctx.strokeStyle = "Green"
         ctx.strokeRect(this.x, this.y,  this.width * scale, this.height * scale);
        //}

        // // right walk
        // this.animations[0][0].drawFrame(tick, this.x, this.y, scale);
        // this.animations[0][1].drawFrame(tick, this.x + 100, this.y, scale);
        // // left walk
        // this.animations[1][0].drawFrame(tick, this.x, this.y + 100, scale);
        // this.animations[1][1].drawFrame(tick, this.x + 100, this.y + 100, scale);
        // // walk up
        // this.animations[2][0].drawFrame(tick, 0, this.y + 200, scale);
        // this.animations[2][1].drawFrame(tick, 0 + 100, this.y + 200, scale);
        // // walk down
        // this.animations[3][0].drawFrame(tick, 0, this.y + 300, scale);
        // this.animations[3][1].drawFrame(tick, 0 + 100, this.y + 300, scale);



        // reverse image
        // ctx.save();
        // ctx.scale(-1, 1);
        // ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/linksprites.png"),
        // sx, sy, this.width, this.height,
        // - this.x - (this.width * scale), this.y, this.width * scale, this.height * scale);
        // ctx.restore();

        // draws links sprite #1
        // ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/linksprites.png"),
        //     sx, sy, this.width, this.height,
        //     this.x, this.y, this.width * scale, this.height * scale);
    }

}