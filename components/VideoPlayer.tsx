/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef } from "react";
import axios from "axios";

declare global {
  interface Window {
    YT: any;
  }
}

const VideoPlayer = ({
  url,
  courseId,
  sid,
}: {
  url: string;
  courseId: string;
  sid: number;
}) => {
  const videoId = url.split("v=")[1];
  const playerRef = useRef<any>(null);
  const isPlayerReady = useRef(false);
  // Create a ref to store the current sid
  const currentSidRef = useRef(sid);

  // Update the ref whenever sid changes
  useEffect(() => {
    currentSidRef.current = sid;
  }, [sid]);

  useEffect(() => {
    if (!window.YT) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.body.appendChild(script);
      script.onload = () => initializePlayer();
    } else {
      initializePlayer();
    }

    return () => {
      // Cleanup on unmount
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []); // Run only on mount

  useEffect(() => {
    // Load new video when videoId changes and player is ready
    if (isPlayerReady.current && playerRef.current) {
      playerRef.current.loadVideoById(videoId);
    }
  }, [videoId]);

  const initializePlayer = () => {
    window.YT.ready(() => {
      playerRef.current = new window.YT.Player("player", {
        width: "100%",
        videoId,
        playerVars: {
          fs: 0,
          rel: 0,
        },
        events: {
          onReady: () => {
            isPlayerReady.current = true;
          },
          onStateChange: handlePlayerStateChange,
        },
      });
    });
  };

  const handlePlayerStateChange = async (event: any) => {
    if (event.data === window.YT.PlayerState.ENDED) {
      try {
        // Use the current value from the ref instead of the closed-over sid
        await axios.patch("/api/progress", {
          courseId,
          sid: currentSidRef.current,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="lg:col-span-2 h-[260px] sm:h-[400px] md:h-[600px]">
      <div className="h-full rounded-md overflow-hidden shadow-sm bg-gray-200">
        <div className="w-full h-full" id="player"></div>
      </div>
    </div>
  );
};

export default VideoPlayer;
