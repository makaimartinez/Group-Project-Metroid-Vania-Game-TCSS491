class Animator {
    constructor(spritesheet, sourceX, sourceY, width, height, frameCount, totalTime, framePadding, reverse, loop) {
        Object.assign(this, {spritesheet, sourceX, sourceY, width, height, frameCount, totalTime, framePadding, reverse, loop});

        // x = 100;
        // y = 100;
        // width = 23;
        // height = 24;
        // frameCount = 12;
        // totalTime = 6;

    
        this.frameDuration = totalTime / frameCount;    // frameDuration = 0.5
        this.elapsedTime = 0;
    }

    drawFrame(tick, x, y, scale) {
        this.elapsedTime += tick;

    
        // makes the animation loop
        // checks if we have overlapped the totaltime and if so we subtract that much from the elapsed time
        if (this.isDone()) {
            if (this.loop) {
                this.elapsedTime -= this.totalTime;
            } else {
                return;
            }
        }

        let frame = this.currentFrame();
        if (this.reverse) frame = this.frameCount - frame - 1;
       // const sx = 0;
       // const sy = 40;

        // which column of the sprite sheet. 12 columns / 12 sprites in a row
        //const sx = (frame % 12) * this.width;
        //const sy = (Math.floor(frame / 12) * this.height) + this.height;        // used +height here to get second row where link runs sideways

        ctx.drawImage(this.spritesheet,
            this.sourceX + frame * (this.width + this.framePadding), this.sourceY,    //source from sheet
            this.width, this.height,
            x, y, 
            this.width * scale, this.height * scale);
    }

    currentFrame() {
        // return Math.floor(this.elapsedTime/this.frameDuration) % this.frameCount;
        return Math.floor(this.elapsedTime/this.frameDuration); // how many frames to get to this point
    }

    isDone() {
        return (this.elapsedTime >= this.totalTime);
    }

}
