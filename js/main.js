var utilities=utilities||{};$.extend(utilities,{init:function(){},tools:{typeOf:function(e){return Object.prototype.toString.call(e).match(/\s(\w+)/)[1].toLowerCase()},supportPlaceholder:function(){return!!("placeholder"in document.createElement("input"))},isWeixin:function(){var e=navigator.userAgent.toLowerCase();return"micromessenger"==e.match(/MicroMessenger/i)},formatDate:function(e){var n=new Date(1e3*parseInt(e)),i=n.getFullYear(),t=n.getMonth()+1,a=n.getDate();return i+"-"+t+"-"+a}},showBoxAlert:function(e){var n=$.extend({width:300,height:200,msg:"",afterConfirm:function(){}},e),i=new Array;$(".mask").length?$(".mask").show():i.push('<div class="mask"></div>'),i.push('<div class="msgbox" style="width: '+n.width+"px; height:"+n.height+"px;margin-top:"+-n.height/2+"px;margin-left:"+-n.width/2+'px">'),i.push('<div class="msgbox-content" style="width: '+(n.width-30)+"px; height:"+(n.height-75)+'px;">'+n.msg+"</div>"),i.push('<div class="msgbox-btm"><button class="msgbox-btn-blue">确定</button></div>'),i.push("</div>");var t=$(i.join(""));$("body").append(t),t.on("click",".msgbox-btn-blue",function(){$(this);$(".mask").remove(),t.off("click").remove(),$.isFunction(n.afterConfirm)&&n.afterConfirm()})},placeholder:function(e){if(e=e||[],!("placeholder"in document.createElement("input")))for(var n=e.length,i={init:function(e){$(e).val($(e).attr("placeholder")),i.setFocus(e),i.setBlur(e)},setFocus:function(e){$(e).focus(function(){var n=$(e).val(),i=$(e).attr("placeholder");n==i&&$(e).val("")})},setBlur:function(e){$(e).blur(function(){var n=$(e).val(),i=$(e).attr("placeholder");""==n&&$(e).val(i)})}},t=0;t<n;t++)i.init(e[t])},tabs:function(e){var n=this,i={root:".commTab",eventtype:"click",eventarr:[],viewnum:0},e=$.extend({},i,e),t=$(e.root),a=e.viewnum;if(t[0]&&(t.each(function(){var i=$(this);i.children(".commTabBox").find(".commTabMod").eq(0).show();var t=i.find(".info_Tab span");t.on(e.eventtype,function(){var a=t.index($(this));e.eventarr[a]&&"function"==n.tools.typeOf(e.eventarr[a])&&e.eventarr[a](),$(this).addClass("current").siblings().removeClass("current"),i.find(".commTabMod").eq(a).show().siblings().hide()})}),1===t.length&&0!=a&&"number"===n.tools.typeOf(a))){var o=t.find(".info_Tab span");a<o.length&&o[a].click()}},getQueryString:function(e){var n=new RegExp("(^|&)"+e+"=([^&]*)(&|$)","i"),i=window.location.search.substr(1).match(n);return null!=i?decodeURI(i[2]):null}});var global={init:function(){var e=this;e.insideTopMenu(),e.insideLeftMenu()},insideTopMenu:function(){var e=$("#menuId");e.length&&$(".header .navigation li").eq(parseInt(e.val())).addClass("active")},insideLeftMenu:function(){var e=$(".side-menu");if(e.length){var n=window.location.pathname,i=e.find('a[href="'+n+'"]');if(i.length){i.parent("li").addClass("active");var t=i.parent().parent();t.hasClass("side-menu-child")&&(t.removeClass("hide"),t.siblings("a").find(".glyphicon").removeClass("glyphicon-menu-right").addClass("glyphicon-menu-down"))}e.find(".side-menu-list >li > a").click(function(){var e=$(this),n=e.siblings("ul.side-menu-child");n.length&&(n.hasClass("hide")?(n.removeClass("hide"),e.find(".glyphicon").removeClass("glyphicon-menu-right").addClass("glyphicon-menu-down")):(n.addClass("hide"),e.find(".glyphicon").removeClass("glyphicon-menu-down").addClass("glyphicon-menu-right")))})}}};$(function(){global.init()});