import { lock, getUser, logOut } from "./utils"
import $ from "jquery"

lock()

getUser().then((username) => {
    $("#username").text(username)
})

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

let script = []
let count = 0
let filename = null

function addTranscript(transcript) {
    script.push(transcript)
    let time = transcript.start.split(":")

    let transcriptNode = document.querySelector("#transcript")

    let content = document.createElement("p")
    content.innerHTML = `
    <div class="transcript">
        <button id="time">${time[1]}:${time[2]}</button>
        <p id="${count++}" class="content">${transcript.caption}</p>
        <button id="edit" class="edit">Edit</button>
    </div>
    `

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

function downloadString(text, fileType, fileName) {
    var blob = new Blob([text], { type: fileType });

    var a = document.createElement('a');
    a.download = fileName;
    a.href = URL.createObjectURL(blob);
    a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function() { URL.revokeObjectURL(a.href); }, 1500);
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

$("#add-btn").on("click", () => {
    console.log("add clicked")
    $("#myModal").css("display", "block")
})

window.onclick = function(event) {
    let modal = document.getElementById("myModal")
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

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
