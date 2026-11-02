'use client';
import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
import styles from './updates.module.css';

declare global {
  interface Window {
    twttr?: { widgets: { createTweet: (id: string, target: HTMLElement, options: { theme: string; dnt: boolean; conversation: string; align: string }) => Promise<HTMLElement | undefined> } };
  }
}

export default function PostEmbed({ postId, title, sourceUrl }: { postId: string; title: string; sourceUrl: string }) {
  const target = useRef<HTMLDivElement>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [rendered, setRendered] = useState(false);
  const valid = /^\d+$/.test(postId);
  useEffect(()=>{
    if (!sdkReady || !valid || !target.current) return;
    const host = target.current;
    // Each effect owns its mount. A late SDK completion cannot affect a new mount.
    const mount = document.createElement('div');
    host.append(mount);
    let active = true;
    Promise.resolve().then(()=>window.twttr?.widgets.createTweet(postId, mount, {theme:'dark',dnt:true,conversation:'none',align:'center'}))
      .then(element=>{if(active)setRendered(Boolean(element));})
      .catch(()=>{if(active)setRendered(false);});
    return ()=>{active=false;mount.remove();};
  },[sdkReady,postId,valid]);
  if(!valid)return null;
  return <div className={styles.player}>
    <Script id="x-post-widgets" src="https://platform.twitter.com/widgets.js" strategy="afterInteractive" onReady={()=>setSdkReady(true)} />
    <div ref={target} aria-label={`${title} — X post and video`} />
    {!rendered&&<a className={styles.fallback} href={sourceUrl} target="_blank" rel="noopener noreferrer">View original post on X ↗</a>}
  </div>;
}
