(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-f843f3ce"],{"10d2b":function(t,e,a){},"2a7f":function(t,e,a){"use strict";a.d(e,"a",(function(){return n})),a.d(e,"b",(function(){return i}));var s=a("71d9"),o=a("80d2"),i=Object(o["i"])("v-toolbar__title"),n=Object(o["i"])("v-toolbar__items");s["a"]},"2fa4":function(t,e,a){"use strict";a("20f6");var s=a("80d2");e["a"]=Object(s["i"])("spacer","div","v-spacer")},"4eb9":function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("section",{attrs:{id:"product"}},[a("v-row",[a("v-col",{attrs:{cols:"12"}},[a("v-card",{attrs:{flat:""}},[a("v-card-actions",{staticClass:"text-right justify-content-right"},[a("v-btn",{on:{click:function(e){return t.$router.go(-1)}}},[a("v-icon",{staticClass:"mr-2"},[t._v("mdi-arrow-left")]),t._v(" Annuler ")],1),a("v-btn",{on:{click:t.updateProduct}},[t._v(" Mettre à jour ")])],1)],1)],1),a("v-col",{attrs:{cols:"8"}},[a("v-card",[a("v-card-title",[t._v(" Informations ")]),a("v-card-text",{staticClass:"mb-3"},[a("v-text-field",{staticClass:"mb-3",attrs:{type:"text",placeholder:"Product name","hide-details":"",outlined:""},model:{value:t.productUpdates.name,callback:function(e){t.$set(t.productUpdates,"name",e)},expression:"productUpdates.name"}}),a("v-autocomplete",{attrs:{items:["a","b","c"],placeholder:"Category","hide-details":"","auto-select-first":"",outlined:""}},[a("v-text-field",{attrs:{type:"text",placeholder:"Category"},model:{value:t.productUpdates.category,callback:function(e){t.$set(t.productUpdates,"category",e)},expression:"productUpdates.category"}})],1)],1)],1),a("v-card",{staticClass:"mb-2"},[a("v-card-title",[t._v(" Prices ")]),a("v-card-text",[a("v-text-field",{attrs:{type:"number",placeholder:"Price","hide-details":"",outlined:""},model:{value:t.productUpdates.unit_price,callback:function(e){t.$set(t.productUpdates,"unit_price",e)},expression:"productUpdates.unit_price"}}),a("v-checkbox",{attrs:{label:"Mark the product as being on sale"},model:{value:t.productUpdates.on_sale,callback:function(e){t.$set(t.productUpdates,"on_sale",e)},expression:"productUpdates.on_sale"}}),t.productUpdates.on_sale?a("v-row",[a("v-col",{attrs:{cols:"6"}},[a("v-text-field",{staticClass:"mb-3",attrs:{type:"number",placeholder:"Sale value","hide-details":"",outlined:""},model:{value:t.productUpdates.sale_value,callback:function(e){t.$set(t.productUpdates,"sale_value",e)},expression:"productUpdates.sale_value"}}),a("v-text-field",{attrs:{type:"number",placeholder:"Sale price","hide-details":"",outlined:""},model:{value:t.productUpdates.sale_price,callback:function(e){t.$set(t.productUpdates,"sale_price",e)},expression:"productUpdates.sale_price"}})],1)],1):t._e()],1)],1),a("v-card",{staticClass:"mb-2"},[a("v-card-title",[t._v(" Variants ")]),a("v-card-text",[a("v-autocomplete",{attrs:{items:["Beige","Black","White","Charcoal"],placeholder:"Color",outlined:"","auto-select-first":"","hide-details":""},model:{value:t.productUpdates.color,callback:function(e){t.$set(t.productUpdates,"color",e)},expression:"productUpdates.color"}})],1)],1),a("v-card",[a("v-toolbar",{attrs:{dense:"",flat:""}},[a("v-toolbar-title",[t._v(" Media ")]),a("v-spacer"),a("v-menu",{attrs:{"close-on-content-click":!0,"open-on-hover":!1,rounded:!1,transition:"slide-transition"},scopedSlots:t._u([{key:"activator",fn:function(e){var s=e.on,o=e.attrs;return[a("v-btn",t._g(t._b({attrs:{icon:""}},"v-btn",o,!1),s),[a("v-icon",[t._v("mdi-dots-vertical")])],1)]}}])},[a("v-list",[a("v-list-item",{on:{click:t.loadImages}},[a("v-list-item-title",[t._v("Choisir des images")])],1)],1)],1),a("v-dialog",{attrs:{fullscreen:"","hide-overlay":"",transition:"dialog-bottom-transition",scrollable:""},model:{value:t.openImageSelection,callback:function(e){t.openImageSelection=e},expression:"openImageSelection"}},[a("v-card",[a("v-toolbar",{attrs:{dark:"",color:"primary"}},[a("v-btn",{attrs:{icon:"",dark:""},on:{click:function(e){t.dialog=!1}}},[a("v-icon",[t._v("mdi-close")])],1),a("v-toolbar-title",[t._v("Settings")]),a("v-spacer"),a("v-toolbar-items",[a("v-btn",{attrs:{dark:"",text:""},on:{click:function(e){t.dialog=!1}}},[t._v(" Save ")])],1)],1)],1)],1)],1),a("v-card-text",[a("v-row",[t._l(t.additionalProductDetails.images,(function(e){return a("v-col",{key:e.id,attrs:{cols:"3"}},[a("div",{attrs:{id:"product-image"}},[a("v-img",{attrs:{src:t._f("mediaUrl")(e.mid_size)}}),a("v-btn",{attrs:{icon:""},on:{click:t.removeImage}},[a("v-icon",[t._v("mdi-window-close")])],1)],1)])})),a("v-col",{attrs:{cols:"3"}},[a("div",{staticClass:"select-images"},[a("div",{staticClass:"wrapper"},[a("v-icon",[t._v("mdi-plus")])],1)])])],2)],1)],1)],1),a("v-col",{attrs:{cols:"4"}},[a("v-card",[a("v-card-title",[t._v(" Options ")]),a("v-card-text",[a("v-switch",{attrs:{label:"Activer","hide-details":""},model:{value:t.productUpdates.active,callback:function(e){t.$set(t.productUpdates,"active",e)},expression:"productUpdates.active"}}),a("v-switch",{attrs:{label:"Afficher le produit comme nouveau","hide-details":""},model:{value:t.productUpdates.display_new,callback:function(e){t.$set(t.productUpdates,"display_new",e)},expression:"productUpdates.display_new"}})],1)],1)],1)],1)],1)},o=[],i=a("1da1"),n=a("5530"),r=(a("96cf"),a("d81d"),a("2f62")),c=a("2ef0"),l={name:"ProductView",data:function(){return{productUpdates:{},openImageSelection:!1,additionalProductDetails:{}}},computed:Object(n["a"])({},Object(r["d"])("dashboardModule",["productDetails"])),beforeMount:function(){this.$store.commit("dashboardModule/setProductDetails",this.$route.params.id),Object.assign(this.productUpdates,this.productDetails),this.getAdditionalDetails()},methods:{getAdditionalDetails:function(){var t=this;return Object(i["a"])(regeneratorRuntime.mark((function e(){var a,s,o,i;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,t.axios.get("shop/dashboard/products/".concat(t.$route.params.id));case 3:a=e.sent,s=a.data,t.additionalProductDetails=s,o={},i=c.map(t.additionalProductDetails.images,(function(t){return t.id})),o["images"]=i,Object.assign(o,s),t.productUpdates=o,e.next=16;break;case 13:e.prev=13,e.t0=e["catch"](0),console.log(e.t0);case 16:case"end":return e.stop()}}),e,null,[[0,13]])})))()},updateProduct:function(){var t=this;return Object(i["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,t.axios.post("/dashboard/products/".concat(t.$route.params.id,"/update"),t.productUpdates);case 3:e.sent,e.next=10;break;case 7:e.prev=7,e.t0=e["catch"](0),console.log(e.t0);case 10:case"end":return e.stop()}}),e,null,[[0,7]])})))()},removeImage:function(){return Object(i["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:case"end":return t.stop()}}),t)})))()},loadImages:function(){var t=this;this.$api.dashboard.images.all().then((function(e){t.openImageSelection=!0})).catch((function(t){}))}}},d=l,u=(a("cf39"),a("2877")),h=a("6544"),p=a.n(h),v=a("c6a6"),f=a("8336"),m=a("b0af"),b=a("99d9"),g=a("ac7c"),_=a("62ad"),x=a("169a9"),w=a("132d"),C=a("adda"),k=a("8860"),j=a("da13"),O=a("5d23"),y=a("e449"),S=a("0fd9"),$=a("2fa4"),U=a("15fd"),E=(a("0481"),a("4069"),a("ec29"),a("9d01"),a("fe09")),V=a("c37a"),P=(a("d3b7"),a("159b"),a("80d2")),B=function(t){var e=t.touchstartX,a=t.touchendX,s=t.touchstartY,o=t.touchendY,i=.5,n=16;t.offsetX=a-e,t.offsetY=o-s,Math.abs(t.offsetY)<i*Math.abs(t.offsetX)&&(t.left&&a<e-n&&t.left(t),t.right&&a>e+n&&t.right(t)),Math.abs(t.offsetX)<i*Math.abs(t.offsetY)&&(t.up&&o<s-n&&t.up(t),t.down&&o>s+n&&t.down(t))};function I(t,e){var a=t.changedTouches[0];e.touchstartX=a.clientX,e.touchstartY=a.clientY,e.start&&e.start(Object.assign(t,e))}function D(t,e){var a=t.changedTouches[0];e.touchendX=a.clientX,e.touchendY=a.clientY,e.end&&e.end(Object.assign(t,e)),B(e)}function H(t,e){var a=t.changedTouches[0];e.touchmoveX=a.clientX,e.touchmoveY=a.clientY,e.move&&e.move(Object.assign(t,e))}function X(t){var e={touchstartX:0,touchstartY:0,touchendX:0,touchendY:0,touchmoveX:0,touchmoveY:0,offsetX:0,offsetY:0,left:t.left,right:t.right,up:t.up,down:t.down,start:t.start,move:t.move,end:t.end};return{touchstart:function(t){return I(t,e)},touchend:function(t){return D(t,e)},touchmove:function(t){return H(t,e)}}}function Y(t,e,a){var s=e.value,o=s.parent?t.parentElement:t,i=s.options||{passive:!0};if(o){var n=X(e.value);o._touchHandlers=Object(o._touchHandlers),o._touchHandlers[a.context._uid]=n,Object(P["z"])(n).forEach((function(t){o.addEventListener(t,n[t],i)}))}}function T(t,e,a){var s=e.value.parent?t.parentElement:t;if(s&&s._touchHandlers){var o=s._touchHandlers[a.context._uid];Object(P["z"])(o).forEach((function(t){s.removeEventListener(t,o[t])})),delete s._touchHandlers[a.context._uid]}}var A={inserted:Y,unbind:T},M=A,R=a("0789"),L=a("490a"),z=["title"],N=E["a"].extend({name:"v-switch",directives:{Touch:M},props:{inset:Boolean,loading:{type:[Boolean,String],default:!1},flat:{type:Boolean,default:!1}},computed:{classes:function(){return Object(n["a"])(Object(n["a"])({},V["a"].options.computed.classes.call(this)),{},{"v-input--selection-controls v-input--switch":!0,"v-input--switch--flat":this.flat,"v-input--switch--inset":this.inset})},attrs:function(){return{"aria-checked":String(this.isActive),"aria-disabled":String(this.isDisabled),role:"switch"}},validationState:function(){return this.hasError&&this.shouldValidate?"error":this.hasSuccess?"success":null!==this.hasColor?this.computedColor:void 0},switchData:function(){return this.setTextColor(this.loading?void 0:this.validationState,{class:this.themeClasses})}},methods:{genDefaultSlot:function(){return[this.genSwitch(),this.genLabel()]},genSwitch:function(){var t=this.attrs$,e=(t.title,Object(U["a"])(t,z));return this.$createElement("div",{staticClass:"v-input--selection-controls__input"},[this.genInput("checkbox",Object(n["a"])(Object(n["a"])({},this.attrs),e)),this.genRipple(this.setTextColor(this.validationState,{directives:[{name:"touch",value:{left:this.onSwipeLeft,right:this.onSwipeRight}}]})),this.$createElement("div",Object(n["a"])({staticClass:"v-input--switch__track"},this.switchData)),this.$createElement("div",Object(n["a"])({staticClass:"v-input--switch__thumb"},this.switchData),[this.genProgress()])])},genProgress:function(){return this.$createElement(R["c"],{},[!1===this.loading?null:this.$slots.progress||this.$createElement(L["a"],{props:{color:!0===this.loading||""===this.loading?this.color||"primary":this.loading,size:16,width:2,indeterminate:!0}})])},onSwipeLeft:function(){this.isActive&&this.onChange()},onSwipeRight:function(){this.isActive||this.onChange()},onKeydown:function(t){(t.keyCode===P["y"].left&&this.isActive||t.keyCode===P["y"].right&&!this.isActive)&&this.onChange()}}}),J=a("8654"),F=a("71d9"),K=a("2a7f"),W=Object(u["a"])(d,s,o,!1,null,"61170a22",null);e["default"]=W.exports;p()(W,{VAutocomplete:v["a"],VBtn:f["a"],VCard:m["a"],VCardActions:b["a"],VCardText:b["b"],VCardTitle:b["c"],VCheckbox:g["a"],VCol:_["a"],VDialog:x["a"],VIcon:w["a"],VImg:C["a"],VList:k["a"],VListItem:j["a"],VListItemTitle:O["b"],VMenu:y["a"],VRow:S["a"],VSpacer:$["a"],VSwitch:N,VTextField:J["a"],VToolbar:F["a"],VToolbarItems:K["a"],VToolbarTitle:K["b"]})},"5e23":function(t,e,a){},"71d9":function(t,e,a){"use strict";var s=a("3835"),o=a("5530"),i=(a("a9e3"),a("0481"),a("4069"),a("d3b7"),a("5e23"),a("8dd9")),n=a("adda"),r=a("80d2"),c=a("d9bd");e["a"]=i["a"].extend({name:"v-toolbar",props:{absolute:Boolean,bottom:Boolean,collapse:Boolean,dense:Boolean,extended:Boolean,extensionHeight:{default:48,type:[Number,String]},flat:Boolean,floating:Boolean,prominent:Boolean,short:Boolean,src:{type:[String,Object],default:""},tag:{type:String,default:"header"}},data:function(){return{isExtended:!1}},computed:{computedHeight:function(){var t=this.computedContentHeight;if(!this.isExtended)return t;var e=parseInt(this.extensionHeight);return this.isCollapsed?t:t+(isNaN(e)?0:e)},computedContentHeight:function(){return this.height?parseInt(this.height):this.isProminent&&this.dense?96:this.isProminent&&this.short?112:this.isProminent?128:this.dense?48:this.short||this.$vuetify.breakpoint.smAndDown?56:64},classes:function(){return Object(o["a"])(Object(o["a"])({},i["a"].options.computed.classes.call(this)),{},{"v-toolbar":!0,"v-toolbar--absolute":this.absolute,"v-toolbar--bottom":this.bottom,"v-toolbar--collapse":this.collapse,"v-toolbar--collapsed":this.isCollapsed,"v-toolbar--dense":this.dense,"v-toolbar--extended":this.isExtended,"v-toolbar--flat":this.flat,"v-toolbar--floating":this.floating,"v-toolbar--prominent":this.isProminent})},isCollapsed:function(){return this.collapse},isProminent:function(){return this.prominent},styles:function(){return Object(o["a"])(Object(o["a"])({},this.measurableStyles),{},{height:Object(r["h"])(this.computedHeight)})}},created:function(){var t=this,e=[["app","<v-app-bar app>"],["manual-scroll",'<v-app-bar :value="false">'],["clipped-left","<v-app-bar clipped-left>"],["clipped-right","<v-app-bar clipped-right>"],["inverted-scroll","<v-app-bar inverted-scroll>"],["scroll-off-screen","<v-app-bar scroll-off-screen>"],["scroll-target","<v-app-bar scroll-target>"],["scroll-threshold","<v-app-bar scroll-threshold>"],["card","<v-app-bar flat>"]];e.forEach((function(e){var a=Object(s["a"])(e,2),o=a[0],i=a[1];t.$attrs.hasOwnProperty(o)&&Object(c["a"])(o,i,t)}))},methods:{genBackground:function(){var t={height:Object(r["h"])(this.computedHeight),src:this.src},e=this.$scopedSlots.img?this.$scopedSlots.img({props:t}):this.$createElement(n["a"],{props:t});return this.$createElement("div",{staticClass:"v-toolbar__image"},[e])},genContent:function(){return this.$createElement("div",{staticClass:"v-toolbar__content",style:{height:Object(r["h"])(this.computedContentHeight)}},Object(r["s"])(this))},genExtension:function(){return this.$createElement("div",{staticClass:"v-toolbar__extension",style:{height:Object(r["h"])(this.extensionHeight)}},Object(r["s"])(this,"extension"))}},render:function(t){this.isExtended=this.extended||!!this.$scopedSlots.extension;var e=[this.genContent()],a=this.setBackgroundColor(this.color,{class:this.classes,style:this.styles,on:this.$listeners});return this.isExtended&&e.push(this.genExtension()),(this.src||this.$scopedSlots.img)&&e.unshift(this.genBackground()),t(this.tag,a,e)}})},"9d01":function(t,e,a){},cf39:function(t,e,a){"use strict";a("10d2b")}}]);
//# sourceMappingURL=chunk-f843f3ce.b409b60f.js.map