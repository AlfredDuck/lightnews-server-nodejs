/* 首页相关接口 */


/* 依赖的功能模块 */

/* 依赖的数据模块 */
var mongoTopic            = require('./../models/topic.js');
var mongoArticle          = require('./../models/article.js');


/* 热门文章 & 热门话题 接口 */
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
            mongoArticle.find({},{}, {limit:5}, function(err, docs2){
                if (err) {console.log(err);}
                if (!docs2 || docs2.length == 0) {
                    console.log('find nothing');
                    json.errcode = 'err';
                    res.send(json);
                }
                else {
                    // 组合数据
                    for (var i=0; i<docs1.length; i++) {
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

    // var item1 = {
    //     picURL:'https://img3.doubanio.com/view/dianpu_product_item/large/public/p427973.jpg',
    //     article_id:'1234567890',
    //     title:'001《再次寻找周杰伦》是瑞琦对偶像周杰伦的一种致敬'
    // };
};



/* 关注的话题下的最新文章 */
exports.followedArticles = function(req, res){
    console.log(req.query);

    var json = {
        errcode: 'normal',
        data:[]
    };

    mongoArticle.find({}, {}, {limit:10}, function(err, docs){
        if (err) {console.log(err);}
        if (!docs || docs.length == 0) {
            console.log('find nothing');
            json.errcode = 'err';
            res.send(json);
        }
        else {
            // 组合数据
            for (var i=0; i<docs.length; i++) {
                var item = {
                    _id: docs[i]._id,
                    picURL: docs[i].picSmall,
                    topic: req.query.topic,
                    title: docs[i].title,
                    hotScore:'评论' + 23 + ' 点赞' + 94,
                    date: docs[i].postTime
                };
                json.data.push(item);
            };
            res.send(json);
        }
    });

    // var item = {
    //     picURL:'https://img3.doubanio.com/view/photo/albumicon/public/p730135166.jpg',
    //     topic:'#金瓶梅的话语#',
    //     topicImageURL:'https://img3.doubanio.com/view/photo/albumicon/public/p802360792.jpg',
    //     title:'夏帆是日本清纯派明星的代表人物，她纤婉出尘，具有少见的透明感，是标准的美少女\n',
    //     hotScore:'评论23 点赞94'
    // };
};



// ============================ 发现页面 =================================



// ===================== “我的”页面 ======================
/* 新浪微博登录 */
/*
 * 新浪昵称、新浪id、头像url
 */
exports.weiboLogin = function (req, res){
    console.log(req.query);
    var json = {
        errcode: 'normal',
        data: req.query
    };
    res.send(json);
};


/* 用户反馈 接口 */
exports.customerFeedback = function(req, res) {
    console.log(req.query);
    var json = {
        errcode: 'normal',
        data: ''
    };
    res.send(json);
};


/* 我的话题list 接口 */
exports.myTopics = function(req, res){
    console.log(req.query);
        var json = {
        errcode: 'normal',
        data: []
    };

    var item = {
        picURL:'https://img3.doubanio.com/view/photo/thumb/public/p802360792.jpg',
        title:'#夏帆moron#',
        updateTime:'更新于 2016年4月22日',
        isNotificationOn:'yes'
    };

    for (var i = 20; i >= 0; i--) {
        json.data.push(item);
    }
    res.send(json);
};



// ========================= 话题详情页 ===========================









