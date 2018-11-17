
window.addEventListener("load", function() {
    const canvas = document.getElementsByTagName("canvas")[0];
    const ctx = canvas.getContext("2d");

    if (canvas.getContext) {
        class Board {
            constructor(width, height) {
                this.width = width;
                this.height = height;
            }
            draw() {
                ctx.canvas.width = this.width;
                ctx.canvas.height = this.height;
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
            }
        }

        const board = new Board(400, 400);
        const game = new Game(0, board);
        game.newGame();
    }
});
