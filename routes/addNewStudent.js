var model = require('../config/dbconnect');


var addNewStudent = function (req, res) {

    console.log(req.body);

    var profileUrl;
    var class_id = parseInt(req.body.classId);
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
    var fees_structure_id = req.body.feesStructureId;

    //parent details
    var mother_name = req.body.motherName;
    var father_name = req.body.fatherName;
    var parent_mobileNo = req.body.parentMobileNo;
    var parent_email = req.body.parentEmail;
    var address = req.body.address;

    var paths = req.files.map(file => {
            profileUrl = file.filename;
    });

    if (class_id != null && student_name != null && mobile_no != null && gender != null && dob != null && standard_id != null && batch != null && email != null && blood_group != null && joining_date != null && updated_date != null
        && mother_name != null && father_name != null && parent_mobileNo != null && parent_email != null && address != null && profileUrl != null && fees_structure_id != null) {

        model(function (err, connection) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {

                // Begin transaction 
                connection.beginTransaction(function (err) {
                    if (err) { throw err; }

                    connection.query('SELECT students.ID, students.Email from students INNER JOIN class_students ON students.ID = class_students.StudentId WHERE students.Email = ? AND class_students.ClassId = ?', [email, class_id], function (err, rows) {

                            if (err) {
                                connection.rollback(function () {
                                    connection.release();
                                    res.send(JSON.stringify({ error: true, message: err.message }));
                                    throw err;
                                });
                        }

                        if (rows.length > 0)
                        {
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

                                    connection.query('INSERT INTO students_detail(Student, Standard, Batch, FeesStructureId) VALUES(?,?,?,?)',
                                       [studentId, standard_id, batch,fees_structure_id], function (err, result) {
                                            if (err) {
                                                connection.rollback(function () {
                                                    connection.release();
                                                    res.send(JSON.stringify({ error: true, message: err.message }));
                                                    throw err;
                                                });
                                           }

                                                   // create/insert parent
                                                   connection.query('INSERT INTO parents(FatherName, MotherName, Mobile, Email, Address, JoinDate, UpdateDate) VALUES(?,?,?,?,?,?,?)',
                                                       [father_name, mother_name, parent_mobileNo, parent_email, address, joining_date, updated_date],function (err, result1) {

                                                           if (err) {
                                                               connection.rollback(function () {
                                                                   connection.release();
                                                                   res.send(JSON.stringify({ error: true, message: err.message }));
                                                                   throw err;
                                                               });
                                                           }

                                                           var parentId = parseInt(result1.insertId);
                                                           console.log(`Parent id is ${parentId}`)

                                                           connection.query('INSERT INTO parent_students(StudentId, ParentId) VALUES(?,?)',
                                                               [studentId, parentId], function (err, result) {
                                                                   if (err) {
                                                                       connection.rollback(function (){
                                                                           connection.release();
                                                                           res.send(JSON.stringify({ error: true, message: err.message }));
                                                                           throw err;
                                                                       });
                                                                   }


                                                                   connection.query('INSERT INTO class_students(ClassId, StudentId) VALUES(?,?)',
                                                                       [class_id, studentId], function (err, result) {
                                                                           if (err) {
                                                                               connection.rollback(function () {
                                                                                   connection.release();
                                                                                   res.send(JSON.stringify({ error: true, message: err.message }));
                                                                                   throw err;
                                                                               });
                                                                           }


                                                                           connection.query('INSERT INTO class_parents(ParentId, ClassId) VALUES(?,?)',
                                                                               [parentId, class_id], function (err, result) {
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

module.exports = { addNewStudent };
