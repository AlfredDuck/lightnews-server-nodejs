/* 话题详情 */

/* 依赖的功能模块 */
// var md5 = require('md5');

/* 依赖的数据模块 */
var mongoUser             = require('./../models/user.js');
var mongoTopic            = require('./../models/topic.js');
var mongoArticle          = require('./../models/article.js');


/** 话题详细信息 接口 **/
exports.topicInfo = function(req, res){
    console.log(req.query);

    var json = {
        errcode: 'normal',
        data: {}
    };

    mongoTopic.findOne({title: req.query.title}, function(err, doc){
        if (err) { console.log(err);}
        if (!doc){
            console.log('find nothing');
            json.errcode = 'err';
            res.send(json);
        }
        else {
            json.data = doc;
            console.log(json);
            res.send(json);
        }
    });
    // json.data = {
    //     topic: '#女神#',
    //     introduction: '户田惠梨香（1988年8月17日－）是日本兵库县神户市滩区出身的女演员，于堀越高等学校毕业。',
    //     isFollowing:'no',
    //     isPushOn:'yes'
    // };
};



/* 话题下的文章list 接口 */
exports.articlesOfTopic = function(req, res){
    console.log(req.query);

    var json = {
        errcode: 'normal',
        data:[]
    };

    // 查询 article
    var query = {
        topic: req.query.topic
    };
    if (req.query.type == 'loadmore' && req.query.last_id) {  // 请求类型为 加载更多
        query._id = {$lt: req.query.last_id};
    }

    var option = {
        sort:{updateTime:-1, _id:-1},
        limit: 20
    };

    mongoArticle.find(query, null, option, function(err, docs){
        if (err) { console.log(err);}
        if (docs.length == 0){
            console.log('find nothing');
            json.errcode = 'err';
            res.send(json);
        }
        else {
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
            }
            console.log(json);
            res.send(json);
        }
    });

    // var item = {
    //     picURL:'http://f0.topitme.com/0/e1/d5/1114065570a4cd5e10m.jpg',
    //     topic:'#sunny女神#',
    //     topicImageURL:'https://img3.doubanio.com/view/photo/albumicon/public/p802360792.jpg',
    //     title:'借琐碎无章的细节，去反映大湖煤矿和花山的整体，透过一地肮脏，去表现生命之坚韧与生存之哀歌。牛奶光炊烟四起一地雪白，与黑暗的矿洞有赤裸裸的对照，日夜劳作的主人公们重复又重复，逐渐忘却了清晰的时间\n',
    //     hotScore:'评论23 点赞94'
    // };
};




/** 关注一个话题 接口 **/
exports.followOneTopic = function (req, res) {
    console.log(req.query);

    var json = {
        errcode: 'normal',
        data: {}
    };

    // 查询用户关注列表中是否有此 Topic，若没有，则增加一条 Topic；若有，则返回已关注
    mongoUser.findOne
};


/** 取消关注一个话题 接口 **/
exports.cancelFollowOneTopic = function (req, res) {
    console.log(req.query);

    var json = {
        errcode: 'normal',
        data: {}
    };
};











