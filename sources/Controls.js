var player = new Player(null)
var block = new Block(null)
var mouseX = undefined;
for(let i = 3; i < 8; i++) {
   for(let j = 0; j < 11; j++) {
        block.create(i, j)
   }
}

canvas.onmousemove = function(e) {
    document.getElementById("info").innerText = mouseX;
    mouseX = e.clientX / 2.15;
    Execute();
}

async function Execute() {
    //ctx.fillRect(0, 0, canvas.width, canvas.height)
    player.move(mouseX)
}
Execute();