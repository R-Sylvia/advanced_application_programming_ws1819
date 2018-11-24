var bodyParser = require('body-parser')
var webtoken = require('./webtoken')

exports.build = function (app) {
  return {
    start: () => {
      app.use(function (req, res, next) {
        readyToAuthenticate = false
        const authHeader = req.get('Authorization')      
        if (authHeader) {
          const parts = authHeader.split(' ')
          if (parts.length >= 2) {            
            readyToAuthenticate = true
          }
        }
        if (readyToAuthenticate) {
          const token = authHeader.split(' ')[1]
          webtoken.verify(token, (result) => {          
          if (result) {
            req.token = {
              isAuthenticated: true,
              id: result.id
            }
          } else {
            req.token = {
              isAuthenticated: false,
              id: -1
            }
          }
          next() 
        }        
      )
      }
      else {
        req.token = {
          isAuthenticated: false,
          id: -1
        }
        next()
      }       
        
      })
      app.use(bodyParser.urlencoded({
                  extended: true
                })
            )

      app.use(bodyParser.json())
    }
  }
}
