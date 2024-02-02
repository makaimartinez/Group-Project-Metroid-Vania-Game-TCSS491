class SceneManager {
    constructor(game) {
        this.gameEngine = game;
        // this.gameEngine.camera = this;
        this.x = 0;
        this.score = 0;
        this.coins = 0;
        this.lives = 3;

        // this.link = new Link();

        this.loadLevel();
    };

    clearEntities() {
            gameEngine.entities.forEach(function (entity) {
                entity.removeFromWorld = true;
            });
    };

    loadLevel() {
        let slime = new Slime(200, 480);


	    this.gameEngine.addEntity(slime);
        this.gameEngine.addEntity(new SpecterKnight(this.gameEngine, 300, 100, ASSET_MANAGER.getAsset("./assets/specter knight.png")));
        //this.gameEngine.addEntity(new Ground(this.gameEngine, 100, 300, 50));
        //this.gameEngine.addEntity(new Ground(this.gameEngine, 30, 600, 800));
	    this.gameEngine.addEntity(new Miku(this.gameEngine, 50, 50, ASSET_MANAGER.getAsset("./assets/miku spritesheet.png")));

        // Creating textured environment tiles (X and Y are multiplied by the size defined in each block's class)
        this.gameEngine.addEntity(new GrassTile(this.gameEngine, 8, 2));
        this.gameEngine.addEntity(new DirtTile(this.gameEngine, 8, 3));
        this.gameEngine.addEntity(new StoneTile(this.gameEngine, 9, 2));
        this.gameEngine.addEntity(new DevTile(this.gameEngine, 9, 3));
        this.gameEngine.addEntity(new GrassTile(this.gameEngine, 12, 9));



        // Types: 0 - Grass | 1 - Stone | 2 - Dirt | Any Other Int - Dev
        // Second argument is the total length in blocks
        this.drawFloor(0, 23, 11);
        this.drawFloor(2, 23, 12);
        this.drawFloor(2, 23, 13);

        // items
        this.gameEngine.addEntity(new Chest(this.gameEngine, 9, 10));


        // Draw Background last
        this.gameEngine.addEntity(new Background(this.gameEngine, 0));

    };

    drawFloor(theType, theLength, theLevel) {
        
        if (theType == '0') {
            console.log(theType);
            for (var i = 0; i < theLength; i++) {
                this.gameEngine.addEntity(new GrassTile(this.gameEngine, i, theLevel));
            };
        } else if (theType == '1') {

            console.log(theType);
            for (var i = 0; i < theLength; i++) {
                this.gameEngine.addEntity(new StoneTile(this.gameEngine, i, theLevel));
            }
        } else if (theType == '2') {

            console.log(theType);
            for (var i = 0; i < theLength; i++) {
                this.gameEngine.addEntity(new DirtTile(this.gameEngine, i, theLevel));
            }
        } else {

            console.log(theType);
            for (var i = 0; i < theLength; i++) {
                this.gameEngine.addEntity(new DevTile(this.gameEngine, i, theLevel));
            }
        };
    };

    update() {
        // PARAMS.DEBUG = document.getElementById("debug").checked;

        let midpoint = PARAMS.CANVAS_WIDTH/2 - PARAMS.BLOCKWIDTH / 2;

        // if (this.x < this.link.x - midpoint) this.x = this.link.x - midpoint;
        // this.x = this.link.x - midpoint;

        // NOTE: THIS FOLLOWING CODE HAS A BUG WHERE CANVAS COLOR WON'T CHANGE BACK TO BLUE.
        // var canvas = document.getElementById("gameWorld");
        // if (this.underground) {
        //     canvas.style.backgroundColor = "black";
        // } else {
        //     canvas.style.backgroundColor = "#049cd8";
        // }
    }

    draw(ctx) {
        if (PARAMS.DEBUG) {
            // let xV = "xV=" + Math.floor(gameEngine.link.x);
            // let yV = "yV=" + Math.floor(gameEngine.link.y);
            // ctx.fillText(xV, 1.5 * PARAMS.BLOCKWIDTH, 2.5 * PARAMS.BLOCKWIDTH);
            // ctx.fillText(yV, 1.5 * PARAMS.BLOCKWIDTH, 3 * PARAMS.BLOCKWIDTH);

            ctx.translate(0, -10); // hack to move elements up by 10 pixels instead of adding -10 to all y coordinates below
            ctx.strokeStyle = "White";
            ctx.lineWidth = 2;
            ctx.strokeStyle = gameEngine.left ? "White" : "Grey";
            ctx.fillStyle = ctx.strokeStyle;
            ctx.strokeRect(6 * PARAMS.BLOCKWIDTH - 2, 2.5 * PARAMS.BLOCKWIDTH - 2, 0.5 * PARAMS.BLOCKWIDTH + 2, 0.5 * PARAMS.BLOCKWIDTH + 2);
            ctx.fillText("L", 6 * PARAMS.BLOCKWIDTH, 3 * PARAMS.BLOCKWIDTH);
            ctx.strokeStyle = gameEngine.down ? "White" : "Grey";
            ctx.fillStyle = ctx.strokeStyle;
            ctx.strokeRect(6.5 * PARAMS.BLOCKWIDTH, 3 * PARAMS.BLOCKWIDTH, 0.5 * PARAMS.BLOCKWIDTH + 2, 0.5 * PARAMS.BLOCKWIDTH + 2);
            ctx.fillText("D", 6.5 * PARAMS.BLOCKWIDTH + 2, 3.5 * PARAMS.BLOCKWIDTH + 2);
            ctx.strokeStyle = gameEngine.up ? "White" : "Grey";
            ctx.fillStyle = ctx.strokeStyle;
            ctx.strokeRect(6.5 * PARAMS.BLOCKWIDTH, 2 * PARAMS.BLOCKWIDTH - 4, 0.5 * PARAMS.BLOCKWIDTH + 2, 0.5 * PARAMS.BLOCKWIDTH + 2);
            ctx.fillText("U", 6.5 * PARAMS.BLOCKWIDTH + 2, 2.5 * PARAMS.BLOCKWIDTH - 2);
            ctx.strokeStyle = gameEngine.right ? "White" : "Grey";
            ctx.fillStyle = ctx.strokeStyle;
            ctx.strokeRect(7 * PARAMS.BLOCKWIDTH + 2, 2.5 * PARAMS.BLOCKWIDTH - 2, 0.5 * PARAMS.BLOCKWIDTH + 2, 0.5 * PARAMS.BLOCKWIDTH + 2);
            ctx.fillText("R", 7 * PARAMS.BLOCKWIDTH + 4, 3 * PARAMS.BLOCKWIDTH);

            ctx.strokeStyle = gameEngine.A ? "White" : "Grey";
            ctx.fillStyle = ctx.strokeStyle;
            ctx.beginPath();
            ctx.arc(8.25 * PARAMS.BLOCKWIDTH + 2, 2.75 * PARAMS.BLOCKWIDTH, 0.25 * PARAMS.BLOCKWIDTH + 4, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fillText("A", 8 * PARAMS.BLOCKWIDTH + 4, 3 * PARAMS.BLOCKWIDTH);
            ctx.strokeStyle = gameEngine.B ? "White" : "Grey";
            ctx.fillStyle = ctx.strokeStyle;
            ctx.beginPath();
            ctx.arc(9 * PARAMS.BLOCKWIDTH + 2, 2.75 * PARAMS.BLOCKWIDTH, 0.25 * PARAMS.BLOCKWIDTH + 4, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fillText("B", 8.75 * PARAMS.BLOCKWIDTH + 4, 3 * PARAMS.BLOCKWIDTH);

            ctx.translate(0, 10);
            ctx.strokeStyle = "White";
            ctx.fillStyle = ctx.strokeStyle;
        }
    }
};