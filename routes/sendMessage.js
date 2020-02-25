var model = require('../config/dbconnect');
var FCM = require('fcm-node')
var constants = require('../constant/constant');
var fcm = new FCM(constants.server_key);

var message = constants.message

var sendMessage = function (req, res) {
    console.log(req.body);

    var class_id = parseInt(req.body.classId);
    var subject = req.body.subject;
    var description = req.body.description;
    var send_to = req.body.sendTo;
    var date = new Date();

    if (subject != null && class_id != null && description != null && send_to != null) {

        model(function (err, connection) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {

                connection.query('INSERT INTO admin_notification(class_id,n_subject,n_description,n_sent_to,n_date) VALUES(?,?,?,?,?)', [class_id, subject, description, send_to, date], function (err, rows) {

                    if (err) {
                        res.status(500);
                        res.send(JSON.stringify({ error: true, message: err.message }));
                    } else {

                        if (rows.affectedRows > 0) {

                            if (send_to != "All") {

                                send_to = send_to.split(',').map(el => {
                                    let n = Number(el);
                                    return n === 0 ? n : n || el;
                                });

                                connection.query('SELECT t_token from teacher_details where t_id in (?) AND class_id=? AND t_status="Active"',
                                    [send_to , class_id], function (err, rows) {
                                        if (err) {
                                            res.status(500);
                                            res.send(JSON.stringify({ error: true, message: err.message }));
                                        } else {

                                            if (rows.length > 0) {

                                                for (var i = 0; i < rows.length; i++) {
                                                    console.log(rows[i].t_token)

                                                    message.to = rows[i].t_token
                                                    message.data.title = subject
                                                    message.data.content = description;


                                                    fcm.send(message, function (err, response) {
                                                        if (err) {
                                                            console.log("Something has gone wrong! " + err);
                                                            //res.send(JSON.stringify({ error: false, message: "Data inserted. but Notitfication fail" }));

                                                        } else {
                                                            console.log("Successfully sent with response: ", response);
                                                            //res.send(JSON.stringify({ error: false, message: "Notitfication Success" }));
                                                        }
                                                    });

                                                }

                                                res.send(JSON.stringify({ error: false, message: "Success"}));

                                            } else {
                                                res.send(JSON.stringify({ error: true, message: "No Data found" }));
                                            }

                                        }
                                    });

                            } else {

                                //topic messaging
                                message.to = "/topics/"+class_id;
                                message.data.title = subject;
                                message.data.content = description;

                                fcm.send(message, function (err, response) {
                                    if (err) {
                                        console.log("Something has gone wrong! " + err);
                                        res.send(JSON.stringify({ error: false, message: "Success but Notitfication failed" }));

                                    } else {
                                        console.log("Successfully sent with response: ", response);
                                        res.send(JSON.stringify({ error: false, message: "Success and Notification sent" }));
                                    }
                                });

                            }

                        }
                    }
                });
                connection.release();
            }
        });

    } else {
        return res.send(JSON.stringify({ error: true, message: "class_id,subject,description,send_to can not be null" }));
    }

}

module.exports = { sendMessage }