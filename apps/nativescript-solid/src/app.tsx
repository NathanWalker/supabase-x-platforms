import { CollectionView } from '@nstudio/ui-collectionview';
import { ItemLoadingEventData } from '@nativescript-dom/core-types';
import { AnimatedLines, Checkbox } from '@supabase-x-platforms/nativescript-ui';
import { makeListView, registerElement } from 'dominative';
import { Route, StackRouter } from "./router";
import { Home } from "./routes/home";
import { Video } from '@nstudio/nativescript-exoplayer';
import { ItemDisplay } from '@supabase-x-platforms/nativescript-data';

registerElement('animatedLines', AnimatedLines);
registerElement('collectionview', makeListView(CollectionView, { force: true }));
registerElement('checkbox', Checkbox);
registerElement('video', Video);

declare global {
  interface HTMLCollectionViewElement extends HTMLListViewElement {}

  var HTMLCollectionViewElement: {
    prototype: HTMLCollectionViewElement;
    new (): HTMLCollectionViewElement;
  };

  interface HTMLCollectionViewElement extends HTMLListViewElement {}

  var HTMLCollectionViewElement: {
    prototype: HTMLCollectionViewElement;
    new (): HTMLCollectionViewElement;
  };
}

declare module '@nativescript-dom/solidjs-types/jsx-runtime' {
  export namespace JSX {
    interface IntrinsicElements {
      /**
       * Register custom library view
       */
      collectionview: Partial<HTMLListViewElementAttributes<HTMLCollectionViewElement>>;
      checkbox: Partial<HTMLViewBaseElementAttributes & {id: number; data: ItemDisplay; checkboxChange: (args: {data: ItemDisplay}) => void; width: string; height: string; }>;

      /**
       * Register dominative elements
       */
      itemtemplate: Partial<
        HTMLViewBaseElementAttributes & {
          'on:createView': (event: ItemLoadingEventData) => void;
          'on:itemLoading': (event: ItemLoadingEventData) => void;
          key: string;
        }
      >;
      arrayprop: Partial<
        HTMLViewBaseElementAttributes & {
          key: string;
        }
      >;
      keyprop: Partial<
        HTMLViewBaseElementAttributes & {
          key: string;
        }
      >;
    }
  }
}

const App = () => {
  return (
    <StackRouter initialRouteName="Home">
      <Route name="Home" component={Home} />
    </StackRouter>
  );
};

export { App };
