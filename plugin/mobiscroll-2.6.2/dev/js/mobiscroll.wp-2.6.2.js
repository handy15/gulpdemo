!function(s){var e;s.mobiscroll.themes.wp={defaults:{width:70,height:76,accent:"none",dateOrder:"mmMMddDDyy",showLabel:!1,onAnimStart:function(o,t,l){s(".dwwl"+t,o).addClass("wpam"),clearTimeout(e[t]),e[t]=setTimeout(function(){s(".dwwl"+t,o).removeClass("wpam")},1e3*l+100)}},init:function(o,t){var l,w;e={},s(".dw",o).addClass("wp-"+t.settings.accent),s(".dwwl",o).on("touchstart mousedown DOMMouseScroll mousewheel",".dw-sel",function(){l=!0,w=s(this).closest(".dwwl").hasClass("wpa"),s(".dwwl",o).removeClass("wpa"),s(this).closest(".dwwl").addClass("wpa")}).on("touchmove mousemove",function(){l=!1}).on("touchend mouseup",function(){l&&w&&s(this).closest(".dwwl").removeClass("wpa")})}},s.mobiscroll.themes["wp light"]=s.mobiscroll.themes.wp}(jQuery);