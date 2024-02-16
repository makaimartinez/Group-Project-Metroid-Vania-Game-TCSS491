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
       
    };

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
                        
                        // create potions that fly out                    
                        that.game.addEntity(new Potion(that.game, that.x, that.y, 0, true)); // type = 0 (health potion), chest = true


                    }
                }
            }
               
        })

    };

    draw(ctx) {
        if (this.opened) {
            ctx.drawImage(this.spritesheet, 0, 0, this.size, this.openSizeY, this.x, this.y, PARAMS.BLOCKWIDTH, this.openSizeY);
        } else {
            ctx.drawImage(this.spritesheet, 0, 0, this.size, this.size, this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH);
        }
        // ctx.strokeStyle = "red";
        // ctx.strokeRect(this.x, this.y, this.size, this.size);
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
        this.sourceOffsetX = 8
        this.sourceOffsetY = 20
        if (!this.chest) {
            this.x *= PARAMS.BLOCKWIDTH;
            this.y *= PARAMS.BLOCKWIDTH;
        }
        if (this.type == 0) {
            this.spritesheet = ASSET_MANAGER.getAsset("./assets/healthpotion.png");
            this.BB = new BoundingBox(this.x + this.sourceOffsetX, this.y  + this.sourceOffsetY, this.BBsize, this.BBsize, "healthpotion");
        }
        if (this.type == 1) {
            this.spritesheet = ASSET_MANAGER.getAsset("./assets/speedpotion.png");
            this.BB = new BoundingBox(this.x + this.sourceOffsetX, this.y  + this.sourceOffsetY, this.BBsize, this.BBsize, "speedpotion");
        }

       
    };

    update(){
        // PHYSICS
        const TICK = this.game.clockTick;

        if (this.chest) {    // we need to change chest boolean on hit
            let points = [
                {x: this.x, y: this.y},
                {x: this.x + 30, y: this.y - 70},
                {x: this.x + 96, y: this.y - 90},
                {x: this.x + 100,  y: this.y - 48},
            ]
            // from a bezio curve video
            let [p0, p1, p2, p3] = points;
            // calculate coefficients based on where the object currently in the animation
            let cx = 3 * (p1.x - p0.x);
            let bx = 3 * (p2.x - p1.x) - cx;
            let ax = p3.x - p0.x - cx - bx;

            let cy = 3 * (p1.y - p0.y);
            let by = 3 * (p2.y - p1.y) - cy;
            let ay = p3.y - p0.y - cy - by;

            // increment t value by speed
            let t = 10;

            // calculate new X & Y positions of the object
            let xt = ax*(t*t*t) + bx*(t*t) + cx*t + p0.x;
            let yt = ay*(t*t*t) + by*(t*t) + cy*t + p0.y;

            if(t > 1) {
                t = 1;
            }

            // update position
            this.y = xt;
            this.x = yt;
            // this.BB.x = xt;
            // this.BB.y = yt;

        }



        // COLLISION
        let that = this;
        this.game.entities.forEach(function(entity) {
            if(entity.BB && entity.BB != that && that.BB.collide(entity.BB)) {
                if(entity.BB.name == "player")  {
                    that.removeFromWorld = true;
                }
                if(entity.BB.name == "ground")  {
                    that.velocity.y = 0;
                }
            }  
        })
    };



    draw(ctx) {
        ctx.drawImage(this.spritesheet, 0, 0, this.size, this.size, this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH);
        ctx.strokeStyle = "red";
        ctx.strokeRect(this.BB.x, this.BB.y, this.BBsize, this.BBsize);
    };
}

// weapons

    // spear

    // sword

// armor?