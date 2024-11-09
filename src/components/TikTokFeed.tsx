'use client';

import React, { useRef, useEffect, useState } from 'react';
import { AiFillTikTok } from 'react-icons/ai';

const tiktokVideos = [
  {
    videoId: '7421320535474195717',
    thumbnailUrl: 'https://p16-sign-va.tiktokcdn.com/obj/tos-maliva-p-0068/098fd82a736840e2a259fe36314e16ac_1727910851?lk3s=81f88b70&x-expires=1731340800&x-signature=VonwhOsSUFaeIx8zYELnUtCa3Xs%3D&shp=81f88b70&shcp=-',
    title: 'Video de TikTok de IPA Las Encinas',
  },
  {
    videoId: '7416116376856808710',
    thumbnailUrl: 'https://p16-sign-va.tiktokcdn.com/tos-maliva-p-0068/ocXMfroIqhIo1jpNAOBQjVxLWe77OtISCGkCgf~tplv-photomode-zoomcover:720:720.avif?lk3s=81f88b70&x-expires=1731340800&x-signature=I1nwS%2Bn3DsNp8dnCFmGN1SuE8jQ%3D&shp=81f88b70&shcp=-',
    title: 'Video de TikTok de IPA Las Encinas',
  },
  {
    videoId: '7420943763733826822',
    thumbnailUrl: 'https://p16-sign-va.tiktokcdn.com/obj/tos-maliva-p-0068/09529e8e2ab84df0abe19f2d23d67d7d_1727823134?lk3s=81f88b70&x-expires=1731340800&x-signature=G0z1xeENj5YXRFG5iN0P4Lekc54%3D&shp=81f88b70&shcp=-',
    title: 'Video de TikTok de IPA Las Encinas',
  },
];

export function TikTokFeed() {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  
  const handleVideoClick = (videoId: string) => {
    setActiveVideoId(videoId);
  };

  useEffect(() => {
    if (activeVideoId && iframeRef.current) {
      const messageHandler = (event: MessageEvent) => {
        if (
          event.origin === 'https://www.tiktok.com' &&
          event.data.type === 'onPlayerReady'
        ) {
          iframeRef.current?.contentWindow?.postMessage(
            { type: 'unMute', 'x-tiktok-player': true },
            '*'
          );
        }
      };

      window.addEventListener('message', messageHandler);
      return () => window.removeEventListener('message', messageHandler);
    }
  }, [activeVideoId]);

  return (
    <section id="tiktok" className="py-20 bg-background">
      <div className="container mx-auto">
        <div className="bg-gradient-to-r from-primary to-secondary text-white p-6 rounded-lg mb-12 text-center shadow-lg transform transition-all duration-300 hover:scale-105 flex items-center justify-between">
          <h2 className="text-3xl font-bold">
            <span>Nuestros </span>
            <span className="text-accent">
              {Array.from("TikToks").map((letter, index) => (
                <span
                  key={index}
                  className="inline-block animate-bounce"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {letter}
                </span>
              ))}
            </span>
          </h2>
          <span className="text-4xl ml-4">
            <AiFillTikTok className="text-accent transform transition-transform duration-300 hover:scale-110" />
          </span>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {tiktokVideos.map((video) => (
            <div
              key={video.videoId}
              className="rounded-[16px] h-[475px] w-80 snap-center bg-black relative shrink-0 cursor-pointer bg-center bg-[length:100%] hover:bg-[length:105%] transition-[background-size]"
              onClick={() => handleVideoClick(video.videoId)}
              role="button"
              tabIndex={0}
              style={{
                backgroundImage: activeVideoId !== video.videoId ? `url(${video.thumbnailUrl})` : 'unset',
              }}
              aria-label="Reproducir video"
            >
              {activeVideoId === video.videoId ? (
                <iframe
                  ref={iframeRef}
                  src={`https://www.tiktok.com/player/v1/${video.videoId}?autoplay=1`}
                  className="rounded-2xl w-full h-full"
                  allowFullScreen
                  allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; transparency'
                ></iframe>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white bg-opacity-75 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" fillRule="evenodd"></path>
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
