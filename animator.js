//Note, this animator is modified, do not use unless you understand how it works
//~Thomas Tien
class Animator {
    constructor(spritesheet, xStart, yStart, width, height, frameCount, frameDuration, framePadding, reverse, loop) {
        Object.assign(this, {spritesheet, xStart, yStart, width, height, frameCount, frameDuration, framePadding, reverse, loop});

        this.elaspedTime = 0;
        this.totalTime = this.frameCount * this.frameDuration;
        this.variedDuration = false;
        this.frameDurationArr = [];
    };

    drawFrame(tick, ctx, x, y, scale, flip) {
        this.elaspedTime += tick;
        if(this.isDone()) {
            if(this.loop) {
                this.elaspedTime -= this.totalTime;
            } else {
                console.log("no longer drawing, please find a way to exit :c");
                return;
            }
        }

        let frame = this.currentFrame();
        // console.log("frame: " + frame);

        if(this.reverse) frame = this.frameCount - frame - 1;
        // console.log("x:" + this.xStart + frame * (this.width + this.framePadding)
        //     + " y:" + this.yStart
        //     + " w:" + this.width * scale
        //     + " h:" + this.height * scale);
        if(flip) {
            ctx.save();
            ctx.scale(-1,1);
            ctx.drawImage(this.spritesheet, 
            this.xStart + frame * (this.width + this.framePadding), this.yStart, //source from sheet 
            this.width, this.height,
            -(x  + this.width * scale),y,
            this.width * scale, 
            this.height * scale);
            ctx.restore();
        } else {
            ctx.drawImage(this.spritesheet, 
                this.xStart + frame * (this.width + this.framePadding), this.yStart, //source from sheet 
                this.width, this.height,
                x,y,
                this.width * scale, 
                this.height * scale);
        }
    }

    currentFrame() {
        return Math.floor(this.elaspedTime / this.frameDuration);
    };

    isDone() {
        return (this.elaspedTime >= this.totalTime);
    };
}