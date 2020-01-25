var express = require('express');
var router = express.Router();

const UserController = require("../controllers/user");

// User details
router.get('/', UserController.get_user);


// Add a new user  
router.post('/', UserController.post_user);


// Update user details
router.put('/', UserController.update_user);


// //Delete a user
// router.delete('/', (req, res) => {

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

module.exports = router;