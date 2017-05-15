/**
 * Freshness - freshness.html.erb
 *
 * Note:
 *   2014.xx.xx:
 *     Create - wangfang@umeng.com
 *   2015.07.01:
 *     Optimize - wangfang@umeng.com
 *       - Add chart grid/zoom-in
 */

var now = new Date(),
    format = d3.time.format("%Y-%m-%d"),
    options = {
      chart: '#viz',
      width: document.getElementsByClassName("mod-body")[0].offsetWidth,
      height: 600,
      mouseOver: function() { tipVM.states.isShow = true; },
      mouseOut: function() { tipVM.states.isShow = false; },
      loaded: function() { document.getElementsByClassName('wait-load')[0].style.display = 'none' },
      failed: function() {
        document.getElementById('error-info').style.display = '';
        document.getElementById('viz').style.display = 'none';
      }
    };

/*
 Vue ViewModels
 */

var showingMethodsTabVM = new Vue({
  el: '#showing-methods-tab',
  data: {
    tabs: [{ name: "绝对值", value: 'zero' }, { name: "百分比", value: 'expand' }],
    activeIndex: 0
  },
  computed: {
    offset: function() {
      return this.tabs[this.activeIndex].value;
    }
  },
  methods: {
    onClickTab: function(tab, i) {
      if (this.activeIndex !== i) this.activeIndex = i;

      streamChart.draw({ offset: tab.value });

      if (appVM.states.isZoomIn) appVM.$emit('zoomIn');
    }
  }
});

var paletteVM = new Vue({
  el: '#color-container',
  data: {
    colors: [1, 2, 3],
    selectColorCate: 'color-category1',
    states: {
      isShow: false
    }
  },
  methods: {
    togglePalette: function(e) {
      e.stopPropagation();
      this.states.isShow = !this.states.isShow;
    },
    onClickColor: function(color, i, e) {
      e.stopPropagation();

      this.selectColorCate = 'color-category' + color;
      document.getElementById('chart-slider').className = 'd3-slider d3-slider-horizontal slider-color-category' + color;

      appVM.$emit('changeColor', i);
      streamChart.draw({ offset: showingMethodsTabVM.offset });

      if (appVM.states.isZoomIn) appVM.$emit('zoomIn');
    }
  }
});

var tipVM = new Vue({
  el: '#tip',
  data: {
    date: null,
    select: null,
    data: null,
    sumTitle: null,
    total: null,
    tipType: '当日',
    top: 0,
    left: 0,
    states: {
      isShow: false
    }
  }
});

/*
 helpers
 */

document.addEventListener('click', function() {
  paletteVM.states.isShow = false;
});

var debounceZooming = debounce(function() { appVM.$emit('zoomIn') }, 200);

function onSlide(e, v) {
  // Change debounce
  if (appVM.startDay == v[0] || appVM.endDay == v[1]) {
    appVM.startDay = d3.min(v);
    appVM.endDay = d3.max(v);

    debounceZooming();
  }
}

function formatDateRange(dates) {
  return dates.map(function(d, i) {
    return [d.getFullYear(), ("0" + (d.getMonth() + 1)).slice(-2), ("0" + d.getDate()).slice(-2)].join('-');
  });
}

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

var slider        = d3.slider().value([0, 7]).min(0).max(31).step(1).axis(d3.svg.axis().orient('bottom').ticks(4)).on("slide", onSlide),
    colorCategory = [
      ["#2f62b7", "#3166b8", "#336aba", "#356ebb", "#3772bc", "#3976bd", "#3c7abf", "#3e7ec0", "#4082c1", "#4286c3", "#448ac4", "#468ec5", "#4892c6", "#4a96c8", "#4c9ac9", "#4e9eca", "#51a1cc", "#53a5cd", "#55a9ce", "#57add0", "#59b1d1", "#5bb5d2", "#5db9d3", "#5fbdd5", "#61c1d6", "#63c5d7", "#66c9d9", "#68cdda", "#6ad1db", "#6cd5dc", "#6ed9de", "#70dddf"],
      ["#3c8ec7", "#3f91c3", "#4294bf", "#4497bc", "#479ab8", "#4a9db4", "#4da0b0", "#4fa3ac", "#52a5a9", "#55a8a5", "#58aba1", "#5bae9d", "#5db199", "#60b496", "#63b792", "#66ba8e", "#68bd8a", "#6bc086", "#6ec382", "#71c67f", "#73c97b", "#76cc77", "#79cf73", "#7cd26f", "#7fd46c", "#81d768", "#84da64", "#87dd60", "#8ae05c", "#8ce359", "#8fe655", "#92e951"],
      ["#f58863", "#f18a66", "#ed8d68", "#e98f6b", "#e5926e", "#e19471", "#dd9773", "#d99976", "#d69c79", "#d29e7c", "#cea17e", "#caa381", "#c6a684", "#c2a887", "#beab89", "#baad8c", "#b6b08f", "#b2b292", "#aeb594", "#aab797", "#a6ba9a", "#a2bc9d", "#9ebf9f", "#9ac1a2", "#97c4a5", "#93c6a8", "#8fc9aa", "#8bcbad", "#87ceb0", "#83d0b3", "#7fd3b5", "#7bd5b8"]
    ];

options = $.extend(options, {
            colors: colorCategory[0],
            //url: '/apps/' + UMENG.APPKEY + '/reports/load_chart_data?stats=freshness&start_date=' + format(new Date( now.getTime() - 7776000000 )) + '&end_date=' + format(now),
            url: '/apps/reports/load_chart_data?stats=freshness&start_date=' + format(new Date( now.getTime() - 7776000000 )) + '&end_date=' + format(now),
            mouseMove: mouseMove
          });

Vue.filter('dayFormat', dayFormat);

var appVM = new Vue({
  el: '.wrap-table',
  data: {
    startDay: 0,
    endDay: 7,
    states: {
      isZoomIn: false
    }
  },
  watch: {
    'states.isZoomIn': function (val, oldVal) {
      if (val) {
        this.$emit('zoomIn');
      } else {
        streamChart.draw({ offset: showingMethodsTabVM.offset });
      }
    }
  },
  ready: function() {
    this.$on('zoomIn', function() {
      streamChart.zoomLayers(32 - appVM.startDay, 31 - appVM.endDay);
    });

    this.$on('changeColor', function(i) {
      streamChart.setColor(colorCategory[i]);
    });
  },
  methods: {
    exportBasicReport: function(e) {
      var dates = streamChart.getDateRange();

      dates[0] = new Date(dates[0].getTime() + 86400000);
      dates = formatDateRange(dates);

      $(e.target)._export(e, {
        url: '/apps/' + UMENG.APPKEY + '/reports/load_table_data',
        stats: 'freshness_csv',
        start_date: dates[0],
        end_date: dates[1]
      });
    }
  }
});

$(function() {
  streamChart.init(options);  // init chart
  d3.select('#chart-slider').call(slider);  // init slider

  setTimeout(function(){
    options.url = '/addd/sss';
    //清除滚动范围选择条
    $('#chart-slider').empty();
    //清除svg图表
    $('svg').remove();
    //重置配色
    paletteVM.selectColorCate = 'color-category1';
    //重置用户成分分析
    appVM.startDay = 0;
    appVM.endDay = 7;
    appVM.states.isZoomIn = false;
    document.getElementById('chart-slider').className = 'd3-slider d3-slider-horizontal slider-color-category1';
    streamChart.init(options);
    slider  = d3.slider().value([0, 7]).min(0).max(31).step(1).axis(d3.svg.axis().orient('bottom').ticks(4)).on("slide", onSlide)
    d3.select('#chart-slider').call(slider);
  },6000);

  // Guide tips
  //if ( !+localStorage.getItem('newFreshnessGuides') ) {
  //  $('.dev', '.feedback_help').guideTip({
  //    top: '10px',
  //    left: '-311px',
  //    right: '0',
  //    corner: 'right',
  //    text: '点击帮助按钮，进入该功能的报表解读来查看',
  //    close: function() {
  //      localStorage.setItem('newFreshnessGuides', 1);
  //    }
  //  });
  //}
});

function mouseMove(d, i, data) {
  var filteredData, selectedSum,
      mouse         = d3.mouse(this);

  tipVM.top = mouse[1] + 80;
  tipVM.left = mouse[0] + ((options.width - mouse[0] > 335) ? 100 : - 210);

  if (!appVM.states.isZoomIn && tipVM.date === data.date && tipVM.data === d.values[data.dateIndex].value) return false; // Change debounce

  tipVM.date = data.date;

  // Is zoom in, Sorry for hardcoded tips text
  if (!appVM.states.isZoomIn) {
    tipVM.select = "在" + dayFormat(+d.key.slice(1)) + "新增（占当日活跃比）: ";
    tipVM.data = d.values[data.dateIndex].value + ' (' + (d.values[data.dateIndex].value / data.sum * 100).toFixed(2) + '%)';

    tipVM.sumTitle = "当日全部活跃：";
    tipVM.total = data.sum;
  } else {
    filteredData = data.dataPoints.filter(function(e) { return format(e.date) === data.date; }).slice(appVM.startDay, appVM.endDay + 1);
    selectedSum = d3.sum(filteredData, function(d) { return d.value; });

    tipVM.select = "在" + dayFormat(+d.key.slice(1)) + "新增（占" + dayFormat(appVM.startDay) + "至" + dayFormat(appVM.endDay) + "新增的当天活跃用户比：";
    tipVM.data = d.values[data.dateIndex].value + ' (' + (d.values[data.dateIndex].value / selectedSum * 100).toFixed(2) + '%)';

    tipVM.sumTitle = dayFormat(appVM.startDay) + "至" + dayFormat(appVM.endDay) + "新增的当天活跃用户：";
    tipVM.total = selectedSum;
  }
}

function dayFormat(i) {
  return (i == 0) ? '当天' : (i == 31) ? '30+天前' : i + '天前';
}

function onSlide(e, v) {
  // Change debounce
  if (appVM.startDay == v[0] || appVM.endDay == v[1]) {
    appVM.startDay = d3.min(v);
    appVM.endDay = d3.max(v);

    debounceZooming();
  }
}