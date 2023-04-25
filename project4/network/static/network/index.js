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

})