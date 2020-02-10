const mysqlConnection = require("../config/connection");
const Bill = require("../models/bills");
const User = require("../models/user");
const File = require("../models/file");
const uuidv4 = require('uuid/v4');
var fs = require('fs');
var dir = __dirname + "/uploads/";

// Using bcrypt to hash the password and store in the databse
const bcrypt = require("bcrypt");

// middleare to stroe files on the server
const formidable = require('formidable');


// Post a bill for a user
exports.post_file = async (req, res) => {

    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''   // split the base64 code to get username and password
    const strauth = new Buffer(b64auth, 'base64').toString()                // convert the base64 encode to string
    const splitIndex = strauth.indexOf(':')                                 // split the index to get emailAdress and password
    const email_address = strauth.substring(0, splitIndex)
    const password = strauth.substring(splitIndex + 1)

    if (!email_address || !password) {
        return res.status(401).send({ error: true, message: 'Please provide email address or password' });
    }

    // check if user exists
    User.findOne({
        where: {
            email_address: email_address
        }
    }).then((result) => {
        if (result.length == 0) { // false if author already exists and was not created.
            return res.status(400).send({ message: "Email does not exists" })
        }

        const pass_result = bcrypt.compareSync(password, result['password']);               // compare the hashed password with password provided
        if (!pass_result) return res.status(401).send({ message: 'Password not valid!' });

        const billId = req.baseUrl.substring(9, 45);
        const user_id = result['id'];
        const file_owner = result['email_address']

        // Find if the bill exists, if not throw an error saying it does not exists
        Bill.findOne({
            where: {
                id: billId
            }
        }).then((result) => {
            if (result.lenth == 0) {
                return res.status(400).send({ message: 'Bill not found' })
            }

            // check if the bill is associated with the user
            Bill.findOne({
                where: {
                    id: billId,
                    owner_id: user_id
                }
            }).then((result) => {
                const form = new formidable.IncomingForm();                     // form to handle upload of file
                form.parse(req, function (err, fields, files) {
                    var oldpath = files.files.path;
                    if (!fs.existsSync(dir)){                                   // check if the uploads directory exists
                        fs.mkdirSync(dir);
                    }
                    var newpath = __dirname + "/uploads/" + files.files.name;
                    if(!fs.existsSync(newpath)){
                        
                        const uuid = uuidv4();
                        const fileinfo = "file_name: " + files.files.name + ";id: " + uuid + ";upload_date: " + new Date().toISOString().split('T')[0] + ";url: " + newpath ;
                        File.create({
                            id: uuid,
                            bill_id: billId,
                            file_name: files.files.name,
                            url: newpath,
                            file_owner: file_owner,
                            size: files.files.size

                        }).then(() => {
                            fs.rename(oldpath, newpath, function (err) {
                                if (err) throw err;
                                res.status(201).send({ message: 'File uploaded' })
                            });

                        })
                        .catch((err => { return res.status(400).send({ message: 'Error uploading file' }) }))

                        Bill.update({
                            attachment: fileinfo
                            
                        },{
                            where: {
                                id: billId,
                                owner_id: user_id
                            }
                        }).then()
                        .catch((err) => { return res.status(400).send({message: "Error updating a bill"})})
                    }
                    else {
                        res.status(400).send({message: 'File already Present'});
                    }
                    
                });
            })
            .catch(err => { return res.status(401).send({ message: 'Bill cannot be seen' }) })
        })
        .catch(err => { return res.status(400).send({ message: 'Bill not found' }) })
    })
    .catch(err => { console.log(err); return res.status(400).send({ message: 'Email does not exists' }) })

};


// Fetchfile information based on the bill ID and the user
exports.get_file = (req, res) => {

    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''   // split the base64 code to get username and password
    const strauth = new Buffer(b64auth, 'base64').toString()                // convert the base64 encode to string
    const splitIndex = strauth.indexOf(':')                                 // split the index to get emailAdress and password
    const email_address = strauth.substring(0, splitIndex)
    const password = strauth.substring(splitIndex + 1)

    if (!email_address || !password) {
        return res.status(401).send({ error: true, message: 'Please provide email address or password' });
    }

    // check if user exists
    User.findOne({
        where: {
            email_address: email_address
        }
    }).then((result) => {
        if (result.length == 0) { // false if author already exists and was not created.
            return res.status(400).send({ message: "Email does not exists" })
        }

        const pass_result = bcrypt.compareSync(password, result['password']);               // compare the hashed password with password provided
        if (!pass_result) return res.status(401).send({ message: 'Password not valid!' });

        const billId = req.baseUrl.substring(9, 45);
        const user_id = result['id'];
        const file_owner = result['email_address'];

        // Find if the bill exists, if not throw an error saying it does not exists
        Bill.findOne({
            where: {
                id: billId
            }
        }).then((result) => {
            if (result.length == 0) {
                return res.status(400).send({ message: 'Bill not found' })
            }

            // check if the bill is associated with the user
            Bill.findOne({
                where: {
                    id: billId,
                    owner_id: user_id
                }
            }).then((result) => {
                File.findOne({
                    where: {
                        id: req.params.fileId
                    }
                }).then((result) => {
                    // console.log(result.size)
                    if (result == null) {
                        return res.status(400).send({ message: 'File info not found' })
                    }

                    File.findOne({
                        where: {
                            id: req.params.fileId,
                            bill_id: billId,
                            file_owner: file_owner
                        }
                    }).then((result) => {
                        res.status(200).send({id: result['id'], file_name: result['file_name'], upload_date: result['createdAt'], url: result['url']});
                    })
                    .catch((err) => { return res.status(401).send({ message: 'File Info cannot be seen' }) })
                })
                .catch((err) => { console.log(err); return res.status(400).send({ message: 'Error finding file info' }) })
            })
            .catch(err => { return res.status(401).send({ message: 'Bill cannot be seen' }) })
        })
        .catch(err => { return res.status(400).send({ message: 'Bill not found' }) })
    })
    .catch(err => { console.log(err); return res.status(400).send({ message: 'Email does not exists' }) })

};


// Update a bill based on the bill ID and user
exports.update_file = (req, res) => {

    const bill = req.body;

    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''   // split the base64 code to get username and password
    const strauth = new Buffer(b64auth, 'base64').toString()                // convert the base64 encode to string
    const splitIndex = strauth.indexOf(':')                                 // split the index to get emailAdress and password
    const email_address = strauth.substring(0, splitIndex)
    const password = strauth.substring(splitIndex + 1)

    if (!email_address || !password) {
        return res.status(401).send({ error: true, message: 'Please provide email address or pssword' });
    }

    User.findOne({
        where: {
            email_address: email_address
        }
    }).then((result) => {
        // console.log(result['password']);
        if (result.length == 0) { // false if author already exists and was not created.
            return res.status(400).send({ message: "Email does not exists" })
        }

        const pass_result = bcrypt.compareSync(password, result['password']);               // compare the hashed password with password provided
        if (!pass_result) return res.status(401).send({ message: 'Password not valid!' });

        const user_id = result['id'];
        console.log(user_id);

        Bill.findOne({
            where: {
                id: req.params.id
            }
        }).then((result) => {

            if (result.lenth == 0) {
                return res.status(400).send({ message: 'Bill not found' })
            }

            Bill.destroy({
                where: {
                    id: req.params.id,
                    owner_id: user_id
                }

            }).then((result) => {
                console.log(result)
                if (result == 0) {
                    return res.status(401).send({ message: 'Bill cannot be deleted' })
                }

                return res.status(204).send()
            })
                .catch(err => { console.log(err); return res.status(400).send({ message: 'Error deleting bill' }) })
        })
            .catch(err => { return res.status(400).send({ message: 'Bill not found' }) })
    })
        .catch(err => { return res.status(400).send({ message: 'Email does not exists' }) })
};