!function($){var $View=function(str){return $(eval("'"+str.replace(/<%=([\w]+)\%>/g,"' + $1 + '")+"'"))},createUiId=function(e,t){var t=t||"string"==typeof t?t:"form";return e.attr("id")?t+"_ui_id_"+e.attr("id"):e.attr("name")?t+"_ui_name_"+e.attr("name").replace("[]","").replace("[","_").replace("']","").replace("]","").replace("'","").replace('"',""):t+"_ui_the_n"},cssSelect=function(e){var t;return e&&(t=e.position),$(this).length<=0?!1:$(this).each(function(){var t,o,n,i,s=$(this),c=s.children("option"),l=s.on("events"),r=createUiId(s,"select"),a={wrapper:'<div class="cssSelect"></div>',select:'<div class="selectBox sNormal"></div>',selectLt:'<div class="selectLt"></div>',selectRt:'<div class="selectRt"></div>',options:'<div class="optionsBox"></div>',optionsInner:'<div class="optionsInnerBox"></div>',option:'<div class="optionBox oNormal"></div>',optionInner:"<span></span>"},d=$View(a.select),p=$View(a.selectLt),h=$View(a.selectRt),u=$View(a.options),f=$View(a.optionsInner),v=function(){if(s.length<=1&&"SELECT"===s.get(0).tagName&&!s.attr("multiple")&&s.children("optgroup").length<=0){if(t=$View(a.wrapper).attr("id",r),$("#"+r).remove(),s.show(),s.hide(),t.append(d).append(u.append(f)),t.click(function(e){e.stopPropagation()}),d.append(p).append(h),s.attr("disabled"))return void d.addClass("sDisabled");d.click(g.selectClick),d.hover(g.selectHover,g.selectNormal),c.each(function(e){var t=$(this),o=t.text(),n=$View(a.option).append($View(a.optionInner).text(o));n.css({"float":"left"}),n.hover(g.optionHover,g.optionNormal),n.click(g.optionClick),f.append(n),t.val()==s.val()&&(p.text(o),n.addClass("selected"))}),s.setOptions=function(){e&&e.position&&(n=e.position),e&&e.limit&&(i=e.limit),f.children(".optionBox").css({"float":"none"});var t,s=d.position(),l=f.children(".selected").position(),r=f.outerHeight()/c.length,a="auto";a=i?"auto"!=i&&c.length>i?Math.round(r)*i:"auto":c.length>5?5*Math.round(r):"auto",s.top=s.top+d.outerHeight(),u.css({height:Math.round(a),top:s.top+1}),t=o&&$(window).height()+$(document).scrollTop()<u.offset().top+u.outerHeight()?s.top-u.outerHeight()-d.outerHeight()-3:s.top,u.scrollTop(Math.round(l.top-r)),u.css({top:t+1,left:s.left,"overflow-y":"auto","overflow-x":"hidden"}),o||(o=u.position())},s.before(t),s.setOptions(),u.hide()}},g=$.extend({selectNormal:function(){$(this).removeClass("sHover")},selectHover:function(){$(this).addClass("sHover")},selectClick:function(){"none"!=u.css("display")?m.selectOff():(m.selectOn(),s.setOptions())},optionNormal:function(){$(this).removeClass("oHover")},optionHover:function(){$(this).addClass("oHover")},optionClick:function(){m.selected(this)},documentClick:function(){m.selectOff()}},function(){}),m=$.extend({selectOn:function(){this.selectOff(),d.addClass("sPressDown"),u.show(),$(document).one("click",g.documentClick)},selectOff:function(){s.unbind("click"),$(".selectBox").removeClass("sPressDown"),$(".optionsBox").hide()},selected:function(e){var t=f.children(".optionBox").index(e);if(f.children(".optionBox").removeClass("selected"),$(e).addClass("selected"),p.text($(e).text()),l&&l.change&&l.change.length>0){s[0].selectedIndex=t,$.each(l.change,function(){s.one("click",this.handler),s.click()}),s.children().eq(t).attr("selected",!0),s.trigger("change");$("#identitySelect").children().eq(t).prop("selected",!0);$.each(l.change,function(){s.one("click",this.handler),s.click()})}s[0].selectedIndex=t,this.selectOff()}},function(){});return v()})};$.fn.extend({cssSelect:cssSelect})}(jQuery);