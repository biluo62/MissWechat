webpackJsonp([7,9],{313:function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(79),u=a(r),o=n(76),s=a(o),i=n(11),c=a(i),d=n(59),f=n(97),p=a(f);t.default={data:function(){return this.states={matched:this.$route.matched},{}},computed:(0,c.default)({},(0,d.mapState)({signature:function(e){return e.commonMain.signature}})),methods:(0,c.default)({},(0,d.mapActions)(["fetchWechatSignature","showToast"])),created:function(){function e(){return t.apply(this,arguments)}var t=(0,s.default)(u.default.mark(function e(){var t=this;return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!this.states.matched.some(function(e){return e.meta.requireWechatConfig})){e.next=2;break}return e.delegateYield(u.default.mark(function e(){var n,a,r;return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n={params:{url:window.location.href,appid:p.default.wechat_appid}},e.next=3,t.fetchWechatSignature(n);case 3:a=t.signature,r=window.wx,r&&(r.config({debug:!0,appId:a.appid,timestamp:parseInt(a.timestamp,10),nonceStr:a.noncestr,signature:a.signature,jsApiList:["onMenuShareTimeline","onMenuShareAppMessage","onMenuShareQQ","onMenuShareWeibo","hideAllNonBaseMenuItem","chooseImage"]}),r.ready(function(){r.hideAllNonBaseMenuItem(),r.chooseImage({count:1,sizeType:["original","compressed"],sourceType:["album","camera"],success:function(e){e.localIds}})}));case 6:case"end":return e.stop()}},e,t)})(),"t0",2);case 2:case"end":return e.stop()}},e,this)}));return e}()}},655:function(e,t,n){var a,r;a=n(313);var u=n(681);r=a=a||{},"object"!=typeof a.default&&"function"!=typeof a.default||(r=a=a.default),"function"==typeof r&&(r=r.options),r.render=u.render,r.staticRenderFns=u.staticRenderFns,e.exports=a},681:function(e,t){e.exports={render:function(){var e=this;return e._h("router-view")},staticRenderFns:[]}}});