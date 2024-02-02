const gameEngine = new GameEngine();
const ASSET_MANAGER = new AssetManager();

let canvas;
let ctx;

// sprites
ASSET_MANAGER.queueDownload("./sprites/slime.png");
ASSET_MANAGER.queueDownload("./sprites/linksprites.png");

ASSET_MANAGER.queueDownload("./assets/miku spritesheet.png");
ASSET_MANAGER.queueDownload("./assets/bg_groundTiles.png");

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

	// let scenemanager = new SceneManager();
	gameEngine.addEntity(new SceneManager(gameEngine));
	// gameEngine.addEntity(new Slime(10,10));
	// gameEngine.addEntity(new Miku(gameEngine, 50, 50, ASSET_MANAGER.getAsset("./assets/miku spritesheet.png")));
	// scene manager manages which scene we're in (level 1 sky, bricks, goombas, etc.)
	// new SceneManager(gameEngine);

	gameEngine.start();
});
