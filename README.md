## Dot-game

A simple falling dot game.

In the game, dots move from the top to the bottom of the screen.
A player tries to click on the dots, and receives points when they are successful.

<p align="center">
  <img src="https://i.imgur.com/R71EseG.gif" />
</p>

## Extras

This game comes in a standard default mode, which can be seen above.  Additionally, the user can enable a random and party mode.  Moving the speed slider will make the dots drop at a faster rate.

### Random Mode
---------------

<p align="center">
  <img src="https://i.imgur.com/gk6a4rW.gif" />
</p>

### Disco Mode
--------------

<p align="center">
  <img src="https://i.imgur.com/pE8IF9I.gif" />
</p>

### Mobile responsive
---------------------

<p align="center">
  <img src="https://i.imgur.com/LsApN5W.gif" />
</p>

## Guidelines for Completing the Exercise

* Your application should work in current Chrome.
* You can edit any file in the project, and add any assets you require (see below).
* You may look up anything you'd like.
* You should not use a JavaScript library.
* You must write at least the CSS necessary to achieve the basic layout of the game; you may also write additional CSS to improve the design of the game.
* The project is set up to use Sass, but you may also author plain CSS, or add a different CSS preprocessor.
* Your finished code should be of a quality that you would submit to your peers for a code review.
Building the Game
* The game starts when a player touches or clicks the Start button; at that point, the Start button changes to a Pause button, which should pause the game until the button is touched or clicked again.
Dots fall at a constant rate. A player should be able to use a slider to control the rate at which dots fall; at the slider's left-most position, dots should fall at a speed of 10px per second, and at the slider's right-most position, should fall at a speed of 100px per second.
* A new dot appears at a random horizontal position at the top of the box every second. A dot should not "hang" off the left or right edge of the screen.
Dots should vary randomly in size from 10px in diameter to 100px in diameter.
* A dot's value is inversely proportional to its size, with the smallest dots worth 10 points, and the largest dots worth 1 point.
When a player touches or clicks a dot, the dot should disappear from the box, and the score should be increased based on the dot's value.
* A new dot should also appear every 1000ms.
* You can view your running application by clicking the "Show" link in the upper left-hand corner of the page.

## Creating and Using Assets

To create a new asset, click on the "assets" directory in the front-end section; drag the file from you computer to the browser window.

To use an asset, click on the "assets" directory in the front-end section; then, click the "Copy URL" button to get the asset's URL.
