import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { PageRouterOutlet, registerElement } from '@nativescript/angular';
import { Video } from '@nstudio/nativescript-exoplayer';
import { AnimatedLines, Checkbox } from '@supabase-x-platforms/nativescript-ui';

registerElement('AnimatedLines', () => AnimatedLines);
registerElement('Checkbox', () => Checkbox);
registerElement('Video', () => Video);

@Component({
  selector: 'ns-app',
  templateUrl: './app.component.html',
  imports: [PageRouterOutlet],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppComponent {}
