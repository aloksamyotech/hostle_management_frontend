"use strict";(self.webpackChunkberry_free_material_react_cra=self.webpackChunkberry_free_material_react_cra||[]).push([[488],{84488:function(t,e,n){n.d(e,{Z:function(){return O}});var r=n(63366),a=n(87462),i=n(47313),o=n(2197),s=n(30686),l=n(8007);function h(t){return String(t).match(/[\d.\-+]*\s*(.*)/)[1]||""}function u(t){return parseFloat(t)}var c=n(17551),d=n(17592),f=n(77342),p=n(14363),g=n(1167);function m(t){return(0,g.ZP)("MuiSkeleton",t)}(0,p.Z)("MuiSkeleton",["root","text","rectangular","rounded","circular","pulse","wave","withChildren","fitContent","heightAuto"]);var v=n(46417);const b=["animation","className","component","height","style","variant","width"];let w,y,x,$,k=t=>t;const C=(0,s.F4)(w||(w=k`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  100% {
    opacity: 1;
  }
`)),Z=(0,s.F4)(y||(y=k`
  0% {
    transform: translateX(-100%);
  }

  50% {
    /* +0.5s of delay between each loop */
    transform: translateX(100%);
  }

  100% {
    transform: translateX(100%);
  }
`)),S=(0,d.ZP)("span",{name:"MuiSkeleton",slot:"Root",overridesResolver:(t,e)=>{const{ownerState:n}=t;return[e.root,e[n.variant],!1!==n.animation&&e[n.animation],n.hasChildren&&e.withChildren,n.hasChildren&&!n.width&&e.fitContent,n.hasChildren&&!n.height&&e.heightAuto]}})((t=>{let{theme:e,ownerState:n}=t;const r=h(e.shape.borderRadius)||"px",i=u(e.shape.borderRadius);return(0,a.Z)({display:"block",backgroundColor:e.vars?e.vars.palette.Skeleton.bg:(0,c.Fq)(e.palette.text.primary,"light"===e.palette.mode?.11:.13),height:"1.2em"},"text"===n.variant&&{marginTop:0,marginBottom:0,height:"auto",transformOrigin:"0 55%",transform:"scale(1, 0.60)",borderRadius:`${i}${r}/${Math.round(i/.6*10)/10}${r}`,"&:empty:before":{content:'"\\00a0"'}},"circular"===n.variant&&{borderRadius:"50%"},"rounded"===n.variant&&{borderRadius:(e.vars||e).shape.borderRadius},n.hasChildren&&{"& > *":{visibility:"hidden"}},n.hasChildren&&!n.width&&{maxWidth:"fit-content"},n.hasChildren&&!n.height&&{height:"auto"})}),(t=>{let{ownerState:e}=t;return"pulse"===e.animation&&(0,s.iv)(x||(x=k`
      animation: ${0} 2s ease-in-out 0.5s infinite;
    `),C)}),(t=>{let{ownerState:e,theme:n}=t;return"wave"===e.animation&&(0,s.iv)($||($=k`
      position: relative;
      overflow: hidden;

      /* Fix bug in Safari https://bugs.webkit.org/show_bug.cgi?id=68196 */
      -webkit-mask-image: -webkit-radial-gradient(white, black);

      &::after {
        animation: ${0} 2s linear 0.5s infinite;
        background: linear-gradient(
          90deg,
          transparent,
          ${0},
          transparent
        );
        content: '';
        position: absolute;
        transform: translateX(-100%); /* Avoid flash during server-side hydration */
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;
      }
    `),Z,(n.vars||n).palette.action.hover)}));var O=i.forwardRef((function(t,e){const n=(0,f.Z)({props:t,name:"MuiSkeleton"}),{animation:i="pulse",className:s,component:h="span",height:u,style:c,variant:d="text",width:p}=n,g=(0,r.Z)(n,b),w=(0,a.Z)({},n,{animation:i,component:h,variant:d,hasChildren:Boolean(g.children)}),y=(t=>{const{classes:e,variant:n,animation:r,hasChildren:a,width:i,height:o}=t,s={root:["root",n,r,a&&"withChildren",a&&!i&&"fitContent",a&&!o&&"heightAuto"]};return(0,l.Z)(s,m,e)})(w);return(0,v.jsx)(S,(0,a.Z)({as:h,ref:e,className:(0,o.Z)(y.root,s),ownerState:w},g,{style:(0,a.Z)({width:p,height:u},c)}))}))},17551:function(t,e,n){n.d(e,{$n:function(){return u},Fq:function(){return l},_j:function(){return h}});var r=n(43491),a=n(3753);function i(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1;return(0,a.Z)(t,e,n)}function o(t){if(t.type)return t;if("#"===t.charAt(0))return o(function(t){t=t.slice(1);const e=new RegExp(`.{1,${t.length>=6?2:1}}`,"g");let n=t.match(e);return n&&1===n[0].length&&(n=n.map((t=>t+t))),n?`rgb${4===n.length?"a":""}(${n.map(((t,e)=>e<3?parseInt(t,16):Math.round(parseInt(t,16)/255*1e3)/1e3)).join(", ")})`:""}(t));const e=t.indexOf("("),n=t.substring(0,e);if(-1===["rgb","rgba","hsl","hsla","color"].indexOf(n))throw new Error((0,r.Z)(9,t));let a,i=t.substring(e+1,t.length-1);if("color"===n){if(i=i.split(" "),a=i.shift(),4===i.length&&"/"===i[3].charAt(0)&&(i[3]=i[3].slice(1)),-1===["srgb","display-p3","a98-rgb","prophoto-rgb","rec-2020"].indexOf(a))throw new Error((0,r.Z)(10,a))}else i=i.split(",");return i=i.map((t=>parseFloat(t))),{type:n,values:i,colorSpace:a}}function s(t){const{type:e,colorSpace:n}=t;let{values:r}=t;return-1!==e.indexOf("rgb")?r=r.map(((t,e)=>e<3?parseInt(t,10):t)):-1!==e.indexOf("hsl")&&(r[1]=`${r[1]}%`,r[2]=`${r[2]}%`),r=-1!==e.indexOf("color")?`${n} ${r.join(" ")}`:`${r.join(", ")}`,`${e}(${r})`}function l(t,e){return t=o(t),e=i(e),"rgb"!==t.type&&"hsl"!==t.type||(t.type+="a"),"color"===t.type?t.values[3]=`/${e}`:t.values[3]=e,s(t)}function h(t,e){if(t=o(t),e=i(e),-1!==t.type.indexOf("hsl"))t.values[2]*=1-e;else if(-1!==t.type.indexOf("rgb")||-1!==t.type.indexOf("color"))for(let n=0;n<3;n+=1)t.values[n]*=1-e;return s(t)}function u(t,e){if(t=o(t),e=i(e),-1!==t.type.indexOf("hsl"))t.values[2]+=(100-t.values[2])*e;else if(-1!==t.type.indexOf("rgb"))for(let n=0;n<3;n+=1)t.values[n]+=(255-t.values[n])*e;else if(-1!==t.type.indexOf("color"))for(let n=0;n<3;n+=1)t.values[n]+=(1-t.values[n])*e;return s(t)}}}]);