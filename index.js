var editor = null;

window.onload = () => {
	editor = new SimpleMDE();
}

function btnNewClick(){
	const prototypeElement =  document.getElementById("note-tab-prototype");
	const newNode = prototypeElement.cloneNode(true);
	prototypeElement.after(newNode);
}
