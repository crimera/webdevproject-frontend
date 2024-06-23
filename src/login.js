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
        url: 'http://localhost:8080/login',
        data: {
            username: username.val(),
            password: password.val()
        },
        success: (res) => {
            if (res == "") {
                loginFailed()
                return
            }

            // TODO: do something when logged in, redirect to index.html
            console.log(res)
            window.location.href = "history.html"
        }
    })
})

function loginFailed() {
    // TODO: show login failed error
    console.log("failed")
}
