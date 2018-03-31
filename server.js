require('dotenv').config()
const Mustache = require('mustache');
const nodemailer = require('nodemailer');
const fs = require('fs');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'peterringelmann@gmail.com',
        pass: 'ngpgrksmwccunxmj'
    }
});

const express = require('express')
const app = express()

app.use(express.json());
app.use(express.urlencoded());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/', (req, res) => {
    const { name, email, token, message, phone } = req.body;
    if (token != process.env.TOKEN || phone !== '') {
        res.send('Not authorized' + token + phone);
        return;
    }

    var message_data = {
        name,
        email,
        message
    };

    fs.readFile('template.html', function (err, data) {
        if (err) throw err;
        var output = Mustache.render(data.toString(), message_data);

        console

        const mailOptions = {
            from: process.env.SEND_ADDRESS, // sender address
            to: process.env.RECEIVE_ADDRESS, // list of receivers
            subject: 'You got a new message from ' + name + '!', // Subject line
            html: output
        };

        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(err)
            }
            else {
                console.log(info);
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ sendstatus: 1 }));
            }
        });
    });



})



app.listen(3000, () => console.log('Example app listening on port 3000!'))

