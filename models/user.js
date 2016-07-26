/** 用户账号 **/

var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var userSchema = new Schema({
    weiboUser: {                   // 微博登录的用户
        nickname: String,
        portraitURL: String,
        weiboID: String
    },
    nickname: String,              // 用户昵称
    createTime: Date,              // 创建时间
    mail: String,                  // 邮箱
    password: String,              // 密码
    userid: String,
    followedTopics: Array          // 用户关注的话题列表
});

module.exports = mongodb.mongoose.model("user", userSchema);

