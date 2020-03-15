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
var class_login = require('./routes/class_login')
var verify_user = require('./routes/verifyUser')

var add_teacher = require('./routes/addTeacher');
var add_new_student = require('./routes/addNewStudent');
var add_student_already_parent = require('./routes/addStudentAlreadyParent');
var get_teachers = require('./routes/getTeachers');
var get_students = require('./routes/getStudents');
var delete_student = require('./routes/deleteStudent');
var delete_teacher = require('./routes/deleteTeacher');
var add_standard = require('./routes/addStandards');
var get_standard_by_class = require('./routes/getStandardsByClass')
var add_batch = require('./routes/addBatch')
var get_batch = require('./routes/getBatch')
var sendSupportMessage = require('./routes/sendSupportMessage');
var getSuppoertMessages = require('./routes/getSupportMessages')
var sendSupportReply = require('./routes/sendSupportReply')
var getSupportReplyClass = require('./routes/getSupportReplyByClass')
var teacherSchedule = require('./routes/uploadTeacherSchedule');
var send_message = require('./routes/sendMessage');
var get_messages = require('./routes/getMessageByClass')

var app=express();
app.use(bodyParser.json()); // Accept JSON params
app.use(bodyParser.urlencoded({extended:true}))// Accept URL Encoded params
app.use(express.static('profile'));

app.listen(6000, function () {
    console.log("Server app listening on port 6000")
 });


app.get('/loginotheruser', login_other_user.loginOtherUser);
app.get('/classlogin', class_login.classLogin);
app.get('/verifyuserotp', verify_user.verifyUserOtp)


var apiRoutes = express.Router();
apiRoutes.use(bodyParser.json());
apiRoutes.use(bodyParser.urlencoded({ extended: true }));

apiRoutes.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type', 'Authorization')
    next();
});
//route middleware to verify a token 
apiRoutes.use(verifyToken);

apiRoutes.post('/createteacher', upload.array('profiles', 2), add_teacher.addTeacher);
//apiRoutes.post('/testprofile', upload.array('profiles', 4), add_teacher.photoTest);
apiRoutes.post('/addnewstudent', upload.array('profiles', 1), add_new_student.addNewStudent);
apiRoutes.post('/addstudentalreadyparent', upload.array('profiles', 1) , add_student_already_parent.addStudentAlreadyParent)
apiRoutes.get('/getteachersbyclassid', get_teachers.getTeachers); 
apiRoutes.get('/getstudentsbyclassid', get_students.getStudents);
apiRoutes.delete('/deletestudentbyid', delete_student.deleteStudent);
apiRoutes.delete('/deleteteacherbyid', delete_teacher.deleteTeacher);
apiRoutes.post('/addstandard', add_standard.addStandard);
apiRoutes.get('/getstandardsbyclass', get_standard_by_class.getStandardsByClass)
apiRoutes.post('/addbatchbyclass', add_batch.addBatch);
apiRoutes.get('/getbatchsbystandard', get_batch.getBatchesByStandard);
apiRoutes.post('/sendsupportmessage', sendSupportMessage.sendSupport);
//for both admin and replying person(we)
apiRoutes.get('/getsupportmessage', getSuppoertMessages.getSupportMessagesByClass);
//for our use only
apiRoutes.post('/sendsupportreply', sendSupportReply.sendSupportReply)
apiRoutes.get('/getsupportreplybyclass', getSupportReplyClass.getSupportReplyByClass);
apiRoutes.post('/teacherschedule', upload.single('schedule_photo'), teacherSchedule.uploadSchedule);
apiRoutes.post('/sendmessage', send_message.sendMessage);
apiRoutes.get('/getmessagebyclass', get_messages.getMessages);

app.use('/', apiRoutes);
