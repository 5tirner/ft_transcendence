export class FriendView extends HTMLElement {
	constructor() {
		super();
	}
	connectedCallback() {
		this.innerHTML = `
		<div class="friend-container">
			<p>Friends Management</p>

			<div class="friend-card" id="friends-list">
				<p>Friends List</p>
				<ul id="friends"></ul>
			</div>
			<!---->
			<!-- <div class="friend-card" id="all-users"> -->
			<!-- 	<h2>All Users</h2> -->
			<!-- 	<ul id="users"></ul> -->
			<!-- </div> -->
			<!---->
			<!-- <div class="friend-card" id="received-requests"> -->
			<!-- 	<h2>Received Friend Requests</h2> -->
			<!-- 	<ul id="requests"></ul> -->
			<!-- </div> -->
			<!---->
			<!-- <div class="friend-card" id="blocked-users"> -->
			<!-- 	<h2>Blocked Users</h2> -->
			<!-- 	<ul id="blocked"></ul> -->
			<!-- </div> -->
		</div>
`;
	}
}
