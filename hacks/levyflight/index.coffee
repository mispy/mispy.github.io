
ready = (func) ->
  """Hacky $(document).ready() equivalent."""
  # http://stackoverflow.com/questions/799981/document-ready-equivalent-without-jquery 
  if /in/.test(document.readyState)
    setTimeout(ready, 9, func)
  else
    func()

ready ->
  canvas = document.getElementById('canvas')
  ctx = canvas.getContext('2d')
  canvas.setAttribute('width', window.innerWidth)
  canvas.setAttribute('height', window.innerHeight)
  ctx.strokeStyle = "rgb(255,255,255)"

  x = window.innerWidth/2
  y = window.innerHeight/2

  draw = ->
    now = Date.now()

    angle = Math.random()*2*Math.PI
    pareto = Math.pow(Math.random(), -1 / 1.5)

    x1 = x + Math.cos(angle)*pareto*5
    y1 = y + Math.sin(angle)*pareto*5

    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x1, y1)
    ctx.stroke()

    x = x1
    y = y1

    setTimeout(draw, 50)

  draw()

