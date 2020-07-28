var model = require('../config/dbconnect');
var jwt = require('jsonwebtoken');
var constants = require('../constant/constant');
var secretKey = constants.jwtSecretKey.secret;

var classLogin = function (req, res) {

    var email = req.query.email;
    var password = req.query.password;
    var token = req.query.token;

    if (email != null && password != null && token != null) {

        model(function (err, connection) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {
                connection.query('select ID, Email, ClassName, Password, Mobile, Phone_1, Phone_2, Address, ClassLogo from classes where Email=? AND Status="Active"', [email] , function (err, selectedRows) {
                    if (err) {
                        console.log(err);
                        res.send(JSON.stringify({ error: true, message: 'Error Occurred with query' }));
                    }
                    else {
                        if (selectedRows.length > 0) {

                            var dbPassword = selectedRows[0].Password
                            if (dbPassword == password) {

                                var class_id = selectedRows[0].ID
                                connection.query("INSERT INTO classes_token(Class,Token) VALUES(?,?) ON DUPLICATE KEY UPDATE Token=?", [class_id, token, token], function (err, rows) {

                                    if (err) {
                                        res.status(500);
                                        res.send(JSON.stringify({ error: true, message: err.message }));
                                    } else {

                                        if (rows.affectedRows > 0) {
                                            //JWT code here
                                            let token = jwt.sign({ email: selectedRows[0].Email }, secretKey, {})

                                            delete selectedRows[0].Password;
                                            res.send(JSON.stringify({ error: false, message: "User login succssfully", result: selectedRows[0], jwtToken: token }));
                                        } else {

                                            res.send(JSON.stringify({ error: true, message: "Something went wrong!" }));

                                        }
                                    }
                                });

                            } else {
                                res.send(JSON.stringify({ error: true, message: "You have entered wrong password !"}));
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




module.exports = { classLogin };