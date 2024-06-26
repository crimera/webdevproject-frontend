import $ from "jquery"


export async function isLoggedIn() {
    let result = await $.ajax({
        type: "POST",
        url: 'http://localhost:8080/check',
    })

    console.log(result)

    return result != ""
}


export async function getUser() {
    let result = await $.ajax({
        type: "POST",
        url: 'http://localhost:8080/check',
    })

    console.log(result)

    return result
}

export function lock() {
    isLoggedIn().then((result) => {
        if (!result) {
            window.location.href = "login.html"
        }
    })
}

export function logOut() {
    $.ajax({
        method: "POST",
        url: 'http://localhost:8080/logout'
    })

    window.location.reload()

}

export function banned() {
    $("#myModal").css("display", "block")
}

export function delteHistoryItem(id) {
    $.ajax({
        method: "POST",
        url: 'http://localhost:8080/delHistory',
        data: {
            id: id
        },
        success: (res) => {
            if (res == "") {
                console.log("Delete failed")
                return
            }

            console.log(res)
            window.location.reload()
        }
    })
}
