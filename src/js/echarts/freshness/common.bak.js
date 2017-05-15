
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