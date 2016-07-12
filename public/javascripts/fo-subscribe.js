/*订阅的前端逻辑*/

$(document).ready(function(){
   //初始化
   var sub_content = {};
   sub_content.user_mail = '';
   sub_content.city = '';
   sub_content.local = [];   //地区是个数组
   sub_content.room_num = '';
   sub_content.room_size = '';
   sub_content.room_rent_way = '';
   
   //取得附加条件
   $('.room_num li').bind('click', function(){
      if ($(this).text() == '全部') {
         sub_content.room_num = '';
      }
      else {
         sub_content.room_num = $(this).text();
      }
      $(this).attr('class', 'in');
      $(this).siblings().attr('class', 'out');
   });
   
   $('.room_size li').bind('click', function(){
      if ($(this).text() == '全部') {
         sub_content.room_size = '';
      }
      else {
         sub_content.room_size = $(this).text();
      }
      $(this).attr('class', 'in');
      $(this).siblings().attr('class', 'out');
   });
   
   $('.room_rent_way li').bind('click', function(){
      if ($(this).text() == '全部') {
         sub_content.room_rent_way = '';
      }
      else {
         sub_content.room_rent_way = $(this).text();
      }
      $(this).attr('class', 'in');
      $(this).siblings().attr('class', 'out');
   });
   
   //点击“订阅”
   $('button').bind('click', function(){
      //给sub_content赋值
      //取得用户邮箱
      sub_content.user_mail = $('.need_mail input').val();
      //取得城市
      sub_content.city = $('.need_city option:selected') .text();
      //取得地区
      var local = $('.need_local input').val();
      var re = /\+/gi;
      sub_content.local = local.split(re);
      //alert(sub_content.local[0]);
      
      //检查sub_content的完整性
      if (sub_content.user_mail == ''){
         alert('需要填写邮箱');
      }
      if (local == ''){    //处于某种傻逼的原因，这里不能用sub_content.local判断
         alert('需要填写要订阅的地区');
      }
      else{
         postSubscribe(sub_content);
      }
   });
});


//发送post
function postSubscribe(sub_content){
   $.post('/do_subscribe', sub_content, function(data){
      alert(data);
   });
}








