var model = require('../config/dbconnect');
var jwt = require('jsonwebtoken');
var constants = require('../constant/constant');
var secretKey = constants.jwtSecretKey.secret;

var verifyUserOtp = function (req, res) {

    var type = req.query.type;
    var email = req.query.email;
    var otp = req.query.otp;
    var token = req.query.token;

    if (type != null && email != null && otp != null && token != null) {
        var otpQuery;
        if (type == "1") { //Teacher
            otpQuery = 'select OTP from teacher_details where t_email = "' + email + '"';
        } else if (type == "2") { //Student
            otpQuery = 'select OTP from student_details where student_email="' + email + '"';
        } else if (type == "3") {  //parent
            otpQuery = 'select OTP from parent where email="' + email + '"';
        } else {
            res.send(JSON.stringify({ error: true, message: 'Wrong user type' }));
            return;
        }

        model(function (err, connection) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {

                connection.query(otpQuery, function (err, selectedRows) {
                    if (err) {
                        console.log(err);
                        res.send(JSON.stringify({ error: true, message: 'Error Occurred with query' }));
                    }
                    else {
                        if (selectedRows.length > 0) {

                            if (selectedRows[0].OTP == otp) {

                                var queryUserData; 
                                if (type == "1") { //Teacher
                                    queryUserData = 'select t_id,t_full_name,t_mobile_no,t_gender,t_dob,t_email,t_address,t_experience, t_subject, t_high_qualification,'
                                        + 't_profile_pic, t_blood_group from teacher_details where t_email = "' + email + '"';
                                } else if (type == "2") { //Student
                                    queryUserData = 'select student_id,student_name,student_mobile_no,student_dob,student_standard_id,batch,student_email,student_profile_pic,'
                                        + 'student_blood_group from student_details where student_email="' + email + '"';
                                } else if (type == "3") {  //parent
                                    queryUserData = 'select parent_id,father_name,mother_name,mobile_no,email,address'
                                        + ' from parent where email="' + email + '"';
                                }

                                connection.query(queryUserData, function (err, selectedRows) {
                                    if (err) {
                                        console.log(err);
                                        res.send(JSON.stringify({ error: true, message: 'Error Occurred with query' }));
                                    }
                                    else {
                                        if (selectedRows.length > 0) {

                                            var updateTokenMailstatusQuery, id;
                                            if (type == "1") { //Teacher
                                                id = selectedRows[0].t_id
                                                updateTokenMailstatusQuery = 'UPDATE teacher_details SET t_token=?,isVerifiedMail="true" where t_id=?';
                                            } else if (type == "2") { //Student
                                                id = selectedRows[0].student_id
                                                updateTokenMailstatusQuery = 'UPDATE student_details SET student_token=?,isVerifiedMail="true" where student_id=?';
                                            } else if (type == "3") {  //parent
                                                id = selectedRows[0].parent_id
                                                updateTokenMailstatusQuery = 'UPDATE parent SET token=?,isVerifiedMail="true" where parent_id=?';
                                            }


                                            connection.query(updateTokenMailstatusQuery, [token, id], function (err, rows) {

                                                if (err) {
                                                    res.status(500);
                                                    res.send(JSON.stringify({ error: true, message: err.message }));

                                                } else {
                                                    let token = jwt.sign({ email: selectedRows[0].email }, secretKey, {})

                                                    res.send(JSON.stringify({ error: false, message: "User login succssfully", result: selectedRows, token: token }));
                                                }
                                            });

                                          
                                        } else {
                                            res.send(JSON.stringify({ error: true, message: "User or email not exists" }));
                                        }
                                    }
                                });


                            } else {
                                res.send(JSON.stringify({ error: true, message: "You have entered wrong OTP. Please check email and verify !" }));
                            }

                        } else {
                            res.send(JSON.stringify({ error: true, message: "User or email not exists" }));
                        }
                    }
                });
                connection.release();

            }
        });

    } else {
        return res.send(JSON.stringify({ error: true, message: "email, otp, token can not be null" }));
    }
}




module.exports = { verifyUserOtp };