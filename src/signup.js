import $ from "jquery";

console.log("working")

let username = $("#username")
let password = $("#password")

let loginBtn = $("#login-btn")

let inputs = [$("#username"), $("#password")]

inputs.forEach((input) => {
    input.on("keypress", (e) => {
        if (e.which == 13) {
            loginBtn.trigger("click")
        }
    })
})

loginBtn.on("click", () => {
    if (username == "" && password == "") {
        return
    }

    $.ajax({
        type: "POST",
        url: 'http://localhost:8080/signup',
        data: {
            username: username.val(),
            password: password.val()
        },
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
