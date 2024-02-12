class levelFunctions {
    constructor() {

    }

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
    constructor(theGame) {
        this.functions = new levelFunctions;
        this.assets = [];
        this.build(theGame);
    }

    build(theGame) {

        this.assets.push(new skelly(theGame, 400, 420, ASSET_MANAGER.getAsset("./assets/Skeleton_spritesheet.png")));
        this.assets.push(new SpecterKnight(theGame, 300, 100, ASSET_MANAGER.getAsset("./assets/specter knight.png")));
        this.assets.push(new Player(theGame, 0, 300, ASSET_MANAGER.getAsset("./assets/pack_loreon_char_free_modified.png")));

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

        // items
        this.assets.push(new Chest(theGame, 9, 10));

        // Draw Background last
        this.assets.push(new Background(theGame, 0));
    }

    getAssets() {
        return this.assets;
    }

}

// not quite different enough from level one, it's currently a placeholder
class levelTwo {
    constructor(theGame) {
        this.functions = new levelFunctions;
        this.assets = [];
        this.build(theGame);
    }

    build(theGame) {

        this.assets.push(new skelly(theGame, 400, 420, ASSET_MANAGER.getAsset("./assets/Skeleton_spritesheet.png")));
        this.assets.push(new SpecterKnight(theGame, 300, 100, ASSET_MANAGER.getAsset("./assets/specter knight.png")));
        this.assets.push(new Player(theGame, 0, 300, ASSET_MANAGER.getAsset("./assets/pack_loreon_char_free_modified.png")));

        // Types: 0 - Grass | 1 - Stone | 2 - Dirt | Any Other Int - Dev
        // Second argument is the X start position
        // Third argument is the total length in blocks
        // Fourth argument is the Y level
        // Fifth argument is the array to store assets
        this.functions.buildFloor(1, 0, 13, 11, this.assets);
        this.functions.buildFloor(1, 0, 13, 12, this.assets);
        this.functions.buildFloor(1, 0, 13, 13, this.assets);

        this.functions.buildFloor(1, 16, 7, 11, this.assets);
        this.functions.buildFloor(1, 16, 7, 12, this.assets);
        this.functions.buildFloor(1, 16, 7, 13, this.assets);

        // items
        this.assets.push(new Chest(theGame, 9, 10));
        
        // Draw Background last
        this.assets.push(new Background(theGame, 0));
    }

    getAssets() {
        return this.assets;
    }
}