// article

/* 功能模块 */

/* 数据模块 */
var addArticle = require('./../models/article.js');
var addShareLog = require('./../models/shareLog.js');


/* 读取 article 内容 */
exports.readArticle = function (req, res) {
    //
    console.log(req.query);

    // 读取 article 内容
    addArticle.findOne({_id: req.query.article_id}, function(err, doc){
        if (err) {
            console.log(err);
        } 
        else if (doc) {
            console.log(doc.title);
            // 更新阅读量(有点跑题哈)
            pageViewPlusOne(doc._id, doc.pageView);
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
    res.render('article', {
        article_title : article.title,
        author_name : article.author.name,
        author_pic: article.author.pic,
        post_time: postTime,
        article_text : article.picAndText,
        related_articles: relatedArticleArr
    });
}





/* 阅读量 +1 */
function pageViewPlusOne (articleID, originalPageView) {
    console.log('原阅读量：' + originalPageView);
    addArticle.update(
        {_id: articleID},                      // 查询项
        {pageView: originalPageView + 1},      // 修改项
        {safe: true, multi: true},             // 设置项
        function(err, num){
            if (err) {
                console.log(err);
            } else {
                console.log('更新pageView + ' + num);
            }
    });
}





/* 读取 article 的其他内容 */

exports.readOther = function (req, res) {
    console.log(req.query);

    var json = {
        errcode: null,
        commentNum: null,
        praiseNum: null,
        articleID: req.query.id
    };

    // 读取 评论、赞、分享的数量
    addArticle.findOne({_id: req.query.article_id}, function(err, doc){
        if (err) {
            console.log(err);
            json.errcode = 'err';
            res.send(json);
        }
        else if (doc) {
            json.errcode = 'normal';
            json.commentNum = doc.commentNum;
            if (doc.praiseNum){
                json.praiseNum = doc.praiseNum;
            } else {
                json.praiseNum = 0;
            }
            res.send(json);
        }
        else {
            json.errcode = 'err';
            res.send(json);
        }
    });
}

// 读取赞的数量
function howMuchpraise () {
    console.log(req.query);

}



/* 拉取分享的信息: 标题、描述、图片、链接 */
exports.shareInfo = function (req, res) {
    console.log('拉取分享的信息');
    console.log(req.query)
    var json = {
        errcode: 'normal',
        articleID: req.query.article_id,
        data: null
    };

    addArticle.findOne({'_id': req.query.article_id}, function(err, doc) {
        if (err) {
            console.log(err);
            json.errcode = 'err';
            res.send(json);
        }
        if (doc) {
            var link = 'http://saltfish.news:8080/article_share?article_id=' + doc._id;
            var download = 'https://itunes.apple.com/us/app/xian-yu-xing-wen-hao-wan-you/id1084092765';
            json.data = {
                title: doc.title,
                description: doc.title,
                link: link,
                // 转为微博配置的text，链接放在文本里
                text_weibo: doc.title + '，【查看详情】' + link +' 【更多精彩内容，下载咸鱼腥闻】' + download,
                // 微信分享图片需 32k 以内，微博无此限制，需要分别配置
                pic_weibo: doc.picBig,
                pic_weixin: 'https://img1.doubanio.com/view/photo/photo/public/p2328427592.jpg'
            };
            res.send(json);
        } else {
            json.errcode = 'err';
            console.log('find nothing');
            res.send(json);
        }
    });
};




/* 记录一次点赞动作 */
exports.clickPraise = function(req, res){
    // 点赞
    console.log(req.query);

    var json = {
        errcode: 'err',
        articleID: req.query.article_id
    };

    addArticle.findOne({'_id': req.query.article_id}, function(err, doc){
        if (err) {
            console.log(err);
            res.send(json);
        }
        if (doc) {
            var pn = 0;
            if (!doc.praiseNum) {
                console.log('还未产生praiseNum');
            } else {
                console.log('当前赞的数量：' + doc.praiseNum);
                pn = doc.praiseNum;
            }
            addArticle.update(
                {_id: req.query.article_id},           // 查询项
                {praiseNum: pn + 1},                   // 修改项
                {safe: true, multi: true},             // 设置项
                function(err, num){
                    if (err) {
                        console.log(err);
                        res.send(json);
                    } else {
                        console.log('更新praiseNum + ' + num);
                        json.errcode = 'normal';
                        res.send(json);
                    }
            });
        } else {
            console.log('find nothing');
            return;
        }
    });
};



/* 记录一次分享动作 */
exports.clickShare = function(req, res){
    // 分享：只需区分微博or微信
    console.log('分享+1');
    console.log(req.query.share_to)

    var json = {
        errcode: 'normal'
    };

    var newShareLog = new addShareLog({
        createTime: new Date(),
        shareTo: req.query.share_to
    });

    newShareLog.save(function(err, doc, num){
        if (err) {
            console.log(err);
            json.errcode = 'err';
            res.send(json);
        }
        else {
            console.log('sharelog记录成功');
            json.errcode = 'normal';
            res.send(json);
        }
    });
};






