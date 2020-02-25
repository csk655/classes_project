var model = require('../config/dbconnect');
var jwt = require('jsonwebtoken');
var constants = require('../constant/constant');
var secretKey = constants.jwtSecretKey.secret;

var adminLogin = function (req, res) {

    var email = req.query.email;
    var password = req.query.password;
    var token = req.query.token;

    if (email != null && password != null && token != null) {

        model(function (err, connection) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {
                connection.query('select class_id,mobile,email,password,address,class_logo,class_name from admin where email=? AND status="Active"', [email] , function (err, selectedRows) {
                    if (err) {
                        console.log(err);
                        res.send(JSON.stringify({ error: true, message: 'Error Occurred with query' }));
                    }
                    else {
                        if (selectedRows.length > 0) {

                            var dbPassword = selectedRows[0].password
                            if (dbPassword == password) {

                                //classId == admin_id
                                var admin_id = selectedRows[0].class_id
                                connection.query("UPDATE admin SET token=? where class_id=?", [token, admin_id], function (err, rows) {

                                    if (err) {
                                        res.status(500);
                                        res.send(JSON.stringify({ error: true, message: err.message }));
                                    } else {
                                        //JWT code here
                                        let token = jwt.sign({ email: selectedRows[0].email }, secretKey, {})

                                        res.send(JSON.stringify({ error: false, message: "User login succssfully", result: selectedRows, token: token }));
                                    }
                                });

                            } else {
                                res.send(JSON.stringify({ error: true, message: "You have entered wrong password !" }));
                            }

                        } else {
                            res.send(JSON.stringify({ error: true, message: "User not exists or inactive status" }));
                        }
                    }
                });
                connection.release();
            }
        });

    } else {
        return res.send(JSON.stringify({ error: true, message: "email, password, token can not be null" }));
    }
}




module.exports = { adminLogin };