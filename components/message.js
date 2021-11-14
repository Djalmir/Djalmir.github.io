class Message extends HTMLElement {
	constructor() {
		super()
		const shadow = this.attachShadow({mode: 'open'})

		const style = shadow.appendChild(document.createElement('style'))
		style.textContent = `
			#container {
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				display: none;
				align-items: center;
				justify-content: center;
				z-index: 2;
			}

			#shadow {
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				height: 100vh;
				background: #0000008d;
			}

			#innerContainer {
				z-index: 1;
				width: 90%;
				max-width: 800px;
				background: linear-gradient(170deg, #202020, #404040);
				border: 2px solid #404040;
				border-radius: .6rem;
			}

			#messageHeader {
				background: linear-gradient(to right, #202020, transparent);
				border-radius: .5rem .5rem 50% 0;
				border-bottom: 1px solid #606060;
				padding: 4px 8px;
				font-size: 20px;
			}

			#messageBody {
				padding: 16px 8px;
				min-height: 60px;
			}

			#messageFooter {
				position: relative;
				background: linear-gradient(to right, transparent, #202020, transparent);
				border-top: 1px solid #606060;
				padding: 4px 8px;
				text-align:center;
				border-radius: 50% 50% .5rem .5rem;
			}

			#okBtn {
				border-radius: .2rem;
				border: 1px solid #003366;
				background: #0099ff;
				font-weight: bolder;
				padding: 8px 40px;
				cursor: pointer;
				opacity: .8;
				outline: none;
			}

			#okBtn:hover,
			#okBtn:focus {
				transform: scale(1.02);
				opacity: 1;
			}

			#okBtn:active {
				transform: scale(0.98);
				opacity: .6;
			}

			@keyframes fadeIn {
				from {
					opacity: 0;
				}
				to {
					opacity: 1;
				}
			}

			@keyframes fadeOut {
				from {
					opacity:1;
				}
				to {
					opacity:0;
				}
			}

			@keyframes growUp {
				from {
					transform: scale(0);
				}
				to {
					transform: scale(1);
				}
			}

			@keyframes decrease {
				from {
					transform: scale(1);
				}
				to {
					transform: scale(0);
				}
			}
		`

		const wrapper = shadow.appendChild(document.createElement('div'))
		wrapper.id = 'container'

		const shadowDiv = wrapper.appendChild(document.createElement('div'))
		shadowDiv.id = 'shadow'

		const messageDiv = wrapper.appendChild(document.createElement('div'))
		messageDiv.id = 'innerContainer'

		const messageHeader = messageDiv.appendChild(document.createElement('div'))
		messageHeader.id = 'messageHeader'
		// messageHeader.textContent = this.getAttribute('title') || 'Aviso:'

		const messageBody = messageDiv.appendChild(document.createElement('div'))
		messageBody.id = 'messageBody'
		// messageBody.textContent = this.getAttribute('message') || 'Mensagem de teste'

		const messageFooter = messageDiv.appendChild(document.createElement('div'))
		messageFooter.id = 'messageFooter'

		const okBtn = messageFooter.appendChild(document.createElement('button'))
		okBtn.id = "okBtn"
		okBtn.innerText = 'Ok'
		okBtn.onclick = () => {hideMessage()}

		this.addEventListener('showMessage', (e) => {
			// this.setAttribute('title', e.detail.title)
			// this.setAttribute('message', e.detail.message)
			messageHeader.textContent = e.detail.title
			messageBody.textContent = e.detail.message
			wrapper.style.display = 'flex'
			shadowDiv.style.animation = 'fadeIn linear .4s 1'
			messageDiv.style.animation = 'growUp ease-in-out .2s 1'
		})

		const hideMessage = () => {
			messageHeader.textContent = ''
			messageBody.textContent = ''
			messageDiv.style.animation = 'decrease ease-in-out .2s 1 forwards'
			wrapper.addEventListener('animationend', removeShadow)
		}

		const removeShadow = () => {
			wrapper.removeEventListener('animationend', removeShadow)
			shadowDiv.style.animation = 'fadeOut linear .4s 1'
			wrapper.addEventListener('animationend', removeWrapper)
		}

		const removeWrapper = () => {
			wrapper.removeEventListener('animationend', removeWrapper)
			wrapper.style.display = 'none'
		}
	}

	showMessage(title, message) {
		let event = new CustomEvent('showMessage', {
			detail: {
				title,
				message
			}
		})
		this.dispatchEvent(event)
	}
}

customElements.define('my-message', Message)