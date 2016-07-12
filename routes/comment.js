// comment

/* 功能模块 */

/* 数据模块 */
var addArticle = require('./../models/article.js');
var addComment = require('./../models/comment.js');


exports.readComment = function (req, res) {
    //
    console.log('读取评论');
    console.log(req.query);

    // 初始化返回值
    var json = {
        errcode: null,
        data: null,
        articleID: req.query.article_id
    };

    // 初始化查询条件
    var query = null;
    var option = {
        sort:[['_id', -1]],
        limit: 10
    };

    // 请求类型为 刷新
    if (req.query.type == 'refresh') {
        query = {
            articleID: req.query.article_id
        };
    }

    // 请求类型为 加载更多
    if (req.query.type == 'loadmore') {
        query = {
            articleID: req.query.article_id,
            _id: {$lt: req.query.last_id}     // 小于 last cell 的id
        }; 
    }

    addComment.find(query, null, option, function(err, docs){
        if (err) {
            console.log(err);
        }
        else if (docs.length == 0){
            json.errcode = 'err';
            console.log(json);
            res.send(json);
        }
        else {
            json.errcode = 'normal';

            var arr = [];
            for (var i=0; i<docs.length; i++) {
                // 处理 createTime
                var day = new Date(docs[i].createTime);
                var Y = day.getFullYear() + '-';
                var M = (day.getMonth()+1 < 10 ? '0'+(day.getMonth()+1) : day.getMonth()+1) + '-';
                var D = day.getDate() + ' ' ;
                var h = day.getHours() + ':';
                var m = day.getMinutes() + ':';
                var s = day.getSeconds(); 
                var time = Y + M + D + h + m + s;

                var item = {
                    _id: docs[i]._id,
                    text: docs[i].text,
                    articleID: docs[i].articleID,
                    nickname: docs[i].nickname,
                    createTime: time
                }
                arr.push(item);
            }

            json.data = arr;
            console.log(json);
            res.send(json);
        }
        
    });
};


exports.writeComment = function (req, res) {
    //
    console.log('发布评论');
    console.log(req.query);

    var json = {
        errcode: null
    };

    // 保存评论
    var newComment = new addComment({
        text: req.query.text,
        createTime: new Date(),
        articleID: req.query.article_id,
        nickname: req.query.nickname,
        uuid: req.query.uuid
    });
    newComment.save(function(err, doc, num){
        if (err) {
            console.log(err);
            json.errcode = 'err';
            res.send(json);
        }
        else {
            console.log('发布成功');
            json.errcode = 'normal';
            res.send(json);
        }
    });

    // 评论数 +1
    addArticle.findOne({_id: req.query.article_id}, function(err, doc){
        // hello world
        if (err) {
            console.log(err);
        } else if (!doc) {
            console.log('find none');
        } else {
            var originalCommentNum = doc.commentNum;
            console.log('原评论数' + originalCommentNum);
            addArticle.update(
                {_id: req.query.article_id},               // 查询项
                {commentNum: originalCommentNum + 1},      // 修改项
                {safe: true, multi: true},                 // 设置项
                function(err, num){
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('更新commentNum + ' + num);
                    }
            });
        }
    });
};




