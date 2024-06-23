import $ from "jquery"
import { lock, logOut } from "./utils"

lock()

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
                summary += `${transcript.caption}. `
            })

            let basename = i.item.name.split(".")[0]

            console.log(basename)

            $("#historyContainer").append(`
                <div class="historyItem flex px-4 hover:bg-gray-50 py-2 items-center justify-between">
                    <div class="flex items-center">
                        <img crossorigin="anonymous" src="http://localhost:8080/thumb.php?img=${basename}.jpg"
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

        $(".delete-btn").each((_, button) => {
            button.addEventListener("click", () => {
                console.log(button.id)
            })
        })
    }
})

$("#logout-btn").on("click", () => {
    logOut()
})
