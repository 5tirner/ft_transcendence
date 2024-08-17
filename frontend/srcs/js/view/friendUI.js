export class FriendView extends HTMLElement {
	constructor() {
		super();
	}
	connectedCallback() {
		this.innerHTML = `
        <p>Friends Management</p>
		<div class="friend-container">

			<div class="friend-card" id="friends-list">
				<p>Friends List</p>
				<ul id="friends">
                    <li>user</li>
                    <li>user</li>
                    <li>user</li>
                    <li>user</li>
                </ul>
			</div>

			<div class="friend-card" id="all-users">
				<p>All Users</p>
				<ul id="users">
                    <li>user</li>
                    <li>user</li>
                    <li>user</li>
                    <li>user</li>
                </ul>
			</div>

			<div class="friend-card" id="received-requests">
				<p>Received Friend Requests</p>
				<ul id="requests">
                    <li>user</li>
                    <li>user</li>
                    <li>user</li>
                    <li>user</li>
                </ul>
			</div>

			<div class="friend-card" id="blocked-users">
				<p>Blocked Users</p>
				<ul id="blocked">
                    <li>user</li>
                    <li>user</li>
                    <li>user</li>
                    <li>5 user</li>
                    <li>4 user</li>
                    <li>3 user</li>
                    <li>2 user</li>
                    <li>1 user</li>
                </ul>
			</div>
		</div>
`;
	}
}
