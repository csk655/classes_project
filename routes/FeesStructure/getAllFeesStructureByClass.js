var model = require('D:/node js files/Classes Project backend/config/dbconnect');


var getAllFeesStructureByClass = function (req, res) {

    console.log(req.query);
    var class_id = parseInt(req.query.classId);
    var standard_id = req.query.standardId;

    if (class_id != null && standard_id != null) {

        model(function (err, connection) {

            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {

                connection.query('SELECT Id, StructureName, TotalFees FROM fees_structure WHERE ClassId = ? AND StandardId = ?', [class_id, standard_id], function (err, rows) {

                    connection.release();

                    if (err) {
                        res.status(500);
                        res.send(JSON.stringify({ error: true, message: err.message }));
                    } else {
                        if (rows.length > 0) {

                            res.send(JSON.stringify({ error: false, message: "Data got!", classAllFeesStructure : rows }));

                        } else {
                            res.send(JSON.stringify({ error: true, message: "No Data found" }));
                        }

                    }
                });
              
            }
        });

    } else {
        return res.send(JSON.stringify({ error: true, message: "class_id,standard_id can not be null" }));
    }
}


module.exports = { getAllFeesStructureByClass };