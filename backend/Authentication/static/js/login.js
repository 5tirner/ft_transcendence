document.getElementById("login-42").addEventListener("click", loginWith42);
document.getElementById("login-google").addEventListener("click", loginWithGoogle);

function loginWith42() {
    window.location.href = "/api/oauth/intra/";
}

function loginWithGoogle() {
    window.location.href = "/api/google/";
}

// document.addEventListener("DOMContentLoaded", function() {
//     // Add event listener to login button
//     document.getElementById("loginBtn").addEventListener("click", function() {
//         // Redirect to the 42 authentication URL
//         window.location.href = "http://127.0.0.1:8000/api/oauth/intra/";
//     });

//     // Check if the URL contains the username query parameter
//     const urlParams = new URLSearchParams(window.location.search);
//     const username = urlParams.get('username');
//     if (username) {
//         // Display the username on the page
//         document.getElementById("usernameContainer").innerText = "Welcome " + username;
//     }
// });
