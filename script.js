class Car {
    constructor(x, y, angle, color) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.color = color;
        this.moveDistance = 20;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = this.color;
        ctx.fillRect(-10, -5, 20, 10); // Car body
        ctx.beginPath();
        ctx.arc(10, 0, 5, 0, Math.PI, false); // Car nose
        ctx.fill();
        ctx.restore();
    }

    moveTo(x, y) {
        this.x = x;
        this.y = y;
    }

    rotateTo(angle) {
        this.angle = angle;
    }

    setMoveDistance(distance) {
        this.moveDistance = distance;
    }
}

class Game {
    constructor() {
        this.canvas = document.getElementById('raceTrack');
        this.ctx = this.canvas.getContext('2d');
        this.cars = [
            new Car(400, 300, 0, 'red'),
            new Car(400, 320, 0, 'blue')
        ];
        this.currentPlayer = 0;
        this.currentGabarit = 20;
        this.track = this.generateTrack();
        this.bindEvents();
        this.render();
    }

    generateTrack() {
        // Track generation logic
        return [
            { x: 100, y: 100, radius: 200 }
        ];
    }

    drawTrack() {
        this.track.forEach((circle) => {
            this.ctx.beginPath();
            this.ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
            this.ctx.stroke();
        });
    }

    bindEvents() {
        this.canvas.addEventListener('mousemove', (e) => this.showArrow(e));
        this.canvas.addEventListener('click', (e) => this.moveCar(e));
        document.querySelectorAll('.controls button').forEach(button => {
            button.addEventListener('click', (e) => this.setGabarit(e));
        });
    }

    setGabarit(event) {
        this.currentGabarit = parseInt(event.target.getAttribute('data-size'));
    }

    showArrow(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const car = this.cars[this.currentPlayer];
        const dx = x - car.x;
        const dy = y - car.y;
        const angle = Math.atan2(dy, dx);

        const arrowEndX = car.x + this.currentGabarit * Math.cos(angle);
        const arrowEndY = car.y + this.currentGabarit * Math.sin(angle);

        this.render();
        this.ctx.beginPath();
        this.ctx.moveTo(car.x + 10 * Math.cos(car.angle), car.y + 10 * Math.sin(car.angle)); // From the nose
        this.ctx.lineTo(arrowEndX, arrowEndY);
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    moveCar(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const car = this.cars[this.currentPlayer];
        const dx = x - car.x;
        const dy = y - car.y;
        const angle = Math.atan2(dy, dx);

        const newX = car.x + this.currentGabarit * Math.cos(angle);
        const newY = car.y + this.currentGabarit * Math.sin(angle);

        car.moveTo(newX, newY);
        car.rotateTo(angle);

        this.nextPlayer();
        this.render();
    }

    nextPlayer() {
        this.currentPlayer = (this.currentPlayer + 1) % this.cars.length;
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawTrack();
        this.cars.forEach(car => car.draw(this.ctx));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
});
