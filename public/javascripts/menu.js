

// react on logout by deleting logged in info from session coockie (not implemented yet)


$(function () {
    // $("#loginButton").click(function (e) {
    $('form').submit(function (e) {
            console.log('function called');
            e.preventDefault()

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
        }
    );
})