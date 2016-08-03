/* 首页相关接口 */


/* 依赖的功能模块 */

/* 依赖的数据模块 */
var mongoTopic            = require('./../models/topic.js');
var mongoArticle          = require('./../models/article.js');
var mongoFollowedTopic    = require('./../models/followedTopic.js');









/** ====================== 热门文章 & 热门话题 接口 ======================= */

exports.hots = function(req, res){
    console.log(req.query);

    var json = {
        errcode: 'normal',
        data: {
            hotArticles: [],
            hotTopics: []
        }
    };

    // 查询 Topic
    mongoTopic.find(null,null, {limit:3}, function(err, docs1){
        if (err) {console.log(err);}
        if (!docs1 || docs1.length == 0) {
            console.log('find nothing');
            json.errcode = 'err';
            res.send(json);
        }
        else {
            // 组合数据
            for (var i=0; i<docs1.length; i++) {
                var item = {
                    picURL: docs1[i].portrait,
                    topic: docs1[i].title
                };
                json.data.hotTopics.push(item);
            };

            // 查询 Article
            mongoArticle.find({},{}, {limit:2}, function(err, docs2){
                if (err) {console.log(err);}
                if (!docs2 || docs2.length == 0) {
                    console.log('find nothing');
                    json.errcode = 'err';
                    res.send(json);
                }
                else {
                    // 组合数据
                    for (var i=0; i<docs2.length; i++) {
                        var item = {
                            picURL: docs2[i].picSmall,
                            title: docs2[i].title,
                            articleID: docs2[i]._id
                        };
                        json.data.hotArticles.push(item);
                    };
                    res.send(json);
                }
            });
        }
    });
};












/* ======================= 关注的话题下的最新文章 ======================= */

exports.followedArticles = function(req, res){
    console.log('关注的话题下的文章：' );
    console.log(req.query);

    var json = {
        errcode: 'normal',
        data:[]
    };
    
    if (req.query.uid) {
        // 若当前用户已登录，则加载其关注的话题
        loadFollowedTopic(req,res,json);
    } else {
        // 若当前用户未登录，则加载默认话题下
        res.send(json);
    }
};

function loadFollowedTopic(req, res, json){
    // 查询我关注的话题
    mongoFollowedTopic.find({uid: req.query.uid}, function(err, docs){
        if (err || !docs) {
            console.log(err);
            json.errcode = 'err';
            res.send(json);
        } else if (docs.length == 0){
            console.log('find no followed topics');
            res.send(json);
        } else {
            console.log('我关注的话题有：');
            var topicArr = [];
            for (var i=0; i<docs.length; i++) {
                topicArr.push(docs[i].title);
            }
            console.log(topicArr);
            loadFollowedArticle(req,res,json,topicArr);  // 查询文章
        }
    });
}



function loadFollowedArticle(req,res,json,topicArr){
    // 查询条件
    var query = {
        topic:{$in: topicArr}
    };
    if (req.query.type == 'loadmore' && req.query.last_id) {  // 请求类型为 加载更多
        query._id = {$lt: req.query.last_id};
    }

    var option = {
        sort:{_id:-1},
        limit: 20
    };

    // 查询话题对应的文章
    mongoArticle.find(query, null, option, function(err, docs){
        if (err || !docs) {
            console.log(err);
            json.errcode = 'err';
            res.send(json);
        } else if (docs.length == 0) {
            console.log('find no aritcles');
            console.log(json);
            res.send(json);
        } else {
            console.log('文章：');
            // console.log(docs);

            // 查询 Topic 图片
            mongoTopic.find({title:{$in: topicArr}}, function(err,topicDocs){
                console.log('topic and pics');
                topicArr = topicDocs;
                console.log(topicArr);

                // 组合要返回的数据
                for (var i=0; i<docs.length; i++){
                    var oneArticle = docs[i];
                    var oneTopic = '';

                    // 检查文章下的Topics中，哪个需要显示在文章里
                    for (var j=0; j<oneArticle.topic.length; j++){
                        for (var k=0; k<topicArr.length; k++){
                            // 比较 两个Topic是否相同
                            if (oneArticle.topic[j] == topicArr[k].title){
                                oneTopic = topicArr[k];
                            }
                        }
                    }

                    var item = {
                        _id: oneArticle._id,
                        picURL: oneArticle.picSmall,
                        topic: oneTopic.title,
                        topicImageURL: oneTopic.portrait,
                        title: oneArticle.title,
                        hotScore:'评论' + oneArticle.commentNum + ' 点赞' + oneArticle.praiseNum,
                        date: oneArticle.postTime
                    };
                    json.data.push(item);
                };
                //console.log(json);
                res.send(json); 
            });
        }
    });
}






