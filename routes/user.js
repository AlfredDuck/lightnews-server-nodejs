// 登录&注册
var md5 = require('md5');
var addUser = require('./../models/user.js');

// 访问注册页面
exports.signupPage = function (req , res) {
    res.render('signup');
}

// 注册
exports.signup = function(req, res){
    console.log('注册');
    console.log(req.body);
    // 检查油箱是否重复
    
    // 处理req.body
    var newUser = new addUser({
        nickname: req.body.nickname,                   //用户昵称
        createTime: new Date(),                        //创建时间
        mail: req.body.mail,                           //邮箱
        password: md5(req.body.password),              //密码
        userid: new Date().getTime() + 'salt' + Math.round(Math.random()*100000)
    });
    newUser.save(function(err,doc,num){
        if (err) {console.log(err)};
        if (doc) {
            console.log('注册成功:');
            console.log(doc);
            req.session.user = doc;             // 设置 session
            res.redirect('/');
        }
    });
};


// 访问登录页面
exports.loginPage = function (req , res) {
    res.render('login');
}

// 登录
exports.login = function(req, res){
    console.log('登录');
    console.log(req.body);
    addUser.findOne(
        {mail:req.body.mail, password:md5(req.body.password)},          // 查询项
        function(err, doc){
            if (err) {console.log(err)};
            if (doc) {
                console.log('登录成功');
                req.session.user = doc;             // 设置 session
                res.redirect('/');
            } else {
                console.log('用户名或密码不正确');
                res.send('用户名或密码不正确');
            }
        }
    );
};

// 退出登录
exports.logout = function (req, res) {
    req.session = null;
    res.redirect('/');
};





