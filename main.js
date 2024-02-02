const gameEngine = new GameEngine();
const ASSET_MANAGER = new AssetManager();

let canvas;
let ctx;

// player and enemies
ASSET_MANAGER.queueDownload("./assets/slime.png");
ASSET_MANAGER.queueDownload("./assets/miku spritesheet.png");
ASSET_MANAGER.queueDownload("./assets/specter knight.png");
// items and environment
ASSET_MANAGER.queueDownload("./assets/bg_groundTiles.png");
ASSET_MANAGER.queueDownload("./assets/chest.png");


// music
// ASSET_MANAGER.queueDownload("");		add music in future

// sfx

ASSET_MANAGER.downloadAll(function () {

	// ASSET_MANAGER.autoRepeat("");		add music in future

	PARAMS.BLOCKWIDTH = PARAMS.BITWIDTH * PARAMS.SCALE;
	// We access the HTML canvas using the global document variable and the getElementByID function.
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");	// Paint to canvas element through a 2D context
	ctx.imageSmoothingEnabled = false;

	PARAMS.CANVAS_WIDTH = canvas.width;
	PARAMS.CANVAS_HEIGHT = canvas.height;

	gameEngine.init(ctx);

	gameEngine.addEntity(new SceneManager(gameEngine));

	gameEngine.start();
});
