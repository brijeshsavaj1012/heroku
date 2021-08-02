const mongoose = require('mongoose')
mongoose
  .connect("mongodb+srv://lets_help:SXWJl2Dyn43toCZX@cluster0.roshd.mongodb.net/user?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true})
  .then((result) => {
    return('mongoose running');
  })
  .catch((err) => {
    //app.listen(8080);
    console.log(err);
  });
