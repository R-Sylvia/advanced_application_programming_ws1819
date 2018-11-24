

var objectpeople = [

    {      username: "DAM",
           password: "Ara"
            
    },
    
    {      username: "Saeed",
           password: "Aghaai"
    
    },
    
    {      username: "Rouz",
           password: "Raf"
    
    }
    ]
     function getinfo() {
    
         var username = document.getElementById("username").value
         var password = document.getElementById("password").value
    
          for (i = 0; i < objectpeople.length; i++) {
             if (username == objectpeople[i].username && password == objectpeople[i].password) {
                 console.log(username + "is logged in !!!")
                 alert(username + "is logged in !!!");
                 return
              } 
              else{
                console.log("incorrect username or password")
              }
              
          }
     }
