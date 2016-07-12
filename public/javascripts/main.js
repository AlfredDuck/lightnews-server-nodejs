// 前端主文件
$(document).ready(function(){
    //submitText();
    //submiteLink();
    //clickGetLink();
    upVote();
    downVote();
});

//
function clickGetLink(){
    $('#get_link').bind('click', function(){
        alert('dd');
        visitLink();
    });
}


// 提交 link 内容
function submiteLink(){
    $('#submit_link').bind('click', function(){
        var myword = $('#link_publish').val();
        ajaxLink(myword);
    });
}


// ajax link
function ajaxLink (myword) {
    $.ajax({
        url:'/publish/link',
        data:{
            title: '我的家在东北',
            text: '黑龙江就是我家，我家就是黑龙剑',
            pic: 'https://img3.doubanio.com/view/photo/albumcover/public/p2282259280.jpg',
            myword: myword,
            user: 'dingding'
        },
        success: function (data, status) {
            alert(status);
            alert(data);
        }
    });
}


// 同意 or 反对
function upVote () {
    $('a[class="upvote"]').click(function(){
        var newsid = $(this).parents('div').attr('title');
        alert(newsid);
        // 生成 data
        var data = {};
        data.newsid = newsid;
        data.vote = 'up';

        ajax_get('/vote', data);
    });
}

function downVote () {
    $('a[class="downvote"]').click(function(){
        var newsid = $(this).parents('div').attr('title');
        alert(newsid);
        // 生成 data
        var data = {};
        data.newsid = newsid;
        data.vote = 'down';

        ajax_get('/vote', data);
    });
}


// 通用 ajax get 方法
function ajax_get (url, data) {
    // url 只需 host 之后的部分
    // data 是 json 格式
    $.ajax({
        url: url,
        data: data,
        success: function (data, status) {
            alert(status);
            alert(data);
        }
    });
}

// 通用 Ajax post 方法
//







