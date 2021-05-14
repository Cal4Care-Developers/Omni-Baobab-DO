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
      dataPoints.push({ x: occurrences[actions][key]['date'], y: occurrences[actions][key]['data']});
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



/************************
Image Preview
**************************/
  $(function() {
  if (window.File && window.FileList && window.FileReader) {
    $("#files").on("change", function(e) {
      var files = e.target.files,
        filesLength = files.length;
      for (var i = 0; i < filesLength; i++) {
        var f = files[i]
        var fileReader = new FileReader();
        fileReader.onload = (function(e) {
          var file = e.target;
          $("<span class=\"pip\">" +
            "<img class=\"imageThumb\" src=\"" + e.target.result + "\" title=\"" + file.name + "\"/>" +
            "<br/><span class=\"remove\">Remove image</span>" +
            "</span>").insertAfter("#files");
          $(".remove").click(function(){
            $(this).parent(".pip").remove();
          });
          
        });
        fileReader.readAsDataURL(f);
      }
    });
  } else {
    alert("Your browser doesn't support to File API")
  }
});
/************************
Image Preview End
**************************/

/************************
CK Editor
**************************/
 ClassicEditor.create( document.querySelector( '.ck-editor' ) );
/************************
CK Editor End
**************************/


});