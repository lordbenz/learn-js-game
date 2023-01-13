// create a new scene
let gameScene = new Phaser.Scene("Game");

// initial parameters
gameScene.init = function () {
  // player speed
  this.playerSpeed = 3;

  // enemy speed
  this.enemyMinSpeed = 1;
  this.enemyMaxSpeed = 3;

  // boundaries
  this.enemyMinY = 80;
  this.enemyMaxY = 280;

  //   we are not terminating
  this.isTerminating = false;
};

// Load assets, preload is called before create
gameScene.preload = function () {
  // Load images (name, path)
  this.load.image("background", "assets/background.png");
  this.load.image("player", "assets/player.png");
  this.load.image("dragon", "assets/dragon.png");
  this.load.image("treasure", "assets/treasure.png");
};

// called once after the preload ends
gameScene.create = function () {
  // create bg sprite
  // this.add.sprite(0, 0, 'background'); // this is the old way, show incorrect coordinates
  // the origin of the sprite is in the top left corner 0,0 and the width and height are 640x360

  let bg = this.add.sprite(0, 0, "background");
  // change the origin to the top-left of the sprite
  // bg.setOrigin(0, 0); // 1st way to set the origin

  bg.setPosition(640 / 2, 360 / 2); // 2nd way to set the origin, set postion to the center of the screen

  // create the player
  this.player = this.add.sprite(50, this.sys.game.config.height / 2, "player");
  this.player.setScale(0.5); // scale the player down

  // create the treasure
  this.treasure = this.add.sprite(
    this.sys.game.config.width - 80,
    this.sys.game.config.height / 2,
    "treasure"
  );
  this.treasure.setScale(0.6);

  // create the enemies group
  this.enemies = this.add.group({
    key: "dragon",
    repeat: 5,
    setXY: {
      x: 100,
      y: 100,
      stepX: 80,
      stepY: 20,
    },
  });
  //

  // add dragon to the group

  // scale down all the dragon
  Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.5, -0.5); // scale down the dragon

  // set flipX and speed
  Phaser.Actions.Call(
    this.enemies.getChildren(),
    function (enemy) {
      enemy.flipX = true; // flip dragon to face left
      let dir = Math.random() < 0.5 ? 1 : -1;
      let speed =
        this.enemyMinSpeed +
        Math.random() * (this.enemyMaxSpeed - this.enemyMinSpeed);
      enemy.speed = dir * speed;
    },
    this
  );
};

gameScene.update = function () {
  // don't execute if we are terminating
  if (this.isTerminating) return;

  // check for active input
  if (this.input.activePointer.isDown) {
    // player walks
    this.player.x += this.playerSpeed;
  }
  //  overlap check
  let playerRect = this.player.getBounds();
  let treasureRect = this.treasure.getBounds();

  if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, treasureRect)) {
    //restart the scene

    console.log("reached goal");
    this.gameOver();
    return;
  }

  let enemies = this.enemies.getChildren();
  let numEnemies = enemies.length;

  for (let i = 0; i < numEnemies; i++) {
    // enemy movement
    enemies[i].y += enemies[i].speed;

    let conditionUp = enemies[i].speed < 0 && enemies[i].y <= this.enemyMinY;
    let conditionDown = enemies[i].speed > 0 && enemies[i].y >= this.enemyMaxY;

    // check we haven't passed min or max Y
    if (conditionUp || conditionDown) {
      enemies[i].speed *= -1;
    }

    // check enemy overlap
    let enemyRect = enemies[i].getBounds();

    if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, enemyRect)) {
      console.log("Game Over!");

      this.gameOver();
      return;
    }
  }
};

gameScene.gameOver = function () {
  // initiated game over event
  this.isTerminating = true;

  // shake the camera
  this.cameras.main.shake(500);

  // listen for event completion
  this.cameras.main.on(
    "camerashakecomplete",
    function (camera, effect) {

      // fade out
      this.cameras.main.fade(500);
    },
    this
  );

  this.cameras.main.on('camerafadeoutcomplete', function(camera, effect) {
    // restart the scene
    this.scene.restart();
  }, this);

};

// set the configuration of the games
const config = {
  type: Phaser.AUTO, // Phaser will use WebGL if available, if not it will use Canvas
  width: 640,
  height: 360,
  scene: gameScene,
};

// create a new game, pass the configuration
let game = new Phaser.Game(config);
