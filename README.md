# advanced_application_programming_ws1819
Project of course "Advanced Application Programming" at FH-Kiel in wintersemester 2018/19

To run the application and play the game, follow the steps beneath:

1.	Download Node.js as the runtime environment for providing JavaScript code to server and client
2.	Download MongoDB as an opensource database
3.	Clone or download the master branch from the GitHub repository
4.	Go in the folder “public/javascripts/” and change the IP addresses in the following files to your local IP address:
  a.	game.js line 99 ("url": "http://xxx.xxx.xxx.xxx:8080/username",)
  b.	login.js line 26 ("url": "http://xxx.xxx.xxx.xxx:8080/login",)
  c.	menu.js line 19 ("url": "http://xxx.xxx.xxx.xxx:8080/logout",)
  d.	registration.js line 27 ("url": "http://xxx.xxx.xxx.xxx:8080/register",)
5.	Go in the folder “bin/” and execute the www.js file via the command line call “node www”

Now you can connect to the server by entering the servers IP address (which should be your local IP address if you want to run the server on your computer) and port (8080). Example: "http://xxx.xxx.xxx.xxx:8080”

The manual for the actual game can be found on the website (Menu page -> Manual or Footer -> Help).

If the server is not responding, the installed firewall may block the communication inside your network. Try to switch the firewall off and start the server again. All clients and the server have to run on the same network.
