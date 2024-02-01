class Chest {
    constructor(game, x, y, w, spritesheet) {
        Object.assign(this, { game, x, y, spritesheet});

        this.BB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH, "chest");
       
    };

    update(){

    };

    draw(ctx) {
        ctx.drawImage(this.spritesheet, 0, 0, 32, 32, this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH);
        ctx.strokeStyle = "black";
        ctx.strokeRect(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH);
    };
}