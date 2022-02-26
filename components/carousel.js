class Carousel extends HTMLElement {
	constructor() {
		super()
		this.attachShadow({mode: 'open'})

		if (!this.hasAttribute('srcs'))
			throw new Error("The carousel needs the attribute srcs. It should one or more image sources separated by commas.\nExample:\n<zion-carousel srcs='img1.png, img2.png, img3.png' />\n😉\n")

		const srcs = this.getAttribute('srcs').split(',').map((attr) => {
			return attr.trim()
		})

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
				margin: 17px 0;
			}

			#imgsWrapper {
				width: 100%;
				overflow: hidden;
				scroll-behavior: smooth;
				white-space: nowrap;
			}

			#imgsWrapper img {
				margin: 0 5%;
				border-radius: .5rem;
				display: inline;
				vertical-align: middle;
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
				transition: .2s;
			}

			#leftArr {
				left: -15px;
				text-align: left;
				padding-left: 10px;
				border-radius: 0 5rem 5rem 0;
			}
			
			#leftArr:hover {
				background: linear-gradient(to left, transparent, #090909d8);
			}

			#rightArr {
				right: -15px;
				text-align: right;
				padding-right: 10px;
				border-radius: 5rem 0 0 5rem;
			}
			
			#rightArr:hover {
				background: linear-gradient(to right, transparent, #090909d8);
			}

			#leftArr:active,
			#rightArr:active {
				font-size: 1.5em;
			}
		`

		const showingIndex = this.shadowRoot.appendChild(document.createElement('input'))
		showingIndex.type = 'number'
		showingIndex.style.display = 'none'
		showingIndex.value = 0

		const wrapper = this.shadowRoot.appendChild(document.createElement('div'))
		wrapper.id = 'wrapper'

		const div = wrapper.appendChild(document.createElement('div'))
		div.id = 'imgsWrapper'

		for (let i = 0; i < srcs.length; i++) {
			let img = document.createElement('img')
			img.setAttribute('src', srcs[i])

			if (img.naturalWidth > img.naturalHeight) {
				img.style.width = '90%'
				div.appendChild(img)
			}
			else {
				let imgContainer = div.appendChild(document.createElement('div'))
				imgContainer.style = `
					margin: 0;
					border-radius: .5rem;
					display: inline-block;
					width: 100%;
					text-align: center;
				`
				img.style = `
					height: ${img.naturalHeight}px;
					max-height: 50vh;
					margin: 0 auto;
					border-radius: .5rem;
					display: inline;
				`
				imgContainer.appendChild(img)
			}
		}

		const leftArr = wrapper.appendChild(document.createElement('button'))
		leftArr.id = 'leftArr'
		leftArr.classList.add('arr')
		leftArr.onclick = () => {
			if (showingIndex.value > 0)
				showingIndex.value--
			else
				showingIndex.value = srcs.length - 1
			div.scrollTo(showingIndex.value * div.offsetWidth, 0)
		}
		leftArr.innerText = '\u276E'

		const rightArr = wrapper.appendChild(document.createElement('button'))
		rightArr.id = 'rightArr'
		rightArr.classList.add('arr')
		rightArr.onclick = () => {
			if (showingIndex.value < srcs.length - 1)
				showingIndex.value++
			else
				showingIndex.value = 0
			div.scrollTo(showingIndex.value * div.offsetWidth, 0)
		}
		rightArr.innerText = '\u276F'

		window.addEventListener('resize', () => {
			div.scrollTo(showingIndex.value * div.offsetWidth, 0)
		})

	}
}

customElements.define('zion-carousel', Carousel)