import { Component, NO_ERRORS_SCHEMA, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NativeScriptCommonModule, NativeScriptRouterModule } from '@nativescript/angular';
import { Page, TextField } from '@nativescript/core';
import { CollectionViewModule } from '@nstudio/ui-collectionview/angular';
import {
  appListenForDarkMode,
  collectionViewEvents,
  registerLayouts,
  videoUtils,
} from '@supabase-x-platforms/nativescript-ui';
import { SupabaseService } from './supabase.service';

@Component({
  selector: 'ns-todo',
  templateUrl: './todo.component.html',
  imports: [NativeScriptCommonModule, NativeScriptRouterModule, CollectionViewModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class ToDoComponent {
  page = inject(Page);
  supabaseService = inject(SupabaseService);
  input: TextField;
  lineData = {};
  isDarkMode = signal(false);
  videoUtils = videoUtils;
  isApple = __APPLE__;

  constructor() {
    registerLayouts();
    collectionViewEvents.pipe(takeUntilDestroyed()).subscribe(event => {
      console.log(event);
      const item = this.supabaseService.items()[event.data?.index];
      if (item) {
        this.dataService.deleteItem(item);
      }
    });
    if (!__VISIONOS__) {
      appListenForDarkMode(mode => {
        this.isDarkMode.set(mode === 'dark');
      });
    }
  }

  get dataService() {
    return this.supabaseService.supabaseDataService;
  }

  loadedInput(args) {
    this.input = args.object;
  }

  async save() {
    if (this.input.text) {
      // TODO: make input box shake after submitting (or spring zoom in/out like water droplet with a haptic and even a sound if desired)
      console.log(this.input.text);
      this.dataService.insertItem(this.input.text);
      this.input.text = '';
    }
  }

  checkboxToggle(args) {
    console.log('toggle:', args.data);
  }

  toggleDone(args) {
    console.log(args.index);
    this.dataService.updateItem(
      {
        done: !this.supabaseService.items()[args.index].done,
        updated_at: new Date().toISOString(),
      },
      args.index
    );
  }
}
