/*
 * jCal calendar multi-day and multi-month datepicker plugin for jQuery
 *	version 0.3.6
 * Author: Jim Palmer
 * Released under MIT license.
 *
 * Note:
 *   2015.03.26:
 *     Fix monthSelect bug - wangfang@umeng.com
 *   2015.04.24:
 *   	 Hack sunday select bug (weekly) - wangfang@umeng.com
 *   2015.05.07:
 *   	Check if hack date - wangfang@umeng.com
 *   2015.07.07:
 *     Modify forceWeek check time: only in weekly umit - wangfang@umeng.com
 */
;(function($){
    $.extend($,{
        /*
        *GetDate or Days
        *version 1.1
        * fix ie bug ===> - to /
        *author linan
        *@params  null number example : GetDate() return today
        *@params number example : GetDate('-3') return array [3daysbefore,today]
        *@params stringdate example : GetDate('2012-12-23') or getDate('2012.12.23') return number, days from arg0 to today
        *@params two stringdate example : GetDate('2012-12-1','2012-12-23') return number, days from arg0 to arg1
        *@params two example : $.GetDate('2012-02-23',-30) return string "2012-01-25"
        *@params two example : $.GetDate(1, true)  today is 2014-04-15 return string "2014-04-16"
        */
        GetDate : function(d1,d2){
            var len = arguments.length;
            var reg = /\d{4}([-./])\d{1,2}\1\d{1,2}/;
            var dates = [];
            var day,number;
            var today = getToday();
            switch(len){
            case 0 :
                return getToday();
                break;
            case 1:
                if(reg.test(arguments[0])){
                    return getDays(arguments[0],getToday());
                }else{
                    day = buildDate(arguments[0],today);
                    dates.push(day);
                    dates.push(getToday());
                    return dates.sort();
                }
                break;
            case 2 :
                // add by chenjincai
                // 用户群，观察时间用于获取今天之后的时间使用
                if (arguments[1] === false) {
                  return arguments.callee(arguments[0]);
                } else if (arguments[1] === true) {
                  dates.push(today);
                  dates.push(buildDateExactly(arguments[0],today));
                  return dates;
                }


                if(reg.test(arguments[0]) && reg.test(arguments[1])){
                    number = getDays(arguments[0].replace(/-/g,'/'),arguments[1].replace(/-/g,'/'));
                    return number;
                }else{
                    day = buildDate(arguments[1],arguments[0]);
                    return day;
                }
                break;

            }
            function getDays(arg,day){
                var value = new Date(day) - new Date(arg.replace(/\b(\w)\b/g, '0$1'));
                if(value<0){
                    return "Wrong Date";
                }else{
                    return parseInt(value/(1000*3600*24)+1,10);
                }
            };
            function getToday(){
                var date = new Date();
                this.Day = date.getDate();
                this.Month = date.getMonth()+1;
                this.Year = date.getFullYear();
                return (this.Year.toString()+'-'+this.Month.toString()+'-'+this.Day.toString()).replace(/\b(\w)\b/g, '0$1');;
            };
            function buildDate(num,day){
                var n = num;
                if(typeof(n) == String){
                    n = parseInt(n,10);
                }
                if(n >= 0){
                    return getToday();
                }else if (n < 0) {
                    var someDay = new Date(new Date(day.replace(/\-/g,'/'))-0+(n+1)*86400000);

                    someDay = someDay.getFullYear() + "-" + (someDay.getMonth()+1) + "-" + someDay.getDate();
                    return someDay.replace(/\b(\w)\b/g, '0$1');

                }
            }
            // 允许num大于0，num 为 0 是当天，1是明天，-1是昨天
            function buildDateExactly(num, day) {
              var n = num;
              if(typeof(n) == String){
                  n = parseInt(n,10);
              }

              var someDay = new Date(new Date(day.replace(/\-/g,'/')) - 0 + n * 86400000);

              someDay = someDay.getFullYear() + "-" + (someDay.getMonth()+1) + "-" + someDay.getDate();
              return someDay.replace(/\b(\w)\b/g, '0$1');


            }
        },
        /*
        *replace Date '-' to '.'
        *@param date example :$.replaceDate('2012-01-01')
        *return 2012.01.01
        */
        replaceDate : function(mydate){
            return mydate.replace(/-/g,'.');
        }
    })
})(jQuery);

(function($) {
	var methods = {
		init: function(opt) {

			if (opt.timeUnit == 'weekly') {
				opt.days = 7;
			} else if (opt.timeUnit == 'monthly') {
				opt.days = 30;
			}

			var defaultOpt = {
				_self: this,
				day: new Date(),
				timeUnit: 'daily',
				monthSelect:  true,
				daySelect: true,
				sDate: new Date(),
				//dow: I18n.t('constant.date.weeks_min_jcal').split(','),    // days of week - change this to reflect your dayOffset
				//ml: I18n.t('constant.date.months').split(','),
				//ms: I18n.t('constant.date.months_short').split(','),
				dow: '一,二,三,四,五,六,日'.split(','),    // days of week - change this to reflect your dayOffset
				ml: '一月,二月,三月,四月,五月,六月,七月,八月,九月,十月,十一月,十二月'.split(','),
				ms: '一,二,三,四,五,六,七,八,九,十,十一,十二'.split(','),
				dCheck: function(day) {
					return true;
				},
				callback: function(day, days) {
					var dayStr = '';
					var yearMonth = '';
					yearMonth += day.getFullYear() + '.' +(day.getMonth() + 1 ) + '.' ;
					dayStr += yearMonth + day.getDate();

					if (days == 30) {
						dayStr += ' - ' + yearMonth + $('.selectedDay',this).last().text();
					} else if (days == 7) {
						var lastDate = new Date(day.setDate(day.getDate() + 6));
						dayStr += ' - ' + lastDate.getFullYear() + '.' + (lastDate.getMonth() + 1) + '.' + lastDate.getDate();
					}

					var timeUnit = days == 1 ? 'daily' : (days == 7 ? 'weekly' : 'monthly');
					$(this).data({dayStr: dayStr, timeUnit: timeUnit, day: day});
					return true;
				}
			};

			opt = $.extend(defaultOpt, opt || {});

			return this.each(function(){
				var valContainer = $('.select_value');
				var popBody = $('<div class="pop_body none singledate"></div>');
				var jCalBody = $('<div class="jCalBody"></div>');
				var periodSelectBtns = '';
				var unitMap = {
					daily : 0,
					weekly : 1,
					monthly : 2
				};

				var tabTmpl = '<div class="tabs">' +
					'<ul class="clearfix">'+
						//(opt.monthSelect ? ('<li days="30">' + I18n.t('components.filters.time_unit.every_month') + '</li>') : '') +
						//'<li days="7">' + I18n.t('components.filters.time_unit.every_week') + '</li>' +
						//(opt.daySelect ? ('<li days="1" >' + I18n.t('components.filters.time_unit.every_day') + '</li>') : '') +
					(opt.monthSelect ? ('<li days="30">每月</li>') : '') +
					'<li days="7">每周</li>' +
					(opt.daySelect ? ('<li days="1" >每日</li>') : '') +
					'</ul>' +
					'</div>';
				periodSelectBtns = $(tabTmpl);

				if (opt.timeUnit) {
					periodSelectBtns.find('li:eq('+ unitMap[opt.timeUnit] +')').addClass('on');
				}

				jCalBody.data({'dayStr':opt.defaultVal,days : opt.days,day : opt.day,timeUnit:opt.timeUnit});

				if(opt.buttons){
					window.global = window.global || {};
					//var btnContainer = $('<div class="btnContainer form"><span>'+I18n.t('components.filters.time_unit_select')+'</span></div>');
					var btnContainer = $('<div class="btnContainer form"><span>请选择时间单位</span></div>');
					$.each(opt.buttons,function(i,elem){
						var btn = $('<input type="button" class="custombtn submit" value="'+ elem.name +'"/>');
						btn.click(function(e){
							tools.stopBubble(e);
							var dayStr = jCalBody.data('dayStr').split(' - ');
							var dayStr_s = tools.formatDate("yy-mm-dd",new Date(dayStr[0].replace(/\./g,'/')));
							var dayStr_e = dayStr[1] != undefined ? tools.formatDate("yy-mm-dd",new Date(dayStr[1].replace(/\./g,'/'))) : tools.formatDate("yy-mm-dd",new Date(dayStr[0].replace(/\./g,'/')));
							var timeUnit = jCalBody.data('timeUnit');
							$('.select_value').attr('title',dayStr).attr('timeUnit',timeUnit);
							$('.start',valContainer).text($.replaceDate(dayStr_s));
							$('.end',valContainer).text($.replaceDate(dayStr_e));
							window.global.pickedStartDay = dayStr_s;
							window.global.pickedEndDay = dayStr_e;
							window.global.pickedDays = window.global.pickedDays = $.GetDate(global.pickedStartDay,global.pickedEndDay);
							popBody.slideUp(200);
							elem.click.call(this,opt,[dayStr_s,dayStr_e]);
						});
						btnContainer.append(btn);
					});

				}
				popBody.append(periodSelectBtns).append(jCalBody).append(btnContainer);
				$(this).append(valContainer);
				$(this).append(popBody);

				$(this).click(function(e){
					tools.stopBubble(e);
					popBody.slideToggle(200);
				});
				periodSelectBtns.find('li').bind('click',function(e){
					tools.stopBubble(e);
					$(this).addClass('on').siblings('li').removeClass('on');
					jCalBody.data('days',$(this).attr('days'));
				});
				$.jCal(jCalBody,opt);
			});
		},
		getDayStr : function(){
			return $('.select_value',this).text();
		},
		getTimeUnit : function(){
			return $('.select_value',this).attr('timeUnit');
		}
	};

	$.fn.jCalArea = function(method) {
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
		}
	};

	$.fn.jCal = function (opt) {
		$.jCal(this, opt);
	};
	$.jCal = function (target, opt) {
		opt = $.extend({
			day:			new Date(),									// date to drive first cal
			days:			1,											// default number of days user can select
			showMonths:		1,											// how many side-by-side months to show
			monthSelect:	false,										// show selectable month and year ranges via animated comboboxen
			dCheck:			function (day) { return true; },			// handler for checking if single date is valid or not
			callback:		function (day, days) { return true; },		// callback function for click on date
			selectedBG:		'rgb(0, 143, 214)',							// default bgcolor for selected date cell
			defaultBG:		'rgb(255, 255, 255)',						// default bgcolor for unselected date cell
			dayOffset:		1,											// 0=week start with sunday, 1=week starts with monday
			forceWeek:		false,										// true=force selection at start of week, false=select days out from selected day
			dow:			['S', 'M', 'T', 'W', 'T', 'F', 'S'],		// days of week - change this to reflect your dayOffset
			ml:				['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			ms:				['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
			_target:		target										// target DOM element - no need to set extend this variable
		}, opt);
		opt.day = new Date(opt.day.getFullYear(), opt.day.getMonth(), 1);
		if ( !$(opt._target).data('days') ) $(opt._target).data('days', opt.days);
		$(target).stop().empty();
		for (var sm=0; sm < opt.showMonths; sm++)
			$(target).prepend('<div class="jCalMo"></div>');
		opt.cID = 'c' + $('.jCalMo').length;
		$('.jCalMo', target).each(
			function (ind) {
				drawCalControl($(this), $.extend( {}, opt, { 'ind':ind,
						'day':new Date( new Date( opt.day.getTime() ).setMonth( new Date( opt.day.getTime() ).getMonth() + ind ) ) }
				));
				drawCal($(this), $.extend( {}, opt, { 'ind':ind,
						'day':new Date( new Date( opt.day.getTime() ).setMonth( new Date( opt.day.getTime() ).getMonth() + ind ) ) }
				));
			});
		if ( $(opt._target).data('day') && $(opt._target).data('days') )
			reSelectDates(target, $(opt._target).data('day'), $(opt._target).data('days'), opt);
	};
	function drawCalControl (target, opt) {
		$(target).append(
			'<div class="jCal">' +
			( (opt.ind == 0) ? '<div class="left"></div>' : '' ) +
			'<div class="month">' +
			'<span class="monthYear" year="'+ opt.day.getFullYear() +'">' + opt.day.getFullYear() + '</span>' +
			'<span class="monthName" month="'+ opt.day.getMonth() +'">' + opt.ml[opt.day.getMonth()] + '</span>' +
			'</div>' +
			( (opt.ind == ( opt.showMonths - 1 )) ? '<div class="right" ></div>' : '' ) +
			'</div>');
		if ( opt.monthSelect )
			$(target).find('.jCal .monthName, .jCal .monthYear')
				.bind('mouseover', $.extend( {}, opt ),
				function (e) {
					$(this).removeClass('monthYearHover').removeClass('monthNameHover');
					if ( $('.jCalMask', e.data._target).length == 0 ) $(this).addClass( $(this).attr('class') + 'Hover' );
				})
				.bind('mouseout', function () { $(this).removeClass('monthYearHover').removeClass('monthNameHover'); })
				.bind('click', $.extend( {}, opt ),
				function (e) {
					tools.stopBubble(e);
					$('.jCalMo .monthSelector, .jCalMo .monthSelectorShadow').remove();
					var monthName = $(this).hasClass('monthName'),
						pad = Math.max( parseInt($(this).css('padding-left')), parseInt($(this).css('padding-left'))) || 2,
						calcTop = ( ($(this).offset()).top - ( ( monthName ? e.data.day.getMonth() : 2 ) * ( $(this).height() + 0 ) ) );
					calcTop = calcTop > 0 ? calcTop : 0;
					var topDiff = ($(this).offset()).top - calcTop;
					$('<div class="'+ (monthName?'month':'year')+'SelShadow monthSelectorShadow" style="' +
						'top:' + $(e.data._target).offset().top + 'px; ' +
						'left:' + $(e.data._target).offset().left + 'px; ' +
						'width:' + ( $(e.data._target).width() + ( parseInt($(e.data._target).css('paddingLeft')) || 0 ) + ( parseInt($(e.data._target).css('paddingRight')) || 0 ) ) + 'px; ' +
						'height:' + ( $(e.data._target).height() + ( parseInt($(e.data._target).css('paddingTop')) || 0 ) + ( parseInt($(e.data._target).css('paddingBottom')) || 0 ) ) + 'px;">' +
						'</div>')
						.css('opacity',0.01).appendTo( $(this).parent() );
					$('<div class="'+ (monthName?'month':'year') +'Sel monthSelector" style="' +
						'top:' + calcTop + 'px; ' +
						'left:' + ( ($(this).offset()).left ) + 'px; ' +
						'width:' + ( $(this).width() + ( pad * 2 ) ) + 'px;">' +
						'</div>')
						.css('opacity',0).appendTo( $(this).parent() );
					for (var di = ( monthName ? 0 : -2 ), dd = ( monthName ? 12 : 3 ); di < dd; di++)
						$(this).clone().removeClass('monthYearHover').removeClass('monthNameHover').addClass('monthSelect')
							.attr( 'id', monthName ? (di + 1) + '_1_' + e.data.day.getFullYear() : (e.data.day.getMonth() + 1) + '_1_' + (e.data.day.getFullYear() + di) )
							.html( monthName ? e.data.ml[di] : ( e.data.day.getFullYear() + di ) )
							.css( 'top', ( $(this).height() * di ) ).appendTo( $(this).parent().find('.monthSelector') );
					var moSel = $(this).parent().find('.monthSelector').get(0), diffOff = $(moSel).height() - ( $(moSel).height() - topDiff );
					$(moSel)
						.css('clip','rect(' + diffOff + 'px ' + ( $(this).width() + ( pad * 2 ) ) + 'px '+ diffOff + 'px 0px)')
						.animate({'opacity':.92,'clip':'rect(0px ' + ( $(this).width() + ( pad * 2 ) ) + 'px ' + $(moSel).height() + 'px 0px)'}, 'fast', function () {
							$(this).parent().find('.monthSelectorShadow').bind('mouseover click', function () { $(this).parent().find('.monthSelector').remove(); $(this).remove(); });
						})
						.parent().find('.monthSelectorShadow').animate({'opacity':.1}, 'fast');
					$('.jCalMo .monthSelect', e.data._target).bind('mouseover mouseout click', $.extend( {}, e.data ),
						function (e) {
							tools.stopBubble(e);
							if ( e.type == 'click' )
								$(e.data._target).jCal( $.extend(e.data, {day:new Date($(this).attr('id').replace(/_/g, '/'))}) );
							else
								$(this).toggleClass('monthSelectHover');
						});
				});
		$(target).find('.jCal .left').bind('click', $.extend( {}, opt ),
			function (e) {
				tools.stopBubble(e);
				if ($('.jCalMask', e.data._target).length > 0) return false;
				var mD = { w:0, h:0 };
				$('.jCalMo', e.data._target).each( function () {
					mD.w += $(this).width() + parseInt($(this).css('padding-left')) + parseInt($(this).css('padding-right'));
					var cH = $(this).height() + parseInt($(this).css('padding-top')) + parseInt($(this).css('padding-bottom'));
					mD.h = ((cH > mD.h) ? cH : mD.h);
				} );
				$(e.data._target).prepend('<div class="jCalMo"></div>');
				e.data.day = new Date( $('div[id*=' + e.data.cID + 'd_]:first', e.data._target).attr('id').replace(e.data.cID + 'd_', '').replace(/_/g, '/') );
				e.data.day.setDate(1);
				e.data.day.setMonth( e.data.day.getMonth() - 1 );
				drawCalControl($('.jCalMo:first', e.data._target), e.data);
				drawCal($('.jCalMo:first', e.data._target), e.data);
				if (e.data.showMonths > 1) {
					$('.right', e.data._target).clone(true).appendTo( $('.jCalMo:eq(1) .jCal', e.data._target) );
					$('.left:last, .right:last', e.data._target).remove();
				}
				$(e.data._target).append('<div class="jCalSpace" style="width:'+mD.w+'px; height:'+mD.h+'px;"></div>');
				$('.jCalMo', e.data._target).wrapAll(
					'<div class="jCalMask" style="clip:rect(0px '+mD.w+'px '+mD.h+'px 0px); width:'+ ( mD.w + ( mD.w / e.data.showMonths ) ) +'px; height:'+mD.h+'px;">' +
					'<div class="jCalMove"></div>' +
					'</div>');
				$('.jCalMove', e.data._target).css('margin-left', ( ( mD.w / e.data.showMonths ) * -1 ) + 'px').css('opacity', 0.5).animate({ marginLeft:'0px' }, 'fast',
					function () {
						$(this).children('.jCalMo:not(:last)').appendTo( $(e.data._target) );
						$('.jCalSpace, .jCalMask', e.data._target).empty().remove();
						if ( $(e.data._target).data('day') )
							reSelectDates(e.data._target, $(e.data._target).data('day'), $(e.data._target).data('days'), e.data);
					});
			});
		$(target).find('.jCal .right').bind('click', $.extend( {}, opt ),
			function (e) {
				tools.stopBubble(e);
				if ($('.jCalMask', e.data._target).length > 0) return false;
				var mD = { w:0, h:0 };
				$('.jCalMo', e.data._target).each( function () {
					mD.w += $(this).width() + parseInt($(this).css('padding-left')) + parseInt($(this).css('padding-right'));
					var cH = $(this).height() + parseInt($(this).css('padding-top')) + parseInt($(this).css('padding-bottom'));
					mD.h = ((cH > mD.h) ? cH : mD.h);
				} );
				$(e.data._target).append('<div class="jCalMo"></div>');
				e.data.day = new Date( $('div[id^=' + e.data.cID + 'd_]:last', e.data._target).attr('id').replace(e.data.cID + 'd_', '').replace(/_/g, '/') );
				e.data.day.setDate(1);
				e.data.day.setMonth( e.data.day.getMonth() + 1 );
				drawCalControl($('.jCalMo:last', e.data._target), e.data);
				drawCal($('.jCalMo:last', e.data._target), e.data);
				if (e.data.showMonths > 1) {
					$('.left', e.data._target).clone(true).prependTo( $('.jCalMo:eq(1) .jCal', e.data._target) );
					$('.left:first, .right:first', e.data._target).remove();
				}
				$(e.data._target).append('<div class="jCalSpace" style="width:'+mD.w+'px; height:'+mD.h+'px;"></div>');
				$('.jCalMo', e.data._target).wrapAll(
					'<div class="jCalMask" style="clip:rect(0px '+mD.w+'px '+mD.h+'px 0px); width:'+ ( mD.w + ( mD.w / e.data.showMonths ) ) +'px; height:'+mD.h+'px;">' +
					'<div class="jCalMove"></div>' +
					'</div>');
				$('.jCalMove', e.data._target).css('opacity', 0.5).animate({ marginLeft:( ( mD.w / e.data.showMonths ) * -1 ) + 'px' }, 'fast',
					function () {
						$(this).children('.jCalMo:not(:first)').appendTo( $(e.data._target) );
						$('.jCalSpace, .jCalMask', e.data._target).empty().remove();
						if ( $(e.data._target).data('day') )
							reSelectDates(e.data._target, $(e.data._target).data('day'), $(e.data._target).data('days'), e.data);
						$(this).children('.jCalMo:not(:first)').removeClass('');
					});
			});
		$('.jCal', target).each(
			function () {
				var width = $(this).parent().width() - ( $('.left', this).width() || 0 ) - ( $('.right', this).width() || 0 );
				$('.month', this).css('width', width).find('.monthName, .monthYear').css('width', ((width / 2) - 4 ));
			});
		$(window).load(
			function () {
				$('.jCal', target).each(
					function () {
						var width = $(this).parent().width() - ( $('.left', this).width() || 0 ) - ( $('.right', this).width() || 0 );
						$('.month', this).css('width', width).find('.monthName, .monthYear').css('width', ((width / 2) - 4 ));
					});
			});
	};

	//init jCal Date
	function reSelectDates (target, day, days, opt) {
		//get start Date
		//var nowDate = new Date(global.pickedStartDay.replace(/\./g,'/'));
		var nowDate = new Date();
		//get timeUnit by dom attr
		if($('.jCal .monthName',target).attr('month') == nowDate.getMonth() && $('.jCal .monthYear',target).attr('year') == nowDate.getFullYear()){
			if($('.select_value',opt._self).attr('timeunit') == 'weekly'){
				var currDay = $(opt._target).find('.day').eq(nowDate.getDate()-1);
				currDay.add(currDay.nextUntil('br')).addClass('selectedDay');
			}else if($('.select_value',opt._self).attr('timeunit') == 'monthly'){
				$(target).find('.day').addClass('selectedDay');
			}else{
				$(target).find('.day').eq(nowDate.getDate()-1).addClass('selectedDay');
			}
		}
		// var fDay = new Date(day.getTime());
		// var sDay = new Date(day.getTime());
		// for (var fC = false, di = 0, dC = days; di < dC; di++) {
		// 	var dF = $(target).find('div[id*=d_' + (sDay.getMonth() + 1) + '_' + sDay.getDate() + '_' + sDay.getFullYear() + ']');
		// 	if ( dF.length > 0 ) {
		// 		// dF.stop().addClass('selectedDay');
		// 		fC = true;
		// 	}
		// 	sDay.setDate( sDay.getDate() + 1 );
		// }
		// if ( fC && typeof opt.callback == 'function' ) opt.callback.call(target, day, days );
	};
	function drawCal (target, opt) {
		for (var ds=0, length=opt.dow.length; ds < length; ds++)
			$(target).append('<div class="dow">' + opt.dow[ds] + '</div>');
		var fd = new Date( new Date( opt.day.getTime() ).setDate(1) );
		var ldlm = new Date( new Date( fd.getTime() ).setDate(0) );
		var ld = new Date( new Date( new Date( fd.getTime() ).setMonth( fd.getMonth() + 1 ) ).setDate(0) );
		var copt = {fd:fd.getDay(), lld:ldlm.getDate(), ld:ld.getDate()};
		var offsetDayStart = ( ( copt.fd < opt.dayOffset ) ? ( opt.dayOffset - 7 ) : 1 );
		var offsetDayEnd = ( ( ld.getDay() < opt.dayOffset ) ? ( 7 - ld.getDay() ) : ld.getDay() );
		for ( var d = offsetDayStart, dE = ( copt.fd + copt.ld + ( 7 - offsetDayEnd ) ); d < dE; d++)
			$(target).append(
				(( d <= ( copt.fd - opt.dayOffset ) ) ?
					'<div id="' + opt.cID + 'd' + d + '" class="pday">' + ( copt.lld - ( ( copt.fd - opt.dayOffset ) - d ) ) + '</div>'
						: ( ( d > ( ( copt.fd - opt.dayOffset ) + copt.ld ) ) ?
						'<div id="' + opt.cID + 'd' + d + '" class="aday">' + ( d - ( ( copt.fd - opt.dayOffset ) + copt.ld ) ) + '</div>'
							: '<div id="' + opt.cID + 'd_' + (fd.getMonth() + 1) + '_' + ( d - ( copt.fd - opt.dayOffset ) ) + '_' + fd.getFullYear() + '" class="' +
						( ( opt.dCheck( new Date( (new Date( fd.getTime() )).setDate( d - ( copt.fd - opt.dayOffset ) ) ) ) ) ? 'day' : 'invday' ) +
						'">' + ( d - ( copt.fd - opt.dayOffset ) )  + '</div>'
					)
				)
			);

		$(target).find('div[id^=' + opt.cID + 'd]:first, div[id^=' + opt.cID + 'd]:nth-child(7n+2)').before( '<br style="clear:both; font-size:0.1em;" />' );
		$(target).find('div[id^=' + opt.cID + 'd_]:not(.invday)').bind("mouseover mouseout click", $.extend({}, opt), function(e) {
			tools.stopBubble(e);

			if ($('.jCalMask', e.data._target).length > 0) return false;

			var osDate = new Date( $(this).attr('id').replace(/c[0-9]{1,}d_([0-9]{1,2})_([0-9]{1,2})_([0-9]{4})/, '$1/$2/$3') ),
				sDate = new Date(osDate.getTime()),
				currDay;

			if ($(e.data._target).data('days')  == '30') {
				currDay = $('.day', e.data._target);
				osDate = new Date ( currDay.first().attr('id').replace(/c[0-9]{1,}d_([0-9]{1,2})_([0-9]{1,2})_([0-9]{4})/, '$1/$2/$3') );
			} else if ($(e.data._target).data('days')  == '7') {
				var day = osDate.getDay();
				currDay = $(this);
				currDay = currDay.add($(this).nextUntil('br'));
				currDay = currDay.add($(this).prevUntil('br'));

				if (e.data.forceWeek) osDate.setDate( osDate.getDate() + (e.data.dayOffset - osDate.getDay()) );

				// Check if hack date
				if (opt.dayOffset !== 0) {
					var dayHack = (osDate.getDay() === 0) ? 7: osDate.getDay(); // Hack sunday
					osDate = new Date( osDate.setDate(osDate.getDate() - dayHack + 1) );
				}
			} else if ($(e.data._target).data('days')  == '1') {
				currDay = $(e.data._target).find('#' + e.data.cID + 'd_' + ( sDate.getMonth() + 1 ) + '_' + sDate.getDate() + '_' + sDate.getFullYear());
			}

			if (e.type == 'mouseover') {
				$(currDay).addClass('overDay');
			} else if (e.type == 'mouseout') {
				$(currDay).stop().removeClass('overDay').css('backgroundColor', '');
			} else if (e.type == 'click') {
				$('div[id*=d]', e.data._target).stop().removeClass('selectedDay overDay').css('backgroundColor', '');
				$(currDay).stop().addClass('selectedDay');
			}

			if (e.type == 'click') {
				e.data.day = osDate;
				e.data.callback.call(e.data._target, osDate, $(e.data._target).data('days') );
				// $(e.data._target).data('day', e.data.day);//.data('days', di);
			}
		});
	};
})(jQuery);

//工具类
var tools = {
	//stop bubble
	stopBubble: function (e) {
		//如果提供了事件对象，则这是一个非IE浏览器
		if( e && e.stopPropagation ){
			//因此它支持W3C的stopPropagation()方法
			e.stopPropagation();
		}else{
			//否则，我们需要使用IE的方式来取消事件冒泡
			window.event.cancelBubble = true;
		}
	},
	//formatDate
	formatDate: function(a, b, c) { 
		if (!b) return "";
		var d = (c ? c.dayNamesShort : null) || ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
			e = (c ? c.dayNames : null) || ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
			f = (c ? c.monthNamesShort : null) || ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
			g = (c ? c.monthNames : null) || ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			h = function(b) {
				var c = m + 1 < a.length && a.charAt(m + 1) == b;
				return c && m++, c
			},
			i = function(a, b, c) {
				var d = "" + b;
				if (h(a)) while (d.length < c) d = "0" + d;
				return d
			},
			j = function(a, b, c, d) {
				return h(a) ? d[b] : c[b]
			},
			k = "",
			l = !1;
		if (b) for (var m = 0; m < a.length; m++) if (l) a.charAt(m) == "'" && !h("'") ? l = !1 : k += a.charAt(m);
		else switch (a.charAt(m)) {
				case "d":
					k += i("d", b.getDate(), 2);
					break;
				case "D":
					k += j("D", b.getDay(), d, e);
					break;
				case "o":
					k += i("o", Math.round(((new Date(b.getFullYear(), b.getMonth(), b.getDate())).getTime() - (new Date(b.getFullYear(), 0, 0)).getTime()) / 864e5), 3);
					break;
				case "m":
					k += i("m", b.getMonth() + 1, 2);
					break;
				case "M":
					k += j("M", b.getMonth(), f, g);
					break;
				case "y":
					k += h("y") ? b.getFullYear() : (b.getYear() % 100 < 10 ? "0" : "") + b.getYear() % 100;
					break;
				case "@":
					k += b.getTime();
					break;
				case "!":
					k += b.getTime() * 1e4 + this._ticksTo1970;
					break;
				case "'":
					h("'") ? k += "'" : l = !0;
					break;
				default:
					k += a.charAt(m)
			}
		return k
	}
}