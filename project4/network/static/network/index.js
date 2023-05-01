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


function like_post(post_id) {

	// Heart-svg images
	const svg_like = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="bi bi-heart-fill" viewBox="0 0 16 16">
	<path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>`;
	const svg_unlike = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
	<path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
	</svg>`;

	fetch(`/like_post/${post_id}`)
	.then(response => response.json())
	.then(result => {

		// Get element with heart
		heart_id = 'like_' + post_id
		heart_svg = document.querySelector(`#${heart_id}`);

		// Get element for amount of likes
		likeCount_id = 'likeCount_' + post_id
		likeCount_elem = document.querySelector(`#${likeCount_id}`)
		// Show new amount of likes
		likeCount_elem.innerHTML = result.likes_count

		// Like/unlike heart appearanse
		if (result.liked) {
			heart_svg.innerHTML = svg_like;
			
		} else {
			heart_svg.innerHTML = svg_unlike;
		}
	});
}


document.addEventListener('DOMContentLoaded', () => {

	// New post form clear on focus
	newPost_form = document.querySelector('#id_content');
	newPost_form.onfocus = () => {
		newPost_form.innerHTML = '';
		document.querySelector('#newPost_submit').disabled = false;
	}

	const hearts = document.querySelectorAll('.hearts');
	hearts.forEach(i => {
		// Set listener
		i.addEventListener('click', () => {
			like_post(i.dataset.id);
		});
	});
	
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

	// Edit post edit listener

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