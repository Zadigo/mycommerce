"use strict";(self["webpackChunkfront2"]=self["webpackChunkfront2"]||[]).push([[78,931,11],{3078:function(t,e,a){a.r(e),a.d(e,{default:function(){return _}});var i=a(3396),d=a(7139);const s={class:"container"},o={class:"row"},n={class:"col-sm-12 col-md-12"},r={class:"text-uppercase fw-bold"},c={class:"col-sm-12 col-md-12"},l={class:"row"};function u(t,e,a,u,p,g){const m=(0,i.up)("product-card");return(0,i.wg)(),(0,i.iD)("div",s,[(0,i._)("div",o,[(0,i._)("div",n,[(0,i._)("h4",r,(0,d.zw)(t.$t("Recently viewed")),1)]),(0,i._)("div",c,[(0,i._)("div",l,[((0,i.wg)(!0),(0,i.iD)(i.HY,null,(0,i.Ko)(t.getRecentlyViewedProducts,(t=>((0,i.wg)(),(0,i.iD)("div",{key:t.id,class:"col-3"},[(0,i.Wm)(m,{product:t,"is-loading":a.isLoading},null,8,["product","is-loading"])])))),128))])])])])}var p=a(4301),g=a(3006),m=a(5011),f={name:"RecentlyViewed",components:{ProductCard:m["default"]},props:{isLoading:{type:Boolean,default:!0}},computed:{...(0,p.rn)(g.L,["getRecentlyViewedProducts"])}},w=a(89);const k=(0,w.Z)(f,[["render",u]]);var _=k},5011:function(t,e,a){a.r(e),a.d(e,{default:function(){return I}});var i=a(3396),d=a(9242),s=a(7139);const o={key:0,id:"link-product-card",class:"product"},n={id:"product-image"},r=["src","alt"],c={key:0,class:"mini-cart p-3 d-none"},l={class:"fw-bold mb-3 text-uppercase"},u={id:"sizes"},p={key:0},g=["onClick"],m={id:"product-details",class:"mt-2"},f={class:"fw-normal dark-text mb-0"},w={class:"d-flex justify-content-between"},k={key:0,class:"me-2 text-red"},_={key:0,class:"bg-danger p-1 rounded text-white ml-3"},v={class:"d-flex justify-content-left p-absolute m-2"};function y(t,e,a,y,b,h){const z=(0,i.up)("router-link"),C=(0,i.up)("base-tag");return a.isLoading||!h.mainImage?((0,i.wg)(),(0,i.iD)("div",o," Loading... ")):((0,i.wg)(),(0,i.iD)("article",{key:1,id:"link-product-card",class:"product my-1",onClick:e[1]||(e[1]=e=>t.$emit("product-card-click",a.product)),onMouseenter:e[2]||(e[2]=e=>t.isHovered=!0),onMouseleave:e[3]||(e[3]=e=>t.isHovered=!1)},[(0,i._)("div",n,[(0,i.Wm)(z,{to:{name:"product_view",params:{id:a.product.id,slug:a.product.slug,lang:t.$i18n.locale}}},{default:(0,i.w5)((()=>[(0,i._)("img",{src:y.mediaUrl(h.mainImage.mid_size),alt:h.mainImage.name,class:"img-fluid"},null,8,r)])),_:1},8,["to"]),(0,i.Wm)(d.Transition,{name:"mini-cart-transition"},{default:(0,i.w5)((()=>[t.isHovered?((0,i.wg)(),(0,i.iD)("div",c,[(0,i._)("div",l,(0,s.zw)(t.$t("Add to cart")),1),(0,i._)("div",u,[h.hasSizes?((0,i.wg)(),(0,i.iD)("div",p,[((0,i.wg)(!0),(0,i.iD)(i.HY,null,(0,i.Ko)(a.product.sizes,(t=>((0,i.wg)(),(0,i.iD)("button",{key:t.name,type:"button",class:(0,s.C_)([{disabled:!t.availability},"btn btn-outline-dark me-2"]),onClick:e=>y.quickAddToCart(a.product,t)},(0,s.zw)(t.name),11,g)))),128))])):((0,i.wg)(),(0,i.iD)("button",{key:1,class:"btn btn-outline-dark",onClick:e[0]||(e[0]=t=>y.quickAddToCart(a.product,{name:"Unique"},!0))},(0,s.zw)(t.$t("Unique")),1))])])):(0,i.kq)("",!0)])),_:1})]),(0,i.Wm)(z,{to:{name:"product_view",params:{id:a.product.id,slug:a.product.slug,lang:t.$i18n.locale}},class:"text-decoration-none"},{default:(0,i.w5)((()=>[(0,i._)("div",m,[(0,i._)("p",f,(0,s.zw)(y.truncate(y.capitalizeLetters(a.product.name))),1),(0,i._)("div",w,[(0,i._)("div",null,[a.product.on_sale?((0,i.wg)(),(0,i.iD)("span",k,[(0,i._)("del",null,(0,s.zw)(t.$n(1*a.product.unit_price,"currency",t.$i18n.locale)),1)])):(0,i.kq)("",!0),(0,i._)("span",{class:(0,s.C_)([{"text-danger":a.product.on_sale},"fw-bold"])},(0,s.zw)(t.$n(1*a.product.get_price,"currency",t.$i18n.locale)),3)]),(0,i._)("div",null,[a.product.on_sale?((0,i.wg)(),(0,i.iD)("span",_,(0,s.zw)(y.formatAsPercentage(a.product.sale_value,!0)),1)):(0,i.kq)("",!0)])])])])),_:1},8,["to"]),(0,i._)("div",v,[a.product.on_sale?((0,i.wg)(),(0,i.j4)(C,{key:0,padding:1,width:30,"background-color":"bg-primary"},{default:(0,i.w5)((()=>[(0,i.Uk)((0,s.zw)(t.$t("Sale")),1)])),_:1})):(0,i.kq)("",!0),a.product.display_new?((0,i.wg)(),(0,i.j4)(C,{key:1,padding:1,width:30,"background-color":"bg-danger",class:"mx-2"},{default:(0,i.w5)((()=>[(0,i.Uk)((0,s.zw)(t.$t("New")),1)])),_:1})):(0,i.kq)("",!0)])],32))}var b=a(4806),h=a.n(b),z=a(8661),C=a(3006),$=a(2931),x=a(2440),A={name:"ProductCard",components:{BaseTag:$["default"]},props:{isLoading:{type:Boolean,default:!1},product:{type:Object,required:!0}},emits:["product-card-click"],setup(){const t=(0,C.L)(),{addingToCart:e,productOptions:a,quickAddToCart:i,getSessionId:d}=(0,x.Z)();return{addingToCart:e,productOptions:a,store:t,formatAsPercentage:z.JY,capitalizeLetters:z.zH,mediaUrl:z.si,truncate:z.$G,quickAddToCart:i,getSessionId:d}},data:()=>({isHovered:!1}),computed:{mainImage(){const t=h().find(this.product.images,["is_main_image",!0]);return t||this.product.images[0]},hasSizes(){return this.product.sizes.length>0}}},D=a(89);const q=(0,D.Z)(A,[["render",y],["__scopeId","data-v-fa67ec28"]]);var I=q},2931:function(t,e,a){a.r(e),a.d(e,{default:function(){return l}});var i=a(3396),d=a(7139);function s(t,e,a,s,o,n){return(0,i.wg)(),(0,i.iD)("div",{id:"tag",ref:"tag",class:(0,d.C_)([n.classes,"darken-1 text-uppercase text-white font-weight-bold rounded text-center"])},[(0,i.WI)(t.$slots,"default")],2)}var o=a(8661),n={name:"BaseTag",props:{backgroundColor:{type:String,default:"primary"},isAbsolute:{type:Boolean},left:{type:Number,default:0},padding:{type:Number,default:3},top:{type:Number,default:0},width:{type:Number,default:20}},setup(){return{formatAsPercentage:o.JY}},computed:{classes(){return[this.backgroundColor,{[`p-${this.padding}`]:!0}]}},mounted(){this.$refs.tag.style.width=this.formatAsPercentage(this.width),this.positionItem()},updated(){this.positionItem()},methods:{positionItem(){this.isAbsolute&&(this.$refs.tag.style.position="absolute",this.$refs.tag.style.top=this.formatAsPercentage(this.top),this.$refs.tag.style.left=this.formatAsPercentage(this.left))}}},r=a(89);const c=(0,r.Z)(n,[["render",s]]);var l=c}}]);
//# sourceMappingURL=78.c705473f.js.map