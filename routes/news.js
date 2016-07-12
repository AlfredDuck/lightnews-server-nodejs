// news

var addNews =require('./../models/news.js');
var addComment = require('./../models/comment.js');


/************************************************/
/* 访问 news 页面 */
/************************************************/
exports.newsPage = function (req, res) {
    console.log('访问news：' + req.params.newsid);

    addNews.findOne({newsid: req.params.newsid}, function(err, doc){
        if (err) {console.log(err);}
        if (doc) {
            var result = {
                newsid: doc.newsid,
                news: doc,
                commentForNews: []
            };
            findComment(result, req, res);
        } else {
            console.log('没有要找的news');
            res.send('404');
        }
    });
};

// 查询 news 下的评论内容
function findComment (result, req, res) {
    // 分页页码
    if (req.query.page) {
        var page = req.query.page;
    } else {
        var page = 0;
    }

    var option = {
        sort: [['_id', -1]],
        limit: 3,
        skip: page*3               // 跳过前面 N 条数据, page 从零开始
    };

    addComment.find({newsid: result.newsid}, null, option, function(err, docs){
        if (err) {console.log(err);}
        if (docs[0]){
            result.commentForNews = docs;
            rendNewsPage(result, page, req, res);
        } else {
            console.log('这个news下没有评论内容');
            rendNewsPage(result, page, req, res);
        }
    });
}

// 渲染 news 页面
function rendNewsPage (result, page, req, res) {
    console.log(result);
    res.render('news', {
        newsid:         result.newsid,
        user:           result.news.user,
        createTime:     result.news.createTime,
        myword:         result.news.myword,
        upvote:         result.news.upvote,
        downvote:       result.news.downvote,
        // commentNum:     result.news.commentNum,
        commentNum:     149,
        comment:        result.commentForNews,
        page:           parseInt(page) + 1,
        largestPage:    Math.ceil(149/3)            // 评论总数除以每页数，并向上取整，算最大页码
    });
}


/************************************************/
/* 写评论 */
/************************************************/
exports.writeComment = function (req, res) {
    if (!req.session.user) {
        console.log('没有登录');
        return;
    }
    console.log(req.query);

    var isReply = false;
    var replyTo = null;
    if (req.query.isReply == 'yes') {                  // 如果是一个回复的评论
        isReply = true;
        replyTo = {
            userid: req.query.replyTo.userid,
            nickname: req.query.replyTo.nickname
        };
    }

    // 保存新comment
    newComment = new addComment({
        user:{
            userid: req.session.user.userid,
            nickname: req.session.user.nickname
        },
        text: req.query.text,                    // 评论内容
        createTime: new Date(),                  // 创建时间
        commentid: new Date().getTime(),         // 评论id
        newsid: req.query.newsid,                // 回复到哪个newsid
        isReply: isReply,
        replyTo: replyTo
    });
    newComment.save(function(err, doc, num){
        if (err) {console.log(err);}
        if (doc) {
            console.log(doc);
            commentCounts(doc.newsid, req, res);                // 修改 news 下的回复总数
        }
    });
};

// 修改 news 下的回复数
function commentCounts (newsid, req, res) {
    // 查询原回复数
    addNews.findOne({newsid: newsid}, function(err, doc) {
        if (err) {
            console.log(err);
            return;
        } 
        if (doc.commentNum) {
            var num = doc.commentNum + 1;
        } else {
            var num = 1;
        }
        // 更新回复数
        addNews.update(
            {newsid: newsid},                     // 查询项
            {commentNum: num},                    // 修改项
            {safe: true, multi: true},            // 设置项
            function(err, num){
                if(err) {
                    console.log(err);
                    return;
                }
                res.send('hello world');           // 返回结果给前端
            }
        );
    });
}


/************************************************/
/* 赞同 or 反对 */
/************************************************/
exports.vote = function (req, res) {
    console.log(req.query);

    addNews.findOne(
        {newsid: req.query.newsid},
        function(err, doc) {
            if (err) {
                console.log(err);
            } else if (doc) {
                var upvote = 0;
                var downvote = 0;
                if (req.query.vote == 'up') {
                    upvote = doc.upvote + 1;
                    downvote = doc.downvote;
                } 
                else if (req.query.vote == 'down') {
                    upvote = doc.upvote;
                    downvote = doc.downvote + 1;
                }
                addNews.update(
                    {newsid: req.query.newsid},                       // 查询项
                    {upvote:upvote, downvote:downvote},               // 修改项
                    {safe: true,multi: true},                         // 设置项
                    function(err, num){
                        if(err) {console.log(err);}
                        if(num){
                            console.log('更新vote: ' + num);
                            res.send('num');
                        }
                    }
                );
            }
        }
    );
};








