
window.addEventListener("load", function() {
    const canvas = document.getElementsByTagName("canvas")[0];
    let ctx;
    if (canvas.getContext) {
        ctx = canvas.getContext("2d");
    }

    class Circle {
        constructor(x, y, radius) {
            this.x = x;
            this.y = y;
            this.radius = radius;
        }
        draw() {
            const circle = new Path2D();
            circle.arc(
                this.x,
                this.y,
                this.radius,
                0,
                2 * Math.PI,
                false
            );
            ctx.fill(circle);
        }
    }

    class Board {
        constructor(width, height, game) {
            this.width = width;
            this.height = height;
            this.circles = [];
            this.speed = 1;
            this.circleInterval = 0;
            this.animationInterval = 0;
            this.game = game;
        }
        draw() {
            ctx.canvas.width = this.width;
            ctx.canvas.height = this.height;
        }
        addCircle() {
            const circle = new Circle(
                getRandom(0, 400),
                getRandom(0, -400),
                getRandom(10, 50)
            );
            this.circles.push(circle);
        }
        populate() {
            this.addCircle();
            this.circleInterval = setInterval(this.addCircle.bind(this), 1000);
            this.animate();
        }
        gameOver() {
            clearInterval(this.circleInterval);
            cancelAnimationFrame(this.animationInterval);
            game.end();
        }
        clear() {
            this.circles = [];
            ctx.clearRect(0, 0, this.width, this.height);
        }
        animate() {
            ctx.clearRect(0, 0, this.width, this.height);

            let circles = this.circles.length;
            let stopAnimate = false;
            for (var i = 0; i < circles; i++) {
                const circle = this.circles[i];
                circle.draw();
                if (circle.y < this.height - circle.radius) {
                    circle.y += this.speed;
                } else {
                    stopAnimate = true;
                }
            }
            this.animationInterval = window.requestAnimationFrame(this.animate.bind(this));
            if (circles === 0 || stopAnimate) {
                this.gameOver();
            }
        }
    }

    class Game {
        constructor() {
            this.score = 0;
            this.board = new Board(400, 400, this);
            this.activeGame = true;
        }
        setScore(count) {
            count === 0 ? this.score = 0 : this.score += count;
            const scoreBoard = document.getElementById("scoreBoard");
            const score = `<h3>Score: ${this.score}</h3>`;
            scoreBoard.innerHTML = score;
        }
        newGame() {
            this.board.draw();
            this.setScore(0);
            this.board.populate();
        }
        end() {
            this.activeGame = false;
        }
        reset() {
            this.activeGame = true;
            this.setScore(0);
            this.board.clear();
        }
    }

    // const board = new Board(400, 400);
    const game = new Game();
    game.newGame();

    const reset = document.getElementById("reset");
    reset.addEventListener("click", function() {
        game.reset();
    });

    const start = document.getElementById("start");
    start.addEventListener("click", function() {
        game.reset();
        game.board.populate();
    });

    const container = document.getElementById("container");
    container.addEventListener("click", function(e) {
        if (!game.activeGame) {
            return;
        }
        var rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        for (var i = 0; i < game.board.circles.length; i ++) {
            const cx = game.board.circles.length ? game.board.circles[i].x : 0;
            const cy = game.board.circles.length ? game.board.circles[i].y : 0;
            const r = game.board.circles.length ? game.board.circles[i].radius : 0;
            if (intersects(x, y, cx, cy, r)) {
                game.setScore(1);
                game.board.circles.splice(i, 1);
            }
        }
    });

    function intersects(x, y, cx, cy, r) {
        var dx = x - cx;
        var dy = y - cy;
        return dx * dx + dy * dy <= r * r;
    }
    function getRandom(min, max) {
        return Math.floor((Math.random() * max) + min);
    }
});
