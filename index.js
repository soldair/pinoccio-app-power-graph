// this is the browser code.

var highStream = require('highcharts-stream');
var $ = highStream.Highcharts.$
var pinoccio = require('pinoccio');

var api = pinoccio();

var accountData;

// current page context.
var currentPage;

var pages = {
  graph:{
    chart:false,
    streams:[],
    bound:0,
    load:function(data){
      var z = this;
      if(!bound) {
        $("#troop-select").change(function(){
          console.log('troop change> ',$(this).val());
        });
        $("#scout-select").change(function(){
          console.log('scout change> ',$(this).val())
        })
      }

      $("#troop-select").html("<option>- loading -</option>").removeAttr('disabled'); 
      $("#scout-select").html("<option>- select -</option>").attr('disabled','disabled');

      api.rest({url:'/v1/troops'},function(err,data){
        if(err) page('error',err);
        z.troops = data;
      })
      

      function chart(){
        if(z.chart) z.chart.destroy(); 
        z.chart = highStream("#chart");
      }

      // when a user selects a troop, graph power for all of the scouts.
      function statsStreams(chart,troop,scouts){
        
        if(z.streams) z.streams = z.streams.forEach(function(s){ s.end(); });
        
        scouts.forEach(function(id){
          var s = api.stats({troop:troop,scout:id});
          z.streams.push(s);
          s.pipe(chart);
        });
      }
    },
    cleanup:function(){
      if(this.streams.length) this.streams.end();
    }
  },
  loading:{},
  error:{
    load:function(err){
      console.log('error : ',err);
    }
  }
}

function page(name,data){
  if(currentPage && currentPage.cleanup) currentPage.cleanup();
  $(".page").removeClass('active');
  $("#page-"+name).addClass('active');
  if(pages[name].load)pages[name].load(data);
  currentPage = pages[name];
}

function onLogin(data){ 
  accountData = data;
  page('graph');
}

function loggedOut(){
  console.log(';logged out!');
  // this is going to change to return an event emitter i think.
  // this interface is bad because it looks like a simple callback but its an event handler and gets called more than once.
  api.loginButtons({read:true,},function(err,data){
    if(err) showError(err);
     
  })
}

function showError(err){
  
  showError.i = showError.i||0;
  var i = ++showError.i;
  
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



