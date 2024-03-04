class TransitionScreen {
    constructor(game, title, gameOver, transition ) {
        Object.assign(this, { game, title, gameOver, transition });
        this.elapsed = 0;
        this.titlescreen = ASSET_MANAGER.getAsset("./assets/title screen.png");
        this.titlecard = ASSET_MANAGER.getAsset("./assets/title.png");
        this.transitionscreen = ASSET_MANAGER.getAsset("./assets/transitionscreen.png");
        this.gameoverscreen = ASSET_MANAGER.getAsset("./assets/defeatscreen.png");

    };

    update() {
        this.elapsed += this.game.clockTick;
        this.titleActive = false;

        if (this.title && this.game.leftclick) {
            if (this.game.leftclick && this.game.click.y > 7 * PARAMS.BLOCKWIDTH && this.game.click.y < 8 * PARAMS.BLOCKWIDTH) {  
                this.game.camera.loadGame(true, false, false, false); // calls transition screen branch in scenemanager
                // this.game.camera.loadGame(false, false, false, true); // calls respawn screen branch in scenemanager

            }
        }
        else if (this.gameOver) {
            if(this.elapsed > 4) {
                this.game.camera.loadGame(false,true,false,false);  // calls title screen branch in scenemanager
            }
        } else if (this.transition){
            if (this.elapsed > 2) {
                // after 2 secs load level but false in transition flag to end transition
                // this.game.camera.loadLevel(this.level, this.x, this.y, false, this.gameOver);
                this.game.camera.loadGame(false, false, false, false);  // no title, transition, game over or respawn
            }
        }
    };

    draw(ctx) {

        ctx.font = PARAMS.BLOCKWIDTH / 2 + 'px "Press Start 2P"';
        ctx.fillStyle = "White";

        if (this.title) {
            var width = 140;
            var height = 70;

            ctx.drawImage(this.titlescreen, 0, 0, PARAMS.CANVAS_WIDTH, PARAMS.CANVAS_HEIGHT);
            ctx.font = PARAMS.BLOCKWIDTH / 1.5 + 'px "Press Start 2P"';
            ctx.fillStyle = "White";
            var titlecardplace = (PARAMS.CANVAS_WIDTH / 2) - (width  * PARAMS.SCALE/ 2);
            ctx.drawImage(this.titlecard, titlecardplace, 1.5 * PARAMS.BLOCKWIDTH, width * PARAMS.SCALE, height * PARAMS.SCALE);
            ctx.fillStyle = this.game.mouse && this.game.mouse.y > 7 * PARAMS.BLOCKWIDTH && this.game.mouse.y < 8 * PARAMS.BLOCKWIDTH ? "Grey" : "White";
            ctx.fillText("START", 9 * PARAMS.BLOCKWIDTH, 8 * PARAMS.BLOCKWIDTH);
        } 
        if (this.transition) {
            ctx.drawImage(this.transitionscreen, 0, 0, PARAMS.CANVAS_WIDTH, PARAMS.CANVAS_HEIGHT);
        }

        if (this.gameOver) {
            ctx.drawImage(this.gameoverscreen, 0, 0, PARAMS.CANVAS_WIDTH, PARAMS.CANVAS_HEIGHT);
        }
    };

    // drawMinimap() {

    // };
};