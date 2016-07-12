// 配置表

/* app 配置表 */
exports.appConfig = function (req, res) {

    // 检查 app 本地配置表时间是否跟服务器一致，若不一致则更新配置表

    console.log(req.query);

    var config = configList();
    if (req.query.update_time == config.updateTime) {
        var json = {
            errcode : 'normal',
            update : 'no'
        };
        res.send(json);
    }
    else {
        var json = {
            errcode : 'normal',
            update : 'yes',
            config : config
        };
        res.send(json);
    }
};


function configList () {
    var config = {
        updateTime : '2015-01-11',
        channels : ['每日精选','娱乐八卦','时尚','电影','内涵段子','旅行','二次元']
    }
    return config;
}