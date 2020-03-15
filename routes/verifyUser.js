var model = require('../config/dbconnect');
var jwt = require('jsonwebtoken');
var constants = require('../constant/constant');
var secretKey = constants.jwtSecretKey.secret;

var verifyUserOtp = function (req, res) {
    console.log(req.query)

    var type = req.query.type;
    var email = req.query.email;
    var otp = req.query.otp;
    var token = req.query.token;

    if (type != null && email != null && otp != null && token != null) {
        var otpQuery;

        //Teacher
        if (type == "1") { 
            otpQuery = 'SELECT teachers.Name,teachers_otp.OTP'
                + ' FROM teachers INNER JOIN teachers_otp'
                + ' ON teachers.ID = teachers_otp.Teacher' 
                + ' WHERE teachers.Email = "' + email + '"';
        }
        //Student
        else if (type == "2") {
            otpQuery = 'SELECT students.Name,students_otp.OTP'
                + ' from students INNER JOIN students_otp'
                + ' ON students.ID = students_otp.Student'
                + ' WHERE students.Email = "' + email + '"';
        }
        //parent
        else if (type == "3") {  
            otpQuery = 'SELECT parents.FatherName,parents_otp.OTP'
                + ' FROM parents INNER JOIN parents_otp'
                + ' ON parents.ID = parents_otp.Parent'
                + ' WHERE parents.Email = "' + email + '"';

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
                                //Teacher
                                if (type == "1") { 

                                    queryUserData = 'SELECT classes.ClassName, classes.ID as ClassId, teachers.ID as TeacherId, teachers.Email, teachers.Name, teachers.Mobile, teachers.Gender,'
                                    +' teachers.Address, teachers.Experience, teachers.subject, teachers.Qualification, teachers.ProfilePic, teachers.DocPic, teachers.JoinDate'
                                        + ' FROM classes INNER JOIN teachers ON classes.ID = teachers.Class WHERE teachers.Email = "' + email + '"';

                                }
                                 //Student
                                else if (type == "2") {
                   
                                    queryUserData = 'SELECT classes.ClassName, classes.ID as ClassId, students.ID as StudentId, students.Email, students.Name, students.Mobile, students.Gender,'
                                        + ' students.DOB, students.ProfilePic, students.BloodGroup, students.JoinDate'
                                        + ' `classes` INNER JOIN `class_students` ON `classes`.ID = `class_students`.ClassId  INNER JOIN students ON students.ID = class_students.StudentId WHERE students.Email = "' + email + '"';
                                }
                                //parent
                                else if (type == "3") { 

                                    queryUserData = 'SELECT classes.ClassName, classes.ID as ClassId, parents.ID as ParentId, parents.FatherName, parents.MotherName,'
                                        + ' parents.Mobile, parents.Email, parents.Address, parents.JoinDate'
                                        + ' FROM `classes` INNER JOIN `class_parents`'
                                        + ' ON `classes`.ID = `class_parents`.ClassId'
                                        + ' INNER JOIN parents ON parents.ID = class_parents.ParentId'
                                        + ' WHERE `parents`.Email = "' + email + '"';
                                }

                                connection.query(queryUserData, function (err, selectedRows) {
                                    if (err) {
                                        console.log(err);
                                        res.send(JSON.stringify({ error: true, message: 'Error Occurred with query' }));
                                    }
                                    else {
                                        if (selectedRows.length > 0) {

                                            var insertTokenQuery, id, changeMailstatusQuery;
                                            //Teacher
                                            if (type == "1") { 
                                                id = selectedRows[0].TeacherId
                                                insertTokenQuery = 'INSERT INTO teachers_token(Teacher,Token) VALUES (?,?) ON DUPLICATE KEY UPDATE Token=?'
                                                changeMailstatusQuery = 'UPDATE teachers SET IsVerifiedMail="true" where ID=?';
                                            }
                                            //Student
                                            else if (type == "2") { 
                                                id = selectedRows[0].StudentId
                                                insertTokenQuery = 'INSERT INTO students_token(Student,Token) VALUES (?,?) ON DUPLICATE KEY UPDATE Token=?'
                                                changeMailstatusQuery = 'UPDATE students SET IsVerifiedMail="true" where ID=?';
                                            }
                                            //parent
                                            else if (type == "3") {  
                                                id = selectedRows[0].ParentId
                                                insertTokenQuery = 'INSERT INTO parents_token(Parent,Token) VALUES (?,?) ON DUPLICATE KEY UPDATE Token=?'
                                                changeMailstatusQuery = 'UPDATE parents SET IsVerifiedMail="true" where ID=?';
                                            }


                                            connection.query(changeMailstatusQuery, [id], function (err, rows) {

                                                if (err) {
                                                    res.status(500);
                                                    res.send(JSON.stringify({ error: true, message: err.message }));

                                                } else {

                                                        connection.query(insertTokenQuery, [id, token, token], function (err, rows) {

                                                            if (err) {
                                                                res.status(500);
                                                                res.send(JSON.stringify({ error: true, message: err.message }));

                                                            } else {

                                                                if (rows.affectedRows > 0) {
                                                                    let token = jwt.sign({ email: selectedRows[0].Email }, secretKey, {})

                                                                    res.send(JSON.stringify({ error: false, message: "User login succssfully", teacherDetails : selectedRows, token: token }));
                                                                }

                                                            }
                                                        });
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