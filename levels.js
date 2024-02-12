class levelOne {
    constructor() {
        let slime = new Slime(200, 480);


        this.gameEngine.addEntity(slime);
        this.gameEngine.addEntity(new SpecterKnight(this.gameEngine, 300, 100, ASSET_MANAGER.getAsset("./assets/specter knight.png")));
        //this.gameEngine.addEntity(new Ground(this.gameEngine, 100, 300, 50));
        //this.gameEngine.addEntity(new Ground(this.gameEngine, 30, 600, 800));
        // this.gameEngine.addEntity(new Miku(this.gameEngine, 50, 50, ASSET_MANAGER.getAsset("./assets/miku spritesheet.png")));
        this.gameEngine.addEntity(new Player(this.gameEngine, 0, 300, ASSET_MANAGER.getAsset("./assets/pack_loreon_char_free_modified.png")));
        // Creating textured environment tiles (X and Y are multiplied by the size defined in each block's class)
        this.gameEngine.addEntity(new GrassTile(this.gameEngine, 15, 2));
        this.gameEngine.addEntity(new DirtTile(this.gameEngine, 15, 3));
        this.gameEngine.addEntity(new StoneTile(this.gameEngine, 16, 2));
        this.gameEngine.addEntity(new DevTile(this.gameEngine, 16, 3));
        this.gameEngine.addEntity(new GrassTile(this.gameEngine, 12, 9));



        // Types: 0 - Grass | 1 - Stone | 2 - Dirt | Any Other Int - Dev
        // Second argument is the total length in blocks
        this.drawFloor(0, 0, 13, 11);
        this.drawFloor(2, 0, 13, 12);
        this.drawFloor(2, 0, 13, 13);

        this.drawFloor(0, 16, 7, 11);
        this.drawFloor(2, 16, 7, 12);
        this.drawFloor(2, 16, 7, 13);

        // items
        this.gameEngine.addEntity(new Chest(this.gameEngine, 9, 10));


        // Draw Background last
        this.gameEngine.addEntity(new Background(this.gameEngine, 0));
    }
}

// not quite different enough from level one, it's currently a placeholder
class levelTwo {
    constructor() {
        let slime = new Slime(200, 480);

        this.gameEngine.addEntity(slime);
        this.gameEngine.addEntity(new SpecterKnight(this.gameEngine, 300, 100, ASSET_MANAGER.getAsset("./assets/specter knight.png")));
        this.gameEngine.addEntity(new Player(this.gameEngine, 0, 300, ASSET_MANAGER.getAsset("./assets/pack_loreon_char_free_modified.png")));
        this.gameEngine.addEntity(new StoneTile(this.gameEngine, 12, 9));
        
        // Types: 0 - Grass | 1 - Stone | 2 - Dirt | Any Other Int - Dev
        // Second argument is the total length in blocks
        this.drawFloor(1, 0, 13, 11);
        this.drawFloor(1, 0, 13, 12);
        this.drawFloor(1, 0, 13, 13);

        this.drawFloor(1, 16, 7, 11);
        this.drawFloor(1, 16, 7, 12);
        this.drawFloor(1, 16, 7, 13);

        // items
        this.gameEngine.addEntity(new Chest(this.gameEngine, 9, 10));


        // Draw Background last
        this.gameEngine.addEntity(new Background(this.gameEngine, 0));
    }
}