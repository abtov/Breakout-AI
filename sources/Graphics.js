const canvas = document.getElementById("canvases");
const ctx = canvas.getContext("2d");

canvas.width = 800;    // example size
canvas.height = 600;

var mouseX = null;
var showLog = false;
var total_simulation = [];

var player_speed = 20;
var ball_speed = 10;

function changeSpeed() {
    player_speed = document.getElementById('paddle').value;
    ball_speed = document.getElementById('ball').value;
}

class Player {
    constructor(id) {
        this.id = id;
        this.isDead = false;
        this.x = canvas.width / 2 - ((canvas.width / 10) / 2);
        this.y = canvas.height * 0.9;
        this.w = canvas.width / 10;
        this.h = canvas.height / 50;
        this.vel = 0;
        this.color = ctx.fillStyle = "#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0");
        
    }

    move(x, isBest) {
        this.x = x;
        this.vel = Math.abs(x - this.x);
        this.x = x;
        if(this.x < 0) {
            this.x = 0;
        }

        if(this.x - this.w > canvas.width) {
            this.x = canvas.width - this.w;
        }
        if(isBest) {
            ctx.fillRect(x, this.y, this.w, this.h);
            return;
        }
        ctx.fillStyle = this.color;
        ctx.fillRect(x, this.y, this.w, this.h);
        ctx.fillStyle = "#000000";
    }

    kill() {
        this.isDead = true;
    }
}

function round(x) {
    return (x);
}

class Block {
    constructor() {
        this.w = round(canvas.width / 10);
        this.h = round(canvas.height / 25);
        this.total_blocks = new Set();
    }

    create(row, column = 3, isBest) {
        let x = round(canvas.width - (column * this.w));
        let y = round(canvas.height * (row / 23));
        
        if(isBest) {
            ctx.fillStyle = "rgba(0, 0, 0, 255)";
            ctx.fillRect(x, y, this.w, this.h)
            return [ row, column, x, y ]
        }
        ctx.fillStyle = "rgba(0, 0, 0, 50)";
        ctx.fillRect(x, y, this.w, this.h)
        return [ row, column, x, y ]
    }
}

class Ball {
    constructor(player) {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.w = canvas.width / 10;
        this.h = canvas.height / 50;
        this.player = player;
        this.speed = ball_speed;
        this.vel = {
            x: Math.random() * 2 - 1 < 0 ? -1 : 1,
            y: 1
        };

        ctx.rect(this.x, this.y, this.w, this.h);
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, 2 * Math.PI);
        ctx.fill();
    }

    move(isBest) {
        this.x = this.x + this.vel.x * this.speed;
        this.y = this.y + this.vel.y * this.speed;

        if (this.x > canvas.width) {
            this.vel.x = this.vel.x* -1;
            this.x = canvas.width;
        }
        if (this.x < 0) {
            this.vel.x = this.vel.x * -1;
            this.x = this.x * -1;
        }

        if (this.y < 0) {
            this.y = 0;
            this.vel.y = this.vel.y * -1;
        }

        if (this.y > canvas.height) {
            this.player.kill();
        }
    
        if(!isBest) {
            ctx.beginPath();
            ctx.fillStyle = "rgba(0, 0, 0, 25)";
            ctx.arc(this.x, this.y, 7, 0, 2 * Math.PI);
            ctx.fill();
        }

        ctx.beginPath();
        ctx.fillStyle = "rgba(0, 0, 0, 255)";
        ctx.arc(this.x, this.y, 7, 0, 2 * Math.PI);
        ctx.fill();
    }
}

class Simulation {
    constructor(brain) {
        this.neural = brain;
        this.player = new Player(null)
        this.block = new Block(null)
        this.ball = new Ball(this.player)
        this.wr = this.player.x;
        this.score = 0;


        for(let i = 3; i < 8; i++) {
            for(let j = 1; j < 11; j++) {
                var cBlock = this.block.create(i, j)
                this.block.total_blocks.add(cBlock)
            }
         }
    }

    render(inputs, isBest, isMouse = false) {
        if(this.player.isDead) return false;
        if(inputs) {
            let most = Math.max(...inputs)
            let controls = inputs.indexOf(most)
            this.wr = this.player.x + (controls > 0 ? (controls == 1 ?  -player_speed : player_speed) : 0);
            this.player.move(this.wr)
        }
        if(isMouse) this.player.move(mouseX);
        this.ball.move(isBest)

        var block_set = this.block.total_blocks;
        if(block_set.size > 0) {
            this.block.total_blocks.forEach((b) => {
                if (this.ball.x > b[2] && this.ball.x < b[2] + this.block.w) {
                    if(this.ball.y > b[3] && this.ball.y < b[3] + this.block.h) {
                        block_set.delete(b);
                        this.ball.vel.y = this.ball.vel.y * -1;
                        this.score++;
                    }
                }
            });

            let block_array = Array.from(block_set);
            for(let i = 0; i < block_array.length; i++) {
                let x = block_array[i][0];
                let y = block_array[i][1];

                this.block.create(x, y, isBest)
            }
        }

        if (this.ball.x > this.player.x && this.ball.x < this.player.x + this.player.w) {
            if(this.ball.y > this.player.y && this.ball.y < this.player.y + this.player.h) {
                this.ball.vel.y = this.ball.vel.y * -1;
                this.score++;
            }
        }
    }
}