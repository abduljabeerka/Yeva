'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, ContactShadows, AdaptiveDpr, useTexture } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import type { MutableRefObject } from 'react';
import * as THREE from 'three';

const NAVY = '#17183d';
const INK = '#090a20';
const CREAM = '#f2f0eb';
const COLORS = ['#24375f','#666a73','#4c3e3b','#202126'];

const stages = [
  {kicker:'YEVA MED / THE PEOPLE WHO CARE',title:'We engineer \n comfort.',copy:'Premium medical wear and healthcare essentials, made for those who care. We design confidence for every step of your professional journey.',action:'DISCOVER YEVAMED'},
  {kicker:'YEVA / FABRIC TECHNOLOGY',title:'Advanced fabric. \n Exceptional comfort.',copy:'Explore YEVA RYX, YEVA FLEX and YEVA LITE: soft-touch comfort, stretch, breathability and thoughtful everyday performance.',action:'EXPLORE FABRIC TECHNOLOGY'},
  {kicker:'YEVA CAREKIT / COURSE-WISE ESSENTIALS',title:'Different courses. \n One complete solution.',copy:'Carefully curated, course-specific medical kits designed to support learning, practical classes and clinical journeys.',action:'EXPLORE CAREKITS'},
  {kicker:'YEVA / THE COLOUR STUDY',title:'Your shift. \n Your shade.',copy:'A considered palette for the everyday. Find the colour that feels like you.',action:'SHOP THE COLOURS'}
];

function useCloth(color:string, roughness=.91){
 return useMemo(()=>{
  // Procedural poly-cotton / stretch-scrub textile: interlaced warp and weft,
  // tiny fibre variation, a woven normal field and a non-uniform roughness map.
  const size=512;
  const colorCanvas=document.createElement('canvas');
  const normalCanvas=document.createElement('canvas');
  const roughCanvas=document.createElement('canvas');
  colorCanvas.width=colorCanvas.height=normalCanvas.width=normalCanvas.height=roughCanvas.width=roughCanvas.height=size;
  const c=colorCanvas.getContext('2d');
  const n=normalCanvas.getContext('2d');
  const r=roughCanvas.getContext('2d');
  if(!c||!n||!r) return new THREE.MeshPhysicalMaterial({
   color,roughness,metalness:0,side:THREE.DoubleSide,sheen:0.24,sheenRoughness:.92
  });

  // Neutral greyscale albedo lets the garment's selected YEVA colour remain true.
  c.fillStyle='rgb(218,218,218)';c.fillRect(0,0,size,size);
  const height=new Float32Array(size*size);
  const seeded=(x:number,y:number)=>{
   const v=Math.sin(x*127.1+y*311.7+17.3)*43758.5453;
   return v-Math.floor(v);
  };

  // Fine woven yarns: alternating over/under intersections with slight irregularity.
  for(let y=0;y<size;y+=4){
   const wobble=(seeded(1,y)-.5)*.7;
   for(let x=0;x<size;x++){
    const strand=(Math.sin((x+wobble)*Math.PI/2)+1)*.5;
    const fleck=seeded(x,y);
    const shade=204+Math.round(strand*17)+(fleck>.985?7:0);
    c.fillStyle=`rgb(${shade},${shade},${shade})`;
    c.fillRect(x,y,1,2);
    height[y*size+x]=.34+strand*.16+(fleck-.5)*.035;
    if(y+1<size)height[(y+1)*size+x]=height[y*size+x];
   }
  }
  for(let x=0;x<size;x+=4){
   const wobble=(seeded(x,2)-.5)*.7;
   for(let y=0;y<size;y++){
    const strand=(Math.sin((y+wobble)*Math.PI/2)+1)*.5;
    const fleck=seeded(x,y+5);
    const shade=209+Math.round(strand*13)+(fleck>.99?6:0);
    c.fillStyle=`rgb(${shade},${shade},${shade})`;
    c.fillRect(x,y,2,1);
    height[y*size+x]=Math.min(1,height[y*size+x]+strand*.055);
   }
  }
  // Short staple fibres and subtle lint, deliberately restrained for premium scrub cloth.
  for(let i=0;i<5200;i++){
   const x=Math.floor(seeded(i,11)*size),y=Math.floor(seeded(i,29)*size);
   const alpha=.025+seeded(i,47)*.055;
   const light=seeded(i,53)>.5;
   c.fillStyle=light?`rgba(255,255,255,${alpha})`:`rgba(35,39,48,${alpha})`;
   c.fillRect(x,y,1+(i%5===0?2:0),1);
  }

  // Convert the woven height field to a tangent-space normal map.
  const normalImage=n.createImageData(size,size);
  const roughImage=r.createImageData(size,size);
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
   const i=y*size+x, left=height[y*size+((x+size-1)%size)], right=height[y*size+((x+1)%size)];
   const up=height[((y+size-1)%size)*size+x], down=height[((y+1)%size)*size+x];
   const dx=(left-right)*2.8,dy=(up-down)*2.8;
   const nx=-dx,ny=-dy,nz=1;
   const len=Math.hypot(nx,ny,nz);
   const q=i*4;
   normalImage.data[q]=Math.round((nx/len*.5+.5)*255);
   normalImage.data[q+1]=Math.round((ny/len*.5+.5)*255);
   normalImage.data[q+2]=Math.round((nz/len*.5+.5)*255);
   normalImage.data[q+3]=255;
   const variation=seeded(x,y)*15;
   const rv=Math.max(0,Math.min(255,Math.round(218+variation)));
   roughImage.data[q]=roughImage.data[q+1]=roughImage.data[q+2]=rv;
   roughImage.data[q+3]=255;
  }
  n.putImageData(normalImage,0,0);r.putImageData(roughImage,0,0);

  const map=new THREE.CanvasTexture(colorCanvas);
  const normalMap=new THREE.CanvasTexture(normalCanvas);
  const roughnessMap=new THREE.CanvasTexture(roughCanvas);
  for(const tex of [map,normalMap,roughnessMap]){
   tex.wrapS=tex.wrapT=THREE.RepeatWrapping;
   tex.repeat.set(2.2,3.0);
   tex.anisotropy=12;
   tex.generateMipmaps=true;
   tex.minFilter=THREE.LinearMipmapLinearFilter;
   tex.magFilter=THREE.LinearFilter;
  }
  map.colorSpace=THREE.SRGBColorSpace;
  normalMap.colorSpace=THREE.NoColorSpace;
  roughnessMap.colorSpace=THREE.NoColorSpace;

  return new THREE.MeshPhysicalMaterial({
   color,map,normalMap,normalScale:new THREE.Vector2(.34,.34),
   roughness,roughnessMap,metalness:0,
   sheen:.32,sheenRoughness:.94,sheenColor:new THREE.Color('#d9deea'),
   clearcoat:.015,clearcoatRoughness:.98,
   side:THREE.DoubleSide
  });
 },[color,roughness]);
}

function stitchCurve(points:THREE.Vector3[],radius=.006){
 const curve=new THREE.CatmullRomCurve3(points);
 return new THREE.TubeGeometry(curve,Math.max(24,points.length*8),radius,5,false);
}

function TailoredSleeve({start,end,material}:{start:[number,number,number];end:[number,number,number];material:THREE.Material}){
 const a=new THREE.Vector3(...start),b=new THREE.Vector3(...end);
 const direction=new THREE.Vector3().subVectors(b,a);
 const geometry=useMemo(()=>new THREE.CylinderGeometry(.29,.225,direction.length(),24,10,false),[direction.length()]);
 const position=a.clone().add(b).multiplyScalar(.5);
 const quaternion=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),direction.clone().normalize());
 return <mesh geometry={geometry} position={position} quaternion={quaternion} material={material} castShadow receiveShadow/>;
}

function ScrubJacket({color}:{color:string}){
 const fabric=useCloth(color,.94);
 const bodyMesh=useRef<THREE.Mesh>(null);
 const stitch=useMemo(()=>new THREE.MeshStandardMaterial({color:'#b9c3d8',roughness:1,transparent:true,opacity:.55}),[]);
 const collar=useMemo(()=>new THREE.MeshPhysicalMaterial({color,roughness:.96,side:THREE.DoubleSide}),[color]);
 const details=useMemo(()=>{
  // Tailored shoulder-to-hem seams, V-neck facing, pocket outlines and hem stitching.
  const paths=[
   [[-.78,1.10,.19],[-.55,.96,.22],[-.20,.90,.23],[0,.90,.23],[.20,.90,.23],[.55,.96,.22],[.78,1.10,.19]],
   [[-.98,.43,.20],[-.94,.05,.22],[-.93,-.45,.22],[-.91,-1.08,.20]],
   [[.98,.43,.20],[.94,.05,.22],[.93,-.45,.22],[.91,-1.08,.20]],
   [[-.91,-1.10,.19],[-.48,-1.13,.20],[0,-1.14,.20],[.48,-1.13,.20],[.91,-1.10,.19]],
   [[-.16,1.19,.24],[0,.91,.25],[.16,1.19,.24]],
   [[-.68,.22,.245],[-.68,-.20,.245],[-.40,-.20,.245],[-.40,.22,.245]],
   [[.40,.22,.245],[.40,-.20,.245],[.68,-.20,.245],[.68,.22,.245]]
  ];
  return paths.map(points=>stitchCurve(points.map(v=>new THREE.Vector3(...v as [number,number,number])),.006));
 },[]);
 const body=useMemo(()=>{
  const s=new THREE.Shape();
  // More natural scrub silhouette: dropped shoulders, angled sleeves, curved waist and soft hem.
  s.moveTo(-.72,1.13);
  s.quadraticCurveTo(-.86,1.12,-1.02,1.04);
  s.lineTo(-1.43,.82);s.quadraticCurveTo(-1.51,.77,-1.47,.65);
  s.lineTo(-1.22,.10);s.quadraticCurveTo(-1.18,.01,-1.08,.06);
  s.lineTo(-.98,.20);s.lineTo(-.94,-.92);
  s.quadraticCurveTo(-.94,-1.12,-.77,-1.13);
  s.quadraticCurveTo(0,-1.18,.77,-1.13);
  s.quadraticCurveTo(.94,-1.12,.94,-.92);
  s.lineTo(.98,.20);s.lineTo(1.08,.06);
  s.quadraticCurveTo(1.18,.01,1.22,.10);
  s.lineTo(1.47,.65);s.quadraticCurveTo(1.51,.77,1.43,.82);
  s.lineTo(1.02,1.04);s.quadraticCurveTo(.86,1.12,.72,1.13);
  s.lineTo(.28,1.16);s.lineTo(.16,.91);s.lineTo(0,.69);s.lineTo(-.16,.91);s.lineTo(-.28,1.16);s.closePath();
  const neck=new THREE.Path();neck.moveTo(-.16,1.17);neck.lineTo(0,.91);neck.lineTo(.16,1.17);neck.lineTo(-.16,1.17);s.holes.push(neck);
  const g=new THREE.ExtrudeGeometry(s,{depth:.23,bevelEnabled:true,bevelSegments:7,steps:2,bevelSize:.055,bevelThickness:.045,curveSegments:20});
  // A gentle curved chest and natural drape: not a flat cardboard cut-out.
  const pos=g.attributes.position as THREE.BufferAttribute;
  for(let i=0;i<pos.count;i++){
   const x=pos.getX(i),y=pos.getY(i),z=pos.getZ(i);
   const torso=Math.max(0,1-Math.pow(x/1.55,2));
   const chest=torso*Math.max(0,Math.min(1,(y+1.15)/2.3))*.065;
   const folds=(Math.sin(y*8+x*2.4)*.009+Math.sin(y*13-x*3.2)*.004)*torso;
   pos.setZ(i,z+chest+folds);
  }
  g.computeVertexNormals();return g;
 },[]);
 const restPose=useMemo(()=>new Float32Array(body.attributes.position.array as ArrayLike<number>),[body]);
 useFrame((state)=>{
  if(!bodyMesh.current)return;
  const pos=bodyMesh.current.geometry.attributes.position as THREE.BufferAttribute;
  const t=state.clock.elapsedTime;
  for(let i=0;i<pos.count;i++){
   const x=pos.getX(i),y=pos.getY(i);
   const hem=THREE.MathUtils.clamp((.2-y)/1.35,0,1);
   const sleeve=THREE.MathUtils.clamp((Math.abs(x)-.55)/.95,0,1);
   const softFold=Math.sin(t*1.45+x*2.1+y*1.6)*.014*hem+Math.sin(t*1.1+y*2.4)*.009*sleeve;
   pos.setZ(i,restPose[i*3+2]+softFold);
  }
  pos.needsUpdate=true;bodyMesh.current.geometry.computeVertexNormals();
 });
 const pocket=useMemo(()=>{
  const s=new THREE.Shape();s.moveTo(-.17,.13);s.lineTo(.17,.13);s.lineTo(.17,-.17);s.quadraticCurveTo(0,-.22,-.17,-.17);s.closePath();
  return new THREE.ExtrudeGeometry(s,{depth:.035,bevelEnabled:true,bevelSegments:3,bevelSize:.012,bevelThickness:.008,curveSegments:10});
 },[]);
 const collarGeo=useMemo(()=>{
  const s=new THREE.Shape();s.moveTo(-.23,.0);s.lineTo(0,-.34);s.lineTo(.23,0);s.lineTo(.16,.08);s.lineTo(0,-.18);s.lineTo(-.16,.08);s.closePath();
  return new THREE.ExtrudeGeometry(s,{depth:.035,bevelEnabled:true,bevelSegments:3,bevelSize:.008,bevelThickness:.008});
 },[]);
 return <group>
  <mesh ref={bodyMesh} geometry={body} material={fabric} castShadow receiveShadow/>
  <TailoredSleeve start={[-.98,.88,.02]} end={[-1.38,.24,.02]} material={fabric}/>
  <TailoredSleeve start={[.98,.88,.02]} end={[1.38,.24,.02]} material={fabric}/>
  {/* Reinforced V-neck binding */}
  <mesh geometry={collarGeo} material={collar} position={[0,1.18,.245]} castShadow/>
  {/* Chest utility pocket with stitched edge and small brand tab */}
  <mesh geometry={pocket} material={fabric} position={[.52,.12,.235]} castShadow/>
  <mesh position={[.52,.255,.285]}><boxGeometry args={[.12,.018,.012]}/><meshStandardMaterial color="#d5d9e4" roughness={1}/></mesh>
  {/* Functional side pockets, subtly raised from the body */}
  <mesh position={[-.62,-.48,.245]} material={fabric} castShadow><boxGeometry args={[.43,.38,.045]}/></mesh>
  <mesh position={[-.62,-.29,.275]} material={stitch}><boxGeometry args={[.39,.008,.006]}/></mesh>
  {/* Sleeve cuffs and hem facings */}
  <mesh position={[-1.34,.20,.10]} rotation={[0,0,-.42]} material={fabric} castShadow><boxGeometry args={[.36,.055,.27]}/></mesh>
  <mesh position={[1.34,.20,.10]} rotation={[0,0,.42]} material={fabric} castShadow><boxGeometry args={[.36,.055,.27]}/></mesh>
  <mesh position={[0,-1.105,.12]} material={fabric}><boxGeometry args={[1.73,.045,.25]}/></mesh>
  {details.map((geo,i)=><mesh key={i} geometry={geo} material={stitch}/>)}
 </group>;
}

function ScrubPants({color}:{color:string}){
 const fabric=useCloth(color);
 const shape=useMemo(()=>{
   const s=new THREE.Shape();s.moveTo(-.78,.8);s.lineTo(.78,.8);s.lineTo(.67,.12);s.lineTo(.57,-1.55);s.lineTo(.1,-1.55);s.lineTo(0,-.18);s.lineTo(-.1,-1.55);s.lineTo(-.57,-1.55);s.lineTo(-.67,.12);s.closePath();return s;
 },[]);
 const geo=useMemo(()=>new THREE.ExtrudeGeometry(shape,{depth:.16,bevelEnabled:true,bevelSegments:3,bevelSize:.03,bevelThickness:.03}),[shape]);
 return <group position={[0,-1.95,-.03]}>
  <mesh geometry={geo} material={fabric} castShadow receiveShadow/>
  <mesh position={[-.36,-.72,.12]} material={fabric} castShadow receiveShadow>
   <cylinderGeometry args={[.235,.19,1.62,20,10]}/>
  </mesh>
  <mesh position={[.36,-.72,.12]} material={fabric} castShadow receiveShadow>
   <cylinderGeometry args={[.235,.19,1.62,20,10]}/>
  </mesh>
  <mesh material={fabric} position={[0,.68,.13]}><boxGeometry args={[1.48,.07,.19]}/></mesh>
  <mesh material={fabric} position={[-.46,.1,.13]}><boxGeometry args={[.28,.38,.025]}/></mesh>
  <mesh material={fabric} position={[.46,.1,.13]}><boxGeometry args={[.28,.38,.025]}/></mesh>
 </group>;
}

const PERSON_ASSETS = [
  '/images/person-navy.png',
  '/images/person-slate.png',
  '/images/person-brown.png',
  '/images/person-graphite.png'
];

function RealPerson({src,scale=1,position=[0,0,0],rotation=0}:{src:string;scale?:number;position?:[number,number,number];rotation?:number}){
 const texture=useTexture(src);
 texture.colorSpace=THREE.SRGBColorSpace;
 const mesh=useRef<THREE.Mesh>(null);
 const aspect=(texture.image?.width||600)/(texture.image?.height||1500);
 const geometry=useMemo(()=>new THREE.PlaneGeometry(5.65*aspect,5.65,28,48),[aspect]);
 const material=useMemo(()=>new THREE.MeshPhysicalMaterial({
   map:texture,transparent:true,alphaTest:.025,roughness:.96,metalness:0,
   side:THREE.DoubleSide,depthWrite:false
 }),[texture]);
 useFrame((state,dt)=>{
   if(!mesh.current)return;
   mesh.current.rotation.y=THREE.MathUtils.damp(mesh.current.rotation.y,rotation+Math.sin(state.clock.elapsedTime*.28+position[0])*.018,2,dt);
   const pos=geometry.attributes.position as THREE.BufferAttribute;
   const t=state.clock.elapsedTime;
   for(let i=0;i<pos.count;i++){
     const x=pos.getX(i),y=pos.getY(i);
     // Subtle curved depth gives the photographic human a volumetric presence in the showroom.
     const bodyBulge=Math.max(0,1-Math.abs(x)/(2.825*aspect))*.075;
     const clothMotion=Math.sin(y*2.5+t*.38+position[0])*.012;
     pos.setZ(i,bodyBulge+clothMotion);
   }
   pos.needsUpdate=true;geometry.computeVertexNormals();
 });
 return <group position={position} scale={scale}>
   <mesh ref={mesh} geometry={geometry} material={material} castShadow receiveShadow/>
   <mesh position={[0,-2.72,-.05]} rotation={[-Math.PI/2,0,0]}>
    <circleGeometry args={[.9,48]}/>
    <meshBasicMaterial color="#d4d0ca" transparent opacity={.13}/>
   </mesh>
 </group>;
}

function FabricCurtain({z=0}:{z?:number}){
 const mesh=useRef<THREE.Mesh>(null);
 const geo=useMemo(()=>new THREE.PlaneGeometry(42,8,220,72),[]);
 const material=useMemo(()=>new THREE.MeshPhysicalMaterial({color:'#283a68',roughness:.7,metalness:.05,clearcoat:.25,side:THREE.DoubleSide}),[]);
 useFrame((state)=>{
   if(!mesh.current)return;
   const pos=geo.attributes.position as THREE.BufferAttribute;
   const t=state.clock.elapsedTime;
   for(let i=0;i<pos.count;i++){
     const x=pos.getX(i),y=pos.getY(i);
     const wave=Math.sin(x*.75+t*.34)*.48+Math.sin(x*1.45-y*.35-t*.24)*.19;
     const fold=Math.pow(Math.max(0,Math.cos(x*.52+t*.16)),5)*.34;
     pos.setZ(i,wave+fold+Math.sin(y*.7+t*.22)*.12);
   }
   pos.needsUpdate=true;geo.computeVertexNormals();
 });
 return <mesh ref={mesh} geometry={geo} material={material} position={[0,0,z]} rotation={[0,0,-.1]} castShadow receiveShadow/>;
}

function TorusArch({z,scale=1}:{z:number;scale?:number}){
 const mat=useCloth('#9c9bb3',.34);
 return <group position={[0,0,z]} scale={scale}>
  {[0,1,2,3,4].map(i=><mesh key={i} material={mat} position={[0,0,-i*.72]} rotation={[0,0,Math.PI/2]} castShadow>
   <torusGeometry args={[5.2+i*.12,.018,8,120,Math.PI]}/>
  </mesh>)}
 </group>;
}

function FloatingCube({color,position,scale=1}:{color:string;position:[number,number,number];scale?:number}){
 const material=useCloth(color,.52);
 return <Float speed={1.1} rotationIntensity={.4} floatIntensity={.4}>
  <mesh position={position} scale={scale} material={material} castShadow receiveShadow><boxGeometry args={[.75,.75,.75,4,4,4]}/></mesh>
 </Float>;
}


function Rod({from,to,radius=.025,material}:{from:[number,number,number];to:[number,number,number];radius?:number;material:THREE.Material}){
 const a=new THREE.Vector3(...from),b=new THREE.Vector3(...to),direction=new THREE.Vector3().subVectors(b,a);
 const geometry=useMemo(()=>new THREE.CylinderGeometry(radius,radius,direction.length(),10),[radius,direction.length()]);
 const position=a.clone().add(b).multiplyScalar(.5);
 const quaternion=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),direction.clone().normalize());
 return <mesh geometry={geometry} position={position} quaternion={quaternion} material={material} castShadow receiveShadow/>;
}

function GarmentHanger({metal=false}:{metal?:boolean}){
 const wood=useMemo(()=>new THREE.MeshStandardMaterial({color:metal?'#b9bbc8':'#8a6446',roughness:metal?.32:.58,metalness:metal?.82:.08}),[metal]);
 const hook=useMemo(()=>new THREE.MeshStandardMaterial({color:'#c4c5d0',roughness:.25,metalness:.85}),[]);
 return <group position={[0,1.46,.04]}>
   <Rod from={[0,.37,0]} to={[-1.08,-.26,0]} radius={.035} material={wood}/>
   <Rod from={[0,.37,0]} to={[1.08,-.26,0]} radius={.035} material={wood}/>
   <Rod from={[-1.08,-.26,0]} to={[1.08,-.26,0]} radius={.035} material={wood}/>
   <mesh position={[0,.52,0]} material={hook} castShadow><torusGeometry args={[.13,.026,10,36,Math.PI*1.7]}/></mesh>
   <Rod from={[0,.39,0]} to={[0,.65,0]} radius={.026} material={hook}/>
 </group>;
}

const GARMENT_ASSETS=[
 '/images/garments/yeva-scrub-navy.png',
 '/images/garments/yeva-scrub-stone.png',
 '/images/garments/yeva-scrub-emerald.png',
 '/images/garments/yeva-scrub-burgundy.png'
];

function HangerOutfit({index,position,progressRef,selectedIndex,selectedColor,hoveredIndex,onHover,onSelect}:{index:number;position:[number,number,number];progressRef:MutableRefObject<number>;selectedIndex:number|null;selectedColor:string;hoveredIndex:number|null;onHover:(index:number|null)=>void;onSelect:(index:number)=>void}){
 const swing=useRef<THREE.Group>(null);
 const texture=useTexture(selectedIndex===index?GARMENT_ASSETS[productColorIndex(selectedColor)]:GARMENT_ASSETS[index]);
 texture.colorSpace=THREE.SRGBColorSpace;
 texture.anisotropy=12;
 const geometry=useMemo(()=>new THREE.PlaneGeometry(2.55,3.82,40,64),[]);
 const material=useMemo(()=>new THREE.MeshPhysicalMaterial({
  map:texture,transparent:true,alphaTest:.018,roughness:.94,metalness:0,
  sheen:.2,sheenRoughness:.96,side:THREE.DoubleSide,depthWrite:false
 }),[texture]);
 const rackX=position[0];
 const hovered=hoveredIndex===index&&selectedIndex===null;
 useFrame((state,dt)=>{
  if(!swing.current)return;
  const t=state.clock.elapsedTime;
  const intro=.12,chapter=.22;
  const local=(progressRef.current-intro-index*chapter)/chapter;
  const u=THREE.MathUtils.clamp(local,0,1);
  const triangular=local<0||local>1?0:(u<.5?u*2:(1-u)*2);
  const travel=THREE.MathUtils.smoothstep(triangular,0,1);
  const railProgress=THREE.MathUtils.smoothstep(THREE.MathUtils.clamp(travel*2.15,0,1),0,1);
  const pullProgress=THREE.MathUtils.smoothstep(THREE.MathUtils.clamp((travel-.18)/.82,0,1),0,1);
  const isSelected=selectedIndex===index;
  const isHovered=hoveredIndex===index&&selectedIndex===null;
  const focus=isSelected?1:pullProgress;
  const dropT=THREE.MathUtils.clamp((t-index*.13)/.9,0,1);
  const dropEase=1-Math.pow(1-dropT,3);
  const rackY=THREE.MathUtils.lerp(4.3,1.42,dropEase)+Math.sin(dropT*Math.PI*2)*.12*(1-dropT);
  const targetX=isSelected?-.72:THREE.MathUtils.lerp(rackX,2.0,railProgress);
  const targetY=isSelected?-.18:THREE.MathUtils.lerp(rackY,.2,pullProgress);
  const targetZ=isSelected?1.1:THREE.MathUtils.lerp(-4.25,.5,pullProgress);
  const targetScale=isSelected?.91:THREE.MathUtils.lerp(.57,.86,pullProgress);
  if(!isSelected&&progressRef.current<.12){
   swing.current.position.x=THREE.MathUtils.damp(swing.current.position.x,rackX,4,dt);
   swing.current.position.y=THREE.MathUtils.damp(swing.current.position.y,rackY,5,dt);
   swing.current.position.z=THREE.MathUtils.damp(swing.current.position.z,-4.25,4,dt);
   swing.current.scale.setScalar(THREE.MathUtils.damp(swing.current.scale.x,.57,4,dt));
  }else{
   swing.current.position.x=THREE.MathUtils.damp(swing.current.position.x,targetX,4.5,dt);
   swing.current.position.y=THREE.MathUtils.damp(swing.current.position.y,targetY,4.5,dt);
   swing.current.position.z=THREE.MathUtils.damp(swing.current.position.z,targetZ,4.5,dt);
   swing.current.scale.setScalar(THREE.MathUtils.damp(swing.current.scale.x,targetScale,4,dt));
  }
  const sideAngle=isHovered?0:(isSelected?0:-.72+Math.sin(t*.45+index)*.018);
  const targetRotationY=isSelected?Math.sin(t*1.1)*.025:(isHovered?0:sideAngle);
  swing.current.rotation.y=THREE.MathUtils.damp(swing.current.rotation.y,targetRotationY,4.5,dt);
  swing.current.rotation.z=THREE.MathUtils.damp(swing.current.rotation.z,Math.sin(t*1.4+index)*.025*focus,3,dt);
  // Tiny vertex drape animation on the photographic garment surface.
  const pos=geometry.attributes.position as THREE.BufferAttribute;
  for(let v=0;v<pos.count;v++){
   const x=pos.getX(v),y=pos.getY(v);
   const hem=THREE.MathUtils.clamp((1.75-y)/3.5,0,1);
   const curve=.12*(1-Math.pow(x/1.275,2));
   const fold=(Math.sin(t*1.4+x*2+y*.8+index)*.014+Math.sin(t*.8+y*1.6)*.008)*hem;
   pos.setZ(v,curve+fold);
  }
  pos.needsUpdate=true;geometry.computeVertexNormals();
 });
 return <group ref={swing} position={[rackX,4.3,-4.25]} scale={.57}
   onPointerOver={(e)=>{e.stopPropagation();onHover(index);document.body.style.cursor='pointer';}}
   onPointerOut={(e)=>{e.stopPropagation();onHover(null);document.body.style.cursor='auto';}}
   onClick={(e)=>{e.stopPropagation();onSelect(index);onHover(null);}}>
   <mesh geometry={geometry} material={material} castShadow receiveShadow/>
 </group>;
}

function productColorIndex(color:string){
 const idx=['#172f62','#777b83','#075e4f','#741d3d'].indexOf(color);
 return idx<0?0:idx;
}

function MedicalWearRack({progressRef,selectedIndex,selectedColor,hoveredIndex,onHover,onSelect}:{progressRef:MutableRefObject<number>;selectedIndex:number|null;selectedColor:string;hoveredIndex:number|null;onHover:(index:number|null)=>void;onSelect:(index:number)=>void}){
 const rail=useMemo(()=>new THREE.MeshStandardMaterial({color:'#b8bbc6',metalness:.88,roughness:.2}),[]);
 const support=useMemo(()=>new THREE.MeshStandardMaterial({color:'#565a6c',metalness:.72,roughness:.3}),[]);
 const rackColors=['#172f62','#777b83','#075e4f','#741d3d'];
 return <group position={[1.15,0,0]}>
   <mesh position={[0,2.52,-4.25]} rotation={[0,0,Math.PI/2]} material={rail} castShadow>
    <cylinderGeometry args={[.035,.035,8.2,20]}/>
   </mesh>
   {[-4.05,4.05].map(x=><group key={x}>
     <mesh position={[x,-.55,-4.25]} material={support} castShadow><cylinderGeometry args={[.04,.055,6.1,16]}/></mesh>
     <mesh position={[x,-3.62,-4.25]} material={support}><cylinderGeometry args={[.29,.29,.07,24]}/></mesh>
   </group>)}
   {rackColors.map((color,i)=><HangerOutfit
     key={i} index={i} position={[-2.85+i*1.9,0,0]} progressRef={progressRef}
     selectedIndex={selectedIndex} selectedColor={selectedColor} hoveredIndex={hoveredIndex}
     onHover={onHover} onSelect={onSelect}
   />)}
 </group>;
}

const REAL_GARMENTS=[{name:'NAVY BLUE'},{name:'STONE GREY'},{name:'EMERALD GREEN'},{name:'BURGUNDY RED'}];


function DepthParticles(){
 const points=useRef<THREE.Points>(null);
 const geometry=useMemo(()=>{
  const arr=new Float32Array(1800*3);
  for(let i=0;i<1800;i++){
   arr[i*3]=(Math.random()-.5)*34;
   arr[i*3+1]=(Math.random()-.5)*18;
   arr[i*3+2]=2-Math.random()*44;
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.BufferAttribute(arr,3));
  return g;
 },[]);
 useFrame((state,dt)=>{
  if(points.current){points.current.rotation.y=THREE.MathUtils.damp(points.current.rotation.y,Math.sin(state.clock.elapsedTime*.1)*.035,1,dt);points.current.rotation.x=THREE.MathUtils.damp(points.current.rotation.x,.02,1,dt);}
 });
 return <points ref={points} geometry={geometry}><pointsMaterial color="#c7c7df" size={.018} transparent opacity={.48} sizeAttenuation depthWrite={false}/></points>;
}


function RoomInterior(){
 const textures=useTexture(GARMENT_ASSETS);
 textures.forEach(t=>{t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=12;});
 const wall=useMemo(()=>new THREE.MeshStandardMaterial({color:'#34313a',roughness:.88}),[]);
 const panel=useMemo(()=>new THREE.MeshStandardMaterial({color:'#51413a',roughness:.72}),[]);
 const wood=useMemo(()=>new THREE.MeshStandardMaterial({color:'#30241f',roughness:.56}),[]);
 const brass=useMemo(()=>new THREE.MeshStandardMaterial({color:'#b79b70',metalness:.72,roughness:.3}),[]);
 const warm=useMemo(()=>new THREE.MeshStandardMaterial({color:'#f0d7a8',emissive:'#e5b978',emissiveIntensity:1.1,roughness:.4}),[]);
 const sidePositions=[-8.1,-6.35,-4.6,4.6,6.35,8.1];
 return <group>
  {/* Enclosed premium retail room */}
  <mesh position={[0,1.45,-12.2]} material={wall} receiveShadow><boxGeometry args={[30,12.8,.34]}/></mesh>
  <mesh position={[-11.9,1.45,-2.5]} material={wall} receiveShadow><boxGeometry args={[.3,12.8,19.5]}/></mesh>
  <mesh position={[11.9,1.45,-2.5]} material={wall} receiveShadow><boxGeometry args={[.3,12.8,19.5]}/></mesh>
  <mesh position={[0,7.85,-2.5]} rotation={[Math.PI/2,0,0]} material={wood}><planeGeometry args={[24,20]}/></mesh>
  {/* Walnut wall panels and low display cabinetry */}
  {Array.from({length:19},(_,i)=><mesh key={`panel-${i}`} position={[-10.8+i*1.2,1.45,-11.99]} material={panel}><boxGeometry args={[.035,12.3,.035]}/></mesh>)}
  <mesh position={[0,-3.05,-11.45]} material={wood} castShadow><boxGeometry args={[23,.95,1.05]}/></mesh>
  <mesh position={[0,-2.54,-10.9]} material={brass}><boxGeometry args={[22.8,.025,.035]}/></mesh>
  {/* Shelves and warm integrated lighting */}
  {[-.55,1.75,4.05].map((y,i)=><group key={`shelf-${i}`}>
   <mesh position={[0,y,-11.58]} material={wood} castShadow><boxGeometry args={[22,.12,.62]}/></mesh>
   <mesh position={[0,y+.075,-11.25]} material={warm}><boxGeometry args={[21.8,.025,.035]}/></mesh>
  </group>)}
  {/* Side rails with additional colourways, like a real apparel showroom */}
  {[-1,1].map(side=><group key={`side-rail-${side}`} position={[side*8.95,0,-8.6]}>
   <mesh position={[0,2.75,0]} rotation={[0,0,Math.PI/2]} material={brass} castShadow><cylinderGeometry args={[.035,.035,5.25,16]}/></mesh>
   {sidePositions.slice(side===-1?0:3,side===-1?3:6).map((x,j)=>{
    const idx=(j+(side===1?1:0))%textures.length;
    return <group key={`side-garment-${side}-${j}`} position={[x-side*8.95,1.95,0]}>
     <mesh position={[0,1.08,0]} material={brass}><torusGeometry args={[.105,.018,8,24,Math.PI*1.65]}/></mesh>
     <mesh position={[0,.93,0]} material={brass}><cylinderGeometry args={[.018,.018,.22,8]}/></mesh>
     <mesh position={[0,.78,0]} rotation={[0,0,0]} material={brass}><boxGeometry args={[.9,.025,.025]}/></mesh>
     <mesh position={[0,-.05,-.015]}><planeGeometry args={[1.12,1.9,18,28]}/><meshPhysicalMaterial map={textures[idx]} transparent alphaTest={.02} roughness={.95} side={THREE.DoubleSide} depthWrite={false}/></mesh>
    </group>;
   })}
  </group>)}
  {/* Ceiling track lights and warm pools of light */}
  <mesh position={[0,7.3,-3.5]} material={brass}><boxGeometry args={[18,.06,.08]}/></mesh>
  {[-7,-3.5,0,3.5,7].map((x,i)=><group key={`spot-${i}`} position={[x,7.05,-3.5]}>
   <mesh material={brass}><cylinderGeometry args={[.13,.18,.24,16]}/></mesh>
   <mesh position={[0,-.14,0]} material={warm}><circleGeometry args={[.14,24]}/></mesh>
   <spotLight position={[0,-.2,.15]} angle={.48} penumbra={.72} intensity={38} distance={13} color="#ffdfb2"/>
  </group>)}
  {/* Wall sconces */}
  {[-10.8,10.8].map(x=><group key={`sconce-${x}`} position={[x,2.7,-11.65]}>
   <mesh material={brass}><boxGeometry args={[.16,.48,.12]}/></mesh>
   <pointLight position={[0,0,.3]} intensity={16} distance={7} color="#ffd7a0"/>
  </group>)}
 </group>;
}

function Tunnel({progressRef,mouseRef,selectedIndex,selectedColor,hoveredIndex,onHover,onSelect}:{progressRef:MutableRefObject<number>;mouseRef:MutableRefObject<{x:number;y:number}>;selectedIndex:number|null;selectedColor:string;hoveredIndex:number|null;onHover:(index:number|null)=>void;onSelect:(index:number)=>void}){
 const cameraTarget=useRef(new THREE.Vector3());
 const rig=useRef<THREE.Group>(null);
 useFrame((state,dt)=>{
  const p=progressRef.current;
  // Scroll the camera laterally along the wardrobe rail: one full outfit becomes the hero at each stage.
  const z=9.5;
  state.camera.position.x=THREE.MathUtils.damp(state.camera.position.x,mouseRef.current.x*.08,2,dt);
  state.camera.position.y=THREE.MathUtils.damp(state.camera.position.y,.02+mouseRef.current.y*.08,2,dt);
  state.camera.position.z=THREE.MathUtils.damp(state.camera.position.z,z,2,dt);
  cameraTarget.current.set(0,-.35,-2.7);
  state.camera.lookAt(cameraTarget.current);
  if(rig.current){rig.current.rotation.z=THREE.MathUtils.damp(rig.current.rotation.z,mouseRef.current.x*.025,2,dt);}
 });
 return <group ref={rig}>
   <color attach="background" args={['#29242a']}/>
   <fog attach="fog" args={['#29242a',22,48]}/>
   <ambientLight intensity={1.05} color="#f3e5d2"/>
   <directionalLight position={[4,8,6]} intensity={2.0} color="#fff0d9" castShadow shadow-mapSize={[2048,2048]}/>
   <pointLight position={[-7,3,-8]} color="#f2c78f" intensity={42} distance={18}/>
   <pointLight position={[7,2,-8]} color="#f2c78f" intensity={42} distance={18}/>
   <spotLight position={[0,8,-1]} angle={.62} penumbra={.8} intensity={3.5} color="#fff0d8"/>
   <Environment preset="apartment"/>
   <RoomInterior/>
   <MedicalWearRack progressRef={progressRef} selectedIndex={selectedIndex} selectedColor={selectedColor} hoveredIndex={hoveredIndex} onHover={onHover} onSelect={onSelect}/>
   <mesh position={[0,-4.02,-5]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[80,80]}/><meshStandardMaterial color="#292321" roughness={.32} metalness={.12}/></mesh>
   <ContactShadows position={[0,-3.96,-3]} opacity={.28} scale={28} blur={3} far={12}/>
 </group>;
}

export default function ImmersiveShowroom(){
 const track=useRef<HTMLDivElement>(null);
 const progress=useRef(0);
 const mouse=useRef({x:0,y:0});
 const [scene,setScene]=useState(0);
 const [rackIntro,setRackIntro]=useState(true);
 const [selectedIndex,setSelectedIndex]=useState<number|null>(null);
 const [hoveredIndex,setHoveredIndex]=useState<number|null>(null);
 const [selectedColor,setSelectedColor]=useState('#172f62');
 const [selectedSize,setSelectedSize]=useState('M');
 const [bagCount,setBagCount]=useState(0);
 const [added,setAdded]=useState(false);
 const productColors=[{name:'Navy',value:'#172f62'},{name:'Stone',value:'#777b83'},{name:'Emerald',value:'#075e4f'},{name:'Burgundy',value:'#741d3d'}];
 const productNames=['YEVA CORE — NAVY','YEVA CORE — STONE','YEVA CORE — EMERALD','YEVA CORE — BURGUNDY'];
 const closeProduct=()=>{setSelectedIndex(null);setAdded(false);};
 useEffect(()=>{
  if(selectedIndex===null)return;
  const onKeyDown=(event:KeyboardEvent)=>{if(event.key==='Escape')closeProduct();};
  window.addEventListener('keydown',onKeyDown);
  return()=>window.removeEventListener('keydown',onKeyDown);
 },[selectedIndex]);
 const selectProduct=(i:number)=>{setSelectedIndex(i);setSelectedColor(productColors[i].value);setSelectedSize('M');setAdded(false);};
 const stepProduct=(dir:number)=>selectProduct((selectedIndex===null?0:(selectedIndex+dir+4)%4));
 const progressBar=useRef<HTMLDivElement|null>(null);
 useEffect(()=>{
  const update=()=>{
   if(!track.current)return;
   const rect=track.current.getBoundingClientRect();
   const total=track.current.offsetHeight-window.innerHeight;
   const p=total>0?Math.min(1,Math.max(0,-rect.top/total)):0;
   progress.current=p;
   const isIntro=p<.12;setRackIntro(old=>old===isIntro?old:isIntro);
   const n=Math.min(3,Math.max(0,Math.floor(Math.max(0,p-.12)/.22)));
   setScene(old=>old===n?old:n);
  };
  const pointer=(e:MouseEvent)=>{mouse.current.x=(e.clientX/window.innerWidth-.5)*2;mouse.current.y=(.5-e.clientY/window.innerHeight)*2};
  update();window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);window.addEventListener('mousemove',pointer,{passive:true});
  return()=>{window.removeEventListener('scroll',update);window.removeEventListener('resize',update);window.removeEventListener('mousemove',pointer)};
 },[]);
 const jump=(i:number)=>{if(!track.current)return;const y=track.current.getBoundingClientRect().top+window.scrollY;const targetProgress=.12+(i+.5)*.22;window.scrollTo({top:y+(track.current.offsetHeight-window.innerHeight)*targetProgress,behavior:'smooth'})};
 const active=stages[scene];
 return <section ref={track} id="top" className="yeva-world">
  <div className="yeva-world-sticky">
   <Canvas shadows dpr={[1,1.5]} camera={{position:[0,0,9.5],fov:42}} gl={{antialias:true,powerPreference:'high-performance'}}><Suspense fallback={null}><AdaptiveDpr pixelated/><Tunnel progressRef={progress} mouseRef={mouse} selectedIndex={selectedIndex} selectedColor={selectedColor} hoveredIndex={hoveredIndex} onHover={setHoveredIndex} onSelect={selectProduct}/></Suspense></Canvas>
   <div className="world-vignette"/>
   <div className="world-grain"/>
   <div className="world-topline"><span>YEVA® / MEDICAL APPAREL</span><span>DESIGNED FOR THE PEOPLE WHO CARE</span><span>EST. 2026</span></div>
   <div className={`world-heading ${selectedIndex!==null ? "is-product-open" : ""}`} key={scene}>
    <div className="world-kicker"><i/>{active.kicker}</div>
    <h1>{active.title.split('\n').map((line,i)=><span key={line}>{line}{i===0&&<br/>}</span>)}</h1>
    <p>{active.copy}</p>
    <a href={scene===3?'#shop':scene===1?'#fabric':scene===2?'#carekits':'#story'}>{active.action}<b>↗</b></a>
   </div>
   <div className={`world-garment-label ${selectedIndex!==null ? "is-hidden" : ""}`}><span>SELECTED FROM THE RACK / YEVA MEDICAL</span><b>{rackIntro?'FOUR COLOURWAYS / ON THE RACK':REAL_GARMENTS[scene].name}</b><i>{rackIntro?'ALL 04 / HANGING':`0${scene+1} / 04`}</i></div>
   <div className="world-vertical"><span>01—04</span><i/>A NEW DIMENSION OF CARE</div>
   <div className="world-bottom"><span>SCROLL TO EXPLORE THE COLLECTION</span><div className="world-progress"><i ref={progressBar}/></div><span>SCENE 0{scene+1} / 04</span></div>
   <div className="world-nav">{stages.map((s,i)=><button key={s.kicker} className={scene===i?'active':''} onClick={()=>jump(i)} aria-label={`Go to ${s.kicker}`}><span>0{i+1}</span></button>)}</div>
   {selectedIndex!==null&&<div className="yeva-product-focus" role="dialog" aria-modal="true" aria-label="YEVA product details">
    <div className="yeva-focus-arrows">
     <button onClick={()=>stepProduct(-1)} aria-label="Previous product">‹</button>
     <button onClick={()=>stepProduct(1)} aria-label="Next product">›</button>
    </div>
    <div className="yeva-focus-preview">
     <img src={GARMENT_ASSETS[productColorIndex(selectedColor)]} alt="YEVA medical scrub top" />
     <span>01 / 04 — YEVA MEDICAL</span>
    </div>
    <div className="yeva-focus-copy">
     <button className="yeva-focus-close" onClick={closeProduct} aria-label="Close product details" title="Close">×</button>
     <span className="yeva-focus-kicker">YEVA MEDICAL / PREMIUM WORKWEAR</span>
     <h2>{productNames[selectedIndex]}</h2>
     <p>Engineered for long shifts. Designed for everyday comfort.</p>
     <strong className="yeva-focus-price">₹1,899 <del>₹2,299</del> <em>17% OFF</em></strong>
     <div className="yeva-focus-stock">● IN STOCK · READY TO SHIP</div>
     <div className="yeva-focus-label">COLOUR — {productColors.find(c=>c.value===selectedColor)?.name.toUpperCase()}</div>
     <div className="yeva-focus-colours">{productColors.map(c=><button key={c.value} className={selectedColor===c.value?'active':''} style={{backgroundColor:c.value}} onClick={()=>{setSelectedColor(c.value);setAdded(false);}} aria-label={`Choose ${c.name}`}/>)}</div>
     <div className="yeva-focus-label">SELECT SIZE</div>
     <div className="yeva-focus-sizes">{['XS','S','M','L','XL','2XL'].map(s=><button key={s} className={selectedSize===s?'active':''} onClick={()=>{setSelectedSize(s);setAdded(false);}}>{s}</button>)}</div>
     <button className="yeva-focus-add" onClick={()=>{setBagCount(v=>v+1);setAdded(true);}}>{added?'ADDED TO BAG ✓':'ADD TO BAG'}</button>
     <small>{bagCount} item{bagCount===1?'':'s'} in your bag · Free delivery on eligible orders</small>
    </div>
   </div>}
  </div>
 </section>;
}
