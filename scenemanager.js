class SceneManager {
    constructor(game, theLevel) {
        this.gameEngine = game;
        this.gameEngine.camera = this;
        this.x = 0;
        this.score = 0;
        this.coins = 0;
        this.levelNum = theLevel;

        this.player = new Player(this.gameEngine, 100, 440, ASSET_MANAGER.getAsset("./assets/pack_loreon_char_free_modified.png"))

        this.levels = [
            new levelOne(this.gameEngine, this.player),
            new levelTwo(this.gameEngine, this.player),
            new bossLevel(this.gameEngine, this.player)
        ];

        // this.checkLevel(this.level);
        this.currentLevel = this.levels[this.levelNum];
        console.log(this.levels);
        this.currentLevel.getAssets().forEach((element) => this.gameEngine.addEntity(element));


        // build level 1
        // build level 2
        // lvl2.getAssets().forEach((element) => this.gameEngine.addEntity(element));

    };

    clearEntities() {
            gameEngine.entities.forEach(function (entity) {
                entity.removeFromWorld = true;
            });
    };

    // check HTML elements
    updateAudio() {
        var mute = document.getElementById("mute").checked;
        var volume = document.getElementById("volume").value;

        ASSET_MANAGER.muteAudio(mute);
        ASSET_MANAGER.adjustVolume(volume);
    }

    update() {
        PARAMS.DEBUG = document.getElementById("debug").checked;
        this.updateAudio();

        let midpoint = PARAMS.CANVAS_WIDTH/2 - PARAMS.BLOCKWIDTH / 2;
        
        this.x = this.player.x - midpoint;

        if (this.player.respawn) {
            // create new player
            //this.player = new Player(this.gameEngine, 100, 300, ASSET_MANAGER.getAsset("./assets/pack_loreon_char_free_modified.png"))
        }
    }

    draw(ctx) {
        if (PARAMS.DEBUG) {
            // shows keys
            // ctx.translate(0, -10); // hack to move elements up by 10 pixels instead of adding -10 to all y coordinates below
            // ctx.strokeStyle = "White";
            // ctx.lineWidth = 2;
            // ctx.strokeStyle = gameEngine.left ? "White" : "Grey";
            // ctx.fillStyle = ctx.strokeStyle;
            // ctx.strokeRect(6 * PARAMS.BLOCKWIDTH - 2, 2.5 * PARAMS.BLOCKWIDTH - 2, 0.5 * PARAMS.BLOCKWIDTH + 2, 0.5 * PARAMS.BLOCKWIDTH + 2);
            // ctx.fillText("L", 6 * PARAMS.BLOCKWIDTH, 3 * PARAMS.BLOCKWIDTH);
            // ctx.strokeStyle = gameEngine.down ? "White" : "Grey";
            // ctx.fillStyle = ctx.strokeStyle;
            // ctx.strokeRect(6.5 * PARAMS.BLOCKWIDTH, 3 * PARAMS.BLOCKWIDTH, 0.5 * PARAMS.BLOCKWIDTH + 2, 0.5 * PARAMS.BLOCKWIDTH + 2);
            // ctx.fillText("D", 6.5 * PARAMS.BLOCKWIDTH + 2, 3.5 * PARAMS.BLOCKWIDTH + 2);
            // ctx.strokeStyle = gameEngine.up ? "White" : "Grey";
            // ctx.fillStyle = ctx.strokeStyle;
            // ctx.strokeRect(6.5 * PARAMS.BLOCKWIDTH, 2 * PARAMS.BLOCKWIDTH - 4, 0.5 * PARAMS.BLOCKWIDTH + 2, 0.5 * PARAMS.BLOCKWIDTH + 2);
            // ctx.fillText("U", 6.5 * PARAMS.BLOCKWIDTH + 2, 2.5 * PARAMS.BLOCKWIDTH - 2);
            // ctx.strokeStyle = gameEngine.right ? "White" : "Grey";
            // ctx.fillStyle = ctx.strokeStyle;
            // ctx.strokeRect(7 * PARAMS.BLOCKWIDTH + 2, 2.5 * PARAMS.BLOCKWIDTH - 2, 0.5 * PARAMS.BLOCKWIDTH + 2, 0.5 * PARAMS.BLOCKWIDTH + 2);
            // ctx.fillText("R", 7 * PARAMS.BLOCKWIDTH + 4, 3 * PARAMS.BLOCKWIDTH);

            // ctx.strokeStyle = gameEngine.A ? "White" : "Grey";
            // ctx.fillStyle = ctx.strokeStyle;
            // ctx.beginPath();
            // ctx.arc(8.25 * PARAMS.BLOCKWIDTH + 2, 2.75 * PARAMS.BLOCKWIDTH, 0.25 * PARAMS.BLOCKWIDTH + 4, 0, 2 * Math.PI);
            // ctx.stroke();
            // ctx.fillText("A", 8 * PARAMS.BLOCKWIDTH + 4, 3 * PARAMS.BLOCKWIDTH);
            // ctx.strokeStyle = gameEngine.B ? "White" : "Grey";
            // ctx.fillStyle = ctx.strokeStyle;
            // ctx.beginPath();
            // ctx.arc(9 * PARAMS.BLOCKWIDTH + 2, 2.75 * PARAMS.BLOCKWIDTH, 0.25 * PARAMS.BLOCKWIDTH + 4, 0, 2 * Math.PI);
            // ctx.stroke();
            // ctx.fillText("B", 8.75 * PARAMS.BLOCKWIDTH + 4, 3 * PARAMS.BLOCKWIDTH);

            // ctx.translate(0, 10);
            // ctx.strokeStyle = "White";
            // ctx.fillStyle = ctx.strokeStyle;

        } else if (!this.title && !this.transition) {                   // HUD


            
            // Health Bar
            ctx.strokeStyle = "White";
            ctx.fillStyle = ctx.strokeStyle;
            ctx.font = PARAMS.BLOCKWIDTH / 2 + 'px "Press Start 2P"';
            ctx.fillText("HP", 0.5 * PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH - 10);

            if (this.player.health <= this.player.maxHealth) {
                ctx.strokeStyle = "Green";
                ctx.fillStyle = ctx.strokeStyle;
                ctx.fillRect(0.5 * PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH, this.player.health * 10, 0.5 * PARAMS.BLOCKWIDTH + 2);
                ctx.strokeStyle = "Black";
                ctx.strokeRect(0.5 * PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH, 100, 0.5 * PARAMS.BLOCKWIDTH + 2);
            } else if (this.player.health > this.player.maxHealth) {
                ctx.strokeStyle = "Green";
                ctx.fillStyle = ctx.strokeStyle;
                ctx.fillRect(0.5 * PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH, 100, 0.5 * PARAMS.BLOCKWIDTH + 2);
                ctx.strokeStyle = "Orange";
                ctx.fillStyle = ctx.strokeStyle;
                ctx.fillRect(0.5 * PARAMS.BLOCKWIDTH + 100, PARAMS.BLOCKWIDTH, (this.player.health - this.player.maxHealth) * 10, 0.5 * PARAMS.BLOCKWIDTH + 2);
                ctx.strokeStyle = "Black";
                ctx.strokeRect(0.5 * PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH, this.player.health * 10, 0.5 * PARAMS.BLOCKWIDTH + 2);
            }

            // Lives
            this.headImage = ASSET_MANAGER.getAsset("./assets/playerHead.png");
            ctx.strokeStyle = "White";
            ctx.fillStyle = ctx.strokeStyle;
            ctx.fillText("Lives", 5 * PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH - 10);
            for (let i = 0; i < this.gameEngine.playerLives; i++) {
                let padding = 10; 
                let imgWidth = 25;
                ctx.drawImage(this.headImage, 0, 0, 5, 7,  5 * PARAMS.BLOCKWIDTH + (padding + imgWidth) * i, PARAMS.BLOCKWIDTH, 5 * 5, 7 * 5);
            }

            // tutorial message
            ctx.font = PARAMS.BLOCKWIDTH / 4 + 'px "Press Start 2P"';
            ctx.fillText("left click to attack enemies and open chests", 9 * PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH - 10);

        }
        
    }
};