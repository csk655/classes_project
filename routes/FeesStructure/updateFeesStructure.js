var model = require('D:/node js files/Classes Project backend/config/dbconnect');


var updateFeesStructure = function (req, res) {

    console.log(req.body);
    var fees_structure_id = req.body.feesStructureId;
    var structure_name = req.body.feesStructureName;
    var total_fees = req.body.totalFees;

    if (fees_structure_id != null && structure_name != null && total_fees != null) {

        model(function (err, connection) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {

                connection.query('UPDATE fees_structure SET StructureName=?,TotalFees=? WHERE ID=?', [structure_name, total_fees, fees_structure_id], function (err, rows) {

                    connection.release();

                    if (err) {
                        res.status(500);
                        res.send(JSON.stringify({ error: true, message: err.message }));
                    } else {

                        if (err) {

                            res.send(JSON.stringify({ error: true, message: err.message }));

                        } else {
                            res.send(JSON.stringify({ error: false, message: "Fees structure updated successfully" }));
                        }

                    }
                });

            }
        });

    } else {
        return res.send(JSON.stringify({ error: true, message: "fees_structure_id,structure_name,total_fees can not be null" }));
    }
}


module.exports = { updateFeesStructure };