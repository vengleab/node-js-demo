const router = require("express").Router();


router.get("/", function(req, res){
  res.send("Users")
})

module.exports = router;