const gameEngine = new GameEngine();
const ASSET_MANAGER = new AssetManager();

let canvas;
let ctx;

ASSET_MANAGER.queueDownload("./assets/bg_background.png");
ASSET_MANAGER.queueDownload("./assets/bg_backgroundUG.png");
ASSET_MANAGER.queueDownload("./assets/title.png");
ASSET_MANAGER.queueDownload("./assets/title screen.png");
// player and enemies
ASSET_MANAGER.queueDownload("./assets/slime.png");
ASSET_MANAGER.queueDownload("./assets/pack_loreon_char_free_modified.png");
ASSET_MANAGER.queueDownload("./assets/miku spritesheet.png");
ASSET_MANAGER.queueDownload("./assets/specter knight.png");
ASSET_MANAGER.queueDownload("./assets/specter boss.png");
ASSET_MANAGER.queueDownload("./assets/playerHead.png")
ASSET_MANAGER.queueDownload("./assets/Skeleton_spritesheet.png");
// items and environment
ASSET_MANAGER.queueDownload("./assets/bg_groundTiles.png");
ASSET_MANAGER.queueDownload("./assets/bg_door.png");

ASSET_MANAGER.queueDownload("./assets/chest.png");
ASSET_MANAGER.queueDownload("./assets/openchest.png");
ASSET_MANAGER.queueDownload("./assets/healthpotion.png");
ASSET_MANAGER.queueDownload("./assets/speedpotion.png");


// music
ASSET_MANAGER.queueDownload("./assets/music/lvl1.mp3");		
// sfx

ASSET_MANAGER.downloadAll(function () {

	ASSET_MANAGER.autoRepeat("./assets/music/lvl1.mp3");		

	PARAMS.BLOCKWIDTH = PARAMS.BITWIDTH * PARAMS.SCALE;
	// We access the HTML canvas using the global document variable and the getElementByID function.
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");	// Paint to canvas element through a 2D context
	ctx.imageSmoothingEnabled = false;	

	PARAMS.CANVAS_WIDTH = canvas.width;
	PARAMS.CANVAS_HEIGHT = canvas.height;

	gameEngine.init(ctx);

	// gameEngine.addEntity(new SceneManager(gameEngine));

	gameEngine.start();
});
