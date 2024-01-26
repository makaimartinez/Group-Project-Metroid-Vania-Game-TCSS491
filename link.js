class Link {
    
    constructor() {
        // sprite frames per row = 12
        // sprite row width = 288
        // sprite height = 23 (but they all have space in between)
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/linksprites.png");

        // add character state variables (facing, size, state, dead)
        this.direction = 0;     // right = 0, left = 1, up = 2, down = 3
        this.state = 0;         // alive, hurt, and dead
        this.dead = false;
        this.cycle = 0;

        // position
        this.x = 100;
        this.y = 100;
        this.velocity = { x: 0, y: 0};  
        this.fallAcc = 542.81;  // pixels / second


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
        const TICK = gameEngine.clockTick;

        // I used this page to approximate my constants
        // https://web.archive.org/web/20130807122227/http://i276.photobucket.com/albums/kk21/jdaster64/smb_playerphysics.png
        // I converted these values from hex and into units of pixels and seconds.

        const MIN_WALK = 4.453125;
        const MAX_WALK = 93.75;
        const MAX_RUN = 153.75;
        const ACC_WALK = 133.59375;
        const ACC_RUN = 200.390625;
        const DEC_REL = 182.8125;
        const DEC_SKID = 365.625;
        const MIN_SKID = 33.75;

        const STOP_FALL = 1575;
        const WALK_FALL = 1800;
        const RUN_FALL = 2025;
        const STOP_FALL_A = 450;
        const WALK_FALL_A = 421.875;
        const RUN_FALL_A = 562.5;

        const MAX_FALL = 270;

        // // update velocity
        // this.x += this.velocity.x * TICK;
        // if (this.x > 800) {
        //     this.x = 0;
        // }
        // if (this.y > 200) {
        //     this.y = 0;
        // }

        if (this.state !== 4) { // not jumping
            // ground physics
            if (Math.abs(this.velocity.x) < MIN_WALK) {  // slower than a walk // starting, stopping or turning around
                this.velocity.x = 0;
                this.state = 0;
                if (gameEngine.left && !gameEngine.down) {
                    this.velocity.x -= MIN_WALK;
                }
                if (gameEngine.right && !gameEngine.down) {
                    this.velocity.x += MIN_WALK;
                }
            }
            else if (Math.abs(this.velocity.x) >= MIN_WALK) {  // faster than a walk // accelerating or decelerating
                if (this.facing === 0) {
                    if (gameEngine.right && !gameEngine.left && !gameEngine.down) {
                        if (gameEngine.B) {
                            this.velocity.x += ACC_RUN * TICK;
                        } else this.velocity.x += ACC_WALK * TICK;
                    } else if (gameEngine.left && !gameEngine.right && !gameEngine.down) {
                        this.velocity.x -= DEC_SKID * TICK;
                        this.state = 3;
                    } else {
                        this.velocity.x -= DEC_REL * TICK;
                    }
                }
                if (this.facing === 1) {
                    if (gameEngine.left && !gameEngine.right && !gameEngine.down) {
                        if (gameEngine.B) {
                            this.velocity.x -= ACC_RUN * TICK;
                        } else this.velocity.x -= ACC_WALK * TICK;
                    } else if (gameEngine.right && !gameEngine.left && !gameEngine.down) {
                        this.velocity.x += DEC_SKID * TICK;
                        this.state = 3;
                    } else {
                        this.velocity.x += DEC_REL * TICK;
                    }
                } 
            }
        }

        this.velocity.y += this.fallAcc * TICK;

        // jump
        if (gameEngine.up) { 
            if (Math.abs(this.velocity.x) < 16) {
                this.velocity.y = -240;
                this.fallAcc = STOP_FALL;
            }
            else if (Math.abs(this.velocity.x) < 40) {
                this.velocity.y = -240;
                this.fallAcc = WALK_FALL;
            }
            else {
                this.velocity.y = -300;
                this.fallAcc = RUN_FALL;
            }
            this.state = 4;
        } else {
            // air physics
            // vertical physics
            if (this.velocity.y < 0 && gameEngine.A) { // holding A while jumping jumps higher
                if (this.fallAcc === STOP_FALL) this.velocity.y -= (STOP_FALL - STOP_FALL_A) * TICK;
                if (this.fallAcc === WALK_FALL) this.velocity.y -= (WALK_FALL - WALK_FALL_A) * TICK;
                if (this.fallAcc === RUN_FALL) this.velocity.y -= (RUN_FALL - RUN_FALL_A) * TICK;
            }
            this.velocity.y += this.fallAcc * TICK;

            // horizontal physics
            if (gameEngine.right && !gameEngine.left) {
                if (Math.abs(this.velocity.x) > MAX_WALK) {
                    this.velocity.x += ACC_RUN * TICK;
                } else this.velocity.x += ACC_WALK * TICK;
            } else if (gameEngine.left && !gameEngine.right) {
                if (Math.abs(this.velocity.x) > MAX_WALK) {
                    this.velocity.x -= ACC_RUN * TICK;
                } else this.velocity.x -= ACC_WALK * TICK;
            } else {
                // do nothing
            }
        }

        // max speed calculation
        if (this.velocity.y >= MAX_FALL) this.velocity.y = MAX_FALL;
        if (this.velocity.y <= -MAX_FALL) this.velocity.y = -MAX_FALL;
        if (this.velocity.x >= MAX_RUN) this.velocity.x = MAX_RUN;
        if (this.velocity.x <= -MAX_RUN) this.velocity.x = -MAX_RUN;
        if (this.velocity.x >= MAX_WALK && !gameEngine.B) this.velocity.x = MAX_WALK;
        if (this.velocity.x <= -MAX_WALK && !gameEngine.B) this.velocity.x = -MAX_WALK;

        // update position
        this.x += this.velocity.x * TICK * PARAMS.SCALE;
        this.y += this.velocity.y * TICK * PARAMS.SCALE;
        //this.updateBB();        // update bounding box so we know where link is

        // acceleration (no change)
        // collision
        var that = this;
        gameEngine.entities.forEach(function (entity) {
            if (entity.BB && that.BB.collide(entity.BB)) {
                if (that.velocity.y > 0) { // falling
                    if ((entity instanceof Ground || entity instanceof Brick || entity instanceof Block || entity instanceof Tube || entity instanceof SideTube) // landing
                        && (that.lastBB.bottom) <= entity.BB.top) { // was above last tick
                        if (that.size === 0 || that.size === 3) { // small
                            that.y = entity.BB.top - PARAMS.BLOCKWIDTH;
                        } else { // big
                            that.y = entity.BB.top - 2 * PARAMS.BLOCKWIDTH;
                        }
                        that.velocity.y = 0;

                        if(that.state === 4) that.state = 0; // set state to idle
                        //that.updateBB();

                    }

                }
                else if (that.velocity.y < 0) { // jumping
                    if ((entity instanceof Brick) // hit ceiling
                        && (that.lastBB.top) >= entity.BB.bottom) { // was below last tick

                        if (that.BB.collide(entity.leftBB) && that.BB.collide(entity.rightBB)) { // collide with the center point of the brick
                            entity.bounce = true;
                            that.velocity.y = 0;

                            if(entity.type == 1 && that.size != 0 && that.size != 3){ // if it's a regular brick, and mario is big
                                entity.explode();
                            }
                        }
                        else if (that.BB.collide(entity.leftBB)) {
                            that.x = entity.BB.left - PARAMS.BLOCKWIDTH;
                        }
                        else {
                            that.x = entity.BB.right;
                        }
                        
                    }
                    else if (entity instanceof Lift && that.lastBB.bottom <= entity.BB.top + PARAMS.SCALE * 3) {
                        if (that.size === 0 || that.size === 3) { // small
                            that.y = entity.BB.top - PARAMS.BLOCKWIDTH;
                        } else { // big
                            that.y = entity.BB.top - 2 * PARAMS.BLOCKWIDTH;
                        }
                        that.velocity.y = 0;
                        //that.updateBB();
                    }
                }
                if ((entity instanceof Brick && entity.type) // hit a visible brick
                    && that.BB.collide(entity.BB)) {
                    let overlap = that.BB.overlap(entity.BB);
                    if (overlap.y > 2) { // hit the side
                        if (that.BB.collide(entity.leftBB) && that.lastBB.right <= entity.BB.left) {
                            that.x = entity.BB.left - PARAMS.BLOCKWIDTH;
                            if (that.velocity.x > 0) that.velocity.x = 0;
                        } else if (that.BB.collide(entity.rightBB) && that.lastBB.left >= entity.BB.right) {
                            that.x = entity.BB.right;
                            if (that.velocity.x < 0) that.velocity.x = 0;
                        }
                    }
                    //that.updateBB();
                }
                else if ((entity instanceof Ground || entity instanceof Block)) {
                    if (that.lastBB.right <= entity.BB.left) { // Collided with the left
                        that.x = entity.BB.left - PARAMS.BLOCKWIDTH;
                        if (that.velocity.x > 0) that.velocity.x = 0;
                    } else if (that.lastBB.left >= entity.BB.right) { // Collided with the right
                        that.x = entity.BB.right;
                        if (that.velocity.x < 0) that.velocity.x = 0;
                    }
                    //that.updateBB();
                }
                
            }
        });
    }

    draw() {
        let scale = 3;
        let tick = gameEngine.clockTick;

        if (this.dead) {
            this.deadAnim.drawFrame(tick, this.x, this.y, scale);
        }   else {
            this.animations[this.direction][this.cycle].drawFrame(tick, this.x - this.gameEngine.camera.x, this.y, scale);
        }
        // HitBox?
        if(PARAMS.DEBUG) {
         ctx.strokeStyle = "Green"
         ctx.strokeRect(this.x, this.y,  this.width * scale, this.height * scale);
        }

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