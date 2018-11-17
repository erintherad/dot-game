
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
            update() {
                const circle = new Path2D();
                circle.arc(
                    this.x,
                    this.y,
                    this.radius,
                    0,
                    2 * Math.PI,
                    false
                );
                ctx.stroke(circle);
            }
            draw() {
                var circle = new Circle(100, 75, 50);
                circle.update();
            }
        }

        class Board {
            constructor(width, height) {
                this.width = width;
                this.height = height;
            }
            draw() {
                ctx.canvas.width = this.width;
                ctx.canvas.height = this.height;
            }
            clear() {
                ctx.clearRect(0, 0, this.width, this.height);
            }
        }

        class Game {
            constructor(score, board) {
                this.score = score;
                this.board = board;
            }
            newGame() {
                board.draw();

                const scoreBoard = document.getElementById("scoreBoard");
                const score = `<h3>Score: ${this.score}</h3>`;
                scoreBoard.innerHTML = score;

                var circle = new Circle(100, 75, 50);
                circle.draw();
            }
        }

        const board = new Board(400, 400);
        const game = new Game(0, board);
        game.newGame();

        const reset = document.getElementById("reset");
        reset.addEventListener("click", function() {
            board.clear();
        });

        const start = document.getElementById("start");
        start.addEventListener("click", function() {
            var circle = new Circle(100, 75, 50);
            circle.draw();
        });
    }
});
