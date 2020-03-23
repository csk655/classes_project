var model = require('../config/dbconnect');


var addStudentAlreadyParent = function (req, res) {

    console.log(req.body);

    var profileUrl;
    var class_id = parseInt(req.body.classId);
    var parent_id = parseInt(req.body.parentId);
    var student_name = req.body.studentName;
    var mobile_no = req.body.mobileNo;
    var gender = req.body.gender;
    var dob = req.body.dob;
    var standard_id = req.body.standardId;
    var batch = req.body.batchId;
    var email = req.body.email;
    var blood_group = req.body.bloodGroup;
    var joining_date = new Date();
    var updated_date = new Date();

    var paths = req.files.map(file => {
        profileUrl = file.filename;
    });

    if (class_id != null && student_name != null && mobile_no != null && gender != null && dob != null && standard_id != null
        && batch != null && email != null && blood_group != null && joining_date != null && updated_date != null && profileUrl != null) {

        model(function (err, connection) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {

                /* Begin transaction */
                connection.beginTransaction(function (err) {
                    if (err) { throw err; }


                    connection.query('SELECT students.ID, students.Email from students INNER JOIN class_students ON students.ID = class_students.StudentId WHERE students.Email = ? AND class_students.ClassId = ?', [email, class_id], function (err, result) {

                        if (err) {
                            connection.rollback(function () {
                                connection.release();
                                res.send(JSON.stringify({ error: true, message: err.message }));
                                throw err;
                            });
                        }

                        if (result.length > 0) {
                            connection.release();
                            res.send(JSON.stringify({ error: true, message: "Student already exists" }));
                        } else {
                            //Insert the New data
                            connection.query('INSERT INTO students(Name, Mobile, Gender, DOB, Email, ProfilePic, BloodGroup, JoinDate, UpdateDate) VALUES(?,?,?,?,?,?,?,?,?)',
                                [student_name, mobile_no, gender, dob, email, profileUrl, blood_group, joining_date, updated_date], function (err, result) {

                                    if (err) {
                                        connection.rollback(function () {
                                            connection.release();
                                            res.send(JSON.stringify({ error: true, message: err.message }));
                                            throw err;
                                        });
                                    }

                                    var studentId = parseInt(result.insertId);
                                    console.log(`Student id is ${studentId}`)

                                    connection.query('INSERT INTO students_detail(Student, Standard, Batch) VALUES(?,?,?)', [studentId, standard_id, batch], function (err, result) {
                                            if (err) {
                                                connection.rollback(function () {
                                                    connection.release();
                                                    res.send(JSON.stringify({ error: true, message: err.message }));
                                                    throw err;
                                                });
                                            }

                                            connection.query('INSERT INTO parent_students(ParentId, StudentId) VALUES(?,?)', [parent_id, studentId], function (err, result) {
                                                    if (err) {
                                                        connection.rollback(function () {
                                                            connection.release();
                                                            res.send(JSON.stringify({ error: true, message: err.message }));
                                                            throw err;
                                                        });
                                                    }


                                                    connection.query('INSERT INTO class_students(StudentId,ClassId) VALUES(?,?)', [studentId, class_id], function (err, result) {
                                                            if (err) {
                                                                connection.rollback(function () {
                                                                    connection.release();
                                                                    res.send(JSON.stringify({ error: true, message: err.message }));
                                                                    throw err;
                                                                });
                                                            }

                                                            connection.commit(function (err) {
                                                                if (err) {
                                                                    connection.rollback(function () {
                                                                        connection.release();
                                                                        res.send(JSON.stringify({ error: true, message: err.message }));
                                                                        throw err;
                                                                    });
                                                                } else {
                                                                    connection.release();
                                                                    res.send(JSON.stringify({ error: false, message: "Student register successfully!" }));
                                                                }

                                                            });
                                                        });
                                                });

                                        });
                                });
                        }
                    });
                });

            }
        });

    } else {
        return res.send(JSON.stringify({ error: true, message: "class_id, student_name, mobile no, gender and other fields can not be null" }));
    }
}

module.exports = { addStudentAlreadyParent };
