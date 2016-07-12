// 主路由
// slogen : 好玩、有品的娱乐新闻——咸鱼腥闻

/* 功能模块 */

/* 数据模块 */
var addArticle = require('./../models/article.js');



/* 读取频道列表(普通频道) */
exports.lists = function(req, res){
    console.log('频道：' + req.query.channel);
    console.log(req.query);

    // 请求频道为 “每日精选”，则特殊处理...
    if (req.query.channel == '每日精选') {
        coreChannel2(req, res);
        return;
    }

    // 初始化返回值
    var json = {
        errcode: null,
        data: null,
        channel: req.query.channel
    };

    // 初始化查询条件
    var query = null;
    var option = {
        sort:{postTime:-1, _id:-1},  
        // xx.aa这种写法是对的，bingo; 以上使用了多条件排序，第一条件相同时按照第二条件排序，亲测可用
        limit: 20
    };

    // 请求类型为 刷新
    if (req.query.type == 'refresh') {
        query = {
            channel: req.query.channel
        };
    }

    // 请求类型为 加载更多
    // $lt(<) $lte(<=) $gt(>) $gte(>=)
    if (req.query.type == 'loadmore') {
        query = {
            channel: req.query.channel,
            '$or': [
                {'$and':[
                    {postTime: req.query.post_time},
                    {'_id':{$lt: req.query.last_id}}
                ]},
                {postTime: {$lt: req.query.post_time}}
            ]
            // 1.postTime相同而id小的
            // 2.postTime小的
            // _id: {$lt: req.query.last_id}     // 小于 last cell 的id
        }; 
    }

    // 查询数据库
    addArticle.find(query, null, option, function(err, docs){
        if (err) {
            console.log(err);
        }
        else if (docs.length == 0){
            console.log('find nothing');
            json.errcode = 'err';
            res.send(json);
        }
        else {
            console.log('find something');
            //console.log(docs);
            // 组织data中的内容
            var arr = [];
            for (var i=0; i<docs.length; i++) {
                var item = {
                    picBig:         docs[i].picBig,
                    picSmall:       docs[i].picSmall,
                    subtitle:       '人气 ' + docs[i].pageView,
                    title:          docs[i].title,
                    _id:            docs[i]._id,
                    postTime:       docs[i].postTime,
                    pageView:       docs[i].pageView
                };
                arr.push(item);
            }
            json.errcode = 'normal';
            json.data = arr;
            res.send(json);
        }
    });
};




/*-------------------------------------------------------*/
/* 精选频道 */
function coreChannel (req, res) {

    console.log('呵呵，我还不知道怎么玩');

    // 初始化返回值
    var json = {
        errcode: null,
        data: null,
        channel: req.query.channel
    };

    // 初始化查询条件
    var query = null;
    var option = {
        sort:{hotScore:-1, postTime:-1},
        // xx.aa这种写法是对的，bingo; 以上使用了多条件排序，第一条件相同时按照第二条件排序，亲测可用
        limit: 10
    };

    // 请求类型为 刷新
    if (req.query.type == 'refresh') {
        // 查询数据库
        checkDataBase(json, query, option, req, res);
    }

    // 请求类型为 加载更多
    if (req.query.type == 'loadmore') {
        // 读取最后一个cell的id
        addArticle.findOne({_id: req.query.last_id}, function(err, doc){
            if (err) {
                console.log(err);
            }
            else if (!doc) {
                console.log('find nothing');
            }
            else {
                hot_ = doc.hotScore
                console.log('热度得分：' + hot_);
                query = {
                    'hotScore': {'$lt': hot_}
                    // hotScore 相同的概率非常小...所以就不纠结了，用太复杂的查询会栈溢出
                    // '$or': [
                    //     {'$and':[
                    //         {'hotScore': hot_},
                    //         {'_id':{$lt: req.query.last_id}}
                    //     ]},
                    //     {'hotScore': {$lt: hot_}}
                    // ]
                    // 1.postTime相同而id小的
                    // 2.postTime小的
                    // $lt(<) $lte(<=) $gt(>) $gte(>=)
                }; 
                // 查询数据库
                checkDataBase(json, query, option, req, res);
            }
        });
    }
}

// 查询数据库
function checkDataBase(json, query, option, req, res) {
    // 查询数据库
    addArticle.find(query, null, option, function(err, docs){
        if (err) {
            console.log(err);
        }
        else if (docs.length == 0){
            console.log('find nothing');
            json.errcode = 'err';
            res.send(json);
        }
        else {
            console.log('find something');
            //console.log(docs);
            // 组织data中的内容
            var arr = [];
            for (var i=0; i<docs.length; i++) {
                var item = {
                    picBig:         docs[i].picBig,
                    picSmall:       docs[i].picSmall,
                    subtitle:       '人气 ' + docs[i].pageView,
                    title:          docs[i].title,
                    _id:            docs[i]._id,
                    postTime:       docs[i].postTime,
                    pageView:       docs[i].pageView
                };
                arr.push(item);
            }
            json.errcode = 'normal';
            json.data = arr;
            res.send(json);
        }
    });
}







/*-------------------精选频道 第二版----------------------*/
/*
 * 首页频道只显示经过热度计算，符合热门的内容
 * 按照发布的时间排序
 */

function coreChannel2 (req, res){
    console.log('访问首页频道列表');
    console.log(req.query);

    // 初始化返回值
    var json = {
        errcode: null,
        data: null,
        channel: req.query.channel
    };

    // 初始化查询条件
    var query = {
        'showInHome.showInHome': 1
    };
    var option = {
        sort:{'postTime': -1, '_id': -1},
        // xx.aa这种写法是对的，bingo; 以上使用了多条件排序，第一条件相同时按照第二条件排序，亲测可用
        limit: 20
    };

    // 请求类型为 刷新
    if (req.query.type == 'refresh') {
        
    }

    // 请求类型为 加载更多
    if (req.query.type == 'loadmore') {
        query = {
            'showInHome.showInHome': 1,
            'postTime':  {$lte: req.query.post_time},
            '_id': {$lt: req.query.last_id}
            // '$or': [
            //     {'$and':[
            //         {'showInHome.timeOfGetScore': req.query.post_time},
            //         {'_id':{$lt: req.query.last_id}}
            //     ]},
            //     {'showInHome.timeOfGetScore': {$lt: req.query.post_time}}
            // ]
            // $lt(<) $lte(<=) $gt(>) $gte(>=)
        };
    }

    // 执行查询
    addArticle.find(query,null,option, function(err, docs){
        if (err) {
            console.log(err);
            json.errcode = 'err';
            res.send(json);
        } 
        else if (docs.length == 0){
            console.log('find nothing');
            json.errcode = 'err';
            res.send(json);
        }
        else {
            console.log('find something');
            //console.log(docs);
            // 组织data中的内容
            var arr = [];
            for (var i=0; i<docs.length; i++) {
                var item = {
                    picBig:         docs[i].picBig,
                    picSmall:       docs[i].picSmall,
                    subtitle:       '人气 ' + docs[i].pageView,
                    title:          docs[i].title,
                    _id:            docs[i]._id,
                    postTime:       docs[i].postTime,
                    pageView:       docs[i].pageView
                };
                arr.push(item);
            }
            json.errcode = 'normal';
            json.data = arr;
            res.send(json);
        }
    });


};














