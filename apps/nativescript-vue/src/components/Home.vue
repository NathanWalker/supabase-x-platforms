<script lang="ts" setup>
import { TextField, Utils } from '@nativescript/core';
import { CollectionView as CollectionViewType } from '@nstudio/ui-collectionview';
import { ItemDisplay, SupabaseDataService } from '@supabase-x-platforms/nativescript-data';
import {
  collectionViewEvents,
  registerLayouts,
  videoUtils,
} from '@supabase-x-platforms/nativescript-ui';
import { ref, onMounted, reactive } from 'nativescript-vue';
import { useSyncObservableArray } from '@nativescript-use/vue';

const isApple = __APPLE__;
const lineData = {
  colors: ['#38c883', '#dd00ff', '#00bfff', '#38c883'],
};
const videoHandlers = videoUtils;
const isDarkMode = ref(false);
const videoAssets = reactive({
  src: `~/assets/lines-${isDarkMode.value ? 'black.mp4' : 'white.mp4'}`
});
// const itemList = ref(new ObservableArray<ItemDisplay>([]));
const itemListRef = ref([]);
const { observableArray: itemList } = useSyncObservableArray<ItemDisplay>(itemListRef, {
  addRemoveByField: 'id',
  watchUpdates: true, // <-- default is false
});
let input: TextField;
let list: CollectionViewType;
let listRefreshTimeout: any;

const supabaseService = new SupabaseDataService(items => {
  Utils.executeOnMainThread(() => {
    itemListRef.value = items;
  });
});

function loadedInput(args) {
  input = args.object;
}
function toggleDone(args) {
  const item = args.item as ItemDisplay;
  // console.log('toggleDone', item);
  item.done = !item.done;
  supabaseService.updateItem(item, args.index);
}

function loadedList(args) {
  list = args.object;
}

function checkboxToggle(args) {
  console.log('toggle:', args.data);
}

function playbackReady() {
  console.log('playbackReady');
}

onMounted(() => {
  registerLayouts();
  collectionViewEvents.subscribe(event => {
    // console.log(event);
    const item = supabaseService.items[event.data?.index];
    if (item) {
      supabaseService.deleteItem(item);
    }
  });
  // appListenForDarkMode(mode => {
  //   isDarkMode.value = mode === 'dark';
  // });
});

async function save() {
  if (input?.text) {
    // console.log(input.text);
    supabaseService.insertItem(input.text);
    input.text = '';
  }
}
</script>

<template>
  <Frame>
    <Page>
      <ActionBar title="NativeScript Todo with Supabase"></ActionBar>

      <GridLayout rows="auto,auto,*">
        <!-- visual effects -->
        <AnimatedLines
          v-if="isApple"
          rowSpan="3"
          :data="lineData"
          class="ml-[64] mr-[64] h-[70] align-top"
        ></AnimatedLines>

        <Video
          v-if="!isApple"
          rowSpan="3"
          :src="videoAssets.src"
          autoplay="true"
          loop="true"
          controls="false"
          class="ml-[64] mr-[64] h-[100] align-top"
          :class="{
            'bg-white': !isDarkMode,
            'bg-black': isDarkMode,
          }"
          translateY="-12"
        ></Video>
        <!-- end visual effects -->
        <GridLayout rows="auto" columns="auto,*,auto" class="mx-4 mt-1 h-12">
          <Image src="~/assets/supabase.png" class="h-12 w-12"></Image>
          <Image col="2" src="~/assets/vue.png" class="h-12 w-12"></Image>
        </GridLayout>
        <TextField
          row="1"
          class="m-4 rounded-md border-4 border-[#38c883] bg-[#1f7a4e] p-4 text-lg text-white"
          hint="Type a ToDo..."
          @loaded="loadedInput"
          @returnPress="save"
        ></TextField>
        <GridLayout row="2">
          <CollectionView
            iosOverflowSafeArea="true"
            layoutStyle="swipeWithDelete"
            :items="itemList"
            @itemTap="toggleDone"
            @loaded="loadedList"
          >
            <template #default="{ item }">
              <GridLayout rows="auto,1">
                <GridLayout columns="auto,*" class="p-3">
                  <Checkbox :id="item.id" :data="item" @checkboxChange="checkboxToggle" width="50" height="50" />

                  <Label col="1" :text="item?.name" class="text-lg text-gray-500"></Label>
                </GridLayout>
                <ContentView row="1" class="bg-gray-500"></ContentView>
              </GridLayout>
            </template>
          </CollectionView>

          <!-- <ActivityIndicator busy="true" color="#38c883"></ActivityIndicator> -->
        </GridLayout>
      </GridLayout>
    </Page>
  </Frame>
</template>
