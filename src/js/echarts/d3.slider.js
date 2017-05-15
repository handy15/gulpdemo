/**
 * Created by 145198 on 2017/5/5.
 */
/*
 D3.js Slider
 Inspired by jQuery UI Slider
 Copyright (c) 2013, Bjorn Sandvik - http://blog.thematicmapping.org
 BSD license: http://opensource.org/licenses/BSD-3-Clause
 */
!function(t, e) {
    if("function" == typeof define && define.amd){console.log(true)};
    "function" == typeof define && define.amd ? define([ "d3" ], e) :"object" == typeof exports ? (process.browser && require("./d3.slider.css"),
        module.exports = e(require("d3"))) :t.d3.slider = e(t.d3);
}(this, function(t) {
    return function() {
        "use strict";
        function e(e) {
            e.each(function() {
                function e(e) {
                    "boolean" == typeof p && (p = t.svg.axis().ticks(Math.round(u / 100)).tickFormat(w).orient("horizontal" === m ? "bottom" :"right")),
                        s = l.ticks ? l.copy().range([ 0, u ]) :l.copy().rangePoints([ 0, u ], .5), p.scale(s);
                    var n = e.append("svg").classed("d3-slider-axis d3-slider-axis-" + p.orient(), !0).on("click", F), r = n.append("g");
                    "horizontal" === m ? (n.style("margin-left", -y + "px"), n.attr({
                        width:u + 2 * y,
                        height:y
                    }), "top" === p.orient() ? (n.style("top", -y + "px"), r.attr("transform", "translate(" + y + "," + y + ")")) :r.attr("transform", "translate(" + y + ",0)")) :(n.style("top", -y + "px"),
                        n.attr({
                            width:y,
                            height:u + 2 * y
                        }), "left" === p.orient() ? (n.style("left", -y + "px"), r.attr("transform", "translate(" + y + "," + y + ")")) :r.attr("transform", "translate(0," + y + ")")),
                        r.call(p);
                }
                function g() {
                    if ("array" != i(o)) {
                        var e = Math.max(0, Math.min(u, t.event.offsetX || t.event.layerX));
                        n(l.invert ? r(l.invert(e / u)) :a(e / u));
                    }
                }
                function v() {
                    if ("array" != i(o)) {
                        var e = u - Math.max(0, Math.min(u, t.event.offsetY || t.event.layerY));
                        n(l.invert ? r(l.invert(e / u)) :a(e / u));
                    }
                }
                function b() {
                    "handle-one" === t.event.sourceEvent.target.id ? x = 1 :"handle-two" == t.event.sourceEvent.target.id && (x = 2);
                    var e = Math.max(0, Math.min(u, t.event.x));
                    n(l.invert ? r(l.invert(e / u)) :a(e / u));
                }
                function E() {
                    "handle-one" === t.event.sourceEvent.target.id ? x = 1 :"handle-two" == t.event.sourceEvent.target.id && (x = 2);
                    var e = u - Math.max(0, Math.min(u, t.event.y));
                    n(l.invert ? r(l.invert(e / u)) :a(e / u));
                }
                function F() {
                    t.event.stopPropagation();
                }
                l || (l = t.scale.linear().domain([ f, h ])), o = o || l.domain()[0];
                var q = t.select(this).classed("d3-slider d3-slider-" + m, !0), I = t.behavior.drag();
                if (I.on("dragend", function() {
                        k.slideend(t.event, o);
                    }), "array" == i(o) && 2 == o.length ? (d = q.append("a").classed("d3-slider-handle", !0).attr("xlink:href", "#").attr("id", "handle-one").on("click", F).call(I),
                        z = q.append("a").classed("d3-slider-handle", !0).attr("id", "handle-two").attr("xlink:href", "#").on("click", F).call(I)) :d = q.append("a").classed("d3-slider-handle", !0).attr("xlink:href", "#").attr("id", "handle-one").on("click", F).call(I),
                    "horizontal" === m) {
                    if (q.on("click", g), "array" == i(o) && 2 == o.length) {
                        c = t.select(this).append("div").classed("d3-slider-range", !0), d.style("left", M(l(o[0]))),
                            c.style("left", M(l(o[0]))), I.on("drag", b);
                        var P = 100 - parseFloat(M(l(o[1])));
                        z.style("left", M(l(o[1]))), c.style("right", P + "%"), I.on("drag", b);
                    } else d.style("left", M(l(o))), I.on("drag", b);
                    u = parseInt(q.style("width"), 10);
                } else {
                    if (q.on("click", v), I.on("drag", E), "array" == i(o) && 2 == o.length) {
                        c = t.select(this).append("div").classed("d3-slider-range-vertical", !0), d.style("bottom", M(l(o[0]))),
                            c.style("bottom", M(l(o[0]))), I.on("drag", E);
                        var T = 100 - parseFloat(M(l(o[1])));
                        z.style("bottom", M(l(o[1]))), c.style("top", T + "%"), I.on("drag", E);
                    } else d.style("bottom", M(l(o))), I.on("drag", E);
                    u = parseInt(q.style("height"), 10);
                }
                p && e(q);
            });
        }
        function n(e) {
            var n = "array" == i(o) && 2 == o.length ? o[x - 1] :o, a = M(l(r(n))), s = M(l(r(e))), u = "horizontal" === m ? "left" :"bottom";
            if (a !== s) {
                if ("array" == i(o) && 2 == o.length ? (o[x - 1] = e, t.event && k.slide(t.event, o)) :t.event && k.slide(t.event.sourceEvent || t.event, o = e),
                    o[0] >= o[1]) return;
                if (1 === x) "array" == i(o) && 2 == o.length && ("left" === u ? c.style("left", s) :c.style("bottom", s)),
                    v ? d.transition().styleTween(u, function() {
                        return t.interpolate(a, s);
                    }).duration("number" == typeof v ? v :250) :d.style(u, s); else {
                    var f = 100 - parseFloat(s), h = 100 - parseFloat(s);
                    "left" === u ? c.style("right", f + "%") :c.style("top", h + "%"), v ? z.transition().styleTween(u, function() {
                        return t.interpolate(a, s);
                    }).duration("number" == typeof v ? v :250) :z.style(u, s);
                }
            }
        }
        function r(t) {
            if (t === l.domain()[0] || t === l.domain()[1]) return t;
            var e = t;
            if (b) e = a(l(t)); else {
                var n = (t - l.domain()[0]) % g;
                e = t - n, 2 * Math.abs(n) >= g && (e += n > 0 ? g :-g);
            }
            return e;
        }
        function a(t) {
            var e = l.ticks ? l.ticks() :l.domain(), n = e.map(function(e) {
                return t - l(e);
            }), r = -1, a = 0, i = l.ticks ? l.range()[1] :l.rangeExtent()[1];
            do r++, Math.abs(n[r]) < i && (i = Math.abs(n[r]), a = r); while (n[r] > 0 && r < n.length - 1);
            return e[a];
        }
        function i(t) {
            return {}.toString.call(t).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
        }
        var o, l, s, d, c, u, f = 0, h = 100, g = .01, v = !0, m = "horizontal", p = !1, y = 50, x = 1, b = !1, k = t.dispatch("slide", "slideend"), M = t.format(".2%"), w = t.format(".0"), z = null;
        return e.min = function(t) {
            return arguments.length ? (f = t, e) :f;
        }, e.max = function(t) {
            return arguments.length ? (h = t, e) :h;
        }, e.step = function(t) {
            return arguments.length ? (g = t, e) :g;
        }, e.animate = function(t) {
            return arguments.length ? (v = t, e) :v;
        }, e.orientation = function(t) {
            return arguments.length ? (m = t, e) :m;
        }, e.axis = function(t) {
            return arguments.length ? (p = t, e) :p;
        }, e.margin = function(t) {
            return arguments.length ? (y = t, e) :y;
        }, e.value = function(t) {
            return arguments.length ? (o && n(r(t)), o = t, e) :o;
        }, e.snap = function(t) {
            return arguments.length ? (b = t, e) :b;
        }, e.scale = function(t) {
            return arguments.length ? (l = t, e) :l;
        }, t.rebind(e, k, "on"), e;
    };
});