class SceneManager {
    constructor(game) {
        this.gameEngine = game;
        this.gameEngine.camera = this;
        this.x = 0;
        this.score = 0;
        this.coins = 0;
        this.playerLives = 3;
        this.playerHealth = 0;
        // this.removeFromWorld = false;

        // Controls what level the player is on (0 is currently level 1)
        this.levelNum = 0;

        this.player = new Player(this.gameEngine, 100, 440, ASSET_MANAGER.getAsset("./assets/pack_loreon_char_free_modified.png"));

        // this.levels = [
        //     new levelOne(this.gameEngine, this.player),
        //     new levelTwo(this.gameEngine, this.player),
        //     new bossLevel(this.gameEngine, this.player)
        // ];

        this.loadGame(false, true, false);


        // build level 1
        // build level 2
        // lvl2.getAssets().forEach((element) => this.gameEngine.addEntity(element));

        // take out this code once start screen is implemented
        // this.currentLevel = this.levels[this.levelNum];
        // console.log(this.levels);
        // this.currentLevel.getAssets().forEach((element) => this.gameEngine.addEntity(element));
        
    };

    loadGame (transition, title, gameOver) {
        this.transition = transition;
        this.title = title;
        if (transition) {
            this.gameEngine.addEntity(new TransitionScreen(this.gameEngine, gameOver, transition));
        } else if (!title) {
            this.playerHealth = this.player.health;
            console.log(this.playerLives);

            this.clearEntities();

            this.player = new Player(this.gameEngine, 100, 440, ASSET_MANAGER.getAsset("./assets/pack_loreon_char_free_modified.png"));
            this.player.health = this.playerHealth;

            console.log(this.player.health)
            console.log(this.player.defaultHealth)

            this.levels = [
                new levelOne(this.gameEngine, this.player),
                new levelTwo(this.gameEngine, this.player),
                new bossLevel(this.gameEngine, this.player)
            ];
            this.currentLevel = this.levels[this.levelNum];
            // console.log(this.levels);
            this.currentLevel.getAssets().forEach((element) => this.gameEngine.addEntity(element));

            // MUSIC
            if (this.currentLevel.music) {
                ASSET_MANAGER.pauseBackgroundMusic();
                ASSET_MANAGER.playAsset(this.currentLevel.music);
            }

        }
    }

    levelAdvance() {
        //get preserved player values
        this.levelNum++;
        this.clearEntities();
        this.x = 0;
        this.loadGame(true, false, false);
    }
 
    respawnRestart() {
        //get preserved player values
        this.player.health = this.player.defaultHealth;
        this.playerLives -= 1;
        if (this.playerLives > 0) {
            this.clearEntities();
            this.loadGame(false, false, false);
        } else {
            console.log("GO");
            this.clearEntities();
            this.loadGame(true, false, true);
        }
        // this.scene = new SceneManager(this, this.levelNum);
    }

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

        if (this.title && this.gameEngine.leftclick) {
            if (this.gameEngine.leftclick && this.gameEngine.click.y > 7 * PARAMS.BLOCKWIDTH && this.gameEngine.click.y < 8 * PARAMS.BLOCKWIDTH) {   // && this.gameEngine.click.y > 9 * PARAMS.BLOCKWIDTH && this.gameEngine.click.y < 9.5 * PARAMS.BLOCKWIDTH
                console.log("in click check");
                this.title = false;
                this.inTransition = true;
                this.loadGame(true, false); 
            }
        }

        let midpoint = PARAMS.CANVAS_WIDTH/2 - PARAMS.BLOCKWIDTH / 2;
        
        if (this.player) {
            this.x = this.player.x - midpoint;
            if (this.player.respawn) {
                // create new player
                //this.player = new Player(this.gameEngine, 100, 300, ASSET_MANAGER.getAsset("./assets/pack_loreon_char_free_modified.png"))
            }
        }

    }

    draw(ctx) {
    
        // TITLE SCREEN DRAW
        if (this.title) {
            var width = 140;
            var height = 70;
            const titlescreen = ASSET_MANAGER.getAsset("./assets/title screen.png");
            const titlecard = ASSET_MANAGER.getAsset("./assets/title.png");

            ctx.drawImage(titlescreen, 0, 0, PARAMS.CANVAS_WIDTH, PARAMS.CANVAS_HEIGHT);

            ctx.font = PARAMS.BLOCKWIDTH / 1.5 + 'px "Press Start 2P"';
            ctx.fillStyle = "White";
            var titlecardplace = (PARAMS.CANVAS_WIDTH / 2) - (width  * PARAMS.SCALE/ 2);
            ctx.drawImage(titlecard, titlecardplace, 1.5 * PARAMS.BLOCKWIDTH, width * PARAMS.SCALE, height * PARAMS.SCALE);
            ctx.fillStyle = this.gameEngine.mouse && this.gameEngine.mouse.y > 7 * PARAMS.BLOCKWIDTH && this.gameEngine.mouse.y < 8 * PARAMS.BLOCKWIDTH ? "Grey" : "White";
            ctx.fillText("START", 9 * PARAMS.BLOCKWIDTH, 8 * PARAMS.BLOCKWIDTH);
        } 
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
            for (let i = 0; i < this.playerLives; i++) {
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