var model = require('../config/dbconnect');
var fs = require('fs')
var path = require('path')

var editStudent = function (req, res) {

    console.log(req.body);

    var new_profile;
    var student_id = parseInt(req.body.studentId);
    var student_name = req.body.studentName;
    var mobile_no = req.body.mobileNo;
    var gender = req.body.gender;
    var dob = req.body.dob;
    var standard_id = req.body.standardId;
    var batch = req.body.batchId;
    var email = req.body.email;
    var is_profilechange = req.body.isProfileChange;
    var last_profile = req.body.lastProfile;
    var updated_date = new Date();
    var fees_structure_id = req.body.feesStructureId;

    if (is_profilechange == "Yes")
        new_profile = "http://10.0.2.2:6000/public/" + req.files['profile'][0].filename; //change this and below line at server side
    

    if (student_id != null && student_name != null && mobile_no != null && gender != null && dob != null && standard_id != null && batch != null
        && email != null && updated_date != null) {

        model(function (err, connection) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {

                // Begin transaction 
                connection.beginTransaction(function (err) {
                    if (err) { throw err; }

                    var query = null
                    if (is_profilechange == "Yes") {
                        if (new_profile != null) {
                            query = 'UPDATE students SET Name="' + student_name + '", Mobile="' + mobile_no + '", Gender="' + gender + '", DOB="' + dob + '", Email="' + email + '",'
                                + 'ProfilePic="' + new_profile + '", UpdateDate="' + updated_date + '" WHERE ID ="' + student_id + '"'
                        } else {
                            return res.send(JSON.stringify({ error: true, message: "new_profile can not be null" }));
                        }
                    } else {
                        query = 'UPDATE students SET Name="' + student_name + '", Mobile="' + mobile_no + '", Gender="' + gender + '", DOB="' + dob + '", Email="' + email + '",'
                            + 'UpdateDate="' + updated_date + '" WHERE ID ="' + student_id + '"'
                    }

                    connection.query(query, function (err, results) {
                                if (err) {
                                    connection.rollback(function () {
                                        connection.release();
                                        res.status(500);
                                        res.send(JSON.stringify({ error: true, message: err.message }));
                                        throw err;
                                    });
                                } else {

                                    if (results.affectedRows > 0) {

                                        connection.query('UPDATE students_detail SET Standard=?, Batch=?, FeesStructureId=? WHERE Student = ?', [standard_id, batch, fees_structure_id, student_id], function (err, results) {

                                                if (err) {
                                                    connection.rollback(function () {
                                                        connection.release();
                                                        res.status(500);
                                                        res.send(JSON.stringify({ error: true, message: err.message }));
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

                                                                if (is_profilechange == "Yes") {
                                                                    try {
                                                                        fs.unlinkSync(path.resolve("./public/" + last_profile));
                                                                    } catch (err) {
                                                                        console.log(err)
                                                                    }
                                                                }

                                                                res.send(JSON.stringify({ error: false, message: "Student updated successfully!" }));
                                                                connection.release();
                                                            }
                                                        });
                                                }
                                            });

                                    } else {
                                        res.send(JSON.stringify({ error: true, message: "Student not exists" }));
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


module.exports = { editStudent };

