import { lock } from "./utils"
import $ from "jquery"

lock()

$("#logout-btn").on("click", () => {
    $.ajax({
        method: "POST",
        url: 'http://localhost:8080/logout'
    })

    window.location.reload()
})

