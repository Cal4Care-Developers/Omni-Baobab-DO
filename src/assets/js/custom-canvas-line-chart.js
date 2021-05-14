      window.onload = function () {

        var chart = new CanvasJS.Chart("chartContainer", {
          animationEnabled: true,
          exportEnabled: true,
          toolTip: {
            shared: true
          },
          legend:{
            cursor:"pointer",
            itemclick: toggleDataSeries
          },
          data: [{        
            type: "spline",  
            name: "CR Unit Workgroup",        
            showInLegend: true,
            dataPoints: [
            { label: "0" , y: 0 },     
            { label:"400ms", y: 25 },     
            { label: "800ms", y: 50 },     
            { label: "1200ms", y: 75 },     
            { label: "1600ms", y: 75 },
            { label: "2000ms", y: 90 }
            ]
          }, 
          {        
            type: "spline",
            name: "Pace Workgroup",        
            showInLegend: true,
            dataPoints: [
            { label: "0" , y: 10 },     
            { label:"400ms", y: 30 },     
            { label: "800ms", y: 65 },     
            { label: "1200ms", y: 45 },     
            { label: "1600ms", y: 80 },
            { label: "2000ms", y: 95 }
            ]
          },
          {        
            type: "spline",  
            name: "QSM Workgroup",        
            showInLegend: true,
            dataPoints: [
            { label: "0" , y: 15 },     
            { label:"400ms", y: 75 },     
            { label: "800ms", y: 25 },     
            { label: "1200ms", y: 85 },     
            { label: "1600ms", y: 95 },
            { label: "2000ms", y: 35 }
            ]
          }]
        });

        chart.render();

        function toggleDataSeries(e) {
          if(typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
          }
          else {
            e.dataSeries.visible = true;            
          }
          chart.render();
        }

      }