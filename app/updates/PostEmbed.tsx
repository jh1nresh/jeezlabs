'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './updates.module.css';

export default function PostEmbed({ postId, title }: { postId: string; title: string }) {
  const [open, setOpen] = useState(false);
  const loadButton = useRef<HTMLButtonElement>(null), closeButton = useRef<HTMLButtonElement>(null);
  const visited = useRef(false);
  useEffect(()=>{
    if (open) closeButton.current?.focus();
    else if (visited.current) loadButton.current?.focus();
  },[open]);
  // IDs come from repository-owned metadata, not from request parameters or markup.
  if (!/^\d+$/.test(postId)) return null;
  return <div className={styles.player}>
    {open ? <>
      <p className={styles.embedNote} role="status">X provides this player. If it stays blank or cannot play, use the original post link above.</p>
      <iframe title={`${title} — original X post and video`} src={`https://platform.twitter.com/embed/Tweet.html?id=${postId}&theme=dark&dnt=true`}
        width="550" height="640" referrerPolicy="no-referrer" allow="fullscreen" allowFullScreen />
      <button type="button" className={styles.close} ref={closeButton} onClick={()=>setOpen(false)}>Close X embed</button>
    </> : <div className={styles.cover}>
      <span className={styles.mediaLabel}>INTRODUCTION / ORIGINAL POST ON X</span>
      <span className={styles.coverTitle}>{title}</span>
      <button type="button" className={styles.load} ref={loadButton} onClick={()=>{visited.current=true;setOpen(true);}}><span aria-hidden="true">▷</span> Load X post &amp; video</button>
      <p>Loads content from X. X may process request information and require sign-in to play the video.</p>
    </div>}
  </div>;
}
