'use client';

import React, { useRef, useEffect, useState } from 'react';
import { AiFillTikTok } from 'react-icons/ai';
import { useAppContext } from '@/contexts/AppContext';

const tiktokVideos = [
  {
    videoId: '7421320535474195717',
    thumbnailUrl: '/tiktok-thumbnail-3.jpg',
    title: 'Video de TikTok de IPA Las Encinas',
  },
  {
    videoId: '7416116376856808710',
    thumbnailUrl: '/tiktok-thumbnail-1.jpg',
    title: 'Video de TikTok de IPA Las Encinas',
  },
  {
    videoId: '7420943763733826822',
    thumbnailUrl: '/tiktok-thumbnail-2.jpg',
    title: 'Video de TikTok de IPA Las Encinas',
  },
];

export function TikTokFeed() {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const { theme } = useAppContext();
  
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
    <section id="tiktok" className={`py-20 ${theme === 'dark' ? 'bg-gray-900' : 'bg-background'}`}>
      <div className="container mx-auto px-4">
        <div className={`${
          theme === 'dark'
            ? 'bg-gradient-to-r from-blue-900 to-purple-900'
            : 'bg-gradient-to-r from-primary to-secondary'
        } text-white p-6 rounded-lg mb-12 text-center shadow-lg transform transition-all duration-300 hover:scale-105 flex items-center justify-between`}>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
            <span>Nuestros </span>
            <span className={theme === 'dark' ? 'text-blue-300' : 'text-accent'}>
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
          <span className="text-3xl sm:text-4xl ml-4">
            <AiFillTikTok className={`${theme === 'dark' ? 'text-blue-300' : 'text-accent'} transform transition-transform duration-300 hover:scale-110`} />
          </span>
        </div>
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 lg:gap-12">
          {tiktokVideos.map((video) => (
            <div
              key={video.videoId}
              className={`rounded-[16px] h-[300px] sm:h-[375px] lg:h-[475px] w-full sm:w-80 lg:w-96 snap-center ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-black'
              } relative shrink-0 cursor-pointer bg-center bg-[length:100%] hover:bg-[length:105%] transition-[background-size]`}
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
                  <div className={`w-16 h-16 ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-white'
                  } bg-opacity-75 rounded-full flex items-center justify-center`}>
                    <svg className={`w-8 h-8 ${
                      theme === 'dark' ? 'text-white' : 'text-black'
                    }`} fill="currentColor" viewBox="0 0 20 20">
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

