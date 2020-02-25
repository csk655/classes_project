var model = require('../config/dbconnect');


var addTeacher = function (req, res) {

    console.log(req.body);
    var profileUrl, docUrl;
    var class_id = parseInt(req.body.classId);
    var class_name = req.body.className;
    var full_name = req.body.fullName;
    var mobile_no = req.body.mobileNo;
    var gender = req.body.gender;
    var subject = req.body.subject;
    var email = req.body.email;
    var dob = req.body.dob;
    var address = req.body.address;
    var experience = req.body.experience;
    var high_qualification = req.body.highQualification;
    var blood_group = req.body.bloodGroup;
    var joining_date = req.body.joiningDate;
    var updated_date = new Date();

    var paths = req.files.map(file => {
        var temp = file.originalname;
        if (temp.includes("profile")) {
            profileUrl = file.filename;
        } else {
            docUrl = file.filename;
        }
    });

    if (class_id != null && class_name != null && full_name != null && mobile_no != null && gender != null && subject != null && email != null && dob != null && address != null
        && experience != null && high_qualification != null && blood_group != null && joining_date != null && profileUrl != null && docUrl != null) {
      
        model(function (err, connection) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {

                connection.query('INSERT INTO teacher_details(class_id,class_name,t_full_name, t_mobile_no, t_gender, t_subject, t_profile_pic, t_doc_pic, t_email, t_dob, t_address, t_experience, t_high_qualification, t_blood_group , t_joining_date, t_updated_date) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE' +
                    ' t_full_name =?, t_gender =? , t_subject =? , t_profile_pic=? , t_doc_pic =?, t_email =?, t_dob =?, t_address =?, t_experience =?, t_high_qualification =?, t_blood_group =?, t_joining_date =?, t_updated_date =?',
                    [class_id, class_name,full_name, mobile_no, gender, subject, profileUrl, docUrl, email, dob, address, experience, high_qualification, blood_group, joining_date, updated_date, full_name, gender, subject, profileUrl, docUrl, email, dob, address, experience, high_qualification, blood_group, joining_date, updated_date],
                    function (err, rows) {
                    if (err) {
                        res.status(500);
                        res.send(JSON.stringify({ error: true, message: err.message }));
                    } else {
						//affectedRows = 1 = inserted
						//affectedRows = 0 = updated
                        if (rows.affectedRows > 0) {
                            res.send(JSON.stringify({ error: false, message: "Success" }));
                        }
                    }
                });
                connection.release();
            }
        });

    } else {
        return res.send(JSON.stringify({ error: true, message: "class_id,class_name,full_name,mobile no,subject,other fields can not be null" }));
    }
}

var photoTest = function (req, res) {
    var profileUrl, docUrl;
    try {
        res.send(req.files);

        var paths = req.files.map(file => {
            var temp = file.originalname;
            if (temp.includes("profile")) {
                profileUrl = file.filename;
            } else {
                docUrl = file.filename;
            }
        });

        console.log("Profile url " + profileUrl);
        console.log("doc url " + docUrl);


    } catch (err) {
        res.send(400);
    }
}


module.exports = { addTeacher, photoTest};