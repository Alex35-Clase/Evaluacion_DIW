getGrossByYear().then(res => {
  initGrossChart(res[0]);
  initMovieCountChart(res[1]);
});

/**
 * 
 * @param {Map<number, number>} movieYearData 
 */

function initMovieCountChart(movieYearData) {
  const pieChartData = [];
  movieYearData.forEach((val, key) => {
    pieChartData.push({
      value: val,
      name: key
    });
  });
  const yearDataChart = echarts.init(document.getElementById('movieYearsChartMain'));
  const option = {
    title: {
      text: "Películas por año",
    },
    series: [
      {
        name: "peliculas",
        type: 'pie',
        data: pieChartData,
        radius: '100%'
      }
    ]
  }
  yearDataChart.setOption(option);
}

/**
 * @param {Map<string, number>} grossData 
 */
function initGrossChart(grossData) {
  const grossChartData = echarts.init(document.getElementById('grossChartMain'));
  const option = {
    title: {
      text: "Dinero/Años",
    },
    tooltip: {},
    legend: {
      data: ["gross"]
    },
    xAxis: {
      data: Array.from(grossData.keys())
    },
    yAxis: {},
    series: [
      {
        name: "gross",
        type: "line",
        data: Array.from(grossData.values())
      }
    ]
  };
  grossChartData.setOption(option);
}