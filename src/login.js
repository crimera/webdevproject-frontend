import $ from "jquery";
import { isLoggedIn, banned } from "./utils";

console.log("working")

isLoggedIn().then((res) => {
    if (res) {
        window.location.href = "history.html"
    }
})

let loginForm = $("#login-form")

loginForm.on("submit", (e) => {
    e.preventDefault()

    $.ajax({
        type: "POST",
        url: 'http://localhost:8080/login',
        data: loginForm.serialize(),
        success: (res) => {
            if (res == "") {
                loginFailed()
                return
            }

            if (res == "banned") {
                banned()
                return
            }

            window.location.href = "login.html"
        }
    })
})

window.onclick = function(event) {
    let modal = document.getElementById("myModal")
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function loginFailed() {
    // TODO: show login failed error
    console.log("failed")
}
