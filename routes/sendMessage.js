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
                var query = null
                if (send_to == "All") {
                    query = 'INSERT INTO classes_notification(Class, Subject, Description, SendTo, Date) VALUES("' + class_id + '","' + subject + '","' + description + '", "' + "All" + '" , "' + date +'")'
                } else {
                    query = 'INSERT INTO classes_notification(Class, Subject, Description, Date) VALUES("' + class_id + '","' + subject + '","' + description + '","' + date + '")'
                }

                connection.query(query, function (err, rows) {

                    if (err) {
                        res.status(500);
                        res.send(JSON.stringify({ error: true, message: err.message }));
                    } else {

                        if (rows.affectedRows > 0) {

                            var insertMessageId = parseInt(rows.insertId);

                            if (send_to != "All") {
                                send_to = send_to.split(',').map(el => {
                                    let n = Number(el);
                                    return n === 0 ? n : n || el;
                                });

                                connection.query('SELECT Token, Name FROM teachers INNER JOIN teachers_token'
                                    + ' ON teachers.ID = teachers_token.Teacher'
                                    + ' INNER JOIN class_teachers ON teachers.ID = class_teachers.TeacherId'
                                    + ' WHERE teachers.ID IN (?) AND class_teachers.ClassId =? AND teachers.Status = "Active"', [send_to, class_id], function (err, rows) { 

                                        if (err) {
                                            res.status(500);
                                            res.send(JSON.stringify({ error: true, message: err.message }));
                                        } else {

                                            if (rows.length > 0) {
                                                var teachersJson = {}
                                          
                                                for (var i = 0; i < rows.length; i++) {
                                                    console.log(rows[i].Token)

                                                    message.to = rows[i].Token
                                                    message.data.title = subject
                                                    message.data.content = description;

                                                    teachersJson["Teacher"+i] = rows[i].Name

                                                    fcm.send(message, function (err, response) {
                                                        if (err) {
                                                            console.log("Something has gone wrong! " + err);
                                                        } else {
                                                            console.log("Successfully sent with response: ", response);
                                                        }
                                                    });
                                                }

                                                connection.query('UPDATE classes_notification SET SendTo=? WHERE ID=?', [JSON.stringify(teachersJson),insertMessageId], function (err, rows) {

                                                    if (err) {
                                                        res.status(500);
                                                        res.send(JSON.stringify({ error: true, message: err.message }));
                                                    } else {
                                                        res.send(JSON.stringify({ error: false, message: "Success and Notification sent" }));
                                                    }
                                                });

                                            } else {
                                                res.send(JSON.stringify({ error: true, message: "No teacher data found to send notifications" }));
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
