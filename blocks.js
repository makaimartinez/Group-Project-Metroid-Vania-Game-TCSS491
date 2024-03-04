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
        this.useable = true;
        this.spritesheet = ASSET_MANAGER.getAsset("./assets/bg_door.png");

        this.BB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH*2, "door");
        // this.leftBB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2)
        // this.rightBB = new BoundingBox(this.x + this.w - PARAMS.BLOCKWIDTH, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2)
    };

    update() {

    };

    draw(ctx, game) {
        if (this.useable){
            ctx.drawImage(this.spritesheet, 0, 0, 32, 64,
                this.x - game.camera.x, this.y,
                PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH*2);
            if (PARAMS.DEBUG) {
                ctx.strokeStyle = "blue";
                this.BB.draw(ctx, game.camera);
            }
        }
    };

    use() {
        this.useable = false;
    };

}

class Tree {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
        this.x *= PARAMS.BLOCKWIDTH;
        this.y *= PARAMS.BLOCKWIDTH;
        this.moe = 3;
        this.spritesheet = ASSET_MANAGER.getAsset("./assets/bg_tree.png");

        this.BB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH*4, PARAMS.BLOCKWIDTH*4, "none");
        // this.leftBB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2)
        // this.rightBB = new BoundingBox(this.x + this.w - PARAMS.BLOCKWIDTH, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2)
    };

    update() {

    };

    draw(ctx, game) {
        ctx.drawImage(this.spritesheet, 0, 0, 128, 128,
            this.x - game.camera.x-this.moe, this.y-this.moe,
            PARAMS.BLOCKWIDTH*4+(this.moe*2), PARAMS.BLOCKWIDTH*4+(this.moe*2));
        if (PARAMS.DEBUG) {
            ctx.strokeStyle = "pink";
            this.BB.draw(ctx, game.camera);
        }
    };
}

class Bush {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
        this.x *= PARAMS.BLOCKWIDTH;
        this.y *= PARAMS.BLOCKWIDTH;
        this.moe = 3;
        this.spritesheet = ASSET_MANAGER.getAsset("./assets/bg_bush.png");

        this.BB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH*2, PARAMS.BLOCKWIDTH, "none");
        // this.leftBB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2)
        // this.rightBB = new BoundingBox(this.x + this.w - PARAMS.BLOCKWIDTH, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2)
    };

    update() {

    };

    draw(ctx, game) {
        ctx.drawImage(this.spritesheet, 0, 0, 64, 32,
            this.x - game.camera.x-this.moe, this.y-this.moe,
            PARAMS.BLOCKWIDTH*2+(this.moe*2), PARAMS.BLOCKWIDTH+(this.moe*2));
        if (PARAMS.DEBUG) {
            ctx.strokeStyle = "pink";
            this.BB.draw(ctx, game.camera);
        }
    };
}

class GrassTile {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
        this.x *= PARAMS.BLOCKWIDTH;
        this.y *= PARAMS.BLOCKWIDTH;
        this.moe = 3;
        this.spritesheet = ASSET_MANAGER.getAsset("./assets/bg_groundTiles.png");

        this.BB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH, "ground");
        // this.leftBB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2)
        // this.rightBB = new BoundingBox(this.x + this.w - PARAMS.BLOCKWIDTH, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2)
    };

    update() {

    };

    draw(ctx, game) {
        ctx.drawImage(this.spritesheet, 0, 0, 31, 32,
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
        this.moe = 2;
        this.spritesheet = ASSET_MANAGER.getAsset("./assets/bg_groundTiles.png");

        this.BB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH, "ground");
        // this.leftBB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2)
        // this.rightBB = new BoundingBox(this.x + this.w - PARAMS.BLOCKWIDTH, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2)
    };

    update() {

    };

    draw(ctx, game) {
        ctx.drawImage(this.spritesheet, 32, 0, 31, 32,
            this.x - game.camera.x-this.moe, this.y-this.moe,
            PARAMS.BLOCKWIDTH+(this.moe*2), PARAMS.BLOCKWIDTH+(this.moe*2));
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
        this.moe = 3;
        this.spritesheet = ASSET_MANAGER.getAsset("./assets/bg_groundTiles.png");

        this.BB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH, "ground");
        // this.leftBB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2)
        // this.rightBB = new BoundingBox(this.x + this.w - PARAMS.BLOCKWIDTH, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2)
    };

    update() {

    };

    draw(ctx, game) {
        ctx.drawImage(this.spritesheet, 64, 0, 31, 32,
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

class KillBarrier {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
        this.x *= PARAMS.BLOCKWIDTH;
        this.y *= PARAMS.BLOCKWIDTH;

        this.BB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH, "killbarrier");
        // this.leftBB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2)
        // this.rightBB = new BoundingBox(this.x + this.w - PARAMS.BLOCKWIDTH, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2)
    };

    update() {

    };

    draw(ctx, game) {
        // ctx.drawImage(this.spritesheet, 96, 0, 32, 32,
        //     this.x - game.camera.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH);

        if (PARAMS.DEBUG) {
            ctx.strokeStyle = "Red";
            this.BB.draw(ctx, game.camera);
            ctx.fillText("PIT ", this.x + 30 - game.camera.x, this.y - (PARAMS.BLOCKWIDTH*3)+10);
        }
    };
}

class Background_Day {
    constructor(game, x) {
        Object.assign(this, { game, x });
        this.spritesheet = ASSET_MANAGER.getAsset("./assets/bg_background.png");
        this.BB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH, "none");
    };

    update() {

    };

    draw(ctx, game) {
        ctx.drawImage(this.spritesheet, this.x + (game.camera.x / 4), 0,
            PARAMS.CANVAS_WIDTH*2, PARAMS.CANVAS_HEIGHT*2, 0, 0, PARAMS.CANVAS_WIDTH*2, PARAMS.CANVAS_HEIGHT*2);
        ctx.drawImage(this.spritesheet, this.x + (game.camera.x / 2), 640,
            PARAMS.CANVAS_WIDTH*2, PARAMS.CANVAS_HEIGHT*2, 0, 0, PARAMS.CANVAS_WIDTH*2, PARAMS.CANVAS_HEIGHT*2);
    };
}


class Background_Cave {
    constructor(game, x) {
        Object.assign(this, { game, x });
        this.spritesheet = ASSET_MANAGER.getAsset("./assets/bg_backgroundUG.png");
        this.BB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH, "none");
    };

    update() {

    };

    draw(ctx, game) {
        ctx.drawImage(this.spritesheet, this.x + (game.camera.x / 8), 0,
            PARAMS.CANVAS_WIDTH*2, PARAMS.CANVAS_HEIGHT*2, 0, 0, PARAMS.CANVAS_WIDTH*2, PARAMS.CANVAS_HEIGHT*2);
            ctx.drawImage(this.spritesheet, this.x + (game.camera.x / 6), 1280,
                PARAMS.CANVAS_WIDTH*2, PARAMS.CANVAS_HEIGHT*2, 0, 0, PARAMS.CANVAS_WIDTH*2, PARAMS.CANVAS_HEIGHT*2);
            ctx.drawImage(this.spritesheet, this.x + (game.camera.x / 4), 1920,
                PARAMS.CANVAS_WIDTH*2, PARAMS.CANVAS_HEIGHT*2, 0, 0, PARAMS.CANVAS_WIDTH*2, PARAMS.CANVAS_HEIGHT*2);
            ctx.drawImage(this.spritesheet, this.x + (game.camera.x / 2), 640,
                PARAMS.CANVAS_WIDTH*2, PARAMS.CANVAS_HEIGHT*2, 0, 0, PARAMS.CANVAS_WIDTH*2, PARAMS.CANVAS_HEIGHT*2);
    };
}
