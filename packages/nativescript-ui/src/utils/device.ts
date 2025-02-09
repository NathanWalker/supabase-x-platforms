import { Application } from '@nativescript/core';

export function appListenForDarkMode(callback: (mode: 'dark' | 'light') => void) {
  // listen for changes
  Application.on('systemAppearanceChanged', event => {
    if (callback) {
      callback(Application.systemAppearance());
    }
  });
  // provide value right away
  if (callback) {
    callback(Application.systemAppearance());
  }
}
