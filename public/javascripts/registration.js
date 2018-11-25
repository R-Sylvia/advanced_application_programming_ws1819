


$(function () {
    $("#registerButton").click(function (e) {
            e.preventDefault()
            var _email = $("#email").val()
            var _password = $("#password").val()
            var data = {
                email: _email,
                password: _password
            }

            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "http://localhost:8080/register",
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json"
                },
                "processData": false,
                "data": JSON.stringify(data)
            }

            $.ajax(settings).done(function (response) {
                if(response.status == 201){
                    window.location.href = "login.html"
                }
            })
        }
    );
})