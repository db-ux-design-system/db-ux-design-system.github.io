var l={exports:{}},o={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var x;function p(){if(x)return o;x=1;var t=Symbol.for("react.transitional.element"),i=Symbol.for("react.fragment");function n(u,e,r){var s=null;if(r!==void 0&&(s=""+r),e.key!==void 0&&(s=""+e.key),"key"in e){r={};for(var a in e)a!=="key"&&(r[a]=e[a])}else r=e;return e=r.ref,{$$typeof:t,type:u,key:s,ref:e!==void 0?e:null,props:r}}return o.Fragment=i,o.jsx=n,o.jsxs=n,o}var d;function R(){return d||(d=1,l.exports=p()),l.exports}var v=R();function f(t){if(t&&t.url)return t.url.pathname.replace(/\/+$/,"");if(window&&window.location)return window.location.pathname.replace(/\/+$/,"");throw new Error("Unable to retrieve current path.")}const c=(t,i,n=50)=>{let u=0,e=t.length-1;const r=t.toLowerCase().indexOf(i.toLowerCase());return r-n>0&&(u=r-n),r+n<e&&(e=r+n),{start:u,termIndex:r,end:e}};export{f as a,c as g,v as j};
