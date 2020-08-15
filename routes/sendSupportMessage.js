var model = require('../config/dbconnect');
var constants = require('../constant/constant');
var mailOptions = constants.mailOptions;


var sendSupport = function (req, res) {

    console.log(req.body);
    var class_id = parseInt(req.body.classId);
    var subject = req.body.subject;
    var description = req.body.description;
    var date = new Date();
    
    if (class_id != null && subject != null && description != null) {

        model(function (err, connection) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool'}));
            } else {

                connection.beginTransaction(function (err) {
                    if (err) { throw err; }

                    connection.query('INSERT INTO support(Class, Subject, Description, Date) VALUES(?,?,?,?)', [class_id, subject, description, date], function (err, rows) {
                      
                        if (err) {
                            connection.rollback(function () {
                                connection.release();
                                res.status(500);
                                res.send(JSON.stringify({ error: true, message: err.message }));
                                throw err;
                            });
                        } else {

                            if (rows.affectedRows > 0) {

                                mailOptions.to = "gharesagar80@gmail.com";
                                mailOptions.subject = subject;
                                mailOptions.text = description;

                                constants.transporter.sendMail(mailOptions, function (error, info) {
                                    if (error) {
                                        console.log(error);
                                        connection.rollback(function () {
                                            connection.release();
                                            res.status(500);
                                            res.send(JSON.stringify({ error: true, message: "Email couldn't be sent. Please try later"}));
                                            throw err;
                                        });
                                    } else {
                                        connection.commit(function (err) {
                                            if (err) {
                                                connection.rollback(function () {
                                                    connection.release();
                                                    res.send(JSON.stringify({ error: true, message: err.message }));
                                                    throw err;
                                                });
                                            } else {
                                                connection.release();
                                                console.log('Email sent: ' + info.response);
                                                res.send(JSON.stringify({ error: false, message: "Success! Mail has been sent to support team. We get back to you soon."}));
                                            }
                                        });

                                    }
                                });

                            }
                        }
                    });

                })            
            }
        });

    } else {
        return res.send(JSON.stringify({ error: true, message: "classId,subject,description can not be null" }));
    }
}



module.exports = { sendSupport };