/**
 * WAU transition layout
 */

d3.wau = function() {

  var wau = {},
      data = {},
      size = [1, 1],
      barHeight = 50,
      marginLeft = 150,
      weekPadding = 400,
      thisWeekArray = null,
      nextWeekArray = null,
      allSegment = null,
      widthScale = d3.scale.linear();

  wau.layout = function() {
    var self = this,
        thisWeekRTotal, thisWeekLTotal;

    // Extract data
    thisWeekArray = objToArray(data);
    nextWeekArray = extractNextWeek(data);

    thisWeekRTotal = d3.sum(self.thisWeekR(), function(d) { return d.value; }),
    thisWeekLTotal = d3.sum(self.thisWeekL(), function(d) { return d.value; });

    self.L1 = self.nextWeekR().filter(function (d) { return d.name === "L1"; })[0].value;

    self.graphWidth = d3.sum(nextWeekArray, function(d) { return d.value; }) - self.L1;

    // Init width scale (left margin 115px)
    widthScale.range([0, size[0] - marginLeft]).nice(1).domain([0, self.graphWidth]);

    // 计算活跃 & 流失部分相对偏移
    self.activeOffset = size[0] - widthScale(thisWeekRTotal) - 10; // right margin
    self.lossOffset = self.activeOffset - widthScale(thisWeekLTotal - self.L1);

    return wau;
  };

  wau.link = function(d) {
    var x0 = widthScale(d.x0),
        x1 = widthScale(d.x1),
        w = widthScale(d.value);

    return "M " + x0 + "," + barHeight + " L" + x1 + "," + weekPadding + " H" + (x1 + w) + " L" + (x0 + w) + "," + barHeight + " Z";
  };

  wau.textX = function(d) {
    var x0 = widthScale(d.x0),
        x1 = widthScale(d.x1),
        w = widthScale(d.value);

    return (x0 + x1 + w) / 2;
  };

  wau.activeUser = ['R1', 'R2~R4', 'R2N', 'RN', 'N'];
  wau.activeUserNext = ['L1', 'R2~R4', 'R2N', 'RN'];
  wau.fullnameMapping = {
    'N': '新增用户',
    'R1': '回流用户',
    'R2N': '上周新增用户',
    'R2~R4': '连续活跃用户',
    'RN': '忠诚用户',
    'L1': '本周流失用户',
    'L2~L4': '近期连续流失用户',
    'LN': '新增长期流失用户'
  };

  wau.thisWeek = function() { return thisWeekArray; };

  // this week Retained
  wau.thisWeekR = function() {
    var retained = thisWeekArray.filter(function(d) {
      return !(d.name.indexOf('L') > -1);
    });

    // sort
    retained.sort(compareByName);

    // retained.push(retained.shift());

    for (var i = 0; i < retained.length; i++) {
      if (i === 0) {
        retained[i].v0 = 0;
      } else {
        var prev = retained[i - 1];
        retained[i].v0 = (prev.v0 + prev.value);
      }
    }

    return retained;
  };

  // next week
  wau.nextWeekR = function() {
    var nextActive = nextWeekArray.filter(function(d, i) {
      return ['L1', 'R2~R4', 'R2N', 'RN'].indexOf(d.name) > -1;
    });

    for (var i = 0; i < nextActive.length; i++) {
      if (i === 0) {
        nextActive[i].v0 = 0;
      } else {
        var prev = nextActive[i - 1];
        // console.log(prev.v0, prev.value);
        nextActive[i].v0 = (nextActive[i - 1].v0 + nextActive[i - 1].value);
      }
    }

    return nextActive;
  };

  wau.thisWeekL = function() {
    var loss = thisWeekArray.filter(function(d) {
      return (d.name.indexOf('L') > -1);
    });

    loss.sort(compareByName).reverse();

    for (var i = 0; i < loss.length; i++) {
      if (i === 0) {
        loss[i].v0 = 0;
      } else {
        var prev = loss[i - 1];
        loss[i].v0 = (prev.v0 + prev.value);
      }
    }

    return loss;
  }

  wau.nextWeekL = function() {
    var loss = nextWeekArray.filter(function(d) {
      return ['L2~L4',  'LN', 'R1'].indexOf(d.name) > -1;
    });

    loss.sort(compareByName).reverse();
    loss.push( loss.shift() );

    for (var i = 0; i < loss.length; i++) {
      if (i === 0) {
        loss[i].v0 = 0;
      } else {
        var prev = loss[i - 1];
        loss[i].v0 = (prev.v0 + prev.value);
      }
    }

    return loss;
  }

  wau.computeLink = function() {
    var thisWeekR = this.thisWeekR(),
        nextWeekR = this.nextWeekR(),
        nextOffset = {},  // record next week part offset
        links = [];

    /*
      next week offset: { L1: 41, R2: 31, ... }
     */

    thisWeekR.forEach(function(node, i) {
      node.offset = 0; // this week part offset

      for (next in node.next) {
        var nextV0 = nextWeekR.filter(function(d) { return d.name === next; })[0].v0;

        nextOffset[next] = nextOffset[next] || 0;  // init next week part offset

        links.push({
          from: node.name,  // this week part name
          to: next,  // next week part name
          x0: node.v0 + node.offset,  // top bar x
          x1: nextV0 + nextOffset[next], // bottom bar x
          value: node.next[next],  // value (link width)
          total: node.value
        });

        node.offset += node.next[next];
        nextOffset[next] += node.next[next];

        // console.log(nextOffset);
      }
    });

    return links;
  }

  wau.computeLossLink = function() {
    var thisWeekL = this.thisWeekL(),
        nextWeekL = this.nextWeekL(),
        nextOffset = {},  // record next week part offset
        links = [];

    /*
      next week offset: { L1: 41, R2: 31, ... }
     */

    thisWeekL.forEach(function(node, i) {
      node.offset = 0; // this week part offset

      for (next in node.next) {
        var nextV0 = nextWeekL.filter(function(d) { return d.name === next; })[0].v0;

        nextOffset[next] = nextOffset[next] || 0;  // init next week part offset

        links.push({
          from: node.name,  // this week part name
          to: next,  // next week part name
          x0: node.v0 + node.offset,  // top bar x
          x1: nextV0 + nextOffset[next], // bottom bar x
          value: node.next[next],  // value (link width)
          total: node.value
        });

        node.offset += node.next[next];
        nextOffset[next] += node.next[next];
      }
    });

    return links;
  }

  wau.data = function(_) {
    if (!arguments.length) return data;
    data = _;
    return wau;
  };

  wau.widthScale = function(_) {
    if (!arguments.length) return widthScale;
    widthScale = _;
    return wau;
  };

  wau.size = function(_) {
    if (!arguments.length) return size;
    size = _;
    return wau;
  };

  wau.barHeight = function(_) {
    if (!arguments.length) return barHeight;
    barHeight = _;
    return wau;
  };

  wau.weekPadding = function(_) {
    if (!arguments.length) return weekPadding;
    weekPadding = _;
    return wau;
  };


  function extractNextWeek(data) {
    var keys = Object.keys(data),
        nextWeek = {};

    keys.forEach(function(d, i) {

      forIn(data[d].next, function(val, key) {
        if (nextWeek[key]) {
          nextWeek[key].value += val;
        } else {
          nextWeek[key] = {
            value: val,
            fullname: wau.fullnameMapping[key]
          };
        }
      });

    });

    return objToArray(nextWeek);
  }

  function forIn(obj, fn, thisObj) {
    var key, i = 0;

    for (key in obj) {
      if (exec(fn, obj, key, thisObj) === false) break;
    }

    function exec(fn, obj, key, thisObj) {
      return fn.call(thisObj, obj[key], key, obj);
    }

    return forIn;
  }

  function objToArray(obj) {
    var result = [];

    forIn(obj, function(val, key) {
      val['name'] = key;
      result.push(val);
    });

    return result;
  }

  function compareByName(a, b) {
      if (a.name > b.name) { return 1; }
      if (a.name < b.name) { return -1; }
      return 0;
  }

  return wau;
};