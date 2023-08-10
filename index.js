const express = require('express');
const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(
    'mongodb://mongo:27017/docker-node-mongo',
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const schema_mongoose = require('mongoose');

const EmployeeSchema = schema_mongoose.Schema(
  {
    empid: { type: Number },
    name: { type: String },
    emailid: { type: String },
  },
  {
    timestamps: true
  }
);

EmpModel = schema_mongoose.model('emp_collection', EmployeeSchema);

/*
{
  "eid":500,
  "ename":"Sachin",
  "eemail":"a@gmail.com"
}
*/

app.post('/add', (req, res) => {
  const newEmp = new EmpModel({
    empid: req.body.eid,
    name: req.body.ename,
    emailid: req.body.eemail
  }); //CLOSE EmpModel
  //INSERT/SAVE THE RECORD/DOCUMENT
  newEmp.save()
    .then(inserteddocument => res.status(200).send('DOCUMENT INSERED IN MONGODB DATABASE'))
});

app.get('/viewall', (req, res) => {
  EmpModel.find({})
    .then(emps => res.send(emps))
    .catch(err => res.status(404).json({ msg: 'No items found' }));
});

app.get('/search/:eid', (req, res) => {
  // "empid" : parseInt(req.params.empid) Convert empid String to Int
  EmpModel.find({ "empid": parseInt(req.params.eid) })
    .then(getsearchdocument => {
      if (getsearchdocument.length > 0) {
        res.send(getsearchdocument);
      }
      else {
        return res.status(404).send({ message: "Note not found with id " + req.params.empid });
      }
    }) //CLOSE THEN
    .catch(err => {
      return res.status(500).send({ message: "DB Problem..Error in Retriving with id " + req.params.empid });
    })//CLOSE CATCH
}//CLOSE CALLBACK FUNCTION BODY
);//CLOSE GET METHOD

//EmpModel.deleteMany
app.delete('/remove/:eid', (req, res) => {
  EmpModel.findOneAndRemove({ "empid": parseInt(req.params.eid) })
    .then(deleteddocument => {
      if (deleteddocument != null) {
        res.status(200).send('DOCUMENT DELETED successfully!' + deleteddocument);
      }
      else {
        res.status(404).send('INVALID EMP ID ' + req.params.empid);
      }
    }) //CLOSE THEN
    .catch(err => {
      return res.status(500).send({ message: "DB Problem..Error in Delete with id " + req.params.empid });
    })//CLOSE CATCH
}//CLOSE CALLBACK FUNCTION BODY
); //CLOSE Delete METHOD

const port = 3000;
app.listen(port, () => console.log('Server running at port no 3000'));
