var model = require('../config/dbconnect');


var addTeacher = function (req, res) {

    console.log(req.body);
    var profileUrl, docUrl;
    var class_id = parseInt(req.body.classId);
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

    if (class_id != null && full_name != null && mobile_no != null && gender != null && subject != null && email != null && dob != null && address != null
        && experience != null && qualification != null && blood_group != null && joining_date != null && profileUrl != null && docUrl != null) {
      
        model(function (err, connection) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {

                connection.query('INSERT INTO teachers(Class, Name, Mobile, Gender, Subject, ProfilePic, DocPic, Email, DOB, Address, Experience, Qualification, BloodGroup, JoinDate) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE' +
                    ' Name=?, Gender=?, Subject=?, ProfilePic=?, DocPic=?, Email=?, DOB=?, Address=?, Experience=?, Qualification=?, BloodGroup=?, JoinDate=?, UpdateDate=?',
                    [class_id, full_name, mobile_no, gender, subject, profileUrl, docUrl, email, dob, address, experience, qualification, blood_group, joining_date, full_name,
                        gender, subject, profileUrl, docUrl, email, dob, address, experience, qualification, blood_group, joining_date, updated_date],

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
        return res.send(JSON.stringify({ error: true, message: "ClassId,Name,Mobile,Subject,other fields can not be null" }));
    }
}


module.exports = { addTeacher };



/*var photoTest = function (req, res) {
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
} */