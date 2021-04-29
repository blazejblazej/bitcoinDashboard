$(document).ready(function () {
  //create global arrays to gather data to it and make it accesible from every function in code
  btcRateUSD = [];
  btcRateGBP = [];
  btcRateEUR = [];
  btcRateUsdGbpEur = [];
  btcTime = [];



  //draw line chart function
  function drawChart(arr) {
    if (arr.length > 0) {
      new Chartist.Line('#line-chart', {
        series: [
          arr //array with data
        ],
        labels: btcTime
      }, {
        fullWidth: true,
        showArea: true, //show area under chart line
        plugins: [
          Chartist.plugins.ctPointLabels({ //plugin which shows label above point
            textAnchor: 'middle'
          })
        ]
      });
    }

  }

  //bar chart function
  function drawBarChart(arr) {
    new Chartist.Bar('#bar-chart', {
      labels: ['GBP £', 'DOLLAR $', 'EURO €'],
      series: arr //array with data
    }, {
      distributeSeries: true,
      fullWidth: true,
      showArea: true,
      plugins: [
        Chartist.plugins.ctPointLabels({ //plugin which shows label above point
          textAnchor: 'middle'
        })
      ]
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
        let remainingTime = 28;
        let elem = document.getElementById('countdown_div');
        let timer = setInterval(countdown, 1000); //set the countdown to every second
        function countdown() {
          if (remainingTime == -1) {
            clearTimeout(timer);
          } else {
            elem.innerHTML = remainingTime + ' seconds';
            remainingTime--; //we subtract the second each iteration
          }
        }
        //timer end

        btcRateUSD.push(Math.floor(data["bpi"]["USD"]["rate_float"])); //add newest BTC rate in USD to array, and floor it
        btcRateGBP.push(Math.floor(data["bpi"]["GBP"]["rate_float"])); //add newest BTC rate in GBP to array, and floor it
        btcRateEUR.push(Math.floor(data["bpi"]["EUR"]["rate_float"])); //add newest BTC rate in EUR to array, and floor it
        btcTime.push(data["time"]["updateduk"].slice(15, -4)); //add time for newest BTC rate, slice it so it will print time only, without date and timezone

        //get all newest rates to one array
        btcRateUsdGbpEur = [btcRateGBP[btcRateGBP.length - 1], btcRateUSD[btcRateUSD.length - 1], btcRateEUR[btcRateEUR.length - 1]];
        console.log("BTC RATE:" + btcRateUSD);

        //draw bar chart with data from array
        drawBarChart(btcRateUsdGbpEur);

        //draw bar chart with data from array
        drawChart(btcRateUSD);

      },
      complete: function () {
        // Schedule the next request when the current one's complete
        setTimeout(getBitcoinValue, 30000);
      }
      // ajax req end
    });
    //getBitcoinValue end
  })();
  // document ready function end
});