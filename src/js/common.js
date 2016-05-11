/**
 * Created by WYR on 2016/4/28.
 */
var global = {
    init: function(){
        var that = this;
        that.insideTopMenu();
        that.insideLeftMenu();
    },
    insideTopMenu: function(){
        var $hidden = $('#menuId');
        if($hidden.length){
            $('.header .navigation li').eq(parseInt($hidden.val())).addClass('active');
        }
    },
    insideLeftMenu: function(){
        var that = this;
        var $leftMenu = $('.side-menu');
        if($leftMenu.length){
            var path = window.location.pathname;
            //当前连接的dom
            var $nowLink = $leftMenu.find('a[href="'+path+'"]');
            if($nowLink.length){
                $nowLink.parent('li').addClass('active');
                //父节点ul
                var $parentUl = $nowLink.parent().parent();
                if($parentUl.hasClass('side-menu-child')){
                    $parentUl.removeClass('hide');
                    $parentUl.siblings('a').find('.glyphicon').removeClass('glyphicon-menu-right').addClass('glyphicon-menu-down');
                }
            }
            //点击展开子菜单
            $leftMenu.find('.side-menu-list >li > a').click(function(){
                var $this = $(this);
                var $child = $this.siblings('ul.side-menu-child');
                if($child.length){
                    if($child.hasClass('hide')){
                        $child.removeClass('hide');
                        $this.find('.glyphicon').removeClass('glyphicon-menu-right').addClass('glyphicon-menu-down');
                    }else{
                        $child.addClass('hide');
                        $this.find('.glyphicon').removeClass('glyphicon-menu-down').addClass('glyphicon-menu-right');
                    }
                }
            });
        }
    }
}
$(function(){
    global.init();
});