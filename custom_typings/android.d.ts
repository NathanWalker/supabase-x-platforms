declare module it {
  export module emperor {
    export module animatedcheckbox {
      export class AnimatedCheckBox {
        public static class: java.lang.Class<it.emperor.animatedcheckbox.AnimatedCheckBox>;
        public setChecked(param0: boolean): void;
        public isChecked(): boolean;
        public setCircleColor(value: number): void;
        public setPadding(value: number): void;
        public getDuration(): number;
        public setBorderNotCheckedColor(value: number): void;
        public setBorderCheckedStrokeWidth(value: number): void;
        public setChecked(checked: boolean, animate: boolean): void;
        public constructor(attrs: globalAndroid.content.Context, param1: globalAndroid.util.AttributeSet);
        public getBorderCheckedStrokeWidth(): number;
        public isAnimating(): boolean;
        public constructor(param0: globalAndroid.content.Context);
        public setHookStrokeWidth(value: number): void;
        public getPadding(): number;
        public setIgnoreAnimation(value: boolean): void;
        public getHookStrokeWidth(): number;
        public getCircleColor(): number;
        public setBorderCheckedColor(value: number): void;
        public setOnChangeListener(onChange: any): void;
        public getIgnoreAnimation(): boolean;
        public getBorderCheckedColor(): number;
        public onLayout(changed: boolean, left: number, top: number, right: number, bottom: number): void;
        public getHookColor(): number;
        public setDuration(value: number): void;
        public setHookColor(value: number): void;
        public getBorderNotCheckedColor(): number;
        public onDraw(canvas: globalAndroid.graphics.Canvas): void;
        public constructor(
          it: globalAndroid.content.Context,
          $i$a$1$let: globalAndroid.util.AttributeSet,
          this_: number
        );
      }
    }
  }
}

declare module it {
  export module emperor {
    export module animatedcheckbox {
      export class BuildConfig {
        public static class: java.lang.Class<it.emperor.animatedcheckbox.BuildConfig>;
        public static DEBUG: boolean = 0;
        public static APPLICATION_ID: string = 'it.emperor.animatedcheckbox';
        public static BUILD_TYPE: string = 'release';
        public static FLAVOR: string = '';
        public static VERSION_CODE: number = 2;
        public static VERSION_NAME: string = '1.0.1';
        public constructor();
      }
    }
  }
}

declare module it {
  export module emperor {
    export module animatedcheckbox {
      export class DataBinderMapperImpl {
        public static class: java.lang.Class<it.emperor.animatedcheckbox.DataBinderMapperImpl>;
        public getDataBinder(
          this_: androidx.databinding.DataBindingComponent,
          component: globalAndroid.view.View,
          view: number
        ): androidx.databinding.ViewDataBinding;
        public getLayoutId(tag: string): number;
        public collectDependencies(): java.util.List<androidx.databinding.DataBinderMapper>;
        public getDataBinder(
          this_: androidx.databinding.DataBindingComponent,
          component: androidNative.Array<globalAndroid.view.View>,
          views: number
        ): androidx.databinding.ViewDataBinding;
        public convertBrIdToString(localId: number): string;
        public constructor();
      }
      export module DataBinderMapperImpl {
        export class InnerBrLookup {
          public static class: java.lang.Class<it.emperor.animatedcheckbox.DataBinderMapperImpl.InnerBrLookup>;
        }
        export class InnerLayoutIdLookup {
          public static class: java.lang.Class<it.emperor.animatedcheckbox.DataBinderMapperImpl.InnerLayoutIdLookup>;
        }
      }
    }
  }
}

//Generics information:
