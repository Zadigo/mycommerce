"use strict";(self["webpackChunkfront2"]=self["webpackChunkfront2"]||[]).push([[709,837,715],{9837:function(e,n,i){i.r(n),i.d(n,{default:function(){return g}});var t=i(3396),a=i(9242);const s={key:0,class:"col-12"},l=["type","autocomplete","placeholder","aria-label","onKeyup"],o={key:1,class:"col-12"},u=["type","placeholder","aria-label","onKeyup"];function r(e,n,i,r,p,d){return(0,t.wg)(),(0,t.iD)("form",{onSubmit:n[0]||(n[0]=(0,a.withModifiers)((()=>{}),["prevent"]))},[i.showLoginFields?((0,t.wg)(),(0,t.iD)("div",s,[((0,t.wg)(!0),(0,t.iD)(t.HY,null,(0,t.Ko)(i.loginFields,(n=>((0,t.wg)(),(0,t.iD)("input",{key:n.key,type:n.type,autocomplete:n.autocomplete,placeholder:e.$t(n.name),"aria-label":e.$t(n.name),class:"form-control my-2 p-2",onKeyup:e=>d.updateLoginFields(e,n)},null,40,l)))),128))])):((0,t.wg)(),(0,t.iD)("div",o,[((0,t.wg)(!0),(0,t.iD)(t.HY,null,(0,t.Ko)(i.signupFields,(n=>((0,t.wg)(),(0,t.iD)("input",{key:n.key,type:n.type,placeholder:e.$t(n.name),"aria-label":e.$t(n.name),class:"form-control my-2 p-2",onKeyup:e=>d.updateSignupFields(e,n)},null,40,u)))),128))]))],32)}var p={name:"AuthFields",props:{showLoginFields:{type:Boolean},loginFields:{type:Array,default:()=>[]},signupFields:{type:Array,default:()=>[]}},emits:["update-fields"],methods:{updateLoginFields(e,n){this.$emit("update-fields",["login",{[`${n.key}`]:e.target.value}])},updateSignupFields(e,n){this.$emit("update-fields",["signup",{[`${n.key}`]:e.target.value}])}}},d=i(89);const c=(0,d.Z)(p,[["render",r]]);var g=c},5715:function(e,n,i){i.r(n),i.d(n,{default:function(){return k}});var t=i(3396);const a={class:"row"},s={class:"col-12 my-3"},l={key:0,class:"m-0"},o=(0,t.Uk)(" Don't have an account ? "),u=(0,t.Uk)("Signup"),r={key:1,class:"my-2"},p=(0,t.Uk)(" Already have an account ? "),d=(0,t.Uk)("Login"),c={class:"m-0"},g=(0,t.Uk)(" Forgot your password ? "),m=(0,t.Uk)("Get a new one");function f(e,n,i,f,y,w){const b=(0,t.up)("router-link");return(0,t.wg)(),(0,t.iD)("div",a,[(0,t._)("div",s,[i.isLogin?((0,t.wg)(),(0,t.iD)("p",l,[o,(0,t.Wm)(b,{to:{name:"signup_view",params:{lang:e.$i18n.locale}},class:"btn-link"},{default:(0,t.w5)((()=>[u])),_:1},8,["to"])])):((0,t.wg)(),(0,t.iD)("p",r,[p,(0,t.Wm)(b,{to:{name:"login_view",params:{lang:e.$i18n.locale}},class:"btn-link"},{default:(0,t.w5)((()=>[d])),_:1},8,["to"])])),(0,t._)("p",c,[g,(0,t.Wm)(b,{to:{name:"login_view",params:{lang:e.$i18n.locale}},class:"btn-link"},{default:(0,t.w5)((()=>[m])),_:1},8,["to"])])])])}var y={name:"NavigationLinks",props:{isLogin:{type:Boolean}},emits:["signup-fields","login-fields"]},w=i(89);const b=(0,w.Z)(y,[["render",f]]);var k=b},6709:function(e,n,i){i.r(n),i.d(n,{default:function(){return k}});var t=i(3396),a=i(7139);const s={class:"card"},l={class:"card-body"},o={class:"fw-bold mb-2"},u={class:"mb-1"},r={class:"btn btn-block btn-primary"},p={class:"btn btn-block btn-primary"},d={class:"fw-bold my-3"};function c(e,n,c,g,m,f){const y=(0,t.up)("font-awesome-icon"),w=(0,t.up)("auth-fields-vue"),b=(0,t.up)("navigation-links-vue"),k=(0,t.up)("base-intro-vue");return(0,t.wg)(),(0,t.j4)(k,{image:i(126),height:"100vh"},{default:(0,t.w5)((()=>[(0,t._)("div",s,[(0,t._)("div",l,[(0,t._)("h4",o,(0,a.zw)(e.$t("Register with"))+"...",1),(0,t._)("div",u,[(0,t._)("button",r,[(0,t.Wm)(y,{icon:"fa-brands fa-google",size:"2x"})]),(0,t._)("button",p,[(0,t.Wm)(y,{icon:"fa-brands fa-facebook",size:"2x"})])]),(0,t._)("h4",d,(0,a.zw)(e.$t("Or register with")),1),(0,t.Wm)(w,{"signup-fields":g.signupFields,onUpdateFields:g.updateFields},null,8,["signup-fields","onUpdateFields"]),(0,t.Wm)(b,{"is-login":!1}),(0,t._)("button",{type:"button",class:"btn btn-lg btn-primary mt-2",onClick:n[0]||(n[0]=(...e)=>f.doSignup&&f.doSignup(...e))},[(0,t.Wm)(y,{icon:"fa-solid fa-right-to-bracket",class:"me-2"}),(0,t.Uk)(" "+(0,a.zw)(e.$t("Signup")),1)])])])])),_:1},8,["image"])}var g=i(9837),m=i(5715),f=i(6242),y={name:"LoginView",components:{AuthFieldsVue:g["default"],NavigationLinksVue:m["default"]},setup(){const{signup:e,signupFields:n,updateFields:i}=(0,f.Z)();return{signup:e,signupFields:n,updateFields:i}},methods:{doSignup(){this.signup(),this.$router.push({name:"login_view",params:{lang:"fr"}})}}},w=i(89);const b=(0,w.Z)(y,[["render",c]]);var k=b},126:function(e,n,i){e.exports=i.p+"static/img/hero4.0eda041d.jpg"}}]);
//# sourceMappingURL=709.88dc8466.js.map