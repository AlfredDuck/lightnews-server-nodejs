// 用户

var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var userSchema = new Schema({
    nickname: String,              //用户昵称
    createTime: Date,              //创建时间
    mail: String,                  //邮箱
    password: String,              //密码
    userid: String
});

module.exports = mongodb.mongoose.model("user", userSchema);

