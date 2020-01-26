const mysqlConnection = require("../config/connection");

const uuidv4 = require('uuid/v4');
const joi = require("joi");

// Using bcrypt to hash the password and store in the databse
const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.post_bills = async (req, res) => {

    const bill = req.body;

    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''   // split the base64 code to get username and password
    const strauth = new Buffer(b64auth, 'base64').toString()                // convert the base64 encode to string
    const splitIndex = strauth.indexOf(':')                                 // split the index to get emailAdress and password
    const email_address = strauth.substring(0, splitIndex)
    const password = strauth.substring(splitIndex + 1)

    if (!email_address || !password) {
        return res.status(400).send({ error: true, message: 'Please provide email address or password' });
    }

    mysqlConnection.query("select * from users where email_address = ?", email_address, function (err, results) {
        if (err) {
            //console.log(err);
            res.status(400).send({message: "Provide valid email address"});
        }
        else {
            if (results.length == 0) {
                res.status(400).send({message: "Email address does not exist"});
            }
            else {
                const result = bcrypt.compareSync(password, results[0].password);               // compare the hashed password with password provided
                if (!result) return res.status(401).send({message: 'Password not valid!'});

                mysqlConnection.query("INSERT INTO bills(id, created_ts, updated_ts, owner_id, vendor, bill_date, due_date, amount_due, paymentStatus) VALUES (?,?,?,?,?,?,?,?,?) ", [uuidv4(), new Date().toISOString().split('T')[0]+' '+ new Date().toTimeString().split(' ')[0] , new Date().toISOString().split('T')[0]+' '+ new Date().toTimeString().split(' ')[0] , results[0].id, bill.vendor, bill.bill_date, bill.due_date, bill.amount_due, bill.paymentStatus], (err, rows, fields) => {
                    if (!err)
                    res.status(201).send({message: "New bill has been created"});
                    else
                    res.status(400).send({message: "Error inserting new bill"});

                })
            }
        }
    });
};

exports.get_bills = (req, res) => {

    console.log(req.params.id)
    
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
            res.status(400).send({message: "Provide valid email address"});
        }
        else {
            if (results.length == 0) {
                res.status(400).send({message: "Email address does not exist"});
            }
            else {
                console.log(results[0].id);
                const result = bcrypt.compareSync(password, results[0].password);               // compare the hashed password with password provided
                if (!result) return res.status(401).send({message: 'Password not valid! Not authorized'});

                const owner_id = results[0].id;
                mysqlConnection.query("select * from bills where ? in (select ? from bills where id = ?)", [owner_id,owner_id,req.params.id], (err, results) => {
                    if (results.length > 0)
                        res.send({ results });
                    else
                        res.status(404).send({message: "Bill not found"});

                })
            }
        }
    });
};

exports.get_all_bills = (req, res) => {
    
    mysqlConnection.query("select * from bills ", (err, rows, fields) => {
        if (!err)
            res.send({ rows });
        else
            res.status(400);

    });
};

exports.update_bills = (req, res) => {
    res.send({message : "Bill update"})
};