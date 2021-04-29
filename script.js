$(document).ready(function () {


  //create global array
  btcRateUSD = [];
  btcRateGBP = [];
  btcRateEUR = [];
  btcRateUsdGbpEur = [];
  btcTime = [];
  //create global flag to start script
  start = 0;
  //draw chart
  function drawChart(arr) {
    if (arr.length > 0) {
      new Chartist.Line('#line-chart', {
        series: [
          arr

        ],
        labels: btcTime
      }, {
        fullWidth: true,
        chartPadding: {
          right: 50
        },
        showArea: true,
        plugins: [
          Chartist.plugins.ctPointLabels({
            textAnchor: 'middle'
          })
        ]
      });
    }

  }

  function drawBarChart(arr) {
    // let chartBar = new Chartist.Bar('.ct-chart', {
    //     labels: ['GBP', 'USD', 'EUR'],
    //     series: [100,200,300]
    //   }, {
    //     distributeSeries: true
    //   });
    new Chartist.Bar('#bar-chart', {
      labels: ['GBP £', 'DOLLAR $', 'EURO €'],
      series: arr
    }, {
      distributeSeries: true,
      fullWidth: true,
      showArea: true
    });

  }

  //recursive function to start gathering data from API
  (function getBitcoinValue() {
    $.ajax({
      url: 'https://api.coindesk.com/v1/bpi/currentprice.json',
      dataType: "json",

      success: function (data) {
                //timer
        //https://www.growthsnippets.com/30-second-countdown-timer-javascript/
        var remainingTime = 28;
        var elem = document.getElementById('countdown_div');
        var timer = setInterval(countdown, 1000); //set the countdown to every second
        function countdown() {
          if (remainingTime == -1) {
            clearTimeout(timer);
          } else {
            elem.innerHTML = remainingTime + ' seconds';
            remainingTime--; //we subtract the second each iteration
          }
        }
        //timer end

        btcRateUSD.push(Math.floor(data["bpi"]["USD"]["rate_float"])); //add newest BTC rate to array, and floor
        btcRateGBP.push(Math.floor(data["bpi"]["GBP"]["rate_float"])); //add newest BTC rate to array, and floor
        btcRateEUR.push(Math.floor(data["bpi"]["EUR"]["rate_float"])); //add newest BTC rate to array, and floor
        btcTime.push(data["time"]["updateduk"].slice(15, -4)); //add time for newest BTC rate

        btcRateUsdGbpEur = [btcRateGBP[btcRateGBP.length - 1], btcRateUSD[btcRateUSD.length - 1], btcRateEUR[btcRateEUR.length - 1]];
        start++;
        console.log("BTC RATE:" + btcRateUSD);
        drawBarChart(btcRateUsdGbpEur);
        drawChart(btcRateUSD);
        
      },
      complete: function () {
        // Schedule the next request when the current one's complete
        setTimeout(getBitcoinValue, 30000);
      }
    });
  })();
});