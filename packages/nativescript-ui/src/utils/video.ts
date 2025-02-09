import { CoreTypes, EventData, View } from '@nativescript/core';
import { Video } from '@nstudio/nativescript-exoplayer';

let videoOverlayTimeout: ReturnType<typeof setTimeout>;
let videoOverlay: View;
export const videoUtils = {
  playbackReady(args: EventData) {
    const video = args.object as Video;
    video.play();
    if (typeof videoOverlayTimeout === 'number') {
      clearTimeout(videoOverlayTimeout);
    }
    videoOverlayTimeout = setTimeout(() => {
      if (videoOverlay) {
        videoOverlay
          .animate({
            opacity: 0,
            duration: 600,
          })
          .then(() => {
            videoOverlay.visibility = CoreTypes.Visibility.collapse;
          });
      }
    }, 800);
  },
  loadedVideoOverlay(args: EventData) {
    videoOverlay = args.object as View;
  },
};
