const canvas = document.getElementById("canvases");
const ctx = canvas.getContext("2d");


class Player {
    constructor(id) {
        this.id = id
        this.isDead = false;
        this.x = canvas.width / 2
        this.y = canvas.height * 0.9;
        this.w = canvas.width / 10;
        this.h = canvas.height / 50;
        
        ctx.rect(this.x, this.y, this.w, this.h);
        ctx.fill();
    }

    move(x = this.x) {
        x = x - ((canvas.width / 10) / 2)
        ctx.rect(x, this.y, this.w, this.h);
        ctx.fill();

        this.x = x
    }

    kill() {
        this.isDead = true;
    }
}

function round(x) {
    return (x);
}

class Block {
    constructor(id) {
        this.id = id;
        this.w = round(canvas.width / 10);
        this.h = round(canvas.height / 25);
    }

    create(row, column = 3) {
        this.x = round(canvas.width - (column * this.w));
        this.y = round(canvas.height * (row / 23));
        ctx.fillRect(this.x, this.y, this.w, this.h)
    }
}
