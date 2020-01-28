const mysqlConnection = require("../config/connection");

const uuidv4 = require('uuid/v4');
const joi = require("joi");

// Using bcrypt to hash the password and store in the databse
const bcrypt = require("bcrypt");
const saltRounds = 10;

// Post a bill for a user
exports.post_bills = async (req, res) => {

    const bill = req.body;

    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''   // split the base64 code to get username and password
    const strauth = new Buffer(b64auth, 'base64').toString()                // convert the base64 encode to string
    const splitIndex = strauth.indexOf(':')                                 // split the index to get emailAdress and password
    const email_address = strauth.substring(0, splitIndex)
    const password = strauth.substring(splitIndex + 1)

    if (!email_address || !password) {
        return res.status(401).send({ error: true, message: 'Please provide email address or password' });
    }

    if(!bill.vendor || !bill.bill_date || !bill.due_date || !bill.amount_due || !bill.paymentStatus){
        return res.status(400).send({ error: true, message: 'One or more fields are not provided to create' });
    }

    mysqlConnection.query("select * from users where email_address = ?", email_address, function (err, results) {
        if (err) {
            //console.log(err);
            res.status(400).send({ message: "Provide valid email address" });
        }
        else {
            if (results.length == 0) {
                res.status(400).send({ message: "Email address does not exist" });
            }
            else {
                const result = bcrypt.compareSync(password, results[0].password);               // compare the hashed password with password provided
                if (!result) return res.status(401).send({ message: 'Password not valid!' });

                const uuid = uuidv4();
                mysqlConnection.query("INSERT INTO bills(id, created_ts, updated_ts, owner_id, vendor, bill_date, due_date, amount_due, paymentStatus) VALUES (?,?,?,?,?,?,?,?,?) ", [uuid, new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0], new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0], results[0].id, bill.vendor, bill.bill_date, bill.due_date, bill.amount_due, bill.paymentStatus], (err, rows, fields) => {
                    if (!err) {
                        mysqlConnection.query("select * from bills where id = ?",uuid, (err, rows, fields) => {
                            if (!err)
                                res.status(201).send({ rows });
                            else
                                res.status(400);

                        });
                        //res.status(201).send({ message: "New bill has been created" });
                       
                    }
                    else
                        res.status(400).send({ message: "Error inserting new bill" });

                })
            }
        }
    });
};

// Fetch a bill based on the bill ID and the user
exports.get_bills = (req, res) => {

    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''   // split the base64 code to get username and password
    const strauth = new Buffer(b64auth, 'base64').toString()                // convert the base64 encode to string
    const splitIndex = strauth.indexOf(':')                                 // split the index to get emailAdress and password
    const email_address = strauth.substring(0, splitIndex)
    const password = strauth.substring(splitIndex + 1)

    if (!email_address || !password) {
        return res.status(401).send({ error: true, message: 'Please provide email address or pssword' });
    }

    mysqlConnection.query("select * from users where email_address = ?", email_address, function (err, results) {
        if (err) {
            //console.log(err);
            res.status(400).send({ message: "Provide valid email address" });
        }
        else {
            if (results.length == 0) {
                res.status(400).send({ message: "Email address does not exist" });
            }
            else {
                const result = bcrypt.compareSync(password, results[0].password);               // compare the hashed password with password provided
                if (!result) return res.status(401).send({ message: 'Password not valid! Not authorized' });

                const owner_id = results[0].id;
                mysqlConnection.query("select * from bills where owner_id = ? and id = ?", [owner_id, req.params.id], (err, results) => {
                    if (results.length > 0)
                        res.send(results);
                    else
                        res.status(404).send({ message: "Bill not found" });

                })

                // Update it later once confirmed
                // mysqlConnection.query("select * from bills where id = ?", req.params.id ,(err, results) => {

                //     if(results.length>0){
                //         mysqlConnection.query("select * from bills where owner_id = ? and id = ?", [owner_id, req.params.id], (err, results) => {
                //             if (results.length > 0)
                //                 res.send(results);
                //             else
                //                 res.status(401).send({ message: "Not authorized to see bill" });
        
                //         })
                //     }
                //     else
                //         res.status(404).send({ message: "Bill not found" });
                // })
            }
        }
    });
};

// Get all bills in the table
exports.get_all_bills = (req, res) => {

    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''   // split the base64 code to get username and password
    const strauth = new Buffer(b64auth, 'base64').toString()                // convert the base64 encode to string
    const splitIndex = strauth.indexOf(':')                                 // split the index to get emailAdress and password
    const email_address = strauth.substring(0, splitIndex)
    const password = strauth.substring(splitIndex + 1)

    if (!email_address || !password) {
        return res.status(401).send({ error: true, message: 'Please provide email address or pssword' });
    }

    mysqlConnection.query("select * from users where email_address = ?", email_address, function (err, results) {
        if (err) {
            //console.log(err);
            res.status(400).send({ message: "Provide valid email address" });
        }
        else {
            if (results.length == 0) {
                res.status(400).send({ message: "Email address does not exist" });
            }
            else {
                const result = bcrypt.compareSync(password, results[0].password);               // compare the hashed password with password provided
                if (!result) return res.status(401).send({ message: 'Password not valid! Not authorized' });

                const owner_id = results[0].id;
                mysqlConnection.query("select * from bills where owner_id = ?", owner_id, (err, results) => {
                    if (results.length > 0)
                        res.send(results);
                    else
                        res.status(404).send({ message: "Bills not found" });

                })

                // Update it later once confirmed
                // mysqlConnection.query("select * from bills where id = ?", req.params.id ,(err, results) => {

                //     if(results.length>0){
                //         mysqlConnection.query("select * from bills where owner_id = ? and id = ?", [owner_id, req.params.id], (err, results) => {
                //             if (results.length > 0)
                //                 res.send(results);
                //             else
                //                 res.status(401).send({ message: "Not authorized to see bill" });
        
                //         })
                //     }
                //     else
                //         res.status(404).send({ message: "Bill not found" });
                // })
            }
        }
    });
};

// Update a bill based on the bill ID and user
exports.update_bill = (req, res) => {
   
    const bill = req.body;

    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''   // split the base64 code to get username and password
    const strauth = new Buffer(b64auth, 'base64').toString()                // convert the base64 encode to string
    const splitIndex = strauth.indexOf(':')                                 // split the index to get emailAdress and password
    const email_address = strauth.substring(0, splitIndex)
    const password = strauth.substring(splitIndex + 1)

    if (!email_address || !password) {
        return res.status(401).send({ error: true, message: 'Please provide email address or pssword' });
    }

    if(!bill.vendor || !bill.bill_date || !bill.due_date || !bill.amount_due || !bill.paymentStatus){
        return res.status(400).send({ error: true, message: 'One or more fields are not provided for update' });
    }

    mysqlConnection.query("select * from users where email_address = ?", email_address, function (err, results) {
        if (err) {
            //console.log(err);
            res.status(400).send({ message: "Provide valid email address" });
        }
        else {
            if (results.length == 0) {
                res.status(400).send({ message: "Email address does not exist" });
            }
            else {
                const result = bcrypt.compareSync(password, results[0].password);               // compare the hashed password with password provided
                if (!result) return res.status(401).send({ message: 'Password not valid! Not authorized' });

                const owner_id = results[0].id;
                mysqlConnection.query("select * from bills where id = ?", req.params.id ,(err, results) => {
                    if(results.length > 0){
                        mysqlConnection.query("Update bills set updated_ts = ?, vendor = ?, bill_date = ?, due_date = ?, amount_due = ?, paymentStatus = ? where id = ? and owner_id = ?", [new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0], bill.vendor, bill.bill_date, bill.due_date, bill.amount_due, bill.paymentStatus, req.params.id, owner_id], (err, rows, fields) => {
                            if (!err && rows.length>0) {
                                mysqlConnection.query("select * from bills where id = ? and owner_id = ?",[req.params.id, owner_id], (err,results) => {
                                    if (!err && results.length>0)
                                        res.status(200).send({ results });
                                    else
                                        res.status(400);
    
                                });
                            
                            }
                            else
                                res.status(401).send({ message: "Not authorized to upate the bill" });
    
                        })
                    }
                    else
                        res.status(404).send({ message: "Bill not found" });
                   
                })
            }
        }
    });
};

// Delete a bill based on the bill ID and user
exports.delete_bill = (req, res) => {
   
    const bill = req.body;

    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''   // split the base64 code to get username and password
    const strauth = new Buffer(b64auth, 'base64').toString()                // convert the base64 encode to string
    const splitIndex = strauth.indexOf(':')                                 // split the index to get emailAdress and password
    const email_address = strauth.substring(0, splitIndex)
    const password = strauth.substring(splitIndex + 1)

    if (!email_address || !password) {
        return res.status(401).send({ error: true, message: 'Please provide email address or pssword' });
    }

    mysqlConnection.query("select * from users where email_address = ?", email_address, function (err, results) {
        if (err) {
            //console.log(err);
            res.status(400).send({ message: "Provide valid email address" });
        }
        else {
            if (results.length == 0) {
                res.status(400).send({ message: "Email address does not exist" });
            }
            else {
                const result = bcrypt.compareSync(password, results[0].password);               // compare the hashed password with password provided
                if (!result) return res.status(401).send({ message: 'Password not valid! Not authorized' });

                const owner_id = results[0].id;
                mysqlConnection.query("select * from bills where id = ?", req.params.id ,(err, results) => {
                    if(results.length > 0){
                        mysqlConnection.query("Delete from bills where id = ? and owner_id = ?", [req.params.id, owner_id], (err, rows, fields) => {
                            if (!err)
                                res.status(204).send({ message: "Deleted bill" });
                            else
                                res.status(401).send({ message: "Not authorized to delete the bill" });
    
                        })
                    }
                    else
                        res.status(404).send({ message: "Bill not found" });
                   
                })
            }
        }
    });
};