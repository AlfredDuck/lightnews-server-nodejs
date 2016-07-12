/*
前端传search condition
*/

$(document).ready(function(){
   var page = 10;
   //初始化
   var condition = {};
   condition.searchWord = '';
   condition.room_num = '';
   condition.room_size = '';
   condition.room_rent_way = '';
   condition.skip = 0;
   condition.limit = page;
   
   //绑定事件，并给condition赋值
   condition.searchWord = $('.room_conditions').attr('title');
   condition.city = $('#city').attr('title');
   //alert(condition.searchWord);
   
   $('.room_num li').bind('click', function(){
      if ($(this).text() == '全部') {
         condition.room_num = '';
      }
      else {
         condition.room_num = $(this).text();
      }
      condition.skip = 0;    //分页重置回第一页！！！
      //alert(condition.room_num);
      $(this).attr('class', 'in');
      $(this).siblings().attr('class', 'out');
      postCondition(condition);
   });
   
   $('.room_size li').bind('click', function(){
      if ($(this).text() == '全部') {
         condition.room_size = '';
      }
      else {
         condition.room_size = $(this).text();
      }
      condition.skip = 0;    //分页重置回第一页！！！
      //alert(condition.room_size);
      $(this).attr('class', 'in');
      $(this).siblings().attr('class', 'out');
      postCondition(condition);
   });
   
   $('.room_rent_way li').bind('click', function(){
      if ($(this).text() == '全部') {
         condition.room_rent_way = '';
      }
      else {
         condition.room_rent_way = $(this).text();
      }
      condition.skip = 0;    //分页重置回第一页！！！
      //alert(condition.room_rent_way);
      $(this).attr('class', 'in');
      $(this).siblings().attr('class', 'out');
      postCondition(condition);
   });
   
   //分页的处理
   $('#page #down').bind('click', function(){
      condition.skip = condition.skip + page;
      postCondition(condition);
   });
   
   $('#page #up').bind('click', function(){
      if (condition.skip <= 0){
         alert('没有上一页了');
      }
      else {
         condition.skip = condition.skip - page;
         postCondition(condition);
      }
   });
   
});


//发送post
function postCondition(condition){
   $('#result').empty().append('<p id="getnothing">wait...<p>');
   $.post('/search_condition', condition, function(data){
      //alert(data);
      $('#result').empty().append(data);
   });
}






