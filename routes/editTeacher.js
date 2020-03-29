var model = require('../config/dbconnect');
var fs = require('fs')


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
    var is_profilechange = req.body.isProfileChange;
    var last_profile = req.body.lastProfile;
    var isDocChange = req.body.isDocChange;
    var last_doc = req.body.lastDoc;
    var updated_date = new Date();

    var paths = req.files.map(file => {
        var temp = file.originalname;
        if (temp.includes("profile")) {
            new_profile = file.filename;
        } else {
            new_doc = file.filename;
        }
    });
   
    if (teacher_id != null && full_name != null && mobile_no != null && gender != null && subject != null && email != null && dob != null && address != null
        && experience != null && qualification != null && blood_group != null) {

        model(function (err, connection) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {

                // Begin transaction 
                connection.beginTransaction(function (err) {
                    if (err) { throw err; }

                    var query = null
                    if (is_profilechange == "Yes" && isDocChange == "Yes") {

                        if (new_profile != null && new_doc != null) {
                            query = 'UPDATE teachers SET Name="' + full_name + '", Mobile="' + mobile_no + '", Gender="' + gender + '", Subject="' + subject + '", ProfilePic="' + new_profile + '",'
                                + 'DocPic ="' + new_doc + '", Email="' + email + '", DOB="' + dob + '", Address="' + address + '", Experience="' + experience + '", '
                                + ' Qualification="' + qualification + '", BloodGroup="' + blood_group + '", UpdateDate="' + updated_date + '" WHERE ID ="' + teacher_id + '" '
                        } else {
                            return res.send(JSON.stringify({ error: true, message: "new_profile,new_doc can not be null" }));
                        }
                     
                    } else if (is_profilechange == "Yes") {

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

                                                    if (is_profilechange == "Yes" && isDocChange == "Yes") {
                                                        try {
                                                            fs.unlinkSync('D:/node js files/Classes Project backend/profile/' + last_profile);
                                                            fs.unlinkSync('D:/node js files/Classes Project backend/profile/' + last_doc);
                                                        } catch (err) {
                                                            // handle the error
                                                            console.log(err)
                                                        }
                                                    } else if (is_profilechange == "Yes") {
                                                        try {
                                                            fs.unlinkSync('D:/node js files/Classes Project backend/profile/' + last_profile);
                                                        } catch (err) {
                                                            console.log(err)
                                                        }
                                                    } else if (isDocChange == "Yes") {
                                                        try {
                                                            fs.unlinkSync('D:/node js files/Classes Project backend/profile/' + last_doc);
                                                        } catch (err) {
                                                            console.log(err)
                                                        }
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

