/** 用户反馈 **/

var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var feedbackSchema = new Schema({
    userType: String,                  // 账户类型
    uid: String,                       // 用户id
    deviceType: String,                // 设备类型
    deviceID: String,                  // 设备标识
    createTime: Date,                  // 创建时间
    content: String,                   // 反馈内容
});

module.exports = mongodb.mongoose.model("feedback", feedbackSchema);

