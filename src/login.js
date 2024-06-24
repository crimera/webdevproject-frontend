import $ from "jquery";
import { isLoggedIn } from "./utils";

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

            console.log(res)
            window.location.href = "login.html"
        }
    })
})

function loginFailed() {
    // TODO: show login failed error
    console.log("failed")
}
