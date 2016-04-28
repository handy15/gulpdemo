/**
 * Created by WYR on 2016/4/28.
 */
var global = {
    init: function(){
        var that = this;
        that.insideTopMenu();
    },
    insideTopMenu: function(){
        var $hidden = $('#menuId');
        if($hidden.length){
            $('.header .nav li').eq(parseInt($hidden.val())).addClass('active');
        }
    }
}
$(function(){
    global.init();
});