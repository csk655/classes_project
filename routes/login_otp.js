var model = require('../config/dbconnect');
var constants = require('../constant/constant')
var mailOptions = constants.mailOptions;

var loginOtp = function (req, res) {

    var type = req.query.type;
    var email = req.query.email;

    if (type != null && email != null ) {

        var query;

        if (type == "1") { //Teacher
            query = 'select t_id from teacher_details where t_email = "' + email + '" AND t_status="Active"';

        } else if (type == "2") { //Student
            query = 'select student_id from student_details where student_email="' + email + '" AND student_status="Active"'; 

        } else if (type == "3") {  //parent
            query = 'select parent_id from parent where email="' + email + '" AND parent_status="Active"';

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
                                id = selectedRows[0].t_id
                                updateOtp = 'UPDATE teacher_details SET OTP=? where t_id=?';

                            } else if (type == "2") {
                                id = selectedRows[0].student_id
                                updateOtp = 'UPDATE student_details SET OTP=? where student_id=?';

                            } else if (type == "3") {
                                id = selectedRows[0].parent_id
                                updateOtp = 'UPDATE parent SET OTP=? where parent_id=?';
                            }

                            
                            var otp = Math.floor(100000 + Math.random() * 900000)

                            mailOptions.to = email;
                            mailOptions.subject = "Hi welcome Please verify your email ! ";
                            mailOptions.text = `Your OTP is ${otp}`;

                            constants.transporter.sendMail(mailOptions, function (error, info) {
                                    if (error) {
                                        console.log(error);
                                        res.send(JSON.stringify({ error: true, message: "Something went wrong ! Not able to send mail" }));
                                    } else {
                                        console.log('Email sent: ' + info.response);

                                        connection.query(updateOtp, [otp, id], function (err, rows) {

                                            if (err) {
                                                res.status(500);
                                                res.send(JSON.stringify({ error: true, message: "OTP sent but can't update table column "+err.message }));

                                            } else {
                                                res.send(JSON.stringify({ error: false, message: "Success ! Please check your email for OTP verification" }));
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




module.exports = { loginOtp };

