const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const restartBtn = document.getElementById('restartBtn');

// Размеры сетки
const box = 20;
let score = 0;

// Переменные игры
let snake, food, direction, nextDirection, gameInterval;
let gameOver = false;

// Инициализация игры
function initGame() {
    snake = [{x: 10 * box, y: 10 * box}];
    direction = "RIGHT";
    nextDirection = "RIGHT";
    score = 0;
    scoreElement.innerText = score;
    gameOver = false;
    generateFood();
    
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(drawGame, 100); // Скорость игры
}

// Генерация еды (рюкзака) в случайном месте
function generateFood() {
    food = {
        x: Math.floor(Math.random() * 19) * box,
        y: Math.floor(Math.random() * 19) * box
    };
    // Проверка, чтобы еда не появилась внутри змейки
    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            generateFood();
            break;
        }
    }
}

// Отрисовка игры
function drawGame() {
    if (gameOver) return;

    // Очистка поля
    ctx.fillStyle = '#F9F6F0'; // Цвет фона сайта
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Отрисовка змейки
    for (let i = 0; i < snake.length; i++) {
        // Голова - акцентный цвет, тело - лесной зеленый
        ctx.fillStyle = (i === 0) ? '#D96B43' : '#2A4B41'; 
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        
        // Небольшое скругление для красоты (визуально)
        ctx.strokeStyle = '#F9F6F0';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // Отрисовка еды (выглядит как рюкзак)
    ctx.font = '20px Arial';
    ctx.fillText('🎒', food.x, food.y + 18);

    // Движение змейки
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "LEFT") snakeX -= box;
    if (direction === "UP") snakeY -= box;
    if (direction === "RIGHT") snakeX += box;
    if (direction === "DOWN") snakeY += box;

    // Проверка столкновения с едой
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        scoreElement.innerText = score;
        generateFood();
    } else {
        // Удаляем хвост, если не съели еду
        snake.pop();
    }

    let newHead = {x: snakeX, y: snakeY};

    // Проверка столкновения со стенами
    if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height) {
        endGame();
        return;
    }

    // Проверка столкновения с хвостом
    for (let i = 0; i < snake.length; i++) {
        if (newHead.x === snake[i].x && newHead.y === snake[i].y) {
            endGame();
            return;
        }
    }

    snake.unshift(newHead);
}

// Конец игры
function endGame() {
    gameOver = true;
    clearInterval(gameInterval);
    
    // Вывод сообщения поверх поля
    ctx.fillStyle = 'rgba(42, 75, 65, 0.9)';
    ctx.fillRect(0, canvas.height / 2 - 50, canvas.width, 100);
    
    ctx.fillStyle = '#F9F6F0';
    ctx.font = '24px Montserrat, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Игра окончена!', canvas.width / 2, canvas.height / 2 - 10);
    ctx.font = '18px Montserrat, sans-serif';
    ctx.fillText('Счет: ' + score, canvas.width / 2, canvas.height / 2 + 25);
    ctx.textAlign = 'start'; // Сброс выравнивания
}

// Обработка нажатий клавиш
document.addEventListener('keydown', (e) => {
    if (gameOver) return;
    
    const key = e.key;
    
    // Предотвращаем разворот на 180 градусов
    if ((key === 'ArrowLeft' || key === 'a' || key === 'A' || key === 'ф' || key === 'Ф') && direction !== 'RIGHT') {
        nextDirection = 'LEFT';
    }
    if ((key === 'ArrowUp' || key === 'w' || key === 'W' || key === 'ц' || key === 'Ц') && direction !== 'DOWN') {
        nextDirection = 'UP';
    }
    if ((key === 'ArrowRight' || key === 'd' || key === 'D' || key === 'в' || key === 'В') && direction !== 'LEFT') {
        nextDirection = 'RIGHT';
    }
    if ((key === 'ArrowDown' || key === 's' || key === 'S' || key === 'ы' || key === 'Ы') && direction !== 'UP') {
        nextDirection = 'DOWN';
    }
    
    direction = nextDirection;
});

// Кнопка перезапуска
restartBtn.addEventListener('click', initGame);

// Запуск при загрузке страницы
initGame();