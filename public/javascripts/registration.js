


$(function () {
    $('form').submit(function (e) {
            e.preventDefault()
            var _email = $('#username').val()
        console.log(_email)
            var _password = $('#password').val()
        console.log(_password)
            var _password2 = $('#password2').val()
        console.log(_password2)
            if (_password === _password2) {
                var data = {
                    email: _email,
                    password: _password
                }

                var settings = {
                    "async": true,
                    "crossDomain": true,
                    //"url": "http://192.168.178.20:8080/register",   // home
                    "url": "http://192.168.20.13:8080/login",   // Home2
                    //"url": "http://149.222.154.38:8080/register",  // FH
                    "method": "POST",
                    "headers": {
                        "Content-Type": "application/json"
                    },
                    "processData": false,
                    "data": JSON.stringify(data)
                }

                $.ajax(settings).done(function (response) {
                    if (response.status == 201) {
                        window.location.href = "login.html"
                    } else {
                        alert("Registration not possible!")
                    }
                })
            } else {
                alert("Password not confirmed!")
            }
        }
    );
})