import { lock, getUser, logOut, downloadString } from "./utils"
import $, { ajax, event, removeData } from "jquery"

lock()

getUser().then((username) => {
    $("#username").text(username)
})

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

let script = []
let count = 0
let filename = null

function goToTimestamp(item) {
    console.log(item)
}

function addTranscript(transcript) {
    script.push(transcript)
    let start = transcript.start.split(":")
    let end = transcript.end.split(":")

    let transcriptNode = document.querySelector("#transcript")

    let content = document.createElement("div")
    content.innerHTML = `
    <div class="transcript">
        <button id="time" class="flex">
            <div class="flex flex-col lg:flex-row gap-1">
                <p>
                    ${start[1]}:${start[2]}
                </p>
                <p class="lg:block hidden">
                    -
                </p>
                <p>
                    ${end[1]}:${end[2]}
                </p>
            </div>
        </button>
        <p id="${count++}" class="content">${transcript.caption}</p>
        <button id="edit" class="edit">Edit</button>
    </div>
    `
    content.querySelector("button").addEventListener("click", () => {
        let index = content.querySelector("p.content").id * 1
        let timestamp = timeToSeconds(script[index].start) + 0.1
        preview.currentTime = timestamp
    })

    transcriptNode.appendChild(content)
    //scrollBottom(transcriptNode)
}

function tsToSrt(script) {

    let srt = []

    script.forEach((item, index) => {
        let start = item.start.split(":")
        let end = item.end.split(":")
        let startMillis = start.pop()
        let endMillis = end.pop()

        let time = `${start.join(":")},${startMillis} --> ${end.join(":")},${endMillis}`
        srt.push(`${index + 1}\n${time}\n${item.caption}`)
    })

    return srt.join('\n\n')
}

function fileToSrt(name) {
    let i = name.lastIndexOf('.')
    let fname = name.slice(0, i)
    return `${fname}.srt`
}

function saveToHistory(script) {
    const jason = {
        name: filename,
        transcript: script
    }

    $.ajax({
        method: "POST",
        url: 'http://localhost:8080/editHistory',
        data: {
            id: id,
            transcript: JSON.stringify(jason)
        }
    })
}

$("#save-btn").on("click", () => {
    console.log("done")
    saveToHistory(script)
})

/**
* Need to explain the purpose of X here.
* @type {HTMLDialogElement}
*/
let addDialog = document.getElementById("myModal")

$("#add-btn").on("click", () => {

    let currentTime = preview.currentTime
    if (currentTime) {
        addCaptionForm.querySelector("input[name=start]").value = formatTime(currentTime)
        addCaptionForm.querySelector("input[name=end]").value = formatTime(currentTime + 1)
    }

    console.log(script)

    addDialog.showModal()
})


addDialog.addEventListener('click', (e) => {
    addDialog.close()
});

addDialog.children[0].addEventListener("click", (event) => {
    event.stopPropagation()
})

let exportBtn = document.getElementById("exportBtn")
exportBtn.addEventListener('click', () => {
    let srt = tsToSrt(script)

    console.log(srt)

    downloadString(srt, "text/plain", fileToSrt(filename))
})

$.ajax({
    method: "POST",
    url: 'http://localhost:8080/getHistoryItem',
    data: {
        id: id
    },
    success: (res) => {
        if (res == "") return;

        let item = JSON.parse(res)

        filename = item.item.name

        $("#filename").text(filename)

        item.item.transcript.forEach((e) => {
            addTranscript(e)
        })

        $("#preview").prop("src", `http://localhost:8080/vid.php?vid=${filename}`)

        var list = document.getElementsByClassName("transcript");
        for (let item of list) {
            console.log(item.classList.add("show"));
        }


        $(".edit").on("click", (e) => {
            let node = e.target

            let transcript = node.parentNode
            let content = transcript.children[1]

            if (node.textContent == "Edit") {
                let input = document.createElement("input")
                input.id = content.id
                input.value = content.textContent.trim()
                transcript.replaceChild(input, content)

                input.focus()

                node.textContent = "Done"
                return
            }

            if (node.textContent == "Done") {
                let i = Number(content.id)
                script[i].caption = content.value

                let input = document.createElement("p")
                input.id = content.id
                input.textContent = content.value
                transcript.replaceChild(input, content)

                node.textContent = "Edit"
                return
            }
        })

        console.log(item)
    }
})

$("#logout-btn").on("click", () => {
    logOut()
})

function timeToSeconds(timeString) {
    let split = timeString.split(":")

    let hour = Number(split[0]) * 3600
    let minute = Number(split[1]) * 60
    let second = Number(split[2])
    let millis = Number(split[3]) / 1000

    return hour + minute + second + millis
}

function formatTime(seconds) {
    const date = new Date(seconds * 1000);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const secondsFormatted = date.getUTCSeconds().toString().padStart(2, '0');
    const millis = (seconds + "").split(".")[1].slice(3).padStart(3, '0')

    return `${hours}:${minutes}:${secondsFormatted}:${millis}`;
}

$("#preview").on("timeupdate", (e) => {
    let time = e.target.currentTime
    script.forEach((i, index) => {
        let start = timeToSeconds(i.start)
        let end = timeToSeconds(i.end)

        if (time >= start && time <= end) {
            document.getElementById("transcript").children[index].children[0].classList.add("current")
        } else {
            document.getElementById("transcript").children[index].children[0].classList.remove("current")
        }
    })
})

let addCaptionForm = document.getElementById("addCaption-form")
/** @type {HTMLVideoElement} **/
let preview = document.getElementById("preview")

addCaptionForm.addEventListener("submit", (e) => {
    e.preventDefault()


    let formData = new FormData(e.target)
    let object = {
        start: formData.get("start"),
        end: formData.get("end"),
        caption: formData.get("caption"),
    }

    let i = 0
    let found = false;
    script.forEach((item, index) => {
        if (timeToSeconds(object.start) < timeToSeconds(item.start) && !found) {
            i = index
            found = true
        }
    })

    addCaption(i, object)
})

function addCaption(index, object) {
    script.splice(index, 0, object)

    saveToHistory(script)
    window.location.reload()
}
