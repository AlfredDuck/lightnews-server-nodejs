/** 被关注的话题 **/
// 由于在user下创建关注的话题，会造成深层嵌套
// 所以将被关注的话题拆出来，仅与user做关联，避免深层嵌套时，查询麻烦的问题

var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var followedTopicSchema = new Schema({
    title: String,                     // 话题名称（需要有唯一性）
    introduction: String,              // 话题简介
    portrait: String,                  // 话题头像
    followedTime: Date,                // 开始关注的时间
    isPushOn: String,                  // 推送开关
    uid: String                        // 用户id
});

module.exports = mongodb.mongoose.model("followedTopic", followedTopicSchema);