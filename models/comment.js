// 评论

var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var commentSchema = new Schema({
    text: String,                    // 评论内容
    createTime: String,              // 创建时间
    commentID: String,               // 评论id
    articleID: String,                  // 所属的news
    nickname: String,
    uuid: String
});

module.exports = mongodb.mongoose.model("comment", commentSchema);

