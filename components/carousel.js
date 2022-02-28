class Carousel extends HTMLElement {
	constructor(srcs) {
		super()
		this.attachShadow({mode: 'open'})

		if (!srcs) {
			if (!this.hasAttribute('srcs'))
				throw new Error("The carousel needs the attribute srcs. It should one or more image sources separated by commas.\nExample:\n<zion-carousel srcs='img1.png, img2.png, img3.png' />\n😉\n")

			srcs = this.getAttribute('srcs').split(',').map((attr) => {
				return attr.trim()
			})
		}



		const style = this.shadowRoot.appendChild(document.createElement('style'))
		style.textContent = /*css*/`
			* {
				margin: 0;
				padding: 0;
				box-sizing: border-box;
				-webkit-tap-highlight-color: transparent;
			}

			::-webkit-scrollbar {
				height: 0;
			}

			#wrapper {
				width: 100%;
				height: 100%;
				margin: 0;
			}

			#imgsWrapper {
				overflow: hidden;
				height: 100%;
				scroll-behavior: smooth;
				white-space: nowrap;
				padding: 0;
			}

			.arr{
				position: absolute;
				top: 0;
				width: 10%;
				height: 100%;
				border: none;
				outline: none;
				background: none;
				color: #ccc;
				font-size: 2em;
				cursor: pointer;
				transition: .1s;
			}

			#leftArr {
				left: 0;
				text-align: left;
				padding-left: 10px;
			}
			
			#leftArr:hover {
				background: linear-gradient(to left, transparent, #09090990);
			}

			#rightArr {
				right: 0;
				text-align: right;
				padding-right: 10px;
			}
			
			#rightArr:hover {
				background: linear-gradient(to right, transparent, #09090990);
			}

			#leftArr:active,
			#rightArr:active {
				font-size: 1.5em;
			}

		`

		this.showingIndex = 0

		const wrapper = this.shadowRoot.appendChild(document.createElement('div'))
		wrapper.id = 'wrapper'

		const div = wrapper.appendChild(document.createElement('div'))
		div.id = 'imgsWrapper'

		this.scrollToLeft = () => {
			if (this.showingIndex > 0)
				this.showingIndex--
			else
				this.showingIndex = srcs.length - 1
			let child = div.children[this.showingIndex]
			div.scrollTo(child.offsetLeft - div.offsetWidth / 2 + child.offsetWidth / 2, 0)
		}

		this.scrollToRight = () => {
			if (this.showingIndex < srcs.length - 1)
				this.showingIndex++
			else
				this.showingIndex = 0
			let child = div.children[this.showingIndex]
			div.scrollTo(child.offsetLeft - div.offsetWidth / 2 + child.offsetWidth / 2, 0)
		}

		for (let i = 0; i < srcs.length; i++) {
			let img = document.createElement('img')

			img.setSizes = () => {
				let imgContainer = div.appendChild(document.createElement('div'))
				imgContainer.style = `
						margin: 0;
						border-radius: .5rem;
						display: inline-block;
						width: 100%;
						height: 100%;
						text-align: center;
						position: relative;
					`
				img.style = `
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
						max-width: 100%;
						max-height: 100%;
					`
				imgContainer.appendChild(img)
				// div.appendChild(img)
			}

			img.addEventListener('load', img.setSizes)
			img.setAttribute('src', srcs[i])

			img.onclick = () => {
				if (!sessionStorage.getItem('zionCarousel-isFullScreen')) {
					sessionStorage.setItem('zionCarousel-isFullScreen', 'true')
					let documentBody = document.documentElement.querySelector('body')
					let shadow = documentBody.appendChild(document.createElement('div'))
					shadow.style = `
						position: fixed;
						top: 0;
						left: 0;
						width: 100%;
						height: 100vh;
						background: #000000d8;
						z-index: 98;
						animation: .2s linear carouselFadeIn 1;
					`
					let fullScreenZionCarousel = this.cloneNode(true)
					// let fullScreenZionCarousel = new Carousel(srcs)

					let compBounding = this.getBoundingClientRect()

					let css = `
						#closeBt {
							position: fixed;
							right: 5px;
							top: 5px;
							width: 64px;
							height: 64px;
							background: transparent;
							color: #fff;
							font-size: 32px;
							font-weight: bolder;
							border: none;
							z-index: 99;
							cursor: pointer;
							opacity: .7;
						}

						#closeBt:hover {
							opacity: 1;
							transform: scale(1.05);
						}

						#closeBt:active {
							transform: scale(.95);
						}

						@keyframes carouselFadeIn{
							from {
								opacity: 0;
							}
							to {
								opacity: 1;
							}
						}

						@keyframes carouselFadeOut {
							from {
								opacity: 1;
							}
							to {
								opacity: 0;
							}
						}

						@keyframes carouselShow {
							from {
								top: ${ compBounding.y }px;
								left: ${ compBounding.x }px;
								width: ${ compBounding.width }px;
								height: ${ compBounding.height }px;
							}
							to {
								top: 0;
								left: 0;
								width: 100%;
								height: 100%;
							}
						}

						@keyframes carouselHide {
							from {
								top: 0;
								left: 0;
								width: 100%;
								height: 100%;
							}
							to {
								top: ${ compBounding.y }px;
								left: ${ compBounding.x }px;
								width: ${ compBounding.width }px;
								height: ${ compBounding.height }px;
							}
						}
					`
					let style = document.createElement('style')
					style.appendChild(document.createTextNode(css))
					let head = document.documentElement.querySelector('head')
					head.appendChild(style)

					fullScreenZionCarousel.style = `
						position: fixed;
						top: ${ compBounding.y }px;
						left: ${ compBounding.x }px;
						width: ${ compBounding.width }px;
						height: ${ compBounding.height }px;
						z-index: 99;
						animation: .2s linear carouselShow forwards;
					`

					documentBody.appendChild(fullScreenZionCarousel)

					let allCss = Array.from(document.styleSheets[0].cssRules).find(x => x.selectorText == '*')
					allCss.style.overflow = 'hidden'

					let closeBt = documentBody.appendChild(document.createElement('button'))
					closeBt.id = 'closeBt'
					closeBt.innerText = '\u2715'
					closeBt.style.animation = '.2s linear carouselFadeIn 1'
					closeBt.onclick = () => rmFullScreen()
					function rmFullScreen() {
						const rmShadow = () => {
							shadow.removeEventListener('animationend', rmShadow)
							documentBody.removeChild(shadow)
							documentBody.removeChild(closeBt)
						}

						closeBt.style.animation = '.2s linear carouselFadeOut 1 forwards'
						shadow.style.animation = '.2s linear carouselFadeOut 1 forwards'
						shadow.addEventListener('animationend', rmShadow)

						const rmCarousel = () => {
							fullScreenZionCarousel.removeEventListener('animationend', rmCarousel)
							documentBody.removeChild(fullScreenZionCarousel)
							sessionStorage.removeItem('zionCarousel-isFullScreen')
							allCss.style.overflow = ''
							fullScreenZionCarousel = null
						}

						fullScreenZionCarousel.style.animation = '.2s linear carouselHide'
						fullScreenZionCarousel.addEventListener('animationend', rmCarousel)
					}

					const kd = (e) => {
						switch (e.key) {
							case 'Escape':
								window.removeEventListener('keydown', kd)
								rmFullScreen()
								break
							case 'ArrowLeft':
								fullScreenZionCarousel.scrollToLeft()
								break
							case 'ArrowRight':
								fullScreenZionCarousel.scrollToRight()
								break
						}
					}
					window.addEventListener('keydown', kd)
				}
			}
		}

		const leftArr = wrapper.appendChild(document.createElement('button'))
		leftArr.id = 'leftArr'
		leftArr.classList.add('arr')
		leftArr.onclick = () => this.scrollToLeft()
		leftArr.innerText = '\u276E'

		const rightArr = wrapper.appendChild(document.createElement('button'))
		rightArr.id = 'rightArr'
		rightArr.classList.add('arr')
		rightArr.onclick = () => this.scrollToRight()
		rightArr.innerText = '\u276F'

		window.addEventListener('resize', () => {
			let child = div.children[this.showingIndex]
			div.scrollTo(child.offsetLeft - div.offsetWidth / 2 + child.offsetWidth / 2, 0)
		})

		window.addEventListener('beforeunload', () => {
			sessionStorage.removeItem('zionCarousel-isFullScreen')
		})
	}
}

customElements.define('zion-carousel', Carousel)