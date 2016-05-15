class Sprite
  constructor: (x, y, width, height, image) ->
    @x = x
    @y = y
    @frame = 0
    @width = width
    @height = height
    @image = image # Image object
    
    @animFrames = []
    @animDelay = 1000
    @animElapsed = 0

  render: (ctx) ->
    ctx.drawImage(@image, (@frame%8)*@width, Math.floor(@frame/8)*@height, @width, @height, @x, @y, @width, @height)

  update: (dt) ->
    @animElapsed += dt
    if @animElapsed > @animDelay
      i = @animFrames.indexOf(@frame)
      i += 1
      i = 0 if i >= @animFrames.length
      @frame = @animFrames[i]

      @animElapsed = 0

  animate: (animFrames, animDelay) ->
    @animFrames = animFrames
    @animDelay = animDelay

class Unit
  constructor: ->
    @facing = 'down'
    @walkDelay = 0.1
    @speed = 120
    @health = 10

    @force = null # A Point of force currently being applied
    @grace = null # When the player gets hurt, temporary immortality

    @hopeReward = 10 # How much hope is rewarded for defeating

  face: (dir) ->
    return if @facing == dir
    @facing = dir
    
    if dir == 'left'
      @sprite.frame = 11
    else if dir == 'right'
      @sprite.frame = 15
    else if dir == 'up'
      @sprite.frame = 4
    else if dir == 'down'
      @sprite.frame = 0

  walk: (dir) ->
    @walking = true
    if @facing == 'left'
      @sprite.animate([8, 9], @walkDelay)
    else if @facing == 'right'
      @sprite.animate([12, 13], @walkDelay)
    else if @facing == 'up'
      @sprite.animate([5, 7], @walkDelay)
    else if @facing == 'down'
      @sprite.animate([1, 3], @walkDelay)

  stopWalking: ->
    @walking = false
    @sprite.animate([])

  applyForce: (value, duration) ->
    @force = {
      value: value,
      duration: duration,
      elapsed: 0
    }

  applyGrace: (duration) ->
    @grace = {
      duration: duration
      elapsed: 0
      flashPeriod: 0.05
      flashElapsed: 0
      flash: true
    }

  collides: (unit) ->
    Geometry.rectHitsRect(@sprite.x, @sprite.y, @sprite.width, @sprite.height,
      unit.sprite.x, unit.sprite.y, unit.sprite.width, unit.sprite.height)

  update: (dt) ->
    if @walking
      inc = Math.ceil(@speed*dt)
      if @facing == 'left'
        @sprite.x -= inc
      else if @facing == 'right'
        @sprite.x += inc
      else if @facing == 'up'
        @sprite.y -= inc
      else if @facing == 'down'
        @sprite.y += inc

    # Stop player walking outside bounds
    if this == game.bars
      if @sprite.x < 0
        @sprite.x = 0
      if @sprite.x+@sprite.width > atom.canvas.width
        @sprite.x = atom.canvas.width-@sprite.width
      if @sprite.y < 0
        @sprite.y = 0
      if @sprite.y+@sprite.width > atom.canvas.height
        @sprite.y = atom.canvas.height-@sprite.height

    # But if an enemy goes out, they're counted as dead
    else if @sprite.x < -@sprite.width || @sprite.x > atom.canvas.width ||
            @sprite.y < -@sprite.height || @sprite.y > atom.canvas.height
      return @die()

    if @grace
      @grace.elapsed += dt
      @grace.flashElapsed += dt
      if @grace.elapsed > @grace.duration
        @grace = null
      else if @grace.flashElapsed > @grace.flashPeriod
        @grace.flashElapsed = 0
        @grace.flash = !@grace.flash

    if @force
      @sprite.x += @force.value.x
      @sprite.y += @force.value.y
      @force.elapsed += dt
      if @force.elapsed > @force.duration
        @force = null

    if this != game.bars
      cx = @sprite.x
      cy = @sprite.y
      tx = game.bars.sprite.x
      ty = game.bars.sprite.y

      dir = Geometry.facingFromLine(cx, cy, tx, ty)
      @face(dir)
      @walk()

      if @collides(game.bars) && !game.bars.grace
          p = new Point(tx-cx, ty-cy).normalize().scale(2)
          game.bars.applyForce(p, 0.5)
          game.bars.applyGrace(0.2)
          game.hope -= 5*Math.pow(2, game.level)
          if game.hope <= 0
            if game.level > 1
              game.levelDown()
            else
              game.over()

    @sprite.update(dt)

  die: ->
    @dead = true
    if @force # Player was responsible
      game.hope += @hopeReward
      if game.hope >= game.nextHope
        game.levelUp()

  render: (ctx) ->
    ctx.save()
    if @grace && @grace.flash
      ctx.globalAlpha = 0.1
    @sprite.render(ctx)
    ctx.restore()

class Game extends atom.Game
  constructor: ->
    super
    atom.input.bind atom.key.A, 'left'
    atom.input.bind atom.key.D, 'right'
    atom.input.bind atom.key.W, 'up'
    atom.input.bind atom.key.S, 'down'
    atom.input.bind atom.key.V, 'debug'

    atom.input.bind atom.button.LEFT, 'click'

    atom.context.lineCap = 'round'

    @bars = new Unit()

    img = new Image()
    img.src = 'barsamin.png'
    @bars.sprite = new Sprite(atom.canvas.width/2, atom.canvas.height/2, 16, 16, img)

    @level = 0
    @levelUp()

    @enemies = []
    for i in [0..9]
      @spawnEnemy()
  
  img = new Image()
  img.src = 'katarosi.png'
  spawnEnemy: ->
    enemy = new Unit()
    enemy.speed = 10*Math.pow(2, @level)/2

    width = 16
    height = 16

    if Math.random() > 0.5
      x = _.sample([0, atom.canvas.width-width])
      y = Math.floor(Math.random()*atom.canvas.height)
    else
      x = Math.floor(Math.random()*atom.canvas.height)
      y = _.sample([0, atom.canvas.height-height])

    enemy.sprite = new Sprite(x, y, width, height, img)
    @enemies.push(enemy)

  setLevel: (level) ->
    @level = level
    @nextHope = Math.pow(2, @level) * 100

    @arcRange = 20*Math.pow(2, @level)
    @arcForce = 1+Math.pow(2, @level)*2
    @arcDamage = 1+@level

  levelUp: ->
    @setLevel(@level+1)
    @hope = 40

    if @level > 1
      @levelSpecial = {
        duration: 1
        elapsed: 0
      }

      Lightning.start()

  levelDown: ->
    @setLevel(@level-1)
    @hope = Math.floor(@nextHope*0.9)

  update: (dt) ->
    return if @lost
    if @levelSpecial
      @levelSpecial.elapsed += dt
      if @levelSpecial.elapsed > @levelSpecial.duration
        @levelSpecial = null
        @enemies = []
        Lightning.stop() unless atom.input.down 'click'
      return

    @bars.update(dt)
    for enemy in @enemies
      enemy.update(dt)

    if atom.input.pressed 'click'
      Lightning.start()

    if atom.input.released 'click'
      Lightning.stop()

    if atom.input.down 'click'
      cx = @bars.sprite.x + @bars.sprite.width/2
      cy = @bars.sprite.y + @bars.sprite.height/2
      mx = atom.input.mouse.x*(atom.canvas.width/window.innerWidth)
      my = atom.input.mouse.y*(atom.canvas.height/window.innerHeight)

      p = new Point(mx-cx, my-cy)
      if (p.length() > @arcRange)
        p = p.normalize(@arcRange)

      dir = Geometry.facingFromLine(cx, cy, mx, my)
      @bars.face(dir)

      # Correct the graphical center position slightly to match hands
      switch dir
        when 'right'
          cx += 3; cy += 2
        when 'left'
          cx -= 1; cy += 1
        when 'down'
          cx += 1; cy += 4
        when 'up'
          cx -= 4; cy += 2

      Lightning.dragPoints[0].x = cx
      Lightning.dragPoints[0].y = cy
      Lightning.dragPoints[1].x = cx + p.x
      Lightning.dragPoints[1].y = cy + p.y

      for enemy in @enemies
        if Geometry.lineHitsRect(cx, cy, cx+p.x, cy+p.y,
             enemy.sprite.x, enemy.sprite.y,
             enemy.sprite.width, enemy.sprite.height)

          p = new Point(mx-cx, my-cy).normalize().scale(@arcForce)
          enemy.applyForce(p, 0.5)
          enemy.applyGrace(0.5)
          enemy.health -= @arcDamage
          if enemy.health <= 0
            enemy.die()

    @enemies = _.reject(@enemies, (enemy) -> enemy.dead)

    if atom.input.down 'left'
      @bars.face('left')
      @bars.walk()
    else if atom.input.down 'right'
      @bars.face('right')
      @bars.walk()
    else if atom.input.down 'up'
      @bars.face('up')
      @bars.walk()
    else if atom.input.down 'down'
      @bars.face('down')
      @bars.walk()
    else
      @bars.stopWalking()

    Lightning.update()

    if Math.random() > 1-(Math.pow(2, @level)/100)
      @spawnEnemy()

  draw: (dt) ->
    return if @lost
    if !@levelSpecial
      atom.context.globalCompositeOperation = 'source-over'
    atom.context.fillStyle = 'rgba(10, 25, 30, 1.0)'
    atom.context.fillRect 0, 0, atom.width, atom.height

    @bars.render(atom.context)
    for enemy in @enemies
      enemy.render(atom.context)
    Lightning.draw()

    atom.context.fillStyle = "white"
    atom.context.fillText("Hope: #{@hope}/#{@nextHope} [Level #{@level}]", 10, 10)

  over: ->
    @draw()
    @stop()
    @lost = true
    $('#gameover').modal()
    
game = new Game

$('#gameover').on 'hidden.bs.modal', ->
  window.location.reload()

$('#intro').modal()
$('#intro').on 'hidden.bs.modal', ->
  canvas = document.getElementsByTagName('canvas')[0]
  canvas.style.display = 'block'

  Lightning.configure()
  window.onblur = -> game.stop()
  window.onfocus = -> game.run()
  game.run()
  
