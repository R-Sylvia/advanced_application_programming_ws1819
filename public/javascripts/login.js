/**
 * Client side script for login page.
 * @date 01.11.2018
 * @author Sylvia Reißmann
 * @author Damoon Arabali
 */


$(function () {
   // $("#loginButton").click(function (e) {
    $('form').submit(function (e) {
        console.log('function called');
            e.preventDefault()
            var _email = $("#username").val()
        console.log(_email);
            var _password = $("#password").val()
        console.log(_password);
            var data = {
                email: _email,
                password: _password
            }

            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "http://192.168.178.20:8080/login",    // Home
                //"url": "http://192.168.20.13:8080/login",   // Home2
                //"url": "http://149.222.154.38:8080/login", // FH
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json"
                },
                "processData": false,
                "data": JSON.stringify(data)
            }

            $.ajax(settings).done(function (response) {
                console.log('received response')
                if (response.status == 200) {
                    console.log("login was successful")
                    console.log(response.data)
                    localStorage.setItem("token", response.data)
                    window.location.href = "menu.html"
                } else {
                    console.log('connection was not successfull');
                    alert("Username or password not correct!")
                }
            })

        /*
        jQuery.ajax({
            url: '/menu',
            type: "GET",
            success: function(result){
                console.log('result: ' + result);
            },
            error: function(error){
                console.log('error: ' + error);
            }
        })*/
            //document.location = "http://192.168.178.20:8080/menu"
        }
    );
})