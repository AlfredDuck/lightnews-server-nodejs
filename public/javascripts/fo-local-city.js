/*
$(document).ready(function(){

//定位城市
getLocation();

});
*/
getLocation();

function getLocation(){
   //定位到某个城市
   var myCity = new BMap.LocalCity();
   myCity.get(function(result){
      //alert(result.name);
      
      if (result.name == '北京市'){
          window.location.href="/local/beijing"; 
      }
      if (result.name == '上海市'){
         window.location.href="/local/shanghai"; 
      }
      if (result.name == '广州市'){
         window.location.href="/local/guangzhou"; 
      }
   });
}
