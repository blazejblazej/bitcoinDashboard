$(document).ready(function () {

  
//Microsoft apple comparison chart 
  $.ajax({
    url: "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=AAPL&interval=1min&apikey=J23GGW7WKB4QYO6T",
    dataType: "json",
    data: "{}",
    success: function (data) {
      //api sends data every minute only for 2hrs a day - from 18:00 to 20:00
      //if current time is different fake time to 18:00
      
      var currentDate = moment(); //get todays date and time
      yestedayDate = currentDate.subtract(1, 'days').format("YYYY-MM-DD"); //remove 1 day from todays date and save it as YYYY-MM-DD format eg. 1998-05-04
      var format = "HH:mm";
      beforeTime = moment('18:00:00',format);
      afterTime = moment('20:00:00',format);
      // reference https://stackoverflow.com/questions/36197031/how-to-use-moment-js-to-check-whether-the-current-time-is-between-2-times
      if(currentDate.isBetween(beforeTime,afterTime)){
        var currentHour = moment().format(format); //make variable accesible outside scope - thats why var is used
      }
      else{
        var currentHour = moment(yestedayDate + " " + "19:20:00"); //fake time to 19:20
      }
      
      
        currentHour = currentHour.add(1,'minutes');
        console.log(currentHour);
        yestedayDateAndHour = yestedayDate + " " + currentHour + ":00"; //concatenate yesterdayDate + current hour + seconds as "00" because that's the format of data provided by API


      
        //last 5 minutes momentcepion is because moment elements are mutable https://momentjs.com/docs/#/manipulating/
        let hrsMinus5 = moment(currentHour.add(1,'minutes'));
        let hrsMinus4 = moment(moment(currentHour.add(1,'minutes')));
        let hrsMinus3 = moment(moment(moment(currentHour.add(1,'minutes'))));
        let hrsMinus2 = moment(moment(moment(moment(currentHour.add(1,'minutes')))));
        let hrsMinus1 = moment(moment(moment(moment(moment(currentHour.add(1,'minutes'))))));
        let hrsMinus0 = moment(moment(moment(moment(moment(moment(currentHour.add(1,'minutes')))))));
        
  
        //dates + last 5 minutes
        let yesterdayDateMinus5 = yestedayDate + " " + hrsMinus5.format(format) + ":00";
        let yesterdayDateMinus4 = yestedayDate + " " + hrsMinus4.format(format) + ":00";
        let yesterdayDateMinus3 = yestedayDate + " " + hrsMinus3.format(format) + ":00";
        let yesterdayDateMinus2 = yestedayDate + " " + hrsMinus2.format(format) + ":00";
        let yesterdayDateMinus1 = yestedayDate + " " + hrsMinus1.format(format) + ":00";
        let yesterdayDateMinus0 = yestedayDate + " " + hrsMinus0.format(format) + ":00";
        
        
        console.log(yesterdayDateMinus5);
        console.log(yesterdayDateMinus4);
        console.log(yesterdayDateMinus3);
        console.log(yesterdayDateMinus2);
        console.log(yesterdayDateMinus1);
        console.log(yesterdayDateMinus0);
  
        //data to input APPLE
        let first_data_AAPL = data["Time Series (1min)"][yesterdayDateMinus5]["1. open"];
        let second_data_AAPL = data["Time Series (1min)"][yesterdayDateMinus4]["1. open"];
        let third_data_AAPL = data["Time Series (1min)"][yesterdayDateMinus3]["1. open"];
        let fourth_data_AAPL = data["Time Series (1min)"][yesterdayDateMinus2]["1. open"];
        let fifth_data_AAPL = data["Time Series (1min)"][yesterdayDateMinus1]["1. open"];
        let sixth_data_AAPL = data["Time Series (1min)"][yesterdayDateMinus0]["1. open"];
  
        //second AJAX call, inside previous to get MSFT data after apple
        $.ajax({
          url: "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=1min&apikey=J23GGW7WKB4QYO6T",
          dataType: "json",
          data: "{}",
          success: function (data) {
                      //data to input MSFT
                      let first_data_MSFT = data["Time Series (1min)"][yesterdayDateMinus5]["1. open"];
                      let second_data_MSFT = data["Time Series (1min)"][yesterdayDateMinus4]["1. open"];
                      let third_data_MSFT = data["Time Series (1min)"][yesterdayDateMinus3]["1. open"];
                      let fourth_data_MSFT = data["Time Series (1min)"][yesterdayDateMinus2]["1. open"];
                      let fifth_data_MSFT = data["Time Series (1min)"][yesterdayDateMinus1]["1. open"];
                      let sixth_data_MSFT = data["Time Series (1min)"][yesterdayDateMinus0]["1. open"];
  
                      let stockValuesArray = [first_data_AAPL,second_data_AAPL,third_data_AAPL,fourth_data_AAPL,fifth_data_AAPL,sixth_data_AAPL,first_data_MSFT,second_data_MSFT,third_data_MSFT,fourth_data_MSFT,fifth_data_MSFT,sixth_data_MSFT];
                      let minStockValuesArray = Math.min(stockValuesArray); //get smallest value from Microsoft and Apples stocks in last 5 mins to make it bottom of the cart
                      
                      
                      let chart = new Chartist.Line('.ct-chart', {
                        
                        labels: [yesterdayDateMinus5, yesterdayDateMinus4, yesterdayDateMinus3, yesterdayDateMinus2, yesterdayDateMinus1, yesterdayDateMinus0],
                        series: [
                          [first_data_AAPL, second_data_AAPL, third_data_AAPL, fourth_data_AAPL, fifth_data_AAPL, sixth_data_AAPL],
                          [first_data_MSFT, second_data_MSFT, third_data_MSFT, fourth_data_MSFT, fifth_data_MSFT, sixth_data_MSFT],
                        ]
                          }, {
                      lineSmooth: Chartist.Interpolation.simple({
                        divisor: 3
                      }),
                      stackBars: true,
                      fullWidth: true,
                      chartPadding: {
                        right: 50
                      },
                      showArea: true,
                      low: minStockValuesArray,
                      plugins: [
                        Chartist.plugins.legend({
                            legendNames: ['Apple', 'Microsoft',],
                        })
                      ]
                          });
          }
          });

    },
    error: function (result) {
      alert("Error while accesing API data");
    }
  });
  $.ajax({
    url: "https://api.coindesk.com/v1/bpi/currentprice.json",
    dataType: "json",
    data: "{}",
    success: function (data) {
                //data to input MSFT
                let first_data_MSFT = data["Time Series (1min)"][yesterdayDateMinus5]["1. open"];
                let second_data_MSFT = data["Time Series (1min)"][yesterdayDateMinus4]["1. open"];
                let third_data_MSFT = data["Time Series (1min)"][yesterdayDateMinus3]["1. open"];
                let fourth_data_MSFT = data["Time Series (1min)"][yesterdayDateMinus2]["1. open"];
                let fifth_data_MSFT = data["Time Series (1min)"][yesterdayDateMinus1]["1. open"];
                let sixth_data_MSFT = data["Time Series (1min)"][yesterdayDateMinus0]["1. open"];

                let stockValuesArray = [first_data_AAPL,second_data_AAPL,third_data_AAPL,fourth_data_AAPL,fifth_data_AAPL,sixth_data_AAPL,first_data_MSFT,second_data_MSFT,third_data_MSFT,fourth_data_MSFT,fifth_data_MSFT,sixth_data_MSFT];
                let minStockValuesArray = Math.min(stockValuesArray); //get smallest value from Microsoft and Apples stocks in last 5 mins to make it bottom of the cart
                
                
                let chart = new Chartist.Line('.ct-chart', {
                  
                  labels: [yesterdayDateMinus5, yesterdayDateMinus4, yesterdayDateMinus3, yesterdayDateMinus2, yesterdayDateMinus1, yesterdayDateMinus0],
                  series: [
                    [first_data_AAPL, second_data_AAPL, third_data_AAPL, fourth_data_AAPL, fifth_data_AAPL, sixth_data_AAPL],
                    [first_data_MSFT, second_data_MSFT, third_data_MSFT, fourth_data_MSFT, fifth_data_MSFT, sixth_data_MSFT],
                  ]
                    }, {
                lineSmooth: Chartist.Interpolation.simple({
                  divisor: 3
                }),
                stackBars: true,
                fullWidth: true,
                chartPadding: {
                  right: 50
                },
                showArea: true,
                low: minStockValuesArray,
                plugins: [
                  Chartist.plugins.legend({
                      legendNames: ['Apple', 'Microsoft',],
                  })
                ]
                    });
    }
    });

});
