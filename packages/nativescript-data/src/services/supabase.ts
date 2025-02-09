import { SupabaseRealtimeClient, Session, SupabaseClient, createClient } from '@nativescript/supabase';
import { Haptics } from '@nativescript/haptics';
import { demoAccount, Item, ItemDisplay } from '../models/supabase.model';
import { sortDoneUpdated } from '@supabase-x-platforms/nativescript-ui';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

export class SupabaseDataService {
  client: SupabaseClient;
  currentSession: Session;
  channel: SupabaseRealtimeClient;
  items: ItemDisplay[];
  loading = true;

  constructor(itemsUpdated: (items: ItemDisplay[]) => void) {
    this.itemsUpdated = itemsUpdated;
    this.init();
  }

  init() {
    if (typeof supabaseUrl === 'undefined') {
      return;
    }

    this.client = createClient(supabaseUrl, supabaseKey);

    this.client.auth.onAuthStateChange((event, session) => {
      console.log('onAuthStateChange', event, !!session);
      this.setSession(session);
    });

    this.signIn();
  }

  async signIn() {
    // Demo purposes, auto signin to demo account
    const result = await this.client.auth.signInWithPassword({
      email: demoAccount.email,
      password: demoAccount.password,
    });
    if (result?.user) {
      this.fetchAllItems();
    }
  }

  async fetchAllItems() {
    let { data, error } = await this.client.from('items').select('*');

    if (data?.length) {
      this.items = data.map(this.addDisplayItemProps.bind(this));
      this._prepareUpdatedItems();
      this.loading = false;
      // console.log('item count:', data.length);
    }
    return data;
  }

  async insertItem(value: string) {
    Haptics.selection();
    if (this.client) {
      const item: Item = {
        name: value,
        done: false,
        email: 'oss@nativescript.org',
      };
      const result = await this.client
        .from('items') // Specify the table
        .insert([item]);
      // console.log('result:', result);
      // console.log('error:', error);
      // console.log('data:', data);
    }
  }

  async updateItem(updates: Partial<ItemDisplay>, index: number) {
    const items = this.items;
    items[index] = {
      ...items[index],
      ...updates,
    };
    console.log('update:', items[index]);

    const result = await this.client.from('items').update(updates).eq('id', items[index].id);

    this._prepareUpdatedItems();
  }

  async deleteItem(item: ItemDisplay) {
    console.log('delete id:', item.id);
    const { error } = await this.client.from('items').delete().eq('id', item.id);

    this._removeItemById(item.id);

    console.log('error:', error);
  }

  addDisplayItemProps(item: Item): ItemDisplay {
    return {
      ...item,
      checkboxOutlineType: 'circle',
      color: '#77588C',
      size: 25,
    };
  }

  setSession(session: Session | null) {
    this.currentSession = session;
    if (session) {
      this.enableRealtimeChannel();
    }
  }

  enableRealtimeChannel() {
    if (!this.channel) {
      this.channel = this.client
        .channel('table_db_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'items' }, payload => {
          console.log('Realtime update received:', payload);
          switch (payload.eventType) {
            case 'INSERT':
              if (payload.new) {
                this.items = [...this.items, this.addDisplayItemProps(payload.new)];
                this._prepareUpdatedItems();
                Haptics.impact();
              }
              break;
            case 'UPDATE':
              console.log('payload:', payload);
              if (payload.new) {
                const index = this.items.findIndex(i => i.id === payload.new.id);
                if (index > -1) {
                  this.items[index] = this.addDisplayItemProps(payload.new);
                }
                this._prepareUpdatedItems();
                Haptics.selection();
              }
              break;
            case 'DELETE':
              if (payload?.old) {
                this._removeItemById(payload.old.id);
                Haptics.selection();
              }
              break;
          }
        })
        .subscribe(status => {
          console.log(`Subscription status: ${status}`);
        });
    }
  }

  itemsUpdated(item: ItemDisplay[]) {
    // meant to be implemented with any flavor for binding purposes
  }

  private _prepareUpdatedItems() {
    this.itemsUpdated([...sortDoneUpdated(this.items)]);
  }

  private _removeItemById(id: number) {
    const index = this.items.findIndex(i => i.id === id);
    if (index > -1) {
      this.items.splice(index, 1);
    }
    this._prepareUpdatedItems();
  }
}
