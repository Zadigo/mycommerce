"use strict";(self["webpackChunkfront2"]=self["webpackChunkfront2"]||[]).push([[879,655],{2655:function(e,t,a){a.r(t),a.d(t,{default:function(){return U}});var s=a(3396),o=a(9242),l=a(7139);const n={class:"col-4"},c={ref:"aside",class:"card"},i={class:"card-body"},d={key:0},r={class:"form-check"},p={class:"form-check-label",for:"gift-wrap"},m={class:"form-check mt-2"},u={class:"form-check-label",for:"donation"},y=(0,s._)("hr",{class:"my-6"},null,-1),f={class:"d-flex justify-content-between fw-bold"},h={class:"text-uppercase fs-6 fw-bold"},b=(0,s._)("h5",{class:"text-uppercase fs-6 fw-bold"},"25€",-1),_=(0,s._)("div",{class:"d-flex justify-content-between text-muted mt-2 mb-4"},[(0,s._)("h5",{class:"text-uppercase fs-6"},"Remise"),(0,s._)("h5",{class:"text-uppercase fs-6"},"25€")],-1),w={class:"d-flex justify-content-between"},v={class:"text-uppercase fw-bold"},k={class:"fw-bold"},g={key:1,class:"actions"},C=(0,s._)("hr",{class:"my-7"},null,-1),$=(0,s._)("aside",{class:"card mt-2"},[(0,s._)("div",{class:"card-body"}," payment ")],-1);function x(e,t,a,x,z,S){const D=(0,s.up)("router-link");return(0,s.wg)(),(0,s.iD)("div",n,[(0,s._)("aside",c,[(0,s._)("div",i,[a.showActions?((0,s.wg)(),(0,s.iD)("div",d,[(0,s._)("div",r,[(0,s.wy)((0,s._)("input",{id:"gift-wrap","onUpdate:modelValue":t[0]||(t[0]=t=>e.is_gift=t),class:"form-check-input",type:"checkbox",onClick:t[1]||(t[1]=t=>e.$emit("update-total","is_gift"))},null,512),[[o.vModelCheckbox,e.is_gift]]),(0,s._)("label",p,(0,l.zw)(e.$t("Please Gift Wrap my order - $6.00")),1)]),(0,s._)("div",m,[(0,s.wy)((0,s._)("input",{id:"donation","onUpdate:modelValue":t[2]||(t[2]=t=>e.donation=t),class:"form-check-input",type:"checkbox",onClick:t[3]||(t[3]=t=>e.$emit("update-total","donation"))},null,512),[[o.vModelCheckbox,e.donation]]),(0,s._)("label",u,(0,l.zw)(e.$t("Faire un don - 0.5€")),1)]),y])):(0,s.kq)("",!0),(0,s._)("div",f,[(0,s._)("h5",h,(0,l.zw)(e.$t("Subtotal")),1),b]),_,(0,s._)("div",w,[(0,s._)("h5",v,(0,l.zw)(e.$t("Total")),1),(0,s._)("h5",k,(0,l.zw)(e.$n(a.grandTotal,"currency",e.$i18n.locale)),1)]),a.showActions?((0,s.wg)(),(0,s.iD)("div",g,[C,(0,s.Wm)(D,{to:{name:"shipment_view",params:{lang:e.$i18n.locale}},class:"btn btn-block btn-primary"},{default:(0,s.w5)((()=>[(0,s.Uk)((0,l.zw)(e.$t("Checkout")),1)])),_:1},8,["to"]),(0,s.Wm)(D,{to:{name:"collection_details_view",params:{collection:"all",lang:e.$i18n.locale}},class:"btn btn-block btn-light"},{default:(0,s.w5)((()=>[(0,s.Uk)((0,l.zw)(e.$t("Continue shopping")),1)])),_:1},8,["to"])])):(0,s.kq)("",!0)])],512),$])}var z={name:"CartAside",props:{showActions:{type:Boolean,default:!0},grandTotal:{type:Number,required:!0}},emits:["update-total"],data:()=>({is_gift:!1,donation:!1})},S=a(89);const D=(0,S.Z)(z,[["render",x]]);var U=D},1879:function(e,t,a){a.r(t),a.d(t,{default:function(){return K}});var s=a(3396),o=a(7139),l=a(9242);const n={id:"shipment",class:"ecommerce-section"},c={class:"container"},i={class:"row"},d={class:"col-8"},r={key:0,class:"card mb-2"},p={class:"card-body"},m={class:"fw-bold mb-1"},u=(0,s.uE)('<p class="fw-bold">Colissimo - Livraison standard</p><p class="m-0">Lucile Pauline</p><p class="m-0">1 rue abbe de la rue</p><p class="m-0">14000 Caen</p><p class="m-0">France</p><p class="m-0">lucile@gmail.com</p>',6),y={key:0,id:"shipment-infos",class:"card"},f={class:"card-body"},h=["onUpdate:modelValue","type","autocomplete","placeholder"],b={key:1,id:"delivery-method",class:"card mt-2"},_={class:"card-body"},w={class:"fw-bold fs-5"},v=["onClick"],k={class:"card-body"},g={class:"fw-bold d-flex justify-content-between"},C=(0,s._)("span",null,"4.90€",-1),$={key:2,class:"card mt-2"},x={class:"card-body"},z={class:"fw-bold fs-5"},S=(0,s._)("p",{class:"text-muted"}," Votre paiement est sécurisé ",-1),D=(0,s._)("div",{class:"form-check"},[(0,s._)("input",{class:"form-check-input",type:"radio",name:"delivery-mode",checked:""}),(0,s._)("label",{class:"form-check-label",for:"delivery-mode"}," Carte de crédit ")],-1),U=(0,s._)("hr",{class:"my-4"},null,-1),M=(0,s._)("div",{class:"spinner-border spinner-border-sm me-2",role:"status"},[(0,s._)("span",{class:"visually-hidden"},"Loading...")],-1),V=(0,s.Uk)(" En validant ma commande, je déclare avoir pris connaissance et accepté sans réserve les "),A=(0,s.Uk)("Conditions générales de vente."),P=(0,s.Uk)(" Je reconnais avoir lu et accepté la "),W=(0,s.Uk)("Charte de confidentialité "),q=(0,s.Uk)(". ");function j(e,t,a,j,E,L){const T=(0,s.up)("router-link"),F=(0,s.up)("cart-aside-vue");return(0,s.wg)(),(0,s.iD)("section",n,[(0,s._)("div",c,[(0,s._)("div",i,[(0,s._)("div",d,[e.currentStep>=2?((0,s.wg)(),(0,s.iD)("div",r,[(0,s._)("div",p,[(0,s._)("p",m,(0,o.zw)(e.$t("Delivery between",{date1:"24/06/22",date2:"27/06/22"})),1),u,(0,s._)("button",{type:"button",class:"btn btn-info btn-sm mt-4",onClick:t[0]||(t[0]=e=>L.changeStep(1))},(0,o.zw)(e.$t("Change")),1)])])):(0,s.kq)("",!0),(0,s.Wm)(l.Transition,{name:"opacity",mode:"out-in"},{default:(0,s.w5)((()=>[1===e.currentStep?((0,s.wg)(),(0,s.iD)("div",y,[(0,s._)("div",f,[((0,s.wg)(!0),(0,s.iD)(s.HY,null,(0,s.Ko)(e.fields,(t=>((0,s.wg)(),(0,s.iD)("div",{key:t.name,class:(0,o.C_)(`col-${t.col}`)},[(0,s.wy)((0,s._)("input",{"onUpdate:modelValue":a=>e.options[t.name]=a,type:t.type,autocomplete:t.autocomplete,placeholder:t.name,class:"form-control p-2 mb-2"},null,8,h),[[l.vModelDynamic,e.options[t.name]]])],2)))),128)),(0,s._)("button",{class:"btn btn-lg btn-primary mt-2",onClick:t[1]||(t[1]=e=>L.changeStep(2))},(0,o.zw)(e.$t("Validate")),1)])])):2===e.currentStep?((0,s.wg)(),(0,s.iD)("div",b,[(0,s._)("div",_,[(0,s._)("p",w,(0,o.zw)(e.$t("Choose your delivery method")),1),((0,s.wg)(!0),(0,s.iD)(s.HY,null,(0,s.Ko)(e.deliveryMethods,((t,a)=>((0,s.wg)(),(0,s.iD)("a",{key:a,href:"",class:(0,o.C_)([{border:t===e.options.delivery_mode},"card shadow-sm text-dark my-2"]),onClick:(0,l.withModifiers)((a=>e.options.delivery_mode=t),["prevent"])},[(0,s._)("div",k,[(0,s._)("p",g,[(0,s._)("span",null,(0,o.zw)(t),1),C]),(0,s._)("p",null,(0,o.zw)(e.$t("Delivery between",{date1:"24/06/22",date2:"27/06/22"})),1)])],10,v)))),128)),(0,s._)("button",{class:"btn btn-lg btn-primary text-right mt-2",onClick:t[2]||(t[2]=e=>L.changeStep(3))},(0,o.zw)(e.$t("Passer commande")),1)])])):3===e.currentStep?((0,s.wg)(),(0,s.iD)("div",$,[(0,s._)("div",x,[(0,s._)("p",z,(0,o.zw)(e.$t("Choose a payment method")),1),S,D,U,(0,s._)("button",{class:"btn btn-lg btn-block btn-primary my-3",onClick:t[3]||(t[3]=(...e)=>L.completePayment&&L.completePayment(...e))},[M,(0,s.Uk)(" "+(0,o.zw)(e.$t("Pay"))+" - $123 ",1)]),(0,s._)("p",null,[V,(0,s.Wm)(T,{to:{name:"shop_view"}},{default:(0,s.w5)((()=>[A])),_:1})]),(0,s._)("p",null,[P,(0,s.Wm)(T,{to:{name:"shop_view"}},{default:(0,s.w5)((()=>[W])),_:1}),q])])])):(0,s.kq)("",!0)])),_:1})]),(0,s.Wm)(F,{"grand-total":20,"show-actions":!1})])])])}var E=a(2655),L=a(3006),T={name:"ShipmentView",components:{CartAsideVue:E["default"]},setup(){var e=(0,L.L)();return{store:e}},data:()=>({currentStep:1,options:{delivery_mode:"Colissimo - Standard"},paymentMethod:null,fields:[],deliveryMethods:["Colissimo - Standard","Colissimo - Standard2"],processing:!1}),beforeMount(){var e=[{name:"email",type:"email",autocomplete:"email",col:12},{name:"lastname",type:"text",autocomplete:"given-name",col:6},{name:"firstname",type:"text",autocomplete:"family-name",col:6},{name:"address",type:"text",autocomplete:"address-level-1",col:12},{name:"zip_code",type:"text",autocomplete:"email",col:12},{name:"city",type:"text",autocomplete:"address-level-2",col:12},{name:"country",type:"text",autocomplete:"country",col:12},{name:"telephone",type:"tel",autocomplete:"tel",col:12}];e.forEach((e=>{this.options[e.name]=null})),this.fields=e},methods:{async completePayment(){try{const e={session_id:this.localStorage.cart.session_id,...this.options},t=await this.$http.post("cart/payment",e);t.data.state?this.$router.push({name:"success_page_view",query:{token:t.data.reference},params:{lang:this.$i18n.locale}}):this.store.addErrorMessage("V-AX-PA: Could not complete payment")}catch(e){this.store.addErrorMessage("V-AX-PA: Could not complete payment")}},changeStep(e){this.currentStep=e}}},F=a(89);const H=(0,F.Z)(T,[["render",j]]);var K=H}}]);
//# sourceMappingURL=879.00e1d943.js.map