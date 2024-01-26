class Ground {
    constructor(game, x, y, w, spritesheet) {
        Object.assign(this, { game, x, y, w, spritesheet});

        this.BB = new BoundingBox(this.x, this.y, this.w, PARAMS.BLOCKWIDTH, "ground");
        // this.leftBB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2)
        // this.rightBB = new BoundingBox(this.x + this.w - PARAMS.BLOCKWIDTH, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2)
    };

    update(){

    };

    draw(ctx) {
        ctx.strokeRect(this.x, this.y, this.w, PARAMS.BLOCKWIDTH);
    };
}