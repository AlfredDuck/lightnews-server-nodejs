/* 首页相关接口 */


/* 依赖的功能模块 */

/* 依赖的数据模块 */


/* 热门文章 */
exports.hotArticles = function(req, res){
    console.log(req.query);

    var json = {
        errcode: 'normal',
        data: []
    };

    
    var json = {
        picURL:'xxxx',
        article_id:'xxxx',
        title:'吴亦凡事件始末'
    }
    res.send('ddd');
};


/* 热门话题 */
exports.hotArticles = function(req, res){

};


/* 关注的话题下的最新文章 */
exports.followedArticles = function(req. res){

};