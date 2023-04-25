function is_subscribed() {

	profile = subscribe_btn.dataset.profile;

	fetch(`is_subscribed/${profile}`)
	.then(response => response.text())
	.then(data => {
		console.log(data);
		if (data === 'subscribed') {
			subscribe_btn.innerHTML = '';
			subscribe_btn.innerHTML = 'Unsubscribe';
		} else {
			subscribe_btn.innerHTML = '';
			subscribe_btn.innerHTML = 'Subscribe';
		}
	})
}

function follow() {

	profile = subscribe_btn.dataset.profile;
	
	fetch(`follow/${profile}`)
	.then(response => response.text())
	.then(data => {
		console.log(data);
		if (data === 'just subscribed') {
			followers = document.querySelector('#followers').innerHTML;
			followers = parseInt(followers) + 1;
			document.querySelector('#followers').innerHTML = '';
			document.querySelector('#followers').innerHTML = followers;
			subscribe_btn.innerHTML = '';
			subscribe_btn.innerHTML = 'Unsubscribe';

		} else {
			followers = document.querySelector('#followers').innerHTML;
			followers = parseInt(followers) - 1;
			document.querySelector('#followers').innerHTML = '';
			document.querySelector('#followers').innerHTML = followers;
			subscribe_btn.innerHTML = '';
			subscribe_btn.innerHTML = 'Subscribe';
		}
	})
	// .then(is_subscribed());
	
}


document.addEventListener('DOMContentLoaded', () => {

	subscribe_btn = document.querySelector('#subscribe');
	if (subscribe_btn) {
		subscribe_btn.innerHTML = '';
		is_subscribed();

		subscribe_btn.addEventListener('click', follow);
	}

})