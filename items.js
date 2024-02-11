// A class that is used to create, update, and draw treasure chests
class Chest {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y});
        this.x *= PARAMS.BLOCKWIDTH;
        this.y *= PARAMS.BLOCKWIDTH;
        this.spritesheet = ASSET_MANAGER.getAsset("./assets/chest.png");
        this.size = 48; // 48 x 48 px 

        this.BB = new BoundingBox(this.x, this.y, this.size, this.size, "chest");
       
    };

    update(){
        // if player attacks, remove chest entity (or show as opened) and display items on the ground
        // transistion to chest screen or auto collect?

    };

    draw(ctx) {
        ctx.drawImage(this.spritesheet, 0, 0, this.size, this.size, this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH);
        ctx.strokeStyle = "red";
        ctx.strokeRect(this.x, this.y, this.size, this.size);
    };
}

// speed
class SpeedPotion {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y});
        this.x *= PARAMS.BLOCKWIDTH;
        this.y *= PARAMS.BLOCKWIDTH;
        this.spritesheet = ASSET_MANAGER.getAsset("./assets/speedpotion.png");
        this.size = 48; // 48 x 48 px sprite but potion is placed in center different
        this.removeFromWorld = false;
        this.BB = new BoundingBox(this.x + 8, this.y  + 20, 32, 32, "speedpotion");
       
    };

    update(){

        let that = this;
        this.game.entities.forEach(function(entity) {
            if(entity.BB && entity.BB != that && that.BB.collide(entity.BB)) {
                if(entity.BB.name == "player")  {
                    that.removeFromWorld = true;
                }
            }
               
        })
    };

    draw(ctx) {
        ctx.drawImage(this.spritesheet, 0, 0, this.size, this.size, this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH);
        ctx.strokeStyle = "red";
        ctx.strokeRect(this.x + 8, this.y + 20, 32, 32);
    };
}


// health
class HealthPotion {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y});
        this.x *= PARAMS.BLOCKWIDTH;
        this.y *= PARAMS.BLOCKWIDTH;
        this.spritesheet = ASSET_MANAGER.getAsset("./assets/healthpotion.png");
        this.size = 48; // 48 x 48 px sprite but potion is placed in center different
        this.removeFromWorld = false;
        this.BB = new BoundingBox(this.x + 8, this.y  + 20, 32, 32, "healthpotion");
       
    };

    update(){
        let that = this;
        this.game.entities.forEach(function(entity) {
            if(entity.BB && entity.BB != that && that.BB.collide(entity.BB)) {
                if(entity.BB.name == "player")  {
                    that.removeFromWorld = true;
                }
            }  
        })
    };

    draw(ctx) {
        ctx.drawImage(this.spritesheet, 0, 0, this.size, this.size, this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH);
        ctx.strokeStyle = "red";
        ctx.strokeRect(this.x + 8, this.y + 20, 32, 32);
    };
}


// weapons

    // spear

    // sword

// armor