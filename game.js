/* global Phaser */

import { createAnimations } from "./animations.js"

const config = {
  type: Phaser.AUTO, // webgl, canvas
  width: 800,
  height: 500,
  backgroundColor: '#049cd8',
  parent: 'game',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload, // se ejecuta para precargar recursos
    create, // se ejecuta cuando el juego comienza
    update // se ejecuta en cada frame
  }
}

new Phaser.Game(config)
// this -> game -> el juego que estamos construyendo
var backgroundMusic;

function preload () {
  this.load.image(
    'cloud1',
    'assets/scenery/overworld/cloud1.png'
  )

  this.load.image(
    'cloud2',
    'assets/scenery/overworld/cloud2.png'
  )

  this.load.image(
    'floorbricks',
    'assets/scenery/overworld/floorbricks.png'
  )

  this.load.image(
    'castle',
    'assets/scenery/castle.png'
  )

  this.load.spritesheet(
    'mario', // <--- id
    'assets/entities/julio.png',
    { frameWidth: 31, frameHeight: 42.5 }
  )

  this.load.spritesheet(
    'bebe', // <--- id
    'assets/entities/bebe.png',
    { frameWidth: 117, frameHeight: 100 }
  )

  this.load.audio('gameover', 'assets/sound/music/gameover.mp3')
  this.load.audio('jump', 'assets/sound/effects/jump.mp3')
  this.load.audio('stomp', 'assets/sound/effects/kick.mp3')
  this.load.audio('theme', 'assets/sound/music/underground/theme.mp3')
  this.load.audio('win', 'assets/sound/music/win.wav')
} // 1.

function create () {
  backgroundMusic = this.sound.add('theme', { volume: 0.3 });
  backgroundMusic.play({
      loop: true
  });

  var text = this.add.text(400, 200, 'Super PapiJulio Bros', { fontSize: '40px', fill: '#fff' });
  text.setOrigin(0.5, 0.5);

  // image(x, y, id-del-asset)
  this.add.image(100, 50, 'cloud1')
    .setOrigin(0, 0)
    .setScale(0.35)

  this.add.image(600, 80, 'cloud2')
    .setOrigin(0, 0)
    .setScale(0.35)

  this.add.image(1100, 50, 'cloud1')
    .setOrigin(0, 0)
    .setScale(0.35)

  this.add.image(1600, 80, 'cloud2')
    .setOrigin(0, 0)
    .setScale(0.35)

  this.add.image(1700, 196, 'castle')
    .setOrigin(0, 0)
    .setScale(3)

  this.floor = this.physics.add.staticGroup()

  this.floor
    .create(0, config.height, 'floorbricks')
    .setOrigin(0, 1)
    .setScale(2)
    .refreshBody()

  this.floor
    .create(350, config.height, 'floorbricks')
    .setOrigin(0, 1)
    .setScale(2)
    .refreshBody()

  this.floor
    .create(606, config.height, 'floorbricks')
    .setOrigin(0, 1)
    .setScale(2)
    .refreshBody()

  this.floor
    .create(862, config.height, 'floorbricks')
    .setOrigin(0, 1)
    .setScale(2)
    .refreshBody()
  
  this.floor
    .create(1118, config.height, 'floorbricks')
    .setOrigin(0, 1)
    .setScale(2)
    .refreshBody()

  this.floor
    .create(1574, config.height, 'floorbricks')
    .setOrigin(0, 1)
    .setScale(2)
    .refreshBody()

  this.floor
    .create(1830, config.height, 'floorbricks')
    .setOrigin(0, 1)
    .setScale(2)
    .refreshBody()

  this.mario = this.physics.add.sprite(50, 250, 'mario')
    .setOrigin(0, 1)
    .setScale(2)
    .setCollideWorldBounds(true)
    .setGravityY(500)
  this.mario.salto = false

  this.bebe = this.physics.add.sprite(900, 432, 'bebe')
    .setOrigin(0, 1)
    .setScale(0.40)
    .setCollideWorldBounds(true)
    .setFlipX(true)

  this.bebe2 = this.physics.add.sprite(1300, 432, 'bebe')
    .setOrigin(0, 1)
    .setScale(0.40)
    .setCollideWorldBounds(true)
    .setFlipX(true)

  this.physics.world.setBounds(0, 0, 2000, config.height)
  this.physics.add.collider(this.mario, this.floor)
  this.physics.add.collider(this.bebe, this.floor)
  this.physics.add.collider(this.bebe, this.mario, handleCollision, null, this);
  this.physics.add.collider(this.bebe2, this.floor)
  this.physics.add.collider(this.bebe2, this.mario, handleCollision, null, this);

  this.cameras.main.setBounds(0, 0, 2000, config.height)
  this.cameras.main.startFollow(this.mario)

  createAnimations(this)

  this.keys = this.input.keyboard.createCursorKeys()
}

function update () { // 3. continuamente
  if (this.mario.isDead) return

  if (this.keys.left.isDown && this.mario.x > 0) {
    if(this.mario.body.touching.down)
      this.mario.anims.play('mario-walk', true)
    this.mario.x -= 2
    this.mario.flipX = true
  } else if (this.keys.right.isDown && this.mario.x + this.mario.displayWidth < this.physics.world.bounds.width) {
    if(this.mario?.body?.touching?.down)
      this.mario.anims.play('mario-walk', true)
    this.mario.x += 2
    this.mario.flipX = false
  } else if (this.mario.body.touching.down) {
    this.mario.anims.play('mario-idle', true)
  }

  if (this.keys.up.isDown && this.mario.body.touching.down) {
    this.mario.setVelocityY(-400)
    this.mario.anims.play('mario-jump', true)
    this.mario.salto = true
    this.sound.add('jump', { volume: 0.1 }).play()
  }

  if(this.mario.salto && !this.mario.body.touching.down) {
    this.mario.anims.play('mario-jump', true)
  }

  if(this.mario.body.touching.down) {
    this.mario.salto = false
  }

  if (this.mario.y >= config.height) {
    this.mario.isDead = true
    backgroundMusic.stop()
    this.mario.anims.play('mario-dead')
    this.mario.setCollideWorldBounds(false)
    this.sound.add('gameover', { volume: 0.2 }).play()

    setTimeout(() => {
      this.mario.setVelocityY(-350)
    }, 100)

    setTimeout(() => {
      this.scene.restart()
    }, 8000)
  }

  if(this.mario.x > 515 || this.bebe.isBegin) {
    this.bebe.isBegin = true
    if(this.bebe.x > 0) {
      this.bebe.anims.play('bebe-walk', true)
      this.bebe.x -= 2.0
    }
  }

  if (this.bebe.y == config.height) {
    this.sound.add('stomp', { volume: 0.2 }).play()
    this.bebe.setCollideWorldBounds(false)
    this.bebe.flipY = true
  }

  if(this.mario.x > 815 || this.bebe2.isBegin) {
    this.bebe2.isBegin = true
    if(this.bebe2.x > 0) {
      this.bebe2.anims.play('bebe-walk', true)
      this.bebe2.x -= 2.0
    }
  }

  if (this.bebe2.y == config.height) {
    this.sound.add('stomp', { volume: 0.2 }).play()
    this.bebe2.setCollideWorldBounds(false)
    this.bebe2.flipY = true
  }

  if(this.mario.x == 1790) {
    this.mario.isDead = true
    backgroundMusic.stop()
    this.sound.add('win', { volume: 0.2 }).play()
    this.mario.setVisible(false);
    setTimeout(() => {
      this.scene.restart()
    }, 8000)
  }
}

function handleCollision(entity1, entity2) {
  if(entity2.isDead) return
  entity2.isDead = true
  backgroundMusic.stop()
  entity2.anims.play('mario-dead')
  entity2.setCollideWorldBounds(false)
  this.sound.add('gameover', { volume: 0.2 }).play()

  setTimeout(() => {
    entity2.setVelocityY(-350)
  }, 100)

  setTimeout(() => {
    this.scene.restart()
  }, 8000)
  // Aquí puedes añadir cualquier lógica adicional que desees ejecutar al detectar la colisión
}