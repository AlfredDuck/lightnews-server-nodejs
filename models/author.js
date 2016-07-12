// 内容源，或称为作者

var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var authorSchema = new Schema({
    /*
     * 作者，指的是内容源，比如：毒舌电影
     */
    name: String,             // 名称
    pic: String,              // 头像链接
    link: String,             // 主页地址 (例如：http://toutiao.com/m3600664863/)
    channel: String,          // 所属的频道
    articleList : Array       // 此作者下包含的文章链接数组（用于监控更新）

    /*
    host: String,             // 主页地址 host
    path: String,             // 主页地址 path
    */
});

module.exports = mongodb.mongoose.model("author", authorSchema);
