var model = require('../config/dbconnect');
var fs = require('fs')
var path = require("path");


var editTeacher = function (req, res) {

    console.log(req.body);
    var new_profile, new_doc
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
    var isProfilechange = req.body.isProfileChange;
    var last_profile = req.body.lastProfile;
    var isDocChange = req.body.isDocChange;
    var last_doc = req.body.lastDoc;
    var updated_date = new Date();

    if (isProfilechange == "Yes")
        new_profile = "http://10.0.2.2:6000/public/"+req.files['profile'][0].filename; //change this and below line at server side
    if (isDocChange == "Yes")
        new_doc = "http://10.0.2.2:6000/public/" +req.files['document'][0].filename;
   
    if (teacher_id != null && full_name != null && mobile_no != null && gender != null && subject != null && email != null && dob != null && address != null
        && experience != null && qualification != null && blood_group != null) {

        model(function (err, connection) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {

                connection.beginTransaction(function (err) {
                    if (err) { throw err; }

                    var query = null
                    if (isProfilechange == "Yes" && isDocChange == "Yes") {

                        if (new_profile != null && new_doc != null) {
                            query = 'UPDATE teachers SET Name="' + full_name + '", Mobile="' + mobile_no + '", Gender="' + gender + '", Subject="' + subject + '", ProfilePic="' + new_profile + '",'
                                + 'DocPic ="' + new_doc + '", Email="' + email + '", DOB="' + dob + '", Address="' + address + '", Experience="' + experience + '", '
                                + ' Qualification="' + qualification + '", BloodGroup="' + blood_group + '", UpdateDate="' + updated_date + '" WHERE ID ="' + teacher_id + '" '
                        } else {
                            return res.send(JSON.stringify({ error: true, message: "new_profile,new_doc can not be null" }));
                        }
                     
                    } else if (isProfilechange == "Yes") {

                        if (new_profile != null) {
                            query = 'UPDATE teachers SET Name="' + full_name + '", Mobile="' + mobile_no + '", Gender="' + gender + '", Subject="' + subject + '", ProfilePic="' + new_profile + '",'
                                + 'Email="' + email + '", DOB="' + dob + '", Address="' + address + '", Experience="' + experience + '", '
                                + ' Qualification="' + qualification + '", BloodGroup="' + blood_group + '", UpdateDate="' + updated_date + '" WHERE ID ="' + teacher_id + '" '
                        } else {
                            return res.send(JSON.stringify({ error: true, message: "new_profile can not be null" }));
                        }
                 
                    } else if (isDocChange == "Yes") {
                        if (new_doc != null) {
                            query = 'UPDATE teachers SET Name="' + full_name + '", Mobile="' + mobile_no + '", Gender="' + gender + '", Subject="' + subject + '",'
                                + 'DocPic ="' + new_doc + '", Email="' + email + '", DOB="' + dob + '", Address="' + address + '", Experience="' + experience + '", '
                                + ' Qualification="' + qualification + '", BloodGroup="' + blood_group + '", UpdateDate="' + updated_date + '" WHERE ID ="' + teacher_id + '" '
                        } else {
                            return res.send(JSON.stringify({ error: true, message: "new_doc can not be null" }));
                        }
                        
                    } else {
                        query = 'UPDATE teachers SET Name="' + full_name + '", Mobile="' + mobile_no + '", Gender="' + gender + '", Subject="' + subject + '",'
                            + 'Email="' + email + '", DOB="' + dob + '", Address="' + address + '", Experience="' + experience + '", '
                            + 'Qualification="' + qualification + '", BloodGroup="' + blood_group + '", UpdateDate="' + updated_date + '" WHERE ID ="' + teacher_id + '" '
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

                                            connection.commit(function (err) {
                                                if (err) {
                                                    connection.rollback(function () {
                                                        connection.release();
                                                        res.send(JSON.stringify({ error: true, message: err.message }));
                                                        throw err;
                                                    });
                                                } else {
                                                    try {

                                                        if (isProfilechange == "Yes") {
                                                            fs.unlinkSync(path.resolve("./public/" + last_profile));
                                                        }
                                                        if (isDocChange == "Yes") {
                                                            fs.unlinkSync(path.resolve("./public/" + last_doc));
                                                        }
                                                    }
                                                    catch (err) {
                                                        console.log(err)
                                                        res.send(JSON.stringify({ error: true, message: "Teacher updated but file not found to delete"}));
                                                        connection.release();
                                                        return
                                                    }

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

