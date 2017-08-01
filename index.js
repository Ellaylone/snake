const snakeGame = (() => {
  const utils = {
    rnd: {
      range: {
        int: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
      }
    }
  }

  class Game {
    constructor() {
      this.canvas = null
      this.ctx = null
      this.loaded = false

      this.options = {
        boardBgColor: 'black',
        snakeBgColor: 'white',
        gridBgColor: 'white',
        isWraps: true,

        displayGrid: false,

        tileSize: 20,

        startPosition: 'center',
      }

      this.startPositions = {}
    }

    init(canvas, size, options) {
      this.canvas = canvas
      this.ctx = this.canvas.getContext('2d')

      Object.assign(this.options, options)

      this.canvas.width = size
      this.canvas.height = size

      document.addEventListener('keydown', this.onKeyDown.bind(this))

      this.tilesInSide = size / this.options.tileSize

      this.drawBoard()
      this.initSnake()
    }

    onKeyDown(e) {
      switch (e.keyCode) {
        case 37:
          this.snake.vx = -1
          this.snake.vy = 0
          break
        case 38:
          this.snake.vx = 0
          this.snake.vy = -1
          break
        case 39:
          this.snake.vx = 1
          this.snake.vy = 0
          break
        case 40:
          this.snake.vx = 0
          this.snake.vy = 1
          break
        default:
          break
      }
    }

    initSnake() {
      this.startPosition = { x: 0, y: 0 }

      switch (this.options.startPosition) {
        case 'center':
          this.startPosition.x = Math.floor(this.tilesInSide / 2)
          this.startPosition.y = this.startPosition.x
          break
        default:
          break
      }

      this.snake = new Snake(this.startPosition)
    }

    drawGrid() {
      const sideSquares = this.canvas.width / this.options.tileSize
      this.ctx.strokeStyle = this.options.gridBgColor
      for (let i = 0; i < sideSquares; i++) {
        for (let j = 0; j < sideSquares; j++) {
          this.ctx.strokeRect(this.options.tileSize * i, this.options.tileSize * j, this.options.tileSize, this.options.tileSize)
        }
      }
    }

    drawBoard() {
      this.ctx.fillStyle = this.options.boardBgColor
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

      this.options.displayGrid && this.drawGrid()
    }

    placeTreat() {
      // const
    }

    drawSnake() {
      this.ctx.fillStyle = this.options.snakeBgColor
      this.snake.tailCoords.forEach(part => this.ctx.fillRect(part.x * this.options.tileSize, part.y * this.options.tileSize, this.options.tileSize, this.options.tileSize))
    }

    stop() {
      clearInterval(this.timer)
      this.timer = null
    }

    update() {
      this.drawBoard()
      this.options.displayGrid && this.drawGrid()
      this.updateSnake()
    }

    updateSnake() {
      const head = {
        x: this.snake.head.x + this.snake.vx,
        y: this.snake.head.y + this.snake.vy,
      }

      let isDead = false

      if (head.x < 0) this.options.isWraps ? head.x = this.tilesInSide - 1 : isDead = true
      if (head.x > this.tilesInSide - 1) this.options.isWraps ? head.x = 0 : isDead = true
      if (head.y < 0) this.options.isWraps ? head.y = this.tilesInSide - 1 : isDead = true
      if (head.y > this.tilesInSide - 1) this.options.isWraps ? head.y = 0 : isDead = true

      if (isDead) Object.assign(head, this.startPosition)

      this.snake.updateTail(head, isDead)
      this.drawSnake()
    }

    start() {

      this.drawSnake()
      this.placeTreat()

      this.timer = setInterval(this.update.bind(this), 1000 / 15)
    }
  }

  class Snake {
    constructor(startCoords, options) {
      this.options = {
        length: 1,
      }

      Object.assign(this.options, options)

      this.vx = 1
      this.vy = 0

      this.startCoords = {
        x: 0,
        y: 0,
      }

      this.startCoords = Object.assign(this.startCoords, startCoords)

      this.initTail()
    }

    initTail() {
      this.tail = []

      for (let i = 0; i <= this.options.length; i++) {
        this.tail.push({
          x: this.startCoords.x,
          y: this.startCoords.y,
        })
      }
    }

    updateTail(head, isDead) {
      const prevCoords = isDead ? head : { x: 0, y: 0 }

      this.tail = this.tail.map((part, index) => {
        if (index === 0) {
          !isDead && Object.assign(prevCoords, part)
          part.x = head.x
          part.y = head.y
        } else {
          const copy = Object.assign({}, part)
          Object.assign(part, prevCoords)
          !isDead && Object.assign(prevCoords, copy)
        }

        return part
      })
    }

    get tailCoords() {
      return this.tail
    }

    get head() {
      return this.tail[0]
    }
  }

  return new Game()
})()
