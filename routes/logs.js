// 数据统计

var addDevice = require('./../models/device.js');

exports.iosUUID = function (req, res) {
    console.log('iOS—uuid统计');
    console.log(req.query.uuid);

    var json = {
        errcode: 'normal'
    };

    addDevice.findOne({uniqueID: req.query.uuid}, function(err, doc){
        if (err) {
            console.log(err);
        }
        else if (doc){
            console.log('已有这个device，更新时间');
            var arr = doc.visitLogs;
            arr.push(new Date());
            addDevice.update(
                {uniqueID: doc.uniqueID},              // 查询项
                {visitLogs: arr},                      // 修改项
                {safe: true, multi: true},             // 设置项
                function(err, num){
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('更新device + ' + num);
                        res.send(json);
                    }
            });
        }
        else {
            console.log('没有这个device，创建一个');
            var arr = [];
            arr.push(new Date());

            var newDevice = new addDevice({
                system: 'ios',
                uniqueID: req.query.uuid,
                visitLogs: arr
            });
            newDevice.save(function(err, doc2, num){
                if (err) {
                    console.log(err);
                } else {
                    console.log('新建一个device + ' + doc2);
                    res.send(json);
                }
            });
        }
    });
};












