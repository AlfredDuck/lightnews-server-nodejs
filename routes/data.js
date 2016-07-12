// data.js

var addDevice = require('./../models/device.js');

exports.device = function (req, res) {
    addDevice.find(null, null , {sort:{'_id': -1}},function(err, docs){
        if (err) {
            console.log(err);
        } else {
            console.log(docs);
            res.send(docs);
        }
    });
}