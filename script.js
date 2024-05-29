class Car {
    constructor(x, y, angle, color) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.color = color;
        this.moveDistance = 20;
        this.laps = 0;
        this.hasCrossedStart = false; // Used to track if the car has crossed the start line
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = this.color;
        ctx.fillRect(-10, -5, 20, 10); // Car body
        ctx.beginPath();
        ctx.arc(10, 0, 5, 5, Math.PI, false); // Car nose
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
            new Car(380, 115, Math.PI*2, 'red'), // Starting on the start line
            new Car(380, 135, Math.PI*2, 'blue') // Starting on the start line
        ];
        this.currentPlayer = 0;
        this.currentGabarit = 20;
        this.bindEvents();
        this.render();
    }

    drawTrack() {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.ellipse(400, 300, 350, 200, 0, 0, 2 * Math.PI); // Outer oval
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 5;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.ellipse(400, 300, 300, 150, 0, 0, 2 * Math.PI); // Inner oval
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 5;
        ctx.stroke();
        
        // Draw start line
        ctx.beginPath();
        ctx.moveTo(400, 100);
        ctx.lineTo(400, 150);
        ctx.strokeStyle = 'green';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    bindEvents() {
        this.canvas.addEventListener('mousemove', (e) => {
            this.showArrow(e);
            this.updateCursorPosition(e);
        });
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

        this.checkLap(car);
        this.nextPlayer();
        this.render();
    }

    checkLap(car) {
        // Check if the car crosses the start line
        if (car.x > 400 && car.y >= 100 && car.y <= 150 && !car.hasCrossedStart) {
            car.hasCrossedStart = true;
        } else if (car.x < 400 && car.y >= 100 && car.y <= 150 && car.hasCrossedStart) {
            car.hasCrossedStart = false;
            car.laps += 1;
            document.getElementById(`${car.color}-car-laps`).innerText = `Tours de la voiture ${car.color}: ${car.laps}`;
            if (car.laps === 10) {
                //this.flashScreen();
            }
        }
    }

    nextPlayer() {
        this.currentPlayer = (this.currentPlayer + 1) % this.cars.length;
    }

    updateCursorPosition(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const cursorPosition = document.getElementById('cursor-position');
        cursorPosition.textContent = `Position du curseur (x, y) : (${x.toFixed(0)}, ${y.toFixed(0)})`;
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawTrack();
        this.cars.forEach(car => car.draw(this.ctx));
    }

    flashScreen() {
        const body = document.body;
        let flashCount = 0;
        const colors = ['red', 'green', 'blue', 'orange', 'purple', 'pink', 'cyan', 'magenta', 'lime', 'yellow'];
        
        const interval = setInterval(() => {
            if (flashCount < 20) { // Flash 10 times
                body.style.backgroundColor = (flashCount % 2 === 0) ? colors[Math.floor(Math.random() * colors.length)] : '#f0f0f0';
                flashCount++;
            } else {
                clearInterval(interval);
                body.style.backgroundColor = '#f0f0f0'; // Ensure it returns to the original color
            }
        }, 200);
    }
    
}


document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
});
