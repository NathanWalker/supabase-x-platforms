import { Utils } from '@nativescript/core';
import { registerSwiftUI, SwiftUI, UIDataDriver } from '@nativescript/swift-ui';
import { AnimatedLinesCommon } from './common';
declare var AnimatedLinesProvider;

export class AnimatedLines extends SwiftUI {
  provider: any; //CheckboxProvider;
  data: any;

  constructor() {
    super();
    // make each usage unique so could use many throughout app if desired
    const swiftId = `lines-${crypto.randomUUID()}`;
    if (Utils.SDK_VERSION >= 16 || __VISIONOS__) {
      registerSwiftUI(swiftId, view => {
        this.provider = AnimatedLinesProvider.alloc().init();
        return new UIDataDriver(this.provider, view);
      });
    }
    this.swiftId = swiftId;
  }
}
