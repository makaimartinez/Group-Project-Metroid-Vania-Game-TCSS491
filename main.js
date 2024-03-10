const gameEngine = new GameEngine();
const ASSET_MANAGER = new AssetManager();

let canvas;
let ctx;

ASSET_MANAGER.queueDownload("./assets/bg_background.png");
ASSET_MANAGER.queueDownload("./assets/bg_backgroundUG.png");
ASSET_MANAGER.queueDownload("./assets/title.png");
ASSET_MANAGER.queueDownload("./assets/title screen.png");
ASSET_MANAGER.queueDownload("./assets/transitionscreen.png");
ASSET_MANAGER.queueDownload("./assets/defeatscreen.png");
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

	gameEngine.addEntity(new SceneManager(gameEngine));

	gameEngine.start();
});

function getImage() {
	
	var orig = document.getElementById('gameWorld');
	var ctx1 = orig.getContext("2d");
	var filtered = document.getElementById('filtered');
	var ctx2= filtered.getContext("2d")
	// ctx2.globalCompositeOperation = 'destination-out';
	// console.log("success: " + orig + " " + filtered);
	// var snap = ctx1.getImageData(0, 0, PARAMS.CANVAS_WIDTH, PARAMS.CANVAS_HEIGHT);
	// ctx2.putImageData(snap,0,0)
	
	var snap = orig.toDataURL("image/jpeg");
	var target = new Image();
	target.src = snap;
	// console.log(snap);
	// document.getElementById('filtered').appendChild(target);
	// style="background-image:url('http://placekitten.com/500/500');"
	filtered.setAttribute("style","background-image:url('"+ snap +"');")
}

function filter() {
	getImage();
    var can = document.getElementById('filtered');
    var ctx = can.getContext('2d');
	ctx.save();
    ctx.clearRect(0,0,PARAMS.CANVAS_WIDTH, PARAMS.CANVAS_HEIGHT);
	var ambientLight = .1;
    var intensity = 1;
    var radius = 100;
    var amb = 'rgba(0,0,0,' + (1-ambientLight) + ')';
    
    let that = gameEngine;
	
	gameEngine.entities.forEach(function(entity) {
		// if(entity && entity.BB) console.log("entity " + entity.BB.name)
		if(entity && entity.light){
			let x = entity.BB.center.x - that.camera.x;
			let y = entity.BB.center.y;
			let r = entity.radius;
			// console.log("light " + entity.BB.name + "x " + x + "y" + y + "r" + r)
			// var g = ctx.createRadialGradient(x, y, 1 * r / 5, x, y, r);
			// g.addColorStop(1, 'rgba(0,0,0,' + (1- intensity) + ')');
			// g.addColorStop(0,amb);
			// ctx.fillStyle = g;
			// ctx.fillRect(x - r, y - r, x + r, y + r);
			ctx.fillStyle = 'rgba(0,0,112,0.9)';
			if(entity.BB.name == "player") ctx.fillStyle = 'rgba(0,0,0,0.9)';
			ctx.beginPath();
			ctx.arc(x, y, r, 0, 2 * Math.PI);
			ctx.fill();
		}
	})
    
    ctx.fillStyle = 'rgba(0,0,0,' + (0.8) + ')';;
    ctx.globalCompositeOperation = 'xor';
    ctx.fillRect(0,0,PARAMS.CANVAS_WIDTH, PARAMS.CANVAS_HEIGHT);
	ctx.restore();
}
