import{SvelteComponent as e,init as t,safe_not_equal as n,create_component as r,space as o,mount_component as m,insert as $,listen as s,noop as f,transition_in as a,transition_out as g,destroy_component as i,detach as p,component_subscribe as l,globals as w,set_store_value as j}from"../node_modules/svelte/internal/index.mjs.js";import d from"./Components/Logo.svelte.js";import u from"./Components/Title.svelte.js";import v from"./Components/Intro.svelte.js";import C from"./Components/Interpretation.svelte.js";import c from"./Components/Resources.svelte.js";import h from"./Components/GradientDescent.svelte.js";import x from"./Components/MeanSquaredError.svelte.js";import b from"./Components/ScrollyRegression.svelte.js";import E from"./Components/Assumptions.svelte.js";import I from"./Components/Extensions.svelte.js";import R from"./Components/ClosedForm.svelte.js";import{mobile as S,margin as q}from"./store.js";const{window:y}=w;function z(e){let t,n,l,w,j,S,q,z,A,D,F,G,L,M,T,W,_,k,B,H,J,K,N,O;return t=new d({}),l=new u({}),j=new v({}),q=new b({}),A=new x({}),F=new h({}),L=new R({}),T=new C({}),_=new E({}),B=new I({}),J=new c({}),{c(){r(t.$$.fragment),n=o(),r(l.$$.fragment),w=o(),r(j.$$.fragment),S=o(),r(q.$$.fragment),z=o(),r(A.$$.fragment),D=o(),r(F.$$.fragment),G=o(),r(L.$$.fragment),M=o(),r(T.$$.fragment),W=o(),r(_.$$.fragment),k=o(),r(B.$$.fragment),H=o(),r(J.$$.fragment)},m(r,o){m(t,r,o),$(r,n,o),m(l,r,o),$(r,w,o),m(j,r,o),$(r,S,o),m(q,r,o),$(r,z,o),m(A,r,o),$(r,D,o),m(F,r,o),$(r,G,o),m(L,r,o),$(r,M,o),m(T,r,o),$(r,W,o),m(_,r,o),$(r,k,o),m(B,r,o),$(r,H,o),m(J,r,o),K=!0,N||(O=s(y,"resize",e[0]),N=!0)},p:f,i(e){K||(a(t.$$.fragment,e),a(l.$$.fragment,e),a(j.$$.fragment,e),a(q.$$.fragment,e),a(A.$$.fragment,e),a(F.$$.fragment,e),a(L.$$.fragment,e),a(T.$$.fragment,e),a(_.$$.fragment,e),a(B.$$.fragment,e),a(J.$$.fragment,e),K=!0)},o(e){g(t.$$.fragment,e),g(l.$$.fragment,e),g(j.$$.fragment,e),g(q.$$.fragment,e),g(A.$$.fragment,e),g(F.$$.fragment,e),g(L.$$.fragment,e),g(T.$$.fragment,e),g(_.$$.fragment,e),g(B.$$.fragment,e),g(J.$$.fragment,e),K=!1},d(e){i(t,e),e&&p(n),i(l,e),e&&p(w),i(j,e),e&&p(S),i(q,e),e&&p(z),i(A,e),e&&p(D),i(F,e),e&&p(G),i(L,e),e&&p(M),i(T,e),e&&p(W),i(_,e),e&&p(k),i(B,e),e&&p(H),i(J,e),N=!1,O()}}}function A(e,t,n){let r,o;function m(){j(S,r=window.innerWidth<=950,r),j(q,o=r?{top:20,bottom:18,left:60,right:30}:{top:20,bottom:18,left:95,right:30},o)}return l(e,S,(e=>n(1,r=e))),l(e,q,(e=>n(2,o=e))),m(),[m]}class D extends e{constructor(e){super(),t(this,e,A,z,n,{})}}export{D as default};