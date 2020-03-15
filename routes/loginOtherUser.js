var model = require('../config/dbconnect');
var constants = require('../constant/constant')
var mailOptions = constants.mailOptions;

var loginOtherUser = function (req, res) {
    console.log(req.query)

    var type = req.query.type;
    var email = req.query.email;

    if (type != null && email != null ) {

        var query;

        //Teacher
        if (type == "1") { 
            
            query = 'SELECT `teachers`.ID, `classes`.ClassName'
                + ' FROM `classes` INNER JOIN `teachers`'
                + ' ON `classes`.ID = `teachers`.Class '
                + ' WHERE `classes`.Email = "' + email + '" AND `teachers`.Status="Active"';
        }
        //Student
        else if (type == "2") { 
 
            query = 'SELECT `students`.ID, `classes`.`ClassName`'
                + ' FROM `classes` INNER JOIN`class_students`'
                + ' ON `classes`.ID = `class_students`.ClassId'
                + ' INNER JOIN students ON students.ID = class_students.StudentId'
                + ' WHERE `students`.`Email`= = "' + email + '" AND `students`.Status="Active"';
        }
        //parent
        else if (type == "3") {  
 
            query = 'SELECT `parents`.ID, `classes`.ClassName'
                + ' FROM `classes` INNER JOIN `class_parents`'
                + ' ON `classes`.ID = `class_parents`.ClassId'
                + ' INNER JOIN parents ON parents.ID = class_parents.ParentId'
                + ' WHERE `parents`.`Email` = "' + email + '" AND `parents`.Status = "Active"';

        } else {
            res.send(JSON.stringify({ error: true, message: 'Wrong user type' }));
            return;
        }

        model(function (err, connection) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {
                connection.query(query, function (err, selectedRows) {
                    if (err) {
                        console.log(err);
                        res.send(JSON.stringify({ error: true, message: 'Error Occurred with query' }));
                    }
                    else {
                        if (selectedRows.length > 0) {

                            var id,updateOtp;

                            if (type == "1") {
                                id = selectedRows[0].ID
                                updateOtp = 'INSERT INTO teachers_otp(Teacher,OTP) VALUES(?,?) ON DUPLICATE KEY UPDATE OTP=?';

                            } else if (type == "2") {
                                id = selectedRows[0].ID
                                updateOtp = 'INSERT INTO students_otp(Student,OTP) VALUES(?,?) ON DUPLICATE KEY UPDATE OTP=?';

                            } else if (type == "3") {
                                id = selectedRows[0].ID
                                updateOtp = 'INSERT INTO parents_otp(Parent,OTP) VALUES(?,?) ON DUPLICATE KEY UPDATE OTP=?';
                            }

                            
                            var otp = Math.floor(100000 + Math.random() * 900000)

                            mailOptions.to = email;
                            mailOptions.subject = `Hi welcome to ${selectedRows[0].ClassName} Please verify your email ! `;
                            mailOptions.text = `Your OTP is ${otp}`;

                            constants.transporter.sendMail(mailOptions, function (error, info) {
                                    if (error) {
                                        console.log(error);
                                        res.send(JSON.stringify({ error: true, message: "Something went wrong ! Not able to send mail" }));
                                    } else {
                                        console.log('Email sent: ' + info.response);

                                        connection.query(updateOtp, [id, otp, otp], function (err, rows) {

                                            if (err) {
                                                res.status(500);
                                                res.send(JSON.stringify({ error: true, message: "OTP sent but can't update table column "+err.message }));
                                            } else {
                                                if (rows.affectedRows > 0) {
                                                    res.send(JSON.stringify({ error: false, message: "Success ! Please check your email for OTP verification" }));
                                                } else {
                                                    res.send(JSON.stringify({ error: true, message: "Something went wrong!"}));
                                                }
                                            }
                                        });
                                    }
                            });

                        } else {
                            res.send(JSON.stringify({ error: true, message: "User not exists or inactive status" }));
                        }

                    }
                });
                connection.release();
            }
        });

    } else {
        return res.send(JSON.stringify({ error: true, message: "type,email,password can not be null" }));
    }
}




module.exports = { loginOtherUser };

