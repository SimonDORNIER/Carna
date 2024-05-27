document.addEventListener("DOMContentLoaded", function() {
    const cars = document.querySelectorAll('.car');
    cars.forEach((car, index) => {
        let position = 0;
        const speed = 2 + Math.random() * 3; // Random speed for each car
        function moveCar() {
            position += speed;
            if (position > window.innerWidth) {
                position = -50; // Reset position when car exits the right side of the screen
            }
            car.style.left = position + 'px';
            requestAnimationFrame(moveCar);
        }
        moveCar();
    });
});
