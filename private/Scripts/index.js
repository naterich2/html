var timeLineChart, hrFrom=-1, hrUntil=-1;
function padNumber(num) {
    return ("00" + num).substr(-2,2);
}
function objectToArray(p){
    var keys = Object.keys(p);

    //Sorts by increasing hour
    keys.sort(function(a, b) {
        return a - b;
    });

    var arr = [], idx = [];
    for (var i = 0; i < keys.length; i++) {
        //preserves dictionary after sort
        arr.push(p[keys[i]]);
        idx.push(keys[i]);
    }
    //returns [hour[],queries[]]
    return [idx,arr];
}
function buttonPush(){
  hrFrom=-1;
  hrUntil=-1;
  updateGraph();
}

function updateGraph(){
  var selected = parseInt($("#selected").val());
  var apiString="http://192.168.0.34/admin/api.php"
  var sNow = Math.floor((new Date()).valueOf()/1000);
  switch(selected){
    //Last hour
    case 0:
      var sHourAgo = sNow-4200;
      apiString=apiString+"?overTimeData10mins&from="+sHourAgo+"&until="+sNow;
      $('#chartLabel').text("Queries over the last hour:");
      break;
    //last 8 hours
    case 1:
      var sThreeAgo = sNow-29400;
      apiString=apiString+"?overTimeData10mins&from="+sThreeAgo+"&until="+sNow;
      $('#chartLabel').text("Queries over the last 8 hours:");
      break;
    //Last 24 hours: default
    case 2:
      apiString=apiString+"?overTimeData10mins";
      $('#chartLabel').text("Queries over the last 24 hours: ");
      break;
    //Last custom
    case 3:
      var dateFrom, dateUntil;
      if(hrFrom==-1 && hrUntil ==-1){
        hrFrom = parseInt(prompt("Enter from (0-24): ", 12));
        hrUntil = parseInt(prompt("Enter until (0-24): ", 13));
      }
        if(hrFrom>hrUntil){
          alert("From must be less than until");
          updateGraph();
        } else {
          //TODO: add feature to look at times for previous day, or times
          //between midnight, e.g. between 2200 and 0400 the next day
          dateFrom = Math.floor(((new Date()).setHours(hrFrom)).valueOf()/1000)-600;
          dateUntil = Math.floor(((new Date()).setHours(hrUntil)).valueOf()/1000);
        }
        apiString=apiString+"?overTimeData10mins&from="+dateFrom+"&until="+dateUntil;
        $('#chartLabel').text("Queries from "+hrFrom+" to "+hrUntil+": ");
      break;

    default:
      apiString.concat("?overTimeData10mins");
      break;
  }
  console.log(apiString);
  $.getJSON(apiString, function(data) {
    data.domains_over_time = objectToArray(data.domains_over_time);
    data.ads_over_time = objectToArray(data.ads_over_time);


    timeLineChart.data.labels = [];
    timeLineChart.data.datasets[0].data = [];
    timeLineChart.data.datasets[1].data = [];
    for (var hour in data.ads_over_time[0]) {
        if ({}.hasOwnProperty.call(data.ads_over_time[0], hour)) {
            var d,h;
            h = parseInt(data.domains_over_time[0][hour]);
            if(parseInt(data.ads_over_time[0][0]) < 1200)
            {
                // Fallback - old style
                d = new Date().setHours(Math.floor(h / 6), 10 * (h % 6), 0, 0);
            }
            else
            {
                // New style: Get Unix timestamps
                d = new Date(1000*h);
            }

            timeLineChart.data.labels.push(d);
            timeLineChart.data.datasets[0].data.push(data.domains_over_time[1][hour]);
            timeLineChart.data.datasets[1].data.push(data.ads_over_time[1][hour]);
        }
    }
    console.log(timeLineChart.data.labels);
    timeLineChart.update();
  });
}

function updateSummaryData(){
  var aString = "<a href=\"http://192.168.0.34/admin\" target=\"_blank\" style=\"color:black; text-decoration:none;\">";
  $.getJSON("http://192.168.0.34/admin/api.php", function(data){
    try{
      document.getElementById("numBlocked").innerHTML = (aString+data.domains_being_blocked+"</a>");
      console.log(aString+data.domains_being_blocked+"</a>");
      document.getElementById("qToday").innerHTML = (aString+data.dns_queries_today+"</a>");
      document.getElementById("blockedToday").innerHTML = aString+data.ads_blocked_today+"</a>";
      document.getElementById("adPercent").innerHTML = aString+data.ads_percentage_today+"</a>";
      document.getElementById("uniqueD").innerHTML = aString+data.unique_domains+"</a>";
      document.getElementById("qForward").innerHTML = aString+data.queries_forwarded+"</a>";
      document.getElementById("qCached").innerHTML = aString+data.queries_cached+"</a>";
      document.getElementById("uniqueID").innerHTML = aString+data.unique_clients+"</a>";
    }catch(err){
      alert(err.message);
    }
  });
}
$(document).ready(function(){
  updateSummaryData();
  updateGraph();
  var ctx = document.getElementById("queryChart").getContext("2d");
  timeLineChart = new Chart(ctx, {
      type: "line",
      data: {
          labels: [],
          datasets: [
              {
                  label: "Total DNS Queries",
                  fill: true,
                  backgroundColor: "rgba(220,220,220,0.5)",
                  borderColor: "rgba(0, 166, 90,.8)",
                  pointBorderColor: "rgba(0, 166, 90,.8)",
                  pointRadius: 1,
                  pointHoverRadius: 5,
                  data: [],
                  pointHitRadius: 5,
                  cubicInterpolationMode: "monotone"
              },
              {
                  label: "Blocked DNS Queries",
                  fill: true,
                  backgroundColor: "rgba(221,0,51,0.5)",
                  borderColor: "rgba(221,0,51,1)",
                  pointBorderColor: "rgba(221,0,51,1)",
                  pointRadius: 1,
                  pointHoverRadius: 5,
                  data: [],
                  pointHitRadius: 5,
                  cubicInterpolationMode: "monotone"
              }
          ]
      },
      options: {
          tooltips: {
              enabled: true,
              mode: "x-axis",
              callbacks: {
                  title: function(tooltipItem, data) {
                      var label = tooltipItem[0].xLabel;
                      var time = label.match(/(\d?\d):?(\d?\d?)/);
                      var h = parseInt(time[1], 10);
                      var m = parseInt(time[2], 10) || 0;
                      var from = padNumber(h)+":"+padNumber(m-5)+":00";
                      var to = padNumber(h)+":"+padNumber(m+4)+":59";
                      return "Queries from "+from+" to "+to;
                  },
                  label: function(tooltipItems, data) {
                      if(tooltipItems.datasetIndex === 1)
                      {
                          var percentage = 0.0;
                          var total = parseInt(data.datasets[0].data[tooltipItems.index]);
                          var blocked = parseInt(data.datasets[1].data[tooltipItems.index]);
                          if(total > 0)
                          {
                              percentage = 100.0*blocked/total;
                          }
                          return data.datasets[tooltipItems.datasetIndex].label + ": " + tooltipItems.yLabel + " (" + percentage.toFixed(1) + "%)";
                      }
                      else
                      {
                          return data.datasets[tooltipItems.datasetIndex].label + ": " + tooltipItems.yLabel;
                      }
                  }
              }
          },
          legend: {
              display: false
          },
          scales: {
              xAxes: [{
                  type: "time",
                  time: {
                      displayFormats: {
                          hour: "HH:mm"
                      },
                      tooltipFormat: "HH:mm"
                  }
              }],
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          },
          maintainAspectRatio: false
      }
  });
});

setInterval(function(){
  updateSummaryData();
  updateGraph();
}, 30000)
