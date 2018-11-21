const MAX_SCORE = 10;
const HEADER_HEIGHT = 220;
const CANVAS_WIDTH = window.innerWidth;
const CANVAS_HEIGHT = window.innerHeight - HEADER_HEIGHT; //give us some room for the header

class Circle {
    constructor(x, y, radius, ctx) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.ctx = ctx;
        this.points = Math.floor((MAX_SCORE + 1) - (radius * 2) / MAX_SCORE);
        this.color = this.randomColor();
        this.pattern = null;
    }
    randomColor() {
        const colors = ["red", "orange", "yellow", "green", "blue", "purple"];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    draw() {
        if (this.pattern) {
            this.ctx.drawImage(
                this.pattern,
                this.x - this.radius,
                this.y - this.radius,
                this.radius * 2,
                this.radius * 2
            );

        } else {
            const circle = new Path2D();
            circle.arc(
                this.x,
                this.y,
                this.radius,
                0,
                2 * Math.PI,
                false
            );
            this.ctx.fillStyle = this.color;
            this.ctx.fill(circle);
        }
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
        this.speed = 60;
        this.circleInterval = 0;
        this.animationInterval = 0;
        this.game = game;
        this.ctx = null;
        this.mode = "default";
        this.modeInterval = null;
    }
    resize() {
        var canvas = document.getElementById("container");
        canvas.width = this.game.getWidth();
        canvas.height = this.game.getHeight() - HEADER_HEIGHT;
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
            if (!this.game.active) {
                return;
            }
            var rect = event.target.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            for (var i = 0; i < this.circles.length; i ++) {
                const circle = this.circles[i];
                if (circle.intersects(x, y, circle.x, circle.y)) {
                    this.game.score.increment(circle.points);
                    this.circles.splice(i, 1);
                }
            }
        }.bind(this));

        window.addEventListener("resize", function() {
            this.resize();
        }.bind(this));
    }
    // from MDN Math.random() docs
    genRandomNumberInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    addCircle() {
        const radius = this.genRandomNumberInclusive(5, 50);
        const circle = new Circle(
            this.genRandomNumberInclusive(
                radius, this.game.getWidth() - radius),
            -radius,
            radius,
            this.ctx
        );
        if (this.mode === "disco") {
            const image = document.createElement("img");
            image.src = "/assets/disco.png";
            circle.pattern = image;
        }
        this.circles.push(circle);
    }
    populate() {
        this.addCircle();
        this.circleInterval = setInterval(this.addCircle.bind(this), 1000);
    }
    clear() {
        this.circles = [];
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
    animate() {
        this.ctx.clearRect(0, 0, this.game.getWidth(), this.height);

        for (var i = 0; i < this.circles.length; i++) {
            const circle = this.circles[i];
            circle.y += this.speed / 60.0; // assumes refresh rate of 60 fps
            circle.draw();
        }
        this.circles = this.circles.filter(function(circle) {
            return circle.y - circle.radius <= this.height;
        }.bind(this));

        this.animationInterval = window.requestAnimationFrame(this.animate.bind(this));
    }
    pause() {
        window.clearInterval(this.circleInterval);
        window.cancelAnimationFrame(this.animationInterval);
    }
    changeMode(mode) {
        this.mode = mode;

        if (this.modeInterval) {
            clearInterval(this.modeInterval);
        }

        for(var i = 0; i < this.circles.length; i++) {
            const circle = this.circles[i];
            circle.pattern = null;
        }

        if (mode === "random") {
            this.modeInterval = setInterval(function() {
                for(var i = 0; i < this.circles.length; i++) {
                    const circle = this.circles[i];
                    circle.color = circle.randomColor();
                }
            }.bind(this), 150);
        } else if (mode === "disco") {
            for(var j = 0; j < this.circles.length; j++) {
                const circle = this.circles[j];

                const image = document.createElement("img");
                image.src = "/assets/disco.png";

                circle.pattern = image;
            }
        }
    }
}

class Button {
    constructor(game) {
        this.game = game;
        this.text = "Start";
        this.element = null;
    }
    draw() {
        this.element = document.createElement("button");
        this.render();
        document.getElementById("control").append(this.element);
        this.element.addEventListener("click", function() {
            if (this.text === "Start") {
                this.element.classList.add("pause");
                this.game.start();
            } else {
                this.element.classList.remove("pause");
                this.game.pause();
            }
            this.toggle();
        }.bind(this));
    }
    render() {
        this.element.innerText = this.text;
    }
    toggle() {
        if (this.text === "Start") {
            this.text = "Pause";
        } else {
            this.text = "Start";
        }
        this.render();
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
        slider.min = 10;
        slider.max = 100;
        slider.step = 10;
        slider.onKeydown = true;
        slider.value = this.game.board.speed;

        const label = document.createElement("label");
        label.innerText = this.text;

        div.appendChild(slider);
        div.appendChild(label);
        document.getElementById("control").append(div);

        slider.addEventListener("change", this.changeFunction.bind(this));
    }
}

class ModeSwitcher {
    constructor(board) {
        this.board = board;
    }
    draw() {
        const form = document.createElement("form");

        const defaultRadio = document.createElement("input");
        defaultRadio.type = "radio";
        defaultRadio.value = "default";
        defaultRadio.name = "mode";
        defaultRadio.checked = true;
        defaultRadio.id = "default";
        const defaultLabel = document.createElement("label");
        defaultLabel.innerText = "Default";
        defaultLabel.htmlFor = "default";

        const randomRadio = document.createElement("input");
        randomRadio.type = "radio";
        randomRadio.value = "random";
        randomRadio.name = "mode";
        randomRadio.id = "random";
        const randomLabel = document.createElement("label");
        randomLabel.innerText = "Random";
        randomLabel.htmlFor = "random";

        const discoRadio = document.createElement("input");
        discoRadio.type = "radio";
        discoRadio.value = "disco";
        discoRadio.name = "mode";
        discoRadio.id = "disco";
        const discoLabel = document.createElement("label");
        discoLabel.innerText = "Disco";
        discoLabel.htmlFor = "disco";

        form.appendChild(defaultRadio);
        form.appendChild(defaultLabel);
        form.appendChild(randomRadio);
        form.appendChild(randomLabel);
        form.appendChild(discoRadio);
        form.appendChild(discoLabel);
        document.getElementById("control").append(form);

        const changeHandler = function(e) {
            const radio = e.target;
            this.board.changeMode(radio.value);
        }.bind(this);

        defaultRadio.addEventListener("change", changeHandler);
        randomRadio.addEventListener("change", changeHandler);
        discoRadio.addEventListener("change", changeHandler);
    }
}

class Score {
    constructor() {
        this.score = 0;
    }
    draw() {
        this.element = document.createElement("h3");
        this.render();
        document.getElementById("title").append(this.element);
    }
    render() {
        this.element.innerText = `Score: ${this.score}`;
    }
    increment(points) {
        this.score += points;
        this.render();
    }
}

class Game {
    constructor() {
        this.score = new Score();
        this.startButton = new Button(this);
        this.speedSlider = new Slider(this, "Speed", function(event) {
            const slider = event.target;
            this.game.board.speed = parseInt(slider.value);
        });
        this.board = new Board(
            CANVAS_WIDTH, CANVAS_HEIGHT, this);
        this.active = null;
        this.modeSwitcher = new ModeSwitcher(this.board);
    }
    init() {
        this.score.draw();
        this.startButton.draw();
        this.speedSlider.draw();
        this.board.draw();
        this.modeSwitcher.draw();
    }
    getWidth() {
        return document.documentElement.clientWidth;
    }
    getHeight() {
        return document.documentElement.clientHeight;
    }
    start() {
        this.active = true;
        this.board.populate();
        this.board.animate();
    }
    pause() {
        this.active = false;
        this.board.pause();
    }
}

window.addEventListener("load", function() {
    (new Game()).init();
});
