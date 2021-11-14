function copyLink() {
	navigator.clipboard.writeText(document.querySelector('#cmLink').innerText)
	let msg = document.querySelector('#my-message')
	msg.showMessage('Tag copied!',"Now you're just a CTRL + V away from seeing your project logs on your phone! 😀")
}

console.log(`
	TIP:\n
	In this console you can't declare variables like this:\n
	var foo = 123\n
	Instead, you just type:\n
	foo = 123
`)