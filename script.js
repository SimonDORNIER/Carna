// script.js

class Player {
    constructor(id, color) {
        this.id = id;
        this.color = color;
        this.position = { x: 100, y: 100 };
        this.angle = 0;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = this.color;
        ctx.fillRect(-10, -5, 20, 10);
        ctx.beginPath();
        ctx.arc(10, 0, 5, 0, Math.PI, false);
        ctx.fill();
        ctx.restore();
    }

    move(distance) {
        this.position.x += distance * Math.cos(this.angle);
        this.position.y += distance * Math.sin(this.angle);
    }
}

const canvas = document.getElementById('track');
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 400;

const players = [
    new Player(1, 'red'),
    new Player(2, 'blue')
];
let currentPlayerIndex = 0;
let selectedGabarit = 1;

document.getElementById('player-number').innerText = players[currentPlayerIndex].id;

function selectGabarit(gabarit) {
    selectedGabarit = gabarit;
}

canvas.addEventListener('click', (e) => {
    const player = players[currentPlayerIndex];
    player.move(selectedGabarit * 10);
    nextTurn();
});

function nextTurn() {
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    document.getElementById('player-number').innerText = players[currentPlayerIndex].id;
    drawGame();
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    players.forEach(player => player.draw(ctx));
}

drawGame();
