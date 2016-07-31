/* 发现 */

/* 依赖的功能模块 */
// var md5 = require('md5');

/* 依赖的数据模块 */
var mongoUser             = require('./../models/user.js');
var mongoTopic            = require('./../models/topic.js');
var mongofollowedTopic    = require('./../models/followedTopic.js');


/** 全部分类 接口 **/
exports.classifications = function (req, res) {
    console.log(req.query);

    // 构建返回值
    var json = {
        errcode: 'normal',
        data: []
    };

    // 所有分类
    var class1 = {
        picURL:'http://i10.topitme.com/l027/10027560788ea9d9d7.jpg',
        classification: '娱乐八卦'
    };
    var class2 = {
        picURL:'http://f10.topitme.com/l/201012/06/12916127698128.jpg',
        classification: '新闻'
    };
    var class3 = {
        picURL:'http://f10.topitme.com/l/201012/06/12916130049707.jpg',
        classification: '萌妹子'
    };
    var class4 = {
        picURL:'http://i10.topitme.com/l027/10027559626fb40941.jpg',
        classification: '互联网'
    };
    var class5 = {
        picURL:'http://i10.topitme.com/l027/1002756173ce03e923.jpg',
        classification: '电影'
    };
    var class6 = {
        picURL:'http://f8.topitme.com/8/c9/3e/1114357887e183ec98m.jpg',
        classification: '萌妹子'
    };
    var class7 = {
        picURL:'http://fd.topitme.com/d/b9/b5/11143567225d8b5b9dm.jpg',
        classification: '互联网'
    };
    var class8 = {
        picURL:'http://fc.topitme.com/c/47/8d/11143439730c88d47cm.jpg',
        classification: '电影'
    };

    json.data = [class1, class2, class3, class4, class5, class6, class7, class8];
    
    res.send(json);
};



/** =================== 单个分类的话题列表 接口 ================= **/

exports.oneClassification = function(req, res){
    console.log(req.query);

    // 构建返回值
    var json = {
        errcode: 'normal',
        data:[]
    };

    // 查询某个分类下的话题
    var query = {
        classification: req.query.classification
    };

    if (req.query.type == 'loadmore' && req.query.last_id) {  // 请求类型为 加载更多
        query._id = {$lt: req.query.last_id};
        // $lt(<) $lte(<=) $gt(>) $gte(>=)
        // _id: {$lt: req.query.last_id}     // 小于 last cell 的id
    }
    var option = {
        sort:{updateTime:-1, _id:-1},
        limit: 20
    };

    // 查询出 Topic 列表
    mongoTopic.find(query, null, option, function(err, docs){
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
                    title: docs[i].title,
                    introduction: docs[i].introduction,
                    portrait: docs[i].portrait,
                    isFollowing: 'no'
                };
                json.data.push(item);
            };
            //console.log(json.data);

            if (req.query.uid) {
                console.log(1);
                checkIfFollowed(req,res,json);  // 检查关注关系
            } else {
                res.send(json);
            }
        }
    });
};


function checkIfFollowed(req, res, json){
    // 查询当前用户的 follow list
    mongofollowedTopic.find({uid: req.query.uid} ,function(err, docs){
        if (err || !docs) {
            console.log(err);
            res.send(json);  // 查询不到用户就直接返回正常的列表
        } else if (docs.length == 0) {
            console.log('find no follow relation');
            res.send(json);  // 查询不到用户就直接返回正常的列表
        } else {
            // 比对关注关系
            var classList = json.data;
            var followList = docs;
            for (var i=0; i<classList.length; i++) {
                for (var j=0; j<followList.length; j++) {
                    // 如果
                    if (classList[i].title == followList[j].title) {
                        console.log(33333333);
                        classList[i].isFollowing = 'yes';
                    }
                }
            }
            //console.log(classList);
            json.data = classList;
            res.send(json);
        }
    });
}



/** ======================== 最新话题 接口 ======================== **/

exports.latestTopics = function (req, res) {
    console.log(req.query);

    // 构建返回值
    var json = {
        errcode: 'normal',
        data: []
    };

    // 查询最新
    var query = {};
    if (req.query.type == 'loadmore' && req.query.last_id) {  // 请求类型为 加载更多
        query = {
            _id:{$lt: req.query.last_id}
        };
        // $lt(<) $lte(<=) $gt(>) $gte(>=)
        // _id: {$lt: req.query.last_id}     // 小于 last cell 的id
    }
    var option = {
        sort:{updateTime:-1, _id:-1},
        limit: 20
    };

    mongoTopic.find(query, null, option, function(err, docs){
        if (err) {
            console.log(err);
            json.errcode = 'err';
            res.send(json);
        }
        if (docs.length == 0){
            console.log('find nothing');
            res.send(json);
        }
        else {
            for (var i=0; i<docs.length; i++) {
                var item = {
                    _id: docs[i]._id,
                    title: docs[i].title,
                    introduction: docs[i].introduction,
                    portrait: docs[i].portrait,
                    isFollowing: 'no'
                };
                json.data.push(item);
            };
            //console.log(json.data);

            if (req.query.uid) {
                console.log(1);
                checkIfFollowed(req,res,json);  // 检查关注关系
            } else {
                res.send(json);
            }
        }
    });

    // var item = {
    //     picURL:'http://letsfilm.org/wp-content/uploads/2016/07/D1000001-200x133.jpg',
    //     title:'#三吉而苏尔#',
    //     introduction:'相对新垣结衣更喜欢她，爽朗的性格，爱上她的笑容',
    //     isFollowing:'no'
    // };
};







