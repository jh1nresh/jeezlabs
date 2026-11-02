import { ImageResponse } from 'next/og';
import { PRODUCTS } from './products';
export const alt = 'JeezLabs product lab and project index';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function Image() {
  return new ImageResponse(<div style={{width:'100%',height:'100%',background:'#0b0d0f',color:'#e7e9e6',padding:70,display:'flex',flexDirection:'column',justifyContent:'space-between',fontFamily:'sans-serif'}}>
    <div style={{display:'flex',alignItems:'center',gap:20,fontSize:25}}><span style={{width:14,height:14,background:'#e2f75a'}} />JEEZLABS</div>
    <div style={{display:'flex',flexDirection:'column',gap:16}}><div style={{fontSize:82,fontWeight:700,letterSpacing:-3}}>Product lab.</div><div style={{fontSize:36,color:'#969d9f'}}>Internet products, iOS apps and agent experiments.</div></div>
    <div style={{display:'flex',justifyContent:'space-between',borderTop:'1px solid #2c3135',paddingTop:28,fontSize:23}}><span>{PRODUCTS.length} PROJECTS / INDEX + EXPLORE</span><span style={{color:'#e2f75a'}}>jeezlabs.io</span></div>
  </div>, size);
}
