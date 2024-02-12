class BoundingBox {
    constructor (x, y, width, height, name) {
        Object.assign(this, {x, y, width, height, name});

        this.left = this.x;
        this.right = this.x + this.width;
        this.top = this.y;
        this.bottom = this.y + this.height;
        this.center = {
            x: this.left + (this.width)/2,
            y: this.top + (this.height)/2
        }
    }

    //checking for collision with other
    collide(oth) {
        // if(this.name == "player attack down" && oth.name == "skelly")
        //     console.log(this.name + " " + this.right + " collided " + oth.name + " " + oth.left);
        if (this.right > oth.left && this.left < oth.right && this.top < oth.bottom && this.bottom > oth.top) {
            return true;
        }
        return false;
    }

    overlap(other) {
        
    }
}