/* 话题详情 */

/* 依赖的功能模块 */
// var md5 = require('md5');

/* 依赖的数据模块 */
var mongoUser             = require('./../models/user.js');
var mongoTopic            = require('./../models/topic.js');
var mongoArticle          = require('./../models/article.js');
var mongofollowedTopic    = require('./../models/followedTopic.js');



/** =================== 话题详细信息 接口 =================== **/

exports.topicInfo = function(req, res){
    console.log(req.query);

    var json = {
        errcode: 'normal',
        data: {}
    };

    mongoTopic.findOne({title: req.query.title}, function(err, doc){
        if (err) { 
            console.log(err);
        } else if (!doc){
            console.log('find nothing');
            json.errcode = 'err';
            res.send(json);
        } else {
            json.data = {
                _id: doc._id,
                title: doc.title,
                introduction: doc.introduction,
                isFollowing: 'no',
                isPushOn: 'no'
            };
            checkIfFollowed(req,res,json);  // 检查与当前用户的关注关系
        }
    });
    // json.data = {
    //     topic: '#女神#',
    //     introduction: '户田惠梨香（1988年8月17日－）是日本兵库县神户市滩区出身的女演员，于堀越高等学校毕业。',
    //     isFollowing:'no',
    //     isPushOn:'yes'
    // };
};

/** 检查与当前用户的关注关系 **/
function checkIfFollowed(req, res, json){
    //
    mongofollowedTopic.find({uid: req.query.uid}, function(err, docs){
        if (err || !docs) {
            console.log(err);
            res.send(json);  // 查询出错则直接返回正常list
        } else if (docs.length == 0) {
            console.log('find no followed topics');
            res.send(json);  // 查询出错则直接返回正常list
        } else {
            console.log(docs);
            for (var i=0; i<docs.length; i++) {
                if (docs[i].title == req.query.title) {
                    console.log('user关注的话题' + req.query.title);
                    json.data['isFollowing'] = 'yes';
                    json.data['isPushOn'] = docs[i].isPushOn;
                }
            }
            console.log('user关系');
            console.log(json);
            res.send(json);
        }
    });
}





/** ======================= 话题下的文章list 接口 ===================== **/

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





/** ======================== 关注一个话题 接口 ======================== **/

exports.followOneTopic = function (req, res) {
    console.log(req.query);
    var json = {
        errcode: 'normal',
        data: {}
    };

    // 检查是否已经关注过
    mongofollowedTopic.findOne({uid: req.query.uid, title: req.query.topic}, function(err, doc){
        if (err) {
            console.log(err);
        } else if (doc) {
            console.log('已经关注过此topic');
            json.data = {isFollowing: 'yes'};
            res.send(json);
        } else {
            // 创建一个关注Topic
            var newfollowedTopic = new mongofollowedTopic({
                title: req.query.topic,
                portrait: req.query.portrait,
                introduction: req.query.introduction,
                followedTime: new Date(),
                isPushOn:'no',
                uid: req.query.uid
            });
            newfollowedTopic.save(function(err,doc,num){
                if (err) {
                    console.log(err);
                } else {
                    console.log(doc);
                    json.data = {isFollowing: 'yes'};
                    res.send(json);
                }
            });
        }
    });
};

// exports.followOneTopicccccc = function (req, res) {
//     console.log(req.query);

//     var json = {
//         errcode: 'normal',
//         data: {}
//     };

//     // 检查 topic 是佛已被关注
//     mongoUser.findOne(
//         {'weiboUser.weiboID': req.query.uid, 'followedTopics.topic': req.query.topic},
//         function (err, doc) {
//             if (err) {
//                 console.log(err);
//                 json.errcode = 'err';
//                 res.send(json)
//             } else if (!doc) {
//                 console.log('未关注，添加一条关注');
//                 updateTopic(req, res, json);  // 未关注则添加 Topic
//             } else {
//                 console.log('已关注此Topic了');
//                 res.send(json);  // 已关注则直接返回结果
//             }
//     });
// };


// function updateTopic(req, res, json){

//     var oneTopic = {
//         topic: req.query.topic,
//         portrait: req.query.portrait,
//         isPushOn: req.query.is_push_on,
//         introduction: req.query.introduction,
//         followedTime: new Date()
//     };

//     mongoUser.update(
//         {'weiboUser.weiboID': req.query.uid},  // 查询项
//         {$addToSet:{followedTopics: oneTopic}},  // 修改项，数组插入（不重复插入）
//         {safe: true, multi: true},  // 设置项
//         function (err, num) {
//             if (err) {
//                 console.log(err);
//                 json.errcode = 'err';
//                 res.send(json);
//             } else {
//                 console.log('修改' + num + '条记录');
//                 if (num == 0) {
//                     // 未查询成功
//                     json.errcode = 'err';
//                     res.send(json);
//                 } else {
//                     json.data = {
//                         isFollowing: 'yes'
//                     };
//                     res.send(json);
//                 }

//             }
//         }
//     );
// }



/** ======================== 取消关注一个话题 接口 ======================= **/

exports.cancelFollow = function (req, res) {
    console.log(req.query);

    var json = {
        errcode: 'normal',
        data: {}
    };

    mongofollowedTopic.remove({uid: req.query.uid, title: req.query.topic}, function(err, num){
        if (err) {
            console.log(err);
            json.errcode = 'err';
            res.send(json);
        } else {
            json.data = {isFollowing: 'no'};
            res.send(json);
        }
    });


    // mongoUser.update(
    //     {'weiboUser.weiboID': req.query.uid},  // 查询项
    //     {$pull:{followedTopics: {topic:req.query.topic}}},  // 修改项，数组删除
    //     {safe: true, multi: true},  // 设置项
    //     function (err, num) {
    //         if (err) {
    //             console.log(err);
    //             json.errcode = 'err';
    //             res.send(json);
    //         } else {
    //             console.log('删除' + num + '条记录');
    //             if (num == 0) {
    //                 // 未查询成功
    //                 json.errcode = 'err';
    //                 res.send(json);
    //             } else {
    //                 json.data = {
    //                     isFollowing: 'no'
    //                 };
    //                 res.send(json);
    //             }

    //         }
    //     }
    // );

};




/** ==================== 开启或关闭 push ===================== **/

exports.pushStatus = function(req, res){
    console.log(req.query);
    var json = {
        errcode: 'normal',
        data: {}
    };

    // 查询
    mongofollowedTopic.update(
        {uid: req.query.uid, title: req.query.topic},  // 查询项
        {isPushOn: req.query.is_push_on},  // 修改项
        function(err, num) {
            if (err) {
                console.log(err);
                json.errcode = 'err';
                res.send(json);
            } else {
                res.send(json);
            }
    });
};











