class levelFunctions {
    constructor() {}

    buildFloor(theType, theStartX, theLength, theLevel, theArray) {
        
        // if(PARAMS.DEBUG) console.log(theType);

        if (theType == '0') {
            for (var i = 0; i < theLength; i++) {
                theArray.push(new GrassTile(this.gameEngine, theStartX + i, theLevel));
            };
        } else if (theType == '1') {
            for (var i = 0; i < theLength; i++) {
                theArray.push(new StoneTile(this.gameEngine, theStartX + i, theLevel));
            }
        } else if (theType == '2') {
            for (var i = 0; i < theLength; i++) {
                theArray.push(new DirtTile(this.gameEngine, theStartX + i, theLevel));
            }
        } else {
            for (var i = 0; i < theLength; i++) {
                theArray.push(new DevTile(this.gameEngine, theStartX + i, theLevel));
            }
        };
    };
}

class levelOne {
    constructor(theGame, thePlayer) {
        this.functions = new levelFunctions;
        this.assets = [];
        this.build(theGame, thePlayer);
    }

    build(theGame, thePlayer) {
        theGame.camera.x = 0;     // reset camera 

        this.assets.push(new skelly(theGame, 500, 420, ASSET_MANAGER.getAsset("./assets/Skeleton_spritesheet.png")));
        console.log("PLAYER: " + thePlayer);
        this.assets.push(thePlayer);

        // Types: 0 - Grass | 1 - Stone | 2 - Dirt | Any Other Int - Dev
        // Second argument is the X start position
        // Third argument is the total length in blocks
        // Fourth argument is the Y level
        // Fifth argument is the array to store assets
        this.functions.buildFloor(0, 0, 13, 11, this.assets);
        this.functions.buildFloor(2, 0, 13, 12, this.assets);
        this.functions.buildFloor(2, 0, 13, 13, this.assets);

        this.functions.buildFloor(0, 16, 7, 11, this.assets);
        this.functions.buildFloor(2, 16, 7, 12, this.assets);
        this.functions.buildFloor(2, 16, 7, 13, this.assets);

        this.assets.push(new GrassTile(theGame, 9, 7));
        this.assets.push(new GrassTile(theGame, 10, 7));
        this.assets.push(new GrassTile(theGame, 11, 6));
        this.assets.push(new DirtTile(theGame, 9, 8));
        this.assets.push(new DirtTile(theGame, 10, 8));
        this.assets.push(new DirtTile(theGame, 11, 7));
        this.assets.push(new DirtTile(theGame, 11, 8));

        // items
        this.assets.push(new Chest(theGame, 9, 10));

        // Draw Background last
        this.assets.push(new Background(theGame, 200));
    }

    getAssets() {
        return this.assets;
    }

}

// not quite different enough from level one, it's currently a placeholder
class levelTwo {
    constructor(theGame, thePlayer) {
        this.functions = new levelFunctions;
        this.assets = [];
        this.build(theGame, thePlayer);
    }

    build(theGame, thePlayer) {

        this.assets.push(new skelly(theGame, 400, 420, ASSET_MANAGER.getAsset("./assets/Skeleton_spritesheet.png")));
        this.assets.push(new SpecterKnight(theGame, 300, 100, ASSET_MANAGER.getAsset("./assets/specter knight.png")));
        this.assets.push(thePlayer);

        // Types: 0 - Grass | 1 - Stone | 2 - Dirt | Any Other Int - Dev
        // Second argument is the X start position
        // Third argument is the total length in blocks
        // Fourth argument is the Y level
        // Fifth argument is the array to store assets
        this.functions.buildFloor(1, 0, 7, 11, this.assets);
        this.functions.buildFloor(1, 0, 9, 12, this.assets);
        this.functions.buildFloor(1, 0, 10, 13, this.assets);

        this.functions.buildFloor(1, 12, 10, 11, this.assets);
        this.functions.buildFloor(1, 14, 8, 12, this.assets);
        this.functions.buildFloor(1, 15, 7, 13, this.assets);
        
        this.assets.push(new StoneTile(theGame, 15, 10));
        this.assets.push(new StoneTile(theGame, 16, 10));
        this.functions.buildFloor(1, 0, 22, 0, this.assets);

        this.assets.push(new StoneTile(theGame, 10, 1));
        this.assets.push(new StoneTile(theGame, 11, 1));
        this.assets.push(new StoneTile(theGame, 11, 2));
        this.assets.push(new StoneTile(theGame, 11, 3));

        // items
        this.assets.push(new Chest(theGame, 13, 10));
        
        // Draw Background last
        this.assets.push(new Background(theGame, 0));
    }

    getAssets() {
        return this.assets;
    }
}

//currently a practice world that includes a specterBoss
class bossLevel {
    constructor(theGame, thePlayer) {
        this.functions = new levelFunctions;
        this.assets = [];
        this.build(theGame, thePlayer);
    }

    build(theGame, thePlayer) {

        this.assets.push(new SpecterKnight(theGame, 0, 100, ASSET_MANAGER.getAsset("./assets/specter knight.png")));
        // this.assets.push(new SpecterBoss(theGame, 100, 100, ASSET_MANAGER.getAsset("./assets/specter knight.png")));
        // this.assets.push(new skelly(theGame, 300, 430, ASSET_MANAGER.getAsset("./assets/Skeleton_spritesheet.png")));
        // thePlayer.x = 0;
        // thePlayer.y = 0;
        this.assets.push(thePlayer);

        // Types: 0 - Grass | 1 - Stone | 2 - Dirt | Any Other Int - Dev
        // Second argument is the X start position
        // Third argument is the total length in blocks
        // Fourth argument is the Y level
        // Fifth argument is the array to store assets
        this.functions.buildFloor(1, 0, 100, 11, this.assets);
        this.functions.buildFloor(1, 0, 9, 12, this.assets);
        this.functions.buildFloor(1, 0, 7, 13, this.assets);
        
        this.assets.push(new StoneTile(theGame, 0, 9));
        this.assets.push(new StoneTile(theGame, 0, 10));
        this.assets.push(new StoneTile(theGame, 0, 8));

        this.assets.push(new StoneTile(theGame, 100, 9));
        this.assets.push(new StoneTile(theGame, 100, 10));
        this.assets.push(new StoneTile(theGame, 100, 8));
        // this.functions.buildFloor(1, 0, 30, 0, this.assets);

        // this.assets.push(new StoneTile(theGame, 10, 1));
        // this.assets.push(new StoneTile(theGame, 11, 1));
        // this.assets.push(new StoneTile(theGame, 11, 2));
        // this.assets.push(new StoneTile(theGame, 11, 3));

        // items
        // this.assets.push(new Chest(theGame, 4, 10));
        
        // Draw Background last
        this.assets.push(new Background(theGame, 0));
    }

    getAssets() {
        return this.assets;
    }
}