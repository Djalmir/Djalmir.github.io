function copyLink(){
	navigator.clipboard.writeText(document.querySelector('#cmLink').innerText)
}

console.log(`
	TIP:\n
	In this console you can't declare variables like this:\n
	var foo = 123\n
	Instead, you just type:\n
	foo = 123
`)