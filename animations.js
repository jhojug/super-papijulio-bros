export const createAnimations = (game) => {
  game.anims.create({
    key: 'mario-walk',
    frames: game.anims.generateFrameNumbers(
      'mario',
      { start: 6, end: 8 }
    ),
    frameRate: 10,
    repeat: -1
  })

  game.anims.create({
    key: 'mario-idle',
    frames: [{ key: 'mario', frame: 1 }]
  })

  game.anims.create({
    key: 'mario-jump',
    frames: [{ key: 'mario', frame: 0 }]
  })

  game.anims.create({
    key: 'mario-dead',
    frames: [{ key: 'mario', frame: 10 }]
  })

  game.anims.create({
    key: 'bebe-walk',
    frames: game.anims.generateFrameNumbers(
      'bebe',
      { start: 0, end: 23 }
    ),
    frameRate: 22,
    repeat: -1
  })
}