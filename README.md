# Flappy Bird Reborn Multiplayer

This is a fork of [Flappy Bird Reborn][] a flappy bird clone using
[Phaser][], a game engine.

[Flappy Bird Reborn]: https://github.com/codevinsky/flappy-bird-reborn
[Phaser]: http://phaser.io/

What has been modified:

 - compatibility with mobile phones.
 - build system (and not embedding a prebuilt version).
 - multiplayer through Socket.IO.
 - score board removed.

## Build

    npm install
    npm install -g grunt-cli
    grunt

## Use

    node server.js

## Development

    grunt serve

