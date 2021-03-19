function onDragStart(event) {
    event.dataTransfer.setData('text', event.target.id);
    event.dataTransfer.setData('value', event.target.dataset.value);
}

function onDragOver(event) {
    event.preventDefault();
}

function onDrop(event) {  
    const id = event.dataTransfer.getData('value');
    const draggableElement = document.getElementById('pawn'+id.toString());
    const dropzone = event.target;
    dropzone.appendChild(draggableElement);
    event.dataTransfer.clearData();
}