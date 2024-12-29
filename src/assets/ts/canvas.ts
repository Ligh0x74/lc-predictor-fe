// 参考 https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Extensions/Advanced_JavaScript_objects/Object_building_practice
// 设置画布
const canvas = document.querySelector('canvas')!
const ctx = canvas.getContext('2d')!
const width = (canvas.width = window.innerWidth)
const height = (canvas.height = window.innerHeight)

// 随机颜色
function random(min: number, max: number) {
  const num = Math.floor(Math.random() * (max - min)) + min
  return num
}

function randomColor() {
  return {
    r: random(0, 255),
    g: random(0, 255),
    b: random(0, 255),
    opacity: 1,
  }
}

interface Color {
  r: number
  g: number
  b: number
  opacity: number
}

// 粒子类
class Particle {
  x: number
  y: number
  r: number
  dx: number
  dy: number
  color: Color

  // 坐标, 半径, 坐标变化量, 颜色
  constructor(x: number, y: number, r: number, color: Color) {
    this.x = x
    this.y = y
    this.r = r
    this.dx = Math.random() * 4 - 2
    this.dy = Math.random() * 4 - 2
    this.color = color
  }

  // 画图
  draw() {
    ctx.beginPath()
    ctx.fillStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},${this.color.opacity})`
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
    ctx.fill()
  }

  // 更新坐标
  update() {
    if (this.x + this.r >= width || this.x - this.r <= 0) {
      this.dx = -this.dx
    }
    if (this.y + this.r >= height || this.y - this.r <= 0) {
      this.dy = -this.dy
    }
    this.x += this.dx
    this.y += this.dy
    this.color.opacity -= 0.01
  }
}

// 最大粒子数
const maxNum = 255
const particles: Particle[] = []

// 监听鼠标移动事件
window.addEventListener('mousemove', function (event) {
  if (particles.length < maxNum) {
    const particle = new Particle(event.x, event.y, random(1, 5), randomColor())
    particles.push(particle)
  }
})

// 动画循环
function loop() {
  // 透明画布, 避免遮挡背景
  ctx?.clearRect(0, 0, width, height)
  for (let i = 0; i < particles.length; i++) {
    particles[i].draw()
    particles[i].update()
    if (particles[i].color.opacity <= 0) {
      particles.splice(i--, 1)
    }
  }
  requestAnimationFrame(loop)
}

loop()
