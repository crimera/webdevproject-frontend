import { lock, logOut, getUser } from "./utils"
import $ from "jquery"

lock()

getUser().then((username) => {
    $("#username").text(username)
})

$("#logout-btn").on("click", () => {
    logOut()
})

