// 发布内容

// 依赖的模块
var addNews             = require('./../models/news.js');
var addComment          = require('./../models/comment.js');

// 第三方模块
var readability         = require('node-readability');
var cheerio             = require('cheerio');                   // 用法跟jQuery几乎一样


/************************************************/
/* 发布一个 news */
/************************************************/
exports.publishNews = function(req, res){
    console.log('发布一个 text news');

    // 检查是否登录
    if (!req.session.user) {
        console.log('未登录');
        res.send('未登录');
        return;
    }
    console.log('登录账户:' + req.session.user.nickname);

    // 保存要发布的内容
    var newNews = new addNews({
        link: null,
        myword: req.query.text,                     // 我的评论
        user:{                                      // 创建人
            userid: req.session.user.userid,
            nickname: req.session.user.nickname
        },
        createTime: new Date(),                     // 创建时间
        withLink: false,
        newsid: new Date().getTime(),
        upvote: 0,
        downvote: 0,
        commentNum: 0
    });
    if (req.query.outside) {                        // 如果带外链，则增加外链内容
        newNews.withLink = true;
        newNews.link = {
            originURL: req.query.outside.originURL,
            title: req.query.outside.title,
            text: req.query.outside.text,
            img: req.query.outside.img
        };
    }
    newNews.save(function(err, doc, nun){
        console.log(doc);
        res.send('helloworld');
    });
};


/************************************************/
/* 处理要解析的 URL */
/************************************************/
exports.visitOutsideLink = function(req, res){
    console.log('处理并访问外链');
    var link = req.query.link;
    console.log(link);

    readability(link, function(err, article, meta) {
        // Main Article 
        //console.log(article.content);
        // Title 
        //console.log(article.title);
        // // HTML Source Code 
        // console.log(article.html);
        // // DOM 
        // console.log(article.document);
        // // Response Object from Request Lib 
        // console.log(meta);

        if (err) {
            console.log(err);
            return;
        } 

        var html = '<html><head><meta charset="utf-8"><title>'+
                    article.document.title+'</title></head><body><h1>'+
                    article.title+'</h1>'+article.content+'</body></html>';

        var $ = cheerio.load(html);
        var imgURL = $('img').attr('src');          // 取第一张图片url
        var text = $('p').text();                   // 取正文的字符串
        if (text.length >= 140) {                   // 正文只保存前140字
            text = text.substring(0, 140);
        }

        // console.log(imgURL);
        // console.log(text);
        // console.log(article.title);

        var result = {
            originURL: link,
            title: article.title,
            text: text,
            img: imgURL
        };

        // // Close article to clean up jsdom and prevent leaks 
        article.close();

        res.send(result);
    });
};


/************************************************/
/* 调用python----http://www.tuicool.com/articles/J77VVvy */
/************************************************/
function python () {
    var call = require('child_process');
    // 参数放在中括号里，python的print作为结果返回
    call.execFile('python',['routes/pyfile/demo.py', link], function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            // result = eval(result);
            console.log(result);
        }
    });
}









