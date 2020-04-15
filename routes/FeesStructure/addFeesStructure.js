var model = require('D:/node js files/Classes Project backend/config/dbconnect');

var addFeesStructure = function (req, res) {

    console.log(req.body);
    var class_id = req.body.classId;
    var standard_id = req.body.standardId;
    var structure_name = req.body.structureName;
    var total_fees = req.body.totalFees;

    if (class_id != null && standard_id != null && structure_name != null && total_fees != null) {

        model(function (err, connection) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {

                connection.query('INSERT INTO fees_structure(ClassId,StandardId,StructureName,TotalFees) VALUES(?,?,?,?)', [class_id, standard_id, structure_name, total_fees],
                    function (err, rows) {

                    connection.release();

                    if (err) {
                        res.status(500);
                        res.send(JSON.stringify({ error: true, message: err.message }));
                    } else {

                        if (err) {

                            res.send(JSON.stringify({ error: true, message: err.message }));

                        } else {

                            if (rows.affectedRows > 0) {
                                res.send(JSON.stringify({ error: false, message: "Fees structure added successfully" }));
                            }

                        }
                    }
                });
            }
        });

    } else {
        return res.send(JSON.stringify({ error: true, message: "class_id,standard_id,structure_name,total_fees can not be null" }));
    }
}


module.exports = { addFeesStructure };

