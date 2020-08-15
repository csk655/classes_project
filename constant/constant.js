//var server_key = { key: 'AAAAaWwiio4:APA91bEsu4iQfDHk7GcpRkWjZgrWU9h8dnp1V56pIo7NQVb4EK3U4oIo5tnG7y33GjRnHyxlo1aCP_YQfeM0e0dyBN38l-ofxJInSrltfyQkWeG0Aun5vLlS-ttIHlJngRm4JNp0eQ21'}
var nodemailer = require('nodemailer');

var message = {
    'to': 'cirwWP6PMHE:APA91bEeDGgCRQY-ihQKrg0IYA08KltJYCAsxxYdpXMuMxKpIyZxb2_xYtuO-UF2FR4qYYr4nY3I7BZsSPd6AVKoX3U3ktpAaBMNL-kzcTY25sai2UWyp_bj9FCxxgar1HU_EfNEBmb2',
    "data": {
        "title": "This is title",
        "content": "This is body...This is body..",
        "image_url": "https://lh5.googleusercontent.com/-kHU14zV5FXQ/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rfJCcCg7fLfvSIvXRyg36fcaUTywA/s96-c/photo.jpg"
    }
}


var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    secure: true,
    port: 465,
    auth: {
        user: 'codingprojects20@gmail.com',
        pass: 'Coding1234'
    }, tls: {
        rejectUnauthorized: false
    }
});

var mailOptions = {
    from: 'codingprojects20@gmail.com',
    to: 'csk655@gmail.com',
    subject: 'Class project support',
    text: 'description apperas here'
};

// secret: used when we create and verify JSON Web Tokens
var jwtSecretKey = {
    secret: 'classes_project_sglsgl',
}


module.exports = { server_key: 'AAAAaWwiio4:APA91bEsu4iQfDHk7GcpRkWjZgrWU9h8dnp1V56pIo7NQVb4EK3U4oIo5tnG7y33GjRnHyxlo1aCP_YQfeM0e0dyBN38l-ofxJInSrltfyQkWeG0Aun5vLlS-ttIHlJngRm4JNp0eQ21', message, transporter, mailOptions, jwtSecretKey }
