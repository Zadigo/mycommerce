"use strict";(self["webpackChunkfront2"]=self["webpackChunkfront2"]||[]).push([[310,931,738,703],{6738:function(t,e,a){a.r(e),a.d(e,{default:function(){return _}});var s=a(3396),o=a(7139);const i={class:"container"},n={class:"row d-flex justify-content-center"},r={class:"col-sm-12 col-md-12"},d={class:"d-flex justify-content-between mt-4 mb-2"},c={class:"text-uppercase fw-bold"},l={class:"col-md-12"},u={class:"row"};function p(t,e,a,p,m,g){const f=(0,s.up)("router-link"),w=(0,s.up)("product-card");return(0,s.wg)(),(0,s.iD)("div",i,[(0,s._)("div",n,[(0,s._)("div",r,[(0,s._)("div",d,[(0,s._)("h4",c,(0,o.zw)(t.$t("You may also like")),1),(0,s.Wm)(f,{id:"link-recommendations",to:{name:"collection_details_view",params:{collection:"all",lang:t.$i18n.locale}}},{default:(0,s.w5)((()=>[(0,s.Uk)((0,o.zw)(t.$t("View all")),1)])),_:1},8,["to"])])]),(0,s._)("div",l,[(0,s._)("div",u,[((0,s.wg)(!0),(0,s.iD)(s.HY,null,(0,s.Ko)(a.recommendedProducts,(t=>((0,s.wg)(),(0,s.iD)("div",{key:t.id,class:"col-sm-12 col-md-3"},[(0,s.Wm)(w,{product:t,"is-loading":a.isLoading},null,8,["product","is-loading"])])))),128))])])])])}var m=a(9703),g={name:"MoreProducts",components:{ProductCard:m["default"]},props:{isLoading:{type:Boolean,default:!0},recommendedProducts:{type:Array,default:()=>[]}}},f=a(89);const w=(0,f.Z)(g,[["render",p]]);var _=w},9703:function(t,e,a){a.r(e),a.d(e,{default:function(){return P}});var s=a(3396),o=a(9242),i=a(7139);const n={key:0,id:"link-product-card",class:"product"},r={id:"product-image"},d=["src","alt"],c={key:0,class:"mini-cart p-3 d-none"},l={class:"fw-bold mb-3 text-uppercase"},u={id:"sizes"},p={key:0},m=["onClick"],g={id:"product-details",class:"mt-2"},f={class:"fw-normal dark-text mb-0"},w={class:"d-flex justify-content-between"},_={key:0,class:"me-2 text-red"},k={class:"fw-bold"},v={key:0,class:"bg-danger p-1 rounded text-white ml-3"},h={class:"d-flex justify-content-left p-absolute m-2"};function b(t,e,a,b,y,$){const z=(0,s.up)("router-link"),C=(0,s.up)("base-tag");return a.isLoading||!$.mainImage?((0,s.wg)(),(0,s.iD)("div",n," Loading... ")):((0,s.wg)(),(0,s.iD)("article",{key:1,id:"link-product-card",class:"product my-1",onClick:e[1]||(e[1]=e=>t.$emit("product-card-click",a.product)),onMouseenter:e[2]||(e[2]=e=>t.isHovered=!0),onMouseleave:e[3]||(e[3]=e=>t.isHovered=!1)},[(0,s._)("div",r,[(0,s.Wm)(z,{to:{name:"product_view",params:{id:a.product.id,slug:a.product.slug,lang:t.$i18n.locale}}},{default:(0,s.w5)((()=>[(0,s._)("img",{src:b.mediaUrl($.mainImage.mid_size),alt:$.mainImage.name,class:"img-fluid"},null,8,d)])),_:1},8,["to"]),(0,s.Wm)(o.Transition,{name:"mini-cart-transition"},{default:(0,s.w5)((()=>[t.isHovered?((0,s.wg)(),(0,s.iD)("div",c,[(0,s._)("div",l,(0,i.zw)(t.$t("Add to cart")),1),(0,s._)("div",u,[$.hasSizes?((0,s.wg)(),(0,s.iD)("div",p,[((0,s.wg)(!0),(0,s.iD)(s.HY,null,(0,s.Ko)(a.product.sizes,(t=>((0,s.wg)(),(0,s.iD)("button",{key:t.name,type:"button",class:(0,i.C_)([{disabled:!t.availability},"btn btn-outline-dark me-2"]),onClick:e=>b.quickAddToCart(a.product,t)},(0,i.zw)(t.name),11,m)))),128))])):((0,s.wg)(),(0,s.iD)("button",{key:1,class:"btn btn-outline-dark",onClick:e[0]||(e[0]=t=>b.quickAddToCart(a.product,{name:"Unique"},!0))},(0,i.zw)(t.$t("Unique")),1))])])):(0,s.kq)("",!0)])),_:1})]),(0,s.Wm)(z,{to:{name:"product_view",params:{id:a.product.id,slug:a.product.slug,lang:t.$i18n.locale}},class:"text-decoration-none"},{default:(0,s.w5)((()=>[(0,s._)("div",g,[(0,s._)("p",f,(0,i.zw)(b.truncate(b.capitalizeLetters(a.product.name))),1),(0,s._)("div",w,[(0,s._)("div",null,[a.product.on_sale?((0,s.wg)(),(0,s.iD)("span",_,[(0,s._)("del",null,(0,i.zw)(a.product.unit_price),1)])):(0,s.kq)("",!0),(0,s._)("span",k,(0,i.zw)(a.product.on_sale?a.product.sale_price:a.product.unit_price),1)]),(0,s._)("div",null,[a.product.on_sale?((0,s.wg)(),(0,s.iD)("span",v,(0,i.zw)(b.formatAsPercentage(a.product.sale_value,!0)),1)):(0,s.kq)("",!0)])])])])),_:1},8,["to"]),(0,s._)("div",h,[a.product.on_sale?((0,s.wg)(),(0,s.j4)(C,{key:0,padding:1,width:30,"background-color":"bg-primary"},{default:(0,s.w5)((()=>[(0,s.Uk)((0,i.zw)(t.$t("Sale")),1)])),_:1})):(0,s.kq)("",!0),a.product.display_new?((0,s.wg)(),(0,s.j4)(C,{key:1,padding:1,width:30,"background-color":"bg-danger",class:"mx-2"},{default:(0,s.w5)((()=>[(0,s.Uk)((0,i.zw)(t.$t("New")),1)])),_:1})):(0,s.kq)("",!0)])],32))}var y=a(4806),$=a.n(y),z=a(8661),C=a(3006),x=a(2931),A=a(2440),D={name:"ProductCard",components:{BaseTag:x["default"]},props:{isLoading:{type:Boolean,default:!1},product:{type:Object,required:!0}},emits:["product-card-click"],setup(){const t=(0,C.L)(),{addingToCart:e,productOptions:a,quickAddToCart:s,getSessionId:o}=(0,A.Z)();return{addingToCart:e,productOptions:a,store:t,formatAsPercentage:z.JY,capitalizeLetters:z.zH,mediaUrl:z.si,truncate:z.$G,quickAddToCart:s,getSessionId:o}},data:()=>({isHovered:!1}),computed:{mainImage(){const t=$().find(this.product.images,["is_main_image",!0]);return t||this.product.images[0]},hasSizes(){return this.product.sizes.length>0}}},q=a(89);const I=(0,q.Z)(D,[["render",b],["__scopeId","data-v-92d1d718"]]);var P=I},2931:function(t,e,a){a.r(e),a.d(e,{default:function(){return l}});var s=a(3396),o=a(7139);function i(t,e,a,i,n,r){return(0,s.wg)(),(0,s.iD)("div",{id:"tag",ref:"tag",class:(0,o.C_)([r.classes,"darken-1 text-uppercase text-white font-weight-bold rounded text-center"])},[(0,s.WI)(t.$slots,"default")],2)}var n=a(8661),r={name:"BaseTag",props:{backgroundColor:{type:String,default:"primary"},isAbsolute:{type:Boolean},left:{type:Number,default:0},padding:{type:Number,default:3},top:{type:Number,default:0},width:{type:Number,default:20}},setup(){return{formatAsPercentage:n.JY}},computed:{classes(){return[this.backgroundColor,{[`p-${this.padding}`]:!0}]}},mounted(){this.$refs.tag.style.width=this.formatAsPercentage(this.width),this.positionItem()},updated(){this.positionItem()},methods:{positionItem(){this.isAbsolute&&(this.$refs.tag.style.position="absolute",this.$refs.tag.style.top=this.formatAsPercentage(this.top),this.$refs.tag.style.left=this.formatAsPercentage(this.left))}}},d=a(89);const c=(0,d.Z)(r,[["render",i]]);var l=c},310:function(t,e,a){a.r(e),a.d(e,{default:function(){return h}});var s=a(3396);const o={id:"success",class:"ecommerce-section"},i={class:"container"},n={class:"row"},r={class:"card"},d={class:"card-body text-center"},c=(0,s._)("h3",{class:"display-6 fw-bold"},"Your order was successful",-1),l=(0,s.Uk)(" Continue shopping "),u={class:"row mt-4"},p={class:"col-12"};function m(t,e,a,m,g,f){const w=(0,s.up)("router-link"),_=(0,s.up)("more-products-vue");return(0,s.wg)(),(0,s.iD)("section",o,[(0,s._)("div",i,[(0,s._)("div",n,[(0,s._)("div",r,[(0,s._)("div",d,[c,(0,s.Wm)(w,{to:{name:"collection_details_view",params:{collection:"all",lang:t.$i18n.locale}},class:"btn btn-primary btn-lg"},{default:(0,s.w5)((()=>[l])),_:1},8,["to"])])])]),(0,s._)("div",u,[(0,s._)("div",p,[(0,s.Wm)(_,{"recommended-products":[]})])])])])}var g=a(3006),f=a(4301),w=a(6738),_={name:"SuccessView",components:{MoreProductsVue:w["default"]},setup(){const t=(0,g.L)(),{cartItems:e}=(0,f.Jk)(t);return{cartItems:e}},beforeMount(){var t=this.$route.query.token;this.checkToken(t)},methods:{async getRecommendations(){},async checkToken(t){if(!t)return this.$router.push({name:"collection_details_view",params:{collection:"all",lang:this.$i18n.locale}})}}},k=a(89);const v=(0,k.Z)(_,[["render",m]]);var h=v}}]);
//# sourceMappingURL=310.2060559a.js.map