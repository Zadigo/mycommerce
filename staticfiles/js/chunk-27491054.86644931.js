(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-27491054"],{"628d":function(e,i,t){"use strict";t("d23a")},be53:function(e,i,t){"use strict";t.r(i);var a=function(){var e=this,i=e.$createElement,t=e._self._c||i;return t("div",{staticClass:"d-flex flex-direction-colum justify-content-around"},[t("div",{staticStyle:{width:"15%","margin-right":".5rem"},attrs:{id:"images"}},[e._l(e.images,(function(i,a){return t("b-img",{key:i.id,staticClass:"mb-2",class:{darken:a!=e.cursor},attrs:{alt:i.name,src:e._f("mediaUrl")(i.mid_size),fluid:""},on:{click:function(i){return e.changeImage(a)}}})})),e.hasVideo?t("div",{staticClass:"video-action",on:{click:e.doPlay}},[t("b-img",{attrs:{src:e._f("mediaUrl")(e.images[0].mid_size),fluid:""}}),t("v-icon",{staticStyle:{opacity:"0.8"},attrs:{"x-large":!0,color:"white"}},[e._v("mdi-play")])],1):e._e(),t("b-btn",{staticClass:"mt-3 shadow-none outline-primary",attrs:{variant:"light",block:""}},[t("font-awesome-icon",{attrs:{icon:"share"}})],1)],2),t("div",{attrs:{id:"image"}},[e.playVideo&&e.hasVideo?t("div",{staticClass:"video-wrapper"},[t("b-embed",{ref:"videoSource",attrs:{poster:e._f("mediaUrl")(e.mainImage.mid_size),type:"video",aspect:"4by3",controls:""}},[t("source",{attrs:{src:e._f("mediaUrl")(e.productVideo.content),type:"video/mp4",muted:""}})])],1):t("b-img",{attrs:{src:e._f("mediaUrl")(e.imageToDisplay.mid_size),alt:e.imageToDisplay.name,fluid:""}}),e.isNew?t("base-tag",{attrs:{"is-absolute":!0,top:3,left:5,padding:2,"background-color":"primary"}},[[e._v(" "+e._s(e.$t("New"))+" ")]],2):e._e()],1)])},s=[],o=(t("7db0"),t("d3b7"),t("b64b"),t("2ef0")),r={name:"Images",props:{isNew:{type:Boolean},images:{type:Array,required:!0},productVideo:{type:Object,default:function(){}}},data:function(){return{cursor:0,playVideo:!1}},computed:{mainImage:function(){var e=o.find(this.images,["is_main_image",!0]);return o.isUndefined(e)?this.images[0]:e},imageToDisplay:function(){return this.images[this.cursor]},hasVideo:function(){return!!this.productVideo&&Object.keys(this.productVideo).length>0}},methods:{changeImage:function(e){this.playVideo&&(this.playVideo=!1),this.cursor=e},doPlay:function(){this.playVideo=!this.playVideo;try{var e=this.$refs.videoSource.getElementsByTagName("video");e[0].play()}catch(i){this.$store.dispatch("addErrorMessage","Could not start video")}}}},d=r,n=(t("628d"),t("2877")),c=t("6544"),l=t.n(c),m=t("132d"),u=Object(n["a"])(d,a,s,!1,null,"3f99ad9e",null);i["default"]=u.exports;l()(u,{VIcon:m["a"]})},d23a:function(e,i,t){}}]);
//# sourceMappingURL=chunk-27491054.86644931.js.map