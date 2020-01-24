
const express = require("express");
const bodyParser = require("body-parser");
const mysqlConnection = require("./connection");
const router = require("./routes/user");
// var auth = require('basic-auth');
// var compare = require('tsscmp');
// const jwt = require('jsonwebtoken');
// const SECRET_KEY = "secretkey23456";

const uuidv4 = require('uuid/v4');
const joi = require("joi");

// Using bcrypt to hash the password and store in the databse
const bcrypt = require("bcrypt");
const saltRounds = 10;

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Get users
app.get('/user', (req, res) => {


    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''   // split the base64 code to get username and password
    const strauth = new Buffer(b64auth, 'base64').toString()                // convert the base64 encode to string
    const splitIndex = strauth.indexOf(':')                                 // split the index to get emailAdress and password
    const email_address = strauth.substring(0, splitIndex)
    const password = strauth.substring(splitIndex + 1)

    if (!email_address || !password) {
        return res.status(400).send({ error: true, message: 'Please provide email address or pssword' });
    }

    mysqlConnection.query("select * from users where email_address = ?", email_address, function (err, results) {
        if (err) {
            //console.log(err);
            res.status(400).send("Provide valid email address");
        }
        else {
            if (results.length == 0) {
                res.status(400).send("Email address does not exist");
            }
            else {
                const result = bcrypt.compareSync(password, results[0].password);               // compare the hashed password with password provided
                if (!result) return res.status(401).send({message: 'Password not valid!'});

                // mysqlConnection.query("select email_address, first_name, last_name from users where email_address = ?", email_address, (err, rows, fields) => {
                //     if (!err)
                //         res.send({ rows });
                //     else
                //         console.log(err);

                // })

                mysqlConnection.query("select id, email_address, first_name, last_name, account_created, account_updated from users where email_address = ?", email_address, (err, rows, fields) => {
                    if (!err)
                        res.send({ rows });
                    else
                        console.log(err);

                })
            }
        }
    });
});


// Add a new user  
app.post('/user', async (req, res) => {

    let user = req.body;
    let email_address = req.body.email_address;

    // schema to check for email and password validation
    const schema = joi.object().keys({
        email_address: joi.string().trim().email().required(),
        password: joi.string().regex(/[a-zA-Z0-9]{5,30}/).required(),
        first_name: joi.string(),
        last_name: joi.string()
    });

    //console.log(schema);

    if (!user) {
        return res.status(400).send({ message: 'Please provide user' });
    }

    //console.log(uuid.v4());

    mysqlConnection.query("select * from users where email_address = ?", email_address, function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            if (result.length > 0) {
                res.status(400).send({ message: "Email already exists" });
            }
            else {
                if (req.body.account_created || req.body.account_updated) {
                    res.status(400).send({message : 'account created or updated field cannot be set'});

                }
                else {
                    // check if password meets requirements
                    joi.validate(req.body, schema, (err, result) => {
                        if (err) {
                            //console.log(err);
                            res.status(400).send({message: 'Email or Password does not meet requirements'});
                        }
                        else {
                            
                            // bcrypt.hash(user.password, saltRounds, function (err, hash) {
                            //     mysqlConnection.query("INSERT INTO users(email_address, first_name, last_name, password, account_created, account_updated) VALUES (?,?,?,?,?,?) ", [ user.email_address, user.first_name, user.last_name, hash, new Date().toISOString().split('T')[0]+' '+ new Date().toTimeString().split(' ')[0] , new Date().toISOString().split('T')[0]+' '+ new Date().toTimeString().split(' ')[0]], function (error, results, fields) {
                            //         if (err) res.send(err);
                            //         return res.status(201).send({ message: 'New user has been created successfully.'});
                            //     });
                            // });

                            bcrypt.hash(user.password, saltRounds, function (err, hash) {
                                mysqlConnection.query("INSERT INTO users(id, email_address, first_name, last_name, password, account_created, account_updated) VALUES (?,?,?,?,?,?,?) ", [uuidv4(), user.email_address, user.first_name, user.last_name, hash, new Date().toISOString().split('T')[0]+' '+ new Date().toTimeString().split(' ')[0] , new Date().toISOString().split('T')[0]+' '+ new Date().toTimeString().split(' ')[0]], function (error, results, fields) {
                                    if (err) res.send(err);
                                    return res.status(201).send({ message: 'New user has been created successfully.'});
                                });
                            });
                        }

                    })
                }

            }
        }
    });
});


// Update user details
app.put('/user', (req, res) => {

    let user = req.body;

    const schema = joi.string().regex(/[a-zA-Z0-9]{5,30}/).required();

    //console.log(schema);

    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''   // split the base64 code to get username and password
    const strauth = new Buffer(b64auth, 'base64').toString()                // convert the base64 encode to string
    const splitIndex = strauth.indexOf(':')                                 // split the index to get emailAdress and password
    const email_address = strauth.substring(0, splitIndex)
    const password = strauth.substring(splitIndex + 1)

    if (!email_address || !password) {
        return res.status(400).send({ error: true, message: 'Please provide emailAddress or password to update' });
    }

    mysqlConnection.query("select * from users where email_address = ?", email_address, function (err, results) {
        if (err) {
            //console.log(err);
            res.status(400).send("Provided email address does not exist");
        }
        if(results.length == 0) res.status(400).send({message: "Provided email address does not exist"});

        else {
            const result = bcrypt.compareSync(password, results[0].password);
            if (!result) return res.status(401).send({message: 'Password not valid!'});
            joi.validate(req.body.password, schema, (err, result) => {
                if (err) {
                    //console.log(err);
                    res.status(400).send({message: 'password does not meet requirements'});
                }
                else {
                    if (req.body.account_created || req.body.account_updated || req.body.email_address) {
                        res.status(400).send({message: 'account created or updated or email address field cannot be updated'});
                    }
                    else {
                        if (req.body.first_name || req.body.last_name || req.body.password) {
                            res.status(400).send({message: 'One or more fields to be updated are not set'});
                        }

                        bcrypt.hash(user.password, saltRounds, function (err, hash) {
                            mysqlConnection.query("update users set first_name = ?, last_name = ?, password = ?, account_updated = ? where email_address = ?", [user.first_name, user.last_name, hash, new Date().toISOString().split('T')[0]+' '+ new Date().toTimeString().split(' ')[0], email_address], function (error, results, fields) {
                                if (error) res.send({message: "User can only update his/her records"});
                                return res.status(200).send({ message: 'The user has been updated successfully.'});
                            });
                        });
                    }
                }

            })
        }
    });
});


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

module.exports = app;