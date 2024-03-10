class darkness {
    constructor(game) {
        this.game = game
        this.currentImage = null;
        this.lastImage= null;
        this.initial = 0
    }

    update() {}

    draw(ctx) {
        //fill screen with DARKNESS
        // console.log("dark" + PARAMS.CANVAS_WIDTH + " " + PARAMS.CANVAS_HEIGHT);
        ctx.save();
        this.lastImage = ctx.getImageData(0, 0, PARAMS.CANVAS_WIDTH, PARAMS.CANVAS_HEIGHT);
        var amb = 'rgba(0,0,0,' + (1-0.1) + ')';
        
       
        // ctx.shadowColor = "rgba(0, 0, 0, 1)";
        // ctx.shadowBlur = 20;
        this.loopEach(ctx);
        ctx.fillStyle = amb;
        ctx.globalCompositeOperation = 'xor';
        ctx.fillRect(0, 0, PARAMS.CANVAS_WIDTH, PARAMS.CANVAS_HEIGHT);
        
        // ctx.clip();
        // ctx.clearRect(0, 0, PARAMS.CANVAS_WIDTH, PARAMS.CANVAS_HEIGHT);
        // console.log(this.initial)
        // ctx.restore();
        // ctx.save();
        
        // ctx.putImageData(this.lastImage, 0, 0);
        // ctx.restore();
        // ctx.save();
        
        ctx.fillStyle = "none";
        ctx.restore();
    }
    //search through each object in game, 
    //if object has a light tag, it should have a radius, draw 3 small to large circles
    //after all that, draw the darkness 

    //get circles of every thing with light
    //get imageData
    //clip with all circles created
    loopEach(ctx) {
        let that = this;
        this.game.entities.forEach(function(entity) {
            if(entity && entity.light){
                ctx.beginPath();
                // ctx.clearRect(entity.BB.x - that.game.camera.x, entity.BB.y, entity.radius, entity.radius);
                let x = entity.BB.center.x - that.game.camera.x;
                let y = entity.BB.center.y;
                let r = entity.radius;
                // ctx.fillStyle = ctx.createRadialGradient(x, y, r / 5, x, y, r);
                
                ctx.arc(entity.BB.center.x - that.game.camera.x, entity.BB.center.y, entity.radius, 0, 2 * Math.PI);        
                
                ctx.fill();
                // ctx.fillStyle = "none"
            }
        })
    }
}