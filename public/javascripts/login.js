

/*
let socket = io();

$(function () {
   // $("#loginButton").click(function (e) {
      //  e.preventDefault()
    $('form').submit(function () {
        console.log('function called');
        const _email = $('#username').val()
        console.log(_email);
        const _password = $('#password').val()
        console.log(_password);

        let data = {
            email: _email,
            password: _password
        }
        socket.emit('login', JSON.stringify(data));
        return false;   // if not returning false page is new loaded
    })
})
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
                "url": "http://localhost:8080/login",
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json"
                },
                "processData": false,
                "data": JSON.stringify(data)
            }

            $.ajax(settings).done(function (response) {
                if (response.status == 200) {
                    console.log("login was successful")
                    console.log(response.data)
                    localStorage.setItem("token", response.data)
                    window.location.href = "index.html"
                } else {
                    console.log('connection was not successfull');
                    alert("khabaret")
                }
            })
        }
    );
})