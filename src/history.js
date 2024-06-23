import $ from "jquery"
import { lock } from "./utils"

lock()

$("#save-btn").on("click", () => {

    let data = {
        name: "Bruh",
        transcript: [
            { start: "00:00:00", end: "00:00:10", caption: "why are you doing this?" },
            { start: "00:00:20", end: "00:00:40", caption: "Just cause." }
        ]
    }

    $.ajax({
        method: "POST",
        url: 'http://localhost:8080/save',
        data: {
            transcript: JSON.stringify(data)
        }
    })
})
