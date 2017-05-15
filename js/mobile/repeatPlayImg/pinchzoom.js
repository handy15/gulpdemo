(function(){"use strict";var t=function(t,i){var n=function(n,o){this.el=t(n),this.zoomFactor=1,this.lastScale=1,this.offset={x:0,y:0},this.options=i.extend(this.defaults,o),this.setupMarkup(),this.bindEvents(),this.update()},o=function(t,i){return t+i},s=function(t,i){return t>i-.01&&t<i+.01};n.prototype={defaults:{tapZoomFactor:2,zoomOutFactor:1.3,animationDuration:300,animationInterval:5,maxZoom:4,minZoom:.5,use2d:!0},handleDragStart:function(t){this.stopAnimation(),this.lastDragPosition=!1,this.hasInteraction=!0,this.handleDrag(t)},handleDrag:function(t){if(this.zoomFactor>1){var i=this.getTouches(t)[0];this.drag(i,this.lastDragPosition),this.offset=this.sanitizeOffset(this.offset),this.lastDragPosition=i}},handleDragEnd:function(){this.end()},handleZoomStart:function(t){this.stopAnimation(),this.lastScale=1,this.nthZoom=0,this.lastZoomCenter=!1,this.hasInteraction=!0},handleZoom:function(t,i){var n=this.getTouchCenter(this.getTouches(t)),o=i/this.lastScale;this.lastScale=i,this.nthZoom+=1,this.nthZoom>3&&(this.scale(o,n),this.drag(n,this.lastZoomCenter)),this.lastZoomCenter=n},handleZoomEnd:function(){this.end()},handleDoubleTap:function(t){var n=this.getTouches(t)[0],o=this.zoomFactor>1?1:this.options.tapZoomFactor,s=this.zoomFactor,e=i.bind(function(t){this.scaleTo(s+t*(o-s),n)},this);this.hasInteraction||(s>o&&(n=this.getCurrentZoomCenter()),this.animate(this.options.animationDuration,this.options.animationInterval,e,this.swing))},sanitizeOffset:function(t){var i=(this.zoomFactor-1)*this.getContainerX(),n=(this.zoomFactor-1)*this.getContainerY(),o=Math.max(i,0),s=Math.max(n,0),e=Math.min(i,0),a=Math.min(n,0);return{x:Math.min(Math.max(t.x,e),o),y:Math.min(Math.max(t.y,a),s)}},scaleTo:function(t,i){this.scale(t/this.zoomFactor,i)},scale:function(t,i){t=this.scaleZoomFactor(t),this.addOffset({x:(t-1)*(i.x+this.offset.x),y:(t-1)*(i.y+this.offset.y)})},scaleZoomFactor:function(t){var i=this.zoomFactor;return this.zoomFactor*=t,this.zoomFactor=Math.min(this.options.maxZoom,Math.max(this.zoomFactor,this.options.minZoom)),this.zoomFactor/i},drag:function(t,i){i&&this.addOffset({x:-(t.x-i.x),y:-(t.y-i.y)})},getTouchCenter:function(t){return this.getVectorAvg(t)},getVectorAvg:function(t){return{x:i.reduce(i.pluck(t,"x"),o)/t.length,y:i.reduce(i.pluck(t,"y"),o)/t.length}},addOffset:function(t){this.offset={x:this.offset.x+t.x,y:this.offset.y+t.y}},sanitize:function(){this.zoomFactor<this.options.zoomOutFactor?this.zoomOutAnimation():this.isInsaneOffset(this.offset)&&this.sanitizeOffsetAnimation()},isInsaneOffset:function(t){var i=this.sanitizeOffset(t);return i.x!==t.x||i.y!==t.y},sanitizeOffsetAnimation:function(){var t=this.sanitizeOffset(this.offset),n={x:this.offset.x,y:this.offset.y},o=i.bind(function(i){this.offset.x=n.x+i*(t.x-n.x),this.offset.y=n.y+i*(t.y-n.y),this.update()},this);this.animate(this.options.animationDuration,this.options.animationInterval,o,this.swing)},zoomOutAnimation:function(){var t=this.zoomFactor,n=1,o=this.getCurrentZoomCenter(),s=i.bind(function(i){this.scaleTo(t+i*(n-t),o)},this);this.animate(this.options.animationDuration,this.options.animationInterval,s,this.swing)},updateAspectRatio:function(){this.setContainerY(this.getContainerX()/this.getAspectRatio())},getInitialZoomFactor:function(){return this.container.width()/this.el.width()},getAspectRatio:function(){return this.el.width()/this.el.height()},getCurrentZoomCenter:function(){var t=this.container.width()*this.zoomFactor,i=this.offset.x,n=t-i-this.container.width(),o=i/n,s=o*this.container.width()/(o+1),e=this.container.height()*this.zoomFactor,a=this.offset.y,h=e-a-this.container.height(),r=a/h,c=r*this.container.height()/(r+1);return 0===n&&(s=this.container.width()),0===h&&(c=this.container.height()),{x:s,y:c}},canDrag:function(){return!s(this.zoomFactor,1)},getTouches:function(t){var n=this.container.offset();return i.map(t.touches,function(t){return{x:t.pageX-n.left,y:t.pageY-n.top}})},animate:function(t,n,o,s,e){var a=(new Date).getTime(),h=i.bind(function(){if(this.inAnimation){var i=(new Date).getTime()-a,r=i/t;i>=t?(o(1),e&&e(),this.update(),this.stopAnimation(),this.update()):(s&&(r=s(r)),o(r),this.update(),setTimeout(h,n))}},this);this.inAnimation=!0,h()},stopAnimation:function(){this.inAnimation=!1},swing:function(t){return-Math.cos(t*Math.PI)/2+.5},getContainerX:function(){return this.container.width()},getContainerY:function(){return this.container.height()},setContainerY:function(t){return this.container.height(t)},setupMarkup:function(){this.container=t('<div class="pinch-zoom-container"></div>'),this.el.before(this.container),this.container.append(this.el),this.container.css({overflow:"hidden",position:"relative"}),this.el.css({webkitTransformOrigin:"0% 0%",mozTransformOrigin:"0% 0%",msTransformOrigin:"0% 0%",oTransformOrigin:"0% 0%",transformOrigin:"0% 0%",position:"absolute"})},end:function(){this.hasInteraction=!1,this.sanitize(),this.update()},bindEvents:function(){e(this.container.get(0),this),t(window).bind("resize",i.bind(this.update,this)),t(this.el).find("img").bind("load",i.bind(this.update,this))},update:function(){this.updatePlaned||(this.updatePlaned=!0,setTimeout(i.bind(function(){this.updatePlaned=!1,this.updateAspectRatio();var t=this.getInitialZoomFactor()*this.zoomFactor,n=-this.offset.x/t,o=-this.offset.y/t,s="scale3d("+t+", "+t+",1) translate3d("+n+"px,"+o+"px,0px)",e="scale("+t+", "+t+") translate("+n+"px,"+o+"px)",a=i.bind(function(){this.clone&&(this.clone.remove(),delete this.clone)},this);!this.options.use2d||this.hasInteraction||this.inAnimation?(this.is3d=!0,a(),this.el.css({webkitTransform:s,oTransform:e,msTransform:e,mozTransform:e,transform:s})):(this.is3d&&(this.clone=this.el.clone(),this.clone.css("pointer-events","none"),this.clone.appendTo(this.container),setTimeout(a,200)),this.el.css({webkitTransform:e,oTransform:e,msTransform:e,mozTransform:e,transform:e}),this.is3d=!1)},this),0))}};var e=function(t,n){var o=null,s=0,e=null,a=null,h=function(t,i){if(o!==t){if(o&&!t)switch(o){case"zoom":n.handleZoomEnd(i);break;case"drag":n.handleDragEnd(i)}switch(t){case"zoom":n.handleZoomStart(i);break;case"drag":n.handleDragStart(i)}}o=t},r=function(t){2===s?h("zoom"):1===s&&n.canDrag()?h("drag",t):h(null,t)},c=function(t){return i.map(t,function(t){return{x:t.pageX,y:t.pageY}})},f=function(t,i){var n,o;return n=t.x-i.x,o=t.y-i.y,Math.sqrt(n*n+o*o)},u=function(t,i){var n=f(t[0],t[1]),o=f(i[0],i[1]);return o/n},m=function(t){t.stopPropagation(),t.preventDefault()},d=function(t){var i=(new Date).getTime();if(s>1&&(e=null),i-e<300)switch(m(t),n.handleDoubleTap(t),o){case"zoom":n.handleZoomEnd(t);break;case"drag":n.handleDragEnd(t)}1===s&&(e=i)},l=!0;t.addEventListener("touchstart",function(t){t.preventDefault(),l=!0,s=t.touches.length,d(t)}),t.addEventListener("touchmove",function(t){if(l)r(t),o&&m(t),a=c(t.touches);else{switch(o){case"zoom":n.handleZoom(t,u(a,c(t.touches)));break;case"drag":n.handleDrag(t)}o&&(m(t),n.update())}l=!1}),t.addEventListener("touchend",function(t){s=t.touches.length,r(t)})};return n};"undefined"!=typeof define&&define.amd?define(["jquery","underscore"],function(i,n){return t(i,n)}):(window.RTP=window.RTP||{},window.RTP.PinchZoom=t(jQuery,_))}).call(this);