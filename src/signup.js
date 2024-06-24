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
    // TODO: show signup failed error
    console.log("failed")
}
