//
var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var shareLogSchema = new Schema({
    shareTo: String,
    createTime: Date              // 创建时间
});

module.exports = mongodb.mongoose.model("shareLog", shareLogSchema);