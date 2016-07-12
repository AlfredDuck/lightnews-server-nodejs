// device 设备记录

var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var deviceSchema = new Schema({
    system: String,  // ios or android
    uniqueID: String,  // 唯一识别码，对iOS来说是uuid，对Android来说还不清楚
    visitLogs: Array
});

module.exports = mongodb.mongoose.model("device", deviceSchema);
