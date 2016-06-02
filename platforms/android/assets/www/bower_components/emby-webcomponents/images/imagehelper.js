define(["visibleinviewport","imageFetcher","layoutManager","events","browser"],function(e,t,n,r,i){function a(){b={innerHeight:window.innerHeight,innerWidth:window.innerWidth}}function o(){var e=screen.availWidth,t=screen.availHeight;n.mobile&&(e*=2,t*=2),w=e,p=t,a()}function s(t){return e(t,!0,w,p,b)}function u(e,n,r){n||(n=e.getAttribute("data-src")),n&&(L&&r!==!1?t.loadImage(e,n).then(v):t.loadImage(e,n),e.setAttribute("data-src",""))}function v(e){var t=n.tv?160:300,r=[{opacity:"0",offset:0},{opacity:"1",offset:1}],i={duration:t,iterations:1};e.animate(r,i)}function c(e){for(var t=0,n=e.length;n>t;t++)e[t]=!0}function f(e,t,n,r){var i=r;M||(i=r.capture),e.addEventListener(t,n,i)}function l(e){var t=0,n={};n.rootMargin="150%";for(var r=new IntersectionObserver(function(n){for(var i=0,a=n.length;a>i;i++){var o=n[i],s=o.intersectionRatio;if(s){var v=o.target;r.unobserve(v),u(v),t++}}t>=e.length},n),i=0,a=e.length;a>i;i++)r.observe(e[i])}function d(e){function t(t){for(var a=!1,o=!1,v=0,c=e.length;c>v;v++){if(i[t])return;if(!r[v]){var f=e[v];!o&&s(f)?(a=!0,r[v]=!0,u(f)):a&&(o=!0)}}e.length||(document.removeEventListener("focus",n,!0),document.removeEventListener("scroll",n,!0),document.removeEventListener(E,n,!0),window.removeEventListener("resize",n,!0))}function n(){c(i);var e=i.length;i.length++,setTimeout(function(){t(e)},1)}if(e.length){if(y)return void l(e);var r=[],i=[];f(document,"scroll",n,{capture:!0,passive:!0}),document.addEventListener("focus",n,!0),f(document,E,n,{capture:!0,passive:!0}),f(window,"resize",n,{capture:!0,passive:!0}),n()}}function h(e){d(e.getElementsByClassName("lazy"))}function g(e){for(var t=[],n=0,r=e.length;r>n;n++){var i=e[n].PrimaryImageAspectRatio||0;i&&(t[t.length]=i)}if(!t.length)return null;t.sort(function(e,t){return e-t});var a,o=Math.floor(t.length/2);a=t.length%2?t[o]:(t[o-1]+t[o])/2;var s=2/3;if(Math.abs(s-a)<=.15)return s;var u=16/9;if(Math.abs(u-a)<=.2)return u;if(Math.abs(1-a)<=.15)return 1;var v=4/3;return Math.abs(v-a)<=.15?v:a}function m(e){for(var t=0,n=e.length;n>t;t++){var r=e[0];u(r)}}var w,p,b,y=function(){if(window.IntersectionObserver){if(i.chrome){var e=parseInt(i.version.split(".")[0]);return e>=51}return!0}return!1}();y||(window.addEventListener("orientationchange",o),window.addEventListener("resize",o),r.on(n,"modechange",o),o());var E=document.implementation.hasFeature("Event.wheel","3.0")?"wheel":"mousewheel",I={},L=i.animate&&!i.mobile&&!i.operaTv,M=!1;try{var z=Object.defineProperty({},"capture",{get:function(){M=!0}});window.addEventListener("test",null,z)}catch(A){}return I.fillImages=m,I.lazyImage=u,I.lazyChildren=h,I.getPrimaryImageAspectRatio=g,I});