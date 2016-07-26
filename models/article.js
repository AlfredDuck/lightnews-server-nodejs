// 一篇文章

var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var articleSchema = new Schema({
    title: String,                  // 标题
    postTime: String,               // 发布时间（在源网站的发布时间）
    createTime: Date,               // 创建时间
    author: {                       // 作者（指内容源，比如：毒舌电影）
        name: String,               // 作者名称
        pic: String,                // 作者头像
        authorID: String            // 作者id
    },
    topic: Array,                   // 所属话题
    resource: String,               // 来源（比如：toutiao.com)
    originalLink: String,           // 文章原始链接
    picAndText: String,             // 图文混排
    channel: String,                // 所在频道 (频道指：电影、娱乐、内涵段子等这些分类)
    pageView: Number,               // 浏览量
    commentNum: Number,             // 评论数
    picBig: String,                 // 标题大图地址
    picSmall: String,               // 标题小图地址
    praiseNum: Number,              // 赞的数量
    keywords: Array,                // 文章关键词（暂时用不到）

    /*
     * 以下部分定义了一篇文章是否会在首页显示
     * 对于每个频道，会有一个热度得分标准，在这个标准之上的文章，才会显示在首页
     * 热度得分的定义是：单位小时中的阅读量(PV/h)，其中 PV 和 h 都是此文章在今日头条的阅读数和发布时间
     */
    showInHome:{
        hotScore: Number,           // 热度得分
        timeOfGetScore: String,     // 计算热度得分的时间
        showInHome: Number,         // 0代表不在首页展示，1代表在首页展示
        jr_pageView: Number,        // 此文章在今日头条的阅读数
        jr_postTime: String         // 此文章在今日头条的发布时间
    }

    /*
    hotScore: Number,               // 热度得分
    */
});

module.exports = mongodb.mongoose.model("article", articleSchema);
