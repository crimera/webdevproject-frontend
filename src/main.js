import $ from 'jquery'

$("#translate").on("click", () => {
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/history',
        success: function(res) {
            alert(res)
        }
    })
})
