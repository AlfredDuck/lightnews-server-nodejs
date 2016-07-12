#coding=utf-8

#豆瓣电影 cookie
import sys
import urllib2
import urllib
from bs4 import BeautifulSoup as bs

# python 的传参调用, shell脚本为python demo.py a b c
# print u"shell name: ", sys.argv[0]
# for i in range(1, len(sys.argv)):      #这里参数从1开始
#     print u"argv: ", i, sys.argv[i]

# 访问链接
url = sys.argv[1]                           # 要访问的url放在第二个参数里
req = urllib2.Request(url)                  # 构造请求
res = urllib2.urlopen(req)                  # 发起请求并获得请求结果
text_res = res.read()                       # 结果转为文本格式

# 处理网页
soup = bs(text_res, 'html.parser')          # 将网页内容转为soup对象，并指定解析方式
for tag in soup.find_all('a'):
    print








#----------------------------新与旧的分割线----------------------------------




# values = {'search_text':'狼人', 'cat':1002}
# url = "http://movie.douban.com/subject_search"
# data = urllib.urlencode(values)

# request = urllib2.Request(url, data)
# response = urllib2.urlopen(request)
# # print response.read()

# soup = bs(response.read(), 'html.parser')
# print soup.find_all('a')
# for url in soup.find_all('a'):
#     print url




# Python读取文件
# f = open("taici.txt")             # 返回一个文件对象
# line = f.readline()               # 调用文件的 readline()方法
# while line:
#     print line,                   # 后面跟 ',' 将忽略换行符
#     line = f.readline()

# f.close()


# f = open('taici.txt')
# num = f.readlines()                 # 逐行读取文件，并生成数组
# print num[3],                       # 后面跟 ',' 将忽略换行符
# f.close()






