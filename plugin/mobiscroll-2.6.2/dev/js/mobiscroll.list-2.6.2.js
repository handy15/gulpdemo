!function(e){var n=e.mobiscroll,i={invalid:[],showInput:!0,inputClass:""},l=function(n){function l(n,i,l,t){for(var o=0;i>o;){var s=e(".dwwl"+o,n),a=r(t,o,l);e.each(a,function(n,i){e('.dw-li[data-val="'+i+'"]',s).removeClass("dw-v")}),o++}}function r(e,n,i){for(var l,r=0,t=i,o=[];n>r;){var s=e[r];for(l in t)if(t[l].key==s){t=t[l].children;break}r++}for(r=0;r<t.length;)t[r].invalid&&o.push(t[r].key),r++;return o}function t(e,n){for(var i=[];e;)i[--e]=!0;return i[n]=!1,i}function o(e){var n,i=[];for(n=0;e>n;n++)i[n]=g.labels&&g.labels[n]?g.labels[n]:n;return i}function s(e,n,i){var l,r,t,o=0,s=[],c=C;if(n)for(l=0;n>l;l++)s[l]=[{}];for(;o<e.length;){for(s[o]=[u(c,T[o])],l=0,t=void 0;l<c.length&&void 0===t;)c[l].key==e[o]&&(void 0!==i&&i>=o||void 0===i)&&(t=l),l++;if(void 0!==t&&c[t].children)o++,c=c[t].children;else{if(!(r=a(c))||!r.children)return s;o++,c=r.children}}return s}function a(e,n){if(!e)return!1;for(var i,l=0;l<e.length;)if(!(i=e[l++]).invalid)return n?l-1:i;return!1}function u(e,n){for(var i={keys:[],values:[],label:n},l=0;l<e.length;)i.values.push(e[l].value),i.keys.push(e[l].key),l++;return i}function c(n,i){e(".dwc",n).css("display","").slice(i).hide()}function d(e){for(var n,i=[],l=e,r=!0,t=0;r;)n=a(l),i[t++]=n.key,(r=n.children)&&(l=n.children);return i}function v(e,n){var i,l,r,t=[],o=C,s=0,u=!1;if(void 0!==e[s]&&n>=s)for(i=0,l=e[s],r=void 0;i<o.length&&void 0===r;)o[i].key!=e[s]||o[i].invalid||(r=i),i++;else r=a(o,!0),l=o[r].key;for(u=void 0!==r?o[r].children:!1,t[s]=l;u;){if(o=o[r].children,s++,u=!1,r=void 0,void 0!==e[s]&&n>=s)for(i=0,l=e[s],r=void 0;i<o.length&&void 0===r;)o[i].key!=e[s]||o[i].invalid||(r=i),i++;else r=a(o,!0),r=r===!1?void 0:r,l=o[r].key;u=void 0!==r&&a(o[r].children)?o[r].children:!1,t[s]=l}return{lvl:s+1,nVector:t}}function h(n){var i=[];return k=k>b++?k:b,n.children("li").each(function(n){var l=e(this),r=l.clone();r.children("ul,ol").remove();var t=r.html().replace(/^\s\s*/,"").replace(/\s\s*$/,""),o=l.data("invalid")?!0:!1,s={key:l.data("val")||n,value:t,invalid:o,children:null},a=l.children("ul,ol");a.length&&(s.children=h(a)),i.push(s)}),b--,i}var f,p,w=e.extend({},n.settings),g=e.extend(n.settings,i,w),y=e(this),m=this.id+"_dummy",k=0,b=0,x={},C=g.wheelArray||h(y),T=o(k),S=[],A=d(C),B=s(A,k);return e("#"+m).remove(),g.showInput&&(f=e('<input type="text" id="'+m+'" value="" class="'+g.inputClass+'" readonly />').insertBefore(y),n.settings.anchor=f,g.showOnFocus&&f.focus(function(){n.show()}),g.showOnTap&&n.tap(f,function(){n.show()})),g.wheelArray||y.hide().closest(".ui-field-contain").trigger("create"),{width:50,wheels:B,headerText:!1,onBeforeShow:function(e){var i=n.temp;S=i.slice(0),n.settings.wheels=s(i,k,k),p=!0},onSelect:function(e,n){f&&f.val(e)},onChange:function(e,n){f&&"inline"==g.display&&f.val(e)},onClose:function(){f&&f.blur()},onShow:function(n){e(".dwwl",n).on("mousedown touchstart",function(){clearTimeout(x[e(".dwwl",n).index(this)])})},validate:function(e,i,r){var o=n.temp;if(void 0!==i&&S[i]!=o[i]||void 0===i&&!p){n.settings.wheels=s(o,null,i);var a=[],u=(i||0)+1,d=v(o,i);for(void 0!==i&&(n.temp=d.nVector.slice(0));u<d.lvl;)a.push(u++);if(c(e,d.lvl),S=n.temp.slice(0),a.length)return p=!0,n.settings.readonly=t(k,i),clearTimeout(x[i]),x[i]=setTimeout(function(){n.changeWheel(a),n.settings.readonly=!1},1e3*r),!1;l(e,d.lvl,C,n.temp)}else{var d=v(o,o.length);l(e,d.lvl,C,o),c(e,d.lvl)}p=!1}}};e.each(["list","image","treelist"],function(e,i){n.presets[i]=l,n.presetShort(i)})}(jQuery);