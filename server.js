
/**
 * Module dependencies.
 */
 

/* 核心模块 */
var express = require('express');
var http = require('http');
var path = require('path');
var ejs = require('ejs');

/* 自定义模块 */
var config               = require('./routes/config.js');
var logs                 = require('./routes/logs.js');
var channels             = require('./routes/channels.js');
var article              = require('./routes/article.js');
var comment              = require('./routes/comment.js');
var data                 = require('./routes/data.js');
var article_share        = require('./routes/article_share.js');

var app = express();

// all environments
app.set('port', process.env.PORT || 8000);   // 正式环境使用8080，测试环境用8000
app.set('views', __dirname + '/views');
app.engine('.html',ejs.__express);
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
//app.use(express.bodyParser());
app.use(express.bodyParser({uploadDir:'./temporary_store'}));
app.use(express.methodOverride());

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


//事件处理程序调度(路由器)
// app.get('/list/main',                          app_server.main);
// app.get('/list/refresh',                       app_server.refresh);
// app.get('/list/loadmore',                      app_server.loadMore);
// app.get('/comment',                            app_server.comment);
// app.get('/comment/refresh',                    app_server.commentRefresh);
// app.get('/comment/loadmore',                   app_server.commentLoadMore);
// app.get('/comment/write_comment',              app_server.writeComment);

// APP接口
app.get('/config',                             config.appConfig);
app.get('/ios/uuid',                           logs.iosUUID);

app.get('/list',                               channels.lists);

app.get('/article',                            article.readArticle);
app.get('/article/other',                      article.readOther);
app.get('/article/praise',                     article.clickPraise);
app.get('/article/share_info',                 article.shareInfo);
app.get('/article/share_success',              article.clickShare);

app.get('/comment',                            comment.readComment);
app.get('/comment/write_comment',              comment.writeComment);

// 分享出去的页面
app.get('/article_share',                      article_share.shareOut);
// 下载页面
app.get('/download',                           article_share.download);

// 数据
app.get('/data/device',                        data.device);

console.log('我是本地测试环境：8000');


//端口监听
/*
if (!module.parent){
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
}
module.exports = app;
*/

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
