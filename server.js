
const express = require("express");
const bodyParser = require("body-parser");
const mysqlConnection = require("./config/connection");
const userRouter = require("./routes/user");

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/user', userRouter);

// //Delete a user
// app.delete('/user/:email', (req, res) => {

//     // let user = req.body;
//     // let emailAddress = req.body.emailAddress;

//     // if (!user) {
//     //     return res.status(400).send({ message: 'Please provide user' });
//     // }

//     // mysqlConnection.query("select * from users where emailAddress = ?",emailAddress,function(err, result){
//     //     if(err){
//     //         console.log(err);
//     //     } 
//     //     else
//     //     {
//     //         console.log(result.length)
//     //         if(result.length <= 0){  
//     //             res.status(400).send({message:"Email does not exist"});
//     //         }
//     //         else {
//     //             mysqlConnection.query("Delete from users where emailAddress = ?", emailAddress, (err, rows, fields) => {
//     //                 if (error)  res.send(error);
//     //                 return res.status(200).send({ message: 'User has been deleted successfully.' });

//     //             })
//     //         }
//     //     }
//     // });

//     let emailAddress = req.body.emailAddress;

//     if (!emailAddress) {
//         return res.status(400).send({ error: true, message: 'Please provide emailAddress' });
//     }

//     mysqlConnection.query("Delete from users where emailAddress = ?", emailAddress, (err, rows, fields) => {
//         if (!err)
//             res.send(({ message: 'User has been deleted.' }));
//         else
//             res.send({ message: "No user" })

//     })
// });

// app.listen(3000);
app.listen(3000)

module.exports = app;