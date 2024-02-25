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
        if (PARAMS.DEBUG) {
            ctx.strokeStyle = "black";
            this.BB.draw(ctx, game.camera);
        }
    };
}

class NextLevelDoor {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
        this.x *= PARAMS.BLOCKWIDTH;
        this.y *= PARAMS.BLOCKWIDTH;
        this.spritesheet = ASSET_MANAGER.getAsset("./assets/bg_door.png");

        this.BB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH*2, "door");
        // this.leftBB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2)
        // this.rightBB = new BoundingBox(this.x + this.w - PARAMS.BLOCKWIDTH, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2)
    };

    update() {

    };

    draw(ctx, game) {
        ctx.drawImage(this.spritesheet, 0, 0, 32, 64,
            this.x - game.camera.x, this.y,
            PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH*2);
        if (PARAMS.DEBUG) {
            ctx.strokeStyle = "blue";
            this.BB.draw(ctx, game.camera);
        }
    };
}

class GrassTile {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
        this.x *= PARAMS.BLOCKWIDTH;
        this.y *= PARAMS.BLOCKWIDTH;
        this.moe = 1;
        this.spritesheet = ASSET_MANAGER.getAsset("./assets/bg_groundTiles.png");

        this.BB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH, "ground");
        // this.leftBB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2)
        // this.rightBB = new BoundingBox(this.x + this.w - PARAMS.BLOCKWIDTH, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2)
    };

    update() {

    };

    draw(ctx, game) {
        ctx.drawImage(this.spritesheet, 0, 0, 32, 32,
            this.x - game.camera.x-this.moe, this.y-this.moe,
            PARAMS.BLOCKWIDTH+(this.moe*2), PARAMS.BLOCKWIDTH+(this.moe*2));
        if (PARAMS.DEBUG) {
            ctx.strokeStyle = "black";
            this.BB.draw(ctx, game.camera);
        }
    };
}

class StoneTile {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
        this.x *= PARAMS.BLOCKWIDTH;
        this.y *= PARAMS.BLOCKWIDTH;
        this.spritesheet = ASSET_MANAGER.getAsset("./assets/bg_groundTiles.png");

        this.BB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH, "ground");
        // this.leftBB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2)
        // this.rightBB = new BoundingBox(this.x + this.w - PARAMS.BLOCKWIDTH, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2)
    };

    update() {

    };

    draw(ctx, game) {
        ctx.drawImage(this.spritesheet, 32, 0, 32, 32,
            this.x - game.camera.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH);

        if (PARAMS.DEBUG) {
            ctx.strokeStyle = "black";
            this.BB.draw(ctx, game.camera);
        }
    };
}

class DirtTile {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
        this.x *= PARAMS.BLOCKWIDTH;
        this.y *= PARAMS.BLOCKWIDTH;
        this.moe = 1;
        this.spritesheet = ASSET_MANAGER.getAsset("./assets/bg_groundTiles.png");

        this.BB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH, "ground");
        // this.leftBB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2)
        // this.rightBB = new BoundingBox(this.x + this.w - PARAMS.BLOCKWIDTH, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2)
    };

    update() {

    };

    draw(ctx, game) {
        ctx.drawImage(this.spritesheet, 64, 0, 32, 32,
            this.x - game.camera.x-this.moe, this.y-this.moe,
            PARAMS.BLOCKWIDTH+(this.moe*2), PARAMS.BLOCKWIDTH+(this.moe*2));

        if (PARAMS.DEBUG) {
            ctx.strokeStyle = "black";
            this.BB.draw(ctx, game.camera);
        }
    };
}

class DevTile {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
        this.x *= PARAMS.BLOCKWIDTH;
        this.y *= PARAMS.BLOCKWIDTH;
        this.spritesheet = ASSET_MANAGER.getAsset("./assets/bg_groundTiles.png");

        this.BB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH, "ground");
        // this.leftBB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2)
        // this.rightBB = new BoundingBox(this.x + this.w - PARAMS.BLOCKWIDTH, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2)
    };

    update() {

    };

    draw(ctx, game) {
        ctx.drawImage(this.spritesheet, 96, 0, 32, 32,
            this.x - game.camera.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH);

        if (PARAMS.DEBUG) {
            ctx.strokeStyle = "black";
            this.BB.draw(ctx, game.camera);
        }
    };
}

class InvWallTile {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
        this.x *= PARAMS.BLOCKWIDTH;
        this.y *= PARAMS.BLOCKWIDTH;
        this.spritesheet = ASSET_MANAGER.getAsset("./assets/bg_groundTiles.png");

        this.BB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH, "ground");
        // this.leftBB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2)
        // this.rightBB = new BoundingBox(this.x + this.w - PARAMS.BLOCKWIDTH, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2)
    };

    update() {

    };

    draw(ctx, game) {
        // ctx.drawImage(this.spritesheet, 96, 0, 32, 32,
        //     this.x - game.camera.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH);

        if (PARAMS.DEBUG) {
            ctx.strokeStyle = "black";
            this.BB.draw(ctx, game.camera);
        }
    };
}

class Background {
    constructor(game, x) {
        Object.assign(this, { game, x });
        this.spritesheet = ASSET_MANAGER.getAsset("./assets/bg_background.png");
        this.BB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH, "none");

        // this.leftBB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2)
        // this.rightBB = new BoundingBox(this.x + this.w - PARAMS.BLOCKWIDTH, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2)
    };

    update() {

    };

    draw(ctx, game) {
        ctx.drawImage(this.spritesheet, this.x + (game.camera.x / 2), 0,
            PARAMS.CANVAS_WIDTH*2, PARAMS.CANVAS_HEIGHT*2, 0, 0, PARAMS.CANVAS_WIDTH*2, PARAMS.CANVAS_HEIGHT*2);
    };
}
