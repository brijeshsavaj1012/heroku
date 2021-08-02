const mongoose = require('mongoose')
mongoose
  .connect("mongodb+srv://lets_help:SXWJl2Dyn43toCZX@cluster0.roshd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority/user", {useNewUrlParser: true, useUnifiedTopology: true})
  .then((result) => {
    console.log('mongoose running')
  })
  .catch((err) => {
    //app.listen(8080);
    console.log(err);
  });
