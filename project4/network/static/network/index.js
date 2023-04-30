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
	// 	return content;
	// })

	const response = await fetch(`/edit_post/${post_id}`, {
			method: 'POST',
			body: new_content
		});
	const data = await response.text();
	return data;
}


// Make a post with new content, remove form
function new_post(post_id) {

	// Hide the form
	const form_id = 'form_' + post_id;
	const form = document.querySelector(`#${form_id}`);
	form.display = 'none';

	// Send new content to the server
	submit_post(post_id).then(content => {		
		// Fullfill the content element
		// Get id of content element
		const id_content = 'content_' + post_id;
		content_element = document.querySelector(`#${id_content}`);
		// Fill in the new content
		content_element.innerHTML = '';
		content_element.innerHTML = content;
	});
}

// Add new form to the element, filled with content
function add_form(content_element, old_content, post_id, edit_btn) {
	// Create input form
	const form = document.createElement('form');
	form.id = 'form_' + post_id;
	form.className = 'w-75';

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

	// Add new form to the page
	form_group.appendChild(textarea);
	form.appendChild(form_group);
	form.appendChild(submit);
	content_element.innerHTML = ``;
	content_element.appendChild(form);

	// Prevent page from reloading and send data
	submit.addEventListener('click', function(event) {
		event.preventDefault();
		new_post(post_id);

		// Show edit button
		edit_btn.style.display = 'inline-block';
	});

}

// Make a text-area out of post and change content of post
function edit(edit_btn, post_id) {

	// Hide edit button
	edit_btn.style.display = 'none';

	// Get the element with post content
	const id_content = 'content_' + post_id;
	content_element = document.querySelector(`#${id_content}`);

	// Get old content of the post
	const old_content = content_element.innerHTML;

	// Create textarea with the old content of the post
	add_form(content_element, old_content, post_id, edit_btn);

	// Show edit button
	//edit_btn.style.display = 'inline-block';
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

	// 1st variant doesn't work with several edit events
	// Because id variable got rewritten

	// document.addEventListener('click', event => {
	// 	// Get the element that triggered an event
	// 	const edit_btn = event.target;

	// 	if (edit_btn.className === 'edit') {
	// 		// Get the post id via data attr
	// 		post_id = edit_btn.dataset.id;
	// 		// Edit post
	// 		edit(edit_btn, post_id);
	// 	}
	// });


	// Add listener to each button explicitly!
	// Get list of buttons
	const edit_buttons = document.querySelectorAll('.edit');

	edit_buttons.forEach((btn) => {
		// Set listener
		btn.addEventListener('click', () => {
			edit(btn, btn.dataset.id);
		});
	});

})