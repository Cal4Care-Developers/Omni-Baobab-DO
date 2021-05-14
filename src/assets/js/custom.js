/**
 *
 * You can write your JS code here, DO NOT touch the default style file
 * because it will make it harder for you to update.
 * 
 */

 "use strict";

 google.charts.load('current', {'packages':['gauge']});
 google.charts.setOnLoadCallback(drawChart);

 function drawChart() {

   var data = google.visualization.arrayToDataTable([
     ['Label', 'Value'],
     ['Dev', 55],
     ['UI / UX', 68]
     ]);

   var options = {
     width: 500, height: 500,
     minorTicks: 5
   };

   var chart = new google.visualization.Gauge(document.getElementById('chart_div'));

   chart.draw(data, options);

   setInterval(function() {
     data.setValue(0, 1, 40 + Math.round(60 * Math.random()));
     chart.draw(data, options);
   }, 13000);
   setInterval(function() {
     data.setValue(1, 1, 40 + Math.round(60 * Math.random()));
     chart.draw(data, options);
   }, 5000);
 }




 function drawCharta(content) {





  let gaugeData = JSON.parse(content);
  console.log(gaugeData)
  let gaugetype = gaugeData[0].gtype;
  let gaugevalue = gaugeData[0].value;
  let gaugename = gaugeData[0].queu_name;



  console.log(gaugevalue);

  var data = google.visualization.arrayToDataTable([
    ['Label', 'Value'],
    ['CR Unit', 0],
    ['Pace', 0],
    ]);

  var options = {
    width: 500, height: 500,
    animation:{
      duration: 100,
      easing: 'inAndOut',
    },
    minorTicks: 5,
    majorTicks : ['0','5','10','15','20','25']
  };
  var chart = new google.visualization.Gauge(document.getElementById('chart_div'));
  google.visualization.events.addListener(chart, 'ready', function () {

    var fill = $('#chart_div').find('svg g circle:eq(1)').attr('fill');
    $('#chart_div').find('svg g circle:first-child').attr('fill', fill);

  });
  chart.draw(data, options);

  setInterval(function() { 
    data.setValue(0, 1, gaugevalue);
    data.setValue(1, 1, gaugevalue);
    chart.draw(data, options);
  }, 50);

}



var chart;

function splineData(data){

 chart = new CanvasJS.Chart("chartContainers",{
  title:{
    text:"Dynamic Queues"
  },
  axisX: {
    valueFormatString: "DD MMM YYYY",
    interval: 1,
    intervalType: "day"
  },
  toolTip:  {
    shared: true
  },
  data: []
});
 testSpline(data);

}


function testSpline(data){
  $.getJSON("https://api.npoint.io/f18ed6d2f20ec86953d2", function(data) {
    chart.options.data = [];
    var occurrences = data.reduce( (acc, obj) => {
      let date = (obj.timestamp - (obj.timestamp % (24 * 60 * 60)))*1000; // to group by date
      acc[obj.ajax_action] = acc[obj.ajax_action] ? acc[obj.ajax_action] : {};
      acc[obj.ajax_action][date] = (acc[obj.ajax_action][date] || 0)+1
      return acc;
    }, {} )
    console.log(occurrences);
    for(var actions in occurrences) {
      var dataPoints = [];
      for(var key in occurrences[actions]) {
        dataPoints.push({ x: parseInt(key), y: occurrences[actions][key]});
      }
      console.log(dataPoints);
      chart.options.data.push({
        type: "line",
        showInLegend: true,
        name: actions,
        xValueType: 'dateTime',
        xValueFormatString: "DD MMM YYYY",
        dataPoints: dataPoints
      });
    }
    
    chart.render(); 
  });
}


function socketSpline(occurrences){
  console.log(occurrences)
  chart.options.data = [];
  // var occurrences = data.reduce( (acc, obj) => {
  //   let date = (obj.timestamp - (obj.timestamp % (24 * 60 * 60)))*1000; // to group by date
  //   acc[obj.ajax_action] = acc[obj.ajax_action] ? acc[obj.ajax_action] : {};
  //   acc[obj.ajax_action][date] = (acc[obj.ajax_action][date] || 0)+1
  //   return acc;
  // }, {} )
  console.log(occurrences);
  for(var actions in occurrences) {
    var dataPoints = [];
    for(var key in occurrences[actions]) {
      console.log(occurrences[actions][key]);

var dateString = occurrences[actions][key]['date'],
dateTimeParts = dateString.split(' '),
timeParts = dateTimeParts[1].split(':'),
dateParts = dateTimeParts[0].split('-'),
date;

date = new Date(dateParts[2], parseInt(dateParts[1], 10) - 1, dateParts[0], timeParts[0], timeParts[1]);

      dataPoints.push({ x: date.getTime(), y: occurrences[actions][key]['data']});
    }
    console.log(dataPoints);
    chart.options.data.push({
      type: "line",
      showInLegend: true,
      name: actions,
      xValueType: "dateTime",
      xValueFormatString: "hh:mm TT",
      yValueFormatString: "#,###",
      dataPoints: dataPoints
    });
  }
  
  chart.render(); 
}




/*******************
Data Table
*******************/
$(document).ready(function() {
 $('.customDataTable').DataTable();
 $(".colorpickerinput").colorpicker({
   format: 'hex',
   component: '.input-group-append',
 });

 $(".toggle-password").click(function() {
  $(this).toggleClass("fa-eye fa-eye-slash");
  var input = $($(this).attr("toggle"));
  if (input.attr("type") == "password") {
    input.attr("type", "text");
  } else {
    input.attr("type", "password");
  }
});


/********************
Chat Widget Position
************************/

/********************
Chat Widget Position
************************/
$("#window-flat-chat").addClass("hide-block");
$(".widget-appearance-round-click").click(function() {
  $("#window-round-chat").addClass("show-block");
  $("#window-round-chat").removeClass("hide-block");
  $("#window-flat-chat").addClass("hide-block");
});
$(".widget-appearance-flat-click").click(function() {
  $("#window-round-chat").addClass("hide-block");
  $("#window-flat-chat").removeClass("hide-block");
  $("#window-flat-chat").addClass("show-block");
});

$(".chat-widget-position-1").click(function() {
 $(".widget-appearance-round, .widget-flat, .grabber-img").removeAttr("id");
 $(".widget-appearance-round").attr("id","bottom-left-round");
 $(".widget-flat").attr("id","bottom-left-flat");
 $(".grabber-img").attr("id","grabber-bottom-left");
});

$(".chat-widget-position-2").click(function() {
 $(".widget-appearance-round, .widget-flat, .grabber-img").removeAttr("id");
 $(".widget-appearance-round").attr("id","top-left-round");
 $(".widget-flat").attr("id","top-left-flat");
 $(".grabber-img").attr("id","grabber-top-left");
});

$(".chat-widget-position-3").click(function() {
  $(".widget-appearance-round, .widget-flat, .grabber-img").removeAttr("id");
  $(".widget-appearance-round").attr("id","top-right-round");
  $(".widget-flat").attr("id","top-right-flat");
  $(".grabber-img").attr("id","grabber-top-right");
});

$(".chat-widget-position-4").click(function() {
 $(".widget-appearance-round, .widget-flat, .grabber-img").removeAttr("id");
 $(".widget-appearance-round").attr("id","bottom-right-round");
 $(".widget-flat").attr("id","bottom-right-flat");
 $(".grabber-img").attr("id","grabber-bottom-right");
});

/**************
Slider Range
****************/
$(".slider-range").slider({
 range: true,
 min: 0,
 max: 1440,
 step: 15,
 values: [600, 720],
 slide: function (e, ui) {
   var hours1 = Math.floor(ui.values[0] / 60);
   var minutes1 = ui.values[0] - (hours1 * 60);

   if (hours1.length == 1) hours1 = '0' + hours1;
   if (minutes1.length == 1) minutes1 = '0' + minutes1;
   if (minutes1 == 0) minutes1 = '00';
   if (hours1 >= 12) {
     if (hours1 == 12) {
       hours1 = hours1;
       minutes1 = minutes1 + " PM";
     } else {
       hours1 = hours1 - 12;
       minutes1 = minutes1 + " PM";
     }
   } else {
     hours1 = hours1;
     minutes1 = minutes1 + " AM";
   }
   if (hours1 == 0) {
     hours1 = 12;
     minutes1 = minutes1;
   }
   $('.slider-time').html(hours1 + ':' + minutes1);
   var hours2 = Math.floor(ui.values[1] / 60);
   var minutes2 = ui.values[1] - (hours2 * 60);
   if (hours2.length == 1) hours2 = '0' + hours2;
   if (minutes2.length == 1) minutes2 = '0' + minutes2;
   if (minutes2 == 0) minutes2 = '00';
   if (hours2 >= 12) {
     if (hours2 == 12) {
       hours2 = hours2;
       minutes2 = minutes2 + " PM";
     } else if (hours2 == 24) {
       hours2 = 11;
       minutes2 = "59 PM";
     } else {
       hours2 = hours2 - 12;
       minutes2 = minutes2 + " PM";
     }
   } else {
     hours2 = hours2;
     minutes2 = minutes2 + " AM";
   }

   $('.slider-time2').html(hours2 + ':' + minutes2);
 }
});

$(function() {
    $(".toggle-content-2").hide();
 $("input[name='fbRadioContent']").click(function() {
   if ($("#fb-content-1").is(":checked")) {
     $(".toggle-content-1").show();
     $(".toggle-content-2").hide();
   } else if  ($("#fb-content-2").is(":checked")) {
     $(".toggle-content-2").show();
     $(".toggle-content-1").hide();
   } 
 });
});


/******************************
Inner Chat
********************************/
$(".toggle-user-status").click(function(){
  $(".inner-chat-change-status").removeClass('none');
  $(".inner-chat-change-status").addClass('block');

});
$(".close-chat-panel, #actionDropdown").click(function(){
  $(".inner-chat-change-status").removeClass('block');
  $(".inner-chat-change-status").addClass('none');
});
$(".inner-chat-minimize").click(function(){
  $(".inner-chat-panel").addClass('none');
   $("ul.footer-left-menu li:first-child").removeClass('active');
});
$("ul.footer-left-menu li a").click(function(){
  $(".inner-chat-panel").removeClass('none');
  $(".inner-chat-panel").addClass('block');
  $("ul.footer-left-menu li:first-child").addClass('active');
});


$('#animate-dialpad').click(function(){
$(".forwardDialpadPanel").addClass('active');
  $(".forwardDialpadPanel").removeClass('hide-fwd-dialpad');
  });

$(".dialpad-close-icon#close-call-fwd-modal").click(function(){
$(".forwardDialpadPanel").addClass('hide-fwd-dialpad');
  $(".forwardDialpadPanel").removeClass('active');
  });

  $('ul.inner-dropdown-menu').hide()
  $(".has-inner-dropdown").click(function(){
    $('ul.inner-dropdown-menu').toggle()

});

});


// WallBoard FIVE start..........................
// $(document).ready(function () {
//   var ps = new PerfectScrollbar(".booking-stats");
 
//   initBookingsChart();
//   initAgentChart();
//   initAgentCallChart();
//   initAverageWaitChart();
//   initOverallChart();
//   initTotalcallChart();
//   initTotalansChart();
//   initTotalabondChart();
//   initAvgtalkChart();
//   initabondChart();
//   initBusyChart();
//   initAnsweredChart();
//   initLongChart();
// });



// function initBookingsChart(data) {

//   console.log(data);
// var chart = JSC.chart('chartDiv', { 
//   debug: true, 
//   type: 'gauge ', 
//   legend_visible: false, 
//   chartArea_boxVisible: false, 
//   xAxis: { 
//     /*Used to position marker on top of axis line.*/
//     scale: { range: [0, 1], invert: true } 
//   }, 
//   palette: { 
//     pointValue: '%yValue', 
//     ranges: [ 
//       { value: 700, color: '#FF5353' }, 
//     ] 
//   },   yAxis: { 
//     defaultTick: { padding: 13, enabled: false }, 
  
//     line: { 
//       width: 10, 
//       breaks_gap: 0.03, 
//       color: 'smartPalette'
//     }, 
     
//   },
 
//   defaultSeries: { 
//     opacity: 0, 
//     shape: { 
//       label: { 
//         align: 'center', 
//         verticalAlign: 'middle'
//       } 
//     } 
//   }, 
//   series: [ 
//     { 
//       type: 'marker', 
//       name: 'Score', 
//       shape_label: { 
//         text: 
//           "<br/> <span style='fontSize: 35'>"+data+"</span>", 
//         style: { fontSize: 28 } 
//       },  
//       points: [[1, 350]] 
//     } 
//   ] 
// }); 
// }
// function initAgentChart(data) {
// var chart = JSC.chart('agent-chart', { 
//   debug: true, 
//   type: 'gauge ', 
//   legend_visible: false, 
//   chartArea_boxVisible: false, 
//   xAxis: { 
//     /*Used to position marker on top of axis line.*/
//     scale: { range: [0, 1], invert: true } 
//   }, 
//   palette: { 
//     pointValue: '%yValue', 
//     ranges: [ 
//       { value: 700, color: '#a699d1' }, 
//     ] 
//   },   yAxis: { 
//     defaultTick: { padding: 13, enabled: false }, 
  
//     line: { 
//       width: 10, 
//       breaks_gap: 0.03, 
//       color: 'smartPalette'
//     }, 
     
//   },
 
//   defaultSeries: { 
//     opacity: 0, 
//     shape: { 
//       label: { 
//         align: 'center', 
//         verticalAlign: 'middle'
//       } 
//     } 
//   }, 
//   series: [ 
//     { 
//       type: 'marker', 
//       name: 'Score', 
//       shape_label: { 
//         text: 
//           "<br/> <span style='fontSize: 35'>"+data+"</span>", 
//         style: { fontSize: 28 } 
//       },  
//       points: [[1, 350]] 
//     } 
//   ] 
// });
// }
// function initAgentCallChart(data) {
// var chart = JSC.chart('agent-on-chart', { 
//   debug: true, 
//   type: 'gauge ', 
//   legend_visible: false, 
//   chartArea_boxVisible: false, 
//   xAxis: { 
//     /*Used to position marker on top of axis line.*/
//     scale: { range: [0, 1], invert: true } 
//   }, 
//   palette: { 
//     pointValue: '%yValue', 
//     ranges: [ 
//       { value: 700, color: '#ec5759' }, 
//     ] 
//   },   yAxis: { 
//     defaultTick: { padding: 13, enabled: false }, 
  
//     line: { 
//       width: 10, 
//       breaks_gap: 0.03, 
//       color: 'smartPalette'
//     }, 
     
//   },
 
//   defaultSeries: { 
//     opacity: 0, 
//     shape: { 
//       label: { 
//         align: 'center', 
//         verticalAlign: 'middle'
//       } 
//     } 
//   }, 
//   series: [ 
//     { 
//       type: 'marker', 
//       name: 'Score', 
//       shape_label: { 
//         text: 
//           "<br/> <span style='fontSize: 35'>"+data+"</span>", 
//         style: { fontSize: 28 } 
//       },  
//       points: [[1, 350]] 
//     } 
//   ] 
// });
// }

//  function initAverageWaitChart(data) {
// var chart = JSC.chart('avg-wait-chart', { 
//   debug: true, 
//   type: 'gauge ', 
//   legend_visible: false, 
//   chartArea_boxVisible: false, 
//   xAxis: { 
//     /*Used to position marker on top of axis line.*/
//     scale: { range: [0, 1], invert: true } 
//   }, 
//   palette: { 
//     pointValue: '%yValue', 
//     ranges: [ 
//       { value: 700, color: '#ffa048' }, 
//     ] 
//   },   yAxis: { 
//     defaultTick: { padding: 13, enabled: false }, 
  
//     line: { 
//       width: 10, 
//       breaks_gap: 0.03, 
//       color: 'smartPalette'
//     }, 
     
//   },
 
//   defaultSeries: { 
//     opacity: 0, 
//     shape: { 
//       label: { 
//         align: 'center', 
//         verticalAlign: 'middle'
//       } 
//     } 
//   }, 
//   series: [ 
//     { 
//       type: 'marker', 
//       name: 'Score', 
//       shape_label: { 
//         text: 
//           "<br/> <span style='fontSize: 29'>"+data+"</span>", 
//         style: { fontSize: 28 } 
//       },  
//       points: [[1, 350]] 
//     } 
//   ] 
// });
// }
//  function initOverallChart(data) {
// var chart = JSC.chart('overallchart', { 
//   debug: true, 
//   type: 'gauge ', 
//   legend_visible: false, 
//   chartArea_boxVisible: false, 
//   xAxis: { 
//     /*Used to position marker on top of axis line.*/
//     scale: { range: [0, 1], invert: true } 
//   }, 
//   palette: { 
//     pointValue: '%yValue', 
//     ranges: [ 
//       { value: 700, color: '#1cd5cc' }, 
//     ] 
//   },   yAxis: { 
//     defaultTick: { padding: 13, enabled: false }, 
  
//     line: { 
//       width: 10, 
//       breaks_gap: 0.03, 
//       color: 'smartPalette'
//     }, 
     
//   },
 
//   defaultSeries: { 
//     opacity: 0, 
//     shape: { 
//       label: { 
//         align: 'center', 
//         verticalAlign: 'middle'
//       } 
//     } 
//   }, 
//   series: [ 
//     { 
//       type: 'marker', 
//       name: 'Score', 
//       shape_label: { 
//         text: 
//           "<br/> <span style='fontSize: 35'>"+data+"</span>", 
//         style: { fontSize: 28 } 
//       },  
//       points: [[1, 350]] 
//     } 
//   ] 
// });
// }
//  function initTotalcallChart(data) {
// var chart = JSC.chart('total-call-chart', { 
//   debug: true, 
//   type: 'gauge ', 
//   legend_visible: false, 
//   chartArea_boxVisible: false, 
//   xAxis: { 
//     /*Used to position marker on top of axis line.*/
//     scale: { range: [0, 1], invert: true } 
//   }, 
//   palette: { 
//     pointValue: '%yValue', 
//     ranges: [ 
//       { value: 700, color: '#6A287E' }, 
//     ] 
//   },   yAxis: { 
//     defaultTick: { padding: 13, enabled: false }, 
  
//     line: { 
//       width: 10, 
//       breaks_gap: 0.03, 
//       color: 'smartPalette'
//     }, 
     
//   },
 
//   defaultSeries: { 
//     opacity: 0, 
//     shape: { 
//       label: { 
//         align: 'center', 
//         verticalAlign: 'middle'
//       } 
//     } 
//   }, 
//   series: [ 
//     { 
//       type: 'marker', 
//       name: 'Score', 
//       shape_label: { 
//         text: 
//           "<br/> <span style='fontSize: 35'>"+data+"</span>", 
//         style: { fontSize: 28 } 
//       },  
//       points: [[1, 350]] 
//     } 
//   ] 
// });
// }
//  function initTotalansChart(data) {
// var chart = JSC.chart('total-ans-chart', { 
//   debug: true, 
//   type: 'gauge ', 
//   legend_visible: false, 
//   chartArea_boxVisible: false, 
//   xAxis: { 
//     /*Used to position marker on top of axis line.*/
//     scale: { range: [0, 1], invert: true } 
//   }, 
//   palette: { 
//     pointValue: '%yValue', 
//     ranges: [ 
//       { value: 700, color: '#0000A0' }, 
//     ] 
//   },   yAxis: { 
//     defaultTick: { padding: 13, enabled: false }, 
  
//     line: { 
//       width: 10, 
//       breaks_gap: 0.03, 
//       color: 'smartPalette'
//     }, 
     
//   },
 
//   defaultSeries: { 
//     opacity: 0, 
//     shape: { 
//       label: { 
//         align: 'center', 
//         verticalAlign: 'middle'
//       } 
//     } 
//   }, 
//   series: [ 
//     { 
//       type: 'marker', 
//       name: 'Score', 
//       shape_label: { 
//         text: 
//           "<br/> <span style='fontSize: 35'>"+data+"</span>", 
//         style: { fontSize: 28 } 
//       },  
//       points: [[1, 350]] 
//     } 
//   ] 
// });
// }
//  function initTotalabondChart(data) {
// var chart = JSC.chart('total-abond-chart', { 
//   debug: true, 
//   type: 'gauge ', 
//   legend_visible: false, 
//   chartArea_boxVisible: false, 
//   xAxis: { 
//     /*Used to position marker on top of axis line.*/
//     scale: { range: [0, 1], invert: true } 
//   }, 
//   palette: { 
//     pointValue: '%yValue', 
//     ranges: [ 
//       { value: 700, color: '#FF00FF' }, 
//     ] 
//   },   yAxis: { 
//     defaultTick: { padding: 13, enabled: false }, 
  
//     line: { 
//       width: 10, 
//       breaks_gap: 0.03, 
//       color: 'smartPalette'
//     }, 
     
//   },
 
//   defaultSeries: { 
//     opacity: 0, 
//     shape: { 
//       label: { 
//         align: 'center', 
//         verticalAlign: 'middle'
//       } 
//     } 
//   }, 
//   series: [ 
//     { 
//       type: 'marker', 
//       name: 'Score', 
//       shape_label: { 
//         text: 
//           "<br/> <span style='fontSize: 35'>"+data+"</span>", 
//         style: { fontSize: 28 } 
//       },  
//       points: [[1, 350]] 
//     } 
//   ] 
// });
// }



// function initAvgtalkChart(data) {
// var chart = JSC.chart('total-talk-chart', { 
//   debug: true, 
//   type: 'gauge ', 
//   legend_visible: false, 
//   chartArea_boxVisible: false, 
//   xAxis: { 
//     /*Used to position marker on top of axis line.*/
//     scale: { range: [0, 1], invert: true } 
//   }, 
//   palette: { 
//     pointValue: '%yValue', 
//     ranges: [ 
//       { value: 700, color: '#993399' }, 
//     ] 
//   },   yAxis: { 
//     defaultTick: { padding: 13, enabled: false }, 
  
//     line: { 
//       width: 10, 
//       breaks_gap: 0.03, 
//       color: 'smartPalette'
//     }, 
     
//   },
 
//   defaultSeries: { 
//     opacity: 0, 
//     shape: { 
//       label: { 
//         align: 'center', 
//         verticalAlign: 'middle'
//       } 
//     } 
//   }, 
//   series: [ 
//     { 
//       type: 'marker', 
//       name: 'Score', 
//       shape_label: { 
//         text: 
//           "<br/> <span style='fontSize: 29'>"+data+"</span>", 
//         style: { fontSize: 28 } 
//       },  
//       points: [[1, 350]] 
//     } 
//   ] 
// });
// }

//  function initabondChart(data) {
// var chart = JSC.chart('abond-chart', { 
//   debug: true, 
//   type: 'gauge ', 
//   legend_visible: false, 
//   chartArea_boxVisible: false, 
//   xAxis: { 
//     /*Used to position marker on top of axis line.*/
//     scale: { range: [0, 1], invert: true } 
//   }, 
//   palette: { 
//     pointValue: '%yValue', 
//     ranges: [ 
//       { value: 700, color: '#33FFCC' }, 
//     ] 
//   },   yAxis: { 
//     defaultTick: { padding: 13, enabled: false }, 
  
//     line: { 
//       width: 10, 
//       breaks_gap: 0.03, 
//       color: 'smartPalette'
//     }, 
     
//   },
 
//   defaultSeries: { 
//     opacity: 0, 
//     shape: { 
//       label: { 
//         align: 'center', 
//         verticalAlign: 'middle'
//       } 
//     } 
//   }, 
//   series: [ 
//     { 
//       type: 'marker', 
//       name: 'Score', 
//       shape_label: { 
//         text: 
//           "<br/> <span style='fontSize: 35'>"+data+"</span>", 
//         style: { fontSize: 28 } 
//       },  
//       points: [[1, 350]] 
//     } 
//   ] 
// });
// }
//  function initBusyChart(data) {
// var chart = JSC.chart('total-busy-chart', { 
//   debug: true, 
//   type: 'gauge ', 
//   legend_visible: false, 
//   chartArea_boxVisible: false, 
//   xAxis: { 
//     /*Used to position marker on top of axis line.*/
//     scale: { range: [0, 1], invert: true } 
//   }, 
//   palette: { 
//     pointValue: '%yValue', 
//     ranges: [ 
//       { value: 700, color: '#FF0000' }, 
//     ] 
//   },   yAxis: { 
//     defaultTick: { padding: 13, enabled: false }, 
  
//     line: { 
//       width: 10, 
//       breaks_gap: 0.03, 
//       color: 'smartPalette'
//     }, 
     
//   },
 
//   defaultSeries: { 
//     opacity: 0, 
//     shape: { 
//       label: { 
//         align: 'center', 
//         verticalAlign: 'middle'
//       } 
//     } 
//   }, 
//   series: [ 
//     { 
//       type: 'marker', 
//       name: 'Score', 
//       shape_label: { 
//         text: 
//           "<br/> <span style='fontSize: 35'>"+data+"</span>", 
//         style: { fontSize: 28 } 
//       },  
//       points: [[1, 350]] 
//     } 
//   ] 
// });
// }
//  function initAnsweredChart(data) {
// var chart = JSC.chart('answer-chart', { 
//   debug: true, 
//   type: 'gauge ', 
//   legend_visible: false, 
//   chartArea_boxVisible: false, 
//   xAxis: { 
//     /*Used to position marker on top of axis line.*/
//     scale: { range: [0, 1], invert: true } 
//   }, 
//   palette: { 
//     pointValue: '%yValue', 
//     ranges: [ 
//       { value: 700, color: '#800000' }, 
//     ] 
//   },   yAxis: { 
//     defaultTick: { padding: 13, enabled: false }, 
  
//     line: { 
//       width: 10, 
//       breaks_gap: 0.03, 
//       color: 'smartPalette'
//     }, 
     
//   },
 
//   defaultSeries: { 
//     opacity: 0, 
//     shape: { 
//       label: { 
//         align: 'center', 
//         verticalAlign: 'middle'
//       } 
//     } 
//   }, 
//   series: [ 
//     { 
//       type: 'marker', 
//       name: 'Answer', 
//       shape_label: { 
//         text: 
//           "<br/> <span style='fontSize: 35'>"+data+"</span>", 
//         style: { fontSize: 28 } 
//       },  
//       points: [[1, 100]] 
//     } 
//   ] 
// });
// }
//  function initLongChart(data) {
// var chart = JSC.chart('wait-chart', { 
//   debug: true, 
//   type: 'gauge ', 
//   legend_visible: false, 
//   chartArea_boxVisible: false, 
//   xAxis: { 
//     /*Used to position marker on top of axis line.*/
//     scale: { range: [0, 1], invert: true } 
//   }, 
//   palette: { 
//     pointValue: '%yValue', 
//     ranges: [ 
//       { value: 20, color: '#808000' }, 
//     ] 
//   }, 
//     yAxis: { 
//     defaultTick: { padding: 13, enabled: false }, 
  
//     line: { 
//       width: 10, 
//       breaks_gap: 0.03, 
//       color: 'smartPalette'
//     }, 
     
//   },
 
//   defaultSeries: { 
//     opacity: 0, 
//     shape: { 
//       label: { 
//         align: 'center', 
//         verticalAlign: 'middle'
//       } 
//     } 
//   }, 
//   series: [ 
//     { 
//       type: 'marker', 
//       name: 'Longest Waiting Time', 
//       shape_label: { 
//         text: 
//           "<br/> <span style='fontSize: 29'>"+data+"</span>", 
//         style: { fontSize: 28 } 
//       },  
//       points: [[1, 50]] 
//     } 
//   ] 
// });
// }

// WallBoard FIVE END..........................


$(document).ready(function() {
  $("#add_reports").change(function() {

    var firstselected = $(':selected', this).val(); //returns first selected in list
  //   var lastselected = $(':selected:last', this).val(); //return last selected in list
  //  return firstselected;
    // what if i want exact option i have clicked in list 
  });
});

// function updateTime(){
//   var date = new Date();
//   var goTime = document.getElementById("gotime");
//   goTime.innerHTML = date.toLocaleTimeString();
//   var setDate = document.getElementById("getdate");
//   setDate.innerHTML = date.getDate() + "-" + parseInt(date.getMonth()+1) + "-" + date.getFullYear();     
  
// }
// setInterval(updateTime,1000);

// $("#add_reports").on('change', function(e) {
//   return e.currentTarget.value  //should return you the currently selected option
// });
// $(document).ready(function() {
//   tinymce.init({
//     selector: "textarea",
//     theme: "modern",
//     paste_data_images: true,
//     plugins: [
//       "advlist autolink lists link image charmap print preview hr anchor pagebreak",
//       "searchreplace wordcount visualblocks visualchars code fullscreen",
//       "insertdatetime media nonbreaking save table contextmenu directionality",
//       "emoticons template paste textcolor colorpicker textpattern"
//     ],
//     toolbar1: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
//     toolbar2: "print preview media | forecolor backcolor emoticons",
//     image_advtab: true,
//     file_picker_callback: function(callback, value, meta) {
//       if (meta.filetype == 'image') {
//         $('#upload').trigger('click');
//         $('#upload').on('change', function() {
//           var file = this.files[0];
//           var reader = new FileReader();
//           reader.onload = function(e) {
//             callback(e.target.result, {
//               alt: ''
//             });
//           };
//           reader.readAsDataURL(file);
//         });
//       }
//     },
//     templates: [{
//       title: 'Test template 1',
//       content: 'Test 1'
//     }, {
//       title: 'Test template 2',
//       content: 'Test 2'
//     }]
//   });
// });
function chatBot() {
  return {
      prompts: [
          ["hi", "hey", "hello", "good morning", "good afternoon"],
          ["how are you", "how is life", "how are things"],
          ["what are you doing", "what is going on", "what is up"],
          ["how old are you"],
          ["who are you", "are you human", "are you bot", "are you human or bot"],
          ["who created you", "who made you"],
          ["your name please", "your name", "may i know your name", "what is your name", "what call yourself"],
          ["i love you"],
          ["happy", "good", "fun", "wonderful", "fantastic", "cool"],
          ["bad", "bored", "tired"],
          ["help me", "tell me story", "tell me joke"],
          ["ah", "yes", "ok", "okay", "nice"],
          ["bye", "good bye", "goodbye", "see you later"],
          ["what should i eat today"],
          ["bro"],
          ["what", "why", "how", "where", "when"],
          ["no", "not sure", "maybe", "no thanks"],
          [""],
          ["haha", "ha", "lol", "hehe", "funny", "joke"],
          ["flip a coin", "heads or tails", "tails or heads", "head or tails", "head or tail", "tail or heads", "tail or head"],
      ],
      replies: [
          ["Hello!", "Hi!", "Hey!", "Hi there!", "Howdy"],
          ["Fine... how are you?", "Pretty well, how are you?", "Fantastic, how are you?"],
          ["Nothing much", "About to go to sleep", "Can you guess?", "I don't know actually"],
          ["I am infinite"],
          ["I am just a bot", "I am a bot. What are you?"],
          ["The one true God, JavaScript"],
          ["I am nameless", "I don't have a name"],
          ["I love you too", "Me too"],
          ["Have you ever felt bad?", "Glad to hear it"],
          ["Why?", "Why? You shouldn't!", "Try watching TV"],
          ["What about?", "Once upon a time..."],
          ["Tell me a story", "Tell me a joke", "Tell me about yourself"],
          ["Bye", "Goodbye", "See you later"],
          ["Sushi", "Pizza"],
          ["Bro!"],
          ["Great question"],
          ["That's ok", "I understand", "What do you want to talk about?"],
          ["Please say something :("],
          ["Haha!", "Good one!"],
          ["Heads", "Tails"]
      ],
      alternative: ["Same", "Go on...", "Bro...", "Try again", "I'm listening...", "I don't understand :/"],
      coronavirus: ["Please stay home", "Wear a mask", "Fortunately, I don't have COVID", "These are uncertain times"],
      botTyping: false,
      messages: [{
          from: 'bot',
          text: 'Hello world!'
      }],
      output: function(input) {
          let product;

          // Regex remove non word/space chars
          // Trim trailing whitespce
          // Remove digits - not sure if this is best
          // But solves problem of entering something like 'hi1'

          let text = input.toLowerCase().replace(/[^\w\s]/gi, "").replace(/[\d]/gi, "").trim();
          text = text
              .replace(/ a /g, " ") // 'tell me a story' -> 'tell me story'
              .replace(/i feel /g, "")
              .replace(/whats/g, "what is")
              .replace(/please /g, "")
              .replace(/ please/g, "")
              .replace(/r u/g, "are you");

          if (this.compare(this.prompts, this.replies, text)) {
              // Search for exact match in `prompts`
              product = this.compare(this.prompts, this.replies, text);
          } else if (text.match(/thank/gi)) {
              product = "You're welcome!"
          } else if (text.match(/(corona|covid|virus)/gi)) {
              // If no match, check if message contains `coronavirus`
              product = this.coronavirus[Math.floor(Math.random() * this.coronavirus.length)];
          } else {
              // If all else fails: random this.alternative
              product = this.alternative[Math.floor(Math.random() * this.alternative.length)];
          }

          // Update DOM
          this.addChat(input, product);
      },
      compare: function(promptsArray, repliesArray, string) {
          let reply;
          let replyFound = false;
          for (let x = 0; x < promptsArray.length; x++) {
              for (let y = 0; y < promptsArray[x].length; y++) {
                  if (promptsArray[x][y] === string) {
                      let replies = repliesArray[x];
                      reply = replies[Math.floor(Math.random() * replies.length)];
                      replyFound = true;
                      // Stop inner loop when input value matches this.prompts
                      break;
                  }
              }
              if (replyFound) {
                  // Stop outer loop when reply is found instead of interating through the entire array
                  break;
              }
          }
          if (!reply) {
              for (let x = 0; x < promptsArray.length; x++) {
                  for (let y = 0; y < promptsArray[x].length; y++) {
                      if (this.levenshtein(promptsArray[x][y], string) >= 0.75) {
                          let replies = repliesArray[x];
                          reply = replies[Math.floor(Math.random() * replies.length)];
                          replyFound = true;
                          // Stop inner loop when input value matches this.prompts
                          break;
                      }
                  }
                  if (replyFound) {
                      // Stop outer loop when reply is found instead of interating through the entire array
                      break;
                  }
              }
          }
          return reply;
      },
      levenshtein: function(s1, s2) {
          var longer = s1;
          var shorter = s2;
          if (s1.length < s2.length) {
              longer = s2;
              shorter = s1;
          }
          var longerLength = longer.length;
          if (longerLength == 0) {
              return 1.0;
          }
          return (longerLength - this.editDistance(longer, shorter)) / parseFloat(longerLength);
      },
      editDistance: function(s1, s2) {
          s1 = s1.toLowerCase();
          s2 = s2.toLowerCase();

          var costs = new Array();
          for (var i = 0; i <= s1.length; i++) {
              var lastValue = i;
              for (var j = 0; j <= s2.length; j++) {
                  if (i == 0)
                      costs[j] = j;
                  else {
                      if (j > 0) {
                          var newValue = costs[j - 1];
                          if (s1.charAt(i - 1) != s2.charAt(j - 1))
                              newValue = Math.min(Math.min(newValue, lastValue),
                                  costs[j]) + 1;
                          costs[j - 1] = lastValue;
                          lastValue = newValue;
                      }
                  }
              }
              if (i > 0)
                  costs[s2.length] = lastValue;
          }
          return costs[s2.length];
      },
      addChat: function(input, product) {

          // Add user message
          this.messages.push({
              from: 'user',
              text: input
          });

          // Keep messages at most recent
          this.scrollChat();

          // Fake delay to seem "real"
          setTimeout(() => {
              this.botTyping = true;
              this.scrollChat();
          }, 1000)

          // add bit message with Fake delay to seem "real"
          setTimeout(() => {
              this.botTyping = false;
              this.messages.push({
                  from: 'bot',
                  text: product
              });
              this.scrollChat();
          }, ((product.length / 10) * 1000) + (Math.floor(Math.random() * 2000) + 1500))

      },
      scrollChat: function() {
          const messagesContainer = document.getElementById("messages");
          messagesContainer.scrollTop = messagesContainer.scrollHeight - messagesContainer.clientHeight;
          setTimeout(() => {
              messagesContainer.scrollTop = messagesContainer.scrollHeight - messagesContainer.clientHeight;
          }, 100);
      },
      updateChat: function(target) {
          if (target.value.trim()) {
              this.output(target.value.trim());
              target.value = '';
          }
      }
  }
}
