const matrixCanvas = document.querySelector('#matrixCanvas')
const matrixC = matrixCanvas.getContext('2d', { willReadFrequently: true })

matrixCanvas.width = 210
matrixCanvas.height = 210

let BrazilFlag = matrixC.createRadialGradient(matrixCanvas.width / 2, matrixCanvas.height / 2, 50, matrixCanvas.width / 2, matrixCanvas.height / 2, 100)
BrazilFlag.addColorStop(0, '#0033ff')
BrazilFlag.addColorStop(0.5, '#ffff00')
BrazilFlag.addColorStop(1, '#00ff00')

class Symbol {
	constructor(x, y, fontSize, canvasHeight) {
		// this.characters = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
		this.characters = '01'
		this.x = x
		this.y = y
		this.fontSize = fontSize
		this.text = ''
		this.canvasHeight = canvasHeight
	}
	draw(context) {
		this.text = this.characters.charAt(Math.floor(Math.random() * this.characters.length))
		context.fillText(this.text, this.x * this.fontSize, this.y * this.fontSize)
		if (this.y * this.fontSize > this.canvasHeight && Math.random() > .9) {
			this.y = 0
		}
		else {
			this.y += 1
		}
	}
}

class Effect {
	constructor(canvasWidth, canvasHeight) {
		this.canvasWidth = canvasWidth
		this.canvasHeight = canvasHeight
		this.fontSize = 10
		this.columns = this.canvasWidth / this.fontSize
		this.symbols = []
		this.#initialize()
	}

	#initialize() {
		for (let i = 0; i < this.columns; i++) {
			this.symbols[i] = new Symbol(i, this.canvasHeight, this.fontSize, this.canvasHeight)
		}
	}

	resize(width, height) {
		this.canvasWidth = width
		this.canvasHeight = height
		this.columns = this.canvasWidth / this.fontSize
		this.symbols = []
		this.#initialize()
	}
}

const effect = new Effect(matrixCanvas.width, matrixCanvas.height)

const canvas1 = document.querySelector('#canvas1')
const c1 = canvas1.getContext('2d', { willReadFrequently: true })
canvas1.width = window.innerWidth
canvas1.height = window.innerHeight

let particlesArray1

let mouse1 = {
	x: undefined,
	y: undefined,
	radius: (canvas1.height / 80) * (canvas1.width / 80)
}
if (mouse1.radius < 80)
	mouse1.radius = 80
if (mouse1.radius > 150)
	mouse1.radius = 150

window.addEventListener('mousemove', (e) => {
	mouse1.x = e.x
	mouse1.y = e.y
})
window.addEventListener('touchmove', (e) => {
	mouse1.x = e.touches[e.touches.length - 1].clientX
	mouse1.y = e.touches[e.touches.length - 1].clientY
})

let mouseDown = false
window.addEventListener('mousedown', () => {
	mouseDown = true
})
window.addEventListener('touchstart', () => {
	mouseDown = true
})
window.addEventListener('mouseup', () => {
	mouseDown = false
})
window.addEventListener('touchend', () => {
	mouseDown = false
	mouse1.x = undefined
	mouse1.y = undefined
})

class Particle1 {
	constructor(x, y, directionX, directionY, size, color) {
		this.x = x
		this.y = y
		this.directionX = directionX
		this.directionY = directionY
		this.size = size
		this.color = color
	}

	draw() {
		c1.beginPath()
		c1.arc(this.x, this.y, this.size, 0, Math.PI * 2, false)
		c1.fillStyle = this.color
		c1.fill()
	}

	update() {
		if (this.x - this.size < 0) {
			this.x = 0 + this.size
			this.directionX = -this.directionX
		}
		if (this.x + this.size > canvas1.width) {
			this.x = canvas1.width - this.size
			this.directionX = -this.directionX
		}
		if (this.y - this.size < 0) {
			this.y = 0 + this.size
			this.directionY = -this.directionY
		}
		if (this.y + this.size > canvas1.height) {
			this.y = canvas1.height - this.size
			this.directionY = -this.directionY
		}

		let dx = mouse1.x - this.x
		let dy = mouse1.y - this.y
		let distance = Math.sqrt(dx * dx + dy * dy)
		let forceDirectionX = dx / distance
		let forceDirectionY = dy / distance
		let force = (mouse1.radius - distance) / mouse1.radius
		let directionX = forceDirectionX * force * 10
		let directionY = forceDirectionY * force * 10
		if (mouseDown && distance < mouse1.radius + this.size) {
			this.x -= directionX
			this.y -= directionY
		}
		else if ((distance < (mouse1.radius + this.size)) && (distance > (mouse1.radius + this.size) / 1.5)) {
			if (mouse1.x < this.x && this.x < canvas1.width - this.size * 2) {
				if (this.directionX > 0)
					this.directionX = -this.directionX
				else
					this.x += directionX / 2
			}
			if (mouse1.x > this.x && this.x > this.size * 2) {
				if (this.directionX < 0)
					this.directionX = -this.directionX
				else
					this.x += directionX / 2
			}
			if (mouse1.y < this.y && this.y < canvas1.height - this.size * 2) {
				if (this.directionY > 0)
					this.directionY = -this.directionY
				else
					this.y += directionY / 2
			}
			if (mouse1.y > this.y && this.y > this.size * 2) {
				if (this.directionY < 0)
					this.directionY = -this.directionY
				else
					this.y += directionY / 2
			}
		}
		this.x += this.directionX
		this.y += this.directionY
		this.draw()
	}
}

function init1() {
	particlesArray1 = []
	let particlesAmmount = Math.floor((canvas1.height * canvas1.width) / 5000)
	if (particlesAmmount > 150)
		particlesAmmount = 150
	for (let i = 0; i < particlesAmmount; i++) {
		let size = (Math.random() * 2) + 1
		// let size = 1
		let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2)
		let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2)
		let directionX = (Math.random() * 2) - 1
		let directionY = (Math.random() * 2) - 1
		let color = 'rgb(0, 153, 255)'

		particlesArray1.push(new Particle1(x, y, directionX, directionY, size, color))
	}
}

let lastTime = 0
const fps = 16
const nextFrame = 1000 / fps
let timer = 0

let section2fade = 1

function animate1(timeStamp) {

	if (window.scrollY <= canvasContainer.offsetTop + canvasContainer.offsetHeight) {
		const deltaTime = timeStamp - lastTime
		lastTime = timeStamp
		if (timer > nextFrame) {
			matrixC.fillStyle = 'rgba(0,0,0,.1)'
			matrixC.textAlign = 'center'
			matrixC.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height)
			matrixC.fillStyle = BrazilFlag//'#0099ff'
			matrixC.font = effect.fontSize + 'px monospace'
			effect.symbols.forEach(symbol => symbol.draw(matrixC))
			timer = 0
		}
		else
			timer += deltaTime
	}

	if (section2fade < 1) {
		c1.clearRect(0, 0, innerWidth, innerHeight)

		let opacityValue = 1
		for (let a = 0; a < particlesArray1.length; a++) {
			for (let b = a; b < particlesArray1.length; b++) {
				let distance = ((particlesArray1[a].x - particlesArray1[b].x) * (particlesArray1[a].x - particlesArray1[b].x)) +
					((particlesArray1[a].y - particlesArray1[b].y) * (particlesArray1[a].y - particlesArray1[b].y))
				if (distance < (canvas1.width / 7) * (canvas1.height / 7)) {
					opacityValue = 1 - (distance / 15000)
					c1.strokeStyle = `rgba(0,51,102,${opacityValue})`
					c1.lineWidth = 1
					c1.beginPath()
					c1.moveTo(particlesArray1[a].x, particlesArray1[a].y)
					c1.lineTo(particlesArray1[b].x, particlesArray1[b].y)
					c1.stroke()
				}
			}

			distance = ((particlesArray1[a].x - mouse1.x) * (particlesArray1[a].x - mouse1.x)) +
				((particlesArray1[a].y - mouse1.y) * (particlesArray1[a].y - mouse1.y))
			if (distance < (canvas1.width / 7) * (canvas1.height / 7)) {
				if (mouseDown)
					opacityValue = 1 - (distance / 25000)
				else
					opacityValue = 1 - (distance / 50000)
				if (mouseDown)
					c1.strokeStyle = `rgba(102,0,51,${opacityValue})`
				else
					c1.strokeStyle = `rgba(0,51,102,${opacityValue})`
				c1.lineWidth = 1
				c1.beginPath()
				c1.moveTo(particlesArray1[a].x, particlesArray1[a].y)
				c1.lineTo(mouse1.x, mouse1.y)
				c1.stroke()
			}

			particlesArray1[a].update()
		}
	}

	if (section2fade < 1) {
		let gradient = c1.createRadialGradient(canvas1.width / 2, canvas1.height / 2, canvas1.width / 8, canvas1.width / 2, canvas1.height / 2, canvas1.width / 2)
		gradient.addColorStop(0, `rgba(16,16,16,${section2fade})`)
		gradient.addColorStop(1, `rgba(0,0,0,${section2fade})`)
		c1.fillStyle = gradient
		c1.fillRect(0, 0, canvas1.width, canvas1.height)
	}
	if (window.scrollY + window.innerHeight / 2 >= section2.offsetTop) {
		if (section2fade > 0)
			section2fade -= .025
	}
	else {
		if (section2fade < 1)
			section2fade += .05
	}
	requestAnimationFrame(animate1)
}

window.addEventListener('resize', () => {
	canvas1.width = window.innerWidth
	canvas1.height = window.innerHeight
	mouse1.radius = ((canvas1.height / 80) * (canvas1.width / 80))
	if (mouse1.radius > 150)
		mouse1.radius = 150
	init1()
})

window.addEventListener('mouseout', () => {
	mouse1.x = undefined
	mouse1.y = undefined
})

// init()
init1()
animate1(0)

let showingInterface = true
function showHideInterface() {
	let interfaceElements = [...Array.from(document.querySelectorAll('section')), document.querySelector('#footerContainer'), document.querySelector('footer')]
	showingInterface = !showingInterface
	if (showingInterface) {
		hideInterfaceBtSpan.innerText = 'Hide Interface'
		hideInterfaceBt.style.position = ''
		hideInterfaceBt.style.right = ''
		hideInterfaceBt.style.bottom = ''
		document.querySelector('footer').appendChild(hideInterfaceBt)
		interfaceElements.map(el => {
			el.style.display = ''
		})
		eyeImg.style.opacity = '.5'
		let cssRule = Array.from(document.styleSheets[0].cssRules).find(x => x.selectorText == '*')
		cssRule.style.scrollBehavior = 'unset'
		window.scrollTo(0, document.body.offsetHeight)
		cssRule.style.scrollBehavior = 'smooth'
	}
	else {
		interfaceElements.map(el => {
			el.style.display = 'none'
		})
		document.body.appendChild(hideInterfaceBt)
		hideInterfaceBtSpan.innerText = 'Show Interface'
		hideInterfaceBt.style.position = 'fixed'
		hideInterfaceBt.style.right = '8px'
		hideInterfaceBt.style.bottom = '8px'
		eyeImg.style.opacity = '1'
	}
}

function copyLink() {
	navigator.clipboard.writeText(document.querySelector('#cmLink').innerText)
	let msg = document.querySelector('#my-message')
	msg.showMessage('Tag copied!', "Now you're just a CTRL + V away from seeing your project logs on your phone! 😀")
}

// let geolocation
// navigator.geolocation.getCurrentPosition((position) => {
// 	geolocation = `${position.coords.latitude},${position.coords.longitude}`
// 	access()
// }, (err) => access())

// function access() {
// fetch('http://192.168.100.100:9000/auth/access', {
fetch('https://api.razion.app.br/auth/access', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json'
	},
	body: JSON.stringify({
		app: location.host,
		browser: navigator.userAgent,
		language: navigator.language,
		// geolocation: geolocation
	})
})
// }