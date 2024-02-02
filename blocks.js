class Ground {
    constructor(game, x, y, w, spritesheet) {
        Object.assign(this, { game, x, y, w, spritesheet });

        this.BB = new BoundingBox(this.x, this.y, this.w, PARAMS.BLOCKWIDTH, "ground");
        // this.leftBB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2)
        // this.rightBB = new BoundingBox(this.x + this.w - PARAMS.BLOCKWIDTH, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2)
    };

    update(){

    };

    draw(ctx) {
        ctx.strokeStyle = "black";
        ctx.strokeRect(this.x, this.y, this.w, PARAMS.BLOCKWIDTH);
    };
}

class GrassTile {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
        this.size = 64;
        this.x *= this.size;
        this.y *= this.size;
        this.spritesheet = ASSET_MANAGER.getAsset("./assets/bg_groundTiles.png");

        this.BB = new BoundingBox(this.x, this.y, this.size, PARAMS.BLOCKWIDTH, "ground");
        // this.leftBB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2)
        // this.rightBB = new BoundingBox(this.x + this.w - PARAMS.BLOCKWIDTH, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2)
    };

    update() {

    };

    draw(ctx, game) {
        ctx.drawImage(this.spritesheet, 0, 0, 32, 32, this.x, this.y, this.size, this.size);
        //ctx.strokeStyle = "black";
        //ctx.strokeRect(this.x, this.y, this.size, this.size);
    };
}

class StoneTile {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
        this.size = 64;
        this.x *= this.size;
        this.y *= this.size;
        this.spritesheet = ASSET_MANAGER.getAsset("./assets/bg_groundTiles.png");

        this.BB = new BoundingBox(this.x, this.y, this.size, PARAMS.BLOCKWIDTH, "ground");
        // this.leftBB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2)
        // this.rightBB = new BoundingBox(this.x + this.w - PARAMS.BLOCKWIDTH, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2)
    };

    update() {

    };

    draw(ctx, game) {
        ctx.drawImage(this.spritesheet, 32, 0, 32, 32, this.x, this.y, this.size, this.size);
        //ctx.strokeStyle = "black";
        //ctx.strokeRect(this.x, this.y, this.size, this.size);
    };
}

class DirtTile {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
        this.size = 64;
        this.x *= this.size;
        this.y *= this.size;
        this.spritesheet = ASSET_MANAGER.getAsset("./assets/bg_groundTiles.png");

        this.BB = new BoundingBox(this.x, this.y, this.size, PARAMS.BLOCKWIDTH, "ground");
        // this.leftBB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2)
        // this.rightBB = new BoundingBox(this.x + this.w - PARAMS.BLOCKWIDTH, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2)
    };

    update() {

    };

    draw(ctx, game) {
        ctx.drawImage(this.spritesheet, 64, 0, 32, 32, this.x, this.y, this.size, this.size);
        //ctx.strokeStyle = "black";
        //ctx.strokeRect(this.x, this.y, this.size, this.size);
    };
}

class DevTile {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
        this.size = 64;
        this.x *= this.size;
        this.y *= this.size;
        this.spritesheet = ASSET_MANAGER.getAsset("./assets/bg_groundTiles.png");

        this.BB = new BoundingBox(this.x, this.y, this.size, PARAMS.BLOCKWIDTH, "ground");
        // this.leftBB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2)
        // this.rightBB = new BoundingBox(this.x + this.w - PARAMS.BLOCKWIDTH, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2)
    };

    update() {

    };

    draw(ctx, game) {
        ctx.drawImage(this.spritesheet, 96, 0, 32, 32, this.x, this.y, this.size, this.size);
        //ctx.strokeStyle = "black";
        //ctx.strokeRect(this.x, this.y, this.size, this.size);
    };
}
