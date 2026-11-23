const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./view-renderer-D-ofSLeB.js","./three.core-DJbUGl97.js"])))=>i.map(i=>d[i]);
import{$ as e,$n as t,A as n,An as r,At as i,B as a,Bn as o,C as s,Ct as c,D as l,Dn as u,Dt as d,E as f,En as p,Et as m,F as h,Fn as g,G as _,Gn as v,H as y,Hn as b,I as x,In as S,It as C,J as w,Jn as T,K as E,Kn as D,L as O,Ln as k,Lt as ee,M as A,Mt as te,N as j,Nn as M,O as ne,On as N,Ot as re,P as ie,Pn as ae,Q as P,Qn as oe,Rn as se,S as ce,St as F,T as le,Tt as ue,U as de,Un as fe,V as pe,W as me,Wn as he,X as ge,Xn as _e,Y as ve,Z as ye,Zn as be,_ as xe,_n as Se,_r as Ce,_t as we,a as Te,ar as Ee,at as I,b as De,bn as Oe,bt as ke,c as Ae,cr as je,ct as Me,d as L,dr as Ne,dt as R,er as z,et as Pe,f as B,fr as Fe,g as V,gn as Ie,gr as H,gt as U,h as W,hn as Le,hr as Re,ht as ze,i as Be,ir as Ve,it as He,jn as Ue,k as We,kn as Ge,kt as Ke,lr as qe,lt as Je,m as Ye,mn as Xe,mr as Ze,mt as Qe,n as $e,nr as et,nt as tt,o as nt,or as rt,ot as it,p as at,pn as ot,pr as st,pt as ct,q as lt,r as ut,rr as dt,rt as ft,s as pt,sr as mt,st as ht,tr as G,tt as gt,u as _t,ur as vt,ut as yt,v as bt,vt as xt,w as St,wt as Ct,x as wt,xn as Tt,xt as Et,y as Dt,yn as Ot,yt as kt,z as At,zn as jt}from"./three.core-DJbUGl97.js";(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function Mt(e,{mode:t,selected:n,totalRooms:r=7}){let i=e.wanted.filter(t=>e.errors.has(t)),a=t===`overview`?`Весь офис · готовы ${e.loaded.size} из ${r}`:`Помещение ${n}${e.has(n)?` · готово`:` · загружается…`}`,o=i.length?` · Не загрузились помещения: ${i.join(`, `)}. Повторите загрузку.`:``;return{failed:i,retry:i.length>0,text:a+o+(e.pending.size?` · подгружаю детали`:``)}}var Nt=(e,t)=>e||t<650,Pt=({wanted:e,mode:t,ready:n,loaded:r})=>!!(e&&t===`room`&&n&&r);function Ft(){let e=null,t=!1,n=null,r=null;function i(t,a){r=e.requestAnimationFrame(i),n(t,a)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function It(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var K={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},q={common:{diffuse:{value:new L(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new I},alphaMap:{value:null},alphaMapTransform:{value:new I},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new I}},envmap:{envMap:{value:null},envMapRotation:{value:new I},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new I}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new I}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new I},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new I},normalScale:{value:new z(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new I},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new I}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new I}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new I}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new L(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new G},probesMax:{value:new G},probesResolution:{value:new G}},points:{diffuse:{value:new L(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new I},alphaTest:{value:0},uvTransform:{value:new I}},sprite:{diffuse:{value:new L(16777215)},opacity:{value:1},center:{value:new z(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new I},alphaMap:{value:null},alphaMapTransform:{value:new I},alphaTest:{value:0}}},Lt={basic:{uniforms:Ze([q.common,q.specularmap,q.envmap,q.aomap,q.lightmap,q.fog]),vertexShader:K.meshbasic_vert,fragmentShader:K.meshbasic_frag},lambert:{uniforms:Ze([q.common,q.specularmap,q.envmap,q.aomap,q.lightmap,q.emissivemap,q.bumpmap,q.normalmap,q.displacementmap,q.fog,q.lights,{emissive:{value:new L(0)},envMapIntensity:{value:1}}]),vertexShader:K.meshlambert_vert,fragmentShader:K.meshlambert_frag},phong:{uniforms:Ze([q.common,q.specularmap,q.envmap,q.aomap,q.lightmap,q.emissivemap,q.bumpmap,q.normalmap,q.displacementmap,q.fog,q.lights,{emissive:{value:new L(0)},specular:{value:new L(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:K.meshphong_vert,fragmentShader:K.meshphong_frag},standard:{uniforms:Ze([q.common,q.envmap,q.aomap,q.lightmap,q.emissivemap,q.bumpmap,q.normalmap,q.displacementmap,q.roughnessmap,q.metalnessmap,q.fog,q.lights,{emissive:{value:new L(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:K.meshphysical_vert,fragmentShader:K.meshphysical_frag},toon:{uniforms:Ze([q.common,q.aomap,q.lightmap,q.emissivemap,q.bumpmap,q.normalmap,q.displacementmap,q.gradientmap,q.fog,q.lights,{emissive:{value:new L(0)}}]),vertexShader:K.meshtoon_vert,fragmentShader:K.meshtoon_frag},matcap:{uniforms:Ze([q.common,q.bumpmap,q.normalmap,q.displacementmap,q.fog,{matcap:{value:null}}]),vertexShader:K.meshmatcap_vert,fragmentShader:K.meshmatcap_frag},points:{uniforms:Ze([q.points,q.fog]),vertexShader:K.points_vert,fragmentShader:K.points_frag},dashed:{uniforms:Ze([q.common,q.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:K.linedashed_vert,fragmentShader:K.linedashed_frag},depth:{uniforms:Ze([q.common,q.displacementmap]),vertexShader:K.depth_vert,fragmentShader:K.depth_frag},normal:{uniforms:Ze([q.common,q.bumpmap,q.normalmap,q.displacementmap,{opacity:{value:1}}]),vertexShader:K.meshnormal_vert,fragmentShader:K.meshnormal_frag},sprite:{uniforms:Ze([q.sprite,q.fog]),vertexShader:K.sprite_vert,fragmentShader:K.sprite_frag},background:{uniforms:{uvTransform:{value:new I},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:K.background_vert,fragmentShader:K.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new I}},vertexShader:K.backgroundCube_vert,fragmentShader:K.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:K.cube_vert,fragmentShader:K.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:K.equirect_vert,fragmentShader:K.equirect_frag},distance:{uniforms:Ze([q.common,q.displacementmap,{referencePosition:{value:new G},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:K.distance_vert,fragmentShader:K.distance_frag},shadow:{uniforms:Ze([q.lights,q.fog,{color:{value:new L(0)},opacity:{value:1}}]),vertexShader:K.shadow_vert,fragmentShader:K.shadow_frag}};Lt.physical={uniforms:Ze([Lt.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new I},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new I},clearcoatNormalScale:{value:new z(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new I},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new I},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new I},sheen:{value:0},sheenColor:{value:new L(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new I},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new I},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new I},transmissionSamplerSize:{value:new z},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new I},attenuationDistance:{value:0},attenuationColor:{value:new L(0)},specularColor:{value:new L(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new I},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new I},anisotropyVector:{value:new z},anisotropyMap:{value:null},anisotropyMapTransform:{value:new I}}]),vertexShader:K.meshphysical_vert,fragmentShader:K.meshphysical_frag};var Rt={r:0,b:0,g:0},zt=new it,Bt=new I;Bt.set(-1,0,0,0,1,0,0,0,1);function Vt(e,t,n,r,i,a){let o=new L(0),s=i===!0?0:1,c,l,d=null,f=0,p=null;function m(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function h(t){let r=!1,i=m(t);i===null?_(o,s):i&&i.isColor&&(_(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function g(t,n){let i=m(n);i&&(i.isCubeTexture||i.mapping===306)?(l===void 0&&(l=new ht(new nt(1,1,1),new Ge({name:`BackgroundCubeMaterial`,uniforms:mt(Lt.backgroundCube.uniforms),vertexShader:Lt.backgroundCube.vertexShader,fragmentShader:Lt.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(zt.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isCubeTexture&&i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(Bt),l.material.toneMapped=B.getTransfer(i.colorSpace)!==u,(d!==i||f!==i.version||p!==e.toneMapping)&&(l.material.needsUpdate=!0,d=i,f=i.version,p=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new ht(new Ct(2,2),new Ge({name:`BackgroundMaterial`,uniforms:mt(Lt.background.uniforms),vertexShader:Lt.background.vertexShader,fragmentShader:Lt.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=B.getTransfer(i.colorSpace)!==u,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(d!==i||f!==i.version||p!==e.toneMapping)&&(c.material.needsUpdate=!0,d=i,f=i.version,p=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function _(t,r){t.getRGB(Rt,Fe(e)),n.buffers.color.setClear(Rt.r,Rt.g,Rt.b,r,a)}function v(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,_(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,_(o,s)},render:h,addToRenderList:g,dispose:v}}function Ht(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.stride,p=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function Ut(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function Wt(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&n!==1015&&!i&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(H(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`);n.reversedDepthBuffer===!0&&f===!1&&H(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function Gt(e){let t=this,n=null,r=0,i=!1,a=!1,o=new c,s=new I,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,d(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=d(e,t,0)},this.setState=function(t,o,s){let c=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||c===null||c.length===0||a&&!p)a?d(null):u();else{let e=a?0:r,t=e*4,i=m.clippingState||null;l.value=i,i=d(c,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function u(){l.value!==n&&(l.value=n,l.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function d(e,n,r,i){let a=e===null?0:e.length,c=null;if(a!==0){if(c=l.value,i!==!0||c===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(c===null||c.length<t)&&(c=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(c,n),c[n+3]=o.constant}l.value=c,l.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,c}}var Kt=4,qt=6,Jt=20,Yt=256,Xt=new Et,Zt=new L,Qt=null,$t=0,en=0,tn=!1,nn=new G,rn=new G,an=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=nn}=i;Qt=this._renderer.getRenderTarget(),$t=this._renderer.getActiveCubeFace(),en=this._renderer.getActiveMipmapLevel(),tn=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s,o),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=fn(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=dn(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Qt,$t,en),this._renderer.xr.enabled=tn,e.scissorTest=!1,cn(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Qt=this._renderer.getRenderTarget(),$t=this._renderer.getActiveCubeFace(),en=this._renderer.getActiveMipmapLevel(),tn=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:ve,minFilter:ve,generateMipmaps:!1,type:j,format:C,colorSpace:P,depthBuffer:!1},r=sn(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=sn(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=on(r)),this._blurMaterial=un(r,e,t),this._ggxMaterial=ln(r,e,t)}return r}_compileMaterial(e){let t=new ht(new Ae,e);this._renderer.compile(t,Xt)}_sceneToCubeUV(e,t,n,r,i){let a=new F(90,1,t,n),o=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],c=this._renderer,l=c.autoClear,u=c.toneMapping;c.getClearColor(Zt),c.toneMapping=0,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(r),c.clearDepth(),c.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new ht(new nt,new Me({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1})));let d=this._backgroundBox,f=d.material,p=!1,m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,p=!0):(f.color.copy(Zt),p=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x+s[t],i.y,i.z)):n===1?(a.up.set(0,0,o[t]),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y+s[t],i.z)):(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y,i.z+s[t]));let l=this._cubeSize;cn(r,n*l,t>2?l:0,l,l),c.setRenderTarget(r),p&&c.render(d,a),c.render(e,a)}c.toneMapping=u,c.autoClear=l,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=fn()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=dn());let i=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=i;let o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;cn(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,Xt)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let t=1;t<r;t++)this._applyGGXFilter(e,t-1,t);t.autoClear=n}_applyGGXFilter(e,t,n){let r=this._renderer,i=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let s=a.uniforms,c=n/(this._lodMeshes.length-1),l=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-l*l)*(c*1.25),{_lodMax:d}=this,f=this._sizeLods[n],p=3*f*(n>d-Kt?n-d+Kt:0),m=4*(this._cubeSize-f);s.envMap.value=e.texture,s.roughness.value=u,s.mipInt.value=d-t,cn(i,p,m,3*f,2*f),r.setRenderTarget(i),r.render(o,Xt),s.envMap.value=i.texture,s.roughness.value=0,s.mipInt.value=d-n,cn(e,p,m,3*f,2*f),r.setRenderTarget(e),r.render(o,Xt)}_blur(e,t,n,r){let i=this._pingPongRenderTarget,a=Math.min(r,Math.PI)/Math.SQRT2;this._blurPass(e,i,t,n,a),this._blurPass(i,e,n,n,a)}_blurPass(e,t,n,r,i){let a=this._renderer,o=this._blurMaterial,s=this._lodMeshes[r];s.material=o;let c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=i,c.mipInt.value=this._lodMax-n;let l=this._sizeLods[r];cn(t,3*l*(r>this._lodMax-Kt?r-this._lodMax+Kt:0),4*(this._cubeSize-l),3*l,2*l),a.setRenderTarget(t),a.render(s,Xt)}};function on(e){let t=[],n=[],r=e,i=e-Kt+1+qt;for(let e=0;e<i;e++){let e=2**r;t.push(e);let i=1/(e-2),a=-i,o=1+i,s=[a,a,o,a,o,o,a,a,o,o,a,o],c=new Float32Array(108),l=new Float32Array(108);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];c.set(r,18*e);for(let t=0;t<6;t++){let n=s[t*2]*2-1,r=s[t*2+1]*2-1;e===0?rn.set(1,r,n):e===1?rn.set(-n,1,-r):e===2?rn.set(-n,r,1):e===3?rn.set(-1,r,-n):e===4?rn.set(-n,-1,r):rn.set(n,r,-1),rn.toArray(l,(e*6+t)*3)}}let u=new Ae;u.setAttribute(`position`,new pt(c,3)),u.setAttribute(`outputDirection`,new pt(l,3)),n.push(new ht(u,null)),r>Kt&&r--}return{lodMeshes:n,sizeLods:t}}function sn(e,t,n){let r=new Ee(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function cn(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function ln(e,t,n){return new Ge({name:`PMREMGGXConvolution`,defines:{GGX_SAMPLES:Yt,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:pn(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function un(e,t,n){return new Ge({name:`SphericalGaussianBlur`,defines:{SAMPLES:Jt,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:pn(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function dn(){return new Ge({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:pn(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function fn(){return new Ge({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:pn(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function pn(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var mn=class extends Ee{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new V(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new nt(5,5,5),i=new Ge({name:`CubemapFromEquirect`,uniforms:mt(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new ht(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=ve),new Ye(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}};function hn(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new mn(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new an(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new an(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function gn(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&Ce(`WebGLRenderer: `+e+` extension not supported.`),t}}}function _n(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0||(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++),t}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(i===void 0)return;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else{let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}let s=new(i.count>=65535?he:fe)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function vn(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function yn(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:vt(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function bn(e,t,n){let r=new WeakMap,i=new et;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),g=new bt(h,p,m,u);g.type=We,g.needsUpdate=!0;let _=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*_;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:g,size:new z(p,m)},r.set(o,d);function v(){g.dispose(),r.delete(o),o.removeEventListener(`dispose`,v)}o.addEventListener(`dispose`,v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function xn(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var Sn={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function Cn(e,t,n,r,i,a){let o=new Ee(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),s=null,c=null,l=new Ae;l.setAttribute(`position`,new ne([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute(`uv`,new ne([0,2,0,0,2,0],2));let u=new Le({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new ht(l,u),f=new Et(-1,1,1,-1,0,1),p=null,m=null,h=!1,g,_=null,v=[],y=!1;this.setSize=function(e,t){o.setSize(e,t),s!==null&&s.setSize(e,t),c!==null&&c.setSize(e,t);for(let n=0;n<v.length;n++){let r=v[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){v=e,y=v.length>0&&v[0].isRenderPass===!0;let t=o.width,n=o.height;v.length>0&&s===null&&(s=new Ee(t,n,{type:j,depthBuffer:!1,stencilBuffer:!1}),c=new Ee(t,n,{type:j,depthBuffer:!1,stencilBuffer:!1}));for(let e=0;e<v.length;e++){let r=v[e];r.setSize&&r.setSize(t,n)}},this.begin=function(e,t){if(h||e.toneMapping===0&&v.length===0)return!1;if(_=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return y===!1&&e.setRenderTarget(o),g=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return y},this.end=function(e,t){e.toneMapping=g,h=!0;let n=o,r=s;for(let i=0;i<v.length;i++){let a=v[i];a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1&&(n=r,r=r===s?c:s))}if(p!==e.outputColorSpace||m!==e.toneMapping){p=e.outputColorSpace,m=e.toneMapping,u.defines={},B.getTransfer(p)===`srgb`&&(u.defines.SRGB_TRANSFER=``);let t=Sn[m];t&&(u.defines[t]=``),u.needsUpdate=!0}u.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(_),e.render(d,f),_=null,h=!1},this.isCompositing=function(){return h},this.dispose=function(){o.dispose(),s!==null&&s.dispose(),c!==null&&c.dispose(),l.dispose(),u.dispose()}}var wn=new jt,Tn=new ce(1,1),En=new bt,Dn=new xe,On=new V,kn=[],An=[],jn=new Float32Array(16),Mn=new Float32Array(9),Nn=new Float32Array(4);function Pn(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=kn[i];if(a===void 0&&(a=new Float32Array(i),kn[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function Fn(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function In(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function Ln(e,t){let n=An[t];n===void 0&&(n=new Int32Array(t),An[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function Rn(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function zn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Fn(n,t))return;e.uniform2fv(this.addr,t),In(n,t)}}function Bn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(Fn(n,t))return;e.uniform3fv(this.addr,t),In(n,t)}}function Vn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Fn(n,t))return;e.uniform4fv(this.addr,t),In(n,t)}}function Hn(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Fn(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),In(n,t)}else{if(Fn(n,r))return;Nn.set(r),e.uniformMatrix2fv(this.addr,!1,Nn),In(n,r)}}function Un(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Fn(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),In(n,t)}else{if(Fn(n,r))return;Mn.set(r),e.uniformMatrix3fv(this.addr,!1,Mn),In(n,r)}}function Wn(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Fn(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),In(n,t)}else{if(Fn(n,r))return;jn.set(r),e.uniformMatrix4fv(this.addr,!1,jn),In(n,r)}}function Gn(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function Kn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Fn(n,t))return;e.uniform2iv(this.addr,t),In(n,t)}}function qn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Fn(n,t))return;e.uniform3iv(this.addr,t),In(n,t)}}function Jn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Fn(n,t))return;e.uniform4iv(this.addr,t),In(n,t)}}function Yn(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function Xn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Fn(n,t))return;e.uniform2uiv(this.addr,t),In(n,t)}}function Zn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Fn(n,t))return;e.uniform3uiv(this.addr,t),In(n,t)}}function Qn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Fn(n,t))return;e.uniform4uiv(this.addr,t),In(n,t)}}function $n(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;this.type===e.SAMPLER_2D_SHADOW?(Tn.compareFunction=n.isReversedDepthBuffer()?518:515,a=Tn):a=wn,n.setTexture2D(t||a,i)}function er(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||Dn,i)}function tr(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||On,i)}function nr(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||En,i)}function rr(e){switch(e){case 5126:return Rn;case 35664:return zn;case 35665:return Bn;case 35666:return Vn;case 35674:return Hn;case 35675:return Un;case 35676:return Wn;case 5124:case 35670:return Gn;case 35667:case 35671:return Kn;case 35668:case 35672:return qn;case 35669:case 35673:return Jn;case 5125:return Yn;case 36294:return Xn;case 36295:return Zn;case 36296:return Qn;case 35678:case 36198:case 36298:case 36306:case 35682:return $n;case 35679:case 36299:case 36307:return er;case 35680:case 36300:case 36308:case 36293:return tr;case 36289:case 36303:case 36311:case 36292:return nr}}function ir(e,t){e.uniform1fv(this.addr,t)}function ar(e,t){let n=Pn(t,this.size,2);e.uniform2fv(this.addr,n)}function or(e,t){let n=Pn(t,this.size,3);e.uniform3fv(this.addr,n)}function sr(e,t){let n=Pn(t,this.size,4);e.uniform4fv(this.addr,n)}function cr(e,t){let n=Pn(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function lr(e,t){let n=Pn(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function ur(e,t){let n=Pn(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function dr(e,t){e.uniform1iv(this.addr,t)}function fr(e,t){e.uniform2iv(this.addr,t)}function pr(e,t){e.uniform3iv(this.addr,t)}function mr(e,t){e.uniform4iv(this.addr,t)}function hr(e,t){e.uniform1uiv(this.addr,t)}function gr(e,t){e.uniform2uiv(this.addr,t)}function _r(e,t){e.uniform3uiv(this.addr,t)}function vr(e,t){e.uniform4uiv(this.addr,t)}function yr(e,t,n){let r=this.cache,i=t.length,a=Ln(n,i);Fn(r,a)||(e.uniform1iv(this.addr,a),In(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?Tn:wn;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function br(e,t,n){let r=this.cache,i=t.length,a=Ln(n,i);Fn(r,a)||(e.uniform1iv(this.addr,a),In(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||Dn,a[e])}function xr(e,t,n){let r=this.cache,i=t.length,a=Ln(n,i);Fn(r,a)||(e.uniform1iv(this.addr,a),In(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||On,a[e])}function Sr(e,t,n){let r=this.cache,i=t.length,a=Ln(n,i);Fn(r,a)||(e.uniform1iv(this.addr,a),In(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||En,a[e])}function Cr(e){switch(e){case 5126:return ir;case 35664:return ar;case 35665:return or;case 35666:return sr;case 35674:return cr;case 35675:return lr;case 35676:return ur;case 5124:case 35670:return dr;case 35667:case 35671:return fr;case 35668:case 35672:return pr;case 35669:case 35673:return mr;case 5125:return hr;case 36294:return gr;case 36295:return _r;case 36296:return vr;case 35678:case 36198:case 36298:case 36306:case 35682:return yr;case 35679:case 36299:case 36307:return br;case 35680:case 36300:case 36308:case 36293:return xr;case 36289:case 36303:case 36311:case 36292:return Sr}}var wr=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=rr(t.type)}},Tr=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Cr(t.type)}},Er=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},Dr=/(\w+)(\])?(\[|\.)?/g;function Or(e,t){e.seq.push(t),e.map[t.id]=t}function kr(e,t,n){let r=e.name,i=r.length;for(Dr.lastIndex=0;;){let a=Dr.exec(r),o=Dr.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){Or(n,l===void 0?new wr(s,e,t):new Tr(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new Er(s),Or(n,e)),n=e}}}var Ar=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);kr(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function jr(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var Mr=37297,Nr=0;function Pr(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var Fr=new I;function Ir(t){B._getMatrix(Fr,B.workingColorSpace,t);let n=`mat3( ${Fr.elements.map(e=>e.toFixed(4))} )`;switch(B.getTransfer(t)){case e:return[n,`LinearTransferOETF`];case u:return[n,`sRGBTransferOETF`];default:return H(`WebGLProgram: Unsupported color space: `,t),[n,`LinearTransferOETF`]}}function Lr(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+Pr(e.getShaderSource(t),r)}return i}function Rr(e,t){let n=Ir(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,`}`].join(`
`)}var zr={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function Br(e,t){let n=zr[t];return n===void 0?(H(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var Vr=new G;function Hr(){return B.getLuminanceCoefficients(Vr),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${Vr.x.toFixed(4)}, ${Vr.y.toFixed(4)}, ${Vr.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function Ur(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(Kr).join(`
`)}function Wr(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function Gr(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function Kr(e){return e!==``}function qr(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Jr(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Yr=/^[ \t]*#include +<([\w\d./]+)>/gm;function Xr(e){return e.replace(Yr,Qr)}var Zr=new Map;function Qr(e,t){let n=K[t];if(n===void 0){let e=Zr.get(t);if(e!==void 0)n=K[e],H(`WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`)}return Xr(n)}var $r=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ei(e){return e.replace($r,ti)}function ti(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function ni(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var ri={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function ii(e){return ri[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var ai={301:`ENVMAP_TYPE_CUBE`,302:`ENVMAP_TYPE_CUBE`,306:`ENVMAP_TYPE_CUBE_UV`};function oi(e){return e.envMap===!1?`ENVMAP_TYPE_CUBE`:ai[e.envMapMode]||`ENVMAP_TYPE_CUBE`}var si={302:`ENVMAP_MODE_REFRACTION`};function ci(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:si[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var li={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function ui(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:li[e.combine]||`ENVMAP_BLENDING_NONE`}function di(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function fi(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=ii(n),l=oi(n),u=ci(n),d=ui(n),f=di(n),p=Ur(n),m=Wr(a),h=i.createProgram(),g,_,v=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(Kr).join(`
`),g.length>0&&(g+=`
`),_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(Kr).join(`
`),_.length>0&&(_+=`
`)):(g=[ni(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(Kr).join(`
`),_=[ni(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.retroreflection?`#define USE_RETROREFLECTION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.numLightProbeGrids>0?`#define USE_LIGHT_PROBES_GRID`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:K.tonemapping_pars_fragment,n.toneMapping===0?``:Br(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,K.colorspace_pars_fragment,Rr(`linearToOutputTexel`,n.outputColorSpace),Hr(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(Kr).join(`
`)),o=Xr(o),o=qr(o,n),o=Jr(o,n),s=Xr(s),s=qr(s,n),s=Jr(s,n),o=ei(o),s=ei(s),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+g,_=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+_);let y=v+g+o,b=v+_+s,x=jr(i,i.VERTEX_SHADER,y),S=jr(i,i.FRAGMENT_SHADER,b);i.attachShader(h,x),i.attachShader(h,S),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(h,0,`position`):i.bindAttribLocation(h,0,n.index0AttributeName),i.linkProgram(h);function C(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(h)||``,r=i.getShaderInfoLog(x)||``,a=i.getShaderInfoLog(S)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(h,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,h,x,S);else{let e=Lr(i,x,`vertex`),n=Lr(i,S,`fragment`);vt(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(h,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):H(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:g},fragmentShader:{log:c,prefix:_}})}i.deleteShader(x),i.deleteShader(S),w=new Ar(i,h),T=Gr(i,h)}let w;this.getUniforms=function(){return w===void 0&&C(this),w};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let E=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=i.getProgramParameter(h,Mr)),E},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(h),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=Nr++,this.cacheKey=t,this.usedTimes=1,this.program=h,this.vertexShader=x,this.fragmentShader=S,this}var pi=0,mi=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new hi(e),t.set(e,n)),n}},hi=class{constructor(e){this.id=pi++,this.code=e,this.usedTimes=0}};function gi(e){return e===1030||e===37490||e===36285}function _i(e,t,n,r,i,a){let o=new me,s=new mi,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f=r.precision,p={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function m(e){return c.add(e),e===0?`uv`:`uv${e}`}function h(i,o,l,u,h,g){let _=u.fog,v=h.geometry,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,b=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,x=t.get(i.envMap||y,b),S=x&&x.mapping===306?x.image.height:null,C=p[i.type];i.precision!==null&&(f=r.getMaxPrecision(i.precision),f!==i.precision&&H(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,f,`instead.`));let w=v.morphAttributes.position||v.morphAttributes.normal||v.morphAttributes.color,T=w===void 0?0:w.length,E=0;v.morphAttributes.position!==void 0&&(E=1),v.morphAttributes.normal!==void 0&&(E=2),v.morphAttributes.color!==void 0&&(E=3);let D,O,k,ee;if(C){let e=Lt[C];D=e.vertexShader,O=e.fragmentShader}else{D=i.vertexShader,O=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),k=e.id,ee=t.id}let A=e.getRenderTarget(),te=e.state.buffers.depth.getReversed(),j=h.isInstancedMesh===!0,M=h.isBatchedMesh===!0,ne=!!i.map,N=!!i.matcap,re=!!x,ie=!!i.aoMap,ae=!!i.lightMap,P=!!i.bumpMap&&i.wireframe===!1,oe=!!i.normalMap,se=!!i.displacementMap,ce=!!i.emissiveMap,F=!!i.metalnessMap,le=!!i.roughnessMap,ue=i.anisotropy>0,de=i.clearcoat>0,fe=i.dispersion>0,pe=i.retroreflectivity>0,me=i.iridescence>0,he=i.sheen>0,ge=i.transmission>0,_e=ue&&!!i.anisotropyMap,ve=de&&!!i.clearcoatMap,ye=de&&!!i.clearcoatNormalMap,be=de&&!!i.clearcoatRoughnessMap,xe=me&&!!i.iridescenceMap,Se=me&&!!i.iridescenceThicknessMap,Ce=he&&!!i.sheenColorMap,we=he&&!!i.sheenRoughnessMap,Te=!!i.specularMap,Ee=!!i.specularColorMap,I=!!i.specularIntensityMap,De=ge&&!!i.transmissionMap,Oe=ge&&!!i.thicknessMap,ke=!!i.gradientMap,Ae=!!i.alphaMap,je=i.alphaTest>0,Me=!!i.alphaHash,L=!!i.extensions,Ne=0;i.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(Ne=e.toneMapping);let R={shaderID:C,shaderType:i.type,shaderName:i.name,vertexShader:D,fragmentShader:O,defines:i.defines,customVertexShaderID:k,customFragmentShaderID:ee,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:f,batching:M,batchingColor:M&&h._colorsTexture!==null,instancing:j,instancingColor:j&&h.instanceColor!==null,instancingMorph:j&&h.morphTexture!==null,outputColorSpace:A===null?e.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:B.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:ne,matcap:N,envMap:re,envMapMode:re&&x.mapping,envMapCubeUVHeight:S,aoMap:ie,lightMap:ae,bumpMap:P,normalMap:oe,displacementMap:se,emissiveMap:ce,normalMapObjectSpace:oe&&i.normalMapType===1,normalMapTangentSpace:oe&&i.normalMapType===0,packedNormalMap:oe&&i.normalMapType===0&&gi(i.normalMap.format),metalnessMap:F,roughnessMap:le,anisotropy:ue,anisotropyMap:_e,clearcoat:de,clearcoatMap:ve,clearcoatNormalMap:ye,clearcoatRoughnessMap:be,dispersion:fe,retroreflection:pe,iridescence:me,iridescenceMap:xe,iridescenceThicknessMap:Se,sheen:he,sheenColorMap:Ce,sheenRoughnessMap:we,specularMap:Te,specularColorMap:Ee,specularIntensityMap:I,transmission:ge,transmissionMap:De,thicknessMap:Oe,gradientMap:ke,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:Ae,alphaTest:je,alphaHash:Me,combine:i.combine,mapUv:ne&&m(i.map.channel),aoMapUv:ie&&m(i.aoMap.channel),lightMapUv:ae&&m(i.lightMap.channel),bumpMapUv:P&&m(i.bumpMap.channel),normalMapUv:oe&&m(i.normalMap.channel),displacementMapUv:se&&m(i.displacementMap.channel),emissiveMapUv:ce&&m(i.emissiveMap.channel),metalnessMapUv:F&&m(i.metalnessMap.channel),roughnessMapUv:le&&m(i.roughnessMap.channel),anisotropyMapUv:_e&&m(i.anisotropyMap.channel),clearcoatMapUv:ve&&m(i.clearcoatMap.channel),clearcoatNormalMapUv:ye&&m(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:be&&m(i.clearcoatRoughnessMap.channel),iridescenceMapUv:xe&&m(i.iridescenceMap.channel),iridescenceThicknessMapUv:Se&&m(i.iridescenceThicknessMap.channel),sheenColorMapUv:Ce&&m(i.sheenColorMap.channel),sheenRoughnessMapUv:we&&m(i.sheenRoughnessMap.channel),specularMapUv:Te&&m(i.specularMap.channel),specularColorMapUv:Ee&&m(i.specularColorMap.channel),specularIntensityMapUv:I&&m(i.specularIntensityMap.channel),transmissionMapUv:De&&m(i.transmissionMap.channel),thicknessMapUv:Oe&&m(i.thicknessMap.channel),alphaMapUv:Ae&&m(i.alphaMap.channel),vertexTangents:!!v.attributes.tangent&&(oe||ue),vertexNormals:!!v.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!v.attributes.color&&v.attributes.color.itemSize===4,pointsUvs:h.isPoints===!0&&!!v.attributes.uv&&(ne||Ae),fog:!!_,useFog:i.fog===!0,fogExp2:!!_&&_.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||v.attributes.normal===void 0&&oe===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:te,skinning:h.isSkinnedMesh===!0,hasPositionAttribute:v.attributes.position!==void 0,morphTargets:v.morphAttributes.position!==void 0,morphNormals:v.morphAttributes.normal!==void 0,morphColors:v.morphAttributes.color!==void 0,morphTargetsCount:T,morphTextureStride:E,numSunLights:o.sun.length,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numSunLightShadows:o.sunShadowMap.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:g.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:Ne,decodeVideoTexture:ne&&i.map.isVideoTexture===!0&&B.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:ce&&i.emissiveMap.isVideoTexture===!0&&B.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:L&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(L&&i.extensions.multiDraw===!0||M)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return R.vertexUv1s=c.has(1),R.vertexUv2s=c.has(2),R.vertexUv3s=c.has(3),c.clear(),R}function g(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(_(n,t),y(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function _(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numSunLights),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numSunLightShadows),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function y(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.retroreflection&&o.enable(24),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function b(e){let t=p[e.type],n;if(t){let e=Lt[t];n=v.clone(e.uniforms)}else n=e.uniforms;return n}function x(t,n){let r=u.get(n);return r===void 0?(r=new fi(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function S(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function C(e){s.remove(e)}function w(){s.dispose()}return{getParameters:h,getProgramCacheKey:g,getUniforms:b,acquireProgram:x,releaseProgram:S,releaseShaderCache:C,programs:l,dispose:w}}function vi(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function yi(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function bi(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function xi(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l,u){u.reversedDepth===!0&&(c=-c);let d=s(e,t,a,o,c,l);a.transmission>0?r.push(d):a.transparent===!0?i.push(d):n.push(d)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t){n.length>1&&n.sort(e||yi),r.length>1&&r.sort(t||bi),i.length>1&&i.sort(t||bi)}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function Si(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new xi,e.set(t,[i])):n>=r.length?(i=new xi,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function Ci(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={direction:new G,color:new L};break;case`SpotLight`:n={position:new G,direction:new G,color:new L,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new G,color:new L,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new G,skyColor:new L,groundColor:new L};break;case`RectAreaLight`:n={color:new L,position:new G,halfWidth:new G,halfHeight:new G}}return e[t.id]=n,n}}}function wi(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new z};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new z};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new z,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var Ti=0;function Ei(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function Di(e){let t=new Ci,n=wi(),r={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new G);let i=new G,a=new it,o=new it;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0,y=0,b=0,x=0;i.sort(Ei);for(let e=0,S=i.length;e<S;e++){let S=i[e],C=S.color,w=S.intensity,T=S.distance,E=null;if(S.shadow&&S.shadow.map&&(E=S.shadow.map.texture.format===1030?S.shadow.map.texture:S.shadow.map.depthTexture||S.shadow.map.texture),S.isAmbientLight)a+=C.r*w,o+=C.g*w,s+=C.b*w;else if(S.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(S.sh.coefficients[e],w);x++}else if(S.isSunLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize.copy(e.mapSize).multiply(e.getFrameExtents()),r.sunShadow[l]=t,r.sunShadowMap[l]=E;let i=e.getViewportCount();for(let t=0;t<i;t++)r.sunShadowMatrix[u+t]=e.getMatrix(t),r.sunShadowCascade[u+t]=e._cascadeData[t];u+=i,l++}r.sun[c]=e,c++}else if(S.isDirectionalLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[d]=t,r.directionalShadowMap[d]=E,r.directionalShadowMatrix[d]=S.shadow.matrix,g++}r.directional[d]=e,d++}else if(S.isSpotLight){let e=t.get(S);e.position.setFromMatrixPosition(S.matrixWorld),e.color.copy(C).multiplyScalar(w),e.distance=T,e.coneCos=Math.cos(S.angle),e.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),e.decay=S.decay,r.spot[p]=e;let i=S.shadow;if(S.map&&(r.spotLightMap[y]=S.map,y++,i.updateMatrices(S),S.castShadow&&b++),r.spotLightMatrix[p]=i.matrix,S.castShadow){let e=n.get(S);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[p]=e,r.spotShadowMap[p]=E,v++}p++}else if(S.isRectAreaLight){let e=t.get(S);e.color.copy(C).multiplyScalar(w),e.halfWidth.set(S.width*.5,0,0),e.halfHeight.set(0,S.height*.5,0),r.rectArea[m]=e,m++}else if(S.isPointLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),e.distance=S.distance,e.decay=S.decay,S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[f]=t,r.pointShadowMap[f]=E,r.pointShadowMatrix[f]=S.shadow.matrix,_++}r.point[f]=e,f++}else if(S.isHemisphereLight){let e=t.get(S);e.skyColor.copy(S.color).multiplyScalar(w),e.groundColor.copy(S.groundColor).multiplyScalar(w),r.hemi[h]=e,h++}}m>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=q.LTC_FLOAT_1,r.rectAreaLTC2=q.LTC_FLOAT_2):(r.rectAreaLTC1=q.LTC_HALF_1,r.rectAreaLTC2=q.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let S=r.hash;(S.sunLength!==c||S.directionalLength!==d||S.pointLength!==f||S.spotLength!==p||S.rectAreaLength!==m||S.hemiLength!==h||S.numSunShadows!==l||S.numDirectionalShadows!==g||S.numPointShadows!==_||S.numSpotShadows!==v||S.numSpotMaps!==y||S.numLightProbes!==x)&&(r.sun.length=c,r.directional.length=d,r.spot.length=p,r.rectArea.length=m,r.point.length=f,r.hemi.length=h,r.sunShadow.length=l,r.sunShadowMap.length=l,r.sunShadowMatrix.length=u,r.sunShadowCascade.length=u,r.directionalShadow.length=g,r.directionalShadowMap.length=g,r.directionalShadowMatrix.length=g,r.pointShadow.length=_,r.pointShadowMap.length=_,r.pointShadowMatrix.length=_,r.spotShadow.length=v,r.spotShadowMap.length=v,r.spotLightMatrix.length=v+y-b,r.spotLightMap.length=y,r.numSpotLightShadowsWithMaps=b,r.numLightProbes=x,S.sunLength=c,S.directionalLength=d,S.pointLength=f,S.spotLength=p,S.rectAreaLength=m,S.hemiLength=h,S.numSunShadows=l,S.numDirectionalShadows=g,S.numPointShadows=_,S.numSpotShadows=v,S.numSpotMaps=y,S.numLightProbes=x,r.version=Ti++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=0,f=t.matrixWorldInverse;for(let t=0,p=e.length;t<p;t++){let p=e[t];if(p.isSunLight){let e=r.sun[n];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),n++}else if(p.isDirectionalLight){let e=r.directional[s];e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),s++}else if(p.isSpotLight){let e=r.spot[l];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),l++}else if(p.isRectAreaLight){let e=r.rectArea[u];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),o.identity(),a.copy(p.matrixWorld),a.premultiply(f),o.extractRotation(a),e.halfWidth.set(p.width*.5,0,0),e.halfHeight.set(0,p.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),u++}else if(p.isPointLight){let e=r.point[c];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),c++}else if(p.isHemisphereLight){let e=r.hemi[d];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),d++}}}return{setup:s,setupView:c,state:r}}function Oi(e){let t=new Di(e),n=[],r=[],i=[];function a(e){d.camera=e,n.length=0,r.length=0,i.length=0}function o(e){n.push(e)}function s(e){r.push(e)}function c(e){i.push(e)}function l(){t.setup(n)}function u(e){t.setupView(n,e)}let d={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:d,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:s,pushLightProbeGrid:c}}function ki(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new Oi(e),t.set(n,[a])):r>=i.length?(a=new Oi(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var Ai=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,ji=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Mi=[new G(1,0,0),new G(-1,0,0),new G(0,1,0),new G(0,-1,0),new G(0,0,1),new G(0,0,-1)],Ni=[new G(0,-1,0),new G(0,-1,0),new G(0,0,1),new G(0,0,-1),new G(0,-1,0),new G(0,-1,0)],Pi=new it,Fi=new G,Ii=new G;function Li(e,t,r){let i=new n,a=new z,o=new z,s=new et,c=new Je,l=new yt,u={},d=r.maxTextureSize,f={0:1,1:0,2:2},p=new Ge({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new z},radius:{value:4}},vertexShader:Ai,fragmentShader:ji}),m=p.clone();m.defines.HORIZONTAL_PASS=1;let h=new Ae;h.setAttribute(`position`,new pt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let g=new ht(h,p),_=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let v=this.type;this.render=function(t,n,r){if(_.enabled===!1||_.autoUpdate===!1&&_.needsUpdate===!1||t.length===0)return;this.type===2&&(H(`WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead.`),this.type=1);let c=e.getRenderTarget(),l=e.getActiveCubeFace(),u=e.getActiveMipmapLevel(),f=e.state;f.setBlending(0),f.buffers.depth.getReversed()===!0?f.buffers.color.setClear(0,0,0,0):f.buffers.color.setClear(1,1,1,1),f.buffers.depth.setTest(!0),f.setScissorTest(!1);let p=v!==this.type;p&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let c=0,l=t.length;c<l;c++){let l=t[c],u=l.shadow;if(u===void 0){H(`WebGLShadowMap:`,l,`has no shadow.`);continue}if(u.autoUpdate===!1&&u.needsUpdate===!1)continue;a.copy(u.mapSize);let m=u.getFrameExtents();a.multiply(m),o.copy(u.mapSize),(a.x>d||a.y>d)&&(a.x>d&&(o.x=Math.floor(d/m.x),a.x=o.x*m.x,u.mapSize.x=o.x),a.y>d&&(o.y=Math.floor(d/m.y),a.y=o.y*m.y,u.mapSize.y=o.y));let h=e.state.buffers.depth.getReversed();if(u.camera._reversedDepth=h,u.map===null||p===!0){if(u.map!==null&&(u.map.depthTexture!==null&&(u.map.depthTexture.dispose(),u.map.depthTexture=null),u.map.dispose()),this.type===3){if(l.isPointLight){H(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}u.map=new Ee(a.x,a.y,{format:ot,type:j,minFilter:ve,magFilter:ve,generateMipmaps:!1}),u.map.texture.name=l.name+`.shadowMap`,u.map.depthTexture=new ce(a.x,a.y,We),u.map.depthTexture.name=l.name+`.shadowMapDepth`,u.map.depthTexture.format=De,u.map.depthTexture.compareFunction=null,u.map.depthTexture.minFilter=U,u.map.depthTexture.magFilter=U}else l.isPointLight?(u.map=new mn(a.x),u.map.depthTexture=new W(a.x,_e)):(u.map=new Ee(a.x,a.y),u.map.depthTexture=new ce(a.x,a.y,_e)),u.map.depthTexture.name=l.name+`.shadowMap`,u.map.depthTexture.format=De,this.type===1?(u.map.depthTexture.compareFunction=h?518:515,u.map.depthTexture.minFilter=ve,u.map.depthTexture.magFilter=ve):(u.map.depthTexture.compareFunction=null,u.map.depthTexture.minFilter=U,u.map.depthTexture.magFilter=U);u.camera.updateProjectionMatrix()}u.map.isWebGLCubeRenderTarget!==!0&&(u.map.width!==a.x||u.map.height!==a.y)&&u.map.setSize(a.x,a.y);let g=u.map.isWebGLCubeRenderTarget?6:u.getViewportCount();l.isPointLight!==!0&&u.updateMatrices(l,r);for(let t=0;t<g;t++){let a=u.getCamera(t);if(l.isPointLight){let e=u.camera,n=u.matrix,r=l.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),Fi.setFromMatrixPosition(l.matrixWorld),e.position.copy(Fi),Ii.copy(e.position),Ii.add(Mi[t]),e.up.copy(Ni[t]),e.lookAt(Ii),e.updateMatrixWorld(),n.makeTranslation(-Fi.x,-Fi.y,-Fi.z),Pi.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),u._frustum.setFromProjectionMatrix(Pi,e.coordinateSystem,e.reversedDepth)}if(u.map.isWebGLCubeRenderTarget)e.setRenderTarget(u.map,t),e.clear();else{t===0&&(e.setRenderTarget(u.map),e.clear());let n=u.getViewport(t);s.set(o.x*n.x,o.y*n.y,o.x*n.z,o.y*n.w),f.viewport(s)}i=u.getFrustum(t),x(n,r,a,l,this.type)}u.isPointLightShadow!==!0&&this.type===3&&y(u,r),u.needsUpdate=!1}v=this.type,_.needsUpdate=!1,e.setRenderTarget(c,l,u)};function y(n,r){let i=t.update(g);p.defines.VSM_SAMPLES!==n.blurSamples&&(p.defines.VSM_SAMPLES=n.blurSamples,m.defines.VSM_SAMPLES=n.blurSamples,p.needsUpdate=!0,m.needsUpdate=!0),n.mapPass===null?n.mapPass=new Ee(a.x,a.y,{format:ot,type:j}):(n.mapPass.width!==n.map.width||n.mapPass.height!==n.map.height)&&n.mapPass.setSize(n.map.width,n.map.height),p.uniforms.shadow_pass.value=n.map.depthTexture,p.uniforms.resolution.value.set(n.map.width,n.map.height),p.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,i,p,g,null),m.uniforms.shadow_pass.value=n.mapPass.texture,m.uniforms.resolution.value.set(n.map.width,n.map.height),m.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,i,m,g,null)}function b(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?l:c,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=u[e];r===void 0&&(r={},u[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,S)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?f[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function x(n,r,a,o,s){if(n.visible===!1)return;if(n.layers.test(r.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||n.intersectsFrustum(i))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let i=t.update(n),c=n.material;if(Array.isArray(c)){let t=i.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=b(n,d,o,s);n.onBeforeShadow(e,n,r,a,i,t,u),e.renderBufferDirect(a,null,i,t,n,u),n.onAfterShadow(e,n,r,a,i,t,u)}}}else if(c.visible){let t=b(n,c,o,s);n.onBeforeShadow(e,n,r,a,i,t,null),e.renderBufferDirect(a,null,i,t,n,null),n.onAfterShadow(e,n,r,a,i,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)x(c[e],r,a,o,s)}function S(e){e.target.removeEventListener(`dispose`,S);for(let t in u){let n=u[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function Ri(e,t){function n(){let t=!1,n=new et,r=null,i=new et(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?F(e.DEPTH_TEST):le(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=Tt[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?F(e.STENCIL_TEST):le(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c=new WeakMap,l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new L(0,0,0),T=0,E=!1,D=null,O=null,k=null,ee=null,A=null,te=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),j=!1,M=0,ne=e.getParameter(e.VERSION);ne.indexOf(`WebGL`)===-1?ne.indexOf(`OpenGL ES`)!==-1&&(M=parseFloat(/^OpenGL ES (\d)/.exec(ne)[1]),j=M>=2):(M=parseFloat(/^WebGL (\d)/.exec(ne)[1]),j=M>=1);let N=null,re={},ie=e.getParameter(e.SCISSOR_BOX),ae=e.getParameter(e.VIEWPORT),P=new et().fromArray(ie),oe=new et().fromArray(ae);function se(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let ce={};ce[e.TEXTURE_2D]=se(e.TEXTURE_2D,e.TEXTURE_2D,1),ce[e.TEXTURE_CUBE_MAP]=se(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),ce[e.TEXTURE_2D_ARRAY]=se(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),ce[e.TEXTURE_3D]=se(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),F(e.DEPTH_TEST),o.setFunc(3),_e(!1),ve(1),F(e.CULL_FACE),he(0);function F(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function le(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function ue(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function de(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function fe(t){return h!==t&&(e.useProgram(t),h=t,!0)}let pe={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};pe[103]=e.MIN,pe[104]=e.MAX;let me={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function he(t,n,r,i,a,o,s,c,l,u){if(t===0)g===!0&&(le(e.BLEND),g=!1);else if(g===!1&&(F(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:vt(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:vt(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:vt(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:vt(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}}else a||=n,o||=r,s||=i,(n!==v||a!==x)&&(e.blendEquationSeparate(pe[n],pe[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(me[r],me[i],me[o],me[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function ge(t,n){t.side===2?le(e.CULL_FACE):F(e.CULL_FACE);let r=t.side===1;n&&(r=!r),_e(r),t.blending===1&&t.transparent===!1?he(0):he(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),be(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?F(e.SAMPLE_ALPHA_TO_COVERAGE):le(e.SAMPLE_ALPHA_TO_COVERAGE)}function _e(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function ve(t){t===0?le(e.CULL_FACE):(F(e.CULL_FACE),t!==O&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),O=t}function ye(t){t!==k&&(j&&e.lineWidth(t),k=t)}function be(t,n,r){t?(F(e.POLYGON_OFFSET_FILL),(ee!==n||A!==r)&&(ee=n,A=r,o.getReversed()&&(n=-n),e.polygonOffset(n,r))):le(e.POLYGON_OFFSET_FILL)}function xe(t){t?F(e.SCISSOR_TEST):le(e.SCISSOR_TEST)}function Se(t){t===void 0&&(t=e.TEXTURE0+te-1),N!==t&&(e.activeTexture(t),N=t)}function Ce(t,n,r){r===void 0&&(r=N===null?e.TEXTURE0+te-1:N);let i=re[r];i===void 0&&(i={type:void 0,texture:void 0},re[r]=i),(i.type!==t||i.texture!==n)&&(N!==r&&(e.activeTexture(r),N=r),e.bindTexture(t,n||ce[t]),i.type=t,i.texture=n)}function we(){let t=re[N];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function Te(){try{e.compressedTexImage2D(...arguments)}catch(e){vt(`WebGLState:`,e)}}function Ee(){try{e.compressedTexImage3D(...arguments)}catch(e){vt(`WebGLState:`,e)}}function I(){try{e.texSubImage2D(...arguments)}catch(e){vt(`WebGLState:`,e)}}function De(){try{e.texSubImage3D(...arguments)}catch(e){vt(`WebGLState:`,e)}}function Oe(){try{e.compressedTexSubImage2D(...arguments)}catch(e){vt(`WebGLState:`,e)}}function ke(){try{e.compressedTexSubImage3D(...arguments)}catch(e){vt(`WebGLState:`,e)}}function Ae(){try{e.texStorage2D(...arguments)}catch(e){vt(`WebGLState:`,e)}}function je(){try{e.texStorage3D(...arguments)}catch(e){vt(`WebGLState:`,e)}}function Me(){try{e.texImage2D(...arguments)}catch(e){vt(`WebGLState:`,e)}}function Ne(){try{e.texImage3D(...arguments)}catch(e){vt(`WebGLState:`,e)}}function R(t){return d[t]===void 0?e.getParameter(t):d[t]}function z(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function Pe(t){P.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),P.copy(t))}function B(t){oe.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),oe.copy(t))}function Fe(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function V(t,n){let r=l.get(n).get(t);c.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),c.set(n,r))}function Ie(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},N=null,re={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new L(0,0,0),T=0,E=!1,D=null,O=null,k=null,ee=null,A=null,P.set(0,0,e.canvas.width,e.canvas.height),oe.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:F,disable:le,bindFramebuffer:ue,drawBuffers:de,useProgram:fe,setBlending:he,setMaterial:ge,setFlipSided:_e,setCullFace:ve,setLineWidth:ye,setPolygonOffset:be,setScissorTest:xe,activeTexture:Se,bindTexture:Ce,unbindTexture:we,compressedTexImage2D:Te,compressedTexImage3D:Ee,texImage2D:Me,texImage3D:Ne,pixelStorei:z,getParameter:R,updateUBOMapping:Fe,uniformBlockBinding:V,texStorage2D:Ae,texStorage3D:je,texSubImage2D:I,texSubImage3D:De,compressedTexSubImage2D:Oe,compressedTexSubImage3D:ke,scissor:Pe,viewport:B,reset:Ie}}function zi(t,n,r,i,a,o,s){let c=n.has(`WEBGL_multisampled_render_to_texture`)?n.get(`WEBGL_multisampled_render_to_texture`):null,l=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),u=new z,d=new WeakMap,f=new Set,p,m=new WeakMap,h=!1;try{h=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function g(e,t){return h?new OffscreenCanvas(e,t):qe(`canvas`)}function _(e,t,n){let r=1,i=Ae(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);p===void 0&&(p=g(n,a));let o=t?g(n,a):p;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),H(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&H(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function v(e){return e.generateMipmaps}function y(e){t.generateMipmap(e)}function b(e){return e.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:e.isWebGL3DRenderTarget?t.TEXTURE_3D:e.isWebGLArrayRenderTarget||e.isCompressedArrayTexture?t.TEXTURE_2D_ARRAY:t.TEXTURE_2D}function x(r,i,a,o,s,c=!1){if(r!==null){if(t[r]!==void 0)return t[r];H(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+r+`'`)}let l;o&&(l=n.get(`EXT_texture_norm16`),l||H(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let u=i;if(i===t.RED&&(a===t.FLOAT&&(u=t.R32F),a===t.HALF_FLOAT&&(u=t.R16F),a===t.UNSIGNED_BYTE&&(u=t.R8),a===t.UNSIGNED_SHORT&&l&&(u=l.R16_EXT),a===t.SHORT&&l&&(u=l.R16_SNORM_EXT)),i===t.RED_INTEGER&&(a===t.UNSIGNED_BYTE&&(u=t.R8UI),a===t.UNSIGNED_SHORT&&(u=t.R16UI),a===t.UNSIGNED_INT&&(u=t.R32UI),a===t.BYTE&&(u=t.R8I),a===t.SHORT&&(u=t.R16I),a===t.INT&&(u=t.R32I)),i===t.RG&&(a===t.FLOAT&&(u=t.RG32F),a===t.HALF_FLOAT&&(u=t.RG16F),a===t.UNSIGNED_BYTE&&(u=t.RG8),a===t.UNSIGNED_SHORT&&l&&(u=l.RG16_EXT),a===t.SHORT&&l&&(u=l.RG16_SNORM_EXT)),i===t.RG_INTEGER&&(a===t.UNSIGNED_BYTE&&(u=t.RG8UI),a===t.UNSIGNED_SHORT&&(u=t.RG16UI),a===t.UNSIGNED_INT&&(u=t.RG32UI),a===t.BYTE&&(u=t.RG8I),a===t.SHORT&&(u=t.RG16I),a===t.INT&&(u=t.RG32I)),i===t.RGB_INTEGER&&(a===t.UNSIGNED_BYTE&&(u=t.RGB8UI),a===t.UNSIGNED_SHORT&&(u=t.RGB16UI),a===t.UNSIGNED_INT&&(u=t.RGB32UI),a===t.BYTE&&(u=t.RGB8I),a===t.SHORT&&(u=t.RGB16I),a===t.INT&&(u=t.RGB32I)),i===t.RGBA_INTEGER&&(a===t.UNSIGNED_BYTE&&(u=t.RGBA8UI),a===t.UNSIGNED_SHORT&&(u=t.RGBA16UI),a===t.UNSIGNED_INT&&(u=t.RGBA32UI),a===t.BYTE&&(u=t.RGBA8I),a===t.SHORT&&(u=t.RGBA16I),a===t.INT&&(u=t.RGBA32I)),i===t.RGB&&(a===t.UNSIGNED_SHORT&&l&&(u=l.RGB16_EXT),a===t.SHORT&&l&&(u=l.RGB16_SNORM_EXT),a===t.UNSIGNED_INT_5_9_9_9_REV&&(u=t.RGB9_E5),a===t.UNSIGNED_INT_10F_11F_11F_REV&&(u=t.R11F_G11F_B10F)),i===t.RGBA){let n=c?e:B.getTransfer(s);a===t.FLOAT&&(u=t.RGBA32F),a===t.HALF_FLOAT&&(u=t.RGBA16F),a===t.UNSIGNED_BYTE&&(u=n===`srgb`?t.SRGB8_ALPHA8:t.RGBA8),a===t.UNSIGNED_SHORT&&l&&(u=l.RGBA16_EXT),a===t.SHORT&&l&&(u=l.RGBA16_SNORM_EXT),a===t.UNSIGNED_SHORT_4_4_4_4&&(u=t.RGBA4),a===t.UNSIGNED_SHORT_5_5_5_1&&(u=t.RGB5_A1)}return(u===t.R16F||u===t.R32F||u===t.RG16F||u===t.RG32F||u===t.RGBA16F||u===t.RGBA32F)&&n.get(`EXT_color_buffer_float`),u}function S(e,n){let r;return e?n===null||n===1014||n===1020?r=t.DEPTH24_STENCIL8:n===1015?r=t.DEPTH32F_STENCIL8:n===1012&&(r=t.DEPTH24_STENCIL8,H(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=t.DEPTH_COMPONENT24:n===1015?r=t.DEPTH_COMPONENT32F:n===1012&&(r=t.DEPTH_COMPONENT16),r}function C(e,t){return v(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function w(e){let t=e.target;t.removeEventListener(`dispose`,w),E(t),t.isVideoTexture&&d.delete(t),t.isHTMLTexture&&f.delete(t)}function T(e){let t=e.target;t.removeEventListener(`dispose`,T),O(t)}function E(e){let t=i.get(e);if(t.__webglInit===void 0)return;let n=e.source,r=m.get(n);if(r){let i=r[t.__cacheKey];i.usedTimes--,i.usedTimes===0&&D(e),Object.keys(r).length===0&&m.delete(n)}i.remove(e)}function D(e){let n=i.get(e);t.deleteTexture(n.__webglTexture);let r=e.source,a=m.get(r);delete a[n.__cacheKey],s.memory.textures--}function O(e){let n=i.get(e);if(e.depthTexture&&(e.depthTexture.dispose(),i.remove(e.depthTexture)),e.isWebGLCubeRenderTarget)for(let e=0;e<6;e++){if(Array.isArray(n.__webglFramebuffer[e]))for(let r=0;r<n.__webglFramebuffer[e].length;r++)t.deleteFramebuffer(n.__webglFramebuffer[e][r]);else t.deleteFramebuffer(n.__webglFramebuffer[e]);n.__webglDepthbuffer&&t.deleteRenderbuffer(n.__webglDepthbuffer[e])}else{if(Array.isArray(n.__webglFramebuffer))for(let e=0;e<n.__webglFramebuffer.length;e++)t.deleteFramebuffer(n.__webglFramebuffer[e]);else t.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&t.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&t.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let e=0;e<n.__webglColorRenderbuffer.length;e++)n.__webglColorRenderbuffer[e]&&t.deleteRenderbuffer(n.__webglColorRenderbuffer[e]);n.__webglDepthRenderbuffer&&t.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let r=e.textures;for(let e=0,n=r.length;e<n;e++){let n=i.get(r[e]);n.__webglTexture&&(t.deleteTexture(n.__webglTexture),s.memory.textures--),i.remove(r[e])}i.remove(e)}let k=0;function ee(){k=0}function A(){return k}function te(e){k=e}function j(){let e=k;return e>=a.maxTextures&&H(`WebGLTextures: Trying to use `+(e+1)+` texture units while this GPU supports only `+a.maxTextures),k+=1,e}function M(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function ne(e,n){let a=i.get(e);if(e.isVideoTexture&&De(e),e.isRenderTargetTexture===!1&&e.isExternalTexture!==!0&&e.version>0&&a.__version!==e.version){let t=e.image;if(t===null)H(`WebGLRenderer: Texture marked for update but no image data found.`);else if(t.complete===!1)H(`WebGLRenderer: Texture marked for update but image is incomplete`);else{ue(a,e,n);return}}else e.isExternalTexture&&(a.__webglTexture=e.sourceTexture?e.sourceTexture:null);r.bindTexture(t.TEXTURE_2D,a.__webglTexture,t.TEXTURE0+n)}function N(e,n){let a=i.get(e);e.isRenderTargetTexture===!1&&e.version>0&&a.__version!==e.version?ue(a,e,n):(e.isExternalTexture&&(a.__webglTexture=e.sourceTexture?e.sourceTexture:null),r.bindTexture(t.TEXTURE_2D_ARRAY,a.__webglTexture,t.TEXTURE0+n))}function re(e,n){let a=i.get(e);e.isRenderTargetTexture===!1&&e.version>0&&a.__version!==e.version?ue(a,e,n):r.bindTexture(t.TEXTURE_3D,a.__webglTexture,t.TEXTURE0+n)}function ie(e,n){let a=i.get(e);e.isCubeDepthTexture!==!0&&e.version>0&&a.__version!==e.version?de(a,e,n):r.bindTexture(t.TEXTURE_CUBE_MAP,a.__webglTexture,t.TEXTURE0+n)}let ae={[Oe]:t.REPEAT,[_t]:t.CLAMP_TO_EDGE,[ze]:t.MIRRORED_REPEAT},P={[U]:t.NEAREST,[xt]:t.NEAREST_MIPMAP_NEAREST,[we]:t.NEAREST_MIPMAP_LINEAR,[ve]:t.LINEAR,[ye]:t.LINEAR_MIPMAP_NEAREST,[ge]:t.LINEAR_MIPMAP_LINEAR},oe={512:t.NEVER,519:t.ALWAYS,513:t.LESS,515:t.LEQUAL,514:t.EQUAL,518:t.GEQUAL,516:t.GREATER,517:t.NOTEQUAL};function se(e,r){if(r.type===1015&&n.has(`OES_texture_float_linear`)===!1&&(r.magFilter===1006||r.magFilter===1007||r.magFilter===1005||r.magFilter===1008||r.minFilter===1006||r.minFilter===1007||r.minFilter===1005||r.minFilter===1008)&&H(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),t.texParameteri(e,t.TEXTURE_WRAP_S,ae[r.wrapS]),t.texParameteri(e,t.TEXTURE_WRAP_T,ae[r.wrapT]),(e===t.TEXTURE_3D||e===t.TEXTURE_2D_ARRAY)&&t.texParameteri(e,t.TEXTURE_WRAP_R,ae[r.wrapR]),t.texParameteri(e,t.TEXTURE_MAG_FILTER,P[r.magFilter]),t.texParameteri(e,t.TEXTURE_MIN_FILTER,P[r.minFilter]),r.compareFunction&&(t.texParameteri(e,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(e,t.TEXTURE_COMPARE_FUNC,oe[r.compareFunction])),n.has(`EXT_texture_filter_anisotropic`)===!0){if(r.magFilter===1003||r.minFilter!==1005&&r.minFilter!==1008||r.type===1015&&n.has(`OES_texture_float_linear`)===!1)return;if(r.anisotropy>1||i.get(r).__currentAnisotropy){let o=n.get(`EXT_texture_filter_anisotropic`);t.texParameterf(e,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(r.anisotropy,a.getMaxAnisotropy())),i.get(r).__currentAnisotropy=r.anisotropy}}}function ce(e,n){let r=!1;e.__webglInit===void 0&&(e.__webglInit=!0,n.addEventListener(`dispose`,w));let i=n.source,a=m.get(i);a===void 0&&(a={},m.set(i,a));let o=M(n);if(o!==e.__cacheKey){a[o]===void 0&&(a[o]={texture:t.createTexture(),usedTimes:0},s.memory.textures++,r=!0),a[o].usedTimes++;let i=a[e.__cacheKey];i!==void 0&&(a[e.__cacheKey].usedTimes--,i.usedTimes===0&&D(n)),e.__cacheKey=o,e.__webglTexture=a[o].texture}return r}function F(e,t,n){return Math.floor(Math.floor(e/n)/t)}function le(e,n,i,a){let o=e.updateRanges;if(o.length===0)r.texSubImage2D(t.TEXTURE_2D,0,0,0,n.width,n.height,i,a,n.data);else{o.sort((e,t)=>e.start-t.start);let s=0;for(let e=1;e<o.length;e++){let t=o[s],r=o[e],i=t.start+t.count,a=F(r.start,n.width,4),c=F(t.start,n.width,4);r.start<=i+1&&a===c&&F(r.start+r.count-1,n.width,4)===a?t.count=Math.max(t.count,r.start+r.count-t.start):(++s,o[s]=r)}o.length=s+1;let c=r.getParameter(t.UNPACK_ROW_LENGTH),l=r.getParameter(t.UNPACK_SKIP_PIXELS),u=r.getParameter(t.UNPACK_SKIP_ROWS);r.pixelStorei(t.UNPACK_ROW_LENGTH,n.width);for(let e=0,s=o.length;e<s;e++){let s=o[e],c=Math.floor(s.start/4),l=Math.ceil(s.count/4),u=c%n.width,d=Math.floor(c/n.width),f=l;r.pixelStorei(t.UNPACK_SKIP_PIXELS,u),r.pixelStorei(t.UNPACK_SKIP_ROWS,d),r.texSubImage2D(t.TEXTURE_2D,0,u,d,f,1,i,a,n.data)}e.clearUpdateRanges(),r.pixelStorei(t.UNPACK_ROW_LENGTH,c),r.pixelStorei(t.UNPACK_SKIP_PIXELS,l),r.pixelStorei(t.UNPACK_SKIP_ROWS,u)}}function ue(e,n,s){let c=t.TEXTURE_2D;(n.isDataArrayTexture||n.isCompressedArrayTexture)&&(c=t.TEXTURE_2D_ARRAY),n.isData3DTexture&&(c=t.TEXTURE_3D);let l=ce(e,n),u=n.source;r.bindTexture(c,e.__webglTexture,t.TEXTURE0+s);let d=i.get(u);if(u.version!==d.__version||l===!0){if(r.activeTexture(t.TEXTURE0+s),!(typeof ImageBitmap<`u`&&n.image instanceof ImageBitmap)){let e=B.getPrimaries(B.workingColorSpace),i=n.colorSpace===``?null:B.getPrimaries(n.colorSpace),a=n.colorSpace===``||e===i?t.NONE:t.BROWSER_DEFAULT_WEBGL;r.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,n.flipY),r.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,n.premultiplyAlpha),r.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,a)}r.pixelStorei(t.UNPACK_ALIGNMENT,n.unpackAlignment);let e=_(n.image,!1,a.maxTextureSize);e=ke(n,e);let i=o.convert(n.format,n.colorSpace),p=o.convert(n.type),m=x(n.internalFormat,i,p,n.normalized,n.colorSpace,n.isVideoTexture);se(c,n);let h,g=n.mipmaps,b=n.isVideoTexture!==!0,w=d.__version===void 0||l===!0,T=u.dataReady,E=C(n,e);if(n.isDepthTexture)m=S(n.format===wt,n.type),w&&(b?r.texStorage2D(t.TEXTURE_2D,1,m,e.width,e.height):r.texImage2D(t.TEXTURE_2D,0,m,e.width,e.height,0,i,p,null));else if(n.isDataTexture){if(g.length>0){b&&w&&r.texStorage2D(t.TEXTURE_2D,E,m,g[0].width,g[0].height);for(let e=0,n=g.length;e<n;e++)h=g[e],b?T&&r.texSubImage2D(t.TEXTURE_2D,e,0,0,h.width,h.height,i,p,h.data):r.texImage2D(t.TEXTURE_2D,e,m,h.width,h.height,0,i,p,h.data);n.generateMipmaps=!1}else b?(w&&r.texStorage2D(t.TEXTURE_2D,E,m,e.width,e.height),T&&le(n,e,i,p)):r.texImage2D(t.TEXTURE_2D,0,m,e.width,e.height,0,i,p,e.data)}else if(n.isCompressedTexture){if(n.isCompressedArrayTexture){b&&w&&r.texStorage3D(t.TEXTURE_2D_ARRAY,E,m,g[0].width,g[0].height,e.depth);for(let a=0,o=g.length;a<o;a++)if(h=g[a],n.format!==1023){if(i!==null){if(b){if(T){if(n.layerUpdates.size>0){let e=Ne(h.width,h.height,n.format,n.type);for(let o of n.layerUpdates){let n=h.data.subarray(o*e/h.data.BYTES_PER_ELEMENT,(o+1)*e/h.data.BYTES_PER_ELEMENT);r.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,a,0,0,o,h.width,h.height,1,i,n)}}else r.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,a,0,0,0,h.width,h.height,e.depth,i,h.data)}}else r.compressedTexImage3D(t.TEXTURE_2D_ARRAY,a,m,h.width,h.height,e.depth,0,h.data,0,0)}else H(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else b?T&&r.texSubImage3D(t.TEXTURE_2D_ARRAY,a,0,0,0,h.width,h.height,e.depth,i,p,h.data):r.texImage3D(t.TEXTURE_2D_ARRAY,a,m,h.width,h.height,e.depth,0,i,p,h.data);n.layerUpdates.size>0&&n.clearLayerUpdates()}else{b&&w&&r.texStorage2D(t.TEXTURE_2D,E,m,g[0].width,g[0].height);for(let e=0,a=g.length;e<a;e++)h=g[e],n.format===1023?b?T&&r.texSubImage2D(t.TEXTURE_2D,e,0,0,h.width,h.height,i,p,h.data):r.texImage2D(t.TEXTURE_2D,e,m,h.width,h.height,0,i,p,h.data):i===null?H(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):b?T&&r.compressedTexSubImage2D(t.TEXTURE_2D,e,0,0,h.width,h.height,i,h.data):r.compressedTexImage2D(t.TEXTURE_2D,e,m,h.width,h.height,0,h.data)}}else if(n.isDataArrayTexture){if(b){if(w&&r.texStorage3D(t.TEXTURE_2D_ARRAY,E,m,e.width,e.height,e.depth),T){if(n.layerUpdates.size>0){let a=Ne(e.width,e.height,n.format,n.type);for(let o of n.layerUpdates){let n=e.data.subarray(o*a/e.data.BYTES_PER_ELEMENT,(o+1)*a/e.data.BYTES_PER_ELEMENT);r.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,o,e.width,e.height,1,i,p,n)}n.clearLayerUpdates()}else r.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,e.width,e.height,e.depth,i,p,e.data)}}else r.texImage3D(t.TEXTURE_2D_ARRAY,0,m,e.width,e.height,e.depth,0,i,p,e.data)}else if(n.isData3DTexture)b?(w&&r.texStorage3D(t.TEXTURE_3D,E,m,e.width,e.height,e.depth),T&&r.texSubImage3D(t.TEXTURE_3D,0,0,0,0,e.width,e.height,e.depth,i,p,e.data)):r.texImage3D(t.TEXTURE_3D,0,m,e.width,e.height,e.depth,0,i,p,e.data);else if(n.isFramebufferTexture){if(w){if(b)r.texStorage2D(t.TEXTURE_2D,E,m,e.width,e.height);else{let n=e.width,a=e.height;for(let e=0;e<E;e++)r.texImage2D(t.TEXTURE_2D,e,m,n,a,0,i,p,null),n>>=1,a>>=1}}}else if(n.isHTMLTexture){if(`texElementImage2D`in t){let r=t.canvas;if(r.hasAttribute(`layoutsubtree`)||r.setAttribute(`layoutsubtree`,`true`),e.parentNode!==r){r.appendChild(e),f.add(n),r.onpaint=e=>{let t=e.changedElements;for(let e of f)t.includes(e.image)&&(e.needsUpdate=!0)},r.requestPaint();return}if(t.texElementImage2D.length===3)t.texElementImage2D(t.TEXTURE_2D,t.RGBA8,e);else{let n=t.RGBA,r=t.RGBA,i=t.UNSIGNED_BYTE;t.texElementImage2D(t.TEXTURE_2D,0,n,r,i,e)}t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE)}}else if(g.length>0){if(b&&w){let e=Ae(g[0]);r.texStorage2D(t.TEXTURE_2D,E,m,e.width,e.height)}for(let e=0,n=g.length;e<n;e++)h=g[e],b?T&&r.texSubImage2D(t.TEXTURE_2D,e,0,0,i,p,h):r.texImage2D(t.TEXTURE_2D,e,m,i,p,h);n.generateMipmaps=!1}else if(b){if(w){let n=Ae(e);r.texStorage2D(t.TEXTURE_2D,E,m,n.width,n.height)}T&&r.texSubImage2D(t.TEXTURE_2D,0,0,0,i,p,e)}else r.texImage2D(t.TEXTURE_2D,0,m,i,p,e);v(n)&&y(c),d.__version=u.version,n.onUpdate&&n.onUpdate(n)}e.__version=n.version}function de(e,n,s){if(n.image.length!==6)return;let c=ce(e,n),l=n.source;r.bindTexture(t.TEXTURE_CUBE_MAP,e.__webglTexture,t.TEXTURE0+s);let u=i.get(l);if(l.version!==u.__version||c===!0){r.activeTexture(t.TEXTURE0+s);let e=B.getPrimaries(B.workingColorSpace),i=n.colorSpace===``?null:B.getPrimaries(n.colorSpace),d=n.colorSpace===``||e===i?t.NONE:t.BROWSER_DEFAULT_WEBGL;r.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,n.flipY),r.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,n.premultiplyAlpha),r.pixelStorei(t.UNPACK_ALIGNMENT,n.unpackAlignment),r.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,d);let f=n.isCompressedTexture||n.image[0].isCompressedTexture,p=n.image[0]&&n.image[0].isDataTexture,m=[];for(let e=0;e<6;e++)!f&&!p?m[e]=_(n.image[e],!0,a.maxCubemapSize):m[e]=p?n.image[e].image:n.image[e],m[e]=ke(n,m[e]);let h=m[0],g=o.convert(n.format,n.colorSpace),b=o.convert(n.type),S=x(n.internalFormat,g,b,n.normalized,n.colorSpace),w=n.isVideoTexture!==!0,T=u.__version===void 0||c===!0,E=l.dataReady,D=C(n,h);se(t.TEXTURE_CUBE_MAP,n);let O;if(f){w&&T&&r.texStorage2D(t.TEXTURE_CUBE_MAP,D,S,h.width,h.height);for(let e=0;e<6;e++){O=m[e].mipmaps;for(let i=0;i<O.length;i++){let a=O[i];n.format===1023?w?E&&r.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+e,i,0,0,a.width,a.height,g,b,a.data):r.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+e,i,S,a.width,a.height,0,g,b,a.data):g===null?H(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):w?E&&r.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+e,i,0,0,a.width,a.height,g,a.data):r.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+e,i,S,a.width,a.height,0,a.data)}}}else{if(O=n.mipmaps,w&&T){O.length>0&&D++;let e=Ae(m[0]);r.texStorage2D(t.TEXTURE_CUBE_MAP,D,S,e.width,e.height)}for(let e=0;e<6;e++)if(p){w?E&&r.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+e,0,0,0,m[e].width,m[e].height,g,b,m[e].data):r.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+e,0,S,m[e].width,m[e].height,0,g,b,m[e].data);for(let n=0;n<O.length;n++){let i=O[n].image[e].image;w?E&&r.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+e,n+1,0,0,i.width,i.height,g,b,i.data):r.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+e,n+1,S,i.width,i.height,0,g,b,i.data)}}else{w?E&&r.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+e,0,0,0,g,b,m[e]):r.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+e,0,S,g,b,m[e]);for(let n=0;n<O.length;n++){let i=O[n];w?E&&r.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+e,n+1,0,0,g,b,i.image[e]):r.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+e,n+1,S,g,b,i.image[e])}}}v(n)&&y(t.TEXTURE_CUBE_MAP),u.__version=l.version,n.onUpdate&&n.onUpdate(n)}e.__version=n.version}function fe(e,n,a,s,l,u){let d=o.convert(a.format,a.colorSpace),f=o.convert(a.type),p=x(a.internalFormat,d,f,a.normalized,a.colorSpace),m=i.get(n),h=i.get(a);if(h.__renderTarget=n,!m.__hasExternalTextures){let e=Math.max(1,n.width>>u),i=Math.max(1,n.height>>u);l===t.TEXTURE_3D||l===t.TEXTURE_2D_ARRAY?r.texImage3D(l,u,p,e,i,n.depth,0,d,f,null):r.texImage2D(l,u,p,e,i,0,d,f,null)}r.bindFramebuffer(t.FRAMEBUFFER,e),I(n)?c.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,s,l,h.__webglTexture,0,Ee(n)):(l===t.TEXTURE_2D||l>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&l<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,s,l,h.__webglTexture,u),r.bindFramebuffer(t.FRAMEBUFFER,null)}function pe(e,n,r){if(t.bindRenderbuffer(t.RENDERBUFFER,e),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=S(n.stencilBuffer,a),s=n.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;I(n)?c.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,Ee(n),o,n.width,n.height):r?t.renderbufferStorageMultisample(t.RENDERBUFFER,Ee(n),o,n.width,n.height):t.renderbufferStorage(t.RENDERBUFFER,o,n.width,n.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,s,t.RENDERBUFFER,e)}else{let e=n.textures;for(let i=0;i<e.length;i++){let a=e[i],s=o.convert(a.format,a.colorSpace),l=o.convert(a.type),u=x(a.internalFormat,s,l,a.normalized,a.colorSpace);I(n)?c.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,Ee(n),u,n.width,n.height):r?t.renderbufferStorageMultisample(t.RENDERBUFFER,Ee(n),u,n.width,n.height):t.renderbufferStorage(t.RENDERBUFFER,u,n.width,n.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function me(e,n,a){let s=n.isWebGLCubeRenderTarget===!0;if(r.bindFramebuffer(t.FRAMEBUFFER,e),!(n.depthTexture&&n.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let l=i.get(n.depthTexture);if(l.__renderTarget=n,l.__webglTexture&&n.depthTexture.image.width===n.width&&n.depthTexture.image.height===n.height||(n.depthTexture.image.width=n.width,n.depthTexture.image.height=n.height,n.depthTexture.needsUpdate=!0),s){if(l.__webglInit===void 0&&(l.__webglInit=!0,n.depthTexture.addEventListener(`dispose`,w)),l.__webglTexture===void 0){l.__webglTexture=t.createTexture(),r.bindTexture(t.TEXTURE_CUBE_MAP,l.__webglTexture),se(t.TEXTURE_CUBE_MAP,n.depthTexture);let e=o.convert(n.depthTexture.format),i=o.convert(n.depthTexture.type),a;n.depthTexture.format===1026?a=t.DEPTH_COMPONENT24:n.depthTexture.format===1027&&(a=t.DEPTH24_STENCIL8);for(let r=0;r<6;r++)t.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+r,0,a,n.width,n.height,0,e,i,null)}}else ne(n.depthTexture,0);let u=l.__webglTexture,d=Ee(n),f=s?t.TEXTURE_CUBE_MAP_POSITIVE_X+a:t.TEXTURE_2D,p=n.depthTexture.format===1027?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;if(n.depthTexture.format===1026)I(n)?c.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,p,f,u,0,d):t.framebufferTexture2D(t.FRAMEBUFFER,p,f,u,0);else if(n.depthTexture.format===1027)I(n)?c.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,p,f,u,0,d):t.framebufferTexture2D(t.FRAMEBUFFER,p,f,u,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function he(e){let n=i.get(e),a=e.isWebGLCubeRenderTarget===!0;if(n.__boundDepthTexture!==e.depthTexture){let t=e.depthTexture;if(n.__depthDisposeCallback&&n.__depthDisposeCallback(),t){let e=()=>{delete n.__boundDepthTexture,delete n.__depthDisposeCallback,t.removeEventListener(`dispose`,e)};t.addEventListener(`dispose`,e),n.__depthDisposeCallback=e}n.__boundDepthTexture=t}if(e.depthTexture&&!n.__autoAllocateDepthBuffer){if(a)for(let t=0;t<6;t++)me(n.__webglFramebuffer[t],e,t);else{let t=e.texture.mipmaps;t&&t.length>0?me(n.__webglFramebuffer[0],e,0):me(n.__webglFramebuffer,e,0)}}else if(a){n.__webglDepthbuffer=[];for(let i=0;i<6;i++)if(r.bindFramebuffer(t.FRAMEBUFFER,n.__webglFramebuffer[i]),n.__webglDepthbuffer[i]===void 0)n.__webglDepthbuffer[i]=t.createRenderbuffer(),pe(n.__webglDepthbuffer[i],e,!1);else{let r=e.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,a=n.__webglDepthbuffer[i];t.bindRenderbuffer(t.RENDERBUFFER,a),t.framebufferRenderbuffer(t.FRAMEBUFFER,r,t.RENDERBUFFER,a)}}else{let i=e.texture.mipmaps;if(i&&i.length>0?r.bindFramebuffer(t.FRAMEBUFFER,n.__webglFramebuffer[0]):r.bindFramebuffer(t.FRAMEBUFFER,n.__webglFramebuffer),n.__webglDepthbuffer===void 0)n.__webglDepthbuffer=t.createRenderbuffer(),pe(n.__webglDepthbuffer,e,!1);else{let r=e.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,i=n.__webglDepthbuffer;t.bindRenderbuffer(t.RENDERBUFFER,i),t.framebufferRenderbuffer(t.FRAMEBUFFER,r,t.RENDERBUFFER,i)}}r.bindFramebuffer(t.FRAMEBUFFER,null)}function _e(e,n,r){let a=i.get(e);n!==void 0&&fe(a.__webglFramebuffer,e,e.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,0),r!==void 0&&he(e)}function be(e){let n=e.texture,a=i.get(e),c=i.get(n);e.addEventListener(`dispose`,T);let l=e.textures,u=e.isWebGLCubeRenderTarget===!0,d=l.length>1;if(d||(c.__webglTexture===void 0&&(c.__webglTexture=t.createTexture()),c.__version=n.version,s.memory.textures++),u){a.__webglFramebuffer=[];for(let e=0;e<6;e++)if(n.mipmaps&&n.mipmaps.length>0){a.__webglFramebuffer[e]=[];for(let r=0;r<n.mipmaps.length;r++)a.__webglFramebuffer[e][r]=t.createFramebuffer()}else a.__webglFramebuffer[e]=t.createFramebuffer()}else{if(n.mipmaps&&n.mipmaps.length>0){a.__webglFramebuffer=[];for(let e=0;e<n.mipmaps.length;e++)a.__webglFramebuffer[e]=t.createFramebuffer()}else a.__webglFramebuffer=t.createFramebuffer();if(d)for(let e=0,n=l.length;e<n;e++){let n=i.get(l[e]);n.__webglTexture===void 0&&(n.__webglTexture=t.createTexture(),s.memory.textures++)}if(e.samples>0&&I(e)===!1){a.__webglMultisampledFramebuffer=t.createFramebuffer(),a.__webglColorRenderbuffer=[],r.bindFramebuffer(t.FRAMEBUFFER,a.__webglMultisampledFramebuffer);for(let n=0;n<l.length;n++){let r=l[n];a.__webglColorRenderbuffer[n]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,a.__webglColorRenderbuffer[n]);let i=o.convert(r.format,r.colorSpace),s=o.convert(r.type),c=x(r.internalFormat,i,s,r.normalized,r.colorSpace,e.isXRRenderTarget===!0),u=Ee(e);t.renderbufferStorageMultisample(t.RENDERBUFFER,u,c,e.width,e.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+n,t.RENDERBUFFER,a.__webglColorRenderbuffer[n])}t.bindRenderbuffer(t.RENDERBUFFER,null),e.depthBuffer&&(a.__webglDepthRenderbuffer=t.createRenderbuffer(),pe(a.__webglDepthRenderbuffer,e,!0)),r.bindFramebuffer(t.FRAMEBUFFER,null)}}if(u){r.bindTexture(t.TEXTURE_CUBE_MAP,c.__webglTexture),se(t.TEXTURE_CUBE_MAP,n);for(let r=0;r<6;r++)if(n.mipmaps&&n.mipmaps.length>0)for(let i=0;i<n.mipmaps.length;i++)fe(a.__webglFramebuffer[r][i],e,n,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+r,i);else fe(a.__webglFramebuffer[r],e,n,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+r,0);v(n)&&y(t.TEXTURE_CUBE_MAP),r.unbindTexture()}else if(d){for(let n=0,o=l.length;n<o;n++){let o=l[n],s=i.get(o),c=t.TEXTURE_2D;(e.isWebGL3DRenderTarget||e.isWebGLArrayRenderTarget)&&(c=e.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),r.bindTexture(c,s.__webglTexture),se(c,o),fe(a.__webglFramebuffer,e,o,t.COLOR_ATTACHMENT0+n,c,0),v(o)&&y(c)}r.unbindTexture()}else{let i=t.TEXTURE_2D;if((e.isWebGL3DRenderTarget||e.isWebGLArrayRenderTarget)&&(i=e.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),r.bindTexture(i,c.__webglTexture),se(i,n),n.mipmaps&&n.mipmaps.length>0)for(let r=0;r<n.mipmaps.length;r++)fe(a.__webglFramebuffer[r],e,n,t.COLOR_ATTACHMENT0,i,r);else fe(a.__webglFramebuffer,e,n,t.COLOR_ATTACHMENT0,i,0);v(n)&&y(i),r.unbindTexture()}e.depthBuffer&&he(e)}function xe(e){let t=e.textures;for(let n=0,a=t.length;n<a;n++){let a=t[n];if(v(a)){let t=b(e),n=i.get(a).__webglTexture;r.bindTexture(t,n),y(t),r.unbindTexture()}}}let Se=[],Ce=[];function Te(e){if(e.samples>0){if(I(e)===!1){let n=e.textures,a=e.width,o=e.height,s=t.COLOR_BUFFER_BIT,c=e.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,u=i.get(e),d=n.length>1;if(d)for(let e=0;e<n.length;e++)r.bindFramebuffer(t.FRAMEBUFFER,u.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+e,t.RENDERBUFFER,null),r.bindFramebuffer(t.FRAMEBUFFER,u.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+e,t.TEXTURE_2D,null,0);r.bindFramebuffer(t.READ_FRAMEBUFFER,u.__webglMultisampledFramebuffer);let f=e.texture.mipmaps;f&&f.length>0?r.bindFramebuffer(t.DRAW_FRAMEBUFFER,u.__webglFramebuffer[0]):r.bindFramebuffer(t.DRAW_FRAMEBUFFER,u.__webglFramebuffer);for(let r=0;r<n.length;r++){if(e.resolveDepthBuffer&&(e.depthBuffer&&(s|=t.DEPTH_BUFFER_BIT),e.stencilBuffer&&e.resolveStencilBuffer&&(s|=t.STENCIL_BUFFER_BIT)),d){t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,u.__webglColorRenderbuffer[r]);let e=i.get(n[r]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,e,0)}t.blitFramebuffer(0,0,a,o,0,0,a,o,s,t.NEAREST),l===!0&&(Se.length=0,Ce.length=0,Se.push(t.COLOR_ATTACHMENT0+r),e.depthBuffer&&e.storeMultisampledDepthBuffer===!1&&(Se.push(c),Ce.push(c),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,Ce)),t.invalidateFramebuffer(t.READ_FRAMEBUFFER,Se))}if(r.bindFramebuffer(t.READ_FRAMEBUFFER,null),r.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),d)for(let e=0;e<n.length;e++){r.bindFramebuffer(t.FRAMEBUFFER,u.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+e,t.RENDERBUFFER,u.__webglColorRenderbuffer[e]);let a=i.get(n[e]).__webglTexture;r.bindFramebuffer(t.FRAMEBUFFER,u.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+e,t.TEXTURE_2D,a,0)}r.bindFramebuffer(t.DRAW_FRAMEBUFFER,u.__webglMultisampledFramebuffer)}else if(e.depthBuffer&&e.storeMultisampledDepthBuffer===!1&&l){let n=e.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[n])}}}function Ee(e){return Math.min(a.maxSamples,e.samples)}function I(e){let t=i.get(e);return e.samples>0&&n.has(`WEBGL_multisampled_render_to_texture`)===!0&&t.__useRenderToTexture!==!1}function De(e){let t=s.render.frame;d.get(e)!==t&&(d.set(e,t),e.update())}function ke(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(B.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&H(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):vt(`WebGLTextures: Unsupported texture color space:`,n)),t}function Ae(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(u.width=e.naturalWidth||e.width,u.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(u.width=e.displayWidth,u.height=e.displayHeight):(u.width=e.width,u.height=e.height),u}this.allocateTextureUnit=j,this.resetTextureUnits=ee,this.getTextureUnits=A,this.setTextureUnits=te,this.setTexture2D=ne,this.setTexture2DArray=N,this.setTexture3D=re,this.setTextureCube=ie,this.rebindTextures=_e,this.setupRenderTarget=be,this.updateRenderTargetMipmap=xe,this.updateMultisampleRenderTarget=Te,this.setupDepthRenderbuffer=he,this.setupFrameBufferTexture=fe,this.useMultisampledRTT=I,this.isReversedDepthBuffer=function(){return r.buffers.depth.getReversed()}}function Bi(e,t){function n(n,r=``){let i,a=B.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var Vi=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Hi=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Ui=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new f(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Ge({vertexShader:Vi,fragmentShader:Hi,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ht(new Ct(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Wi=class extends le{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,l=null,u=null,d=null,p=null,m=null,h=typeof XRWebGLBinding<`u`,g=new Ui,_={},v=t.getContextAttributes(),y=null,b=null,x=[],S=[],w=new z,E=null,O=null,k=new F;k.viewport=new et;let ee=new F;ee.viewport=new et;let A=[k,ee],j=new ut,M=null,ne=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=x[e];return t===void 0&&(t=new rt,x[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=x[e];return t===void 0&&(t=new rt,x[e]=t),t.getGripSpace()},this.getHand=function(e){let t=x[e];return t===void 0&&(t=new rt,x[e]=t),t.getHandSpace()};function N(e){let t=S.indexOf(e.inputSource);if(t===-1)return;let n=x[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function re(){r.removeEventListener(`select`,N),r.removeEventListener(`selectstart`,N),r.removeEventListener(`selectend`,N),r.removeEventListener(`squeeze`,N),r.removeEventListener(`squeezestart`,N),r.removeEventListener(`squeezeend`,N),r.removeEventListener(`end`,re),r.removeEventListener(`inputsourceschange`,ie);for(let e=0;e<x.length;e++){let t=S[e];t!==null&&(S[e]=null,x[e].disconnect(t))}M=null,ne=null,g.reset();for(let e in _)delete _[e];if(e.setRenderTarget(y),p=null,d=null,u=null,r=null,b=null,fe.stop(),n.isPresenting=!1,e.setPixelRatio(E),e.setSize(w.width,w.height,!1),O!==null){let e=O.camera;e.fov=O.fov,e.zoom=O.zoom,e.updateProjectionMatrix(),O=null}n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&H(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&H(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return d===null?p:d},this.getBinding=function(){return u===null&&h&&(u=new XRWebGLBinding(r,t)),u},this.getFrame=function(){return m},this.getSession=function(){return r},this.setSession=async function(l){if(r=l,r!==null){if(y=e.getRenderTarget(),r.addEventListener(`select`,N),r.addEventListener(`selectstart`,N),r.addEventListener(`selectend`,N),r.addEventListener(`squeeze`,N),r.addEventListener(`squeezestart`,N),r.addEventListener(`squeezeend`,N),r.addEventListener(`end`,re),r.addEventListener(`inputsourceschange`,ie),v.xrCompatible!==!0&&await t.makeXRCompatible(),E=e.getPixelRatio(),e.getSize(w),h&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;v.depth&&(o=v.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=v.stencil?wt:De,a=v.stencil?T:_e);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};u=this.getBinding(),d=u.createProjectionLayer(s),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),b=new Ee(d.textureWidth,d.textureHeight,{format:C,type:D,depthTexture:new ce(d.textureWidth,d.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:v.stencil,colorSpace:e.outputColorSpace,samples:v.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let n={antialias:v.antialias,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:i};p=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),b=new Ee(p.framebufferWidth,p.framebufferHeight,{format:C,type:D,colorSpace:e.outputColorSpace,stencilBuffer:v.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1,storeMultisampledDepthBuffer:p.ignoreDepthValues===!1,storeMultisampledStencilBuffer:p.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),fe.setContext(r),fe.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function ie(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=S.indexOf(n);r>=0&&(S[r]=null,x[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=S.indexOf(n);if(r===-1){for(let e=0;e<x.length;e++)if(e>=S.length){S.push(n),r=e;break}else if(S[e]===null){S[e]=n,r=e;break}if(r===-1)break}let i=x[r];i&&i.connect(n)}}let ae=new G,P=new G;function oe(e,t,n){ae.setFromMatrixPosition(t.matrixWorld),P.setFromMatrixPosition(n.matrixWorld);let r=ae.distanceTo(P),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),i[10]===-1)e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+m,n=s+m,i=f-h,a=p+(r-h),u=c*s/n*t,d=l*s/n*t;e.projectionMatrix.makePerspective(i,a,u,d,t,n),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}function se(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;g.texture!==null&&(g.depthNear>0&&(t=g.depthNear),g.depthFar>0&&(n=g.depthFar)),j.near=ee.near=k.near=t,j.far=ee.far=k.far=n,(M!==j.near||ne!==j.far)&&(r.updateRenderState({depthNear:j.near,depthFar:j.far}),M=j.near,ne=j.far),j.layers.mask=e.layers.mask|6,k.layers.mask=j.layers.mask&-5,ee.layers.mask=j.layers.mask&-3;let i=e.parent,a=j.cameras;se(j,i);for(let e=0;e<a.length;e++)se(a[e],i);a.length===2?oe(j,k,ee):j.projectionMatrix.copy(k.projectionMatrix),O===null&&e.isPerspectiveCamera&&(O={camera:e,fov:e.fov,zoom:e.zoom}),le(e,j,i)};function le(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=te*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return j},this.getFoveation=function(){if(d!==null||p!==null)return s},this.setFoveation=function(e){s=e,d!==null&&(d.fixedFoveation=e),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=e)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(j)},this.getCameraTexture=function(e){return _[e]};let ue=null;function de(t,i){if(l=i.getViewerPose(c||a),m=i,l!==null){let t=l.views;p!==null&&(e.setRenderTargetFramebuffer(b,p.framebuffer),e.setRenderTarget(b));let i=!1;t.length!==j.cameras.length&&(j.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(p!==null)a=p.getViewport(r);else{let t=u.getViewSubImage(d,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(b,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(b))}let o=A[n];o===void 0&&(o=new F,o.layers.enable(n),o.viewport=new et,A[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(j.matrix.copy(o.matrix),j.matrix.decompose(j.position,j.quaternion,j.scale)),i===!0&&j.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&h){u=n.getBinding();let e=u.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&g.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&h){e.state.unbindTexture(),u=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=_[n];e||(e=new f,_[n]=e);let t=u.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<x.length;e++){let t=S[e],n=x[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}ue&&ue(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),m=null}let fe=new Ft;fe.setAnimationLoop(de),this.setAnimationLoop=function(e){ue=e},this.dispose=function(){}}},Gi=new it,Ki=new I;Ki.set(-1,0,0,0,1,0,0,0,1);function qi(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,Fe(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(Gi.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(Ki),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.retroreflectivity>0&&(e.retroreflectivity.value=t.retroreflectivity),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function Ji(e,t,n,r){let i={},a={},o=[],s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(g(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,v));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return vt(`WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)p(t[n],e,n,a);else p(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(t,n,r,i){if(h(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=_(i);m(i,t.__data,e),typeof i!=`number`&&typeof i!=`boolean`&&!i.isMatrix3&&!ArrayBuffer.isView(i)&&(e+=a.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function m(e,t,n){typeof e==`number`||typeof e==`boolean`?t[0]=e:e.isMatrix3?(t[0]=e.elements[0],t[1]=e.elements[1],t[2]=e.elements[2],t[3]=0,t[4]=e.elements[3],t[5]=e.elements[4],t[6]=e.elements[5],t[7]=0,t[8]=e.elements[6],t[9]=e.elements[7],t[10]=e.elements[8],t[11]=0):ArrayBuffer.isView(e)?t.set(new e.constructor(e.buffer,e.byteOffset,t.length)):e.toArray(t,n)}function h(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return r[a]=typeof i==`number`||typeof i==`boolean`?i:ArrayBuffer.isView(i)?i.slice():i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(ArrayBuffer.isView(i))return!0;else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function g(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=_(r),o=n%16,s=o%a.boundary,c=o+s;n+=s,c!==0&&16-c<a.storage&&(n+=16-c),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function _(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?H(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(t.boundary=16,t.storage=e.byteLength):H(`WebGLRenderer: Unsupported uniform value type.`,e),t}function v(t){let n=t.target;n.removeEventListener(`dispose`,v);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function y(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:y}}var Yi=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Xi=null;function Zi(){return Xi===null&&(Xi=new Dt(Yi,16,16,ot,j),Xi.name=`DFG_LUT`,Xi.minFilter=ve,Xi.magFilter=ve,Xi.wrapS=_t,Xi.wrapT=_t,Xi.generateMipmaps=!1,Xi.needsUpdate=!0),Xi}var Qi=class{constructor(e={}){let{canvas:r=je(),context:i=null,depth:a=!0,stencil:o=!1,alpha:s=!1,antialias:c=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:u=!1,powerPreference:d=`default`,failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:m=!1,outputBufferType:h=D}=e;this.isWebGLRenderer=!0;let g;if(i!==null){if(typeof WebGLRenderingContext<`u`&&i instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);g=i.getContextAttributes().alpha}else g=s;let _=h,v=new Set([ee,Xe,Ot]),y=new Set([D,_e,t,T,be,oe]),b=new Uint32Array(4),x=new Int32Array(4),S=new G,C=null,w=null,E=[],O=[],k=null;this.domElement=r,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let A=this,te=!1,M=null,ne=null,N=null,re=null;this._outputColorSpace=p;let ie=0,ae=0,P=null,se=-1,ce=null,F=new et,le=new et,ue=null,de=new L(0),fe=0,pe=r.width,me=r.height,he=1,ve=null,ye=null,xe=new et(0,0,pe,me),Se=new et(0,0,pe,me),Ce=!1,we=new n,Te=!1,I=!1,De=new it,Oe=new G,ke=new et,Ae={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Me=!1;function Ne(){return P===null?he:1}let R=i;function z(e,t){return r.getContext(e,t)}let Pe,Fe,V,Ie,U,W,Le,ze,Be,He,Ue,We,Ge,Ke,qe,Je,Ye,Ze,Qe,$e,tt,nt,rt;try{let e={alpha:!0,depth:a,stencil:o,antialias:c,premultipliedAlpha:l,preserveDrawingBuffer:u,powerPreference:d,failIfMajorPerformanceCaveat:f};if(`setAttribute`in r&&r.setAttribute(`data-engine`,`three.js r186`),r.addEventListener(`webglcontextlost`,ct,!1),r.addEventListener(`webglcontextrestored`,lt,!1),r.addEventListener(`webglcontextcreationerror`,ut,!1),R===null){let t=`webgl2`;if(R=z(t,e),R===null)throw z(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}at()}catch(e){throw r.removeEventListener(`webglcontextlost`,ct,!1),r.removeEventListener(`webglcontextrestored`,lt,!1),r.removeEventListener(`webglcontextcreationerror`,ut,!1),vt(`WebGLRenderer: `+e.message),e}function at(){Pe=new gn(R),Pe.init(),tt=new Bi(R,Pe),Fe=new Wt(R,Pe,e,tt),V=new Ri(R,Pe),Fe.reversedDepthBuffer&&m&&V.buffers.depth.setReversed(!0),ne=R.createFramebuffer(),N=R.createFramebuffer(),re=R.createFramebuffer(),Ie=new yn(R),U=new vi,W=new zi(R,Pe,V,U,Fe,tt,Ie),Le=new hn(A),ze=new It(R),nt=new Ht(R,ze),Be=new _n(R,ze,Ie,nt),He=new xn(R,Be,ze,nt,Ie),Ze=new bn(R,Fe,W),qe=new Gt(U),Ue=new _i(A,Le,Pe,Fe,nt,qe),We=new qi(A,U),Ge=new Si,Ke=new ki(Pe),Ye=new Vt(A,Le,V,He,g,l),Je=new Li(A,He,Fe),rt=new Ji(R,Ie,Fe,V),Qe=new Ut(R,Pe,Ie),$e=new vn(R,Pe,Ie),Ie.programs=Ue.programs,A.capabilities=Fe,A.extensions=Pe,A.properties=U,A.renderLists=Ge,A.shadowMap=Je,A.state=V,A.info=Ie}_!==1009&&(k=new Cn(_,r.width,r.height,c,a,o));let ot=new Wi(A,R);this.xr=ot,this.getContext=function(){return R},this.getContextAttributes=function(){return R.getContextAttributes()},this.forceContextLoss=function(){let e=Pe.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=Pe.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return he},this.setPixelRatio=function(e){e!==void 0&&(he=e,this.setSize(pe,me,!1))},this.getSize=function(e){return e.set(pe,me)},this.setSize=function(e,t,n=!0){ot.isPresenting?H(`WebGLRenderer: Can't change size while VR device is presenting.`):(pe=e,me=t,r.width=Math.floor(e*he),r.height=Math.floor(t*he),n===!0&&(r.style.width=e+`px`,r.style.height=t+`px`),k!==null&&k.setSize(r.width,r.height),this.setViewport(0,0,e,t))},this.getDrawingBufferSize=function(e){return e.set(pe*he,me*he).floor()},this.setDrawingBufferSize=function(e,t,n){pe=e,me=t,he=n,r.width=Math.floor(e*n),r.height=Math.floor(t*n),this.setViewport(0,0,e,t)},this.setEffects=function(e){if(_===1009)vt(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);else{if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){H(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}k.setEffects(e||[])}},this.getCurrentViewport=function(e){return e.copy(F)},this.getViewport=function(e){return e.copy(xe)},this.setViewport=function(e,t,n,r){e.isVector4?xe.set(e.x,e.y,e.z,e.w):xe.set(e,t,n,r),V.viewport(F.copy(xe).multiplyScalar(he).round())},this.getScissor=function(e){return e.copy(Se)},this.setScissor=function(e,t,n,r){e.isVector4?Se.set(e.x,e.y,e.z,e.w):Se.set(e,t,n,r),V.scissor(le.copy(Se).multiplyScalar(he).round())},this.getScissorTest=function(){return Ce},this.setScissorTest=function(e){V.setScissorTest(Ce=e)},this.setOpaqueSort=function(e){ve=e},this.setTransparentSort=function(e){ye=e},this.getClearColor=function(e){return e.copy(Ye.getClearColor())},this.setClearColor=function(){Ye.setClearColor(...arguments)},this.getClearAlpha=function(){return Ye.getClearAlpha()},this.setClearAlpha=function(){Ye.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(P!==null){let t=P.texture.format;e=v.has(t)}if(e){let e=P.texture.type,t=y.has(e),n=Ye.getClearColor(),r=Ye.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(b[0]=i,b[1]=a,b[2]=o,b[3]=r,R.clearBufferuiv(R.COLOR,0,b)):(x[0]=i,x[1]=a,x[2]=o,x[3]=r,R.clearBufferiv(R.COLOR,0,x))}else r|=R.COLOR_BUFFER_BIT}t&&(r|=R.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=R.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&R.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),M=e},this.dispose=function(){r.removeEventListener(`webglcontextlost`,ct,!1),r.removeEventListener(`webglcontextrestored`,lt,!1),r.removeEventListener(`webglcontextcreationerror`,ut,!1),Ye.dispose(),Ge.dispose(),Ke.dispose(),U.dispose(),Le.dispose(),He.dispose(),nt.dispose(),rt.dispose(),Ue.dispose(),ot.dispose(),ot.removeEventListener(`sessionstart`,_t),ot.removeEventListener(`sessionend`,yt),bt.stop()};function ct(e){e.preventDefault(),st(`WebGLRenderer: Context Lost.`),te=!0}function lt(){st(`WebGLRenderer: Context Restored.`),te=!1;let e=Ie.autoReset,t=Je.enabled,n=Je.autoUpdate,r=Je.needsUpdate,i=Je.type;at(),Ie.autoReset=e,Je.enabled=t,Je.autoUpdate=n,Je.needsUpdate=r,Je.type=i}function ut(e){vt(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function dt(e){let t=e.target;t.removeEventListener(`dispose`,dt),ft(t)}function ft(e){pt(e),U.remove(e)}function pt(e){let t=U.get(e).programs;t!==void 0&&(t.forEach(function(e){Ue.releaseProgram(e)}),e.isShaderMaterial&&Ue.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=Ae);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=jt(e,t,n,r,i);V.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=Be.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;nt.setup(i,r,s,n,c);let h,g=Qe;if(c!==null&&(h=ze.get(c),g=$e,g.setIndex(h)),i.isMesh)r.wireframe===!0?(V.setLineWidth(r.wireframeLinewidth*Ne()),g.setMode(R.LINES)):g.setMode(R.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),V.setLineWidth(e*Ne()),i.isLineSegments?g.setMode(R.LINES):i.isLineLoop?g.setMode(R.LINE_LOOP):g.setMode(R.LINE_STRIP)}else i.isPoints?g.setMode(R.POINTS):i.isSprite&&g.setMode(R.TRIANGLES);if(i.isBatchedMesh){if(Pe.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?ze.get(c).bytesPerElement:1,o=U.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(R,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function mt(e,t,n,r){M!==null&&e.isNodeMaterial&&M.setObject(r,e),Te===!0&&qe.setState(e,n,!1),e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,Et(e,t,r),e.side=0,e.needsUpdate=!0,Et(e,t,r),e.side=2):Et(e,t,r)}this.compile=function(e,t,n=null){n===null&&(n=e),M!==null&&M.renderStart(e,t,n),w=Ke.get(n),w.init(t),O.push(w),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(w.pushLight(e),e.castShadow&&w.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(w.pushLight(e),e.castShadow&&w.pushShadow(e))}),w.setupLights(),M!==null&&M.updateLights(w.state.lightsArray),I=this.localClippingEnabled,Te=qe.init(this.clippingPlanes,I),Te===!0&&qe.setGlobalState(this.clippingPlanes,t),M!==null&&Je.render(w.state.shadowsArray,n,t);let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let i=e.material;if(i){if(Array.isArray(i))for(let a=0;a<i.length;a++){let o=i[a];mt(o,n,t,e),r.add(o)}else mt(i,n,t,e),r.add(i)}}),w=O.pop(),M!==null&&M.renderEnd(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){r.forEach(function(e){let t=U.get(e).currentProgram;(t===void 0||t.isReady())&&r.delete(e)}),r.size===0?t(e):setTimeout(n,10)}Pe.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let ht=null;function gt(e){ht&&ht(e)}function _t(){bt.stop()}function yt(){bt.start()}let bt=new Ft;bt.setAnimationLoop(gt),typeof self<`u`&&bt.setContext(self),this.setAnimationLoop=function(e){ht=e,ot.setAnimationLoop(e),e===null?bt.stop():bt.start()},ot.addEventListener(`sessionstart`,_t),ot.addEventListener(`sessionend`,yt),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){vt(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(te===!0)return;M!==null&&M.renderStart(e,t);let n=ot.enabled===!0&&ot.isPresenting===!0,r=k!==null&&(P===null||n)&&k.begin(A,P);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),ot.enabled===!0&&ot.isPresenting===!0&&(k===null||k.isCompositing()===!1)&&(ot.cameraAutoUpdate===!0&&ot.updateCamera(t),t=ot.getCamera()),e.isScene===!0&&e.onBeforeRender(A,e,t,P),w=Ke.get(e,O.length),w.init(t),w.state.textureUnits=W.getTextureUnits(),O.push(w),De.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),we.setFromProjectionMatrix(De,Ve,t.reversedDepth),I=this.localClippingEnabled,Te=qe.init(this.clippingPlanes,I),C=Ge.get(e,E.length),C.init(),E.push(C),ot.enabled===!0&&ot.isPresenting===!0){let e=A.xr.getDepthSensingMesh();e!==null&&xt(e,t,-1/0,A.sortObjects)}xt(e,t,0,A.sortObjects),C.finish(),M!==null&&M.updateLights(w.state.lightsArray),A.sortObjects===!0&&C.sort(ve,ye),Me=ot.enabled===!1||ot.isPresenting===!1||ot.hasDepthSensing()===!1,Me&&Ye.addToRenderList(C,e),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Te===!0&&qe.beginShadows();let i=w.state.shadowsArray;if(Je.render(i,e,t),Te===!0&&qe.endShadows(),(r&&k.hasRenderPass())===!1){let n=C.opaque,r=C.transmissive;if(w.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];Ct(n,r,e,a)}Me&&Ye.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];St(C,e,n,n.viewport)}}else r.length>0&&Ct(n,r,e,t),Me&&Ye.render(e),St(C,e,t)}P!==null&&ae===0&&(W.updateMultisampleRenderTarget(P),W.updateRenderTargetMipmap(P)),r&&k.end(A),e.isScene===!0&&e.onAfterRender(A,e,t),nt.resetDefaultState(),se=-1,ce=null,O.pop(),O.length>0?(w=O[O.length-1],W.setTextureUnits(w.state.textureUnits),Te===!0&&qe.setGlobalState(A.clippingPlanes,w.state.camera)):w=null,E.pop(),C=E.length>0?E[E.length-1]:null,M!==null&&M.renderEnd()};function xt(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLightProbeGrid)w.pushLightProbeGrid(e);else if(e.isLight)w.pushLight(e),e.castShadow&&w.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||e.intersectsFrustum(we)){r&&ke.setFromMatrixPosition(e.matrixWorld).applyMatrix4(De);let i=He.update(e),a=e.material;a.visible&&C.push(e,i,a,n,ke.z,null,t)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||e.intersectsFrustum(we))){let i=He.update(e),a=e.material;if(r&&(e.boundingSphere===void 0?(i.boundingSphere===null&&i.computeBoundingSphere(),ke.copy(i.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),ke.copy(e.boundingSphere.center)),ke.applyMatrix4(e.matrixWorld).applyMatrix4(De)),Array.isArray(a)){let r=i.groups;for(let o=0,s=r.length;o<s;o++){let s=r[o],c=a[s.materialIndex];c&&c.visible&&C.push(e,i,c,n,ke.z,s,t)}}else a.visible&&C.push(e,i,a,n,ke.z,null,t)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)xt(i[e],t,n,r)}function St(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;w.setupLightsView(n),Te===!0&&qe.setGlobalState(A.clippingPlanes,n),r&&V.viewport(F.copy(r)),i.length>0&&wt(i,t,n),a.length>0&&wt(a,t,n),o.length>0&&wt(o,t,n),V.buffers.depth.setTest(!0),V.buffers.depth.setMask(!0),V.buffers.color.setMask(!0),V.setPolygonOffset(!1)}function Ct(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(w.state.transmissionRenderTarget[r.id]===void 0){let e=Pe.has(`EXT_color_buffer_half_float`)||Pe.has(`EXT_color_buffer_float`);w.state.transmissionRenderTarget[r.id]=new Ee(1,1,{generateMipmaps:!0,type:e?j:D,minFilter:ge,samples:Math.max(4,Fe.samples),stencilBuffer:o,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:B.workingColorSpace})}let i=w.state.transmissionRenderTarget[r.id],a=r.viewport||F;i.setSize(a.z*A.transmissionResolutionScale,a.w*A.transmissionResolutionScale);let s=A.getRenderTarget(),c=A.getActiveCubeFace(),l=A.getActiveMipmapLevel();A.setRenderTarget(i),A.getClearColor(de),fe=A.getClearAlpha(),fe<1&&A.setClearColor(16777215,.5),A.clear(),Me&&Ye.render(n);let u=A.toneMapping;A.toneMapping=0;let d=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),w.setupLightsView(r),Te===!0&&qe.setGlobalState(A.clippingPlanes,r),wt(e,n,r),W.updateMultisampleRenderTarget(i),W.updateRenderTargetMipmap(i),Pe.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,Tt(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(W.updateMultisampleRenderTarget(i),W.updateRenderTargetMipmap(i))}A.setRenderTarget(s,c,l),A.setClearColor(de,fe),d!==void 0&&(r.viewport=d),A.toneMapping=u}function wt(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&Tt(o,t,n,s,l,c)}}function Tt(e,t,n,r,i,a){M!==null&&i.isNodeMaterial&&M.setObject(e,i),e.onBeforeRender(A,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(A,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,A.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,A.renderBufferDirect(n,t,r,i,e,a),i.side=2):A.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(A,t,n,r,i,a)}function Et(e,t,n){t.isScene!==!0&&(t=Ae);let r=U.get(e),i=w.state.lights,a=w.state.shadowsArray,o=i.state.version,s=Ue.getParameters(e,i.state,a,t,n,w.state.lightProbeGridArray),c=Ue.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=Le.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,dt),l=new Map,r.programs=l);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return kt(e,s),d}else s.uniforms=Ue.getUniforms(e),M!==null&&e.isNodeMaterial&&M.build(e,n,s),e.onBeforeCompile(s,A),d=Ue.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=qe.uniform),kt(e,s),r.needsLights=Nt(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.sunLights.value=i.state.sun,f.sunLightShadows.value=i.state.sunShadow,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.sunShadowMatrix.value=i.state.sunShadowMatrix,f.sunShadowCascade.value=i.state.sunShadowCascade,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.lightProbeGrid=w.state.lightProbeGridArray.length>0,r.currentProgram=d,r.uniformsList=null,d}function Dt(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=Ar.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function kt(e,t){let n=U.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function At(e,t){if(e.length===0)return null;if(e.length===1)return e[0].texture===null?null:e[0];S.setFromMatrixPosition(t.matrixWorld);for(let t=0,n=e.length;t<n;t++){let n=e[t];if(n.texture!==null&&n.boundingBox.containsPoint(S))return n}return null}function jt(e,t,n,r,i){t.isScene!==!0&&(t=Ae),W.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=P===null?A.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:B.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=Le.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(P===null||P.isXRRenderTarget===!0)&&(h=A.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=U.get(r),y=w.state.lights;if(Te===!0&&(I===!0||e!==ce)){let t=e===ce&&r.id===se;qe.setState(r,e,t)}let b=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==y.state.version?b=!0:v.outputColorSpace===s?i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i._colorsTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i._colorsTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?b=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==qe.numPlanes||v.numIntersection!==qe.numIntersection)?b=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.toneMapping===h&&v.morphTargetsCount===_?!!v.lightProbeGrid!=w.state.lightProbeGridArray.length>0&&(b=!0):b=!0:b=!0:b=!0:(b=!0,v.__version=r.version);let x=v.currentProgram;b===!0&&(x=Et(r,t,i),M&&r.isNodeMaterial&&M.onUpdateProgram(r,x,v));let S=!1,C=!1,T=!1,E=x.getUniforms(),D=v.uniforms;if(V.useProgram(x.program)&&(S=!0,C=!0,T=!0),r.id!==se&&(se=r.id,C=!0),v.needsLights){let e=At(w.state.lightProbeGridArray,i);v.lightProbeGrid!==e&&(v.lightProbeGrid=e,C=!0)}if(S||ce!==e){V.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),E.setValue(R,`projectionMatrix`,e.projectionMatrix),E.setValue(R,`viewMatrix`,e.matrixWorldInverse);let t=E.map.cameraPosition;t!==void 0&&t.setValue(R,Oe.setFromMatrixPosition(e.matrixWorld)),Fe.logarithmicDepthBuffer&&E.setValue(R,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&E.setValue(R,`isOrthographic`,e.isOrthographicCamera===!0),ce!==e&&(ce=e,C=!0,T=!0)}if(v.needsLights&&(y.state.sunShadowMap.length>0&&E.setValue(R,`sunShadowMap`,y.state.sunShadowMap,W),y.state.directionalShadowMap.length>0&&E.setValue(R,`directionalShadowMap`,y.state.directionalShadowMap,W),y.state.spotShadowMap.length>0&&E.setValue(R,`spotShadowMap`,y.state.spotShadowMap,W),y.state.pointShadowMap.length>0&&E.setValue(R,`pointShadowMap`,y.state.pointShadowMap,W)),i.isSkinnedMesh){E.setOptional(R,i,`bindMatrix`),E.setOptional(R,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),E.setValue(R,`boneTexture`,e.boneTexture,W))}i.isBatchedMesh&&(E.setOptional(R,i,`batchingTexture`),E.setValue(R,`batchingTexture`,i._matricesTexture,W),E.setOptional(R,i,`batchingIdTexture`),E.setValue(R,`batchingIdTexture`,i._indirectTexture,W),E.setOptional(R,i,`batchingColorTexture`),i._colorsTexture!==null&&E.setValue(R,`batchingColorTexture`,i._colorsTexture,W));let O=n.morphAttributes;if((O.position!==void 0||O.normal!==void 0||O.color!==void 0)&&Ze.update(i,n,x),(C||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,E.setValue(R,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(D.envMapIntensity.value=t.environmentIntensity),D.dfgLUT!==void 0&&(D.dfgLUT.value=Zi()),C){if(E.setValue(R,`toneMappingExposure`,A.toneMappingExposure),v.needsLights&&Mt(D,T),a&&r.fog===!0&&We.refreshFogUniforms(D,a),We.refreshMaterialUniforms(D,r,he,me,w.state.transmissionRenderTarget[e.id]),v.needsLights&&v.lightProbeGrid){let e=v.lightProbeGrid;D.probesSH.value=e.texture,D.probesMin.value.copy(e.boundingBox.min),D.probesMax.value.copy(e.boundingBox.max),D.probesResolution.value.copy(e.resolution)}Ar.upload(R,Dt(v),D,W)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(Ar.upload(R,Dt(v),D,W),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&E.setValue(R,`center`,i.center),E.setValue(R,`modelViewMatrix`,i.modelViewMatrix),E.setValue(R,`normalMatrix`,i.normalMatrix),E.setValue(R,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];rt.update(n,x),rt.bind(n,x)}}return x}function Mt(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.sunLights.needsUpdate=t,e.sunLightShadows.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function Nt(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return ie},this.getActiveMipmapLevel=function(){return ae},this.getRenderTarget=function(){return P},this.setRenderTargetTextures=function(e,t,n){let r=U.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),U.get(e.texture).__webglTexture=t,U.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=U.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){P=e,ie=t,ae=n;let r=null,i=!1,a=!1;if(e){let o=U.get(e);if(o.__useDefaultFramebuffer!==void 0){V.bindFramebuffer(R.FRAMEBUFFER,o.__webglFramebuffer),F.copy(e.viewport),le.copy(e.scissor),ue=e.scissorTest,V.viewport(F),V.scissor(le),V.setScissorTest(ue),se=-1;return}if(o.__webglFramebuffer===void 0)W.setupRenderTarget(e);else if(o.__hasExternalTextures)W.rebindTextures(e,U.get(e.texture).__webglTexture,U.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&U.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);W.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=U.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&W.useMultisampledRTT(e)===!1?U.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,F.copy(e.viewport),le.copy(e.scissor),ue=e.scissorTest}else F.copy(xe).multiplyScalar(he).floor(),le.copy(Se).multiplyScalar(he).floor(),ue=Ce;if(n!==0&&(r=ne),V.bindFramebuffer(R.FRAMEBUFFER,r)&&V.drawBuffers(e,r),V.viewport(F),V.scissor(le),V.setScissorTest(ue),i){let r=U.get(e.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=U.get(e.textures[t]);R.framebufferTextureLayer(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=U.get(e.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,t.__webglTexture,n)}se=-1};function Pt(e){let t=U.get(e);return(t.__readFormat!==e.format||t.__readType!==e.type)&&(t.__readFormat=e.format,t.__readType=e.type,t.__formatReadable=Fe.textureFormatReadable(e.format),t.__typeReadable=Fe.textureTypeReadable(e.type)),t}this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){vt(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=U.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){V.bindFramebuffer(R.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;e.textures.length>1&&R.readBuffer(R.COLOR_ATTACHMENT0+s);let u=Pt(o);if(u.__formatReadable===!1){vt(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(u.__typeReadable===!1){vt(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&R.readPixels(t,n,r,i,tt.convert(c),tt.convert(l),a)}finally{let e=P===null?null:U.get(P).__webglFramebuffer;V.bindFramebuffer(R.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=U.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){V.bindFramebuffer(R.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;e.textures.length>1&&R.readBuffer(R.COLOR_ATTACHMENT0+s);let d=Pt(o);if(d.__formatReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(d.__typeReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let f=R.createBuffer();R.bindBuffer(R.PIXEL_PACK_BUFFER,f),R.bufferData(R.PIXEL_PACK_BUFFER,a.byteLength,R.STREAM_READ),R.readPixels(t,n,r,i,tt.convert(l),tt.convert(u),0),R.bindBuffer(R.PIXEL_PACK_BUFFER,null);let p=P===null?null:U.get(P).__webglFramebuffer;V.bindFramebuffer(R.FRAMEBUFFER,p);let m=R.fenceSync(R.SYNC_GPU_COMMANDS_COMPLETE,0);return R.flush(),await Re(R,m,4),R.bindBuffer(R.PIXEL_PACK_BUFFER,f),R.getBufferSubData(R.PIXEL_PACK_BUFFER,0,a),R.bindBuffer(R.PIXEL_PACK_BUFFER,null),R.deleteBuffer(f),R.deleteSync(m),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;W.setTexture2D(e,0),R.copyTexSubImage2D(R.TEXTURE_2D,n,0,0,o,s,i,a),V.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=tt.convert(t.format),_=tt.convert(t.type),v;t.isData3DTexture?(W.setTexture3D(t,0),v=R.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(W.setTexture2DArray(t,0),v=R.TEXTURE_2D_ARRAY):(W.setTexture2D(t,0),v=R.TEXTURE_2D),V.activeTexture(R.TEXTURE0),V.pixelStorei(R.UNPACK_FLIP_Y_WEBGL,t.flipY),V.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),V.pixelStorei(R.UNPACK_ALIGNMENT,t.unpackAlignment);let y=V.getParameter(R.UNPACK_ROW_LENGTH),b=V.getParameter(R.UNPACK_IMAGE_HEIGHT),x=V.getParameter(R.UNPACK_SKIP_PIXELS),S=V.getParameter(R.UNPACK_SKIP_ROWS),C=V.getParameter(R.UNPACK_SKIP_IMAGES);V.pixelStorei(R.UNPACK_ROW_LENGTH,h.width),V.pixelStorei(R.UNPACK_IMAGE_HEIGHT,h.height),V.pixelStorei(R.UNPACK_SKIP_PIXELS,l),V.pixelStorei(R.UNPACK_SKIP_ROWS,u),V.pixelStorei(R.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=U.get(e),r=U.get(t),h=U.get(n.__renderTarget),g=U.get(r.__renderTarget);V.bindFramebuffer(R.READ_FRAMEBUFFER,h.__webglFramebuffer),V.bindFramebuffer(R.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,U.get(e).__webglTexture,i,d+n),R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,U.get(t).__webglTexture,a,m+n)),R.blitFramebuffer(l,u,o,s,f,p,o,s,R.DEPTH_BUFFER_BIT,R.NEAREST);V.bindFramebuffer(R.READ_FRAMEBUFFER,null),V.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||U.has(e)){let n=U.get(e),r=U.get(t);V.bindFramebuffer(R.READ_FRAMEBUFFER,N),V.bindFramebuffer(R.DRAW_FRAMEBUFFER,re);for(let e=0;e<c;e++)w?R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):R.framebufferTexture2D(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,n.__webglTexture,i),T?R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):R.framebufferTexture2D(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,r.__webglTexture,a),i===0?T?R.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):R.copyTexSubImage2D(v,a,f,p,l,u,o,s):R.blitFramebuffer(l,u,o,s,f,p,o,s,R.COLOR_BUFFER_BIT,R.NEAREST);V.bindFramebuffer(R.READ_FRAMEBUFFER,null),V.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?R.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?R.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):R.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?R.texSubImage2D(R.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?R.compressedTexSubImage2D(R.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):R.texSubImage2D(R.TEXTURE_2D,a,f,p,o,s,g,_,h);V.pixelStorei(R.UNPACK_ROW_LENGTH,y),V.pixelStorei(R.UNPACK_IMAGE_HEIGHT,b),V.pixelStorei(R.UNPACK_SKIP_PIXELS,x),V.pixelStorei(R.UNPACK_SKIP_ROWS,S),V.pixelStorei(R.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps&&R.generateMipmap(v),V.unbindTexture()},this.initRenderTarget=function(e){U.get(e).__webglFramebuffer===void 0&&W.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?W.setTextureCube(e,0):e.isData3DTexture?W.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?W.setTexture2DArray(e,0):W.setTexture2D(e,0),V.unbindTexture()},this.resetState=function(){ie=0,ae=0,P=null,V.reset(),nt.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return Ve}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=B._getDrawingBufferColorSpace(e),t.unpackColorSpace=B._getUnpackColorSpace()}};function $i(e,t,n){let r=!1;for(let i=0,a=n.length-1;i<n.length;a=i++)n[i][1]>t!=n[a][1]>t&&e<(n[a][0]-n[i][0])*(t-n[i][1])/(n[a][1]-n[i][1])+n[i][0]&&(r=!r);return r}function ea(e,t){let n=new Ae;return n.setAttribute(`position`,new ne(e.flat(),3)),n.setIndex([0,1,2,0,2,3]),n.computeVertexNormals(),new ht(n,t)}function ta(e,t,n,r){let i=t.ends[1].clone().sub(t.ends[0]).normalize(),a=e=>e.clone().sub(t.ends[0]).dot(i),o=[t,n].map(e=>e.ends.map(a).sort((e,t)=>e-t)),s=Math.max(o[0][0],o[1][0]),c=Math.min(o[0][1],o[1][1]),l=(e,t)=>{let[n,r]=e.ends;return n.clone().lerp(r,(t-a(n))/(a(r)-a(n)))},u=a(t.points[0])<a(t.points[1])?[0,1]:[1,0],d=(e,t)=>[e.x,t,e.z];for(let[i,o]of[[u[0],s],[u[1],c]]){let s=t.points[i],c=n.points[i],f=i===u[0]?1:-1,p=Math.min(f*(a(s)-o),f*(a(c)-o))>.002,m=d(s,t.top),h=d(c,n.top),g=ea([d(s,t.o.v1),d(c,n.o.v1),h,m],r);if(g.name=`paired-wall-above-jamb`,g.userData.dollhouseHide=!0,(t.top-t.o.v1>.002||n.top-n.o.v1>.002)&&e.add(g),!p)continue;let _=l(t,o),v=l(n,o),y=d(_,t.top),b=d(v,n.top),x=ea([y,m,h,b],r);x.name=`paired-wall-sloped-top`,x.userData.dollhouseHide=!0,e.add(x);let S=ea([d(_,0),d(v,0),b,y],r);S.name=`paired-wall-end`,S.userData.dollhouseHide=!0,e.add(S)}e.userData.wallTopInfill={source:`registered wall and aperture endpoints`,status:`inferred wall caps and returns; physical thickness remains approximate`}}function na(e,t,n){let r=t.floor,i=ea(e.map(([e,t])=>[e,.0015,t]),n);return i.name=`paired-doorway-threshold`,i.geometry.attributes.normal.getY(0)<0&&(i.geometry.setIndex([0,2,1,0,3,2]),i.geometry.computeVertexNormals()),r&&ra(i,r,t.floorWorldMatrix),i}function ra(e,t,n){let r=t.geometry?.attributes.position,i=t.geometry?.attributes.uv,a=t.geometry?.index;if(!r||!i||!t.material?.map)return!1;t.updateWorldMatrix(!0,!1);let o=(n??t.matrixWorld).clone().invert(),s=e.geometry.attributes.position,c=Array.from({length:s.count},(e,t)=>new G().fromBufferAttribute(s,t).applyMatrix4(o)),l=c.reduce((e,t)=>e.add(t),new G).multiplyScalar(1/c.length),u=new b,d=new b,f=new G,p=1/0,m;for(let e=0;e<(a?.count??r.count);e+=3){let t=a?a.getX(e):e,n=a?a.getX(e+1):e+1,i=a?a.getX(e+2):e+2;if(u.a.fromBufferAttribute(r,t),u.b.fromBufferAttribute(r,n),u.c.fromBufferAttribute(r,i),u.getArea()<1e-8)continue;let o=u.closestPointToPoint(l,f).distanceToSquared(l);o<p&&(p=o,d.copy(u),m=[t,n,i])}if(!m)return!1;let h=[];for(let e of c){let t=d.getBarycoord(e,new G).toArray();h.push(...[0,1].map(e=>m.reduce((n,r,a)=>n+t[a]*(e?i.getY(r):i.getX(r)),0)))}let g=t.material.clone();return g.side=2,g.vertexColors=!1,e.material=g,e.geometry.setAttribute(`uv`,new ne(h,2)),!0}function ia(e,t){let n=new A;n.name=`reconstructed-doorway-connections`;let r=[],i=new Qe({color:15067110,roughness:.9,side:2}),a=new Qe({color:10980461,roughness:.78,side:2});for(let o of t){let t=t=>{let n=e.find(e=>e.p.id===String(t.room)),r=n.data.walls.find(e=>e.index===t.wall),i=r.openings[t.opening];n.root.updateMatrixWorld(!0);let a=e=>n.root.localToWorld(new G(r.origin[0]+r.u[0]*e,0,r.origin[2]+r.u[2]*e)),o=r.height,s=r.n??[-r.u[2],0,r.u[0]];return{room:n,wall:r,o:i,top:o,ends:[a(0),a(r.length)],points:[a(i.u0),a(i.u1)],inward:new G(...s).transformDirection(n.root.matrixWorld)}},s=t(o.a),c=t(o.b);s.points[0].distanceToSquared(c.points[0])+s.points[1].distanceToSquared(c.points[1])>s.points[0].distanceToSquared(c.points[1])+s.points[1].distanceToSquared(c.points[0])&&c.points.reverse();let l=[...s.points,c.points[1],c.points[0]],u=e=>[e.x,e.z],d=l.map(u),f=new A,p=Math.min(s.o.v1,c.o.v1);f.name=`doorway-${o.a.room}-${o.b.room}`,f.userData={status:`reconstructed between independent scanned faces`,sourceRooms:[o.a.room,o.b.room],openingHeights:[s.o.v1,c.o.v1],note:`Depth derives from registered wall faces; approximate physical thickness`};let m=l.map((e,t)=>e.clone().addScaledVector((t<2?s:c).inward,.004)).map(u),h=na(m,s.room,a);f.add(h);for(let[e,t]of[[`paired-doorway-soffit`,[s.o.v1,c.o.v1]],[`paired-doorway-wall-header-top`,[s.top,c.top]]]){if(e.endsWith(`header-top`)&&Math.max(...t)<=p+.01)continue;let n=ea(l.map((e,n)=>[e.x,t[n<2?0:1],e.z]),i);n.name=e,n.userData.dollhouseHide=!0,f.add(n)}for(let e=0;e<2;e++){let t=s.points[e],n=c.points[e],r=ea([[t.x,0,t.z],[n.x,0,n.z],[n.x,c.o.v1,n.z],[t.x,s.o.v1,t.z]],i);r.name=e===0?`paired-doorway-jamb-a`:`paired-doorway-jamb-b`,r.userData.dollhouseJamb=!0,f.add(r)}ta(f,s,c,i),n.add(f),r.push({a:s.room,b:c.room,wallA:s.wall.index,wallB:c.wall.index,polygon:d,threshold:m,thresholdMesh:h,group:f,height:p})}return{root:n,links:r}}var aa=new WeakMap,oa=new WeakMap;function sa(e){let t=aa.get(e);return t||(t=[],e.traverse(e=>{Number.isInteger(e.userData.cutawayWall)&&t.push(e)}),aa.set(e,t)),t}function ca(e,t){if(t.y<-.1)return!1;let n=e=>$i(t.x,t.z,e);if(t.y<(e.ceilingHeight??3.8)-.02&&n(e.data.polygon))return!0;let r=e.p?.vestibule??e.vestibule?.root.userData.walkPolygon,i=e.vestibule?.root.userData.ceilingHeight??3.56;return!!(r&&t.y<i-.02&&n(r))}function la(e,t,{enabled:n=!0,walking:r=!1}={}){let i=e.ceilingHeight??3.8,a=r||ca(e,t),o=n&&!a,s=0,c=0;for(let n of[...e.walls,...e.modelWalls||[]]){if(!n.group)continue;let e=(t.x-n.mid.x)*n.normal.x+(t.z-n.mid.z)*n.normal.z;o?e<-.025?n.group.visible=!1:e>.025&&(n.group.visible=!0):n.group.visible=!0,c++,n.group.visible||s++}let l=new Map([...e.walls,...e.modelWalls||[]].filter(e=>e.group).map(e=>[e.group.name,e.group]));for(let t of sa(e.model??e.root)){let e=l.get(`wall-`+t.userData.cutawayWall);t.visible=!o||!e||e.visible}let u=e.ceilings??[e.ceiling,e.vestibule?.ceiling].filter(Boolean);for(let e of u)e.visible=!n||a||t.y<(e.userData.ceilingHeight??i);let d=e.model??e.balcony?.root??e.balcony;d&&!oa.has(d)&&oa.set(d,d.getObjectByName(`balcony-canopy`));let f=d&&oa.get(d);return f&&(f.visible=!n||a||t.y<3.985),{hidden:s,total:c,occupied:a}}function ua(e,t,n,r=1/0){for(let i of e?.links??[]){let e=(e,t)=>e.root.visible?(e.modelWalls?.find(e=>e.group?.name===`wall-${t}`)??e.walls.find(e=>e.index===t))?.group?.visible!==!1:!1,a=e(i.a,i.wallA),o=e(i.b,i.wallB),s=!t||n;for(let e of i.group.children)if(e.userData.dollhouseJamb&&(e.visible=s||a||o),e.userData.dollhouseHide){let t=e.name===`paired-doorway-soffit`;e.visible=s||(t?(a||o)&&r<i.height:a&&o)}}}var da={type:`change`},fa={type:`start`},pa={type:`end`},ma=new Ie,ha=new c,ga=Math.cos(70*He.DEG2RAD),_a=new G,va=2*Math.PI,J={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},ya=1e-6,ba=class extends at{constructor(e,t=null){super(e,t),this.state=J.NONE,this.target=new G,this.cursor=new G,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:`ArrowLeft`,UP:`ArrowUp`,RIGHT:`ArrowRight`,BOTTOM:`ArrowDown`},this.mouseButtons={LEFT:tt.ROTATE,MIDDLE:tt.DOLLY,RIGHT:tt.PAN},this.touches={ONE:se.ROTATE,TWO:se.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle=`auto`,this._domElementKeyEvents=null,this._lastPosition=new G,this._lastQuaternion=new Ke,this._lastTargetPosition=new G,this._quat=new Ke().setFromUnitVectors(e.up,new G(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new S,this._sphericalDelta=new S,this._scale=1,this._panOffset=new G,this._rotateStart=new z,this._rotateEnd=new z,this._rotateDelta=new z,this._panStart=new z,this._panEnd=new z,this._panDelta=new z,this._dollyStart=new z,this._dollyEnd=new z,this._dollyDelta=new z,this._dollyDirection=new G,this._mouse=new z,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=Sa.bind(this),this._onPointerDown=xa.bind(this),this._onPointerUp=Ca.bind(this),this._onContextMenu=Aa.bind(this),this._onMouseWheel=Ea.bind(this),this._onKeyDown=Da.bind(this),this._onTouchStart=Oa.bind(this),this._onTouchMove=ka.bind(this),this._onMouseDown=wa.bind(this),this._onMouseMove=Ta.bind(this),this._interceptControlDown=ja.bind(this),this._interceptControlUp=Ma.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e===`grab`?this.domElement.style.cursor=`grab`:this.domElement.style.cursor=`auto`}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener(`pointerdown`,this._onPointerDown),this.domElement.addEventListener(`pointercancel`,this._onPointerUp),this.domElement.addEventListener(`contextmenu`,this._onContextMenu),this.domElement.addEventListener(`wheel`,this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener(`keydown`,this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction=`none`}disconnect(){this.state=J.NONE,this.domElement.removeEventListener(`pointerdown`,this._onPointerDown),this.domElement.ownerDocument.removeEventListener(`pointermove`,this._onPointerMove),this.domElement.ownerDocument.removeEventListener(`pointerup`,this._onPointerUp),this.domElement.removeEventListener(`pointercancel`,this._onPointerUp),this.domElement.removeEventListener(`wheel`,this._onMouseWheel),this.domElement.removeEventListener(`contextmenu`,this._onContextMenu),this.stopListenToKeyEvents();let e=this.domElement.getRootNode();e.removeEventListener(`keydown`,this._interceptControlDown,{capture:!0}),e.removeEventListener(`keyup`,this._interceptControlUp,{capture:!0}),this._controlActive=!1,this._pointers.length=0,this._pointerPositions={},this.domElement.style.touchAction=``,this.domElement.style.cursor=`auto`}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener(`keydown`,this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener(`keydown`,this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(da),this.update(),this.state=J.NONE}pan(e,t){this._pan(e,t),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){let t=this.object.position;_a.copy(t).sub(this.target),_a.applyQuaternion(this._quat),this._spherical.setFromVector3(_a),this.autoRotate&&this.state===J.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,r=this.maxAzimuthAngle;isFinite(n)&&isFinite(r)&&(n<-Math.PI?n+=va:n>Math.PI&&(n-=va),r<-Math.PI?r+=va:r>Math.PI&&(r-=va),n<=r?this._spherical.theta=Math.max(n,Math.min(r,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+r)/2?Math.max(n,this._spherical.theta):Math.min(r,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let i=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let e=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),i=e!=this._spherical.radius}if(_a.setFromSpherical(this._spherical),_a.applyQuaternion(this._quatInverse),t.copy(this.target).add(_a),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let e=null;if(this.object.isPerspectiveCamera){let t=_a.length();e=this._clampDistance(t*this._scale);let n=t-e;this.object.position.addScaledVector(this._dollyDirection,n),this.object.updateMatrixWorld(),i=!!n}else if(this.object.isOrthographicCamera){let t=new G(this._mouse.x,this._mouse.y,0);t.unproject(this.object);let n=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),i=n!==this.object.zoom;let r=new G(this._mouse.x,this._mouse.y,0);r.unproject(this.object),this.object.position.sub(r).add(t),this.object.updateMatrixWorld(),e=_a.length()}else console.warn(`WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled.`),this.zoomToCursor=!1;e!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(e).add(this.object.position):(ma.origin.copy(this.object.position),ma.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(ma.direction))<ga?this.object.lookAt(this.target):(ha.setFromNormalAndCoplanarPoint(this.object.up,this.target),ma.intersectPlane(ha,this.target))))}else if(this.object.isOrthographicCamera){let e=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),e!==this.object.zoom&&(this.object.updateProjectionMatrix(),i=!0)}return this._scale=1,this._performCursorZoom=!1,i||this._lastPosition.distanceToSquared(this.object.position)>ya||8*(1-this._lastQuaternion.dot(this.object.quaternion))>ya||this._lastTargetPosition.distanceToSquared(this.target)>ya?(this.dispatchEvent(da),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e===null?va/60/60*this.autoRotateSpeed:va/60*this.autoRotateSpeed*e}_getZoomScale(e){let t=Math.abs(e*.01);return .95**(this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){_a.setFromMatrixColumn(t,0),_a.multiplyScalar(-e),this._panOffset.add(_a)}_panUp(e,t){this.screenSpacePanning===!0?_a.setFromMatrixColumn(t,1):(_a.setFromMatrixColumn(t,0),_a.crossVectors(this.object.up,_a)),_a.multiplyScalar(e),this._panOffset.add(_a)}_pan(e,t){let n=this.domElement;if(this.object.isPerspectiveCamera){let r=this.object.position;_a.copy(r).sub(this.target);let i=_a.length();i*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*i/n.clientHeight,this.object.matrix),this._panUp(2*t*i/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn(`WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.`),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn(`WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.`),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn(`WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.`),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let n=this.domElement.getBoundingClientRect(),r=e-n.left,i=t-n.top,a=n.width,o=n.height;this._mouse.x=r/a*2-1,this._mouse.y=-(i/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(va*this._rotateDelta.x/t.clientHeight),this._rotateUp(va*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(va*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-va*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(va*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-va*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._rotateStart.set(n,r)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panStart.set(n,r)}}_handleTouchStartDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,r=e.pageY-t.y,i=Math.sqrt(n*n+r*r);this._dollyStart.set(0,i)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._rotateEnd.set(n,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(va*this._rotateDelta.x/t.clientHeight),this._rotateUp(va*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panEnd.set(n,r)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,r=e.pageY-t.y,i=Math.sqrt(n*n+r*r);this._dollyEnd.set(0,i),this._dollyDelta.set(0,(this._dollyEnd.y/this._dollyStart.y)**+this.zoomSpeed),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let a=(e.pageX+t.x)*.5,o=(e.pageY+t.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new z,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){let t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){let t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}};function xa(e){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(e.pointerId),this.domElement.ownerDocument.addEventListener(`pointermove`,this._onPointerMove),this.domElement.ownerDocument.addEventListener(`pointerup`,this._onPointerUp)),!this._isTrackingPointer(e)&&(this._addPointer(e),e.pointerType===`touch`?this._onTouchStart(e):this._onMouseDown(e),this._cursorStyle===`grab`&&(this.domElement.style.cursor=`grabbing`)))}function Sa(e){this.enabled!==!1&&(e.pointerType===`touch`?this._onTouchMove(e):this._onMouseMove(e))}function Ca(e){switch(this._removePointer(e),this._pointers.length){case 0:this.domElement.releasePointerCapture(e.pointerId),this.domElement.ownerDocument.removeEventListener(`pointermove`,this._onPointerMove),this.domElement.ownerDocument.removeEventListener(`pointerup`,this._onPointerUp),this.dispatchEvent(pa),this.state=J.NONE,this._cursorStyle===`grab`&&(this.domElement.style.cursor=`grab`);break;case 1:let t=this._pointers[0],n=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:n.x,pageY:n.y})}}function wa(e){let t;switch(e.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case tt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(e),this.state=J.DOLLY;break;case tt.ROTATE:if(e.ctrlKey||e.metaKey||e.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(e),this.state=J.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(e),this.state=J.ROTATE}break;case tt.PAN:if(e.ctrlKey||e.metaKey||e.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(e),this.state=J.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(e),this.state=J.PAN}break;default:this.state=J.NONE}this.state!==J.NONE&&this.dispatchEvent(fa)}function Ta(e){switch(this.state){case J.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(e);break;case J.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(e);break;case J.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(e)}}function Ea(e){this.enabled!==!1&&this.enableZoom!==!1&&this.state===J.NONE&&(e.preventDefault(),this.dispatchEvent(fa),this._handleMouseWheel(this._customWheelEvent(e)),this.dispatchEvent(pa))}function Da(e){this.enabled!==!1&&this._handleKeyDown(e)}function Oa(e){switch(this._trackPointer(e),this._pointers.length){case 1:switch(this.touches.ONE){case se.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(e),this.state=J.TOUCH_ROTATE;break;case se.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(e),this.state=J.TOUCH_PAN;break;default:this.state=J.NONE}break;case 2:switch(this.touches.TWO){case se.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(e),this.state=J.TOUCH_DOLLY_PAN;break;case se.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(e),this.state=J.TOUCH_DOLLY_ROTATE;break;default:this.state=J.NONE}break;default:this.state=J.NONE}this.state!==J.NONE&&this.dispatchEvent(fa)}function ka(e){switch(this._trackPointer(e),this.state){case J.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(e),this.update();break;case J.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(e),this.update();break;case J.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(e),this.update();break;case J.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(e),this.update();break;default:this.state=J.NONE}}function Aa(e){this.enabled!==!1&&e.preventDefault()}function ja(e){e.key===`Control`&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener(`keyup`,this._interceptControlUp,{passive:!0,capture:!0}))}function Ma(e){e.key===`Control`&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener(`keyup`,this._interceptControlUp,{passive:!0,capture:!0}))}function Na(e,t){if(t===0)return console.warn(`THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles.`),e;if(t===2||t===1){let n=e.getIndex();if(n===null){let t=[],r=e.getAttribute(`position`);if(r!==void 0){for(let e=0;e<r.count;e++)t.push(e);e.setIndex(t),n=e.getIndex()}else return console.error(`THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible.`),e}let r=n.count-2,i=[];if(t===2)for(let e=1;e<=r;e++)i.push(n.getX(0)),i.push(n.getX(e)),i.push(n.getX(e+1));else for(let e=0;e<r;e++)e%2==0?(i.push(n.getX(e)),i.push(n.getX(e+1)),i.push(n.getX(e+2))):(i.push(n.getX(e+2)),i.push(n.getX(e+1)),i.push(n.getX(e)));return i.length/3!==r&&console.error(`THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.`),e.setIndex(i),e.clearGroups(),e}return console.error(`THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:`,t),e}function Pa(e){let t=new Map,n=new Map,r=e.clone();return Fa(e,r,function(e,r){t.set(r,e),n.set(e,r)}),r.traverse(function(e){if(!e.isSkinnedMesh)return;let r=e,i=t.get(e),a=i.skeleton.bones;r.skeleton=i.skeleton.clone(),r.bindMatrix.copy(i.bindMatrix),r.skeleton.bones=a.map(function(e){return n.get(e)}),r.bind(r.skeleton,r.bindMatrix)}),r}function Fa(e,t,n){n(e,t);for(let r=0;r<e.children.length;r++)Fa(e.children[r],t.children[r],n)}var Ia=class extends Pe{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(e){return new Ha(e)}),this.register(function(e){return new Ua(e)}),this.register(function(e){return new Qa(e)}),this.register(function(e){return new $a(e)}),this.register(function(e){return new eo(e)}),this.register(function(e){return new Ga(e)}),this.register(function(e){return new Ka(e)}),this.register(function(e){return new qa(e)}),this.register(function(e){return new Ja(e)}),this.register(function(e){return new Va(e)}),this.register(function(e){return new Ya(e)}),this.register(function(e){return new Wa(e)}),this.register(function(e){return new Za(e)}),this.register(function(e){return new Xa(e)}),this.register(function(e){return new za(e)}),this.register(function(e){return new to(e,Y.EXT_MESHOPT_COMPRESSION)}),this.register(function(e){return new to(e,Y.KHR_MESHOPT_COMPRESSION)}),this.register(function(e){return new no(e)})}load(e,t,n,r){let i=this,a;if(this.resourcePath!==``)a=this.resourcePath;else if(this.path!==``){let t=gt.extractUrlBase(e);a=gt.resolveURL(t,this.path)}else a=gt.extractUrlBase(e);this.manager.itemStart(e);let o=function(t){r?r(t):console.error(t),i.manager.itemError(e),i.manager.itemEnd(e)},s=new l(this.manager);s.setPath(this.path),s.setResponseType(`arraybuffer`),s.setRequestHeader(this.requestHeader),s.setWithCredentials(this.withCredentials),s.load(e,function(n){try{i.parse(n,a,function(n){t(n),i.manager.itemEnd(e)},o)}catch(e){o(e)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,r){let i,a={},o={},s=new TextDecoder;if(typeof e==`string`)i=JSON.parse(e);else if(e instanceof ArrayBuffer){if(s.decode(new Uint8Array(e,0,4))===ro){try{a[Y.KHR_BINARY_GLTF]=new oo(e)}catch(e){r&&r(e);return}i=JSON.parse(a[Y.KHR_BINARY_GLTF].content)}else i=JSON.parse(s.decode(e))}else i=e;if(i.asset===void 0||i.asset.version[0]<2){r&&r(Error(`THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported.`));return}let c=new No(i,{path:t||this.resourcePath||``,crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let e=0;e<this.pluginCallbacks.length;e++){let t=this.pluginCallbacks[e](c);t.name||console.error(`THREE.GLTFLoader: Invalid plugin found: missing name`),o[t.name]=t,a[t.name]=!0}if(i.extensionsUsed)for(let e=0;e<i.extensionsUsed.length;++e){let t=i.extensionsUsed[e],n=i.extensionsRequired||[];switch(t){case Y.KHR_MATERIALS_UNLIT:a[t]=new Ba;break;case Y.KHR_DRACO_MESH_COMPRESSION:a[t]=new so(i,this.dracoLoader);break;case Y.KHR_TEXTURE_TRANSFORM:a[t]=new co;break;case Y.KHR_MESH_QUANTIZATION:a[t]=new lo;break;default:n.indexOf(t)>=0&&o[t]===void 0&&console.warn(`THREE.GLTFLoader: Unknown extension "`+t+`".`)}}c.setExtensions(a),c.setPlugins(o),c.parse(n,r)}parseAsync(e,t){let n=this;return new Promise(function(r,i){n.parse(e,t,r,i)})}};function La(){let e={};return{get:function(t){return e[t]},add:function(t,n){e[t]=n},remove:function(t){delete e[t]},removeAll:function(){e={}}}}function Ra(e,t,n){let r=e.json.materials[t];return r.extensions&&r.extensions[n]?r.extensions[n]:null}var Y={KHR_BINARY_GLTF:`KHR_binary_glTF`,KHR_DRACO_MESH_COMPRESSION:`KHR_draco_mesh_compression`,KHR_LIGHTS_PUNCTUAL:`KHR_lights_punctual`,KHR_MATERIALS_CLEARCOAT:`KHR_materials_clearcoat`,KHR_MATERIALS_DISPERSION:`KHR_materials_dispersion`,KHR_MATERIALS_IOR:`KHR_materials_ior`,KHR_MATERIALS_SHEEN:`KHR_materials_sheen`,KHR_MATERIALS_SPECULAR:`KHR_materials_specular`,KHR_MATERIALS_TRANSMISSION:`KHR_materials_transmission`,KHR_MATERIALS_IRIDESCENCE:`KHR_materials_iridescence`,KHR_MATERIALS_ANISOTROPY:`KHR_materials_anisotropy`,KHR_MATERIALS_UNLIT:`KHR_materials_unlit`,KHR_MATERIALS_VOLUME:`KHR_materials_volume`,KHR_TEXTURE_BASISU:`KHR_texture_basisu`,KHR_TEXTURE_TRANSFORM:`KHR_texture_transform`,KHR_MESH_QUANTIZATION:`KHR_mesh_quantization`,KHR_MATERIALS_EMISSIVE_STRENGTH:`KHR_materials_emissive_strength`,EXT_MATERIALS_BUMP:`EXT_materials_bump`,EXT_TEXTURE_WEBP:`EXT_texture_webp`,EXT_TEXTURE_AVIF:`EXT_texture_avif`,EXT_MESHOPT_COMPRESSION:`EXT_meshopt_compression`,KHR_MESHOPT_COMPRESSION:`KHR_meshopt_compression`,EXT_MESH_GPU_INSTANCING:`EXT_mesh_gpu_instancing`},za=class{constructor(e){this.parser=e,this.name=Y.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,r=t.length;n<r;n++){let r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n=`light:`+e,r=t.cache.get(n);if(r)return r;let i=t.json,a=((i.extensions&&i.extensions[this.name]||{}).lights||[])[e],o,c=new L(16777215);a.color!==void 0&&c.setRGB(a.color[0],a.color[1],a.color[2],P);let l=a.range===void 0?0:a.range;switch(a.type){case`directional`:o=new s(c),o.target.position.set(0,0,-1),o.add(o.target);break;case`point`:o=new ue(c),o.distance=l;break;case`spot`:o=new k(c),o.distance=l,a.spot=a.spot||{},a.spot.innerConeAngle=a.spot.innerConeAngle===void 0?0:a.spot.innerConeAngle,a.spot.outerConeAngle=a.spot.outerConeAngle===void 0?Math.PI/4:a.spot.outerConeAngle,o.angle=a.spot.outerConeAngle,o.penumbra=1-a.spot.innerConeAngle/a.spot.outerConeAngle,o.target.position.set(0,0,-1),o.add(o.target);break;default:throw Error(`THREE.GLTFLoader: Unexpected light type: `+a.type)}return o.position.set(0,0,0),To(o,a),a.intensity!==void 0&&(o.intensity=a.intensity),o.name=t.createUniqueName(a.name||`light_`+e),r=Promise.resolve(o),t.cache.add(n,r),r}getDependency(e,t){if(e===`light`)return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,r=n.json.nodes[e],i=(r.extensions&&r.extensions[this.name]||{}).light;return i===void 0?null:this._loadLight(i).then(function(e){return n._getNodeRef(t.cache,i,e)})}},Ba=class{constructor(){this.name=Y.KHR_MATERIALS_UNLIT}getMaterialType(){return Me}extendParams(e,t,n){let r=[];e.color=new L(1,1,1),e.opacity=1;let i=t.pbrMetallicRoughness;if(i){if(Array.isArray(i.baseColorFactor)){let t=i.baseColorFactor;e.color.setRGB(t[0],t[1],t[2],P),e.opacity=t[3]}i.baseColorTexture!==void 0&&r.push(n.assignTexture(e,`map`,i.baseColorTexture,p))}return Promise.all(r)}},Va=class{constructor(e){this.parser=e,this.name=Y.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let n=Ra(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}},Ha=class{constructor(e){this.parser=e,this.name=Y.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return Ra(this.parser,e,this.name)===null?null:ct}extendMaterialParams(e,t){let n=Ra(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&r.push(this.parser.assignTexture(t,`clearcoatMap`,n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&r.push(this.parser.assignTexture(t,`clearcoatRoughnessMap`,n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(r.push(this.parser.assignTexture(t,`clearcoatNormalMap`,n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){let e=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new z(e,e)}return Promise.all(r)}},Ua=class{constructor(e){this.parser=e,this.name=Y.KHR_MATERIALS_DISPERSION}getMaterialType(e){return Ra(this.parser,e,this.name)===null?null:ct}extendMaterialParams(e,t){let n=Ra(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion===void 0?0:n.dispersion),Promise.resolve()}},Wa=class{constructor(e){this.parser=e,this.name=Y.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return Ra(this.parser,e,this.name)===null?null:ct}extendMaterialParams(e,t){let n=Ra(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&r.push(this.parser.assignTexture(t,`iridescenceMap`,n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&r.push(this.parser.assignTexture(t,`iridescenceThicknessMap`,n.iridescenceThicknessTexture)),Promise.all(r)}},Ga=class{constructor(e){this.parser=e,this.name=Y.KHR_MATERIALS_SHEEN}getMaterialType(e){return Ra(this.parser,e,this.name)===null?null:ct}extendMaterialParams(e,t){let n=Ra(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];if(t.sheenColor=new L(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){let e=n.sheenColorFactor;t.sheenColor.setRGB(e[0],e[1],e[2],P)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&r.push(this.parser.assignTexture(t,`sheenColorMap`,n.sheenColorTexture,p)),n.sheenRoughnessTexture!==void 0&&r.push(this.parser.assignTexture(t,`sheenRoughnessMap`,n.sheenRoughnessTexture)),Promise.all(r)}},Ka=class{constructor(e){this.parser=e,this.name=Y.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return Ra(this.parser,e,this.name)===null?null:ct}extendMaterialParams(e,t){let n=Ra(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&r.push(this.parser.assignTexture(t,`transmissionMap`,n.transmissionTexture)),Promise.all(r)}},qa=class{constructor(e){this.parser=e,this.name=Y.KHR_MATERIALS_VOLUME}getMaterialType(e){return Ra(this.parser,e,this.name)===null?null:ct}extendMaterialParams(e,t){let n=Ra(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];t.thickness=n.thicknessFactor===void 0?0:n.thicknessFactor,n.thicknessTexture!==void 0&&r.push(this.parser.assignTexture(t,`thicknessMap`,n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;let i=n.attenuationColor||[1,1,1];return t.attenuationColor=new L().setRGB(i[0],i[1],i[2],P),Promise.all(r)}},Ja=class{constructor(e){this.parser=e,this.name=Y.KHR_MATERIALS_IOR}getMaterialType(e){return Ra(this.parser,e,this.name)===null?null:ct}extendMaterialParams(e,t){let n=Ra(this.parser,e,this.name);return n===null||(t.ior=n.ior===void 0?1.5:n.ior,t.ior===0&&(t.ior=1e3)),Promise.resolve()}},Ya=class{constructor(e){this.parser=e,this.name=Y.KHR_MATERIALS_SPECULAR}getMaterialType(e){return Ra(this.parser,e,this.name)===null?null:ct}extendMaterialParams(e,t){let n=Ra(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];t.specularIntensity=n.specularFactor===void 0?1:n.specularFactor,n.specularTexture!==void 0&&r.push(this.parser.assignTexture(t,`specularIntensityMap`,n.specularTexture));let i=n.specularColorFactor||[1,1,1];return t.specularColor=new L().setRGB(i[0],i[1],i[2],P),n.specularColorTexture!==void 0&&r.push(this.parser.assignTexture(t,`specularColorMap`,n.specularColorTexture,p)),Promise.all(r)}},Xa=class{constructor(e){this.parser=e,this.name=Y.EXT_MATERIALS_BUMP}getMaterialType(e){return Ra(this.parser,e,this.name)===null?null:ct}extendMaterialParams(e,t){let n=Ra(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];return t.bumpScale=n.bumpFactor===void 0?1:n.bumpFactor,n.bumpTexture!==void 0&&r.push(this.parser.assignTexture(t,`bumpMap`,n.bumpTexture)),Promise.all(r)}},Za=class{constructor(e){this.parser=e,this.name=Y.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return Ra(this.parser,e,this.name)===null?null:ct}extendMaterialParams(e,t){let n=Ra(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&r.push(this.parser.assignTexture(t,`anisotropyMap`,n.anisotropyTexture)),Promise.all(r)}},Qa=class{constructor(e){this.parser=e,this.name=Y.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,r=n.textures[e];if(!r.extensions||!r.extensions[this.name])return null;let i=r.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw Error(`THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures`);return null}return t.loadTextureImage(e,i.source,a)}},$a=class{constructor(e){this.parser=e,this.name=Y.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,n=this.parser,r=n.json,i=r.textures[e];if(!i.extensions||!i.extensions[t])return null;let a=i.extensions[t],o=r.images[a.source],s=n.textureLoader;if(o.uri){let e=n.options.manager.getHandler(o.uri);e!==null&&(s=e)}return n.loadTextureImage(e,a.source,s)}},eo=class{constructor(e){this.parser=e,this.name=Y.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,n=this.parser,r=n.json,i=r.textures[e];if(!i.extensions||!i.extensions[t])return null;let a=i.extensions[t],o=r.images[a.source],s=n.textureLoader;if(o.uri){let e=n.options.manager.getHandler(o.uri);e!==null&&(s=e)}return n.loadTextureImage(e,a.source,s)}},to=class{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let e=n.extensions[this.name],r=this.parser.getDependency(`buffer`,e.buffer),i=this.parser.options.meshoptDecoder;if(!i||!i.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw Error(`THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files`);return null}return r.then(function(t){let n=e.byteOffset||0,r=e.byteLength||0,a=e.count,o=e.byteStride,s=new Uint8Array(t,n,r);return i.decodeGltfBufferAsync?i.decodeGltfBufferAsync(a,o,s,e.mode,e.filter).then(function(e){return e.buffer}):i.ready.then(function(){let t=new ArrayBuffer(a*o);return i.decodeGltfBuffer(new Uint8Array(t),a,o,s,e.mode,e.filter),t})})}return null}},no=class{constructor(e){this.name=Y.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let r=t.meshes[n.mesh];for(let e of r.primitives)if(e.mode!==mo.TRIANGLES&&e.mode!==mo.TRIANGLE_STRIP&&e.mode!==mo.TRIANGLE_FAN&&e.mode!==void 0)return null;let i=n.extensions[this.name].attributes,a=[],o={};for(let e in i)a.push(this.parser.getDependency(`accessor`,i[e]).then(t=>(o[e]=t,o[e])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(e=>{let t=e.pop(),n=t.isGroup?t.children:[t],r=e[0].count,i=[];for(let e of n){let t=new it,n=new G,a=new Ke,s=new G(1,1,1),c=new O(e.geometry,e.material,r);for(let e=0;e<r;e++)o.TRANSLATION&&n.fromBufferAttribute(o.TRANSLATION,e),o.ROTATION&&a.fromBufferAttribute(o.ROTATION,e),o.SCALE&&s.fromBufferAttribute(o.SCALE,e),c.setMatrixAt(e,t.compose(n,a,s));let l=null;for(let e in o)if(e===`_COLOR_0`){let t=o[e];c.instanceColor=new x(t.array,t.itemSize,t.normalized)}else if(e!==`TRANSLATION`&&e!==`ROTATION`&&e!==`SCALE`){if(l===null){let e=c.geometry;l=new Ae,l.name=e.name;for(let t in e.attributes)l.setAttribute(t,e.attributes[t]);for(let t in e.morphAttributes)l.morphAttributes[t]=e.morphAttributes[t];e.index!==null&&l.setIndex(e.index),l.morphTargetsRelative=e.morphTargetsRelative;for(let t of e.groups)l.addGroup(t.start,t.count,t.materialIndex);e.boundingBox!==null&&(l.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(l.boundingSphere=e.boundingSphere.clone()),l.drawRange.start=e.drawRange.start,l.drawRange.count=e.drawRange.count,l.userData=Object.assign({},e.userData),c.geometry=l}let t=o[e];l.setAttribute(e,new x(t.array,t.itemSize,t.normalized))}ke.prototype.copy.call(c,e),this.parser.assignFinalMaterial(c),i.push(c)}return t.isGroup?(t.clear(),t.add(...i),t):i[0]}))}},ro=`glTF`,io=12,ao={JSON:1313821514,BIN:5130562},oo=class{constructor(e){this.name=Y.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,io),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==ro)throw Error(`THREE.GLTFLoader: Unsupported glTF-Binary header.`);if(this.header.version<2)throw Error(`THREE.GLTFLoader: Legacy binary file detected.`);let r=this.header.length-io,i=new DataView(e,io),a=0;for(;a<r;){let t=i.getUint32(a,!0);a+=4;let r=i.getUint32(a,!0);if(a+=4,r===ao.JSON){let r=new Uint8Array(e,io+a,t);this.content=n.decode(r)}else if(r===ao.BIN){let n=io+a;this.body=e.slice(n,n+t)}a+=t}if(this.content===null)throw Error(`THREE.GLTFLoader: JSON content not found.`)}},so=class{constructor(e,t){if(!t)throw Error(`THREE.GLTFLoader: No DRACOLoader instance provided.`);this.name=Y.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,r=this.dracoLoader,i=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},s={},c={};for(let e in a){let t=yo[e]||e.toLowerCase();o[t]=a[e]}for(let t in e.attributes){let r=yo[t]||t.toLowerCase();if(a[t]!==void 0){let i=n.accessors[e.attributes[t]];c[r]=ho[i.componentType].name,s[r]=i.normalized===!0}}return t.getDependency(`bufferView`,i).then(function(e){return new Promise(function(t,n){r.decodeDracoFile(e,function(e){for(let t in e.attributes){let n=e.attributes[t],r=s[t];r!==void 0&&(n.normalized=r)}t(e)},o,c,P,n)})})}},co=class{constructor(){this.name=Y.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){if((t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0)return e;if(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),t.rotation!==void 0){let t=Math.cos(e.rotation),n=Math.sin(e.rotation);e.matrix.set(e.repeat.x*t,e.repeat.y*n,e.offset.x,-e.repeat.x*n,e.repeat.y*t,e.offset.y,0,0,1),e.matrixAutoUpdate=!1}return e.needsUpdate=!0,e}},lo=class{constructor(){this.name=Y.KHR_MESH_QUANTIZATION}},uo=class extends pe{constructor(e,t,n,r){super(e,t,n,r)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r*3+r;for(let e=0;e!==r;e++)t[e]=n[i+e];return t}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=o*2,c=o*3,l=r-t,u=(n-t)/l,d=u*u,f=d*u,p=e*c,m=p-c,h=-2*f+3*d,g=f-d,_=1-h,v=g-d+u;for(let e=0;e!==o;e++){let t=a[m+e+o],n=a[m+e+s]*l,r=a[p+e+o],c=a[p+e]*l;i[e]=_*t+v*n+h*r+g*c}return i}},fo=new Ke,po=class extends uo{interpolate_(e,t,n,r){let i=super.interpolate_(e,t,n,r);return fo.fromArray(i).normalize().toArray(i),i}},mo={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},ho={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},go={9728:U,9729:ve,9984:xt,9985:ye,9986:we,9987:ge},_o={33071:_t,33648:ze,10497:Oe},vo={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},yo={POSITION:`position`,NORMAL:`normal`,TANGENT:`tangent`,TEXCOORD_0:`uv`,TEXCOORD_1:`uv1`,TEXCOORD_2:`uv2`,TEXCOORD_3:`uv3`,COLOR_0:`color`,WEIGHTS_0:`skinWeight`,JOINTS_0:`skinIndex`},bo={scale:`scale`,translation:`position`,rotation:`quaternion`,weights:`morphTargetInfluences`},xo={CUBICSPLINE:void 0,LINEAR:de,STEP:y},So={OPAQUE:`OPAQUE`,MASK:`MASK`,BLEND:`BLEND`};function Co(e){return e.DefaultMaterial===void 0&&(e.DefaultMaterial=new Qe({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:0})),e.DefaultMaterial}function wo(e,t,n){for(let r in n.extensions)e[r]===void 0&&(t.userData.gltfExtensions=t.userData.gltfExtensions||{},t.userData.gltfExtensions[r]=n.extensions[r])}function To(e,t){t.extras!==void 0&&(typeof t.extras==`object`?Object.assign(e.userData,t.extras):console.warn(`THREE.GLTFLoader: Ignoring primitive type .extras, `+t.extras))}function Eo(e,t,n){let r=!1,i=!1,a=!1;for(let e=0,n=t.length;e<n;e++){let n=t[e];if(n.POSITION!==void 0&&(r=!0),n.NORMAL!==void 0&&(i=!0),n.COLOR_0!==void 0&&(a=!0),r&&i&&a)break}if(!r&&!i&&!a)return Promise.resolve(e);let o=[],s=[],c=[];for(let l=0,u=t.length;l<u;l++){let u=t[l];if(r){let t=u.POSITION===void 0?e.attributes.position:n.getDependency(`accessor`,u.POSITION);o.push(t)}if(i){let t=u.NORMAL===void 0?e.attributes.normal:n.getDependency(`accessor`,u.NORMAL);s.push(t)}if(a){let t=u.COLOR_0===void 0?e.attributes.color:n.getDependency(`accessor`,u.COLOR_0);c.push(t)}}return Promise.all([Promise.all(o),Promise.all(s),Promise.all(c)]).then(function(t){let n=t[0],o=t[1],s=t[2];return r&&(e.morphAttributes.position=n),i&&(e.morphAttributes.normal=o),a&&(e.morphAttributes.color=s),e.morphTargetsRelative=!0,e})}function Do(e,t){if(e.updateMorphTargets(),t.weights!==void 0)for(let n=0,r=t.weights.length;n<r;n++)e.morphTargetInfluences[n]=t.weights[n];if(t.extras&&Array.isArray(t.extras.targetNames)){let n=t.extras.targetNames;if(e.morphTargetInfluences.length===n.length){e.morphTargetDictionary={};for(let t=0,r=n.length;t<r;t++)e.morphTargetDictionary[n[t]]=t}else console.warn(`THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.`)}}function Oo(e){let t,n=e.extensions&&e.extensions[Y.KHR_DRACO_MESH_COMPRESSION];if(t=n?`draco:`+n.bufferView+`:`+n.indices+`:`+ko(n.attributes):e.indices+`:`+ko(e.attributes)+`:`+e.mode,e.targets!==void 0)for(let n=0,r=e.targets.length;n<r;n++)t+=`:`+ko(e.targets[n]);return t}function ko(e){let t=``,n=Object.keys(e).sort();for(let r=0,i=n.length;r<i;r++)t+=n[r]+`:`+e[n[r]]+`;`;return t}function Ao(e){switch(e){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw Error(`THREE.GLTFLoader: Unsupported normalized accessor component type.`)}}function jo(e){return e.search(/\.jpe?g($|\?)/i)>0||e.search(/^data\:image\/jpeg/)===0?`image/jpeg`:e.search(/\.webp($|\?)/i)>0||e.search(/^data\:image\/webp/)===0?`image/webp`:e.search(/\.ktx2($|\?)/i)>0||e.search(/^data\:image\/ktx2/)===0?`image/ktx2`:`image/png`}var Mo=new it,No=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new La,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,r=-1,i=!1,a=-1;if(typeof navigator<`u`&&navigator.userAgent!==void 0){let e=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(e)===!0;let t=e.match(/Version\/(\d+)/);r=n&&t?parseInt(t[1],10):-1,i=e.indexOf(`Firefox`)>-1,a=i?e.match(/Firefox\/([0-9]+)\./)[1]:-1}this.textureLoader=typeof createImageBitmap>`u`||n&&r<17||i&&a<98?new o(this.options.manager):new h(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new l(this.options.manager),this.fileLoader.setResponseType(`arraybuffer`),this.options.crossOrigin===`use-credentials`&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,r=this.json,i=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(e){return e._markDefs&&e._markDefs()}),Promise.all(this._invokeAll(function(e){return e.beforeRoot&&e.beforeRoot()})).then(function(){return Promise.all([n.getDependencies(`scene`),n.getDependencies(`animation`),n.getDependencies(`camera`)])}).then(function(t){let a={scene:t[0][r.scene||0],scenes:t[0],animations:t[1],cameras:t[2],asset:r.asset,parser:n,userData:{}};return wo(i,a,r),To(a,r),Promise.all(n._invokeAll(function(e){return e.afterRoot&&e.afterRoot(a)})).then(function(){for(let e of a.scenes)e.updateMatrixWorld();e(a)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let n=0,r=t.length;n<r;n++){let r=t[n].joints;for(let t=0,n=r.length;t<n;t++)e[r[t]].isBone=!0}for(let t=0,r=e.length;t<r;t++){let r=e[t];r.mesh!==void 0&&(this._addNodeRef(this.meshCache,r.mesh),r.skin!==void 0&&(n[r.mesh].isSkinnedMesh=!0)),r.camera!==void 0&&this._addNodeRef(this.cameraCache,r.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let r=n.clone(),i=(e,t)=>{let n=this.associations.get(e);n!=null&&this.associations.set(t,n);for(let[n,r]of e.children.entries())i(r,t.children[n])};return i(n,r),r.name+=`_instance_`+e.uses[t]++,r}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let r=e(t[n]);if(r)return r}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let r=0;r<t.length;r++){let i=e(t[r]);i&&n.push(i)}return n}getDependency(e,t){let n=e+`:`+t,r=this.cache.get(n);if(!r){switch(e){case`scene`:r=this.loadScene(t);break;case`node`:r=this._invokeOne(function(e){return e.loadNode&&e.loadNode(t)});break;case`mesh`:r=this._invokeOne(function(e){return e.loadMesh&&e.loadMesh(t)});break;case`accessor`:r=this.loadAccessor(t);break;case`bufferView`:r=this._invokeOne(function(e){return e.loadBufferView&&e.loadBufferView(t)});break;case`buffer`:r=this.loadBuffer(t);break;case`material`:r=this._invokeOne(function(e){return e.loadMaterial&&e.loadMaterial(t)});break;case`texture`:r=this._invokeOne(function(e){return e.loadTexture&&e.loadTexture(t)});break;case`skin`:r=this.loadSkin(t);break;case`animation`:r=this._invokeOne(function(e){return e.loadAnimation&&e.loadAnimation(t)});break;case`camera`:r=this.loadCamera(t);break;default:if(r=this._invokeOne(function(n){return n!=this&&n.getDependency&&n.getDependency(e,t)}),!r)throw Error(`Unknown type: `+e)}this.cache.add(n,r)}return r}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,r=this.json[e+(e===`mesh`?`es`:`s`)]||[];t=Promise.all(r.map(function(t,r){return n.getDependency(e,r)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!==`arraybuffer`)throw Error(`THREE.GLTFLoader: `+t.type+` buffer type is not supported.`);if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[Y.KHR_BINARY_GLTF].body);let r=this.options;return new Promise(function(e,i){n.load(gt.resolveURL(t.uri,r.path),e,void 0,function(){i(Error(`THREE.GLTFLoader: Failed to load buffer "`+t.uri+`".`))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency(`buffer`,t.buffer).then(function(e){let n=t.byteLength||0,r=t.byteOffset||0;return e.slice(r,r+n)})}loadAccessor(e){let t=this,n=this.json,r=this.json.accessors[e];if(r.bufferView===void 0&&r.sparse===void 0){let e=vo[r.type],t=ho[r.componentType],n=r.normalized===!0,i=new t(r.count*e);return Promise.resolve(new pt(i,e,n))}let i=[];return r.bufferView===void 0?i.push(null):i.push(this.getDependency(`bufferView`,r.bufferView)),r.sparse!==void 0&&(i.push(this.getDependency(`bufferView`,r.sparse.indices.bufferView)),i.push(this.getDependency(`bufferView`,r.sparse.values.bufferView))),Promise.all(i).then(function(e){let i=e[0],o=vo[r.type],s=ho[r.componentType],c=s.BYTES_PER_ELEMENT,l=c*o,u=r.byteOffset||0,d=r.bufferView===void 0?void 0:n.bufferViews[r.bufferView].byteStride,f=r.normalized===!0,p,m;if(d&&d!==l){let e=Math.floor(u/d),n=`InterleavedBuffer:`+r.bufferView+`:`+r.componentType+`:`+e+`:`+r.count,l=t.cache.get(n);l||(p=new s(i,e*d,r.count*d/c),l=new At(p,d/c),t.cache.add(n,l)),m=new a(l,o,u%d/c,f)}else p=i===null?new s(r.count*o):new s(i,u,r.count*o),m=new pt(p,o,f);if(r.sparse!==void 0){let t=vo.SCALAR,n=ho[r.sparse.indices.componentType],a=r.sparse.indices.byteOffset||0,c=r.sparse.values.byteOffset||0,l=new n(e[1],a,r.sparse.count*t),u=new s(e[2],c,r.sparse.count*o);i!==null&&(m=new pt(m.array.slice(),m.itemSize,m.normalized)),m.normalized=!1;for(let e=0,t=l.length;e<t;e++){let t=l[e];if(m.setX(t,u[e*o]),o>=2&&m.setY(t,u[e*o+1]),o>=3&&m.setZ(t,u[e*o+2]),o>=4&&m.setW(t,u[e*o+3]),o>=5)throw Error(`THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.`)}m.normalized=f}return m})}loadTexture(e){let t=this.json,n=this.options,r=t.textures[e].source,i=t.images[r],a=this.textureLoader;if(i.uri){let e=n.manager.getHandler(i.uri);e!==null&&(a=e)}return this.loadTextureImage(e,r,a)}loadTextureImage(e,t,n){let r=this,i=this.json,a=i.textures[e],o=i.images[t],s=(o.uri||o.bufferView)+`:`+a.sampler;if(this.textureCache[s])return this.textureCache[s];let c=this.loadImageSource(t,n).then(function(t){t.flipY=!1,t.name=a.name||o.name||``,t.name===``&&typeof o.uri==`string`&&o.uri.startsWith(`data:image/`)===!1&&(t.name=o.uri);let n=(i.samplers||{})[a.sampler]||{};return t.magFilter=go[n.magFilter]||1006,t.minFilter=go[n.minFilter]||1008,t.wrapS=_o[n.wrapS]||1e3,t.wrapT=_o[n.wrapT]||1e3,t.generateMipmaps=!t.isCompressedTexture&&t.minFilter!==1003&&t.minFilter!==1006,r.associations.set(t,{textures:e}),t}).catch(function(){return null});return this.textureCache[s]=c,c}loadImageSource(e,t){let n=this,r=this.json,i=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(e=>e.clone());let a=r.images[e],o=self.URL||self.webkitURL,s=a.uri||``,c=!1;if(a.bufferView!==void 0)s=n.getDependency(`bufferView`,a.bufferView).then(function(e){c=!0;let t=new Blob([e],{type:a.mimeType});return s=o.createObjectURL(t),s});else if(a.uri===void 0)throw Error(`THREE.GLTFLoader: Image `+e+` is missing URI and bufferView`);let l=Promise.resolve(s).then(function(e){return new Promise(function(n,r){let a=n;t.isImageBitmapLoader===!0&&(a=function(e){let t=new jt(e);t.needsUpdate=!0,n(t)}),t.load(gt.resolveURL(e,i.path),a,void 0,r)})}).then(function(e){return c===!0&&o.revokeObjectURL(s),To(e,a),e.userData.mimeType=a.mimeType||jo(a.uri),e}).catch(function(e){throw console.error(`THREE.GLTFLoader: Couldn't load texture`,s),e});return this.sourceCache[e]=l,l}assignTexture(e,t,n,r){let i=this;return this.getDependency(`texture`,n.index).then(function(a){if(!a)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(a=a.clone(),a.channel=n.texCoord),i.extensions[Y.KHR_TEXTURE_TRANSFORM]){let e=n.extensions===void 0?void 0:n.extensions[Y.KHR_TEXTURE_TRANSFORM];if(e){let t=i.associations.get(a);a=i.extensions[Y.KHR_TEXTURE_TRANSFORM].extendTexture(a,e),i.associations.set(a,t)}}return r!==void 0&&(a.colorSpace=r),e[t]=a,a})}assignFinalMaterial(e){let t=e.geometry,n=e.material,r=t.attributes.tangent===void 0,i=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){let e=`PointsMaterial:`+n.uuid,t=this.cache.get(e);t||(t=new d,ft.prototype.copy.call(t,n),t.color.copy(n.color),t.map=n.map,t.sizeAttenuation=!1,this.cache.add(e,t)),n=t}else if(e.isLine){let e=`LineBasicMaterial:`+n.uuid,t=this.cache.get(e);t||(t=new E,ft.prototype.copy.call(t,n),t.color.copy(n.color),t.map=n.map,this.cache.add(e,t)),n=t}if(r||i||a){let e=`ClonedMaterial:`+n.uuid+`:`;r&&(e+=`derivative-tangents:`),i&&(e+=`vertex-colors:`),a&&(e+=`flat-shading:`);let t=this.cache.get(e);t||(t=n.clone(),i&&(t.vertexColors=!0),a&&(t.flatShading=!0),r&&(t.normalScale&&(t.normalScale.y*=-1),t.clearcoatNormalScale&&(t.clearcoatNormalScale.y*=-1)),this.cache.add(e,t),this.associations.set(t,this.associations.get(n))),n=t}e.material=n}getMaterialType(){return Qe}loadMaterial(e){let t=this,n=this.json,r=this.extensions,i=n.materials[e],a,o={},s=i.extensions||{},c=[];if(s[Y.KHR_MATERIALS_UNLIT]){let e=r[Y.KHR_MATERIALS_UNLIT];a=e.getMaterialType(),c.push(e.extendParams(o,i,t))}else{let n=i.pbrMetallicRoughness||{};if(o.color=new L(1,1,1),o.opacity=1,Array.isArray(n.baseColorFactor)){let e=n.baseColorFactor;o.color.setRGB(e[0],e[1],e[2],P),o.opacity=e[3]}n.baseColorTexture!==void 0&&c.push(t.assignTexture(o,`map`,n.baseColorTexture,p)),o.metalness=n.metallicFactor===void 0?1:n.metallicFactor,o.roughness=n.roughnessFactor===void 0?1:n.roughnessFactor,n.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(o,`metalnessMap`,n.metallicRoughnessTexture)),c.push(t.assignTexture(o,`roughnessMap`,n.metallicRoughnessTexture))),a=this._invokeOne(function(t){return t.getMaterialType&&t.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(t){return t.extendMaterialParams&&t.extendMaterialParams(e,o)})))}i.doubleSided===!0&&(o.side=2);let l=i.alphaMode||So.OPAQUE;if(l===So.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,l===So.MASK&&(o.alphaTest=i.alphaCutoff===void 0?.5:i.alphaCutoff)),i.normalTexture!==void 0&&a!==Me&&(c.push(t.assignTexture(o,`normalMap`,i.normalTexture)),o.normalScale=new z(1,1),i.normalTexture.scale!==void 0)){let e=i.normalTexture.scale;o.normalScale.set(e,e)}if(i.occlusionTexture!==void 0&&a!==Me&&(c.push(t.assignTexture(o,`aoMap`,i.occlusionTexture)),i.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=i.occlusionTexture.strength)),i.emissiveFactor!==void 0&&a!==Me){let e=i.emissiveFactor;o.emissive=new L().setRGB(e[0],e[1],e[2],P)}return i.emissiveTexture!==void 0&&a!==Me&&c.push(t.assignTexture(o,`emissiveMap`,i.emissiveTexture,p)),Promise.all(c).then(function(){let n=new a(o);return i.name&&(n.name=i.name),To(n,i),t.associations.set(n,{materials:e}),i.extensions&&wo(r,n,i),n})}createUniqueName(e){let t=re.sanitizeNodeName(e||``);return t in this.nodeNamesUsed?t+`_`+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,n=this.extensions,r=this.primitiveCache;function i(e){return n[Y.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(e,t).then(function(n){return Fo(n,e,t)})}let a=[];for(let n=0,o=e.length;n<o;n++){let o=e[n],s=Oo(o),c=r[s];if(c)a.push(c.promise);else{let e;e=o.extensions&&o.extensions[Y.KHR_DRACO_MESH_COMPRESSION]?i(o):Fo(new Ae,o,t),o.mode===mo.TRIANGLE_STRIP?e=e.then(e=>Na(e,1)):o.mode===mo.TRIANGLE_FAN&&(e=e.then(e=>Na(e,2))),r[s]={primitive:o,promise:e},a.push(e)}}return Promise.all(a)}loadMesh(e){let t=this,n=this.json,r=this.extensions,i=n.meshes[e],a=i.primitives,o=[];for(let e=0,t=a.length;e<t;e++){let t=a[e].material===void 0?Co(this.cache):this.getDependency(`material`,a[e].material);o.push(t)}return o.push(t.loadGeometries(a)),Promise.all(o).then(async function(n){let o=n.slice(0,n.length-1),s=n[n.length-1],c=[];for(let n=0,l=s.length;n<l;n++){let l=s[n],u=a[n],d,f=o[n];if(u.mode===mo.TRIANGLES||u.mode===mo.TRIANGLE_STRIP||u.mode===mo.TRIANGLE_FAN||u.mode===void 0){let e=i.isSkinnedMesh===!0,t=l.hasAttribute(`skinIndex`)&&l.hasAttribute(`skinWeight`);e&&t===!1&&console.warn(`THREE.GLTFLoader: Missing skinIndex or skinWeight attributes. Skinning disabled.`),d=e&&t?new ae(l,f):new ht(l,f),d.isSkinnedMesh===!0&&d.normalizeSkinWeights()}else if(u.mode===mo.LINES)d=new w(l,f);else if(u.mode===mo.LINE_STRIP)d=new _(l,f);else if(u.mode===mo.LINE_LOOP)d=new lt(l,f);else if(u.mode===mo.POINTS)d=new m(l,f);else throw Error(`THREE.GLTFLoader: Primitive mode unsupported: `+u.mode);Object.keys(d.geometry.morphAttributes).length>0&&Do(d,i),d.name=t.createUniqueName(i.name||`mesh_`+e),To(d,i),u.extensions&&wo(r,d,u),t.assignFinalMaterial(d),c.push(d)}for(let n=0,r=c.length;n<r;n++)t.associations.set(c[n],{meshes:e,primitives:n});if(c.length===1)return i.extensions&&wo(r,c[0],i),c[0];let l=new A;i.extensions&&wo(r,l,i),t.associations.set(l,{meshes:e});for(let e=0,t=c.length;e<t;e++)l.add(c[e]);return l})}loadCamera(e){let t,n=this.json.cameras[e],r=n[n.type];if(!r)console.warn(`THREE.GLTFLoader: Missing camera parameters.`);else return n.type===`perspective`?t=new F(He.radToDeg(r.yfov),r.aspectRatio||1,r.znear||1,r.zfar||2e6):n.type===`orthographic`&&(t=new Et(-r.xmag,r.xmag,r.ymag,-r.ymag,r.znear,r.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),To(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let e=0,r=t.joints.length;e<r;e++)n.push(this._loadNodeShallow(t.joints[e]));return t.inverseBindMatrices===void 0?n.push(null):n.push(this.getDependency(`accessor`,t.inverseBindMatrices)),Promise.all(n).then(function(e){let n=e.pop(),r=e,i=[],a=[];for(let e=0,o=r.length;e<o;e++){let o=r[e];if(o){i.push(o);let t=new it;n!==null&&t.fromArray(n.array,e*16),a.push(t)}else console.warn(`THREE.GLTFLoader: Joint "%s" could not be found.`,t.joints[e])}return new M(i,a)})}loadAnimation(e){let t=this.json,n=this,r=t.animations[e],i=r.name?r.name:`animation_`+e,a=[],o=[],s=[],c=[],l=[];for(let e=0,t=r.channels.length;e<t;e++){let t=r.channels[e],n=r.samplers[t.sampler],i=t.target,u=i.node,d=r.parameters===void 0?n.input:r.parameters[n.input],f=r.parameters===void 0?n.output:r.parameters[n.output];i.node!==void 0&&(a.push(this.getDependency(`node`,u)),o.push(this.getDependency(`accessor`,d)),s.push(this.getDependency(`accessor`,f)),c.push(n),l.push(i))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(s),Promise.all(c),Promise.all(l)]).then(function(e){let t=e[0],a=e[1],o=e[2],s=e[3],c=e[4],l=[];for(let e=0,r=t.length;e<r;e++){let r=t[e],i=a[e],u=o[e],d=s[e],f=c[e];if(r===void 0)continue;r.updateMatrix&&r.updateMatrix();let p=n._createAnimationTracks(r,i,u,d,f);if(p)for(let e=0;e<p.length;e++)l.push(p[e])}let u=new $e(i,void 0,l);return To(u,r),u})}createNodeMesh(e){let t=this.json,n=this,r=t.nodes[e];return r.mesh===void 0?null:n.getDependency(`mesh`,r.mesh).then(function(e){let t=n._getNodeRef(n.meshCache,r.mesh,e);return r.weights!==void 0&&t.traverse(function(e){if(e.isMesh)for(let t=0,n=r.weights.length;t<n;t++)e.morphTargetInfluences[t]=r.weights[t]}),t})}loadNode(e){let t=this.json,n=this,r=t.nodes[e],i=n._loadNodeShallow(e),a=[],o=r.children||[];for(let e=0,t=o.length;e<t;e++)a.push(n.getDependency(`node`,o[e]));let s=r.skin===void 0?Promise.resolve(null):n.getDependency(`skin`,r.skin);return Promise.all([i,Promise.all(a),s]).then(function(e){let t=e[0],n=e[1],r=e[2];r!==null&&t.traverse(function(e){e.isSkinnedMesh&&e.bind(r,Mo)});for(let e=0,r=n.length;e<r;e++)t.add(n[e]);if(t.userData.pivot!==void 0&&n.length>0){let e=t.userData.pivot,r=n[0];t.pivot=new G().fromArray(e),t.position.x-=e[0],t.position.y-=e[1],t.position.z-=e[2],r.position.set(0,0,0),delete t.userData.pivot}return t})}_loadNodeShallow(e){let t=this.json,n=this.extensions,r=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let i=t.nodes[e],a=i.name?r.createUniqueName(i.name):``,o=[],s=r._invokeOne(function(t){return t.createNodeMesh&&t.createNodeMesh(e)});return s&&o.push(s),i.camera!==void 0&&o.push(r.getDependency(`camera`,i.camera).then(function(e){return r._getNodeRef(r.cameraCache,i.camera,e)})),r._invokeAll(function(t){return t.createNodeAttachment&&t.createNodeAttachment(e)}).forEach(function(e){o.push(e)}),this.nodeCache[e]=Promise.all(o).then(function(t){let o;if(o=i.isBone===!0?new Be:t.length>1?new A:t.length===1?t[0]:new ke,o!==t[0])for(let e=0,n=t.length;e<n;e++)o.add(t[e]);if(i.name&&(o.userData.name=i.name,o.name=a),To(o,i),i.extensions&&wo(n,o,i),i.matrix!==void 0){let e=new it;e.fromArray(i.matrix),o.applyMatrix4(e)}else i.translation!==void 0&&o.position.fromArray(i.translation),i.rotation!==void 0&&o.quaternion.fromArray(i.rotation),i.scale!==void 0&&o.scale.fromArray(i.scale);if(!r.associations.has(o))r.associations.set(o,{});else if(i.mesh!==void 0&&r.meshCache.refs[i.mesh]>1){let e=r.associations.get(o);r.associations.set(o,{...e})}return r.associations.get(o).nodes=e,o}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],r=this,i=new A;n.name&&(i.name=r.createUniqueName(n.name)),To(i,n),n.extensions&&wo(t,i,n);let a=n.nodes||[],o=[];for(let e=0,t=a.length;e<t;e++)o.push(r.getDependency(`node`,a[e]));return Promise.all(o).then(function(e){for(let t=0,n=e.length;t<n;t++){let n=e[t];n.parent===null?i.add(n):i.add(Pa(n))}return r.associations=(e=>{let t=new Map;for(let[e,n]of r.associations)(e instanceof ft||e instanceof jt)&&t.set(e,n);return e.traverse(e=>{let n=r.associations.get(e);n!=null&&t.set(e,n)}),t})(i),i})}_createAnimationTracks(e,t,n,r,a){let o=[],s=e.name?e.name:e.uuid,c=[];function l(e){e.morphTargetInfluences&&c.push(e.name?e.name:e.uuid)}bo[a.path]===bo.weights?(l(e),e.isGroup&&e.children.forEach(l)):c.push(s);let u;switch(bo[a.path]){case bo.weights:u=kt;break;case bo.rotation:u=i;break;case bo.translation:case bo.scale:u=dt;break;default:switch(n.itemSize){case 1:u=kt;break;default:u=dt}}let d=r.interpolation===void 0?de:xo[r.interpolation],f=this._getArrayFromAccessor(n);for(let e=0,n=c.length;e<n;e++){let n=new u(c[e]+`.`+bo[a.path],t.array,f,d);r.interpolation===`CUBICSPLINE`&&this._createCubicSplineTrackInterpolant(n),o.push(n)}return o}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let e=Ao(t.constructor),n=new Float32Array(t.length);for(let r=0,i=t.length;r<i;r++)n[r]=t[r]*e;t=n}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(e){return new(this instanceof i?po:uo)(this.times,this.values,this.getValueSize()/3,e)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function Po(e,t,n){let r=t.attributes,i=new Te;if(r.POSITION!==void 0){let e=n.json.accessors[r.POSITION],t=e.min,a=e.max;if(t!==void 0&&a!==void 0){if(i.set(new G(t[0],t[1],t[2]),new G(a[0],a[1],a[2])),e.normalized){let t=Ao(ho[e.componentType]);i.min.multiplyScalar(t),i.max.multiplyScalar(t)}}else{console.warn(`THREE.GLTFLoader: Missing min/max properties for accessor POSITION.`);return}}else return;let a=t.targets;if(a!==void 0){let e=new G,t=new G;for(let r=0,i=a.length;r<i;r++){let i=a[r];if(i.POSITION!==void 0){let r=n.json.accessors[i.POSITION],a=r.min,o=r.max;if(a!==void 0&&o!==void 0){if(t.setX(Math.max(Math.abs(a[0]),Math.abs(o[0]))),t.setY(Math.max(Math.abs(a[1]),Math.abs(o[1]))),t.setZ(Math.max(Math.abs(a[2]),Math.abs(o[2]))),r.normalized){let e=Ao(ho[r.componentType]);t.multiplyScalar(e)}e.max(t)}else console.warn(`THREE.GLTFLoader: Missing min/max properties for accessor POSITION.`)}}i.expandByVector(e)}e.boundingBox=i;let o=new g;i.getCenter(o.center),o.radius=i.min.distanceTo(i.max)/2,e.boundingSphere=o}function Fo(e,t,n){let r=t.attributes,i=[];function a(t,r){return n.getDependency(`accessor`,t).then(function(t){e.setAttribute(r,t)})}for(let t in r){let n=yo[t]||t.toLowerCase();n in e.attributes||i.push(a(r[t],n))}if(t.indices!==void 0&&!e.index){let r=n.getDependency(`accessor`,t.indices).then(function(t){e.setIndex(t)});i.push(r)}return B.workingColorSpace!==`srgb-linear`&&`COLOR_0`in r&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${B.workingColorSpace}" not supported.`),To(e,t),Po(e,t,n),Promise.all(i).then(function(){return t.targets===void 0?e:Eo(e,t.targets,n)})}var Io=(function(){var e=`b9H79Tebbbe8Fv9Gbb9Gvuuuuueu9Giuuub9Geueu9Giuuueuixkbeeeddddillviebeoweuecj:Gdkr;Neqo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbeY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVbdE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbiL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtblK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949WboY9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVJ9V29VVbrl79IV9Rbwq:VZkdbk:XYi5ud9:du8Jjjjjbcj;kb9Rgv8Kjjjjbc9:hodnalTmbcuhoaiRbbgrc;WeGc:Ge9hmbarcsGgwce0mbc9:hoalcufadcd4cbawEgDadfgrcKcaawEgqaraq0Egk6mbaicefhxcj;abad9Uc;WFbGcjdadca0EhmaialfgPar9Rgoadfhsavaoadz:jjjjbgzceVhHcbhOdndninaeaO9nmeaPax9RaD6mdamaeaO9RaOamfgoae6EgAcsfglc9WGhCabaOad2fhXaAcethQaxaDfhiaOaeaoaeao6E9RhLalcl4cifcd4hKazcj;cbfaAfhYcbh8AazcjdfhEaHh3incbh5dnawTmbaxa8Acd4fRbbh5kcbh8Eazcj;cbfhqinaih8Fdndndndna5a8Ecet4ciGgoc9:fPdebdkaPa8F9RaA6mrazcj;cbfa8EaA2fa8FaAz:jjjjb8Aa8FaAfhixdkazcj;cbfa8EaA2fcbaAz:kjjjb8Aa8FhixekaPa8F9RaK6mva8FaKfhidnaCTmbaPai9RcK6mbaocdtc:q:G:cjbfcj:G:cjbawEhaczhrcbhlinargoc9Wfghaqfhrdndndndndndnaaa8Fahco4fRbbalcoG4ciGcdtfydbPDbedvivvvlvkar9cb83bwar9cb83bbxlkarcbaiRbdai8Xbb9c:c:qj:bw9:9c:q;c1:I1e:d9c:b:c:e1z9:gg9cjjjjjz:dg8J9qE86bbaqaofgrcGfcbaicdfa8J9c8N1:NfghRbbag9cjjjjjw:dg8J9qE86bbarcVfcbaha8J9c8M1:NfghRbbag9cjjjjjl:dg8J9qE86bbarc7fcbaha8J9c8L1:NfghRbbag9cjjjjjd:dg8J9qE86bbarctfcbaha8J9c8K1:NfghRbbag9cjjjjje:dg8J9qE86bbarc91fcbaha8J9c8J1:NfghRbbag9cjjjj;ab:dg8J9qE86bbarc4fcbaha8J9cg1:NfghRbbag9cjjjja:dg8J9qE86bbarc93fcbaha8J9ch1:NfghRbbag9cjjjjz:dgg9qE86bbarc94fcbahag9ca1:NfghRbbai8Xbe9c:c:qj:bw9:9c:q;c1:I1e:d9c:b:c:e1z9:gg9cjjjjjz:dg8J9qE86bbarc95fcbaha8J9c8N1:NfgiRbbag9cjjjjjw:dg8J9qE86bbarc96fcbaia8J9c8M1:NfgiRbbag9cjjjjjl:dg8J9qE86bbarc97fcbaia8J9c8L1:NfgiRbbag9cjjjjjd:dg8J9qE86bbarc98fcbaia8J9c8K1:NfgiRbbag9cjjjjje:dg8J9qE86bbarc99fcbaia8J9c8J1:NfgiRbbag9cjjjj;ab:dg8J9qE86bbarc9:fcbaia8J9cg1:NfgiRbbag9cjjjja:dg8J9qE86bbarcufcbaia8J9ch1:NfgiRbbag9cjjjjz:dgg9qE86bbaiag9ca1:NfhixikaraiRblaiRbbghco4g8Ka8KciSg8KE86bbaqaofgrcGfaiclfa8Kfg8KRbbahcl4ciGg8La8LciSg8LE86bbarcVfa8Ka8Lfg8KRbbahcd4ciGg8La8LciSg8LE86bbarc7fa8Ka8Lfg8KRbbahciGghahciSghE86bbarctfa8Kahfg8KRbbaiRbeghco4g8La8LciSg8LE86bbarc91fa8Ka8Lfg8KRbbahcl4ciGg8La8LciSg8LE86bbarc4fa8Ka8Lfg8KRbbahcd4ciGg8La8LciSg8LE86bbarc93fa8Ka8Lfg8KRbbahciGghahciSghE86bbarc94fa8Kahfg8KRbbaiRbdghco4g8La8LciSg8LE86bbarc95fa8Ka8Lfg8KRbbahcl4ciGg8La8LciSg8LE86bbarc96fa8Ka8Lfg8KRbbahcd4ciGg8La8LciSg8LE86bbarc97fa8Ka8Lfg8KRbbahciGghahciSghE86bbarc98fa8KahfghRbbaiRbigico4g8Ka8KciSg8KE86bbarc99faha8KfghRbbaicl4ciGg8Ka8KciSg8KE86bbarc9:faha8KfghRbbaicd4ciGg8Ka8KciSg8KE86bbarcufaha8KfgrRbbaiciGgiaiciSgiE86bbaraifhixdkaraiRbwaiRbbghcl4g8Ka8KcsSg8KE86bbaqaofgrcGfaicwfa8Kfg8KRbbahcsGghahcsSghE86bbarcVfa8KahfghRbbaiRbeg8Kcl4g8La8LcsSg8LE86bbarc7faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarctfaha8KfghRbbaiRbdg8Kcl4g8La8LcsSg8LE86bbarc91faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc4faha8KfghRbbaiRbig8Kcl4g8La8LcsSg8LE86bbarc93faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc94faha8KfghRbbaiRblg8Kcl4g8La8LcsSg8LE86bbarc95faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc96faha8KfghRbbaiRbvg8Kcl4g8La8LcsSg8LE86bbarc97faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc98faha8KfghRbbaiRbog8Kcl4g8La8LcsSg8LE86bbarc99faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc9:faha8KfghRbbaiRbrgicl4g8Ka8KcsSg8KE86bbarcufaha8KfgrRbbaicsGgiaicsSgiE86bbaraifhixekarai8Pbw83bwarai8Pbb83bbaiczfhikdnaoaC9pmbalcdfhlaoczfhraPai9RcL0mekkaoaC6moaimexokaCmva8FTmvkaqaAfhqa8Ecefg8Ecl9hmbkdndndndnawTmbasa8Acd4fRbbgociGPlbedrbkaATmdaza8Afh8Fazcj;cbfhhcbh8EaEhaina8FRbbhraahocbhlinaoahalfRbbgqce4cbaqceG9R7arfgr86bbaoadfhoaAalcefgl9hmbkaacefhaa8Fcefh8FahaAfhha8Ecefg8Ecl9hmbxikkaATmeaza8Afhaazcj;cbfhhcbhoceh8EaYh8FinaEaofhlaa8Vbbhrcbhoinala8FaofRbbcwtahaofRbbgqVc;:FiGce4cbaqceG9R7arfgr87bbaladfhlaLaocefgofmbka8FaQfh8FcdhoaacdfhaahaQfhha8EceGhlcbh8EalmbxdkkaATmbaocl4h8Eaza8AfRbbhqcwhoa3hlinalRbbaotaqVhqalcefhlaocwfgoca9hmbkcbhhaEh8FaYhainazcj;cbfahfRbbhrcwhoaahlinalRbbaotarVhralaAfhlaocwfgoca9hmbkara8E94aq7hqcbhoa8Fhlinalaqao486bbalcefhlaocwfgoca9hmbka8Fadfh8FaacefhaahcefghaA9hmbkkaEclfhEa3clfh3a8Aclfg8Aad6mbkaXazcjdfaAad2z:jjjjb8AazazcjdfaAcufad2fadz:jjjjb8AaAaOfhOaihxaimbkc9:hoxdkcbc99aPax9RakSEhoxekc9:hokavcj;kbf8Kjjjjbaok:ysezu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnalaeci9UgrcHf6mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgDce0mbavc;abfcFecjez:kjjjb8Aav9cu83iUav9cu83i8Wav9cu83iyav9cu83iaav9cu83iKav9cu83izav9cu83iwav9cu83ibaialfc9WfhqaicefgwarfhldnaeTmbcmcsaDceSEhkcbhxcbhmcbhrcbhicbhoindnalaq9nmbc9:hoxikdndnawRbbgDc;Ve0mbavc;abfaoaDcu7gPcl4fcsGcitfgsydlhzasydbhHdndnaDcsGgsak9pmbavaiaPfcsGcdtfydbaxasEhDaxasTgOfhxxekdndnascsSmbcehOasc987asamffcefhDxekalcefhDal8SbbgscFeGhPdndnascu9mmbaDhlxekalcvfhlaPcFbGhPcrhsdninaD8SbbgOcFbGastaPVhPaOcu9kmeaDcefhDascrfgsc8J9hmbxdkkaDcefhlkcehOaPce4cbaPceG9R7amfhDkaDhmkavc;abfaocitfgsaDBdbasazBdlavaicdtfaDBdbavc;abfaocefcsGcitfgsaHBdbasaDBdlaocdfhoaOaifhidnadcd9hmbabarcetfgsaH87ebasclfaD87ebascdfaz87ebxdkabarcdtfgsaHBdbascwfaDBdbasclfazBdbxekdnaDcpe0mbavaiaqaDcsGfRbbgscl4gP9RcsGcdtfydbaxcefgOaPEhDavaias9RcsGcdtfydbaOaPTgzfgOascsGgPEhsaPThPdndnadcd9hmbabarcetfgHax87ebaHclfas87ebaHcdfaD87ebxekabarcdtfgHaxBdbaHcwfasBdbaHclfaDBdbkavaicdtfaxBdbavc;abfaocitfgHaDBdbaHaxBdlavaicefgicsGcdtfaDBdbavc;abfaocefcsGcitfgHasBdbaHaDBdlavaiazfgicsGcdtfasBdbavc;abfaocdfcsGcitfgDaxBdbaDasBdlaocifhoaiaPfhiaOaPfhxxekaxcbalRbbgsEgHaDc;:eSgDfhOascsGhAdndnascl4gCmbaOcefhzxekaOhzavaiaC9RcsGcdtfydbhOkdndnaAmbazcefhxxekazhxavaias9RcsGcdtfydbhzkdndnaDTmbalcefhDxekalcdfhDal8SbegPcFeGhsdnaPcu9kmbalcofhHascFbGhscrhldninaD8SbbgPcFbGaltasVhsaPcu9kmeaDcefhDalcrfglc8J9hmbkaHhDxekaDcefhDkasce4cbasceG9R7amfgmhHkdndnaCcsSmbaDhsxekaDcefhsaD8SbbglcFeGhPdnalcu9kmbaDcvfhOaPcFbGhPcrhldninas8SbbgDcFbGaltaPVhPaDcu9kmeascefhsalcrfglc8J9hmbkaOhsxekascefhskaPce4cbaPceG9R7amfgmhOkdndnaAcsSmbashlxekascefhlas8SbbgDcFeGhPdnaDcu9kmbascvfhzaPcFbGhPcrhDdninal8SbbgscFbGaDtaPVhPascu9kmealcefhlaDcrfgDc8J9hmbkazhlxekalcefhlkaPce4cbaPceG9R7amfgmhzkdndnadcd9hmbabarcetfgDaH87ebaDclfaz87ebaDcdfaO87ebxekabarcdtfgDaHBdbaDcwfazBdbaDclfaOBdbkavc;abfaocitfgDaOBdbaDaHBdlavaicdtfaHBdbavc;abfaocefcsGcitfgDazBdbaDaOBdlavaicefgicsGcdtfaOBdbavc;abfaocdfcsGcitfgDaHBdbaDazBdlavaiaCTaCcsSVfgicsGcdtfazBdbaiaATaAcsSVfhiaocifhokawcefhwaocsGhoaicsGhiarcifgrae6mbkkcbc99alaqSEhokavc;aef8Kjjjjbaok:clevu8Jjjjjbcz9Rhvdnalaecvf9pmbc9:skdnaiRbbc;:eGc;qeSmbcuskav9cb83iwaicefhoaialfc98fhrdnaeTmbdnadcdSmbcbhwindnaoar6mbc9:skaocefhlao8SbbgicFeGhddndnaicu9mmbalhoxekaocvfhoadcFbGhdcrhidninal8SbbgDcFbGaitadVhdaDcu9kmealcefhlaicrfgic8J9hmbxdkkalcefhokabawcdtfadc8Etc8F91adcd47avcwfadceGcdtVglydbfgiBdbalaiBdbawcefgwae9hmbxdkkcbhwindnaoar6mbc9:skaocefhlao8SbbgicFeGhddndnaicu9mmbalhoxekaocvfhoadcFbGhdcrhidninal8SbbgDcFbGaitadVhdaDcu9kmealcefhlaicrfgic8J9hmbxdkkalcefhokabawcetfadc8Etc8F91adcd47avcwfadceGcdtVglydbfgi87ebalaiBdbawcefgwae9hmbkkcbc99aoarSEk:Lvoeue99dud99eud99dndnadcl9hmbaeTmeindndnabcdfgd8Sbb:Yab8Sbbgi:Ygl:l:tabcefgv8Sbbgo:Ygr:l:tgwJbb;:9cawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai86bbdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad86bbdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad86bbabclfhbaecufgembxdkkaeTmbindndnabclfgd8Ueb:Yab8Uebgi:Ygl:l:tabcdfgv8Uebgo:Ygr:l:tgwJb;:FSawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai87ebdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad87ebdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad87ebabcwfhbaecufgembkkk:4ioiue99dud99dud99dnaeTmbcbhiabhlindndnal8Uebgv:YgoJ:ji:1Salcof8UebgrciVgw:Y:vgDNJbbbZJbbb:;avcu9kEMgq:lJbbb9p9DTmbaq:Ohkxekcjjjj94hkkalclf8Uebhvalcdf8UebhxalarcefciGcetfak87ebdndnax:YgqaDNJbbbZJbbb:;axcu9kEMgm:lJbbb9p9DTmbam:Ohxxekcjjjj94hxkabaiarciGgkfcd7cetfax87ebdndnav:YgmaDNJbbbZJbbb:;avcu9kEMgP:lJbbb9p9DTmbaP:Ohvxekcjjjj94hvkalarcufciGcetfav87ebdndnawaw2:ZgPaPMaoaoN:taqaqN:tamamN:tgoJbbbbaoJbbbb9GE:raDNJbbbZMgD:lJbbb9p9DTmbaD:Ohrxekcjjjj94hrkalakcetfar87ebalcwfhlaiclfhiaecufgembkkk9mbdnadcd4ae2gdTmbinababydbgecwtcw91:Yaece91cjjj98Gcjjj;8if::NUdbabclfhbadcufgdmbkkk:Tvirud99eudndnadcl9hmbaeTmeindndnabRbbgiabcefgl8Sbbgvabcdfgo8Sbbgrf9R:YJbbuJabcifgwRbbgdce4adVgDcd4aDVgDcl4aDVgD:Z:vgqNJbbbZMgk:lJbbb9p9DTmbak:Ohxxekcjjjj94hxkaoax86bbdndnaraif:YaqNJbbbZMgk:lJbbb9p9DTmbak:Ohoxekcjjjj94hokalao86bbdndnavaifar9R:YaqNJbbbZMgk:lJbbb9p9DTmbak:Ohixekcjjjj94hikabai86bbdndnaDadcetGadceGV:ZaqNJbbbZMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkawad86bbabclfhbaecufgembxdkkaeTmbindndnab8Vebgiabcdfgl8Uebgvabclfgo8Uebgrf9R:YJbFu9habcofgw8Vebgdce4adVgDcd4aDVgDcl4aDVgDcw4aDVgD:Z:vgqNJbbbZMgk:lJbbb9p9DTmbak:Ohxxekcjjjj94hxkaoax87ebdndnaraif:YaqNJbbbZMgk:lJbbb9p9DTmbak:Ohoxekcjjjj94hokalao87ebdndnavaifar9R:YaqNJbbbZMgk:lJbbb9p9DTmbak:Ohixekcjjjj94hikabai87ebdndnaDadcetGadceGV:ZaqNJbbbZMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkawad87ebabcwfhbaecufgembkkk9teiucbcbyd:K:G:cjbgeabcifc98GfgbBd:K:G:cjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaik;LeeeudndnaeabVciGTmbabhixekdndnadcz9pmbabhixekabhiinaiaeydbBdbaiclfaeclfydbBdbaicwfaecwfydbBdbaicxfaecxfydbBdbaeczfheaiczfhiadc9Wfgdcs0mbkkadcl6mbinaiaeydbBdbaeclfheaiclfhiadc98fgdci0mbkkdnadTmbinaiaeRbb86bbaicefhiaecefheadcufgdmbkkabk;aeedudndnabciGTmbabhixekaecFeGc:b:c:ew2hldndnadcz9pmbabhixekabhiinaialBdbaicxfalBdbaicwfalBdbaiclfalBdbaiczfhiadc9Wfgdcs0mbkkadcl6mbinaialBdbaiclfhiadc98fgdci0mbkkdnadTmbinaiae86bbaicefhiadcufgdmbkkabkk83dbcj:Gdk8Kbbbbdbbblbbbwbbbbbbbebbbdbbblbbbwbbbbc:K:Gdkl8W:qbb`,t=`b9H79TebbbeKl9Gbb9Gvuuuuueu9Giuuub9Geueuixkbbebeeddddilve9Weeeviebeoweuecj:Gdkr;Neqo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbdY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVblE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtboK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbrL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949WbwY9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVJ9V29VVbDl79IV9Rbqq:W9Dklbzik94evu8Jjjjjbcz9Rhbcbheincbhdcbhiinabcwfadfaicjuaead4ceGglE86bbaialfhiadcefgdcw9hmbkaeai86b:q:W:cjbaecitab8Piw83i:q:G:cjbaecefgecjd9hmbkk:JBl8Aud97dur978Jjjjjbcj;kb9Rgv8Kjjjjbc9:hodnalTmbcuhoaiRbbgrc;WeGc:Ge9hmbarcsGgwce0mbc9:hoalcufadcd4cbawEgDadfgrcKcaawEgqaraq0Egk6mbaialfgxar9RhodnadTgmmbavaoad;8qbbkaicefhPcj;abad9Uc;WFbGcjdadca0EhsdndndnadTmbaoadfhzcbhHinaeaH9nmdaxaP9RaD6miabaHad2fhOaPaDfhAasaeaH9RaHasfae6EgCcsfgocl4cifcd4hXavcj;cbfaoc9WGgQcetfhLavcj;cbfaQci2fhKavcj;cbfaQfhYcbh8Aaoc;ab6hEincbh3dnawTmbaPa8Acd4fRbbh3kcbh5avcj;cbfh8Eindndndndna3a5cet4ciGgoc9:fPdebdkaxaA9RaQ6mwdnaQTmbavcj;cbfa5aQ2faAaQ;8qbbkaAaCfhAxdkaQTmeavcj;cbfa5aQ2fcbaQ;8kbxekaxaA9RaX6moaoclVcbawEhraAaXfhocbhidnaEmbaxao9Rc;Gb6mbcbhlina8EalfhidndndndndndnaAalco4fRbbgqciGarfPDbedibledibkaipxbbbbbbbbbbbbbbbbpklbxlkaiaopbblaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLg8Fcdp:mea8FpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogapxiiiiiiiiiiiiiiiip8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaoclffagRb:q:W:cjbfhoxikaiaopbbwaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogapxssssssssssssssssp8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaocwffagRb:q:W:cjbfhoxdkaiaopbbbpklbaoczfhoxekaiaopbbdaoRbbghcitpbi:q:G:cjbahRb:q:W:cjbghpsaoRbeggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPpklbahaocdffagRb:q:W:cjbfhokdndndndndndnaqcd4ciGarfPDbedibledibkaiczfpxbbbbbbbbbbbbbbbbpklbxlkaiczfaopbblaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLg8Fcdp:mea8FpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogapxiiiiiiiiiiiiiiiip8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaoclffagRb:q:W:cjbfhoxikaiczfaopbbwaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogapxssssssssssssssssp8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaocwffagRb:q:W:cjbfhoxdkaiczfaopbbbpklbaoczfhoxekaiczfaopbbdaoRbbghcitpbi:q:G:cjbahRb:q:W:cjbghpsaoRbeggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPpklbahaocdffagRb:q:W:cjbfhokdndndndndndnaqcl4ciGarfPDbedibledibkaicafpxbbbbbbbbbbbbbbbbpklbxlkaicafaopbblaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLg8Fcdp:mea8FpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogapxiiiiiiiiiiiiiiiip8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaoclffagRb:q:W:cjbfhoxikaicafaopbbwaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogapxssssssssssssssssp8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaocwffagRb:q:W:cjbfhoxdkaicafaopbbbpklbaoczfhoxekaicafaopbbdaoRbbghcitpbi:q:G:cjbahRb:q:W:cjbghpsaoRbeggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPpklbahaocdffagRb:q:W:cjbfhokdndndndndndnaqco4arfPDbedibledibkaic8Wfpxbbbbbbbbbbbbbbbbpklbxlkaic8Wfaopbblaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLg8Fcdp:mea8FpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogapxiiiiiiiiiiiiiiiip8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Ngicitpbi:q:G:cjbaiRb:q:W:cjbgipsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Ngqcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbaiaoclffaqRb:q:W:cjbfhoxikaic8Wfaopbbwaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogapxssssssssssssssssp8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Ngicitpbi:q:G:cjbaiRb:q:W:cjbgipsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Ngqcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbaiaocwffaqRb:q:W:cjbfhoxdkaic8Wfaopbbbpklbaoczfhoxekaic8WfaopbbdaoRbbgicitpbi:q:G:cjbaiRb:q:W:cjbgipsaoRbegqcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPpklbaiaocdffaqRb:q:W:cjbfhokalc;abfhialcjefaQ0meaihlaxao9Rc;Fb0mbkkdnaiaQ9pmbaici4hlinaxao9RcK6mwa8EaifhqdndndndndndnaAaico4fRbbalcoG4ciGarfPDbedibledibkaqpxbbbbbbbbbbbbbbbbpkbbxlkaqaopbblaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLg8Fcdp:mea8FpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogapxiiiiiiiiiiiiiiiip8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spkbbahaoclffagRb:q:W:cjbfhoxikaqaopbbwaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogapxssssssssssssssssp8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spkbbahaocwffagRb:q:W:cjbfhoxdkaqaopbbbpkbbaoczfhoxekaqaopbbdaoRbbghcitpbi:q:G:cjbahRb:q:W:cjbghpsaoRbeggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPpkbbahaocdffagRb:q:W:cjbfhokalcdfhlaiczfgiaQ6mbkkaohAaoTmoka8EaQfh8Ea5cefg5cl9hmbkdndndndnawTmbaza8Acd4fRbbglciGPlbedwbkaQTmdavcjdfa8Afhlava8Afpbdbh8Jcbhoinalavcj;cbfaofpblbg8KaYaofpblbg8LpmbzeHdOiAlCvXoQrLg8MaLaofpblbg8NaKaofpblbgypmbzeHdOiAlCvXoQrLg8PpmbezHdiOAlvCXorQLg8Fcep9Ta8Fpxeeeeeeeeeeeeeeeegap9op9Hp9rg8Fa8Jp9Ug8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp9Ug8Jp9Abbbaladfgla8Ja8Ma8PpmwDKYqk8AExm35Ps8E8Fg8Fcep9Ta8Faap9op9Hp9rg8Fp9Ug8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp9Ug8Jp9Abbbaladfgla8Ja8Ka8LpmwKDYq8AkEx3m5P8Es8Fg8Ka8NaypmwKDYq8AkEx3m5P8Es8Fg8LpmbezHdiOAlvCXorQLg8Fcep9Ta8Faap9op9Hp9rg8Fp9Ug8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp9Ug8Jp9Abbbaladfgla8Ja8Ka8LpmwDKYqk8AExm35Ps8E8Fg8Fcep9Ta8Faap9op9Hp9rg8Fp9Ugap9Abbbaladfglaaa8Fa8Fpmlvorlvorlvorlvorp9Ugap9Abbbaladfglaaa8Fa8FpmwDqkwDqkwDqkwDqkp9Ugap9Abbbaladfglaaa8Fa8FpmxmPsxmPsxmPsxmPsp9Ug8Jp9AbbbaladfhlaoczfgoaQ6mbxikkaQTmeavcjdfa8Afhlava8Afpbdbh8Jcbhoinalavcj;cbfaofpblbg8KaYaofpblbg8LpmbzeHdOiAlCvXoQrLg8MaLaofpblbg8NaKaofpblbgypmbzeHdOiAlCvXoQrLg8PpmbezHdiOAlvCXorQLg8Fcep:nea8Fpxebebebebebebebebgap9op:bep9rg8Fa8Jp:oeg8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp:oeg8Jp9Abbbaladfgla8Ja8Ma8PpmwDKYqk8AExm35Ps8E8Fg8Fcep:nea8Faap9op:bep9rg8Fp:oeg8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp:oeg8Jp9Abbbaladfgla8Ja8Ka8LpmwKDYq8AkEx3m5P8Es8Fg8Ka8NaypmwKDYq8AkEx3m5P8Es8Fg8LpmbezHdiOAlvCXorQLg8Fcep:nea8Faap9op:bep9rg8Fp:oeg8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp:oeg8Jp9Abbbaladfgla8Ja8Ka8LpmwDKYqk8AExm35Ps8E8Fg8Fcep:nea8Faap9op:bep9rg8Fp:oegap9Abbbaladfglaaa8Fa8Fpmlvorlvorlvorlvorp:oegap9Abbbaladfglaaa8Fa8FpmwDqkwDqkwDqkwDqkp:oegap9Abbbaladfglaaa8Fa8FpmxmPsxmPsxmPsxmPsp:oeg8Jp9AbbbaladfhlaoczfgoaQ6mbxdkkaQTmbcbhocbalcl4gl9Rc8FGhiavcjdfa8Afhrava8Afpbdbhainaravcj;cbfaofpblbg8JaYaofpblbg8KpmbzeHdOiAlCvXoQrLg8LaLaofpblbg8MaKaofpblbg8NpmbzeHdOiAlCvXoQrLgypmbezHdiOAlvCXorQLg8Faip:Rea8Falp:Tep9qg8Faap9rgap9Abbbaradfgraaa8Fa8Fpmlvorlvorlvorlvorp9rgap9Abbbaradfgraaa8Fa8FpmwDqkwDqkwDqkwDqkp9rgap9Abbbaradfgraaa8Fa8FpmxmPsxmPsxmPsxmPsp9rgap9Abbbaradfgraaa8LaypmwDKYqk8AExm35Ps8E8Fg8Faip:Rea8Falp:Tep9qg8Fp9rgap9Abbbaradfgraaa8Fa8Fpmlvorlvorlvorlvorp9rgap9Abbbaradfgraaa8Fa8FpmwDqkwDqkwDqkwDqkp9rgap9Abbbaradfgraaa8Fa8FpmxmPsxmPsxmPsxmPsp9rgap9Abbbaradfgraaa8Ja8KpmwKDYq8AkEx3m5P8Es8Fg8Ja8Ma8NpmwKDYq8AkEx3m5P8Es8Fg8KpmbezHdiOAlvCXorQLg8Faip:Rea8Falp:Tep9qg8Fp9rgap9Abbbaradfgraaa8Fa8Fpmlvorlvorlvorlvorp9rgap9Abbbaradfgraaa8Fa8FpmwDqkwDqkwDqkwDqkp9rgap9Abbbaradfgraaa8Fa8FpmxmPsxmPsxmPsxmPsp9rgap9Abbbaradfgraaa8Ja8KpmwDKYqk8AExm35Ps8E8Fg8Faip:Rea8Falp:Tep9qg8Fp9rgap9Abbbaradfgraaa8Fa8Fpmlvorlvorlvorlvorp9rgap9Abbbaradfgraaa8Fa8FpmwDqkwDqkwDqkwDqkp9rgap9Abbbaradfgraaa8Fa8FpmxmPsxmPsxmPsxmPsp9rgap9AbbbaradfhraoczfgoaQ6mbkka8Aclfg8Aad6mbkdnaCad2goTmbaOavcjdfao;8qbbkdnammbavavcjdfaCcufad2fad;8qbbkaCaHfhHc9:hoaAhPaAmbxlkkaeTmbaDalfhrcbhocuhlinaralaD9RglfaD6mdasaeao9Raoasfae6Eaofgoae6mbkaial9RhPkcbc99axaP9RakSEhoxekc9:hokavcj;kbf8Kjjjjbaokwbz:bjjjbkNsezu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnalaeci9UgrcHf6mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgDce0mbavc;abfcFecje;8kbav9cu83iUav9cu83i8Wav9cu83iyav9cu83iaav9cu83iKav9cu83izav9cu83iwav9cu83ibaialfc9WfhqaicefgwarfhldnaeTmbcmcsaDceSEhkcbhxcbhmcbhrcbhicbhoindnalaq9nmbc9:hoxikdndnawRbbgDc;Ve0mbavc;abfaoaDcu7gPcl4fcsGcitfgsydlhzasydbhHdndnaDcsGgsak9pmbavaiaPfcsGcdtfydbaxasEhDaxasTgOfhxxekdndnascsSmbcehOasc987asamffcefhDxekalcefhDal8SbbgscFeGhPdndnascu9mmbaDhlxekalcvfhlaPcFbGhPcrhsdninaD8SbbgOcFbGastaPVhPaOcu9kmeaDcefhDascrfgsc8J9hmbxdkkaDcefhlkcehOaPce4cbaPceG9R7amfhDkaDhmkavc;abfaocitfgsaDBdbasazBdlavaicdtfaDBdbavc;abfaocefcsGcitfgsaHBdbasaDBdlaocdfhoaOaifhidnadcd9hmbabarcetfgsaH87ebasclfaD87ebascdfaz87ebxdkabarcdtfgsaHBdbascwfaDBdbasclfazBdbxekdnaDcpe0mbavaiaqaDcsGfRbbgscl4gP9RcsGcdtfydbaxcefgOaPEhDavaias9RcsGcdtfydbaOaPTgzfgOascsGgPEhsaPThPdndnadcd9hmbabarcetfgHax87ebaHclfas87ebaHcdfaD87ebxekabarcdtfgHaxBdbaHcwfasBdbaHclfaDBdbkavaicdtfaxBdbavc;abfaocitfgHaDBdbaHaxBdlavaicefgicsGcdtfaDBdbavc;abfaocefcsGcitfgHasBdbaHaDBdlavaiazfgicsGcdtfasBdbavc;abfaocdfcsGcitfgDaxBdbaDasBdlaocifhoaiaPfhiaOaPfhxxekaxcbalRbbgsEgHaDc;:eSgDfhOascsGhAdndnascl4gCmbaOcefhzxekaOhzavaiaC9RcsGcdtfydbhOkdndnaAmbazcefhxxekazhxavaias9RcsGcdtfydbhzkdndnaDTmbalcefhDxekalcdfhDal8SbegPcFeGhsdnaPcu9kmbalcofhHascFbGhscrhldninaD8SbbgPcFbGaltasVhsaPcu9kmeaDcefhDalcrfglc8J9hmbkaHhDxekaDcefhDkasce4cbasceG9R7amfgmhHkdndnaCcsSmbaDhsxekaDcefhsaD8SbbglcFeGhPdnalcu9kmbaDcvfhOaPcFbGhPcrhldninas8SbbgDcFbGaltaPVhPaDcu9kmeascefhsalcrfglc8J9hmbkaOhsxekascefhskaPce4cbaPceG9R7amfgmhOkdndnaAcsSmbashlxekascefhlas8SbbgDcFeGhPdnaDcu9kmbascvfhzaPcFbGhPcrhDdninal8SbbgscFbGaDtaPVhPascu9kmealcefhlaDcrfgDc8J9hmbkazhlxekalcefhlkaPce4cbaPceG9R7amfgmhzkdndnadcd9hmbabarcetfgDaH87ebaDclfaz87ebaDcdfaO87ebxekabarcdtfgDaHBdbaDcwfazBdbaDclfaOBdbkavc;abfaocitfgDaOBdbaDaHBdlavaicdtfaHBdbavc;abfaocefcsGcitfgDazBdbaDaOBdlavaicefgicsGcdtfaOBdbavc;abfaocdfcsGcitfgDaHBdbaDazBdlavaiaCTaCcsSVfgicsGcdtfazBdbaiaATaAcsSVfhiaocifhokawcefhwaocsGhoaicsGhiarcifgrae6mbkkcbc99alaqSEhokavc;aef8Kjjjjbaok:clevu8Jjjjjbcz9Rhvdnalaecvf9pmbc9:skdnaiRbbc;:eGc;qeSmbcuskav9cb83iwaicefhoaialfc98fhrdnaeTmbdnadcdSmbcbhwindnaoar6mbc9:skaocefhlao8SbbgicFeGhddndnaicu9mmbalhoxekaocvfhoadcFbGhdcrhidninal8SbbgDcFbGaitadVhdaDcu9kmealcefhlaicrfgic8J9hmbxdkkalcefhokabawcdtfadc8Etc8F91adcd47avcwfadceGcdtVglydbfgiBdbalaiBdbawcefgwae9hmbxdkkcbhwindnaoar6mbc9:skaocefhlao8SbbgicFeGhddndnaicu9mmbalhoxekaocvfhoadcFbGhdcrhidninal8SbbgDcFbGaitadVhdaDcu9kmealcefhlaicrfgic8J9hmbxdkkalcefhokabawcetfadc8Etc8F91adcd47avcwfadceGcdtVglydbfgi87ebalaiBdbawcefgwae9hmbkkcbc99aoarSEk;Toio97eue97aec98Ghedndnadcl9hmbaeTmecbhdinababpbbbgicKp:RecKp:Sep;6eglaicwp:RecKp:Sep;6ealp;Geaiczp:RecKp:Sep;6egvp;Gep;Kep;Legopxbbbbbbbbbbbbbbbbp:2egralpxbbbjbbbjbbbjbbbjgwp9op9rp;Keglpxbb;:9cbb;:9cbb;:9cbb;:9calalp;Meaoaop;Meavaravawp9op9rp;Keglalp;Mep;Kep;Kep;Jep;Negvp;Mepxbbn0bbn0bbn0bbn0grp;KepxFbbbFbbbFbbbFbbbp9oaipxbbbFbbbFbbbFbbbFp9op9qalavp;Mearp;Kecwp:RepxbFbbbFbbbFbbbFbbp9op9qaoavp;Mearp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qpkbbabczfhbadclfgdae6mbxdkkaeTmbcbhdinabczfgDaDpbbbgipxbbbbbbFFbbbbbbFFgwp9oabpbbbgoaipmbediwDqkzHOAKY8AEgvczp:Reczp:Sep;6eglaoaipmlvorxmPsCXQL358E8FpxFubbFubbFubbFubbp9op;6eavczp:Sep;6egvp;Gealp;Gep;Kep;Legipxbbbbbbbbbbbbbbbbp:2egralpxbbbjbbbjbbbjbbbjgqp9op9rp;Keglpxb;:FSb;:FSb;:FSb;:FSalalp;Meaiaip;Meavaravaqp9op9rp;Keglalp;Mep;Kep;Kep;Jep;Negvp;Mepxbbn0bbn0bbn0bbn0grp;KepxFFbbFFbbFFbbFFbbp9oaiavp;Mearp;Keczp:Rep9qgialavp;Mearp;KepxFFbbFFbbFFbbFFbbp9oglpmwDKYqk8AExm35Ps8E8Fp9qpkbbabaoawp9oaialpmbezHdiOAlvCXorQLp9qpkbbabcafhbadclfgdae6mbkkk;2ileue97euo97dnaec98GgiTmbcbheinabcKfpx:ji:1S:ji:1S:ji:1S:ji:1SabpbbbglabczfgvpbbbgopmlvorxmPsCXQL358E8Fgrczp:Segwpxibbbibbbibbbibbbp9qp;6egDp;NegqaDaDp;MegDaDp;KealaopmbediwDqkzHOAKY8AEgDczp:Reczp:Sep;6eglalp;MeaDczp:Sep;6egoaop;Mearczp:Reczp:Sep;6egrarp;Mep;Kep;Kep;Lepxbbbbbbbbbbbbbbbbp:4ep;Jep;Mepxbbn0bbn0bbn0bbn0gDp;KepxFFbbFFbbFFbbFFbbgkp9oaqaop;MeaDp;Keczp:Rep9qgoaqalp;MeaDp;Keakp9oaqarp;MeaDp;Keczp:Rep9qgDpmwDKYqk8AExm35Ps8E8Fglp5eawclp:RegqpEi:T:j83ibavalp5baqpEd:T:j83ibabcwfaoaDpmbezHdiOAlvCXorQLgDp5eaqpEe:T:j83ibabaDp5baqpEb:T:j83ibabcafhbaeclfgeai6mbkkkuee97dnadcd4ae2c98GgeTmbcbhdinababpbbbgicwp:Recwp:Sep;6eaicep:SepxbbjFbbjFbbjFbbjFp9opxbbjZbbjZbbjZbbjZp:Uep;Mepkbbabczfhbadclfgdae6mbkkk:Sodw97euaec98Ghedndnadcl9hmbaeTmecbhdinabpxbbuJbbuJbbuJbbuJabpbbbgicKp:TeglaicYp:Tep9qgvcdp:Teavp9qgvclp:Teavp9qgop;6ep;Negvaicwp:RecKp:SegraipxFbbbFbbbFbbbFbbbgwp9ogDp:Uep;6ep;Mepxbbn0bbn0bbn0bbn0gqp;Kecwp:RepxbFbbbFbbbFbbbFbbp9oavaDarp:Xeaiczp:RecKp:Segip:Uep;6ep;Meaqp;Keawp9op9qavaDaraip:Uep:Xep;6ep;Meaqp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qavaoalcep:Rep9oalpxebbbebbbebbbebbbp9op9qp;6ep;Meaqp;KecKp:Rep9qpkbbabczfhbadclfgdae6mbxdkkaeTmbcbhdinabczfgkpxbFu9hbFu9hbFu9hbFu9habpbbbglakpbbbgrpmlvorxmPsCXQL358E8Fgvczp:TegqavcHp:Tep9qgicdp:Teaip9qgiclp:Teaip9qgicwp:Teaip9qgop;6ep;NegialarpmbediwDqkzHOAKY8AEgDpxFFbbFFbbFFbbFFbbglp9ograDczp:Segwp:Ueavczp:Reczp:SegDp:Xep;6ep;Mepxbbn0bbn0bbn0bbn0gvp;Kealp9oaiarawaDp:Uep:Xep;6ep;Meavp;Keczp:Rep9qgwaiaoaqcep:Rep9oaqpxebbbebbbebbbebbbp9op9qp;6ep;Meavp;Keczp:ReaiaDarp:Uep;6ep;Meavp;Kealp9op9qgipmwDKYqk8AExm35Ps8E8FpkbbabawaipmbezHdiOAlvCXorQLpkbbabcafhbadclfgdae6mbkkk9teiucbcbydj:G:cjbgeabcifc98GfgbBdj:G:cjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaikkxebcj:Gdklz:zbb`,n=new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,3,2,0,0,5,3,1,0,1,12,1,0,10,22,2,12,0,65,0,65,0,65,0,252,10,0,0,11,7,0,65,0,253,15,26,11]),r=new Uint8Array([32,0,65,2,1,106,34,33,3,128,11,4,13,64,6,253,10,7,15,116,127,5,8,12,40,16,19,54,20,9,27,255,113,17,42,67,24,23,146,148,18,14,22,45,70,69,56,114,101,21,25,63,75,136,108,28,118,29,73,115]);if(typeof WebAssembly!=`object`)return{supported:!1};var i=WebAssembly.validate(n)?s(t):s(e),a,o=WebAssembly.instantiate(i,{}).then(function(e){a=e.instance,a.exports.__wasm_call_ctors()});function s(e){for(var t=new Uint8Array(e.length),n=0;n<e.length;++n){var i=e.charCodeAt(n);t[n]=i>96?i-97:i>64?i-39:i+4}for(var a=0,n=0;n<e.length;++n)t[a++]=t[n]<60?r[t[n]]:(t[n]-60)*64+t[++n];return t.buffer.slice(0,a)}function c(e,t,n,r,i,a,o){var s=e.exports.sbrk,c=r+3&-4,l=s(c*i),u=s(a.length),d=new Uint8Array(e.exports.memory.buffer);d.set(a,u);var f=t(l,r,i,u,a.length);if(f==0&&o&&o(l,c,i),n.set(d.subarray(l,l+r*i)),s(l-s(0)),f!=0)throw Error(`Malformed buffer data: `+f)}var l={NONE:``,OCTAHEDRAL:`meshopt_decodeFilterOct`,QUATERNION:`meshopt_decodeFilterQuat`,EXPONENTIAL:`meshopt_decodeFilterExp`,COLOR:`meshopt_decodeFilterColor`},u={ATTRIBUTES:`meshopt_decodeVertexBuffer`,TRIANGLES:`meshopt_decodeIndexBuffer`,INDICES:`meshopt_decodeIndexSequence`},d=[],f=0;function p(e){var t={object:new Worker(e),pending:0,requests:{}};return t.object.onmessage=function(e){var n=e.data;t.pending-=n.count,t.requests[n.id][n.action](n.value),delete t.requests[n.id]},t}function m(e){for(var t=`self.ready = WebAssembly.instantiate(new Uint8Array([`+new Uint8Array(i)+`]), {}).then(function(result) { result.instance.exports.__wasm_call_ctors(); return result.instance; });self.onmessage = `+g.name+`;`+c.toString()+g.toString(),n=new Blob([t],{type:`text/javascript`}),r=URL.createObjectURL(n),a=d.length;a<e;++a)d[a]=p(r);for(var a=e;a<d.length;++a)d[a].object.postMessage({});d.length=e,URL.revokeObjectURL(r)}function h(e,t,n,r,i){for(var a=d[0],o=1;o<d.length;++o)d[o].pending<a.pending&&(a=d[o]);return new Promise(function(o,s){var c=new Uint8Array(n),l=++f;a.pending+=e,a.requests[l]={resolve:o,reject:s},a.object.postMessage({id:l,count:e,size:t,source:c,mode:r,filter:i},[c.buffer])})}function g(e){var t=e.data;self.ready.then(function(e){if(!t.id)return self.close();try{var n=new Uint8Array(t.count*t.size);c(e,e.exports[t.mode],n,t.count,t.size,t.source,e.exports[t.filter]),self.postMessage({id:t.id,count:t.count,action:`resolve`,value:n},[n.buffer])}catch(e){self.postMessage({id:t.id,count:t.count,action:`reject`,value:e})}})}return{ready:o,supported:!0,useWorkers:function(e){m(e)},decodeVertexBuffer:function(e,t,n,r,i){c(a,a.exports.meshopt_decodeVertexBuffer,e,t,n,r,a.exports[l[i]])},decodeIndexBuffer:function(e,t,n,r){c(a,a.exports.meshopt_decodeIndexBuffer,e,t,n,r)},decodeIndexSequence:function(e,t,n,r){c(a,a.exports.meshopt_decodeIndexSequence,e,t,n,r)},decodeGltfBuffer:function(e,t,n,r,i,o){c(a,a.exports[u[i]],e,t,n,r,a.exports[l[o]])},decodeGltfBufferAsync:function(e,t,n,r,i){return d.length>0?h(e,t,n,u[r],l[i]):o.then(function(){var o=new Uint8Array(e*t);return c(a,a.exports[u[r]],o,e,t,n,a.exports[l[i]]),o})}}})(),Lo=class extends N{constructor(){super(),this.name=`RoomEnvironment`,this.position.y=-3.5;let e=new nt;e.deleteAttribute(`uv`);let t=new Qe({side:1}),n=new Qe,r=new ue(16777215,900,28,2);r.position.set(.418,16.199,.3),this.add(r);let i=new ht(e,t);i.position.set(-.757,13.219,.717),i.scale.set(31.713,28.305,28.591),this.add(i);let a=new O(e,n,6),o=new ke;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);let s=new ht(e,Ro(50));s.position.set(-16.116,14.37,8.208),s.scale.set(.1,2.428,2.739),this.add(s);let c=new ht(e,Ro(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);let l=new ht(e,Ro(17));l.position.set(14.904,12.198,-1.832),l.scale.set(.15,4.265,6.331),this.add(l);let u=new ht(e,Ro(43));u.position.set(-.462,8.89,14.52),u.scale.set(4.38,5.441,.088),this.add(u);let d=new ht(e,Ro(20));d.position.set(3.235,11.486,-12.541),d.scale.set(2.5,2,.1),this.add(d);let f=new ht(e,Ro(100));f.position.set(0,20,0),f.scale.set(1,.1,1),this.add(f)}dispose(){let e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(let t of e)t.dispose()}};function Ro(e){return new R({color:0,emissive:16777215,emissiveIntensity:e})}function zo(e,t){e.toneMapping=4,e.toneMappingExposure=.9;let n=new an(e),r=new Lo;t.environment=n.fromScene(r,.04).texture,r.dispose(),n.dispose(),t.environmentIntensity=.6,t.add(new ie(16775922,11970710,1.15));let i=new s(16775149,1);return i.position.set(-8,20,8),t.add(i),{exposure:.9,hemisphere:1.15,key:1,environment:.6,status:`inspection lighting; not photometric measurement`}}function Bo(e,t){let n=new A,i=new A,a=new A,o=[];n.add(i,a),a.userData.helper=!0,a.name=`scan-object-bounds`;let s=new Qe({color:15067110,roughness:.9,side:2}),c=new r(e.polygon.map(([e,t])=>new z(e,-t))),l=new ht(new Ue(c),new Qe({color:t,side:2,roughness:.9}));l.name=`studio-floor-primary`,l.rotation.x=-Math.PI/2,i.add(l);for(let t of e.walls){let e=new A;e.name=`wall-`+t.index,e.position.fromArray(t.origin),e.rotation.y=Math.atan2(-t.u[2],t.u[0]),i.add(e);let n=[...new Set([0,t.length,...t.openings.flatMap(e=>[Math.max(0,e.u0),Math.min(t.length,e.u1)])])].sort((e,t)=>e-t),r=[...new Set([0,t.height,...t.openings.flatMap(e=>[Math.max(0,e.v0),Math.min(t.height,e.v1)])])].sort((e,t)=>e-t);for(let i=1;i<n.length;i++)for(let a=1;a<r.length;a++){let o=(n[i]+n[i-1])/2,c=(r[a]+r[a-1])/2;if(t.openings.some(e=>o>e.u0&&o<e.u1&&c>e.v0&&c<e.v1))continue;let l=new ht(new Ct(n[i]-n[i-1],r[a]-r[a-1]),s);l.position.set(o,c,0),e.add(l)}o.push({index:t.index,group:e,mid:new G(t.origin[0]+t.u[0]*t.length/2,t.height/2,t.origin[2]+t.u[2]*t.length/2),normal:new G(...t.cutawayNormal??t.n)})}for(let t of e.extraWalls||[]){let e=new A;e.name=t.name,e.position.fromArray(t.position),e.rotation.y=t.yaw,i.add(e);let n=new ht(new nt(t.width,t.height,t.depth),s);n.position.set(t.width/2,t.height/2,0),e.add(n),o.push({index:t.index,group:e,mid:new G(...t.mid),normal:new G(...t.normal)})}let u=new nt(1,1,1),d=new Me({color:t,transparent:!0,opacity:.2,depthWrite:!1}),f=new O(u,d,e.objects.length),p=new ke;return e.objects.forEach((t,n)=>{p.position.fromArray(t.center),p.scale.fromArray(e.excludedObjectIndices?.includes(n)?[0,0,0]:t.size),p.rotation.set(0,t.rotY,0),p.updateMatrix(),f.setMatrixAt(n,p.matrix)}),a.add(f),a.visible=!1,n.userData={source:e.source,status:`measured baseline`,worldToRoom:e.transform.worldToRoom},{root:n,shell:i,bounds:a,walls:o,data:e,floor:l}}function Vo(e,t,n=0){let r=n,i=-1;for(let a=0;a<32;a++){let o=n+a*Math.PI/16,s=0;for(let n of[-.3,0,.3]){let r=o+n,i=-Math.sin(r),a=-Math.cos(r),c=0;for(let n=.12;n<=4.2&&t.allowed(e.x+i*n,e.z+a*n);n+=.12)c=n;s+=c*(n===0?2:1)}s>i+.001&&(r=o,i=s)}return r}var Ho=[[2.5484,2.1936],[3.4175,1.5865],[4.45,1.7],[4.45,2.5],[3.4322,2.5],[3.4322,2.8233],[2.3593,2.8323]],Uo=.14,Wo=.18,Go=1.72,Ko=.5;function qo(e,t,{radius:n=Uo}={}){let r=new Map,i=[],a=new G,o=[],s=(e,t)=>{o.push(t.map(([t,n])=>{let r=e.localToWorld(new G(t,0,n));return[r.x,r.z]}))};for(let t of e){t.root.updateMatrixWorld(!0),s(t.root,t.data.polygon),t.p.id===`1`&&(s(t.root,Ho),t.balcony&&s(t.balcony,t.balcony.userData.walkPolygon));for(let e of t.walkGeometry||[])if(e.kind!==`furniture`||e.object.visible){e.object.updateWorldMatrix(!0,!1);for(let a of e.parts){let o=a.clone().applyMatrix4(e.object.matrixWorld);if(o.max.y<Wo||o.min.y>Go)continue;o.source=t.p.id+`:`+e.object.name;let s=i.push(o)-1;for(let e=Math.floor((o.min.x-n)/Ko);e<=Math.floor((o.max.x+n)/Ko);e++)for(let t=Math.floor((o.min.z-n)/Ko);t<=Math.floor((o.max.z+n)/Ko);t++){let n=e+`,`+t;r.has(n)||r.set(n,[]),r.get(n).push(s)}}}}for(let e of t.links)o.push(e.threshold??e.polygon);let c=(e,t)=>o.some(n=>$i(e,t,n)),l=(e,t)=>{if(!Number.isFinite(e)||!Number.isFinite(t)||!c(e,t))return!1;for(let r=0;r<8;r++){let i=r*Math.PI/4;if(!c(e+n*Math.cos(i),t+n*Math.sin(i)))return!1}for(let a of r.get(Math.floor(e/Ko)+`,`+Math.floor(t/Ko))||[]){let r=i[a],o=Math.max(r.min.x-e,0,e-r.max.x),s=Math.max(r.min.z-t,0,t-r.max.z);if(o*o+s*s<n*n)return!1}return!0};return{allowed:l,spawn:(e,t=e.data.polygon)=>{let r=t.reduce((e,n)=>[e[0]+n[0]/t.length,e[1]+n[1]/t.length],[0,0]),i=[r],o=t.map(e=>e[0]),s=t.map(e=>e[1]);for(let e=Math.min(...o)+n;e<=Math.max(...o)-n;e+=.16)for(let r=Math.min(...s)+n;r<=Math.max(...s)-n;r+=.16)$i(e,r,t)&&i.push([e,r]);i.sort((e,t)=>(e[0]-r[0])**2+(e[1]-r[1])**2-(t[0]-r[0])**2-(t[1]-r[1])**2);for(let[t,n]of i)if(a.set(t,1.62,n),e.root.localToWorld(a),l(a.x,a.z))return a.clone();return null},onFloor:c,blockers:(e,t)=>i.filter(r=>{let i=Math.max(r.min.x-e,0,e-r.max.x),a=Math.max(r.min.z-t,0,t-r.max.z);return i*i+a*a<n*n}).map(e=>e.source),radius:n,boxes:i.length,floorPolygons:o}}var Jo=[`KeyW`,`KeyA`,`KeyS`,`KeyD`,`ArrowUp`,`ArrowDown`,`ArrowLeft`,`ArrowRight`,`ShiftLeft`];function Yo({camera:e,canvas:t,controls:n,rooms:r,getConnections:i,invalidate:a,onMode:o,inspection:s=!1}){let c=!1,l=0,u=0,d=null,f=null,p=0,m=new Set,h=new G,g,_=()=>{g=qo(r,i())},v=(e,t)=>(g||_(),g.allowed(e,t));function y(t,n){l-=t*.004,u=He.clamp(u-n*.004,-1.25,1.25),e.quaternion.setFromEuler(new St(u,l,0,`YXZ`)),a()}function b(){c=!1,d=f=null,m.clear(),document.pointerLockElement===t&&document.exitPointerLock(),n.enabled=!0,t.style.cursor=`grab`,o(!1),a()}function x(i=r[0],a){_();let s=g.spawn(i,a);return s?(e.position.copy(s),l=Vo(s,g,i.root.rotation.y),u=0,c=!0,n.enabled=!1,t.style.cursor=`crosshair`,o(!0),y(0,0),p=performance.now(),!0):!1}function S(){if(s&&!matchMedia(`(pointer: coarse)`).matches&&t.requestPointerLock){t.focus({preventScroll:!0});try{t.requestPointerLock()?.catch(()=>{})}catch{}}}addEventListener(`keydown`,e=>{c&&!/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)&&(e.code===`Escape`?s?m.clear():b():Jo.includes(e.code)&&(e.preventDefault(),m.add(e.code)))}),addEventListener(`keyup`,e=>m.delete(e.code)),addEventListener(`blur`,()=>{m.clear(),f=null,d=null}),s&&(document.addEventListener(`mousemove`,e=>{c&&document.pointerLockElement===t&&y(e.movementX,e.movementY)}),document.addEventListener(`pointerlockchange`,()=>{document.pointerLockElement!==t&&m.clear()})),t.addEventListener(`pointerdown`,e=>{if(!c||document.pointerLockElement===t)return;let n=t.getBoundingClientRect(),r={id:e.pointerId,x:e.clientX,y:e.clientY};s&&e.pointerType===`touch`&&e.clientX-n.left<n.width/2?f={...r,dx:0,dy:0}:d=r,t.setPointerCapture(e.pointerId)}),t.addEventListener(`pointermove`,e=>{c&&(f?.id===e.pointerId?(f.dx=(e.clientX-f.x)/45,f.dy=(e.clientY-f.y)/45):d?.id===e.pointerId&&(y(e.clientX-d.x,e.clientY-d.y),d={id:e.pointerId,x:e.clientX,y:e.clientY}))});let C=e=>{d?.id===e.pointerId&&(d=null),f?.id===e.pointerId&&(f=null)};t.addEventListener(`lostpointercapture`,C),t.addEventListener(`pointerup`,C),t.addEventListener(`pointercancel`,C);let w;if(!s){w=document.createElement(`div`),w.className=`walk-pad`,w.hidden=!0;for(let[e,t]of[[`←`,`KeyA`],[`↑`,`KeyW`],[`↓`,`KeyS`],[`→`,`KeyD`]]){let n=document.createElement(`button`);n.textContent=e,n.ariaLabel=`Движение `+e,n.onpointerdown=e=>{m.add(t),n.setPointerCapture(e.pointerId)},n.onpointerup=n.onpointercancel=()=>m.delete(t),w.append(n)}document.body.append(w)}function T(t){if(w&&(w.hidden=!c),!c)return;let n=Math.min((t-p)/1e3,.04);p=t;let r=Number(m.has(`KeyW`)||m.has(`ArrowUp`))-Number(m.has(`KeyS`)||m.has(`ArrowDown`))-(f?.dy??0),i=Number(m.has(`KeyD`)||m.has(`ArrowRight`))-Number(m.has(`KeyA`)||m.has(`ArrowLeft`))+(f?.dx??0);if(Math.hypot(r,i)<.12)return;h.set(i,0,-r).clampLength(0,1).applyAxisAngle(new G(0,1,0),l).multiplyScalar(n*(m.has(`ShiftLeft`)?2.8:1.4));let o=e.position.x+h.x,s=e.position.z+h.z;v(o,s)?(e.position.x=o,e.position.z=s):v(o,e.position.z)?e.position.x=o:v(e.position.x,s)&&(e.position.z=s),a()}return{start:x,stop:b,refresh:_,captureMouse:S,get active(){return c},allowed:v,tick:T}}var Xo={1:`Главный зал · рабочие места`,2:`Прихожая`,3:`Зона отдыха`,4:`Рабочий кабинет 4`,5:`Рабочий кабинет 5`,6:`Рабочий кабинет 6`,7:`Рабочий кабинет 7`,balcony:`Балкон`};function Zo(e,t){let n=new z(1/0,1/0),r=new z(-1/0,-1/0);for(let t of e){let e=new z(...t);n.min(e),r.max(e)}let i=n.add(r).multiplyScalar(.5);return new G(i.x,t,i.y)}function Qo(e,t){let n=document.getElementById(`room-points`),r=document.getElementById(`viewport`),i=e.map(e=>{let t=[...e.p.modelWalls];return e.p.balcony&&t.push({name:`balcony-exterior-facade`,mid:[4.17,1.7,2.8],normal:[-1,0,0]}),{room:e,node:null,walls:t}});function a(e,r,i){let a=document.createElement(`button`);a.className=`room-point`,a.type=`button`,a.dataset.room=r,a.setAttribute(`aria-label`,Xo[r]);let o=document.createElement(`span`);return o.textContent=Xo[r],a.append(r===`balcony`?`Б`:r,o),a.addEventListener(`click`,()=>t(r)),n.append(a),{button:a,part:e,position:Zo(i,r===`balcony`?1.55:2.85)}}let o=i.map(e=>a(e,e.room.p.id,e.room.data.polygon)),s=i.find(e=>e.room.p.balcony);s&&o.push(a(s,`balcony`,s.room.p.balcony));let c=new G,l=new G,u=new G;return{attach(e){for(let t of i)t.node=e.getObjectByName(`overview-`+t.room.p.id),t.node&&(t.walls=t.walls.flatMap(e=>{let n=t.node.getObjectByName(`overview-${t.room.p.id}-${e.name}`);return n?[{...e,node:n}]:[]}),t.node.position.copy(t.room.root.position),t.node.rotation.copy(t.room.root.rotation),t.node.updateMatrixWorld(!0))},showPreview(e){for(let t of i)t.node&&(t.node.visible=!e.has(t.room.p.id))},cutWalls(e,t){u.copy(e.position).sub(t).normalize();let n=u.y>.92,r=0;for(let t of i)if(t.node?.visible){t.node.worldToLocal(l.copy(e.position));for(let{node:e,mid:i,normal:a}of t.walls){let t=(l.x-i[0])*a[0]+(l.z-i[2])*a[2];n||t>.045?e.visible=!0:t<-.045&&(e.visible=!1),e.visible||r++}}return r},placePoints(e,t){if(n.hidden=!t,!t)return;let i=r.clientWidth,a=r.clientHeight,s=[];for(let t of o){c.copy(t.position),t.part.room.root.localToWorld(c),c.project(e);let n=(c.x+1)*i/2,r=(1-c.y)*a/2;if(t.button.hidden=c.z>=1||c.z<=-1||n<16||r<16||n>i-16||r>a-16,t.button.hidden)continue;let o=r;for(let e of s){let t=Math.hypot(e.x-n,e.y-r),i=Math.max(0,39-t);o-=i*i/39}o=Math.max(17,o),s.push({x:n,y:o}),t.button.style.transform=`translate(${n}px,${o}px) translate(-50%,-50%)`}}}}var $o=e=>e===`approximate-exterior-daylight`,es=e=>/^(?:room3-double-timber-window|historic-single-pane-window|deep-single-pane-window|bay-recessed-window|balcony-exterior-window|balcony-exterior-door-frame|balcony-inner-glazed-transom)$/i.test(e);function ts(e,t){return t===5&&[.82,.89,1].every((t,n)=>Math.abs(e[n]-t)<.001)}function ns(e){e.traverse(e=>{if($o(e.name)){e.visible=!1;return}if(!e.isMesh)return;let t=Array.isArray(e.material)?e.material:[e.material];for(let e of t)e.emissive&&ts(e.emissive.toArray(),e.emissiveIntensity)&&(e.visible=!1);if(!Array.isArray(e.material)&&e.material.transparent){for(let t=e;t;t=t.parent)if(es(t.name)){e.material.opacity=Math.min(e.material.opacity,.09),e.material.depthWrite=!1;break}}})}var rs={ceilingY:3.78,coveBaseY:3.56,planes:[{sourceWall:0,origin:[-3.7729,-2.8232],u:[.999964886840343,-.008380040953360209],n:[.008380040953360209,.999964886840343],coveWidth:.8202182840709857,widthStatus:`LiDAR section wall0`,status:`original wall plane extended to neighboring upper planes`},{sourceWall:1,origin:[2.2585,-2.8737],u:[.6983228523753483,.7157829236929012],n:[-.7157829236929012,.6983228523753483],coveWidth:.62,widthStatus:`inferred adjacent cove family, not independently fitted`,status:`original wall plane extended to neighboring upper planes`},{sourceWall:11,origin:[3.41,-1.3506],u:[0,1],n:[-1,0],coveWidth:.62,widthStatus:`inferred adjacent cove family, not independently fitted`,status:`upper front boundary X3.41 from mesh3.5–3.65m slice, not window-frame plane`},{sourceWall:15,origin:[3.4175,1.5865],u:[-.8198079481462447,.5726385667733567],n:[-.5726385667733567,-.8198079481462447],coveWidth:.62,widthStatus:`inferred adjacent cove family, not independently fitted`,status:`original wall plane extended to neighboring upper planes`},{sourceWall:10,origin:[-2.585,2.4714],u:[-.999964886840343,.008380040953360209],n:[-.008380040953360209,-.999964886840343],coveWidth:.6179995406204474,widthStatus:`LiDAR section wall17`,status:`original wall plane extended to neighboring upper planes`},{sourceWall:9,origin:[-3.8973,2.4824],u:[-.008380040953360209,-.999964886840343],n:[.999964886840343,-.008380040953360209],coveWidth:.62,widthStatus:`inferred adjacent cove family, not independently fitted`,status:`original wall plane extended to neighboring upper planes`},{sourceWall:3,origin:[-3.902,1.922],u:[-.999964886840343,.008380040953360209],n:[-.008380040953360209,-.999964886840343],coveWidth:.62,widthStatus:`inferred adjacent cove family, not independently fitted`,status:`original wall plane extended to neighboring upper planes`},{sourceWall:16,origin:[-4.1834,1.9244],u:[-.008380040953360209,-.999964886840343],n:[.999964886840343,-.008380040953360209],coveWidth:.4789773223831945,widthStatus:`LiDAR section wall16`,status:`original wall plane extended to neighboring upper planes`}],upperBoundaryPolygon:[[-4.223154858052262,-2.819426713358056],[2.258456304876849,-2.873744787626373],[3.41,-1.693409202085004],[3.41,1.5917387748380722],[2.2081546133582157,2.4312317576103624],[-3.8973000208328834,2.4823975140751426],[-3.901996340110628,1.9219999693289003],[-4.183400350052781,1.9243582292626127]],profile:[[0,3.56],[.0009848953102423997,3.5743886884306315],[.003935363768047225,3.5887157622884116],[.008838771014514002,3.6029198708435484],[.015674119907028577,3.6169401899225546],[.024412140432251386,3.6307166823666956],[.0350154150448081,3.64419035512032],[.047438538894963356,3.6573035118481805],[.0616283142591582,3.67],[.07752397834082919,3.6822254512643124],[.09505746346603178,3.693927514381919],[.11415368855967035,3.705056079322015],[.13473088065418812,3.7155634918610403],[.1567009250539683,3.725404757645375],[.1799697426559885,3.734537734864072],[.2044376928109829,3.74292331470656],[.22999999999999995,3.7505255888325766],[.25654720249925933,3.7573120031371916],[.2839656211120587,3.7632534971524834],[.3121378459605456,3.7683246284889234],[.34094323925284037,3.772503681783595],[.370258451872581,3.7757727616887107],[.3999579515787762,3.778117869502238],[.42991456055413413,3.779528963112493],[.45999999999999996,3.7800000000000002],[.49,3.78],[.493,3.772],[.504,3.77],[.516,3.78],[.548,3.78],[.552,3.773],[.561,3.773],[.566,3.78]],lidarCrossSections:[{wall:0,ellipseFit:[-.04133693567263879,.8202182840709857,3.5522010634192966,3.7999266950247255],binMedians:[[-.08750000000000001,3.5512447738067627],[-.06250000000000001,3.5812447451965332],[-.03750000000000002,3.5812447451965332],[-.012500000000000022,3.6167726897613526],[.012499999999999973,3.6412446879760743],[.037499999999999964,3.6424249791519165],[.06249999999999996,3.6712446593658448],[.08749999999999995,3.6712446593658448],[.11249999999999995,3.7012446307556153],[.13749999999999996,3.7012446307556153],[.16249999999999995,3.707054176272583],[.18749999999999994,3.715405979098511],[.21249999999999994,3.7295673274414063],[.23749999999999993,3.745285310687256],[.2624999999999999,3.731244840563965],[.2874999999999999,3.7416270160095215],[.31249999999999994,3.761632599772644],[.3374999999999999,3.7612448119537354],[.3624999999999999,3.7612448119537354],[.3874999999999999,3.7615886115448],[.4124999999999999,3.780793943347168],[.4374999999999999,3.777044811190796],[.46249999999999986,3.789381542147827],[.4874999999999999,3.791244783343506],[.5124999999999998,3.791244783343506],[.5374999999999999,3.791244783343506],[.5624999999999998,3.79749850267334],[.5874999999999998,3.8053009890930176],[.6124999999999998,3.8175361537353516],[.6374999999999997,3.807977118434143],[.6624999999999998,3.808771886767578],[.6874999999999998,3.804549612940979],[.7124999999999998,3.802193918170166],[.7374999999999998,3.800167241038513],[.7624999999999997,3.7927965306655884],[.7874999999999998,3.794485487879944],[.8124999999999998,3.793857374133301],[.8374999999999997,3.7912738704101563],[.8624999999999997,3.795685687007141],[.8874999999999997,3.795574822367859],[.9124999999999998,3.7960127972976685],[.9374999999999998,3.799301662387085],[.9624999999999997,3.7978940390960694],[.9874999999999997,3.7975697898284912],[1.0124999999999997,3.801069774569702],[1.0374999999999996,3.798036374987793]],rmsMetres:.008647743826185862,status:`Robust fit to original mesh bin medians; low-confidence returns excluded by Y3.53–3.85 gate`},{wall:16,ellipseFit:[-.0008540956815143156,.4789773223831945,3.5503802930330877,3.8049182471020497],binMedians:[[-.012500000000000022,3.5512447738067627],[.012499999999999973,3.6112447165863037],[.037499999999999964,3.65113619798584],[.06249999999999996,3.6729783200637818],[.08749999999999995,3.7012446307556153],[.11249999999999995,3.7083766841308594],[.13749999999999996,3.731244840563965],[.16249999999999995,3.734134712161255],[.18749999999999994,3.7572342538253785],[.21249999999999994,3.7612448119537354],[.23749999999999993,3.7644000434295655],[.2624999999999999,3.786239662112427],[.2874999999999999,3.791244783343506],[.31249999999999994,3.791244783343506],[.3374999999999999,3.791244783343506],[.3624999999999999,3.7984242820159912],[.3874999999999999,3.80107835763855],[.4124999999999999,3.799780168475342],[.4374999999999999,3.8003292464630127],[.46249999999999986,3.8033006572143555],[.4874999999999999,3.798085966052246],[.5124999999999998,3.798312940539551],[.5374999999999999,3.7972746276275635],[.5624999999999998,3.804351367892456],[.5874999999999998,3.8036049985305787],[.6124999999999998,3.8053968333618164],[.6374999999999997,3.806048192919922],[.6624999999999998,3.8032391452209473],[.6874999999999998,3.804505028666687],[.7124999999999998,3.8094513797180176],[.7374999999999998,3.8083007716552735],[.7624999999999997,3.80810002321167],[.7874999999999998,3.8098149680511475],[.8124999999999998,3.8096430682556153],[.8374999999999997,3.810369768084717],[.8624999999999997,3.8103669070617676],[.8874999999999997,3.807851352633667],[.9124999999999998,3.8026790999786377],[.9374999999999998,3.801485934199524],[.9624999999999997,3.800916709841919],[.9874999999999997,3.803590335787964],[1.0124999999999997,3.8068612002746582],[1.0374999999999996,3.804886617602539]],rmsMetres:.00405266672144008,status:`Robust fit to original mesh bin medians; low-confidence returns excluded by Y3.53–3.85 gate`},{wall:17,ellipseFit:[.4347178960935247,.6179995406204474,3.553439088753249,3.789928310770254],binMedians:[[.3874999999999999,3.55659536355896],[.4124999999999999,3.5584464454071045],[.4374999999999999,3.5812447451965332],[.46249999999999986,3.6112447165863037],[.4874999999999999,3.6412446879760743],[.5124999999999998,3.652084627093506],[.5374999999999999,3.6712446593658448],[.5624999999999998,3.7012446307556153],[.5874999999999998,3.7072554015533448],[.6124999999999998,3.731244840563965],[.6374999999999997,3.7326734446899414],[.6624999999999998,3.74633244508667],[.6874999999999998,3.7559891127960205],[.7124999999999998,3.761141099871826],[.7374999999999998,3.7612448119537354],[.7624999999999997,3.7612448119537354],[.7874999999999998,3.7612448119537354],[.8124999999999998,3.765159645022583],[.8374999999999997,3.7680814647094727],[.8624999999999997,3.7720359944717408],[.8874999999999997,3.7806637668029786],[.9124999999999998,3.7842739009277344],[.9374999999999998,3.785526552142334],[.9624999999999997,3.7885795020477295],[.9874999999999997,3.7894873999969483],[1.0124999999999997,3.7899899863616944],[1.0374999999999996,3.791244783343506]],rmsMetres:.00720113023563747,status:`Robust fit to original mesh bin medians; low-confidence returns excluded by Y3.53–3.85 gate`}],northSoffitY:3.44,windowSoffitY:3.56,rawCamerasChanged:!1,status:`Upper boundary and smooth cove reconstructed from original mesh sections; wall0/16 curve and wall17 stepped upper offset. Raw walls/cameras unchanged.`,limitations:[`Widths0.820/0.479/0.618m from three source sections; other sides use inferred0.62m family`,`Base3.56m and retained flat ceiling3.78m slightly differ from fitted endpoints/interior mesh mode3.815m`,`Upper boundary line extensions and window X3.41 reconstructed from slices, not tape survey`,`Top bead sizes, corner shape and exact sculpted wall relief not measured`]};function is(e,t,n,r){let i=new G(n.origin[0]+n.u[0]*r+n.n[0]*.2,1.45,n.origin[2]+n.u[2]*r+n.n[2]*.2),a=new G().fromArray(n.n).negate().transformDirection(e.matrixWorld),o=new Se(e.localToWorld(i),a,0,.4).intersectObject(t,!0)[0];if(o){let e=o.object.material;return Array.isArray(e)?e[o.face.materialIndex]:e}return new Qe({color:15067110,roughness:.9,side:2})}function as(e,t,n,r,i,a,o){let s=rs.coveBaseY+.003,c=new z(...n),l=new z(...r),u=l.clone().sub(c).normalize();c.addScaledVector(u,-.004),l.addScaledVector(u,.004);let d=[],f=[];for(let[n,r]of[[c,0],[l,0],[c,s],[l,s]]){let[a,o]=n.toArray(),s=t.worldToLocal(e.localToWorld(new G(a,r,o)));d.push(...s.toArray());let c=(a-i.origin[0])*i.u[0]+(o-i.origin[2])*i.u[2];f.push(c/i.length,r/i.height)}let p=new Ae;p.setAttribute(`position`,new ne(d,3)),p.setAttribute(`uv`,new ne(f,2));let m=u.x*i.u[0]+u.y*i.u[2]>0;p.setIndex(m?[0,1,2,2,1,3]:[0,2,1,2,3,1]),p.computeVertexNormals();let h=new ht(p,a);h.name=o,t.add(h)}function os(e,t){let n=e.getObjectByName(`wall-0`),r=e.getObjectByName(`wall-16`),i=t.walls.find(e=>e.index===0),a=t.walls.find(e=>e.index===16),[o,s,c]=t.polygon.slice(6,9);if(!n||!r)return null;let l=e.getObjectByName(`wall-room1-west-gap`);if(l)for(let e of l.children)e.visible=!1;else l=new A,l.name=`wall-room1-west-gap`,e.add(l);return e.updateWorldMatrix(!0,!0),as(e,l,o,s,i,is(e,n,i,.22),`room1-west-plaster-return`),as(e,r,s,c,a,is(e,r,a,a.length-.18),`room1-west-wall-extension`),l.userData={source:`Room 1 surveyed floor perimeter, edges 6 and 7`,height:rs.coveBaseY},l.updateWorldMatrix(!0,!0),r.updateWorldMatrix(!0,!0),l}var ss=class{constructor({load:e,mount:t,unmount:n,dispose:r,onChange:i=()=>{},concurrency:a=2}){Object.assign(this,{load:e,mount:t,unmount:n,dispose:r,onChange:i,concurrency:a}),this.loaded=new Map,this.pending=new Map,this.errors=new Map,this.waiters=new Map,this.wanted=[]}has(e){return this.loaded.has(e)}setWanted(e,{retainLoaded:t=!1}={}){this.wanted=[...new Set(e)];let n=new Set(this.wanted);for(let[e,r]of this.loaded)!t&&!n.has(e)&&(this.unmount(e,r),this.dispose(r),this.loaded.delete(e));for(let[e,t]of this.pending)n.has(e)||t.controller.abort();for(let e of this.waiters.keys())n.has(e)||this.finishWaiters(e,null,new DOMException(`Selection changed`,`AbortError`));this.pump(),this.onChange()}waitFor(e){return this.has(e)?Promise.resolve(this.loaded.get(e)):this.errors.has(e)?Promise.reject(this.errors.get(e)):new Promise((t,n)=>{this.waiters.has(e)||this.waiters.set(e,[]),this.waiters.get(e).push({resolve:t,reject:n})})}retry(){this.errors.clear(),this.pump()}finishWaiters(e,t,n){for(let r of this.waiters.get(e)||[])n?r.reject(n):r.resolve(t);this.waiters.delete(e)}pump(){for(let e of this.wanted){if(this.pending.size>=this.concurrency)break;if(this.loaded.has(e)||this.pending.has(e)||this.errors.has(e))continue;let t=new AbortController,n={controller:t};this.pending.set(e,n),Promise.resolve().then(()=>this.load(e,t.signal)).then(n=>{t.signal.aborted||!this.wanted.includes(e)?this.dispose(n):(this.loaded.set(e,n),this.mount(e,n),this.finishWaiters(e,n))}).catch(n=>{n.name!==`AbortError`&&!t.signal.aborted&&(this.errors.set(e,n),console.warn(`Room load failed:`,e,n.message),this.finishWaiters(e,null,n))}).finally(()=>{this.pending.get(e)===n&&this.pending.delete(e),this.onChange(),this.pump()})}}},cs=`modulepreload`,ls=function(e,t){return new URL(e,t).href},us={},ds=function(e){return e.pathname.endsWith(`.css`)},fs=function(e,t,n){if(t in e)return e[t];let r=n();if(!r){e[t]=void 0;return}let i=r.then(()=>{e[t]=void 0},n=>{throw e[t]=void 0,n});return e[t]=i,i},ps=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e,i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function s(e){return import.meta.resolve?new URL(import.meta.resolve(e)):new URL(e,import.meta.url)}r=o(t.map(t=>{t=ls(t,n);let r=s(t),i=ds(r);return fs(us,r.href,()=>{if(e===void 0){e={all:new Set,styles:new Set};let t=document.getElementsByTagName(`link`);for(let n=t.length-1;n>=0;n--){let r=t[n];e.all.add(r.href),r.rel===`stylesheet`&&e.styles.add(r.href)}}if((i?e.styles:e.all).has(r.href))return;let t=document.createElement(`link`);if(t.rel=i?`stylesheet`:cs,i||(t.as=`script`),t.crossOrigin=``,t.href=r.href,a&&t.setAttribute(`nonce`,a),document.head.appendChild(t),i)return new Promise((e,n)=>{t.addEventListener(`load`,e),t.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${r}`)))})})}).filter(e=>e!==void 0))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})},X=e=>document.getElementById(e),ms=Nt(matchMedia(`(pointer:coarse)`).matches,innerWidth),hs=new N;hs.background=new L(2437688);var gs=Math.min(devicePixelRatio,ms?1.15:1.25),Z=document.body.hasAttribute(`data-site-tour`),_s=document.createElement(`canvas`);_s.addEventListener(`webglcontextcreationerror`,()=>{X(`status`).textContent=`Для просмотра нужен WebGL 2. Фотографии студии доступны на странице Interior.`});var vs=new Qi({canvas:_s,antialias:!0,powerPreference:ms?`default`:`high-performance`});vs.setPixelRatio(gs),X(`viewport`).append(vs.domElement),zo(vs,hs);var Q=new F(48,innerWidth/innerHeight,.04,150),ys=new ba(Q,vs.domElement);if(ys.enableDamping=!1,ys.maxDistance=100,ys.minDistance=.3,hs.matrixWorldAutoUpdate=!1,typeof Worker==`function`&&Io.supported)try{Io.useWorkers(Math.min(2,navigator.hardwareConcurrency||1))}catch{}var bs=new Ia().setMeshoptDecoder(Io),xs=[],Ss=new Map,Cs=!0,ws=`room`,$=`2`,Ts,Es,Ds,Os=!1,ks=null,As=null,js=0,Ms=!1,Ns=!1,Ps=!0,Fs=0;bs.register(e=>({name:`StaticRoomHierarchy`,beforeRoot(){let t=e.json;if(t.animations?.length||t.skins?.length)return;function n(e){let r=t.nodes[e];return r.children&&=r.children.filter(n),r.mesh!=null||r.camera!=null||r.extensions||r.children?.length}for(let e of t.scenes)e.nodes=e.nodes.filter(n)}})),document.body.dataset.liveMirrors=`0`;var Is=performance.now(),Ls=0,Rs=0,zs=()=>Cs=!0;if(ys.addEventListener(`change`,zs),Z){let e=null;try{window.parent!==window&&(e=window.parent.document.documentElement)}catch{}let t=document.documentElement;function n(){let n=e?.dataset.theme||localStorage.getItem(`to.theme`)||`light`;if(t.dataset.theme=n,e){let n=window.parent.getComputedStyle(e);for(let e of[`--panel`,`--panel-2`,`--panel-edge`,`--ink`,`--ink-2`,`--control-fill`,`--control-shadow`])t.style.setProperty(e,n.getPropertyValue(e));t.style.fontFamily=window.parent.getComputedStyle(window.parent.document.body).fontFamily}hs.background.set(n===`dark`?2368548:15987438),zs()}e&&new MutationObserver(n).observe(e,{attributes:!0,attributeFilter:[`data-theme`]}),addEventListener(`storage`,n),n()}var Bs=new URLSearchParams(location.search).get(`room`),Vs=/^[1-7]$/.test(Bs??``)?Bs:`2`,Hs=null,Us=null,Ws=!1;X(`contact-shadows`)&&(X(`contact-shadows`).checked=Ws);async function Gs(){Hs||Us||!Ws||(Us=ps(async()=>{let{createViewRenderer:e}=await import(`./view-renderer-D-ofSLeB.js`);return{createViewRenderer:e}},__vite__mapDeps([0,1]),import.meta.url).then(({createViewRenderer:e})=>{Ws&&(Hs=e(vs,hs,Q,{radius:.15,intensity:.6,samples:8,targetSamples:0}),zs())}).catch(()=>{Ws=!1,X(`contact-shadows`).checked=!1}).finally(()=>Us=null))}X(`contact-shadows`)&&(X(`contact-shadows`).onchange=()=>{Ws=X(`contact-shadows`).checked,Ws?Gs():(Hs?.dispose(),Hs=null),zs()});var Ks=new WeakMap,qs=new WeakSet,Js=Math.min(8,vs.capabilities.getMaxAnisotropy());function Ys(e){let t=ms||ws===`overview`,n=new Set;e.traverse(e=>{for(let r of Array.isArray(e.material)?e.material:e.material?[e.material]:[]){if(n.has(r))continue;n.add(r);for(let e of Object.values(r))e?.isTexture&&!qs.has(e)&&(e.anisotropy=Js,e.needsUpdate=!0,qs.add(e));r.transmission>0&&!Ks.has(r)&&Ks.set(r,{transmission:r.transmission,transparent:r.transparent,opacity:r.opacity,depthWrite:r.depthWrite,roughness:r.roughness,forceSinglePass:r.forceSinglePass});let e=Ks.get(r);if(e){let n=r.transmission>0;t?(r.transmission=0,r.transparent=!0,r.opacity=Math.min(.22,1-e.transmission+.1),r.depthWrite=!1,r.roughness=Math.max(e.roughness,.14),r.forceSinglePass=!0):Object.assign(r,e),n!==r.transmission>0&&(r.needsUpdate=!0)}else ms&&r.transparent&&r.side===2&&(r.forceSinglePass=!0)}}),document.body.dataset.materialMode=ms?`mobile-no-refraction`:t?`overview-no-refraction`:`desktop-physical`}var Xs,Zs,Qs=null,$s=null,ec=()=>xs.map(e=>e.p.id),tc=e=>Ds.setWanted(e,{retainLoaded:Z}),nc=e=>{let t=new Set,n=new Set,r=new Set;e.scene.traverse(e=>{e.geometry&&t.add(e.geometry);for(let t of Array.isArray(e.material)?e.material:e.material?[e.material]:[]){n.add(t);for(let e of Object.values(t))e?.isTexture&&r.add(e)}});for(let e of t)e.dispose();for(let e of n)e.dispose();for(let e of r)e.dispose(),e.source?.data?.close?.()};function rc(){if(!Ds)return;let e=Mt(Ds,{mode:ws,selected:$,totalRooms:xs.length});X(`retry`).hidden=!e.retry;let t=Ds.loaded.size,n=(Fs/1e6).toFixed(1);if(Z){let n=ws===`overview`;X(`whole`).hidden=n,X(`room-title`).hidden=n,X(`room-title`).textContent=n?``:Xo[Ns?`balcony`:$];let r=e.failed.length>0;$s&&!Ts?.active?X(`status`).textContent=`Готовлю осмотр…`:n?X(`status`).textContent=r?`Не удалось загрузить детали студии`:t===xs.length?``:Zs?`Загружаю детали · ${t} из ${xs.length}`:`Открываю карту…`:X(`status`).textContent=r?`Не удалось загрузить детали`:Ds.has($)?``:`Загружаю помещение…`}else X(`status`).textContent=e.text;X(`metrics`)&&(X(`metrics`).textContent=`Передано моделей: ${n} МБ. В памяти помещений: ${t}. ${vs.info.render.calls} вызовов · ${Math.round(vs.info.render.triangles/1e3)} тыс. треугольников.`),document.body.dataset.loadedRooms=[...Ds.loaded.keys()].join(`,`),document.body.dataset.transferredBytes=String(Fs),Ds.has($)&&(document.body.dataset.ready=`true`,Rs||(Rs=performance.now()-Is,document.body.dataset.firstDetailMs=String(Math.round(Rs)))),zs()}function ic(e=$,t=Ms){let n=e===`all`?xs:[Ss.get(e)],r=new Te;for(let e of n)for(let[t,n]of[...e.data.polygon,...e.p.balcony||[]])for(let i of[0,e.p.ceilingHeight||3.8]){let a=e.root.localToWorld(new G(t,i,n));r.expandByPoint(a)}let i=r.getCenter(new G);i.y=t?0:Math.min(i.y,1.4);let a=(t?new G(.001,1,.001):ws===`room`&&!Ps?new G(.45,1.45,.6):new G(.85,.8,1)).normalize(),o=new G().crossVectors(Q.up,a).normalize(),s=new G().crossVectors(a,o).normalize(),c=Math.tan(He.degToRad(Q.fov/2)),l=c*Q.aspect,u=1;for(let e of[r.min.x,r.max.x])for(let t of[r.min.y,r.max.y])for(let n of[r.min.z,r.max.z]){let r=new G(e,t,n).sub(i);u=Math.max(u,r.dot(a)+1.12*Math.abs(r.dot(o))/l,r.dot(a)+1.18*Math.abs(r.dot(s))/c)}ys.target.copy(i),Q.position.copy(i).addScaledVector(a,u),ys.update(),zs()}function ac(){for(let e of xs)e.model&&(ws===`overview`||!Z||e.p.id===$||Ts?.active)&&Ys(e.model);zs()}function oc(e){return Dc.pairs.flatMap(t=>String(t.a.room)===e?[String(t.b.room)]:String(t.b.room)===e?[String(t.a.room)]:[])}function sc(e){return[...new Set([e,...oc(e)])]}var cc=new n,lc=new it,uc=new Te,dc=new G;function fc(e,t){Q.updateMatrixWorld(),cc.setFromProjectionMatrix(lc.multiplyMatrices(Q.projectionMatrix,Q.matrixWorldInverse));let n=new Set(e.filter(e=>Ds?.has(e)||Ds?.wanted.includes(e)));for(let r of Es?.links??[]){let i=r.a.p.id,a=r.b.p.id;if(!e.includes(i)||!e.includes(a))continue;let o=r.threshold??r.polygon;uc.makeEmpty();for(let[e,t]of o)uc.min.min(dc.set(e,0,t)),uc.max.max(dc.set(e,r.height,t));(r===t||uc.distanceToPoint(Q.position)<5.5&&cc.intersectsBox(uc))&&(n.add(i),n.add(a))}return n}async function pc(e,{balcony:t=!1}={}){Ns=t;let n=++js;document.body.dataset.ready=`false`,Ts?.active&&Ts.stop(),$=e,ws=`room`,ys.maxPolarAngle=Math.PI*(Z?.49:1),Ms=!1,X(`room`)&&(X(`room`).value=e),X(`overview`)?.classList.remove(`active`),tc([e]),ac(),t?Mc():ic(),rc();try{if(await Ds.waitFor(e),n!==js)return;document.body.dataset.ready=`true`,rc()}catch(e){e.name!==`AbortError`&&rc()}}async function mc(e,t){let n=await fetch(`./web/room-`+e+`.glb`+(e===`4`?`?v=meeting-table`:``),{signal:t});if(!n.ok)throw Error(`HTTP `+n.status);let r=await n.arrayBuffer();return Fs+=r.byteLength,r}var hc=new AbortController,gc=Z?null:mc(Vs,hc.signal).then(e=>({buffer:e}),e=>({error:e}));async function _c(e,t){let n;if(e===Vs&&gc){t.addEventListener(`abort`,()=>hc.abort(),{once:!0});let e=gc;gc=null;let r=await e;if(r.error)throw r.error;n=r.buffer}else n=await mc(e,t);if(t.aborted)throw new DOMException(`Selection changed`,`AbortError`);let r=await bs.parseAsync(n,new URL(`./web/`,location.href).href);try{if(t.aborted)throw new DOMException(`Selection changed`,`AbortError`);Z&&ns(r.scene),e===`1`&&os(r.scene,Ss.get(e).data);let n=ws;Ys(r.scene),r.preparedMode=n;let i=new Set,a=new Set;r.scene.traverse(e=>{if(e.material)for(let t of[].concat(e.material))a.add(t)});for(let e of a)for(let t of Object.values(e))t?.isTexture&&i.add(t);let o=performance.now();for(let e of i){if(performance.now()-o>4){if(await new Promise(requestAnimationFrame),t.aborted)throw new DOMException(`Selection changed`,`AbortError`);o=performance.now()}vs.initTexture(e)}if(await vs.compileAsync(r.scene,Q,hs),t.aborted)throw new DOMException(`Selection changed`,`AbortError`);return r}catch(e){throw nc(r),e}}function vc(e,t){let n=t?.getObjectByName(`studio-floor-primary`),r=n?.isMesh?n:n?.children.find(e=>e.isMesh&&e.material?.map);for(let t of Es.links){if(t.a!==e)continue;let n=t.thresholdMesh;if(t.fallbackThresholdMaterial&&=(n.material.dispose(),n.material=t.fallbackThresholdMaterial,null),!r)continue;let i=n.material;ra(n,r)&&(t.fallbackThresholdMaterial=i)}}async function yc(){if(!Os){if(ks)return ks;ks=(async()=>{let e=await fetch(`./web/collision.json?v=meeting-table`);if(!e.ok)throw Error(`Collision data unavailable`);let t=await e.json();for(let e of xs)e.walkGeometry=[{object:e.root,kind:`wall`,parts:t[e.p.id].map(e=>new Te(new G(...e.slice(0,3)),new G(...e.slice(3))))}];Os=!0})();try{await ks}finally{ks=null}}}function bc(e){for(let t of xs){let n=t.root.worldToLocal(e.clone());if($i(n.x,n.z,t.data.polygon)||t.p.balcony&&$i(n.x,n.z,t.p.balcony)||t.p.vestibule&&$i(n.x,n.z,t.p.vestibule))return t.p.id}return null}function xc(e){document.body.classList.toggle(`inspection-open`,e);let t=X(`walk`),n=e?`Выйти из осмотра`:`Осмотреться`;t.ariaLabel=n,t.title=n,t.setAttribute(`aria-pressed`,String(e)),window.frameElement?.dispatchEvent(new CustomEvent(`studio-tour-inspection`,{detail:e}))}var Sc=()=>{let e=X(`viewport`).clientWidth,t=Math.max(1,X(`viewport`).clientHeight);vs.setSize(e,t,!1),Q.aspect=e/t,Q.updateProjectionMatrix(),xs.length&&!Ts?.active&&(Ns?Mc():ic(ws===`overview`?`all`:$)),zs()};addEventListener(`resize`,Sc),Z&&new ResizeObserver(Sc).observe(X(`viewport`)),Sc();var Cc=[],wc=[new c(new G(0,-1,0),3.521)],Tc=new Set([`balcony-canopy`,`room1-mesh-derived-ceiling-cove`,`north-ceiling-step-inner-face`,`north-ceiling-step-underside`,`diagonal-return-cove-fascia`,`north-return-cove-fascia`]),Ec=new Set([`paired-wall-above-jamb`,`paired-wall-end`,`paired-wall-sloped-top`,`paired-doorway-wall-header-top`]),Dc,Oc;async function kc(){if(Zs)return;if(Qs)return Qs;let e=new URL(`./web/`,location.href).href,t=async t=>{let n=await fetch(new URL(t,e),{credentials:`same-origin`});if(!n.ok)throw Error(`HTTP `+n.status);let r=await n.arrayBuffer();return Fs+=r.byteLength,(await bs.parseAsync(r,e)).scene};return Qs=(async()=>{try{Zs=await t(`overview-cutaway.glb?v=meeting-table`),Xs.attach(Zs),hs.add(Zs),Zs.updateMatrixWorld(!0),rc(),zs(),requestAnimationFrame(()=>{ws===`overview`&&!$s&&tc([$,...ec()])}),t(`overview-base.glb`).then(e=>{Oc=e,hs.add(Oc),Oc.updateMatrixWorld(!0),zs()}).catch(()=>{})}catch{X(`status`).textContent=`Не удалось загрузить карту`,X(`retry`).hidden=!1}finally{Qs=null}})(),Qs}var Ac=[];vs.setAnimationLoop(e=>{if(!document.hidden){if(Ts&&!Ts.active&&Ts.tick(e),Ts?.active){let t=Q.position.clone();Ts.tick(e);let n=bc(Q.position);if(n&&!Ds.has(n)){Q.position.copy(t),X(`status`).textContent=`Подгружаю следующее помещение…`;let e=[...new Set([...sc(As),n])];e.join(`,`)!==Ds.wanted.join(`,`)&&tc(e),zs()}else n&&n!==As&&(As=n,$=n,X(`room`)&&(X(`room`).value=n),tc(sc(n)),rc())}Cs&&(Cs=!1,jc())}});try{let e=await fetch(`./web/scene.json`);if(!e.ok)throw Error(`Scene unavailable`);Dc=await e.json(),X(`room`)&&(X(`room`).replaceChildren(new Option(`Выбрать комнату`,``)),X(`room`).options[0].disabled=!0);for(let e of Dc.rooms){let t=Bo(e.data,12170403);if(t.p=e,t.root.position.fromArray(e.position),t.root.rotation.y=He.degToRad(e.rotation),t.root.updateMatrixWorld(!0),t.ceilingHeight=e.ceilingHeight||3.8,xs.push(t),Ss.set(e.id,t),hs.add(t.root),X(`room`)?.append(new Option(e.name,e.id)),e.balcony){let n=new A;n.userData.walkPolygon=e.balcony,t.root.add(n),t.balcony=n;let i=new r(e.balcony.map(([e,t])=>new z(e,-t))),a=new ht(new Ue(i),new Qe({color:9673888,side:2}));a.rotation.x=-Math.PI/2,t.shell.add(a)}}Es=ia(xs,Dc.pairs),Es.root.traverse(e=>{Z&&Ec.has(e.name)&&Ac.push(e)}),hs.add(Es.root),Ls=performance.now()-Is,document.body.dataset.shellMs=String(Math.round(Ls)),hs.updateMatrixWorld(!0),Ds=new ss({concurrency:Z?2:1,load:_c,dispose:nc,onChange:rc,mount(e,t){let n=Ss.get(e);t.preparedMode!==ws&&Ys(t.scene),n.model=t.scene,n.root.add(t.scene),vc(n,t.scene),n.shell.visible=!1,n.modelWalls=(n.p.modelWalls||n.walls.map(e=>({name:`wall-`+e.index,normal:e.normal.toArray(),mid:e.mid.toArray()}))).map(e=>({group:t.scene.getObjectByName(e.name),normal:new G(...e.normal),mid:new G(...e.mid)})),n.ceilings=[],n.sectionExtras=[],t.scene.traverse(e=>{e.name.includes(`ceiling`)&&n.ceilings.push(e),Z&&(Tc.has(e.name)||/chandelier|pendant|rosette/.test(e.name))&&n.sectionExtras.push(e)}),n.root.updateWorldMatrix(!0,!0),zs()},unmount(e,t){let n=Ss.get(e);vc(n,null),n.root.remove(t.scene),n.model=null,n.sectionExtras=[],n.modelWalls=[],n.ceilings=[],n.shell.visible=!0,zs()}}),Ts=Yo({camera:Q,canvas:_s,controls:ys,rooms:xs,getConnections:()=>Es,invalidate:zs,inspection:Z,onMode(e){if(document.body.classList.toggle(`walking`,e),e){let e=document.querySelector(`footer details`);e&&(e.open=!1),tc(sc($))}Z?X(`inspection-instructions`).hidden=!e:(X(`walk`).textContent=e?`Выйти`:`Прогулка`,X(`help`).textContent=e?`WASD или кнопки — движение. Проведите по экрану для поворота.`:`Поворот — одним пальцем или мышью. Масштаб — двумя пальцами или колёсиком.`),ac()}});for(let e of[`room`,`overview`,`top`,`walk`,`balcony`,`cutaway`])X(e)&&(X(e).disabled=!1);X(`room`)&&(X(`room`).onchange=()=>{let e=X(`room`).value;e===``?t():e===`balcony`?o():pc(e)});function t(){Ns=!1,++js,Ts.active&&Ts.stop(),ws=`overview`,Z&&(ys.maxPolarAngle=Math.PI*.49),Ms=!1,X(`room`)&&(X(`room`).value=``),X(`overview`)?.classList.add(`active`),tc(Z&&!Zs?[]:[$,...ec()]),Z&&Zs&&X(`viewport`).querySelector(`canvas`).focus({preventScroll:!0}),ac(),ic(`all`,!1),rc()}X(`overview`)&&(X(`overview`).onclick=t),X(`top`).onclick=()=>{Ns=!1,Ts.active&&Ts.stop(),Ms=Z||!Ms,ic(ws===`overview`?`all`:$)},X(`cutaway`)&&(X(`cutaway`).onclick=()=>{Ps=!Ps,X(`cutaway`).setAttribute(`aria-pressed`,String(Ps)),X(`cutaway`).textContent=Ps?`Кукольный домик: вкл.`:`Кукольный домик: выкл.`,zs()});async function n(){if(Ts.active){Ts.stop(),Ns?Mc():ic();return}let e=++js,t=Ns;X(`walk`).disabled=!0;try{if(ws=`room`,X(`room`)&&(X(`room`).value=$),X(`overview`)?.classList.remove(`active`),tc(sc($)),X(`status`).textContent=`Готовлю прогулку…`,await Promise.all([Ds.waitFor($),yc()]),e!==js)return;As=$,Ms=!1,t||(Ns=!1),ac();let n=Ss.get($);Ts.start(n,t?n.p.balcony:void 0)?rc():X(`status`).textContent=`Свободная стартовая точка не найдена.`}catch(e){e.name!==`AbortError`&&(X(`status`).textContent=`Не удалось подготовить осмотр.`,X(`retry`).hidden=!1)}finally{X(`walk`).disabled=!1}}function i(){if(!$s)return;let e=$s;$s=null,++js,Ts.active&&Ts.stop(),document.pointerLockElement===_s&&document.exitPointerLock(),xc(!1),e.mode===`overview`?($=e.selected,t()):pc(e.selected,{balcony:e.balcony}),e.topView&&X(`top`).click()}async function a(){if($s){i();return}let e={mode:ws,selected:$,topView:Ms,balcony:Ns};$s=e;let t=++js,n=e.mode===`overview`?Vs:e.selected,r=Ss.get(n);xc(!0),Ts.captureMouse(),tc(sc(n)),rc();try{if(await Promise.all([Ds.waitFor(n),yc()]),t!==js)return;if(ws=`room`,As=$=n,Ms=!1,!Ts.start(r,e.balcony?r.p.balcony:void 0))throw Error(`No walkable spawn`);_s.focus({preventScroll:!0}),rc()}catch{if(t!==js)return;i(),X(`status`).textContent=`Не удалось начать осмотр.`,X(`retry`).hidden=!1}}X(`walk`).onclick=Z?a:n;function o(){return pc(`1`,{balcony:!0})}if(X(`balcony`)&&(X(`balcony`).onclick=o),Z&&(_s.tabIndex=0,_s.setAttribute(`aria-label`,`Трёхмерный вид студии`),Xs=Qo(xs,e=>{X(`room-points`).hidden=!0,e===`balcony`?o():pc(e),requestAnimationFrame(()=>_s.focus({preventScroll:!0}))}),X(`whole`).onclick=t,X(`orbit`).disabled=!1,X(`orbit`).onclick=()=>{Ts.active&&Ts.stop(),Ms=!1,Ns?Mc():ic(ws===`overview`?`all`:$)}),X(`retry`).onclick=()=>{Z&&ws===`overview`&&!Zs?(X(`retry`).hidden=!0,kc()):(Ds.retry(),rc())},X(`capture`)&&(X(`capture`).onclick=async()=>{jc();let e=await new Promise(e=>vs.domElement.toBlob(e,`image/png`));try{if(location.hostname!==`127.0.0.1`||location.port!==`8772`)throw Error(`Download`);let t=await fetch(`/api/export/png`,{method:`POST`,body:e,headers:{"Content-Type":`image/png`}});if(!t.ok)throw Error(`Static hosting`);let n=await t.json();X(`capture`).dataset.saved=JSON.stringify(n),X(`status`).textContent=`Вид сохранён`}catch{let t=URL.createObjectURL(e),n=document.createElement(`a`);n.href=t,n.download=`Tattoo-Office-SPB.png`,n.click(),setTimeout(()=>URL.revokeObjectURL(t),1e3)}}),Z?(t(),kc()):await pc(Vs),new URLSearchParams(location.search).get(`benchmark`)===`1`){jc();let e=Q.position.clone(),t=ys.target.clone(),n=e.clone().sub(t),r=new G(0,1,0),{measureView:i}=await ps(async()=>{let{measureView:e}=await import(`./performance-check-DCLbRS-4.js`);return{measureView:e}},[],import.meta.url);await i({renderer:vs,info:{room:$,loadedRooms:[...Ds.loaded.keys()],modelBytes:Fs,materialMode:ms?`mobile-no-refraction`:`desktop-physical`,appShellMs:Math.round(Ls),appDetailMs:Math.round(Rs),contactShadows:Ws},step(e){Q.position.copy(n).applyAxisAngle(r,e).add(t),Q.lookAt(t),jc()},restore(){Q.position.copy(e),ys.target.copy(t),ys.update(),jc()}})}}catch(e){hc.abort(),X(`status`).textContent=`Не удалось открыть модель: `+e.message}function jc(){if(!Dc||!Es)return;let e=Z&&ws===`overview`,t=e&&Ds.loaded.size===xs.length,n=e&&!!Zs,r=!!Ts?.active,i=Z&&ws===`room`&&!r,a=e&&Q.position.clone().sub(ys.target).normalize().y>.92;if(Z){let n=r?`walk`:Ms?`top`:`orbit`;for(let e of[`top`,`orbit`])X(e).setAttribute(`aria-pressed`,String(e===n));Zs&&(Zs.visible=e&&!t,e&&Xs.showPreview(Ds.loaded)),document.body.dataset.overviewDetail=t?`full`:`preview`}ws===`room`&&Ds?.has($)&&Gs();let o=new Map(xs.map(e=>[e,e.root.worldToLocal(Q.position.clone())])),s=xs.find(e=>(!i||e.p.id===$)&&ca(e,o.get(e))),c=i?void 0:Es.links.find(e=>Q.position.y>=-.1&&Q.position.y<e.height-.02&&$i(Q.position.x,Q.position.z,e.threshold??e.polygon)),l=!!(s||c),u;if(i)u=new Set([$]);else if(ws===`overview`)u=new Set(ec());else{let e=r?As:s?.p.id||$,t=[...new Set([...sc(e),...r?[]:sc($)])];u=r?new Set(t):fc(t,c),u.add($),s&&u.add(s.p.id)}for(let t of xs)t.root.visible=u.has(t.p.id)&&(!e||n&&!!t.model);if(!Z&&Ds?.has($)&&ws===`room`&&!r&&!X(`walk`).disabled){let e=[...new Set([$,...u])];e.join(`,`)!==Ds.wanted.join(`,`)&&tc(e)}vs.clippingPlanes=e?wc:Cc,Oc&&(Oc.visible=e&&!!Zs&&Ds.loaded.size===0);let d=0,f=0;for(let t of xs){if(!t.root.visible)continue;for(let e of t.sectionExtras||[])e.visible=!0;let n=la(t,o.get(t),{enabled:Ps&&!a,walking:r||!e&&l});if(e)for(let e of[...t.ceilings,...t.sectionExtras])e.visible=!1;d+=n.hidden,f+=n.total}let p=!i&&(!e||t);Es.root.visible=p;for(let e of Es.links)e.group.visible=p&&e.a.root.visible&&e.b.root.visible;if(p){for(let e of Ac)e.visible=!0;if(ua(Es,Ps&&!a,r||!e&&l,Q.position.y),e)for(let e of Ac)e.visible=!1}e&&(document.body.dataset.hiddenOverviewWalls=String(d+(Zs&&!t?Xs.cutWalls(Q,ys.target):0))),document.body.dataset.visibleRooms=xs.filter(e=>e.root.visible).map(e=>e.p.id).join(`,`),document.body.dataset.interiorContext=String(l);let m=Pt({wanted:Ws,mode:ws,ready:!!Hs,loaded:Ds?.has($)});if(m?Hs.render():vs.render(hs,Q),Z){let t=e&&!!Zs;Xs.placePoints(Q,t&&!$s),t&&(X(`preview`).hidden=!0,document.body.dataset.overviewReady=`true`)}document.body.dataset.renderMode=m?`contact`:`standard`,document.body.dataset.contactShadows=m?`on`:`off`,document.body.dataset.cameraPosition=JSON.stringify(Q.position.toArray()),document.body.dataset.cutaway=JSON.stringify({enabled:Ps,walking:!!Ts?.active,hiddenWalls:d,totalWalls:f}),Ds&&X(`metrics`)?.closest(`details`)?.open&&(X(`metrics`).textContent=`Передано моделей: ${(Fs/1e6).toFixed(1)} МБ. В памяти помещений: ${Ds.loaded.size}. ${vs.info.render.calls} вызовов · ${Math.round(vs.info.render.triangles/1e3)} тыс. треугольников.`)}function Mc(){let e=Ss.get(`1`),t=e.p.balcony,n=[];for(let[r,i]of t)for(let t of[0,3.985])n.push(e.root.localToWorld(new G(r,t,i)));let r=new Te().setFromPoints(n).getCenter(new G),i=new G(5.2,3.8,5.2).transformDirection(e.root.matrixWorld),a=new G().crossVectors(Q.up,i).normalize(),o=new G().crossVectors(i,a).normalize(),s=Math.tan(He.degToRad(Q.fov/2)),c=innerWidth<650?.56:.78,l=1;for(let e of n){let t=e.clone().sub(r),n=t.dot(i);l=Math.max(l,n+Math.abs(t.dot(a))/(s*Q.aspect*.9),n+Math.abs(t.dot(o))/(s*c))}ys.target.copy(r),Q.position.copy(r).addScaledVector(i,l),ys.update(),zs()}