import { Injectable, signal } from '@angular/core';
import { ItemDisplay, SupabaseDataService } from '@supabase-x-platforms/nativescript-data';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  supabaseDataService: SupabaseDataService;
  items = signal<ItemDisplay[]>([]);

  constructor() {
    this.supabaseDataService = new SupabaseDataService(this.itemsUpdated.bind(this));
  }

  itemsUpdated(items: ItemDisplay[]) {
    this.items.set(items || []);
  }
}
