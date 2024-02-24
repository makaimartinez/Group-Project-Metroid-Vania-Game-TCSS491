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
        if (this.right > oth.left && this.left < oth.right && this.top < oth.bottom && this.bottom > oth.top) {
            return true;
        }
        return false;
    }

    //for enemy detection range
    circleCollide(other) {
        return getDistance(this, other) < this.radius + other.radius;
    };

    overlap(oth) {
        let a_half = {x: this.width / 2, y: this.height / 2};
        let b_half = {x: oth.width / 2, y: oth.height / 2};

        let a_center = {x: this.right - a_half.x, y: this.bottom - a_half.y};
        let b_center = {x: oth.right - b_half.x, y: oth.bottom - b_half.y};

        let ox = a_half.x + b_half.x - Math.abs(a_center.x - b_center.x);
        let oy = a_half.y + b_half.y - Math.abs(a_center.y - b_center.y);

        return {x: ox, y: oy};
    }
    
    draw(ctx, camera) {
        ctx.strokeRect(this.x - camera.x, this.y, this.width, this.height);
    }
}