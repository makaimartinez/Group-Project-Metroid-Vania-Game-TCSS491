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

    killFloor(theStartX, theLength, theArray) {
        for (var i = 0; i < theLength; i++) {
            theArray.push(new KillBarrier(this.gameEngine, theStartX + i, 16));
        };
    }

    invisibleWall(theStartX, theArray) {
        for (var i = 0; i < 15; i++) {
            theArray.push(new InvWallTile(this.gameEngine, theStartX, i));
        };
    };

}

class levelOne {
    constructor(theGame, thePlayer) {
        this.functions = new levelFunctions;
        this.assets = [];
        this.music = "./assets/music/lvl1.mp3";
        this.build(theGame, thePlayer);
    }

    build(theGame, thePlayer) {
        theGame.camera.x = 0;     // reset camera 

        this.assets.push(new skelly(theGame, 500, 420, ASSET_MANAGER.getAsset("./assets/Skeleton_spritesheet.png")));
        console.log("PLAYER: " + thePlayer);
        this.assets.push(thePlayer);

        this.functions.killFloor(13, 30, this.assets);
        // Types: 0 - Grass | 1 - Stone | 2 - Dirt | Any Other Int - Dev
        // Second argument is the X start position
        // Third argument is the total length in blocks
        // Fourth argument is the Y level
        // Fifth argument is the array to store assets
        this.functions.buildFloor(0, 0, 13, 11, this.assets);
        this.functions.buildFloor(2, 0, 13, 12, this.assets);
        this.functions.buildFloor(2, 0, 13, 13, this.assets);

        this.functions.buildFloor(0, 26, 10, 11, this.assets);
        this.functions.buildFloor(2, 26, 8, 12, this.assets);
        this.functions.buildFloor(2, 26, 7, 13, this.assets);

        // Invisible wall to left of player start
        this.functions.invisibleWall(-1, this.assets);

        this.assets.push(new GrassTile(theGame, 17, 9));
        this.assets.push(new GrassTile(theGame, 16, 10));
        this.assets.push(new DirtTile(theGame, 17, 10));
        this.assets.push(new GrassTile(theGame, 18, 9));
        this.assets.push(new DirtTile(theGame, 18, 10));
        
        this.assets.push(new Bush(theGame, 9, 10));
        this.assets.push(new Bush(theGame, 17, 8));
        this.assets.push(new Bush(theGame, 28, 10));
        this.assets.push(new Tree(theGame, 5, 7));
        this.assets.push(new Tree(theGame, 28, 7));

        // items
        this.assets.push(new Chest(theGame, 9, 10));
        this.assets.push(new NextLevelDoor(theGame, 33, 9));

        // Draw Background last
        this.assets.push(new Background_Day(theGame, 260));

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
        this.music = "./assets/music/lvl2.mp3";
        this.build(theGame, thePlayer);
    }

    build(theGame, thePlayer) {
        this.assets.push(new darkness(theGame));

        this.assets.push(new skelly(theGame, 400, 420, ASSET_MANAGER.getAsset("./assets/Skeleton_spritesheet.png")));
        this.assets.push(new SpecterKnight(theGame, 300, 100, ASSET_MANAGER.getAsset("./assets/specter knight.png")));
        this.assets.push(thePlayer);

        this.functions.killFloor(10, 4, this.assets);

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

        this.functions.invisibleWall(-1, this.assets);
        
        this.assets.push(new StoneTile(theGame, 15, 10));
        this.assets.push(new StoneTile(theGame, 16, 10));
        this.functions.buildFloor(1, 0, 22, 0, this.assets);

        this.assets.push(new StoneTile(theGame, 10, 1));
        this.assets.push(new StoneTile(theGame, 11, 1));
        this.assets.push(new StoneTile(theGame, 11, 2));
        this.assets.push(new StoneTile(theGame, 11, 3));

        // items
        this.assets.push(new Chest(theGame, 13, 10));
        this.assets.push(new NextLevelDoor(theGame, 19, 9));
        
        // Draw Background last
        this.assets.push(new Background_Cave(theGame, 260));

    }

    getAssets() {
        return this.assets;
    }
}

//boss level in progres... O_O
class bossLevel {
    constructor(theGame, thePlayer) {
        this.functions = new levelFunctions;
        this.music = "./assets/music/bosslvl.mp3";
        this.assets = [];
        this.build(theGame, thePlayer);
    }

    build(theGame, thePlayer) {
        //lighting effect 
        this.assets.push(new darkness(theGame));

        this.assets.push(new SpecterKnight(theGame, -600, 200, ASSET_MANAGER.getAsset("./assets/specter knight.png")));

        // this.assets.push(new SpecterKnight(theGame, 1000, 0, ASSET_MANAGER.getAsset("./assets/specter knight.png")));
        // this.assets.push(new SpecterKnight(theGame, 1700, 50, ASSET_MANAGER.getAsset("./assets/specter knight.png")));
        this.assets.push(new SpecterBoss(theGame, 500, -10, ASSET_MANAGER.getAsset("./assets/specter boss.png")));
        // this.assets.push(new SpecterBoss(theGame, 2900, 0, ASSET_MANAGER.getAsset("./assets/specter boss.png")));
        this.assets.push(new skelly(theGame, 800, 430, ASSET_MANAGER.getAsset("./assets/Skeleton_spritesheet.png")));
        // thePlayer.x = 0;
        // thePlayer.y = 0;
        this.assets.push(thePlayer);
        // this.assets.push(new darkness(theGame));

        // Types: 0 - Grass | 1 - Stone | 2 - Dirt | Any Other Int - Dev
        // Second argument is the X start position
        // Third argument is the total length in blocks
        // Fourth argument is the Y level
        // Fifth argument is the array to store assets

        this.functions.invisibleWall(-20, this.assets);
        this.functions.killFloor(13, 30, this.assets);
        //decor floor
        this.functions.buildFloor(1, 0, 9, 12, this.assets);
        this.functions.buildFloor(1, 0, 7, 13, this.assets);
        
        //1st area (stretches to 2nd area)
        this.functions.buildFloor(1, -11, 50, 11, this.assets);
        //tester arena
        this.assets.push(new Chest(theGame, -10, 10));
        this.assets.push(new StoneTile(theGame, -11, 6));
        this.assets.push(new StoneTile(theGame, -11, 8));
        this.assets.push(new StoneTile(theGame, -11, 9));
        this.assets.push(new StoneTile(theGame, -11, 10));

        //start wall
        this.assets.push(new StoneTile(theGame, 0, 3));
        this.assets.push(new StoneTile(theGame, 0, 4));
        this.assets.push(new StoneTile(theGame, 0, 5));
        this.assets.push(new StoneTile(theGame, 0, 6));        
        // this.assets.push(new StoneTile(theGame, 0, 7));
        this.assets.push(new StoneTile(theGame, 0, 10));
        
        //1st stairs
        this.assets.push(new Chest(theGame, 10, 7));
        this.functions.buildFloor(1, 8, 4, 8, this.assets);
        this.functions.buildFloor(1, 7, 4, 9, this.assets);
        this.assets.push(new StoneTile(theGame, 6, 10));
        this.assets.push(new StoneTile(theGame, 8, 10));
        this.assets.push(new StoneTile(theGame, 10, 10));
        
        //1st top wall
        this.functions.buildFloor(1, 19, 5, 0, this.assets);
        this.assets.push(new StoneTile(theGame, 20, 0));
        this.assets.push(new StoneTile(theGame, 20, 1));
        this.assets.push(new StoneTile(theGame, 20, 2));
        this.assets.push(new StoneTile(theGame, 20, 3));
        this.assets.push(new StoneTile(theGame, 20, 9));
        //1st bot wall
        // this.assets.push(new StoneTile(theGame, 19, 10));
        this.assets.push(new StoneTile(theGame, 20, 10));
        this.assets.push(new StoneTile(theGame, 21, 10));

        //2nd area
        //floor
        this.functions.buildFloor(1, 30, 10, 9, this.assets);
        this.assets.push(new StoneTile(theGame, 30, 10));
        //hole barrier
        this.assets.push(new StoneTile(theGame, 39, 10));
        this.assets.push(new StoneTile(theGame, 39, 11));
        this.assets.push(new StoneTile(theGame, 39, 12));
        this.assets.push(new StoneTile(theGame, 39, 13));
        //hole
        //*imagine putting a hole here
        //other side of the hole
        this.functions.buildFloor(1, 45, 5, 9, this.assets);
        //hole barrier
        this.assets.push(new StoneTile(theGame, 45, 10));
        this.assets.push(new StoneTile(theGame, 45, 11));
        this.assets.push(new StoneTile(theGame, 45, 12));
        this.assets.push(new StoneTile(theGame, 45, 13));

        //*ceiling (is also a floor and sneaks the door)
        this.assets.push(new NextLevelDoor(theGame, 31, 1));
        this.assets.push(new StoneTile(theGame, 30, 1));
        this.assets.push(new StoneTile(theGame, 30, 2));
        this.functions.buildFloor(1, 30, 8, 3, this.assets);
        this.assets.push(new StoneTile(theGame, 38, 4));

        this.functions.buildFloor(1, 50, 6, 3, this.assets);
        this.assets.push(new StoneTile(theGame, 56, 4));
        this.assets.push(new StoneTile(theGame, 57, 5));
        this.assets.push(new StoneTile(theGame, 58, 6));
        this.assets.push(new StoneTile(theGame, 59, 7));
        //3rd area
        //floor
        this.assets.push(new StoneTile(theGame, 49, 10));
        this.assets.push(new StoneTile(theGame, 49, 11));
        this.functions.buildFloor(1, 50, 15, 12, this.assets);
        this.functions.buildFloor(1, 62, 10, 10, this.assets);
        this.functions.buildFloor(1, 65, 4, 8, this.assets);//table...?
        this.assets.push(new Chest(theGame, 66, 7));

        //backwall
        this.assets.push(new StoneTile(theGame, 72, 5));
        this.assets.push(new StoneTile(theGame, 72, 6));
        this.assets.push(new StoneTile(theGame, 72, 7));
        this.assets.push(new StoneTile(theGame, 72, 8));

        // items
        // this.assets.push(new Chest(theGame, 4, 10));
        // this.assets.push(new darkness(theGame));
        // Draw Background last
        this.assets.push(new Background_Cave(theGame, 260));
    }

    assetsToString() {
        console.log("assets");
        let held = "";
        for (let i = 0; i < this.assets.length; i++) {
            let item = this.assets[i];
            if(item.BB && item.BB.name) held = held + ", " + item.BB.name; 
            
        }
        console.log(held);
    }

    getAssets() {
        // this.assetsToString();
        return this.assets;
    }
}