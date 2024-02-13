class SceneManager {
    constructor(game) {
        this.gameEngine = game;
        this.gameEngine.camera = this;
        this.x = 0;
        this.y = 0;
        this.score = 0;
        this.coins = 0;
        this.lives = 3;

        this.player = new Player(this.gameEngine, 0, 300, ASSET_MANAGER.getAsset("./assets/pack_loreon_char_free_modified.png"))

        this.title = true;
        this.transition = false;
        this.level = null;
        this.loadLevel(levelOne, 0, 300, this.transition, this.title);
    };

    clearEntities() {
            gameEngine.entities.forEach(function (entity) {
                entity.removeFromWorld = true;
            });
    };

    loadLevel(level, x, y, transition, title) {
        this.title = title;
        this.level = level;
        this.loading = true;
        this.clearEntities();
        this.x = 0;     // reset camera 

        if (transition) {
            this.gameEngine.titleActive = false;
            this.gameEngine.addEntity(new TransitionScreen(this.gameEngine, level, x, y, title, this.loading));
        } else {
            this.transition = false
            // this.gameEngine.addEntity(new Slime(200, 480));
            // this.gameEngine.addEntity(new skelly(this.gameEngine, 400, 420, ASSET_MANAGER.getAsset("./assets/Skeleton_spritesheet.png")));
            // this.gameEngine.addEntity(new SpecterKnight(this.gameEngine, 600, 200, ASSET_MANAGER.getAsset("./assets/specter knight.png")));
            //this.gameEngine.addEntity(new Ground(this.gameEngine, 100, 300, 50));
            //this.gameEngine.addEntity(new Ground(this.gameEngine, 30, 600, 800));
            // this.gameEngine.addEntity(new Miku(this.gameEngine, 50, 50, ASSET_MANAGER.getAsset("./assets/miku spritesheet.png")));
            this.gameEngine.addEntity(new Player(this.gameEngine, 80, 300, ASSET_MANAGER.getAsset("./assets/pack_loreon_char_free_modified.png")));
            // Creating textured environment tiles (X and Y are multiplied by the size defined in each block's class)
            // this.gameEngine.addEntity(new GrassTile(this.gameEngine, 15, 2));
            // this.gameEngine.addEntity(new DirtTile(this.gameEngine, 15, 3));
            // this.gameEngine.addEntity(new StoneTile(this.gameEngine, 16, 2));
            // this.gameEngine.addEntity(new DevTile(this.gameEngine, 16, 3));
            // this.gameEngine.addEntity(new GrassTile(this.gameEngine, 4, 9));
            // this.gameEngine.addEntity(new GrassTile(this.gameEngine, 6, 7));
            // this.gameEngine.addEntity(new GrassTile(this.gameEngine, 9, 7));
            // this.gameEngine.addEntity(new GrassTile(this.gameEngine, 10, 7));
            // this.gameEngine.addEntity(new GrassTile(this.gameEngine, 11, 7));

            // Types: 0 - Grass | 1 - Stone | 2 - Dirt | Any Other Int - Dev
            // Second argument is the total length in blocks
            this.drawFloor(0, 0, 13, 11);
            this.drawFloor(2, 0, 13, 12);
            this.drawFloor(2, 0, 13, 13);

            // this.drawFloor(0, 16, 7, 11);
            // this.drawFloor(2, 16, 7, 12);
            // this.drawFloor(2, 16, 7, 13);

            // items
            this.gameEngine.addEntity(new Chest(this.gameEngine, 9, 10));
            this.gameEngine.addEntity(new Potion(this.gameEngine, 3, 10, 0, false));       // Health
            this.gameEngine.addEntity(new Potion(this.gameEngine, 4, 10, 1, false));       // Speed


            // Draw Background last
            this.gameEngine.addEntity(new Background(this.gameEngine, 0));

            // PLAYER
            this.player.x = x;
            this.player.y = y;
            this.player.removeFromWorld = false;      // I want player to be persistent after removing him from the world in loadGame()
            // this.player.velocity = { x: 0, y: 0 };    
            this.player.state = 0                     // player enters level in right facing state;

            var that = this;
            var player = false;
            this.gameEngine.entities.forEach(function(entity) {       // if player is there dont add him in
                if(that.player instanceof Player) player = true;
            });
            if(!player) this.gameEngine.addEntity(this.player);           // if player is not there add him.
        
            this.gameEngine.camera.paused = false;
        }

    };

    drawFloor(theType, theStartX, theLength, theLevel) {
        
        // if(PARAMS.DEBUG) console.log(theType);

        if (theType == '0') {
            for (var i = 0; i < theLength; i++) {
                this.gameEngine.addEntity(new GrassTile(this.gameEngine, theStartX + i, theLevel));
            };
        } else if (theType == '1') {
            for (var i = 0; i < theLength; i++) {
                this.gameEngine.addEntity(new StoneTile(this.gameEngine, theStartX + i, theLevel));
            }
        } else if (theType == '2') {
            for (var i = 0; i < theLength; i++) {
                this.gameEngine.addEntity(new DirtTile(this.gameEngine, theStartX + i, theLevel));
            }
        } else {
            for (var i = 0; i < theLength; i++) {
                this.gameEngine.addEntity(new DevTile(this.gameEngine, theStartX + i, theLevel));
            }
        };
    };

    update() {
        PARAMS.DEBUG = document.getElementById("debug").checked;

        let midpoint = PARAMS.CANVAS_WIDTH/2 - PARAMS.BLOCKWIDTH / 2;

        if (this.x < this.player.x - midpoint) this.x = this.player.x - midpoint;

        if (this.title && this.gameEngine.click) {
            if (this.gameEngine.click && this.gameEngine.click.y > 9 * PARAMS.BLOCKWIDTH && this.gameEngine.mouse.y < 9.5 * PARAMS.BLOCKWIDTH) {
                this.title = false;
                this.player = new Player(this.gameEngine, 2.5 * PARAMS.BLOCKWIDTH, 6 * PARAMS.BLOCKWIDTH);
                this.loadLevel(levelOne, 2.5 * PARAMS.BLOCKWIDTH, 10 * PARAMS.BLOCKWIDTH, true); // SETS STARTING POSITION
            }
        // } else {
        //     this.player = new Player(this.gameEngine, 2.5 * PARAMS.BLOCKWIDTH, 0 * PARAMS.BLOCKWIDTH);
        //     this.loadLevel(levelOne, 2.5 * PARAMS.BLOCKWIDTH, 0, true);
        }

    }

    draw(ctx) {
        ctx.font = PARAMS.BLOCKWIDTH / 2 + 'px "Press Start 2P"';
        ctx.fillStyle = "White";
        if (this.title) {
            this.gameEngine.titleActive = true;
            var width = 180;
            var height = 90;
            const titlecard = ASSET_MANAGER.getAsset("./assets/title.png");
            ctx.drawImage(titlecard, 5.0 * PARAMS.BLOCKWIDTH, 2 * PARAMS.BLOCKWIDTH, width * PARAMS.SCALE, height * PARAMS.SCALE);
            ctx.fillStyle = this.gameEngine.mouse && this.gameEngine.mouse.y > 9 * PARAMS.BLOCKWIDTH && this.gameEngine.mouse.y < 9.5 * PARAMS.BLOCKWIDTH ? "Grey" : "White";
            ctx.fillText("START", 9 * PARAMS.BLOCKWIDTH, 9.5 * PARAMS.BLOCKWIDTH);


            


        } else if (PARAMS.DEBUG && !this.transition) {
            let xV = "xV=" + Math.floor(this.gameEngine.player.x);
            let yV = "yV=" + Math.floor(this.gameEngine.player.y);
            ctx.fillText(xV, 1.5 * PARAMS.BLOCKWIDTH, 2.5 * PARAMS.BLOCKWIDTH);
            ctx.fillText(yV, 1.5 * PARAMS.BLOCKWIDTH, 3 * PARAMS.BLOCKWIDTH);

            // CONTROLS DEBUG
            // ctx.translate(0, -10); // hack to move elements up by 10 pixels instead of adding -10 to all y coordinates below
            // ctx.strokeStyle = "White";
            // ctx.lineWidth = 2;
            // ctx.strokeStyle = this.gameEngine.left ? "White" : "Grey";
            // ctx.fillStyle = ctx.strokeStyle;
            // ctx.strokeRect(6 * PARAMS.BLOCKWIDTH - 2, 2.5 * PARAMS.BLOCKWIDTH - 2, 0.5 * PARAMS.BLOCKWIDTH + 2, 0.5 * PARAMS.BLOCKWIDTH + 2);
            // ctx.fillText("L", 6.5 * PARAMS.BLOCKWIDTH, 3 * PARAMS.BLOCKWIDTH);
            // ctx.strokeStyle = this.gameEngine.down ? "White" : "Grey";
            // ctx.fillStyle = ctx.strokeStyle;
            // ctx.strokeRect(6.5 * PARAMS.BLOCKWIDTH, 3 * PARAMS.BLOCKWIDTH, 0.5 * PARAMS.BLOCKWIDTH + 2, 0.5 * PARAMS.BLOCKWIDTH + 2);
            // ctx.fillText("D", 7 * PARAMS.BLOCKWIDTH + 2, 3.5 * PARAMS.BLOCKWIDTH + 2);
            // ctx.strokeStyle = this.gameEngine.up ? "White" : "Grey";
            // ctx.fillStyle = ctx.strokeStyle;
            // ctx.strokeRect(6.5 * PARAMS.BLOCKWIDTH, 2 * PARAMS.BLOCKWIDTH - 4, 0.5 * PARAMS.BLOCKWIDTH + 2, 0.5 * PARAMS.BLOCKWIDTH + 2);
            // ctx.fillText("U", 7 * PARAMS.BLOCKWIDTH + 2, 2.5 * PARAMS.BLOCKWIDTH - 2);
            // ctx.strokeStyle = this.gameEngine.right ? "White" : "Grey";
            // ctx.fillStyle = ctx.strokeStyle;
            // ctx.strokeRect(7 * PARAMS.BLOCKWIDTH + 2, 2.5 * PARAMS.BLOCKWIDTH - 2, 0.5 * PARAMS.BLOCKWIDTH + 2, 0.5 * PARAMS.BLOCKWIDTH + 2);
            // ctx.fillText("R", 7.5 * PARAMS.BLOCKWIDTH + 4, 3 * PARAMS.BLOCKWIDTH);

            // ctx.strokeStyle = this.gameEngine.A ? "White" : "Grey";
            // ctx.fillStyle = ctx.strokeStyle;
            // ctx.beginPath();
            // ctx.arc(8.25 * PARAMS.BLOCKWIDTH + 2, 2.75 * PARAMS.BLOCKWIDTH, 0.25 * PARAMS.BLOCKWIDTH + 4, 0, 2 * Math.PI);
            // ctx.stroke();
            // ctx.fillText("A", 8.5 * PARAMS.BLOCKWIDTH + 4, 3 * PARAMS.BLOCKWIDTH);
            // ctx.strokeStyle = this.gameEngine.B ? "White" : "Grey";
            // ctx.fillStyle = ctx.strokeStyle;
            // ctx.beginPath();
            // ctx.arc(9 * PARAMS.BLOCKWIDTH + 2, 2.75 * PARAMS.BLOCKWIDTH, 0.25 * PARAMS.BLOCKWIDTH + 4, 0, 2 * Math.PI);
            // ctx.stroke();
            // ctx.fillText("B", 9.25 * PARAMS.BLOCKWIDTH + 4, 3 * PARAMS.BLOCKWIDTH);

            // ctx.translate(0, 10);
            // ctx.strokeStyle = "White";
            // ctx.fillStyle = ctx.strokeStyle;
        } else if (!this.title && !this.transition) {
            this.titleActive = false;

            // HUD
            // Health Bar
            ctx.fillText("HP", PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH);
            ctx.strokeStyle = "Green";
            ctx.fillStyle = ctx.strokeStyle;
            ctx.fillRect(PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH, this.player.health * 10, 0.5 * PARAMS.BLOCKWIDTH + 2);
            ctx.strokeStyle = "Black";
            ctx.strokeRect(PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH, 100, 0.5 * PARAMS.BLOCKWIDTH + 2);
            
        }
    }
};