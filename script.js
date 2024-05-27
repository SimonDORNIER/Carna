document.addEventListener("DOMContentLoaded", function() {
    const cars = [
        { element: document.getElementById('car1'), angle: 0, speed: 1.5, direction: 1 },
        { element: document.getElementById('car2'), angle: 90, speed: 2, direction: 1 },
        { element: document.getElementById('car3'), angle: 180, speed: 1.7, direction: 1 },
        { element: document.getElementById('car4'), angle: 270, speed: 1.8, direction: 1 }
    ];
    const circuitRadius = 225; // Radius of the outer circle
    const innerRadius = 100; // Radius of the inner circle
    const circuitCenter = { x: 250, y: 250 }; // Center of the circuit
    
    function moveCars() {
        cars.forEach((car, index) => {
            car.angle += car.speed * car.direction;
            const radians = car.angle * (Math.PI / 180);
            const carX = circuitCenter.x + circuitRadius * Math.cos(radians) - car.element.offsetWidth / 2;
            const carY = circuitCenter.y + circuitRadius * Math.sin(radians) - car.element.offsetHeight / 2;

            car.element.style.left = `${carX}px`;
            car.element.style.top = `${carY}px`;

            // Check for collisions with other cars
            cars.forEach((otherCar, otherIndex) => {
                if (index !== otherIndex) {
                    const dx = carX - parseFloat(otherCar.element.style.left);
                    const dy = carY - parseFloat(otherCar.element.style.top);
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < car.element.offsetWidth) {
                        car.direction *= -1; // Reverse direction on collision
                        otherCar.direction *= -1;
                    }
                }
            });

            // Check for collisions with inner circle
            const distToCenter = Math.sqrt((carX - circuitCenter.x + car.element.offsetWidth / 2) ** 2 + (carY - circuitCenter.y + car.element.offsetHeight / 2) ** 2);
            if (distToCenter < innerRadius + car.element.offsetWidth / 2) {
                car.direction *= -1; // Reverse direction on collision with inner circle
            }
        });
        requestAnimationFrame(moveCars);
    }
    moveCars();
});
