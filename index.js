// function move(e) {
// 	mouseSeeker.style.top = (e.touches ? e.touches[e.touches.length - 1].clientY : e.clientY) - 50 + window.scrollY + 'px'
// 	mouseSeeker.style.left = (e.touches ? e.touches[e.touches.length - 1].clientX : e.clientX) + window.scrollX + 'px'
// 	e.preventDefault()
// }
// document.onmousemove = move
// document.ontouchmove = move

function copyLink() {
	navigator.clipboard.writeText(document.querySelector('#cmLink').innerText)
	let msg = document.querySelector('#my-message')
	msg.showMessage('Tag copied!', "Now you're just a CTRL + V away from seeing your project logs on your phone! 😀")
}

console.log(`
	TIP:\n
	In this console you can't declare variables like this:\n
	var foo = 123\n
	Instead, you just type:\n
	foo = 123
`)

const canvas = document.querySelector('#canvas1')
const c = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

let particlesArray

let mouse = {
	x: undefined,
	y: undefined,
	radius: (canvas.height / 80) * (canvas.width / 80)
}
if (mouse.radius > 150)
	mouse.radius = 150

window.addEventListener('mousemove', (e) => {
	mouse.x = e.x
	mouse.y = e.y
})
// window.addEventListener('touchmove', (e) => {
// 	mouse.x = e.touches[e.touches.length - 1].clientX
// 	mouse.y = e.touches[e.touches.length - 1].clientY
// })

let mouseDown = false
window.addEventListener('mousedown', () => {
	mouseDown = true
})
window.addEventListener('mouseup', () => {
	mouseDown = false
})

class Particle {
	constructor(x, y, directionX, directionY, size, color) {
		this.x = x
		this.y = y
		this.directionX = directionX
		this.directionY = directionY
		this.size = size
		this.color = color
	}

	draw() {
		c.beginPath()
		c.arc(this.x, this.y, this.size, 0, Math.PI * 2, false)
		c.fillStyle = this.color
		c.fill()
	}

	update() {
		if (this.x > canvas.width || this.x < 0) {
			this.directionX = -this.directionX
		}
		if (this.y > canvas.height || this.y < 0) {
			this.directionY = -this.directionY
		}

		let dx = mouse.x - this.x
		let dy = mouse.y - this.y
		let distance = Math.sqrt(dx * dx + dy * dy)
		let forceDirectionX = dx / distance
		let forceDirectionY = dy / distance
		let force = (mouse.radius - distance) / mouse.radius
		let directionX = forceDirectionX * force * 10
		let directionY = forceDirectionY * force * 10
		if (mouseDown && distance < mouse.radius + this.size) {
			this.x -= directionX
			this.y -= directionY
		}
		else if ((distance < (mouse.radius + this.size)) && (distance > (mouse.radius + this.size) / 1.5)) {
			if (mouse.x < this.x && this.x < canvas.width - this.size * 2) {
				if (this.directionX > 0)
					this.directionX = -this.directionX
				else
					this.x += directionX
			}
			if (mouse.x > this.x && this.x > this.size * 2) {
				if (this.directionX < 0)
					this.directionX = -this.directionX
				else
					this.x += directionX
			}
			if (mouse.y < this.y && this.y < canvas.height - this.size * 2) {
				if (this.directionY > 0)
					this.directionY = -this.directionY
				else
					this.y += directionY
			}
			if (mouse.y > this.y && this.y > this.size * 2) {
				if (this.directionY < 0)
					this.directionY = -this.directionY
				else
					this.y += directionY
			}
		}
		this.x += this.directionX
		this.y += this.directionY
		this.draw()
	}
}

function init() {
	particlesArray = []
	let numberOfParticles = (canvas.height * canvas.width) / 2000
	if (numberOfParticles > 200)
		numberOfParticles = 200
	for (let i = 0; i < numberOfParticles; i++) {
		let size = (Math.random() * 2) + 1
		// let size = 1
		let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2)
		let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2)
		let directionX = (Math.random() * 1) - .5
		let directionY = (Math.random() * 1) - .5
		let color = 'rgb(0, 153, 255)'

		particlesArray.push(new Particle(x, y, directionX, directionY, size, color))
	}
}

function animate() {
	requestAnimationFrame(animate)
	c.clearRect(0, 0, innerWidth, innerHeight)

	let opacityValue = 1
	for (let a = 0; a < particlesArray.length; a++) {
		for (let b = a; b < particlesArray.length; b++) {
			let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
				((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y))
			if (distance < (canvas.width / 7) * (canvas.height / 7)) {
				opacityValue = 1 - (distance / 10000)
				c.strokeStyle = `rgba(0,51,102,${ opacityValue })`
				c.lineWidth = 1
				c.beginPath()
				c.moveTo(particlesArray[a].x, particlesArray[a].y)
				c.lineTo(particlesArray[b].x, particlesArray[b].y)
				c.stroke()
			}
		}

		distance = ((particlesArray[a].x - mouse.x) * (particlesArray[a].x - mouse.x)) +
			((particlesArray[a].y - mouse.y) * (particlesArray[a].y - mouse.y))
		if (distance < (canvas.width / 7) * (canvas.height / 7)) {
			if (mouseDown)
				opacityValue = 1 - (distance / 25000)
			else
				opacityValue = 1 - (distance / 50000)
			if (mouseDown)
				c.strokeStyle = `rgba(102,0,51,${ opacityValue })`
			else
				c.strokeStyle = `rgba(0,51,102,${ opacityValue })`
			c.lineWidth = 1
			c.beginPath()
			c.moveTo(particlesArray[a].x, particlesArray[a].y)
			c.lineTo(mouse.x, mouse.y)
			c.stroke()
		}

		particlesArray[a].update()
	}

}

window.addEventListener('resize', () => {
	canvas.width = innerWidth
	canvas.height = innerHeight
	mouse.radius = ((canvas.height / 80) * (canvas.width / 80))
	if (mouse.radius > 150)
		mouse.radius = 150
	init()
})

window.addEventListener('mouseout', () => {
	mouse.x = undefined
	mouse.y = undefined
})

init()
animate()

let showingInterface = true
function showHideInterface() {
	let interfaceElements = [document.querySelector('header'), ...Array.from(document.querySelectorAll('.container')), document.querySelector('footer')]
	showingInterface = !showingInterface
	if (showingInterface) {
		hideInterfaceBtSpan.innerText = 'Hide Interface'
		hideInterfaceBt.style.position = ''
		hideInterfaceBt.style.right = ''
		hideInterfaceBt.style.bottom = ''
		document.querySelector('footer').appendChild(hideInterfaceBt)
		// document.body.removeChild(hideInterfaceBt)
		interfaceElements.map(el => {
			el.style.display = ''
		})
		window.scrollTo(0, document.body.scrollHeight)
		eyeImg.style.opacity = '.5'
	}
	else {
		interfaceElements.map(el => {
			el.style.display = 'none'
		})
		hideInterfaceBtSpan.innerText = 'Show Interface'
		hideInterfaceBt.style.position = 'fixed'
		hideInterfaceBt.style.right = '8px'
		hideInterfaceBt.style.bottom = '8px'
		document.body.appendChild(hideInterfaceBt)
		// document.querySelector('footer').removeChild(hideInterfaceBt)
		eyeImg.style.opacity = '1'
	}
}