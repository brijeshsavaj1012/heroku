const mongoose = require('mongoose')
mongoose
  .connect("mongodb+srv://brijesh:savaj1234@cluster0.roshd.mongodb.net/user?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true})
  .then((result) => {
    return('mongoose running');
  })
  .catch((err) => {
    //app.listen(8080);
    console.log(err);
  });
