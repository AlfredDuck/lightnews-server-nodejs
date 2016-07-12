// 内容源

var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var resourceSchema = new Schema({
    name : String,
    portrait : String,
    url : String,
    article_list : Array
});

module.exports = mongodb.mongoose.model("resource", resourceSchema);

