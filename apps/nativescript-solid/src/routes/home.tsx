import { createSignal, Show, onMount, createEffect } from 'solid-js';
import { DynamicList, Item } from '../components/collectionview';
import { ItemDisplay, SupabaseDataService } from '@supabase-x-platforms/nativescript-data';
import { appListenForDarkMode, collectionViewEvents, registerLayouts } from '@supabase-x-platforms/nativescript-ui';
import { CollectionView } from '@nstudio/ui-collectionview';
import { TextField, Utils } from '@nativescript/core';

export const Home = () => {
  const [videoSrc, setVideoSrc] = createSignal('~/assets/lines-white.mp4');
  const [items, setItems] = createSignal<ItemDisplay[]>([]);
  let added = false;
  let list: CollectionView;
  let supabaseService: SupabaseDataService;
  const lineData = {
    colors: ['#38c883', '#dd00ff', '#2c4f7c', '#69a2ec'],
  };
  let input: TextField;
  function loadedInput(args) {
    input = args.object;
  }
  function save() {
    if (input?.text) {
      added = true;
      supabaseService.insertItem(input.text);
      input.text = '';
    }
  }
  function toggleDone(item: ItemDisplay, index: number) {
    console.log('toggleDone', item);
    item.done = !item.done;
    supabaseService.updateItem(item, index);
  }
  function loadedList(args) {
    list = args.object;
  }
  function itemsUpdated(items: ItemDisplay[]) {
    console.log('itemsUpdated', items.length);
    Utils.executeOnMainThread(() => {
      setItems(items);
    });
  }
  onMount(() => {
    registerLayouts();
    collectionViewEvents.subscribe(event => {
      // console.log(event);
      const item = supabaseService.items[event.data?.index];
      if (item) {
        supabaseService.deleteItem(item);
      }
    });
    appListenForDarkMode(mode => {
      setVideoSrc(`~/assets/lines-${mode === 'dark' ? 'black' : 'white'}.mp4`);
    });
  });
  createEffect(() => {
    supabaseService = new SupabaseDataService(itemsUpdated);
  });
  return (
    <>
      <actionbar title="NativeScript Todo with Supabase" />

      <gridlayout rows="auto,auto,*">
        {/* visual effects */}
        <Show when={__APPLE__}>
          <animatedLines rowSpan="3" data={lineData} class="ml-[64] mr-[64] h-[70] align-top"></animatedLines>
        </Show>
        <Show when={__ANDROID__}>
          <video
            rowSpan="3"
            src={videoSrc()}
            autoplay="true"
            loop="true"
            controls="false"
            class="ml-[64] mr-[64] h-[100] align-top"
            translateY="-12"
          ></video>
        </Show>
        {/* end visual effects  */}
        <gridlayout rows="auto" columns="auto,*,auto" class="mx-4 mt-1 h-12">
          <image src="~/assets/supabase.png" class="h-12 w-12"></image>
          <image col="2" src="~/assets/solid.png" class="h-12 w-12"></image>
        </gridlayout>
        <textfield
          row="1"
          class="m-4 rounded-md border-4 border-[#38c883] bg-[#1f7a4e] p-4 text-lg text-white"
          hint="Type a ToDo..."
          on:loaded={loadedInput}
          on:returnPress={save}
        ></textfield>
        <gridlayout row="2">
          <DynamicList
            items={items()}
            renderItem={({ item, index, type }) => <Item item={item} index={index} type={type} />}
            onItemType={() => {
              return 'item';
            }}
            itemTypes={['item']}
            iosOverflowSafeArea="true"
            layoutStyle="swipeWithDelete"
            itemTap={toggleDone}
            loaded={loadedList}
          />
        </gridlayout>
      </gridlayout>
    </>
  );
};
