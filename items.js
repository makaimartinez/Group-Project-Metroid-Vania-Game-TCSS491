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


    };

    // triggered when the player hits the chest
    hit() {
        if (!this.opened) {
            this.spritesheet = ASSET_MANAGER.getAsset("./assets/openchest.png");
            this.y -= 27;       // subtract difference in height of sprites
            this.opened = true;
            for (let i = 0; i < 3; i++) {
                this.potions[i].visible = true;
            }
        }
    }

    draw(ctx) {
        if (this.opened) {          // If chest is opened (player BB has collided with chest BB)
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
        this.width = 18;
        this.height = 24;
        this.removeFromWorld = false;
        this.markCollect = false;
        this.sourceOffsetX = 15;
        this.sourceOffsetY = 25;

        this.visible = false;
        this.elapsedTime = 0;

        this.onGround = false;

        if (!this.chest) {
            this.x *= PARAMS.BLOCKWIDTH;
            this.y *= PARAMS.BLOCKWIDTH;
        }
        // if (this.type == 0) {
            this.spritesheet = ASSET_MANAGER.getAsset("./assets/healthpotion.png");
            this.BB = new BoundingBox(this.x + this.sourceOffsetX, this.y  + this.sourceOffsetY, this.width, this.height, "healthpotion");
        // }
        // if (this.type == 1) {
        //     this.spritesheet = ASSET_MANAGER.getAsset("./assets/speedpotion.png");
        //     this.BB = new BoundingBox(this.x + this.sourceOffsetX, this.y  + this.sourceOffsetY, this.width, this.height, "speedpotion");
        // }
        this.onEnter();
    };

    onEnter() {
        let multiplier = 70;
        let randomAngle = (Math.random() * (135 - 45) + 45)* Math.PI/180; // angle in radiansd
        // Generate x and y values using polar coordinates
        this.velocity.x -= multiplier * Math.cos(randomAngle);
        this.velocity.y -= multiplier * Math.sin(randomAngle);
    }

    update(){
        //PHYSICS
        const TICK = this.game.clockTick;

        if(this.visible) {this.elapsedTime+=TICK;}
        if(!this.markCollect && this.elapsedTime >= 3) this.markCollect = true;
        if(this.visible && !this.onGround) {
            this.velocity.y += 50*TICK; //gravity
            this.x+=this.velocity.x*TICK;
            this.y+=this.velocity.y*TICK;
        }


        // COLLISION
        let that = this;
        this.game.entities.forEach(function(entity) {
            if(entity.BB && entity.BB != that && that.BB.collide(entity.BB)) {
                if(entity.BB.name == "player")  {

                }
                
                if(entity.BB.name == "ground" && (that.lastBB.bottom) <= entity.BB.top)  {
                    that.velocity.y = 0;
                    that.y = entity.BB.top - that.BB.height - that.sourceOffsetY; 
                    that.onGround = true;
                }
            }  
        })

        this.updateBB();
    };

    collect() {
        this.removeFromWorld = true;
    }

    updateBB() {
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.x + this.sourceOffsetX, this.y  + this.sourceOffsetY, this.width, this.height, "healthpotion");
        // this.BB = new BoundingBox(this.x, this.y, this.width, this.height, "healthpotion");
    }



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