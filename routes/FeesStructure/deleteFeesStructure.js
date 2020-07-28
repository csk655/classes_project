var path = require("path");
var dbconnectPath = path.resolve("./config/dbconnect")
var model = require(dbconnectPath);

var deleteFeesStructure = function (req, res) {

    console.log(req.query);
    var fees_structure_id = req.query.feesStructureId

    if (fees_structure_id != null) {

        model(function (err, connection) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {

                connection.query('DELETE FROM fees_structure WHERE ID=?', [fees_structure_id], function (err, rows) {

                    connection.release();

                    if (err) {
                        res.status(500);
                        res.send(JSON.stringify({ error: true, message: err.message }));
                    } else {

                        if (err) {
                            res.send(JSON.stringify({ error: true, message: err.message }));
                        } else {
                            if (rows.affectedRows > 0) {
                                res.send(JSON.stringify({ error: false, message: "Fees structure deleted successfully" }));
                            }
                        }
                    }
                });

            }
        });

    } else {
        return res.send(JSON.stringify({ error: true, message: "fees_structure_id can not be null" }));
    }
}


module.exports = { deleteFeesStructure };