// this is the browser code.
var highStream = require('highcharts-stream');
var pinoccio = require('pinoccio');

var api = pinoccio();

var accountData;

// current page context.
var currentPage;

var pages = {
  graph:{
    load:function(){

    },
    cleanup:function(){
      
    }
  }
}

function page(){

}

function onLogin(data){
  //
  accountData = data;
  api.rest({get:'/v1/stats',data:{troop:1,scout:1,}})
}

function loggedOut(){
  // this is going to change to return an event emitter i think.
  // this interface is bad because it looks like a simple callback but its an event handler and gets called more than once.
  api.loginButtons({read:true,},function(err,data){
    if(err) showError(err);
    
  })
}


function showError(err){
  var i = showError.i = ++(showError.i||0);
  
  $(".main-error").show().text(err.message||err+'');
  setTimeout(function(){
    if(i === showError.i) $(".main-error").hide();
  },8000);
}


if(api.token) {
  api.rest({url:"/v1/account"},function(err,data){
    if(err) return loggedOut();
    onLogin(data);
  })  
} else {
  loggedOut();
}


