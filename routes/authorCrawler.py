#coding=utf-8

# 用于录入一些初始化数据的，后期可删除~


# 标准模块 or 第三方模块
import copy
import time
import datetime
import pymongo
import urllib2
import urllib
from bs4 import BeautifulSoup as bs
from bson import ObjectId


# 连接 mongodb 客户端
client = pymongo.MongoClient('127.0.0.1', 10001)
# 连接对应的 db
db = client['salt220']
# 连接对应的 collection
mongoTopic = db['topics']
mongoArticle = db['articles']


# Part 1 : 录入 topic
def insertTopic ():

    for i in range(1):
        # 创建 author 字典
        newTopic = {
            'title' : '#sunshine' + str(i) + '#',
            'introduction' : '夏季是适合佩戴饰品的季节。无论是戒指、耳饰或是项链，在夏天均是展现个性的平台',
            'portrait' : 'http://f5.topitme.com/5/00/5a/11140654276605a005m.jpg',
            'updateTime': '2016-09-09',
            'createTime': '2016-08-08',
            'followNum': 230298739,
            'classification': ['娱乐八卦','萌妹子']
        }

        # 新增一条 author, 返回值是_id
        ID = mongoTopic.insert(newTopic)
        print ID
        # 检查一下是否存入
        result = mongoTopic.find_one({'_id':ObjectId(ID)})
        print result['title']  


# Part 2 : 标记 article
def updateArticle ():
    rs = mongoArticle.update_many(
        {'channel': '娱乐八卦'},  # 查询项
        {'$set': {'topic': ['#sunshine0#','#毒舌电影大法好49#','#毒舌电影大法好48#']}},  # 修改项，如果没有就创建这一项
        False, False
    )
    print rs


if __name__ == '__main__':
    # insertTopic()
    updateArticle()





