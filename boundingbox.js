class BoundingBox {
    constructor (x, y, width, height, name) {
        Object.assign(this, {x, y, width, height, name});

        this.left = this.x;
        this.right = this.x + this.width;
        this.top = this.y;
        this.bottom = this.y + this.height;
    }

    //checking for collision with other
    collide(oth) {
        if (this.right > oth.left && this.left < oth.right && this.top < oth.bottom && this.bottom > oth.top) {
            if(oth.name == "specter")
            console.log(this.name + " " + this.right + " collided " + oth.name + " " + oth.left);
            return true;
        }
        return false;
    }

    overlap(other) {
        
    }
}