'use strict';
var Phaser = require('Phaser'),
    Bird = require('../prefabs/bird'),
    Ground = require('../prefabs/ground'),
    Pipe = require('../prefabs/pipe'),
    PipeGroup = require('../prefabs/pipeGroup');

function Play() {
}

Play.prototype = {
  create: function() {
    // start the phaser arcade physics engine
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    // give our world an initial gravity of 1200
    this.game.physics.arcade.gravity.y = 1200;

    // add the background sprite
    console.log('hello');
    this.background = this.game.add.tileSprite(0, 0,
                                               this.game.width,
                                               this.game.height,
                                               'background');

    // create and add a group to hold our pipeGroup prefabs
    this.pipes = this.game.add.group();

    // create and add a new Bird object
    this.bird = new Bird(this.game, 100, this.game.height / 2);
    this.game.add.existing(this.bird);

    // create and add a new Ground object
    this.ground = new Ground(this.game, 0, 400, this.game.width, 112);
    this.game.add.existing(this.ground);

    // add keyboard controls
    this.flapKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.flapKey.onDown.addOnce(this.startGame, this);
    this.flapKey.onDown.add(this.bird.flap, this.bird);

    // add mouse/touch controls
    this.game.input.onDown.addOnce(this.startGame, this);
    this.game.input.onDown.add(this.bird.flap, this.bird);

    // keep the spacebar from propogating up to the browser
    this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

    this.instructionGroup = this.game.add.group();
    this.instructionGroup.add(this.game.add.sprite(this.game.width / 2,
                                                   100, 'getReady'));
    this.instructionGroup.add(this.game.add.sprite(this.game.width / 2,
                                                   325, 'instructions'));
    this.instructionGroup.setAll('anchor.x', 0.5);
    this.instructionGroup.setAll('anchor.y', 0.5);

    this.pipeGenerator = null;

    this.gameover = false;

    this.pipeHitSound = this.game.add.audio('pipeHit');
    this.groundHitSound = this.game.add.audio('groundHit');
  },

  update: function() {
    // enable collisions between the bird and the ground
    this.game.physics.arcade.collide(this.bird, this.ground,
                                     this.deathHandler, null, this);

    if (!this.gameover) {
        // enable collisions between the bird and each group in the pipes group
        this.pipes.forEach(function(pipeGroup) {
          this.game.physics.arcade.collide(this.bird, pipeGroup,
                                           this.deathHandler, null, this);
        }, this);
    }

  },
  shutdown: function() {
    this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
    this.bird.destroy();
    this.pipes.destroy();
  },

  startGame: function() {
    if (!this.bird.alive && !this.gameover) {
      this.bird.body.allowGravity = true;
      this.bird.alive = true;

      // Use a common seed for randomness
      this.game.rnd.sow([5654, 7655, 8765]);

      // add a timer
      this.pipeGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 1.25,
                                                      this.generatePipes, this);
      this.pipeGenerator.timer.start();

      this.instructionGroup.destroy();
    }
  },
  deathHandler: function(bird, enemy) {
    if (enemy instanceof Ground && !this.bird.onGround) {
      this.groundHitSound.play();
      this.bird.onGround = true;
    } else if (enemy instanceof Pipe){
      this.pipeHitSound.play();
    }

    if (!this.gameover) {
      this.gameover = true;
      this.bird.kill();
      this.pipes.callAll('stop');
      this.pipeGenerator.timer.stop();
      this.ground.stopScroll();

      // add a restart button with a callback
      var t = this.game.time.events.add(Phaser.Timer.SECOND * 2,
                                        this.restartButton, this);
      t.timer.start();
    }
  },
  restartButton: function() {
    this.startButton = this.game.add.button(this.game.width / 2,
                                            300, 'startButton',
                                            this.restartClick,
                                            this);
    this.startButton.anchor.setTo(0.5, 0.5);
  },
  restartClick: function() {
    this.game.state.start('play');
  },
  generatePipes: function() {
    var pipeY = this.game.rnd.integerInRange(-100, 100);
    var pipeGroup = this.pipes.getFirstExists(false);
    if (!pipeGroup) {
      pipeGroup = new PipeGroup(this.game,
                                this.pipes);
    }
    pipeGroup.reset(this.game.width, pipeY);
  }
};

module.exports = Play;
