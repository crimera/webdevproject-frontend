import $ from "jquery";
import { isLoggedIn, banned } from "./utils";

console.log("working")

isLoggedIn().then((res) => {
    if (res) {
        window.location.href = "history.html"
    }
})

let loginForm = $("#login-form")
let error = $("#error-container")

loginForm.on("submit", (e) => {
    e.preventDefault()

    error.addClass("invisible")

    $.ajax({
        type: "POST",
        url: 'http://localhost:8080/login',
        data: loginForm.serialize(),
        success: (res) => {
            if (res == "") {
                loginFailed()
                return
            }

            console.log(res)
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
    error.text("Wrong username or password")
    error.removeClass("invisible")
    console.log("failed")
}
