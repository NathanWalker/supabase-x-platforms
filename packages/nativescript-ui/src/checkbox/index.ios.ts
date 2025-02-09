import { Utils } from '@nativescript/core';
import { registerSwiftUI, SwiftUI, UIDataDriver } from '@nativescript/swift-ui';
declare var CheckboxProvider;

export class Checkbox extends SwiftUI {
  provider: any; //CheckboxProvider;
  data: any;

  constructor() {
    super();
    // make each usage unique so could use many throughout app if desired
    const swiftId = `checkbox-${crypto.randomUUID()}`;
    if (Utils.SDK_VERSION >= 16 || __VISIONOS__) {
      registerSwiftUI(swiftId, view => {
        this.provider = CheckboxProvider.alloc().init();
        return new UIDataDriver(this.provider, view);
      });
    }
    this.swiftId = swiftId;
  }

  initNativeView() {
    super.initNativeView();
    // @ts-ignore
    this.provider.onEvent = data => {
      // console.log("onevent:", data);

      this.notify({
        eventName: 'checkboxChange',
        data,
      });
    };
  }
}
