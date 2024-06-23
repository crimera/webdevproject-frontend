import { lock, logOut } from "./utils"
import $ from "jquery"

lock()

$("#logout-btn").on("click", () => {
    logOut()
})

