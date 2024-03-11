class darkness {
    constructor(game) {
        this.game = game
        this.ctx2 = document.getElementById('filtered').getContext('2d')
    }

    update() {}

    draw(ctx) {
        let ctx2 = this.ctx2;
        ctx2.save();
        ctx2.clearRect(0,0,PARAMS.CANVAS_WIDTH, PARAMS.CANVAS_HEIGHT);
    
        let that = this.game;
        this.game.entities.forEach(function(entity) {
            if(entity && entity.light){
                let x = entity.BB.center.x - that.camera.x;
                let y = entity.BB.center.y;
                let r = entity.radius;
                ctx2.fillStyle = 'rgba(0,0,112,0.99)';
                if(entity.BB.name == "player") ctx2.fillStyle = 'rgba(0,0,0,0.99)';
                ctx2.beginPath();
                ctx2.arc(x, y, r, 0, 2 * Math.PI);
                ctx2.fill();
            }
        })
        ctx2.fillStyle = 'rgba(0,0,0,' + (0.8) + ')';
        ctx2.globalCompositeOperation = 'xor';
        ctx2.fillRect(0,0,PARAMS.CANVAS_WIDTH, PARAMS.CANVAS_HEIGHT);
        ctx2.restore();
    }

    clear() {
        this.ctx2.clearRect(0,0,PARAMS.CANVAS_WIDTH, PARAMS.CANVAS_HEIGHT);
    }

}