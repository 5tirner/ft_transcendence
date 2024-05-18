window.onload = function() {
    var username = getCookie("username");
    if (username) {
        document.getElementById("username").innerText = username;
    } else {
        // Redirect to login page if user not authenticated
        window.location.href = "/login.html";
    }
};

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}
