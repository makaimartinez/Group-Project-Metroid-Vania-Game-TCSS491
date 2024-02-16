// A class that is used to create, update, and draw treasure chests
class Chest {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y});
        this.x *= PARAMS.BLOCKWIDTH;
        this.y *= PARAMS.BLOCKWIDTH;
        this.spritesheet = ASSET_MANAGER.getAsset("./assets/chest.png");
        this.size = 48; // 48 x 48 px 

        this.opened = false;
        this.openSizeY = 75     // open chest png is height 75 pixels

        this.BB = new BoundingBox(this.x, this.y, this.size, this.size, "chest");

        this.potions = [];
        this.loadPotions();

       
    };

    loadPotions() {
        for (let i = 0; i < 3; i++) {

        // create potions that fly out                    
            this.potions[i] = new Potion(this.game, this.x, this.y - 10, i % 2, true)
            this.game.addEntity(this.potions[i]); // type = 0 (health potion), chest = true
            console.log("potions");

        }

        
    }

    update(){
        // if player attacks, show as opened and create an arch the spits items up and fall on the ground


        // for now test if the chest is collided with change sprite
        let that = this;
        this.game.entities.forEach(function(entity) {
            if(entity.BB && entity.BB != that && that.BB.collide(entity.BB)) {
                if(entity.BB.name == "player")  {
                    if (!that.opened) {
                        that.spritesheet = ASSET_MANAGER.getAsset("./assets/openchest.png");
                        that.y -= 27;       // subtract difference in height of sprites
                        that.opened = true;
                        for (let i = 0; i < 3; i++) {
                            that.potions[i].visible = true;
                            // console.log(that.potions[i].size);
                        }


                    }
                }
            }
               
        })

    };

    draw(ctx) {
        if (this.opened) {
            ctx.drawImage(this.spritesheet, 0, 0, this.size, this.openSizeY, this.x - this.game.camera.x, this.y, PARAMS.BLOCKWIDTH, this.openSizeY);
        } else {
            ctx.drawImage(this.spritesheet, 0, 0, this.size, this.size, this.x - this.game.camera.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH);
        }
        if (PARAMS.DEBUG) {
            ctx.strokeStyle = "red";
            this.BB.draw(ctx, this.game.camera);
        }
    };
}




// A class that is used to create, update, and draw health(type = 0) & speed potions(type = 1)
class Potion {
    constructor(game, x, y, type, chest) {
        Object.assign(this, { game, x, y, type, chest});
        this.velocity = {x:0, y:0};
        this.size = 48; 
        this.BBsize = 32;
        this.removeFromWorld = false;
        this.sourceOffsetX = 8;
        this.sourceOffsetY = 20;

        this.visible = false;
        this.elapsedTime = 0;

        this.onGround = false;

        if (!this.chest) {
            this.x *= PARAMS.BLOCKWIDTH;
            this.y *= PARAMS.BLOCKWIDTH;
        }
        // if (this.type == 0) {
            this.spritesheet = ASSET_MANAGER.getAsset("./assets/healthpotion.png");
            this.BB = new BoundingBox(this.x + this.sourceOffsetX, this.y  + this.sourceOffsetY, this.BBsize, this.BBsize, "healthpotion");
        // }
        // if (this.type == 1) {
        //     this.spritesheet = ASSET_MANAGER.getAsset("./assets/speedpotion.png");
        //     this.BB = new BoundingBox(this.x + this.sourceOffsetX, this.y  + this.sourceOffsetY, this.BBsize, this.BBsize, "speedpotion");
        // }
        this.onEnter();
    };

    onEnter() {
        let multiplier = 70;
        let randomAngle = Math.random() * (135 - 45) + 45;
        this.velocity.x = Math.acos(randomAngle) * multiplier;
        this.velocity.y = Math.asin(randomAngle) * multiplier;
    }

    update(){
        //PHYSICS
        const TICK = this.game.clockTick;

        
        
        if(this.visible && !this.onGround) {
            this.elapsedTime+=TICK;
            this.velocity.y += 50*TICK; //gravity
            this.x+=this.velocity.x*TICK;
            this.y+=this.velocity.y*TICK;
        }
        
        
        


        // 1. Get x and y for the angle
        // 2. use atan(x, y) to get angle
        // 3. get x and y velocities and multiply by a set speed;

        

        
            // let points = [
            //     {x: this.x, y: this.y},
            //     {x: this.x + 30, y: this.y - 70},
            //     {x: this.x + 96, y: this.y - 90},
            //     {x: this.x + 100,  y: this.y - 48},
            // ]
            // // from a bezio curve video
            // let [p0, p1, p2, p3] = points;
            // // calculate coefficients based on where the object currently in the animation
            // let cx = 3 * (p1.x - p0.x);
            // let bx = 3 * (p2.x - p1.x) - cx;
            // let ax = p3.x - p0.x - cx - bx;

            // let cy = 3 * (p1.y - p0.y);
            // let by = 3 * (p2.y - p1.y) - cy;
            // let ay = p3.y - p0.y - cy - by;

            // // increment t value by speed
            // let t = 10;

            // // calculate new X & Y positions of the object
            // let xt = ax*(t*t*t) + bx*(t*t) + cx*t + p0.x;
            // let yt = ay*(t*t*t) + by*(t*t) + cy*t + p0.y;

            // if(t > 1) {
            //     t = 1;
            // }     

            // update position
            // this.y = xt;
            // this.x = yt;



        // COLLISION
        let that = this;
        this.game.entities.forEach(function(entity) {
            // console.log(entity);
            if(entity.BB && entity.BB != that && that.BB.collide(entity.BB)) {
                if (that.elapsedTime > 300) {
                    if(entity.BB.name == "player")  {
                        that.removeFromWorld = true;
                    }
                }
                if(entity.BB.name == "groun1d")  {
                    that.velocity.y = 0;
                    that.onGround = true;
                }
            }  
        })
    };



    draw(ctx) {
        if (this.visible) {
            ctx.drawImage(this.spritesheet, 0, 0, this.size, this.size, this.x - this.game.camera.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH);
            if (PARAMS.DEBUG) {
                ctx.strokeStyle = "red";
                this.BB.draw(ctx, this.game.camera);
            }
        }
    };
}

// weapons

    // spear

    // sword

// armor?