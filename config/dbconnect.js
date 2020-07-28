var mysql = require('mysql');

// local setup 
var pool = mysql.createPool({
    host:'localhost',
    port:'3306',
    user:'root',
    password:'',
    database:'classes1'
});

// global setup
// var pool = mysql.createPool({
//   host:'localhost',
//   port:'3306',
//   user:'fundrod',
//   password:'Fundroid@info4163',
//   database:'classes'
// });


var getConnection = function (cb) {
    pool.getConnection(function (err, connection) {
        //if(err) throw err;
        //pass the error to the cb instead of throwing it
        if(err) {
          return cb(err);
        }
        cb(null, connection);
    });
};

module.exports = getConnection;