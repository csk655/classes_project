var model = require('../config/dbconnect');


var editTeacher = function (req, res) {

    console.log(req.body);
    var profileUrl, docUrl;
    var teacher_id = parseInt(req.body.teacherId);
    var full_name = req.body.fullName;
    var mobile_no = req.body.mobileNo;
    var gender = req.body.gender;
    var subject = req.body.subject;
    var email = req.body.email;
    var dob = req.body.dob;
    var address = req.body.address;
    var experience = req.body.experience;
    var qualification = req.body.highQualification;
    var blood_group = req.body.bloodGroup;
    var updated_date = new Date();

    var paths = req.files.map(file => {
        var temp = file.originalname;
        if (temp.includes("profile")) {
            profileUrl = file.filename;
        } else {
            docUrl = file.filename;
        }
    });

    if (teacher_id != null && full_name != null && mobile_no != null && gender != null && subject != null && email != null && dob != null && address != null
        && experience != null && qualification != null && blood_group != null && profileUrl != null && docUrl != null) {

        model(function (err, connection) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {

                // Begin transaction 
                connection.beginTransaction(function (err) {
                    if (err) { throw err; }

                            //Update data
                            connection.query('UPDATE teachers SET Name=?, Mobile=?, Gender=?, Subject=?, ProfilePic=?, DocPic=?, Email=?, DOB=?, Address=?, Experience=?,'
                                + ' Qualification=?, BloodGroup=?, UpdateDate=? WHERE ID = ? ', [full_name, mobile_no, gender, subject, profileUrl, docUrl, email, dob,
                                    address, experience, qualification, blood_group, updated_date, teacher_id], function (err, results) {
                                    if (err) {
                                        connection.rollback(function () {
                                            connection.release();
                                            res.status(500);
                                            res.send(JSON.stringify({ error: true, message: err.message }));
                                            throw err;
                                        });
                                    } else {

                                        if (results.affectedRows > 0){
                                            connection.commit(function (err) {
                                                if (err) {
                                                    connection.rollback(function () {
                                                        connection.release();
                                                        res.send(JSON.stringify({ error: true, message: err.message }));
                                                        throw err;
                                                    });
                                                } else {
                                                    res.send(JSON.stringify({ error: false, message: "Teacher updated successfully!" }));
                                                    connection.release();
                                                }
                                            });
                                        } else {

                                            res.send(JSON.stringify({ error: true, message: "Teacher not exists" }));
                                            connection.release();

                                        }
                                    }
                                });
                });
            }
        });

    } else {
        return res.send(JSON.stringify({ error: true, message: "Name,Mobile,Subject,other fields can not be null" }));
    }
}


module.exports = { editTeacher };

