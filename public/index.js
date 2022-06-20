import { multiply, sum, multByScalar } from './helpers/matrix.js'

const canvas = document.getElementById("stage")
if (canvas.getContext) {
  var ctx = canvas.getContext("2d")
}

ctx.translate(250, 250)


const theta = document.getElementById("theta")
const tx = document.getElementById("tx")
const ty = document.getElementById("ty")
const s = document.getElementById("s")
const alpha = document.getElementById("alpha")
const lambdaOne = document.getElementById("lambda1")
const lambdaTwo = document.getElementById("lambda2")
const phi = document.getElementById("phi")

const beta = document.getElementById("beta")
const k = document.getElementById("k")
const lambda = document.getElementById("lambda")
const v1 = document.getElementById("v1")
const v2 = document.getElementById("v2")
const v = document.getElementById("v")

let txValue = 0
let tyValue = 0
let sValue = 1
let alphaValue = 0
let lambdaOneValue = 1
let lambdaTwoValue = 1
let phiValue = 0

let betaValue = 0
let kValue = 0
let lambdaValue = 1
let v1Value = 0.0001
let v2Value = 0.0002
let vValue = 1

clear()

drawAxis()

function drawAxis() {
  drawLine(0, -250, 0, 250)
  drawLine(-250, 0, 250, 0)
}

function drawLine(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function drawPolygon(xPositions, yPositions, N) {
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.moveTo(xPositions[0], yPositions[0])
  for (let i = 1; i < N; i++) {
    ctx.lineTo(xPositions[i], yPositions[i])
  }
  ctx.closePath();
  ctx.stroke();
}

function drawPixels(xPositions, yPositions) {
  for (let i = 0; i < xPositions.length; i++) {
    pixel(xPositions[i], yPositions[i])
  }
}

let xPositions = [-50, 50, 50, 50, -50]
let yPositions = [-50, -50, 50, 50, 50]

let rotationMatrix = [[1, 0], [0, 1]]

const N = 5

//updatePointsProjectivity(xPositions, yPositions)

function clear() {
  // Store the current transformation matrix
  ctx.save();

  // Use the identity matrix while clearing the canvas
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Restore the transform
  ctx.restore();
}

function updatePoints() {
  let newX = [], newY = []
  for (let i = 0; i < N; i++) {
    let answer = sum(multiply(multByScalar(sValue, rotationMatrix), [[xPositions[i]], [yPositions[i]]]), [[txValue], [tyValue]])
    newX.push(answer[0])
    newY.push(answer[1])
  }
  clear()
  drawPolygon(newX, newY, N)
  drawAxis()
}

function updatePointsAffinity() {
  let newX = [], newY = []
  let rotation = [[Math.cos(alphaValue), -Math.sin(alphaValue)], [Math.sin(alphaValue), Math.cos(alphaValue)]]
  let transformation = [[Math.cos(-phiValue), -Math.sin(-phiValue)], [Math.sin(-phiValue), Math.cos(-phiValue)]]
  let lambdas = [[lambdaOneValue, 0], [0, lambdaTwoValue]]
  let transformationNegative = multByScalar(-1, transformation)
  for (let i = 0; i < N; i++) {
    let A = multiply(multiply(rotation, transformation), multiply(lambdas, transformationNegative))
    let answer = sum(multiply(A,
      [[xPositions[i]], [yPositions[i]]]),
      [[txValue], [tyValue]])
    newX.push(answer[0])
    newY.push(answer[1])
  }
  clear()
  drawPolygon(newX, newY, N)
  drawAxis()
}

function updatePointsProjectivity(xPositions, yPositions) {
  let newX = [], newY = []
  let rotationAndTranslation = [[Math.cos(betaValue), -Math.sin(betaValue), 0], [Math.sin(betaValue), Math.cos(betaValue), 0], [0, 0, 1]]
  //console.log("Rotation", rotationAndTranslation)
  let transformation = [[1, kValue, 0], [0, 1, 0], [0, 0, 1]]
  //console.log("Transformation", transformation)
  let lambdas = [[lambdaValue, 0, 0], [0, 1 / lambdaValue, 0], [0, 0, 1]]
  //console.log("Lambdas", lambdas)
  let elations = [[1, 0, 0], [0, 1, 0], [v1Value, v2Value, vValue]]
  //console.log("Elations", elations)
  let H = multiply(multiply(rotationAndTranslation, transformation), multiply(lambdas, elations))
  //console.log(H)
  for (let i = 0; i < xPositions.length; i++) {
    let answer = multiply(H, [[xPositions[i]], [yPositions[i]], [1]])
    //console.log(i, [[xPositions[i]], [yPositions[i]], [1]], answer)
    newX.push(answer[0] / Math.abs(1 * answer[2]))
    newY.push(answer[1] / Math.abs(1 * answer[2]))
  }
  //console.log("x points", newX)
  //console.log("y points", newY)
  clear()
  drawPixels(newX, newY)
  //drawPolygon(newX, newY, N)
  drawAxis()
}

theta.oninput = (event => {
  const theta = (2 * Math.PI * parseInt(event.target.value)) / (180)
  rotationMatrix = [[Math.cos(theta), -Math.sin(theta)], [Math.sin(theta), Math.cos(theta)]]

  updatePoints()
})

tx.oninput = (event => {
  txValue = parseInt(event.target.value)

  updatePoints()
})

ty.oninput = (event => {
  tyValue = parseInt(event.target.value)

  updatePoints()
})

s.oninput = (event => {
  sValue = parseFloat(event.target.value)

  updatePoints()
})

alpha.oninput = (event => {
  alphaValue = (2 * Math.PI * parseInt(event.target.value)) / (180)

  updatePointsAffinity()
})

lambdaOne.oninput = (event => {
  lambdaOneValue = parseFloat(event.target.value)

  updatePointsAffinity()
})

lambdaTwo.oninput = (event => {
  lambdaTwoValue = parseFloat(event.target.value)

  updatePointsAffinity()
})

phi.oninput = (event => {
  phiValue = (2 * Math.PI * parseInt(event.target.value)) / (180)

  updatePointsAffinity()
})

beta.oninput = (event => {
  betaValue = (2 * Math.PI * parseInt(event.target.value)) / (180)

  updatePointsProjectivity(xMandelbrot, yMandelbrot)
})

k.oninput = (event => {
  kValue = parseFloat(event.target.value)

  updatePointsProjectivity(xMandelbrot, yMandelbrot)
})

lambda.oninput = (event => {
  lambdaValue = parseFloat(event.target.value)

  updatePointsProjectivity(xMandelbrot, yMandelbrot)
})

v1.oninput = (event => {
  v1Value = parseFloat(event.target.value)

  updatePointsProjectivity(xMandelbrot, yMandelbrot)
})

v2.oninput = (event => {
  v2Value = parseFloat(event.target.value)

  updatePointsProjectivity(xMandelbrot, yMandelbrot)
})

function Complex(re, im) {
  this.re = re
  this.im = im
}

Complex.prototype.add = function (other) {
  return new Complex(this.re + other.re, this.im + other.im)
}

Complex.prototype.mul = function (other) {
  return new Complex(this.re * other.re - this.im * other.im, this.re * other.im + this.im * other.re)
}

Complex.prototype.abs = function () {
  return Math.sqrt(this.re * this.re + this.im * this.im)
}

function belongs(re, im, iterations) {
  var z = new Complex(0, 0)
  var c = new Complex(re, im)
  var i = 0
  while (z.abs() < 2 && i < iterations) {
    z = z.mul(z).add(c)
    i++
  }
  return i
}

function pixel(x, y, color) {
  ctx.fillStyle = color
  ctx.fillRect(x, y, 1, 1)
}

const xMandelbrot = []
const yMandelbrot = []

function draw(width, height, maxIterations) {
  var minRe = -2, maxRe = 1, minIm = -1, maxIm = 1
  //var minRe = -1.5, maxRe = -1.2, minIm = -0.1, maxIm = 0.1
  var reStep = (maxRe - minRe) / width, imStep = (maxIm - minIm) / height
  var re = minRe
  while (re < maxRe) {
    var im = minIm
    while (im < maxIm) {
      var result = belongs(re, im, maxIterations)
      var x = (re - minRe) / reStep, y = (im - minIm) / imStep
      if (result == maxIterations) {
        xMandelbrot.push(x)
        yMandelbrot.push(y)
        //pixel(x, y, 'black')
      } else {
        var h = 20 + Math.round(120 * result * 1.0 / maxIterations)
        var color = `hsl(${h}, 80%, 50%)`
        //pixel(x, y, 'white')
      }
      im += imStep
    }
    re += reStep
  }
}

draw(300, 200, 100)

updatePointsProjectivity(xMandelbrot, yMandelbrot)