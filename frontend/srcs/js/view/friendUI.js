export class FriendView extends HTMLElement {
	constructor() {
		super();
	}
	connectedCallback() {
		this.innerHTML = `
        <p>Friends Management</p>
		<div class="friend-container">

			<div class="friend-card" id="all-users">
				<p>All Users</p>
				<ul id="users">
                    <li class='user-item'>
                        <img src="https://cdn.intra.42.fr/users/7e57e4d04af367214c4a7e33fa9aa6bc/belkarto.JPG" alt="User Avatar" class="avatar">
                        <span class="username">belkarto</span>
                        <div class="action-buttons">
                            <button type="button" class="icon-button add-friend" title="Add friend">
                                <i class="bi bi-person-plus-fill"></i>
                            </button>
                            <button type="button" class="icon-button block-user" title="Block user">
                                <i class="bi bi-person-x"></i>
                            </button>
                        </div>
                    </li>
                    <li class='user-item'>
                        <img src="https://cdn.intra.42.fr/users/602dded00c7d1e6aad94dae8388618e3/ysabr.JPG" alt="User Avatar" class="avatar">
                        <span class="username">ysabir</span>
                        <div class="action-buttons">
                            <button type="button" class="icon-button add-friend" title="Add friend">
                                <i class="bi bi-person-plus-fill"></i>
                            </button>
                            <button type="button" class="icon-button block-user" title="Block user">
                                <i class="bi bi-person-x"></i>
                            </button>
                        </div>
                    </li>
                    <li class='user-item'>
                        <img src="https://cdn.intra.42.fr/users/225b6f1dd7c783b14d60b20841a83047/yachaab.jpg" alt="User Avatar" class="avatar">
                        <span class="username">yachaab</span>
                        <div class="action-buttons">
                            <button type="button" class="icon-button add-friend" title="Add friend">
                                <i class="bi bi-person-plus-fill"></i>
                            </button>
                            <button type="button" class="icon-button block-user" title="Block user">
                                <i class="bi bi-person-x"></i>
                            </button>
                        </div>
                    </li>
                </ul>
			</div>

			<div class="friend-card" id="friends-list">
				<p>Friends List</p>
				<ul id="friends">
                    <li class='user-item'>
                        <img src="https://cdn.intra.42.fr/users/7e57e4d04af367214c4a7e33fa9aa6bc/belkarto.JPG" alt="User Avatar" class="avatar">
                        <span class="username">belkarto</span>
                        <div class="action-buttons">
                            <button type="button" class="icon-button remove-friend" title="remove frind">
                                <i class="bi bi-person-dash-fill"></i>
                            </button>
                            <button type="button" class="icon-button block-user" title="Block user">
                                <i class="bi bi-person-x"></i>
                            </button>
                        </div>
                    </li>
                    <li class='user-item'>
                        <img src="https://cdn.intra.42.fr/users/602dded00c7d1e6aad94dae8388618e3/ysabr.JPG" alt="User Avatar" class="avatar">
                        <span class="username">ysabir</span>
                        <div class="action-buttons">

                            <button type="button" class="icon-button remove-friend" title="remove frind">
                                <i class="bi bi-person-dash-fill"></i>
                            </button>
                            <button type="button" class="icon-button block-user" title="Block user">
                                <i class="bi bi-person-x"></i>
                            </button>
                        </div>
                    </li>
                    <li class='user-item'>
                        <img src="https://cdn.intra.42.fr/users/225b6f1dd7c783b14d60b20841a83047/yachaab.jpg" alt="User Avatar" class="avatar">
                        <span class="username">yachaab</span>
                        <div class="action-buttons">
                            <button type="button" class="icon-button remove-friend" title="remove frind">
                                <i class="bi bi-person-dash-fill"></i>
                            </button>
                            <button type="button" class="icon-button block-user" title="Block user">
                                <i class="bi bi-person-x"></i>
                            </button>
                        </div>
                    </li>
                </ul>
			</div>

			<div class="friend-card" id="received-requests">
				<p>Received Friend Requests</p>
				<ul id="requests">
                    <li class='user-item'>
                        <img src="https://cdn.intra.42.fr/users/7e57e4d04af367214c4a7e33fa9aa6bc/belkarto.JPG" alt="User Avatar" class="avatar">
                        <span class="username">belkarto</span>
                        <div class="action-buttons">
                            <button type="button" class="icon-button accept-friend" title="Accept friend">
                                <i class="bi bi-person-check-fill"></i>
                            </button>
                            <button type="button" class="icon-button block-user" title="Block user">
                                <i class="bi bi-person-x"></i>
                            </button>
                        </div>
                    </li>
                    <li class='user-item'>
                        <img src="https://cdn.intra.42.fr/users/602dded00c7d1e6aad94dae8388618e3/ysabr.JPG" alt="User Avatar" class="avatar">
                        <span class="username">ysabir</span>
                        <div class="action-buttons">
                            
                            <button type="button" class="icon-button accept-friend" title="Accept friend">
                                <i class="bi bi-person-check-fill"></i>
                            </button>
                            <button type="button" class="icon-button block-user" title="Block user">
                                <i class="bi bi-person-x"></i>
                            </button>
                        </div>
                    </li>
                    <li class='user-item'>
                        <img src="https://cdn.intra.42.fr/users/225b6f1dd7c783b14d60b20841a83047/yachaab.jpg" alt="User Avatar" class="avatar">
                        <span class="username">yachaab</span>
                        <div class="action-buttons">
                            <button type="button" class="icon-button accept-friend" title="Accept friend">
                                <i class="bi bi-person-check-fill"></i>
                            </button>
                            <button type="button" class="icon-button block-user" title="Block user">
                                <i class="bi bi-person-x"></i>
                            </button>
                        </div>
                    </li>
                </ul>
			</div>

			<div class="friend-card" id="blocked-users">
				<p>Blocked Users</p>
				<ul id="blocked">
                    <li class='user-item'>
                        <img src="https://cdn.intra.42.fr/users/7e57e4d04af367214c4a7e33fa9aa6bc/belkarto.JPG" alt="User Avatar" class="avatar">
                        <span class="username">belkarto</span>
                        <div class="action-buttons">
                            <button type="button" class="icon-button add-friend" title="Add friend">
                                <i class="bi bi-person-plus-fill"></i>
                            </button>
                            <button type="button" class="icon-button unblock-user" title="Unblock user">
                                <i class="bi bi-person-dash"></i>
                            </button>
                        </div>
                    </li>
                    <li class='user-item'>
                        <img src="https://cdn.intra.42.fr/users/602dded00c7d1e6aad94dae8388618e3/ysabr.JPG" alt="User Avatar" class="avatar">
                        <span class="username">ysabir</span>
                        <div class="action-buttons">
                            <button type="button" class="icon-button add-friend" title="Add friend">
                                <i class="bi bi-person-plus-fill"></i>
                            </button>
                            <button type="button" class="icon-button unblock-user" title="Unblock user">
                                <i class="bi bi-person-dash"></i>
                            </button>
                        </div>
                    </li>
                    <li class='user-item'>
                        <img src="https://cdn.intra.42.fr/users/225b6f1dd7c783b14d60b20841a83047/yachaab.jpg" alt="User Avatar" class="avatar">
                        <span class="username">yachaab</span>
                        <div class="action-buttons">
                            <button type="button" class="icon-button add-friend" title="Add friend">
                                <i class="bi bi-person-plus-fill"></i>
                            </button>
                            <button type="button" class="icon-button unblock-user" title="Unblock user">
                                <i class="bi bi-person-dash"></i>
                            </button>
                        </div>
                    </li>
                </ul>
			</div>
		</div>
`;
	}
}
