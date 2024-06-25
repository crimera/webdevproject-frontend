import $ from "jquery"
import { isLoggedIn } from "./utils"

async function checkPriviledge(username) {
    let result = await $.ajax({
        method: "POST",
        url: 'http://localhost:8080/isAdmin',
        data: {
            username: username
        }
    })

    return result != ""
}

isLoggedIn().then((res) => {
    if (res) {
        checkPriviledge(res).then((isAdmin) => {
            if (!isAdmin) {
                window.location.href = "hero.html"
            }
        })
    }
})

$.ajax({
    method: "POST",
    url: 'http://localhost:8080/getHistoryData',
    success: (res) => {
        console.log(res)

        let history = JSON.parse(res)

        let rows = []
        history.forEach((user) => {
            let summary = []
            user.item.transcript.forEach((i) => {
                summary.push(i.caption)
            })
            summary = summary.join().slice(0, 40)

            rows.push(newView("tr", [
                newView("td", [], { innerHTML: user.id }),
                newView("td", [], { innerHTML: user.item.name }),
                newView("td", [], { innerHTML: summary }),
                newView("td", [], { innerHTML: "<button class=\"btn\">Delete</button>" }),
            ]))
        })

        let usersTbl = newView("table", [
            newView("thead", [
                newView("th", [], { innerHTML: "Id" }),
                newView("th", [], { innerHTML: "File" }),
                newView("th", [], { innerHTML: "Transcript" }),
                newView("th", [], { innerHTML: "" }),
            ]),
            newView("tbody", rows)
        ])

        $("#history").append(usersTbl)
    }
})

$.ajax({
    method: "POST",
    url: 'http://localhost:8080/getUsersData',
    success: (res) => {
        console.log(res)

        let users = JSON.parse(res)

        let rows = []
        users.forEach((user) => {

            rows.push(newView("tr", [
                newView("td", [], { innerHTML: user.id }),
                newView("td", [], { innerHTML: user.email }),
                newView("td", [], { innerHTML: user.username }),
                newView("td", [], { innerHTML: (user.admin) ? "true" : "false" }),
                newView("td", [
                    newView("button", [], {
                        innerHTML: "Ban",
                        classList: "btn",
                        onClick: (e) => {
                            let id = e.target.parentNode.parentNode.children[0].innerHTML
                            // ban user
                        }
                    })
                ]),
                newView("td", [],),
            ]))
        })

        let usersTbl = newView("table", [
            newView("thead", [
                newView("th", [], { innerHTML: "Id" }),
                newView("th", [], { innerHTML: "Email" }),
                newView("th", [], { innerHTML: "Username" }),
                newView("th", [], { innerHTML: "Admin" }),
                newView("th", [], { innerHTML: "" }),
            ]),
            newView("tbody", rows)
        ])

        $("#users").append(usersTbl)
    }
})

function newView(view, children, opts) {
    let node = document.createElement(view)

    if (opts) {
        if (opts.innerHTML) { node.innerHTML = opts.innerHTML }
        if (opts.classList) { node.classList = opts.classList }

        if (opts.onClick) {
            node.addEventListener('click', (e) => {
                opts.onClick(e)
            })
        }
    }

    if (children) {
        children.forEach((i) => {
            node.appendChild(i)
        })
    }

    return node
}
