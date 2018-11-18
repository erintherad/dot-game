
window.addEventListener("load", function() {
    const canvas = document.getElementsByTagName("canvas")[0];
    const ctx = canvas.getContext("2d");

    if (canvas.getContext) {
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
            constructor(width, height) {
                this.width = width;
                this.height = height;
                this.circles = [];
            }
            draw() {
                ctx.canvas.width = this.width;
                ctx.canvas.height = this.height;
            }
            populate() {
                const circle = new Circle(
                    getRandom(0, 400),
                    0,
                    getRandom(10, 50)
                );
                board.circles.push(circle);
                circle.draw();
            }
            clear() {
                this.circles = [];
                ctx.clearRect(0, 0, this.width, this.height);
            }
        }

        class Game {
            constructor(score, board) {
                this.score = score;
                this.board = board;
            }
            setScore(count) {
                this.score = count || 0;
                const scoreBoard = document.getElementById("scoreBoard");
                const score = `<h3>Score: ${this.score}</h3>`;
                scoreBoard.innerHTML = score;
            }
            newGame() {
                board.draw();
                this.setScore();
                board.populate();
            }
            reset() {
                this.setScore(0);
                board.clear();
            }
        }

        const board = new Board(400, 400);
        const game = new Game(0, board);
        game.newGame();

        const reset = document.getElementById("reset");
        reset.addEventListener("click", function() {
            game.reset();
        });

        const start = document.getElementById("start");
        start.addEventListener("click", function() {
            game.reset();
            board.populate();
        });

        const container = document.getElementById("container");
        container.addEventListener("click", function(e) {
            var rect = e.target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const cx = board.circles.length ? board.circles[0].x : 0;
            const cy = board.circles.length ? board.circles[0].y : 0;
            const r = board.circles.length ? board.circles[0].radius : 0;
            if (intersects(x, y, cx, cy, r)) {
                game.setScore(1);
                board.clear();
            }
        });
    }
    function intersects(x, y, cx, cy, r) {
        var dx = x - cx;
        var dy = y - cy;
        return dx * dx + dy * dy <= r * r;
    }
    function getRandom(min, max) {
        return Math.floor((Math.random() * max) + min);
    }
});
