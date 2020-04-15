var model = require('../config/dbconnect');

var getAllClasses = function (req, res) {


     model(function (err, connection) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {

                connection.query('SELECT ID, ClassName FROM classes', function (err, rows) {
                        connection.release();

                        if (err) {
                            res.status(500);
                            res.send(JSON.stringify({ error: true, message: err.message }));
                        } else {
                            if (rows.length > 0) {

                                res.send(JSON.stringify({ error: false, message: "Data got!", allClasses: rows }));

                            } else {
                                res.send(JSON.stringify({ error: true, message: "No Data found" }));
                            }
                        }
                    });
            }
        });

}

module.exports = { getAllClasses };