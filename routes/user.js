/* 登录&注册 */

/* 依赖的功能模块 */
var md5 = require('md5');

/* 依赖的数据模块 */
var mongoUser             = require('./../models/user.js');
var mongoCFB              = require('./../models/customerFeedback.js');
var mongoTopic            = require('./../models/topic.js');
var mongoFollowedTopic    = require('./../models/followedTopic.js');


/** ================= 新浪微博登录 ================ **/
/*
 * query包含：nickname, uid, portrait_url
 */
exports.weiboLogin = function(req, res) {
    console.log(req.query);  // 查看路径参数

    // 构建返回值
    var json = {
        errcode: 'normal',  // normal/err
        data:{}
    };

    // 检查此用户是否已存在？
    mongoUser.findOne({'weiboUser.weiboID': req.query.uid}, function(err, doc){
        if (err) {console.log(err)};
        if (doc) {
            console.log('此用户已存在' + req.query.nickname);
            weiboLoginSendBack(req, res, json, doc);  // 发送微博登录的响应
        } 
        else {
            console.log('这是一个新用户' + req.query.nickname);

            // 创建新用户
            var newUser = new mongoUser({
                weiboUser: {
                    nickname: req.query.nickname,
                    portraitURL: req.query.portrait_url,
                    weiboID: req.query.uid
                }
            });
            newUser.save(function(err,doc,num){
                if (err) {console.log(err)};
                if (doc) {
                    console.log('创建一个新用户' + doc.weiboUser.nickname);
                    weiboLoginSendBack(req, res, json, doc);  // 发送微博登录的响应
                }
            });

        }
    });

    // res.send(json);
};

/** 发送微博登录的响应 **/
function weiboLoginSendBack(req, res, json, doc) {
    json.data = {
        userType: 'weibo',
        weiboID: doc.weiboUser.weiboID,
        nickname: doc.weiboUser.nickname,
        portraitURL: doc.weiboUser.portraitURL
    };
    res.send(json);
}





/** ========================= 用户反馈 ========================== **/
/*
 * query包含：user_type, uid, content, device_type, device_id
 */
exports.customerFeedback = function (req, res) {
    console.log(req.query);  // 查看路径参数

    // 构建返回值
    var json = {
        errcode: 'normal',  // normal/err
        data: true
    };

    var newCFB = new mongoCFB({
        userType: req.query.user_type,
        uid: req.query.uid,
        deviceType: req.query.device_type,
        deviceID: req.query.device_id,
        createTime: new Date(),
        content: req.query.content
    });
    newCFB.save(function(err,doc,num){
        if (err) {console.log(err)};
        if (doc) {
            console.log('保存用户反馈成功'+ doc);
            json.data = doc;
            res.send(json);
        }
    });
};






/** =================== 我关注的topics 接口 =================== **/

exports.myTopics = function(req, res){
    console.log(req.query);
    var json = {
        errcode: 'normal',
        data: []
    };

    // 查询条件
    var query = {
        uid: req.query.uid
    };
    if (req.query.type == 'loadmore' && req.query.last_id) {  // 请求类型为 加载更多
        query._id = {$lt: req.query.last_id};
    }

    var option = {
        sort:{_id:-1},
        limit: 20
    };

    mongoFollowedTopic.find(query, null, option, function(err, docs){
        if (err || !docs) {
            console.log(err);
            json.errcode = 'err';
            res.send(json);
        } else if (docs.length == 0) {
            console.log('no followedTopics now');  // 还没有关注过 topic
            res.send(json);
        } else {
            console.log(docs);
            json.data = docs;
            res.send(json);
        }

    });

    // var item = {
    //     picURL:'https://img3.doubanio.com/view/photo/thumb/public/p802360792.jpg',
    //     title:'#夏帆moron#',
    //     updateTime:'更新于 2016年4月22日',
    //     isNotificationOn:'yes'
    // };
};




// // 访问注册页面
// exports.signupPage = function (req , res) {
//     res.render('signup');
// }

// // 注册
// exports.signup = function(req, res){
//     console.log('注册');
//     console.log(req.body);
//     // 检查油箱是否重复
    
//     // 处理req.body
//     var newUser = new addUser({
//         nickname: req.body.nickname,                   //用户昵称
//         createTime: new Date(),                        //创建时间
//         mail: req.body.mail,                           //邮箱
//         password: md5(req.body.password),              //密码
//         userid: new Date().getTime() + 'salt' + Math.round(Math.random()*100000)
//     });
//     newUser.save(function(err,doc,num){
//         if (err) {console.log(err)};
//         if (doc) {
//             console.log('注册成功:');
//             console.log(doc);
//             req.session.user = doc;             // 设置 session
//             res.redirect('/');
//         }
//     });
// };


// // 访问登录页面
// exports.loginPage = function (req , res) {
//     res.render('login');
// }

// // 登录
// exports.login = function(req, res){
//     console.log('登录');
//     console.log(req.body);
//     addUser.findOne(
//         {mail:req.body.mail, password:md5(req.body.password)},          // 查询项
//         function(err, doc){
//             if (err) {console.log(err)};
//             if (doc) {
//                 console.log('登录成功');
//                 req.session.user = doc;             // 设置 session
//                 res.redirect('/');
//             } else {
//                 console.log('用户名或密码不正确');
//                 res.send('用户名或密码不正确');
                
//             }
//         }
//     );
// };

// // 退出登录
// exports.logout = function (req, res) {
//     req.session = null;
//     res.redirect('/');
// };





