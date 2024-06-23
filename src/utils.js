import $ from "jquery"


async function isLoggedIn() {
    let result = await $.ajax({
        type: "POST",
        url: 'http://localhost:8080/check',
    })

    console.log(result)

    return result != ""
}

export function lock() {
    isLoggedIn().then((result) => {
        if (!result) {
            window.location.href = "login.html"
        }
    })
}
