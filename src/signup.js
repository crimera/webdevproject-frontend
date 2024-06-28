import $ from "jquery";
import { isLoggedIn } from "./utils";

console.log("working")

let signupForm = $("#signup-form")

isLoggedIn().then((res) => {
    if (res) {
        window.location.href = "history.html"
    }
})

signupForm.on("submit", (e) => {
    e.preventDefault()

    let error = $("#error-container")

    error.addClass("invisible")

    if ($("#passwordConfirm").val() != $("#password").val()) {
        error.text("Error: password confirmation is not the same")
        error.removeClass("invisible")
        return
    }

    $.ajax({
        type: "POST",
        url: 'http://localhost:8080/signup',
        data: signupForm.serialize(),
        success: (res) => {
            if (res == "") {
                signupFailed()
                return
            }

            console.log(res)
            window.location.href = "login.html"
        }
    })
})


function signupFailed() {
    console.log("failed")
}

