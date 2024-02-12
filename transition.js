class TransitionScreen {
    constructor(game, level, x, y, gameOver, loading) {
        Object.assign(this, { game, level, x, y, gameOver, loading });

        this.elapsed = 0;
    };

    update() {
        this.elapsed += this.game.clockTick;
        this.titleActive = false;
        if (this.elapsed > 2) this.game.camera.loadLevel(this.level, this.x, this.y, false, this.gameOver); // after 2 secs load level but false in transition flag to end transition
    };

    draw(ctx) {
        ctx.fillStyle = "Black";
        ctx.fillRect(0, 0, PARAMS.CANVAS_WIDTH, PARAMS.CANVAS_HEIGHT);

        ctx.font = PARAMS.BLOCKWIDTH / 2 + 'px "Press Start 2P"';
        ctx.fillStyle = "White";

        if (this.loading) {
            ctx.fillText("LOADING...", 8.5 * PARAMS.BLOCKWIDTH, 9.5 * PARAMS.BLOCKWIDTH);
        }

        if (this.gameOver) {
            ctx.fillText("GAME OVER", 8.5 * PARAMS.BLOCKWIDTH, 4 * PARAMS.BLOCKWIDTH);
        }
    };

    // drawMinimap() {

    // };
};