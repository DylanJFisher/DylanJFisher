const fs = require('fs');

const WIDTH = 20;
const HEIGHT = 10;

let snake = [
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 }
];

let direction = 'RIGHT';

let food = spawnFood();

function spawnFood() {
    while (true) {
        const food = {
            x: Math.floor(Math.random() * WIDTH),
            y: Math.floor(Math.random() * HEIGHT)
        };

        const onSnake = snake.some(
            segment => segment.x === food.x && segment.y === food.y
        );

        if (!onSnake) {
            return food;
        }
    }
}

function moveSnake() {
    const head = { ...snake[0] };

    switch (direction) {
        case 'UP':
            head.y--;
            break;
        case 'DOWN':
            head.y++;
            break;
        case 'LEFT':
            head.x--;
            break;
        case 'RIGHT':
            head.x++;
            break;
    }

    // Wall wrap
    if (head.x < 0) head.x = WIDTH - 1;
    if (head.x >= WIDTH) head.x = 0;
    if (head.y < 0) head.y = HEIGHT - 1;
    if (head.y >= HEIGHT) head.y = 0;

    // Self collision
    if (
        snake.some(
            segment => segment.x === head.x && segment.y === head.y
        )
    ) {
        console.clear();
        render();
        console.log('\nGame Over!');
        process.exit();
    }

    snake.unshift(head);

    // Food collision
    if (head.x === food.x && head.y === food.y) {
        food = spawnFood();
    } else {
        snake.pop();
    }
}

function render() {
    const board = [];

    for (let y = 0; y < HEIGHT; y++) {
        const row = [];

        for (let x = 0; x < WIDTH; x++) {
            if (food.x === x && food.y === y) {
                row.push('*');
            } else if (snake[0].x === x && snake[0].y === y) {
                row.push('O');
            } else if (
                snake.some(
                    (segment, index) =>
                        index !== 0 &&
                        segment.x === x &&
                        segment.y === y
                )
            ) {
                row.push('o');
            } else {
                row.push('.');
            }
        }

        board.push(row.join(' '));
    }

    console.log(board.join('\n'));
    console.log('\nUse WASD to move');
}

function gameLoop() {
    moveSnake();

    console.clear();
    render();
}

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', (key) => {
    if (key === '\u0003') {
        process.exit();
    }

    if (key === 'w' && direction !== 'DOWN') {
        direction = 'UP';
    }

    if (key === 's' && direction !== 'UP') {
        direction = 'DOWN';
    }

    if (key === 'a' && direction !== 'RIGHT') {
        direction = 'LEFT';
    }

    if (key === 'd' && direction !== 'LEFT') {
        direction = 'RIGHT';
    }
});

console.clear();
render();

setInterval(gameLoop, 150);