function btn_subscribe() {
	subscribe_btn.innerHTML = '';
	subscribe_btn.innerHTML = 'Subscribe';
}

function btn_unsubscribe() {
	subscribe_btn.innerHTML = '';
	subscribe_btn.innerHTML = 'Unsubscribe';
}

function is_subscribed() {

	profile = subscribe_btn.dataset.profile;

	fetch(`is_subscribed/${profile}`)
	.then(response => response.text())
	.then(data => {
		if (data === 'subscribed') {
			btn_unsubscribe();
		} else {
			btn_subscribe();
		}
	})
}

function follow() {

	profile = subscribe_btn.dataset.profile;
	
	fetch(`follow/${profile}`)
	.then(response => response.text())
	.then(data => {
		if (data === 'just subscribed') {
			followers = document.querySelector('#followers').innerHTML;
			document.querySelector('#followers').innerHTML = '';
			document.querySelector('#followers').innerHTML = parseInt(followers) + 1;
			btn_unsubscribe();

		} else {
			followers = document.querySelector('#followers').innerHTML;
			document.querySelector('#followers').innerHTML = '';
			document.querySelector('#followers').innerHTML = parseInt(followers) - 1;
			btn_subscribe();
		}
	})	
}

// Send new content to the server
async function submit_post(post_id) {

	// Get new content of the post
	const id_textarea = 'text_' + post_id;
	const new_content = document.querySelector(`#${id_textarea}`).value;
	
	// Send new content to the sesrver
	// fetch(`edit_post/${post_id}`, {
	// 	method: 'POST',
	// 	body: new_content
	// })
	// // Process the response
	// .then(response => response.text())
	// .then(data => {
	// 	const content = data
	// 	console.log(content);
	// 	return content;
	// })

	const response = await fetch(`edit_post/${post_id}`, {
			method: 'POST',
			body: new_content
		});
	const data = await response.text();
	return data;
}


// Make a post with new content
function new_post(post_id, edit_btn) {

	submit_post(post_id).then(content => {
		
		// Fill in the new content
		const id_content = 'content_' + post_id;
		element = document.querySelector(`#${id_content}`);

		element.innerHTML = '';
		element.innerHTML = content;
	});

	// Hide the form
	const form_id = 'form_' + post_id;
	const form = document.querySelector(`#${form_id}`);
	form.display = 'none';

	// // Fill in the new content
	// const id_content = 'content_' + post_id;
	// element = document.querySelector(`#${id_content}`);

	// element.innerHTML = '';
	// element.innerHTML = new_content;

	// Show edit button
	edit_btn.style.display = 'inline-block';
}

// Add new form to the element, filled with content
function add_form(element_content, old_content, edit_btn) {
	// Create input form
	const form = document.createElement('form');
	form.id = 'form_' + post_id;
	form.className = 'w-50';

	const form_group = document.createElement('div');
	form_group.className = 'form-group';

	const textarea = document.createElement('textarea');
	textarea.id = 'text_' + post_id;
	textarea.className = 'form-control';
	textarea.innerHTML = old_content;

	const submit = document.createElement('button');
	submit.className = 'btn btn-secondary';
	submit.id = 'submit_' + post_id;
	submit.innerHTML = 'Save';

	// Prevent page from reloading and send data
	submit.addEventListener('click', function(event) {
		event.preventDefault();
		// const content = submit_post(post_id);
		
		new_post(post_id, edit_btn);
	});

	// Add new form to the page
	form_group.appendChild(textarea);
	form.appendChild(form_group);
	form.appendChild(submit);
	element_content.innerHTML = ``;
	element_content.appendChild(form);
}

// Make a text-area out of post and change content of post
function edit(edit_btn, post_id) {

	// Hide edit button
	edit_btn.style.display = 'none';

	// Get the element with post content
	const id_content = 'content_' + post_id;
	element_content = document.querySelector(`#${id_content}`);

	// Get old content of the post
	const old_content = element_content.innerHTML;

	// Create textarea out with the old content of the post
	add_form(element_content, old_content, edit_btn);
	
	// Send new content to the server via button
	
	
}


document.addEventListener('DOMContentLoaded', () => {

	// Try to get subscribe button
	subscribe_btn = document.querySelector('#subscribe');
	// If we've got subscribe button
	if (subscribe_btn) {
		subscribe_btn.innerHTML = '';
		// Fill it with up-to-date info about subscription
		is_subscribed();
		// Onclick follow/unfollow functionality
		subscribe_btn.addEventListener('click', follow);
	}

	// Edit post listener
	document.addEventListener('click', event => {
		// Get the element that triggered an event
		const edit_btn = event.target;

		if (edit_btn.className === 'edit') {
			// Get the post id via data attr
			post_id = edit_btn.dataset.id;
			edit(edit_btn, post_id);
		}
	})
	
})