let currentEditId = null;

 document.addEventListener('click', event => {
	if (event.target.dataset.type === 'remove') {
		const id = event.target.dataset.id
		// id - каждой задачи

		remove(id).then(() => {
			event.target.closest('li').remove()
		})

	}

	if (event.target.dataset.type === 'edit') {
		currentEditId = event.target.dataset.id
		const currentTitle = event.target.dataset.title

    	const editInput = document.getElementById('editNoteInput')
    	editInput.value = currentTitle
    
    
    	const modal = new bootstrap.Modal(document.getElementById('editModal'))
    	modal.show()
		
	}

	if (event.target.dataset.type === 'saveNewTitle') {
		const title = document.getElementById('editNoteInput').value
	
		if (currentEditId) {
			 edit(currentEditId, title).then(() => {
				const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
				modal.hide();
			})

			edit(currentEditId, title).then(() => {
    		location.reload(); // перезагружает страницу
			})
		}	
	}
})

async function remove(id) {
	await 	fetch(`/${id}`, {method: 'DELETE'})
}

async function edit(id, title) {
	await 	fetch(`/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },  
    	body: JSON.stringify({title: title})
		
	})

}
