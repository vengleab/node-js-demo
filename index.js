const express = require('express');
const app = express();
const path = require('path');
const userRoute = require('./routes/users');
const env = require('dotenv').config()
const helmet = require('helmet')
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

app.use(helmet())


app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile)
app.use(cookieParser())
app.use(csrf({cookie: true}))

app.use(function (req, res, next) {
  var token = req.csrfToken();
  res.cookie('XSRF-TOKEN', token);
  res.cookie('_csrf', token);
  res.locals.csrfToken = token;
  next();
});

console.log("Environment", process.env.PORT)
console.log("Env", env.parsed)

app.use("*", function (req, res, next){
  //logger.info();
  next();
})

function auth(req, res, next){
  const token = req.token;
  console.log("requesting users");
  if(token=='login') {
     return next()
  } else {
    next("Unauthorized")
  }
  
}


app.use("/users", auth, userRoute);

// app.get("/users", function(req, res){
//   connection.connect()

//   connection.query('SELECT * FROM USERS', function (err, rows, fields) {
//     if (err) throw err
//     console.log('The solution is: ', rows)
//     res.send(rows)
//   })

//   connection.end()
// })



app.use(express.urlencoded({extended: true})) // form data
app.use(express.json()) // rest api
app.use("/resource",express.static(path.resolve("./public"))) // static resource

app.get('/', function(req, res){
  // res.sendFile(path.resolve('./views/index.html'))
  res.render('index.html')
})

// manual expose static resource
// app.get('/public/index.css', function(req, res){
//   res.sendFile(path.resolve('./public/styles/index.css'))
// })

app.post('/:id', function(req, res){
  console.log("body",req.body);
  console.log("query",req.query);
  console.log("paras", req.params)
  res.send({"data":"value"})
} )

app.post('*', function(req, res){
  res.send("home")
} )


// app.use("*", function (error, req, res, next){
//   console.log("")
//   // write 
//   // if(error instanceof StringError){
//   //   //logger.stringerr();
//   // }

//   // reposne front-end
//   res.status(500)
//   res.send('Intercept')
// })

app.listen(8080, function(){
  console.log('App listen to port 8080')
})