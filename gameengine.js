// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class GameEngine {
    constructor(options) {
        // What you will use to draw
        // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
        this.ctx = null;
        this.scene = null;

        //lighting information
        this.darkness = true;

        // Everything that will be updated and drawn each frame
        this.entities = [];

        // Information on the input
        this.left = false;      // A
        this.right = false;     // D
        this.up = false;        // W
        this.down = false;      // S
        this.A = false;         // Q
        this.B = false;         // E
        this.Z = false;         // Z for emoting

        this.click = null;
        this.leftclick = null;
        this.mouse = null;
        this.wheel = null;
        this.keys = {};

        // Options and the Details
        this.options = options || {
            debugging: true,
        };
    };

    init(ctx) {
        this.ctx = ctx;
        this.surfaceWidth = this.ctx.canvas.width;
        this.surfaceHeight = this.ctx.canvas.height;
        this.startInput();
        this.timer = new Timer();
        this.scene = new SceneManager(this, this.levelNum);
        this.addEntity(this.scene);
    };

    start() {
        this.running = true;
        const gameLoop = () => {                            // simulate continuous time with little slivers of discrete time (ticks)
            this.loop();
            requestAnimFrame(gameLoop, this.ctx.canvas);     // recursive call
        };
        gameLoop();                                         //define function then immediately call it
    };

    startInput() {
        this.keyboardActive = false;
        const that = this;
        
        const getXandY = e => ({
            x: e.clientX - this.ctx.canvas.getBoundingClientRect().left,
            y: e.clientY - this.ctx.canvas.getBoundingClientRect().top
        });

        function mouseListener (e) {
            that.mouse = getXandY(e);
            
        }

        function mouseClickListener (e) {
            that.click = getXandY(e);
            // if (PARAMS.DEBUG) console.log(that.click);
        }

        function mouseLeftClickListener (e) {
            switch (e.button) {
                case 0:
                    that.leftclick = true;
                    // if (PARAMS.DEBUG) console.log("leftclick is clicked");
                    break;
                default:
                    that.leftclick = false;
                
            }
            
        }

        function wheelListener (e) {
            e.preventDefault();                             // Prevent Scrolling
            that.wheel = e.deltaY;
        }

        function keydownListener (e) {
            that.keyboardActive = true;
            switch (e.code) {
                case "ArrowLeft":
                case "KeyA":
                    that.left = true;
                    break;
                case "ArrowRight":
                case "KeyD":
                    that.right = true;
                    break;
                case "ArrowUp":
                case "KeyW":
                    that.up = true;
                    break;
                case "ArrowDown":
                case "KeyS":
                    that.down = true;
                    break;
                case "Period":
                case "KeyE":
                    that.B = true;
                    break;
                case "Comma":
                case "KeyQ":
                    that.A = true;
                    break;
                case "KeyZ":
                    that.Z = true;
                    break;
            }
        }
        function keyUpListener (e) {
            that.keyboardActive = false;
            switch (e.code) {
                case "ArrowLeft":
                case "KeyA":
                    that.left = false;
                    break;
                case "ArrowRight":
                case "KeyD":
                    that.right = false;
                    break;
                case "ArrowUp":
                case "KeyW":
                    that.up = false;
                    break;
                case "ArrowDown":
                case "KeyS":
                    that.down = false;
                    break;
                case "Period":
                case "KeyE":
                    that.B = false;
                    break;
                case "Comma":
                case "KeyQ":
                    that.A = false;
                    break;
                case "KeyZ":
                    that.Z = false;
                    break;
            }
        }

        // keeps track of keys?
        // this.ctx.canvas.addEventListener("keydown", event => this.keys[event.key] = true);
        // this.ctx.canvas.addEventListener("keyup", event => this.keys[event.key] = false);
        that.mousemove = mouseListener;
        that.click = mouseClickListener;
        // that.left = mouseLeftClickListener;
        that.wheelscroll = wheelListener;
        that.keydown = keydownListener;
        that.keyup = keyUpListener;

        this.ctx.canvas.addEventListener("mousemove", that.mousemove, false);

        this.ctx.canvas.addEventListener("click", that.click, false);

        this.ctx.canvas.addEventListener("click", mouseLeftClickListener, false);

        this.ctx.canvas.addEventListener("wheel", that.wheelscroll, false);

        this.ctx.canvas.addEventListener("keydown", that.keydown, false);

        this.ctx.canvas.addEventListener("keyup", that.keyup, false);
    };

    addEntity(entity) {
        this.entities.push(entity);
    };

    draw() {
        // Clear the whole canvas with transparent color (rgba(0, 0, 0, 0))
        // We erase it, but we never give it the chance to update the monitor as such.
        let ctx = this.ctx;
        ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        // Draw latest things first
        for (let i = this.entities.length - 1; i >= 0; i--) {
            this.entities[i].draw(this.ctx, this);
        }

        if(this.darknes) {
            let screenshot = ctx.getImageData(0,0,PARAMS.CANVAS_WIDTH,PARAMS.CANVAS_HEIGHT);
            ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            // ctx.putImageData(screenshot, 0, 0);
            // loop
            let ambientLight=.1;
            let intensity=1;
            let amb= 'rgba(0,0,0,' + (1-ambientLight) + ')';
            let that = this;
            ctx.fillStyle = 'rgba(0,0,0,1)';
            ctx.globalCompositeOperation = 'xor';
            ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            this.entities.forEach(function(entity) {
                if(entity && entity.light){
                    let x = entity.BB.center.x - that.camera.x;
                    let y = entity.BB.center.y;
                    let r = entity.radius;
                    // let g = that.ctx.createRadialGradient(x, y, 1 * r / 5, x, y, r);
                    // g.addColorStop(1, 'rgba(0,0,0,' + (1- intensity) + ')');
                    // g.addColorStop(0,amb);
                    // ctx.fillStyle = g;
                    // ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
                    // ctx.clearRect(x - r, y - r, 2 * r, 2 * r);
                    // ctx.fillStyle = that.ctx.createRadialGradient(x, y, r / 5, x, y, r);
                    ctx.fillStyle = 'rgba(260,260,260,1)';
                    // ctx.beginPath();
                    // ctx.arc(x, y, r, 0, 2 * Math.PI);
                    // ctx.fill();
                    ctx.clearRect(x - r, y - r, 2 * r, 2 * r);
                    // ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
                    // ctx.beginPath();/
                    // ctx.arc(x, y, r/3, 0, 2 * Math.PI);        
                    // ctx.fill();
                    
                }
            })
            let screenshot2 = ctx.getImageData(0,0,PARAMS.CANVAS_WIDTH,PARAMS.CANVAS_HEIGHT);
            // ctx.putImageData(screenshot, 0, 0);
            // ctx.putImageData(screenshot2, 0, 0);
        }

        if (false) {
            let screenshot = ctx.getImageData(0,0,PARAMS.CANVAS_WIDTH,PARAMS.CANVAS_HEIGHT);
            // let screenshot = document.getElementById("gameWorld").toDataURL();
            // let imgURL = screenshot.toDataURL();
            ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            // document.getElementById("gameWorld").style.backgroundImage = screenshot; 
            ctx.putImageData(screenshot, 0, 0);
            // loop
            let ambientLight=.1;
            let intensity=1;
            let amb= 'rgba(0,0,0,' + (1-ambientLight) + ')';

            let that = this;
            this.entities.forEach(function(entity) {
                if(entity && entity.light){
                    let x = entity.BB.center.x - that.camera.x;
                    let y = entity.BB.center.y;
                    let r = entity.radius;
                    let g = that.ctx.createRadialGradient(x, y, 1 * r / 5, x, y, r);
                    // g.addColorStop(1, 'rgba(0,0,0,' + (1- intensity) + ')');
                    // g.addColorStop(0,amb);
                    // ctx.fillStyle = g;
                    // ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
                    // ctx.clearRect(x, y, r, r);
                    // ctx.fillStyle = that.ctx.createRadialGradient(x, y, r / 5, x, y, r);
                    ctx.fillStyle = 'rgba(0,0,0,1)';
                    ctx.beginPath();
                    ctx.arc(x, y, r, 0, 2 * Math.PI);        
                    ctx.fill();
                    ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
                    // ctx.beginPath();/
                    // ctx.arc(x, y, r/3, 0, 2 * Math.PI);        
                    // ctx.fill();
                    
                }
            })
            
            // ctx.drawImage(screenshot, 0, 0)
            // ctx.fillStyle = amb;
            ctx.fillStyle = 'rgba(0,0,0,1)';
            // ctx.globalCompositeOperation = 'xor';
            ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            
            
            // this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        }

        // prioritize the camera and draw after everything
        this.camera.draw(this.ctx);

        //when rendering DARKNESS and Light, 
        //save the image,
        //clear canvas 
        //then draw circles
        //then apply XOR
        //then fill screen with 'darkness'
        
        if (this.darkness == false) {
            let screenshot = this.ctx.getImageData(0,0,PARAMS.CANVAS_WIDTH,PARAMS.CANVAS_HEIGHT);
            ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            // this.ctx.putImageData(screenshot, 0, 0);
            // loop
            let ambientLight=.1;
            let intensity=1;
            let amb= 'rgba(0,0,0,' + (1-ambientLight) + ')';

            let that = this;
            this.entities.forEach(function(entity) {
                if(entity && entity.light){
                    let x = entity.BB.center.x - that.camera.x;
                    let y = entity.BB.center.y;
                    let r = entity.radius;
                    let g = that.ctx.createRadialGradient(x, y, r / 3, x, y, r);
                    g.addColorStop(1, 'rgba(0,0,0,' + (1- intensity) + ')');
                    g.addColorStop(0,amb);
                    ctx.fillStyle = g;
                    // ctx.fillStyle = 'rgba(0,0,0,1)';
                    ctx.fillRect(x - r, y - r, x + r, y + r);
                    ctx.beginPath();
                    // ctx.clearRect(entity.BB.x - that.game.camera.x, entity.BB.y, entity.radius, entity.radius);
                    ctx.fillStyle = that.ctx.createRadialGradient(x, y, r / 5, x, y, r);
                    
                    // ctx.arc(entity.BB.center.x - that.camera.x, entity.BB.center.y, entity.radius, 0, 2 * Math.PI);        
                    
                    ctx.fill();
                    
                }
            })
            document.getElementById("gameWorld").style.backgroundImage = screenshot; 
            ctx.fillStyle = amb;
            this.ctx.globalCompositeOperation = 'xor';
            // this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            
            
            // this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        }
        
    };

    update() {
        let entitiesCount = this.entities.length;

        // go through every entity and ask it to update
        for (let i = 0; i < entitiesCount; i++) {
            let entity = this.entities[i];
            // console.log(i);
            // console.log(this.entities[i]);
            // if the entity is removefromworld it does not get the chance to update. Or...
            if (!entity.removeFromWorld) { // if the entity is not going to be removed
                entity.update();            // it calls update
            }
        }

        this.camera.update();                           // prioritize the camera and update after everything

        // counts backwards like we are removing as we iterate, doesn't miss any elements
        for (let i = this.entities.length - 1; i >= 0; --i) {
            // console.log(i);
            // console.log(this.entities[i]);
            if (this.entities[i].removeFromWorld) {     // checking for remove from world flag (true/null)
                this.entities.splice(i, 1);  // splice is a special array method, used to delete element at index i
            }
        }
    };

    // "our stuff". Called continuously in gameloop.
    loop() {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();
    };

}
