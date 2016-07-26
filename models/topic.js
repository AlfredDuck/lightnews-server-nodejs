/** 话题 **/

var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var topicSchema = new Schema({
    title: String,                     // 话题名称（需要有唯一性）
    introduction: String,              // 话题简介
    portrait: String,                  // 话题头像
    updateTime: Date,                  // 更新时间
    createTime: Date,                  // 创建时间
    followNum: Number,                 // 关注人数
    classification: Array              // 所属的分类
});

module.exports = mongodb.mongoose.model("topic", topicSchema);

