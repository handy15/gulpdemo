/**
 * Created by WYR on 2016/3/16.
 */
var utilities =  utilities || {};
$.extend(utilities,{
    //加载完页面需要执行的脚本
    init: function(){
        var that = this;
        //that.aside();
    },
    tools: {
        typeOf: function(obj){
            return Object.prototype.toString.call(obj).match(/\s(\w+)/)[1].toLowerCase();
        },
        supportPlaceholder: function(){
            return !!("placeholder" in document.createElement("input"));
        },
        // 判断是否在微信中查看
        isWeixin: function(){
            var ua = navigator.userAgent.toLowerCase();
            if(ua.match(/MicroMessenger/i)=="micromessenger") {
                return true;
            } else {
                return false;
            }
        },
        /**
         * 根据时间戳返回格式化时间
         * @param timestamp int 时间戳秒数
         * @returns {string} 返回yyyy-MM-dd 格式时间
         */
        formatDate: function(timestamp)   {
            var now = new Date(parseInt(timestamp) *1000);
            var year = now.getFullYear();
            var month = now.getMonth()+1;
            var date = now.getDate();
//				return year+"-"+month+"-"+date + '   ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
            return year+"-"+month+"-"+date;
        }
    },
    //弹出层
    /**
     * @param opts{ width:弹出框的宽, height:弹出框的高, msg: 弹窗的主体内容，可为html,afterConfirm: 点击“确定”关闭窗口后的回调函数}
     */
    showBoxAlert: function(opts){
        var options = $.extend({
            width: 300,
            height: 200,
            msg: '',
            afterConfirm: function(){}
        },opts);
        var renderHtml = new Array();
        //生成mask层
        if($('.mask').length){
            $('.mask').show();
        }else{
            renderHtml.push('<div class="mask"></div>');
        }
        renderHtml.push('<div class="msgbox" style="width: '+ options.width + 'px; height:'+ options.height + 'px;margin-top:'+ (-options.height/2) +'px;margin-left:'+ (-options.width/2) +'px">');
        renderHtml.push('<div class="msgbox-content" style="width: '+ (options.width-30) + 'px; height:'+ (options.height-75) + 'px;">' + options.msg + '</div>');
        renderHtml.push('<div class="msgbox-btm"><button class="msgbox-btn-blue">确定</button></div>');
        renderHtml.push('</div>');
        var $box = $(renderHtml.join(''));
        $('body').append($box);
        $box.on('click','.msgbox-btn-blue',function(){
            var $this = $(this);
            $('.mask').remove();
            $box.off('click').remove();
            if($.isFunction(options.afterConfirm)){
                options.afterConfirm();
            }
        });
    },
    // 当浏览器不支持placeholder 时 用事件代替 option 为数组 里面为元素选择器
    placeholder: function(option){
        option=option||[];
        //首先判断 placeholder 浏览器是否支持
        if(!("placeholder" in document.createElement("input"))){
            // 出过来的是数组
            var len=option.length;
            var method={
                init:function(obj){
                    $(obj).val($(obj).attr("placeholder"));
                    method.setFocus(obj);
                    method.setBlur(obj);
                },
                setFocus:function(obj){
                    $(obj).focus(function(){
                        var  value=$(obj).val();
                        var placeholder=$(obj).attr("placeholder");
                        if(value==placeholder){
                            $(obj).val("");
                        }
                    })
                },
                setBlur:function(obj){
                    $(obj).blur(function(){
                        var  value=$(obj).val();
                        var  placeholder=$(obj).attr("placeholder");
                        if(value==""){
                            $(obj).val(placeholder);
                        }
                    })
                }
            }
            for(var i=0;i<len;i++){
                method.init(option[i]);
            }
        }
    },
    /**
     * tab函数
     * option{ root: String 根选择器，eventtype: String tab切换的事件，eventtype: Array tab切换前执行的函数,viewnum: number 显示第几个tab，起始值是0}
     */
    tabs: function(option){
        var that = this;
        var defaults={
            root:".commTab",
            eventtype:"click",
            eventarr:[],
            viewnum:0
        }
        var  option= $.extend({},defaults,option);

        var $wrap=$(option.root);
        var viewnum=option.viewnum;
        if($wrap[0]){
            $wrap.each(function(){
                var $that=$(this);
                $that.children(".commTabBox").find(".commTabMod").eq(0).show();
                var $tablist=$that.find(".info_Tab span");
                $tablist.on(option.eventtype,function() {
                    var index=$tablist.index($(this));
                    if(option.eventarr[index]&& that.tools.typeOf(option.eventarr[index])=="function" ){
                        option.eventarr[index]();
                    }

                    $(this).addClass("current").siblings().removeClass("current");
                    $that.find(".commTabMod").eq(index).show().siblings().hide();
                })
            });
            if($wrap.length===1&&viewnum!=0&&that.tools.typeOf(viewnum)==="number"){
                var $tablist=$wrap.find(".info_Tab span");
                if(viewnum<$tablist.length){
                    $tablist[viewnum].click();
                }
            }
        }
    },
    /**
     * 获取当前页面的参数
     * @param String name 请求中参数的key值
     */
    getQueryString: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        //if (r != null) return unescape(r[2]); return null;
        if (r != null) return decodeURI(r[2]); return null;
    }
});