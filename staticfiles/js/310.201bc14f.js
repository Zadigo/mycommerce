"use strict";(self["webpackChunkfront2"]=self["webpackChunkfront2"]||[]).push([[310,931,674,11],{8674:function(t,e,a){a.r(e),a.d(e,{default:function(){return _}});var o=a(3396),s=a(7139);const n={class:"container"},i={class:"row d-flex justify-content-center"},r={class:"col-sm-12 col-md-12"},d={class:"d-flex justify-content-between mt-4 mb-2"},c={class:"text-uppercase fw-bold"},l={class:"col-md-12"},u={class:"row"};function p(t,e,a,p,m,g){const f=(0,o.up)("router-link"),w=(0,o.up)("product-card");return(0,o.wg)(),(0,o.iD)("div",n,[(0,o._)("div",i,[(0,o._)("div",r,[(0,o._)("div",d,[(0,o._)("h4",c,(0,s.zw)(t.$t("You may also like")),1),(0,o.Wm)(f,{id:"link-recommendations",to:{name:"collection_details_view",params:{collection:"all",lang:t.$i18n.locale}}},{default:(0,o.w5)((()=>[(0,o.Uk)((0,s.zw)(t.$t("View all")),1)])),_:1},8,["to"])])]),(0,o._)("div",l,[(0,o._)("div",u,[((0,o.wg)(!0),(0,o.iD)(o.HY,null,(0,o.Ko)(a.recommendedProducts,(t=>((0,o.wg)(),(0,o.iD)("div",{key:t.id,class:"col-sm-12 col-md-3"},[(0,o.Wm)(w,{product:t,"is-loading":a.isLoading},null,8,["product","is-loading"])])))),128))])])])])}var m=a(5011),g={name:"MoreProducts",components:{ProductCard:m["default"]},props:{isLoading:{type:Boolean,default:!0},recommendedProducts:{type:Array,default:()=>[]}}},f=a(89);const w=(0,f.Z)(g,[["render",p]]);var _=w},5011:function(t,e,a){a.r(e),a.d(e,{default:function(){return I}});var o=a(3396),s=a(9242),n=a(7139);const i={key:0,id:"link-product-card",class:"product"},r={id:"product-image"},d=["src","alt"],c={key:0,class:"mini-cart p-3 d-none"},l={class:"fw-bold mb-3 text-uppercase"},u={id:"sizes"},p={key:0},m=["onClick"],g={id:"product-details",class:"mt-2"},f={class:"fw-normal dark-text mb-0"},w={class:"d-flex justify-content-between"},_={key:0,class:"me-2 text-red"},k={key:0,class:"bg-danger p-1 rounded text-white ml-3"},v={class:"d-flex justify-content-left p-absolute m-2"};function y(t,e,a,y,h,b){const $=(0,o.up)("router-link"),z=(0,o.up)("base-tag");return a.isLoading||!b.mainImage?((0,o.wg)(),(0,o.iD)("div",i," Loading... ")):((0,o.wg)(),(0,o.iD)("article",{key:1,id:"link-product-card",class:"product my-1",onClick:e[1]||(e[1]=e=>t.$emit("product-card-click",a.product)),onMouseenter:e[2]||(e[2]=e=>t.isHovered=!0),onMouseleave:e[3]||(e[3]=e=>t.isHovered=!1)},[(0,o._)("div",r,[(0,o.Wm)($,{to:{name:"product_view",params:{id:a.product.id,slug:a.product.slug,lang:t.$i18n.locale}}},{default:(0,o.w5)((()=>[(0,o._)("img",{src:y.mediaUrl(b.mainImage.mid_size),alt:b.mainImage.name,class:"img-fluid"},null,8,d)])),_:1},8,["to"]),(0,o.Wm)(s.Transition,{name:"mini-cart-transition"},{default:(0,o.w5)((()=>[t.isHovered?((0,o.wg)(),(0,o.iD)("div",c,[(0,o._)("div",l,(0,n.zw)(t.$t("Add to cart")),1),(0,o._)("div",u,[b.hasSizes?((0,o.wg)(),(0,o.iD)("div",p,[((0,o.wg)(!0),(0,o.iD)(o.HY,null,(0,o.Ko)(a.product.sizes,(t=>((0,o.wg)(),(0,o.iD)("button",{key:t.name,type:"button",class:(0,n.C_)([{disabled:!t.availability},"btn btn-outline-dark me-2"]),onClick:e=>y.quickAddToCart(a.product,t)},(0,n.zw)(t.name),11,m)))),128))])):((0,o.wg)(),(0,o.iD)("button",{key:1,class:"btn btn-outline-dark",onClick:e[0]||(e[0]=t=>y.quickAddToCart(a.product,{name:"Unique"},!0))},(0,n.zw)(t.$t("Unique")),1))])])):(0,o.kq)("",!0)])),_:1})]),(0,o.Wm)($,{to:{name:"product_view",params:{id:a.product.id,slug:a.product.slug,lang:t.$i18n.locale}},class:"text-decoration-none"},{default:(0,o.w5)((()=>[(0,o._)("div",g,[(0,o._)("p",f,(0,n.zw)(y.truncate(y.capitalizeLetters(a.product.name))),1),(0,o._)("div",w,[(0,o._)("div",null,[a.product.on_sale?((0,o.wg)(),(0,o.iD)("span",_,[(0,o._)("del",null,(0,n.zw)(t.$n(1*a.product.unit_price,"currency",t.$i18n.locale)),1)])):(0,o.kq)("",!0),(0,o._)("span",{class:(0,n.C_)([{"text-danger":a.product.on_sale},"fw-bold"])},(0,n.zw)(t.$n(1*a.product.get_price,"currency",t.$i18n.locale)),3)]),(0,o._)("div",null,[a.product.on_sale?((0,o.wg)(),(0,o.iD)("span",k,(0,n.zw)(y.formatAsPercentage(a.product.sale_value,!0)),1)):(0,o.kq)("",!0)])])])])),_:1},8,["to"]),(0,o._)("div",v,[a.product.on_sale?((0,o.wg)(),(0,o.j4)(z,{key:0,padding:1,width:30,"background-color":"bg-primary"},{default:(0,o.w5)((()=>[(0,o.Uk)((0,n.zw)(t.$t("Sale")),1)])),_:1})):(0,o.kq)("",!0),a.product.display_new?((0,o.wg)(),(0,o.j4)(z,{key:1,padding:1,width:30,"background-color":"bg-danger",class:"mx-2"},{default:(0,o.w5)((()=>[(0,o.Uk)((0,n.zw)(t.$t("New")),1)])),_:1})):(0,o.kq)("",!0)])],32))}var h=a(4806),b=a.n(h),$=a(8661),z=a(3006),C=a(2931),x=a(2440),A={name:"ProductCard",components:{BaseTag:C["default"]},props:{isLoading:{type:Boolean,default:!1},product:{type:Object,required:!0}},emits:["product-card-click"],setup(){const t=(0,z.L)(),{addingToCart:e,productOptions:a,quickAddToCart:o,getSessionId:s}=(0,x.Z)();return{addingToCart:e,productOptions:a,store:t,formatAsPercentage:$.JY,capitalizeLetters:$.zH,mediaUrl:$.si,truncate:$.$G,quickAddToCart:o,getSessionId:s}},data:()=>({isHovered:!1}),computed:{mainImage(){const t=b().find(this.product.images,["is_main_image",!0]);return t||this.product.images[0]},hasSizes(){return this.product.sizes.length>0}}},D=a(89);const q=(0,D.Z)(A,[["render",y],["__scopeId","data-v-fa67ec28"]]);var I=q},2931:function(t,e,a){a.r(e),a.d(e,{default:function(){return l}});var o=a(3396),s=a(7139);function n(t,e,a,n,i,r){return(0,o.wg)(),(0,o.iD)("div",{id:"tag",ref:"tag",class:(0,s.C_)([r.classes,"darken-1 text-uppercase text-white font-weight-bold rounded text-center"])},[(0,o.WI)(t.$slots,"default")],2)}var i=a(8661),r={name:"BaseTag",props:{backgroundColor:{type:String,default:"primary"},isAbsolute:{type:Boolean},left:{type:Number,default:0},padding:{type:Number,default:3},top:{type:Number,default:0},width:{type:Number,default:20}},setup(){return{formatAsPercentage:i.JY}},computed:{classes(){return[this.backgroundColor,{[`p-${this.padding}`]:!0}]}},mounted(){this.$refs.tag.style.width=this.formatAsPercentage(this.width),this.positionItem()},updated(){this.positionItem()},methods:{positionItem(){this.isAbsolute&&(this.$refs.tag.style.position="absolute",this.$refs.tag.style.top=this.formatAsPercentage(this.top),this.$refs.tag.style.left=this.formatAsPercentage(this.left))}}},d=a(89);const c=(0,d.Z)(r,[["render",n]]);var l=c},310:function(t,e,a){a.r(e),a.d(e,{default:function(){return y}});var o=a(3396);const s={id:"success",class:"ecommerce-section"},n={class:"container"},i={class:"row"},r={class:"card"},d={class:"card-body text-center"},c=(0,o._)("h3",{class:"display-6 fw-bold"},"Your order was successful",-1),l=(0,o.Uk)(" Continue shopping "),u={class:"row mt-4"},p={class:"col-12"};function m(t,e,a,m,g,f){const w=(0,o.up)("router-link"),_=(0,o.up)("more-products-vue");return(0,o.wg)(),(0,o.iD)("section",s,[(0,o._)("div",n,[(0,o._)("div",i,[(0,o._)("div",r,[(0,o._)("div",d,[c,(0,o.Wm)(w,{to:{name:"collection_details_view",params:{collection:"all",lang:t.$i18n.locale}},class:"btn btn-primary btn-lg"},{default:(0,o.w5)((()=>[l])),_:1},8,["to"])])])]),(0,o._)("div",u,[(0,o._)("div",p,[(0,o.Wm)(_,{"recommended-products":[]})])])])])}var g=a(3006),f=a(4301),w=a(8674),_={name:"SuccessView",components:{MoreProductsVue:w["default"]},setup(){const t=(0,g.L)(),{cartItems:e}=(0,f.Jk)(t);return{cartItems:e}},beforeMount(){var t=this.$route.query.token;this.checkToken(t)},methods:{async getRecommendations(){},async checkToken(t){if(!t)return this.$router.push({name:"collection_details_view",params:{collection:"all",lang:this.$i18n.locale}})}}},k=a(89);const v=(0,k.Z)(_,[["render",m]]);var y=v}}]);
//# sourceMappingURL=310.201bc14f.js.map