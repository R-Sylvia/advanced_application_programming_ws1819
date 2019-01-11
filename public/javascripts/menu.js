/**
 * Client side script for menu page.
 * @date 01.11.2018
 * @author Sylvia Reißmann
 */


/**
 * Eventhandler for click on button "logout"
 * @author Sylvia
 */
$("#btn_logout").click(function() {
    console.log("button logout clicked")

    var settings = {
        "async": true,
        "crossDomain": true,
        //"url": "http://192.168.178.20:8080/logout",    // Home
        "url": "http://192.168.20.13:8080/logout",   // Home2
        //"url": "http://149.222.154.38:8080/logout", // FH
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        },
        "processData": false
    }

    $.ajax(settings).done(function (response) {
        if (response.status == 200) {
            console.log("ok")
            window.location.href = "login.html"
        } else {
            console.log('something wentwrong here');
            alert("something broke")
        }
    })
});

/**
 * Eventhandlers for other buttons in menu.
 * Changing location in this file instead of menu.html to keep the possibility to add functionality to button clicks.
 */

$("#btn_play").click(function() {
    window.location.href = "game.html"
});

$("#btn_scoreboard").click(function() {
    console.log("button scorebord clicked")
});

$("#btn_help").click(function() {
    window.location.href = "help.html"
});