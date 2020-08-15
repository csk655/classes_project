var model = require('../config/dbconnect.js')

var editParent = function (req, res) {

    console.log(req.query);
    const parentId = req.body.parentId;
    const fatherName = req.body.fatherName;
    const motherName = req.body.motherName;
    const mobile = req.body.mobile;
    const email = req.body.email;
    const address = req.body.address; 

    if (parentId != null) {

        model(function (err, connection) {

            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool'}));
            } else {
                connection.query('UPDATE parents SET fatherName=?,motherName=?,mobile=?,email=?,address=? WHERE ID=?', [fatherName,motherName,mobile,email,address,parentId],
                    function (err, rows) {
                        connection.release();

                        if (err) {
                            res.status(500);
                            res.send(JSON.stringify({ error: true, message: err.message }));
                        } else {
                            res.send(JSON.stringify({ error: false, message:"Update parent success!" }));
                        }
                })
            }
        })
    } else {
        return res.send(JSON.stringify({ error: true, message: "parentId can not be null" }));
    }
} 

module.exports = { editParent }