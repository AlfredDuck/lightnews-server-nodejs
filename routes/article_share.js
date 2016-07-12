/* 功能模块 */

/* 数据模块 */
var addArticle = require('./../models/article.js');


/* 分享出去的页面 */
exports.shareOut = function(req, res) {
    //
    console.log('分享出去的页面');
    console.log(req.query.article_id);

    // 读取 article 内容
    addArticle.findOne({_id: req.query.article_id}, function(err, doc){
        if (err) {
            console.log(err);
        } 
        else if (doc) {
            console.log(doc.title);
            // 流水线下一步，读取相关文章
            relatedArticles(req, res, doc);
        }
        else {
            console.log('find nothing');
            res.send('<p>find nothing</p>');
        }
    });
};


/* 读取 article 相关文章 */
function relatedArticles (req, res, article) {
    // （临时方案）同一author下近期的三篇文章，记得跟当前文章去重

    // 查询条件
    var query = {
        'author.name': article.author.name,
        'title': {$ne: article.title}
    };
    var option = {
        sort: {postTime:-1, _id:-1},  
        limit: 3
    };

    addArticle.find(query, null, option, function(err, docs){
        if (err) {
            console.log(err);
        } else if (!docs[0]) {
            console.log('find no related articles');
        } else {
            console.log('相关文章数量：' + docs.length);
            // 流水线下一步，渲染页面
            rendPage(req, res, article, docs);
        }
    });
}


/* 渲染 article 页面 */
function rendPage (req, res, article, relatedArticleArr) {

    // 处理 postTime
    var postTime = article.postTime;
    var re = / /gi;
    postTime = postTime.split(re)[0];

    // 渲染页面
    res.render('article_share', {
        article_title : article.title,
        author_name : article.author.name,
        author_pic: article.author.pic,
        post_time: postTime,
        article_text : article.picAndText,
        related_articles: relatedArticleArr
    });
}




/*
 * 引导下载
 * 
 *
 */

exports.download = function (req, res) {
    res.render('download');
};

















