import $ from "jquery"
import { getUser, lock, logOut, delteHistoryItem } from "./utils"

lock()

getUser().then((username) => {
    $("#username").text(username)
})

export function saveToHistory(script) {
    $.ajax({
        method: "POST",
        url: 'http://localhost:8080/save',
        data: {
            transcript: JSON.stringify(script)
        }
    })
}

$.ajax({
    method: "POST",
    url: 'http://localhost:8080/getHistory',
    success: (res) => {
        if (res == "") return;

        let history = JSON.parse(res)

        history.forEach((i) => {
            let summary = ""

            i.item.transcript.forEach((transcript) => {
                summary += `${transcript.caption} `
            })

            let basename = i.item.name.split(".")[0]

            console.log(basename)

            let image = `http://localhost:8080/thumb.php?img=${basename}.jpg`
            if (i.audio == "1") {
                image = "./musical-notes-outline.svg"
            }

            $("#historyContainer").append(`
                <div id=${i.id} class="historyItem flex px-4 hover:bg-gray-50 py-2 items-center justify-between">
                    <div class="flex items-center">
                        <img crossorigin="anonymous" src="${image}"
                            class="size-24 object-contain" alt="thumbnail">
                        <div class="mx-4 flex flex-col">
                            <h2 class="text-xl font-medium text-neutral-500">${i.item.name}</h2>
                            <div class="leading-6 h-[3em] overflow-hidden">
                                <p>${summary}</p>
                            </div>
                        </div>
                    </div>

                        <button id="${i.id}"
                        class="delete-btn inline-flex items-center justify-center p-2 hover:bg-gray-100 rounded-full hover:text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" class="ionicon fill-current size-8"
                            viewBox="0 0 512 512">
                            <path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
                                fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32" />
                            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                stroke-width="32" d="M320 320L192 192M192 320l128-128" />
                        </svg>
                    </button>
                </div>
            `)
        })

        $(".historyItem").each((_, item) => {
            item.addEventListener("click", (e) => {
                let tag = e.target.tagName
                if (tag == "BUTTON" || tag == "svg") {
                    return
                }

                window.location.href = `edit.html?id=${item.id}`
            })
        })

        $(".delete-btn").each((_, button) => {
            button.addEventListener("click", () => {
                delteHistoryItem(button.id)
            })
        })
    }
})

$("#logout-btn").on("click", () => {
    logOut()
})

