const mongoose = require('mongoose')
mongoose
  .connect("mongodb://localhost:27017/MyDb", {useNewUrlParser: true, useUnifiedTopology: true})
  .then((result) => {
    console.log('mongoose running')
  })
  .catch((err) => {
    //app.listen(8080);
    console.log(err);
  });
