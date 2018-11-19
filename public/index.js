
window.addEventListener("load", function() {
    class Circle {
        constructor(x, y, radius, ctx) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.ctx = ctx;
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
            this.ctx.fill(circle);
        }
        intersects(x, y, cx, cy) {
            var dx = x - cx;
            var dy = y - cy;
            return dx * dx + dy * dy <= this.radius * this.radius;
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
            this.ctx = null;
        }
        draw() {
            const canvas = document.createElement("canvas");
            canvas.id = "container";
            const unsupportedText = document.createElement("p");
            unsupportedText.innerText = (
                "Sorry, your browser cannot display this game."
            );
            canvas.appendChild(unsupportedText);

            this.ctx = canvas.getContext("2d");
            this.ctx.canvas.width = this.width;
            this.ctx.canvas.height = this.height;

            document.body.append(canvas);

            canvas.addEventListener("click", function(event) {
                if (!this.game.activeGame) {
                    return;
                }
                var rect = event.target.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                for (var i = 0; i < this.circles.length; i ++) {
                    const cx = this.circles.length ? this.circles[i].x : 0;
                    const cy = this.circles.length ? this.circles[i].y : 0;
                    if (this.circles[i].intersects(x, y, cx, cy)) {
                        this.game.score.increment();
                        this.circles.splice(i, 1);
                    }
                }
            }.bind(this));
        }
        getRandomNumber(min, max) {
            return Math.floor((Math.random() * max) + min);
        }
        addCircle() {
            const circle = new Circle(
                this.getRandomNumber(0, 400),
                this.getRandomNumber(0, -400),
                this.getRandomNumber(10, 50),
                this.ctx
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
            this.game.end();
        }
        clear() {
            this.circles = [];
            this.ctx.clearRect(0, 0, this.width, this.height);
        }
        animate() {
            this.ctx.clearRect(0, 0, this.width, this.height);

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

    class Button {
        constructor(game, text, clickFunction) {
            this.game = game;
            this.text = text;
            this.clickFunction = clickFunction;
            this.element = null;
        }
        draw() {
            this.element = document.createElement("button");
            // Firefox persists the disabled state unless autocomplete is "off"
            this.element.autocomplete = "off";
            this.element.innerText = this.text;
            document.body.append(this.element);
            this.element.addEventListener("click", this.clickFunction.bind(this));
        }
        disable() {
            this.element.disabled = true;
        }
        enable() {
            this.element.disabled = false;
        }
    }

    class Slider {
        constructor(game, text, changeFunction) {
            this.game = game;
            this.text = text;
            this.changeFunction = changeFunction;
        }
        draw() {
            const div = document.createElement("div");
            const slider = document.createElement("input");
            slider.type = "range";
            slider.min = this.game.board.speed;
            slider.max = 5;
            slider.step = 0.1;
            slider.value = this.game.board.speed;
            const label = document.createElement("label");
            label.innerText = this.text;
            div.appendChild(slider);
            div.appendChild(label);
            document.body.append(div);
            slider.addEventListener("change", this.changeFunction.bind(this));
        }
    }

    class Score {
        constructor() {
            this.score = 0;
        }
        draw() {
            this.element = document.createElement("h2");
            this.render();
            document.body.append(this.element);
        }
        render() {
            this.element.innerText = `Score: ${this.score}`;
        }
        reset() {
            this.score = 0;
            this.render();
        }
        increment() {
            this.score += 1;
            this.render();
        }
    }

    class Game {
        constructor() {
            this.score = new Score();
            this.startButton = new Button(this, "Start", function() {
                this.disable();
                this.game.reset();
                this.game.board.populate();
            });
            this.speedSlider = new Slider(this, "Speed", function(event) {
                const slider = event.target;
                this.game.board.speed = parseInt(slider.value);
            });
            this.board = new Board(400, 400, this);
            this.activeGame = true;
        }
        draw() {
            this.score.draw();
            this.startButton.draw();
            this.speedSlider.draw();
            this.board.draw();
        }
        end() {
            this.activeGame = false;
            this.startButton.enable();
        }
        reset() {
            this.activeGame = true;
            this.score.reset();
            this.board.clear();
        }
    }

    (new Game()).draw();
});
