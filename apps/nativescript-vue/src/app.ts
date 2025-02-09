import { createApp, registerElement } from 'nativescript-vue';
import Home from './components/Home.vue';
import CollectionView from '@nstudio/ui-collectionview/vue3';
import { AnimatedLines, Checkbox } from '@supabase-x-platforms/nativescript-ui';
import { Video } from '@nstudio/nativescript-exoplayer';

registerElement('AnimatedLines', () => AnimatedLines);
registerElement('Checkbox', () => Checkbox);
registerElement('Video', () => Video);

const app = createApp(Home);
app.use(CollectionView);
app.start();
