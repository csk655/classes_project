var express=require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
const path = require('path');

var storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, path.join(__dirname, '/profile/'));
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});
var upload = multer({ storage: storage });

var verifyToken = require('./middleware/verifyToken')
var login_other_user = require('./routes/loginOtherUser');

//----------------------------------ADMIN MODULE IMPORTS---------------------------------------------//

var get_all_classes = require('./routes/getAllClasses');
var class_login = require('./routes/class_login');
var verify_user = require('./routes/verifyUser');
var add_teacher = require('./routes/addTeacher');
var edit_teacher = require('./routes/editTeacher');
var add_new_student = require('./routes/addNewStudent');
var edit_student = require('./routes/editStudent');
var add_student_already_parent = require('./routes/addStudentAlreadyParent');
var get_parent = require('./routes/getParentsByClass')
var get_teachers = require('./routes/getTeachers');
var get_students = require('./routes/getStudents');
var delete_student = require('./routes/deleteStudent');
var delete_teacher = require('./routes/deleteTeacher');
var add_standards_batches = require('./routes/addStandardsBatches');
var get_standards_batches = require('./routes/getStandardsBatches');
var sendSupportMessage = require('./routes/sendSupportMessage');
var getSuppoertMessages = require('./routes/getSupportMessages');
var sendSupportReply = require('./routes/sendSupportReply');
var getSupportReplyClass = require('./routes/getSupportReplyByClass');
var teacherSchedule = require('./routes/uploadTeacherSchedule');
var send_message = require('./routes/sendMessage');
var get_messages = require('./routes/getMessageByClass');
var add_fees_structure = require('./routes/FeesStructure/addFeesStructure');
var delete_fees_structure = require('./routes/FeesStructure/deleteFeesStructure');
var update_fees_structure = require('./routes/FeesStructure/updateFeesStructure');
var get_all_fees_structure = require('./routes/FeesStructure/getAllFeesStructureByClass');
var add_student_fee = require('./routes/StudentFees/addStudentFee');
var get_all_students_fees = require('./routes/StudentFees/getAllStudentsFeeByClass');
var search_all_students_fees = require('./routes/StudentFees/searchAllStudentsFee');


//----------------------------------TEACHER MODULE IMPORTS---------------------------------------------//

var add_student_attendance = require('./routes/addStudentAttendance')
var view_student_attendance = require('./routes/viewStudentAttendance')
var add_student_result = require('./routes/addStudentResult')
var get_student_result = require('./routes/getStudentResult')
var get_class_exams = require('./routes/getExamsByClass')


var app=express();
app.use(bodyParser.json()); // Accept JSON params
app.use(bodyParser.urlencoded({extended:true}))// Accept URL Encoded params
app.use(express.static('profile'));

app.listen(6000, function () {
    console.log("Server app listening on port 6000")
 });


app.get('/loginotheruser', login_other_user.loginOtherUser);
app.get('/classlogin', class_login.classLogin);
app.get('/verifyuserotp', verify_user.verifyUserOtp);
app.get('/getallclasses', get_all_classes.getAllClasses);

var apiRoutes = express.Router();
apiRoutes.use(bodyParser.json());
apiRoutes.use(bodyParser.urlencoded({ extended: true }));

apiRoutes.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type', 'Authorization')
    next();
});
//route middleware to verify a token 
apiRoutes.use(verifyToken);

apiRoutes.post('/addnewteacher', upload.array('profiles', 2), add_teacher.addTeacher);
apiRoutes.put('/editteacher', upload.array('profiles', 2), edit_teacher.editTeacher);
apiRoutes.post('/addnewstudent', upload.array('profiles', 1), add_new_student.addNewStudent);
apiRoutes.put('/editstudent', upload.array('profiles', 1), edit_student.editStudent);
apiRoutes.post('/addstudentalreadyparent', upload.array('profiles', 1), add_student_already_parent.addStudentAlreadyParent)
apiRoutes.get('/getparentbyclass', get_parent.getParentsByClass);

//Get Teachers and Students
apiRoutes.get('/getteachersbyclassid', get_teachers.getTeachers);
apiRoutes.get('/getstudentsbyclassid', get_students.getStudents);

//Delete Student and teacher
apiRoutes.delete('/deletestudentbyid', delete_student.deleteStudent);
apiRoutes.delete('/deleteteacherbyid', delete_teacher.deleteTeacher);

//Add/Get Standards and batches
apiRoutes.post('/addstandardsbatches', add_standards_batches.addStandardBatch);
apiRoutes.get('/getstandardsbatches', get_standards_batches.getStandardsBatches)

//Send message and get message
apiRoutes.post('/sendmessage', send_message.sendMessage);
apiRoutes.get('/getmessagebyclass', get_messages.getMessages);

//Support
apiRoutes.post('/sendsupportmessage', sendSupportMessage.sendSupport);
apiRoutes.get('/getsupportmessage', getSuppoertMessages.getSupportMessagesByClass);

//Support reply for our use
apiRoutes.post('/sendsupportreply', sendSupportReply.sendSupportReply)
apiRoutes.get('/getsupportreplybyclass', getSupportReplyClass.getSupportReplyByClass);

//Teacher schedule
apiRoutes.post('/teacherschedule', upload.single('schedule_photo'), teacherSchedule.uploadSchedule);

//Fees structure
apiRoutes.post('/addfeestructure', add_fees_structure.addFeesStructure);
apiRoutes.get('/getallfeestructurebyclass', get_all_fees_structure.getAllFeesStructureByClass);
apiRoutes.put('/updatefeestructure', update_fees_structure.updateFeesStructure);
apiRoutes.delete('/deletefeestructure', delete_fees_structure.deleteFeesStructure);

//Student fee
apiRoutes.post('/addstudentfee', add_student_fee.addStudentFee);
apiRoutes.get('/getallstudentsfeebyclass', get_all_students_fees.getAllStudentsFeeByClass);
apiRoutes.get('/searchallstuddentfee', search_all_students_fees.searchAllStudentsFee);

//----------------------------------TEACHER MODULE --------------------------------------------- //

//Add and view student attendance 
apiRoutes.post('/addstudentattendance', add_student_attendance.addStudentAttendance);
apiRoutes.get('/viewstudentattendance', view_student_attendance.getStudentAttendance);

//Add and get student result
apiRoutes.post('/addstudentresult', add_student_result.addStudentResult);
apiRoutes.get('/getstudentresultbyexam', get_student_result.getStudentResult);

//Get exam
apiRoutes.get('/getclassexams', get_class_exams.getClassExams)


app.use('/', apiRoutes);



