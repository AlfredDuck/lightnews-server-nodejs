// 咸鱼腥闻 APP server

exports.main = function(req, res) {
    console.log(req.query);
    var cell;
    switch (req.query.channel) {
        case '每日精选':
        cell = {
            title : '咸鱼腥闻在那個蒸氣時代裡，一切都以蒸氣為動力。煙霧瀰漫的帝都，怪盜、怪人橫行肆虐',
            picSmall : 'http://img3.douban.com/view/photo/photo/public/p2254155572.jpg',
            picBig : 'http://img3.douban.com/view/photo/photo/public/p775024334.jpg',
            hotDegree : '23333',
            num: 12
        };
        break;

        case '八卦':
        cell = {
            title : '八卦生理が始まる2日前緒川りお',
            picSmall : 'http://img3.doubanio.com/view/photo/photo/public/p2302473589.jpg',
            picBig : 'http://img3.douban.com/view/photo/photo/public/p2267155152.jpg',
            hotDegree : '46666',
            num: 6
        };
        break;

        case '二次元':
        cell = {
            title : '二次元生理が始まる2日前緒川りお',
            picSmall : 'http://img3.doubanio.com/view/photo/photo/public/p2302473589.jpg',
            picBig : 'http://img3.douban.com/view/photo/photo/public/p2249389341.jpg',
            hotDegree : '46666',
            num: 30
        };
        break;

        case '电影':
        cell = {
            title : '电影生理が始まる2日前緒川りお',
            picSmall : 'http://img3.doubanio.com/view/photo/photo/public/p2302473589.jpg',
            picBig : 'http://img4.douban.com/view/photo/photo/public/p2249388527.jpg',
            hotDegree : '46666',
            num: 20
        };
        break;
        default :
        cell = {
            title : '实话说今年没有像以往那样，沉溺于动画片中不能自拔，相反观影的兴趣也慢慢向真人电影转移开来',
            picSmall : 'http://img3.doubanio.com/view/photo/photo/public/p2302473589.jpg',
            picBig : 'http://img3.douban.com/view/photo/photo/public/p2239488021.jpg',
            hotDegree : '46666',
            num:100
        };
    }

    var arr = [];
    for (var i=0; i<cell.num; i++) {
        arr.push(cell);
    }

    var json = {
        err: 'no',
        data: arr,
        channel: req.query.channel
    };
    res.send(json);
};

exports.refresh = function(req, res) {
    var cell = {
        title : 'refresh生理が始まる2日前緒川りお',
        picSmall : 'http://img3.douban.com/view/photo/photo/public/p2300742150.jpg',
        picBig : 'http://img3.douban.com/view/photo/photo/public/p2300742150.jpg',
        hotDegree : '46666',
        num: 6
    };

    var arr = [];
    for (var i=0; i<cell.num; i++) {
        arr.push(cell);
    }

    var json = {
        err: 'no',
        data: arr,
        channel: req.query.channel
    };
    res.send(json); 
};

exports.loadMore = function(req, res) {
    var cell = {
        title : '加载更多',
        picSmall : 'http://img4.douban.com/view/photo/photo/public/p2303139237.jpg',
        picBig : 'http://img4.douban.com/view/photo/photo/public/p2303139237.jpg',
        hotDegree : '46666',
        num: 6
    };

    var arr = [];
    for (var i=0; i<cell.num; i++) {
        arr.push(cell);
    }

    var json = {
        err: 'no',
        data: arr,
        channel: req.query.channel
    };
    res.send(json); 
};

exports.comment = function (req, res) {
    var cell = {
        nickName : '藤井莉娜',
        createTime : '2014-09-08',
        comment : '杨过很爱郭靖，很希望郭靖就是他的父亲。 杨过又几乎有点恨郭靖，事实上不是自己的父亲。 这感情听来稍微有些别扭，然而正反相成。 于是，杨过一直想用某种方式，来对抗“郭伯伯不是我父亲”的遗憾'
    };

    var arr = [];
    for (var i=0; i<6; i++) {
        arr.push(cell);
    }

    var json = {
        err: 'no',
        data: arr
    };
    res.send(json);
};

exports.commentRefresh = function (req ,res) {
    var cell = {
        nickName : '藤井莉娜refresh',
        createTime : '2014-09-08',
        comment : '杨过很爱郭靖，很希望郭靖就是他的父亲。 杨过又几乎有点恨郭靖，事实上不是自己的父亲。 这感情听来稍微有些别扭，然而正反相成。 于是，杨过一直想用某种方式，来对抗“郭伯伯不是我父亲”的遗憾'
    };

    var arr = [];
    for (var i=0; i<6; i++) {
        arr.push(cell);
    }

    var json = {
        err: 'no',
        data: arr
    };
    res.send(json);
};

exports.commentLoadMore = function (req ,res) {
    var cell = {
        nickName : '藤井莉娜loadmoreloadmoreloadmore',
        createTime : '2014-09-08',
        comment : '杨过很爱郭靖，很希望'
    };

    var arr = [];
    for (var i=0; i<6; i++) {
        arr.push(cell);
    }

    var json = {
        err: 'no',
        data: arr
    };
    res.send(json);
};

exports.writeComment = function (req ,res) {
    console.log('发布评论');
    console.log(req.query);

    var json = {
        err: 'no',
        data: [],
        status: 'success'
    };
    res.send(json);
}







