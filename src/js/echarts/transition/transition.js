/**
 * WAU transition
 * 2015.05
 */


/**
 * Constants
 */

var WIDTH = $('.wau-graph').width(),
    HEIGHT = 600,
    BAR_HEIGHT = 50,
    BAR_MARGIN = 400,
    LINK_HIDE_OPACITY = 0.05,
    LINK_NORMAL_OPACITY = 0.3,
    LINK_HIGH_OPACITY = 0.7,
    isIE9 = navigator.userAgent.indexOf('MSIE 9.0') > 0,
    isIE10 = navigator.userAgent.indexOf('MSIE 10.0') > 0,
    wau = d3.wau().size([WIDTH, HEIGHT]);  // WAU layout helper

/**
 * WAU Graph
 */

var wauGraph = (function(wau) {

  var svg,  // <svg>
      filter,  // Gray filter
      dateGroup,  // date <g>
      activeGroup,  // active <g>
      lossGroup,  // loss <g>
      widthScale,
      frontClassName = '',
      color = d3.scale.ordinal().domain(['R1', 'R2~R4', 'RN', 'R2N', 'N', 'L1', 'L2~L4', 'LN']).range(['#F7A897', '#C9342F', '#AF1923', '#DD5143', '#7CB82F', '#9BDAF3', '#009FDF', '#004673']);

  return {

    // 初始化svg元素，加载指定日期数据
    init: function(date, callback) {
      var self = this;

      svg = d3.select(".wau-graph").append("svg").attr("width", WIDTH).attr("height", HEIGHT);
      filter = svg.append("defs").append("filter").attr("id", "gray").append("feColorMatrix").attr("type", "matrix").attr("values", "0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0  0  0  1 0");
      gradient = svg.select("defs").append("linearGradient").attr("id", "grad").attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "0%");

      gradient.append("stop").attr("offset", "20%").attr("stop-color", "rgb(255, 255, 255)").attr("stop-opacity", 0);
      gradient.append("stop").attr("offset", "100%").attr("stop-color", "rgb(0, 70, 115)").attr("stop-opacity", 1);

      dateGroup = svg.append("g").attr("class", "date-group");
      activeGroup = svg.append("g").attr("class", "active-group");
      lossGroup = svg.append("g").attr("class", "loss-group");

      this.loadData(date, function(data) {
        callback(data);
      });
    },

    // 加载指定日期数据
    loadData: function(date, callback) {
      //var url = '/apps/' + UMENG.APPKEY + '/wau/get_transition_raw_data.json?date=' + date;
      //var url = 'wau/json.js';

      //d3.json(url, function(raw) {
      //  callback(raw);
      //});
      callback({
        "result":"succeed",
        "dates":["2017-03-26","2017-04-02"],
        "stats":[{
          "N":{
            "value":688,
            "fullname":"新增用户",
            "next":{
              "L1":489,
              "R2~R4":199
            }
          },
          "L1":{
            "value":1482,
            "fullname":"本周流失用户",
            "next":{
              "L2~L4":1257,
              "R1":225
            }
          },
          "L2~L4":{
            "value":3593,
            "fullname":"近期连续流失用户",
            "next":{
              "LN":1070,
              "L2~L4":2309,
              "R1":214
            }
          },
          "LN":{
            "value":277,
            "fullname":"长期流失用户",
            "next":{
              "R1":277
            }
          },
          "R1":{
            "value":666,
            "fullname":"回流用户",
            "next":{
              "L1":470,
              "R2~R4":196
            }
          },
          "R2~R4":{
            "value":727,
            "fullname":"连续活跃用户",
            "next":{"L1":315,"R2~R4":318,"RN":94}
          },
          "RN":{
            "value":1134,
            "fullname":"忠诚用户",
            "next":{"L1":94,"RN":1040}
          }
        }, {
          "N":{
            "value":751,
            "fullname":"新增用户"
          }
        }]
      });
    },

    // 绘制图形
    drawGraph: function(raw) {
      var self = this,
          dateFormat = d3.time.format("%-m月%-d日"),
          firstWeekDate = new Date(raw.dates[0]);

      // 初始化WAU布局
      wau.data(raw.stats[0]).layout();

      // 获取width scale
      widthScale = wau.widthScale();

      // 定位群组
      dateGroup.translate([0, 0]);
      activeGroup.translate([wau.activeOffset, 0]);
      lossGroup.translate([wau.lossOffset, BAR_HEIGHT]);

      // 绘制日期标签
      dateGroup.append('text').attr('x', 20).attr('y', 80).text(dateFormat(firstWeekDate) + '~' + dateFormat(new Date(firstWeekDate.setDate(firstWeekDate.getDate() + 6))));
      dateGroup.append('text').attr('x', 20).attr('y', 480).text(dateFormat(new Date(firstWeekDate.setDate(firstWeekDate.getDate() + 1))) + '~' + dateFormat(new Date(firstWeekDate.setDate(firstWeekDate.getDate() + 6))));

      // 绘制活跃、留存条
      this.drawBar(activeGroup, 'this', wau.thisWeekR(), 0);  // activeGroup this-week
      this.drawBar(activeGroup, 'next', wau.nextWeekR(), BAR_MARGIN);  // activeGroup next-week
      this.drawBar(lossGroup, 'this', wau.thisWeekL(), 0);  // lossGroup this-week
      this.drawBar(lossGroup, 'next', wau.nextWeekL(), BAR_MARGIN);  // lossGroup next-week

      // 转换链接
      this.drawLink(activeGroup, wau.computeLink());
      this.drawLink(lossGroup, wau.computeLossLink());

      // 绘制下周新增（由于下周新增特殊性，所以单独绘制）
      var nextR1 = wau.nextWeekL().filter(function (d) { return d.name === "R1"; })[0];
      var nextNew = raw.stats[1]['N'];
      nextNew.name = 'N';

      var group5 = lossGroup.selectAll(".next-week-n").data([nextNew])
                    .enter()
                      .append("g")
                        .attr("class", "next-week-n")
                        .attr("data-type", "r")
                        .attr("data-week", "next")
                        .attr("opacity", 1)
                        .translate(function (d) { d.v0 = nextR1.v0 - d.value;return [widthScale(d.v0), BAR_HEIGHT]; });

      this.drawSegment(group5, BAR_MARGIN);
      this.drawText(group5, BAR_MARGIN + 30);

      // 绘制LN未显示部分
      lossGroup.selectAll('.loss-dim').data([0, BAR_MARGIN])
        .enter()
          .append('rect')
            .attr('class', function(d, i) { return d ? 'next-week' : 'this-week'; })
            .attr('x', -50)
            .attr('y', function(d) { return d; })
            .attr('width', BAR_HEIGHT)
            .attr('height', 50)
            .attr('data-type', 'l')
            .attr('data-id', 'LN')
            .attr('fill', 'url(#grad)');
    },

    // 清理图形
    clear: function() {
      [dateGroup.node(), activeGroup.node(), lossGroup.node()].forEach(function(node) {
        var last;
        while (last = node.lastChild) node.removeChild(last);
      });
    },

    // 重绘图形
    reDraw: function(width) {
      wau.size([width, 600]).layout();
      widthScale = wau.widthScale();

      d3.select(".wau-graph svg").attr("width", width);

      activeGroup.transition().translate([wau.activeOffset, 0]);
      lossGroup.transition().translate([wau.lossOffset, BAR_HEIGHT]);

      d3.selectAll('g.this-week, g.next-week').transition().translate(function (d) { return [widthScale(d.v0), 0]; });
      d3.selectAll('g.next-week-n').transition().translate(function (d) { return [widthScale(d.v0), BAR_HEIGHT]; });
      d3.selectAll('.this-week rect, .next-week rect, .next-week-n rect').transition().attr("width", function (d) { return widthScale(d.value); });

      d3.selectAll(".link").transition().attr("d", wau.link);
      d3.selectAll('.label').transition().attr('x', wau.textX);
    },

    /**
     * 图形绘制
     */

    // 绘制条
    drawBar: function(containerGroup, week, data, y) {
      var group = this.drawSegmentGroups(containerGroup, week, data);

      this.drawSegment(group, y);
      this.drawText(group, y + 30);
    },

    // 绘制节点组 (activeGroup/lossGroup, this-week/next-weeek, data)
    drawSegmentGroups: function(group, week, data) {
      var self = this,
          className = week + '-week';

      return group.selectAll("." + className).data(data)
                  .enter()
                    .append("g")
                      .attr("class", className)
                      .attr("data-id", function (d) { return d.name; })
                      .attr("data-type", function (d) { return d.name.indexOf("L") === -1 ? "r" : "l"; })
                      .attr("data-week", week)
                      .translate(function (d) { return [widthScale(d.v0), 0]; })
                      .on("mouseenter", function (d) {
                        d3.event.stopPropagation();

                        var highlightAttr = '[data-' + (week === 'this' ? 'from' : 'to') + '="' + d.name + '"]',
                            parentClassName = '.' + this.parentNode.className.baseVal,
                            isChange = frontClassName !== parentClassName;

                        d3.selectAll(highlightAttr).transition('meopacity').duration(50).attr("opacity", LINK_HIGH_OPACITY);

                        if (isChange) {
                          frontClassName = parentClassName;
                          self.toFront(parentClassName);
                        }
                      })
                      .on("mouseleave", function(d) {
                        d3.event.stopPropagation();

                        var parentClassName = '.' + this.parentNode.className.baseVal,
                            otherSelector = (parentClassName === ".loss-group") ? '.active-group' : '.loss-group',
                            isChange = frontClassName !== parentClassName;

                        d3.selectAll('.label').transition('mlopacity').duration(50).attr("opacity", 0);
                        d3.selectAll('.link').transition('opacity2').duration(50).attr("opacity", LINK_HIDE_OPACITY);

                        if (isIE9 || isIE10) {
                          d3.selectAll(otherSelector).transition('opacity2').duration(90).attr('opacity', 1);
                        } else {
                          d3.selectAll(otherSelector).transition('opacity2').duration(90).attr('opacity', 1).style('filter', '');
                        }

                        self.resetHighlight();

                        frontClassName = '';
                      });
    },

    drawSegment: function(group, y) {
      group
        .append("rect")
          .attr("x", 0)
          .attr("y", y)
          .attr("width", function (d) { return widthScale(d.value); })
          .attr("height", BAR_HEIGHT)
          .attr("fill", function (d) { return color(d.name); })
          .attr("data-name", function (d) { return d.name; });

      group
        .append("title")
          .text(function (d) { return d.fullname; });
    },

    drawText: function(group, y) {
      group
        .append("text")
          .attr("x", 0)
          .attr("y", y)
          .attr("fill", "#fff")
          .translate([6, 0])
          .text(function (d) { return d.fullname; });
    },

    drawLink: function(group, data) {
      group.selectAll(".link").data(data)
        .enter()
          .append("path")
            .attr("class", "link")
            .attr("d", wau.link)
            .attr("opacity", 0.05)
            .attr("data-from", function(d) { return d.from; })
            .attr("data-to", function(d) { return d.to; })
            .attr("fill", function(d) { return color(d.from); });

      group.selectAll('.label').data(data)
        .enter()
          .append('text')
            .attr('class', 'label')
            .attr('x', wau.textX)
            .attr('y', function(d, i) { return BAR_MARGIN / 2 + (i % 4 * 20); })
            .attr('opacity', '0')
            .attr("data-from", function(d) { return d.from; })
            .attr("data-to", function(d) { return d.to; })
            .attr('text-anchor', 'middle')
            .text(function(d) { return d.value + '(' + (d.value / d.total * 100).toFixed(2)  + '%)' });
    },

    /**
     * 状态处理
     */

    reorderDOM: function(selector) {
      var el = document.querySelector(selector);
      document.querySelector('svg').appendChild(el);
    },

    // 前置群组
    toFront: function(selector) {
      var otherSelector = (selector === ".loss-group") ? '.active-group' : '.loss-group';

      d3.select(selector).transition('opacity').duration(100).attr('opacity', 1).style('filter', '');

      if (isIE9 || isIE10) {
        d3.select(otherSelector).transition('opacity2').duration(110).attr('opacity', 0.2);
      } else {
        d3.select(otherSelector).transition('opacity2').duration(110).attr('opacity', 0.2).style('filter', 'url(#gray)');
      }
    },

    // 重置高亮状态
    resetHighlight: function() {
      d3.selectAll(".link").interrupt().transition('opacity2').duration(50).attr("opacity", LINK_HIDE_OPACITY);
      d3.selectAll('.active-group, .loss-group').transition('opacity2').duration(90).attr('opacity', 1).style('filter', '');
    },

    // 高亮
    highlight: function(selector) {
      d3.selectAll(selector).transition('highlight-opacity').attr('opacity', 1).style('filter', '');
    },

    // 去除高亮
    unHighlight: function(selector) {
      if (isIE9 || isIE10) {
        d3.selectAll(selector).transition('highlight-opacity').attr('opacity', LINK_NORMAL_OPACITY);
      } else {
        d3.selectAll(selector).transition('highlight-opacity').attr('opacity', LINK_NORMAL_OPACITY).style('filter', 'url(#gray)');
      }
    }
  };

} (wau));


$(function() {

  var format = d3.time.format("%Y-%m-%d"),
      pickerFormat = d3.time.format("%Y.%m.%d"),
      recentSat = d3.time.saturday.floor(new Date()),
      recentSun = d3.time.sunday.floor(new Date());

  // Set default dates
  $('.datepickerPanelArea .start').text( pickerFormat( new Date(recentSat.getTime() - 24 * 3600 * 1000 * 13) ) );
  $('.datepickerPanelArea .end').text( pickerFormat( new Date(recentSat.getTime() - 24 * 3600 * 1000 * 7) ) );

  // WAU graph
  wauGraph.init(format(new Date(recentSun.getTime() - 24 * 3600 * 1000 * 14)), function(data) {
    $('.wait-load').hide();

    if (data.result === "succeed") {
      // 绘制图形
      wauGraph.drawGraph(data);

      // 设置指标操作事件
      indicesOperation();

      // 响应 resize 事件
      window.addEventListener('resize', debounce(function() {
        wauGraph.reDraw($('.wau-graph').width());
      }, 250));
    } else {
      // 错误信息
      $('.wau-graph', '.graph-container').css('height', '0');
      $('.error-info', '.graph-container').show();
    }
  });

  // Date picker
  $('.datepickerPanelArea').jCalArea({
    monthSelect: false,
    daySelect: false,
    dCheck: function(day) { return day < new Date(recentSat.getTime() - 24 * 3600 * 1000 * 6); },
    //dow: I18n.t('constant.date.weeks_min').split(','),
    dow: '日,一,二,三,四,五,六'.split(','),
    timeUnit: 'weekly',
    forceWeek: true,
    dayOffset: 0,
    buttons: [{
      //name: I18n.t('components.buttons.confirm'),
      name: '确定',
      click: function(opt, arr) {

        $('.date-yesterday').removeClass('on');
        $('.wait-load').show();

        $('.error-info', '.graph-container').hide();
        $('.wau-graph', '.graph-container').css('height', '600px');

        wauGraph.clear();

        wauGraph.loadData(arr[0], function(data) {
          $('.wait-load').hide();
          wauGraph.drawGraph(data);
        });
      }
    }]
  });

  //var player = new YKU.Player('youkuplayer', { client_id:'588765613415427b', vid:'XMTI0ODQzNzc0NA', width:'860', height:'485' });
  //$(".boxer").boxer({fixed: true});


  /**
   * 指标操作
   */

  function indicesOperation() {
    // 活跃用户
    $(".js-weekly-active-user")
      .on("mouseenter", function () {
        activeLossUserMouseEnter();
        wauGraph.unHighlight('[data-type="l"]');
      })
      .on("mouseleave", function () {
        activeLossUserMouseLeave();
        wauGraph.highlight('[data-type="l"]');
      });

    // 流失用户
    $(".js-weekly-loss-user")
      .on("mouseenter", function () {
        activeLossUserMouseEnter();
        wauGraph.unHighlight('[data-type="r"]');
      })
      .on("mouseleave", function () {
        activeLossUserMouseLeave();

        wauGraph.highlight('[data-type="r"]');
      });

    // 活跃 & 流失 用户转移
    $(".js-user-transfer")
      .on("mouseenter", function () {
        var isActive = d3.select(this).classed('js-active');

        if (isActive) {
          wauGraph.toFront(".active-group");
        } else {
          wauGraph.toFront(".loss-group");
          wauGraph.unHighlight('.next-week-n');
        }

        d3.selectAll(".link").transition("opacity").duration(50).attr("opacity", LINK_HIGH_OPACITY);
      })
      .on("mouseleave", function () {
        wauGraph.highlight('.next-week-n');
        wauGraph.resetHighlight();
      });

    // 用户留存
    $('.js-user-retention')
      .on('mouseenter', function() {
        d3.selectAll('.link[data-to="R2~R4"], .link[data-to="RN"]').transition('opacity').duration(100).attr("opacity", LINK_HIGH_OPACITY);

        wauGraph.unHighlight('[data-type="l"]');
        wauGraph.toFront(".active-group");
      }).on('mouseleave', function() {
        wauGraph.highlight('[data-type="l"]');
        wauGraph.resetHighlight();
      });

    // 用户流失
    $('.js-user-loss')
      .on('mouseenter', function() {
        d3.selectAll('.link[data-to="L1"]').transition('opacity').duration(100).attr("opacity", LINK_HIGH_OPACITY);

        wauGraph.unHighlight('.next-week[data-id="R2~R4"], .next-week[data-id="RN"]');
        wauGraph.toFront(".active-group");
      }).on('mouseleave', function() {
        wauGraph.highlight('.next-week[data-id="R2~R4"], .next-week[data-id="RN"]');
        wauGraph.resetHighlight();
      });

    // 用户回流
    $('.js-user-back')
      .on('mouseenter', function() {
        d3.selectAll('.link[data-to="R1"]').transition('opacity').duration(100).attr("opacity", LINK_HIGH_OPACITY);

        wauGraph.unHighlight('.next-week[data-id="L2~L4"], .next-week[data-id="LN"], .next-week-n');
        wauGraph.toFront(".loss-group");
      })
      .on('mouseleave', function() {
        wauGraph.highlight('.next-week[data-id="L2~L4"], .next-week[data-id="LN"], .next-week-n');
        wauGraph.resetHighlight();
      });

    // 留存系数
    $('.js-retention-coefficient')
      .on('mouseenter', function() {
        activeLossUserMouseEnter();
        wauGraph.unHighlight('[data-type="l"], .next-week[data-id="R1"], .next-week-n');
      })
      .on('mouseleave', function() {
        activeLossUserMouseLeave();
        wauGraph.highlight('[data-type="l"], .next-week[data-id="R1"], .next-week-n');
      });

    // 回流系数
    $('.js-reflux-coefficient')
      .on('mouseenter', function() {
        wauGraph.unHighlight('.active-group .next-week, .next-week-n, [data-type="l"]');
        d3.selectAll(".link").transition("opacity").attr("opacity", 0);
      })
      .on('mouseleave', function() {
        wauGraph.highlight('.active-group .next-week, .next-week-n, [data-type="l"]');
        d3.selectAll(".link").transition("opacity").attr("opacity", LINK_HIDE_OPACITY);
      });

    // 平衡系数
    $('.js-balance-coefficient')
      .on('mouseenter', function() {
        activeLossUserMouseEnter();
        wauGraph.unHighlight('[data-type="l"], .next-week-n');
      })
      .on('mouseleave', function() {
        activeLossUserMouseLeave();
        wauGraph.highlight('[data-type="l"], .next-week-n');
      });

    // 变化系数
    $('.js-change-coefficient')
      .on('mouseenter', function() {
        activeLossUserMouseEnter();
        wauGraph.unHighlight('[data-type="l"]');
      })
      .on('mouseleave', function() {
        activeLossUserMouseLeave();
        wauGraph.highlight('[data-type="l"]');
      });
  }


  /*
    Event helper
  */

  function activeLossUserMouseEnter() {
    var r1TranslateX = d3.transform(d3.select('.next-week[data-id="R1"]').attr("transform"))['translate'][0],
        nTranslateX = d3.transform(d3.select('.next-week-n').attr("transform"))['translate'][0];

    d3.select('.next-week[data-id="R1"]').transition('move').translate([r1TranslateX, -BAR_HEIGHT]);
    d3.select('.next-week-n').transition('move').translate([nTranslateX, -BAR_HEIGHT]);
    d3.select('.next-week[data-id="L1"]').transition('move').translate([r1TranslateX - wau.activeOffset + wau.lossOffset, BAR_HEIGHT]);

    d3.selectAll(".link").transition("opacity").attr("opacity", 0);
  }

  function activeLossUserMouseLeave() {
    var r1TranslateX = d3.transform(d3.select('.next-week[data-id="R1"]').attr("transform"))['translate'][0],
          nTranslateX = d3.transform(d3.select('.next-week-n').attr("transform"))['translate'][0];

      d3.select('.next-week[data-id="R1"]').transition("move2").translate([r1TranslateX, 0]);
      d3.select(".next-week-n").transition("move2").translate([nTranslateX, BAR_HEIGHT]);
      d3.select('.next-week[data-id="L1"]').transition("move2").translate([0, 0]);

      d3.selectAll(".link").transition("opacity2").attr("opacity", LINK_HIDE_OPACITY);
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

});
