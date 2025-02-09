import { Application, Color, Property, SystemAppearanceChangedEventData, Utils } from '@nativescript/core';
import { CheckboxCommon } from './common';
import { Item } from '@supabase-x-platforms/nativescript-data';

export const dataProperty = new Property<CheckboxCommon, Item>({
  name: 'data',
});

export class Checkbox extends CheckboxCommon {
  nativeViewProtected: it.emperor.animatedcheckbox.AnimatedCheckBox;
  systemAppearanceHandler;

  createNativeView() {
    return new it.emperor.animatedcheckbox.AnimatedCheckBox(Utils.android.getApplicationContext());
  }

  initNativeView(): void {
    this.scaleX = this.scaleY = 0.5;
    this.adjustForTheme();
    this.nativeViewProtected.setCircleColor(new Color('#77588C').android);
    this.nativeViewProtected.setHookColor(new Color('#ffffff').android);
    this.nativeViewProtected.setHookStrokeWidth(5);
    this.nativeViewProtected.setBorderCheckedStrokeWidth(5);

    this.systemAppearanceHandler = this.systemAppearanceChanged.bind(this);
    Application.on('systemAppearanceChanged', this.systemAppearanceHandler);
  }

  disposeNativeView(): void {
    Application.off('systemAppearanceChanged', this.systemAppearanceHandler);
  }

  systemAppearanceChanged(event: SystemAppearanceChangedEventData) {
    this.adjustForTheme();
  }

  adjustForTheme() {
    if (this.nativeViewProtected) {
      if (Application.systemAppearance() === 'light') {
        this.nativeViewProtected.setBorderCheckedColor(new Color('#77588C').android);
        this.nativeViewProtected.setBorderNotCheckedColor(new Color('#77588C').android);
      } else {
        this.nativeViewProtected.setBorderCheckedColor(new Color('#77588C').android);
        this.nativeViewProtected.setBorderNotCheckedColor(new Color('#ffffff').android);
      }
    }
  }

  [dataProperty.setNative](value: Item) {
    this.nativeViewProtected?.setChecked(value.done, true);
  }
}

dataProperty.register(Checkbox);
