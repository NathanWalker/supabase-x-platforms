import { JSX } from '@nativescript-dom/solidjs-types/jsx-runtime';
import { ContentView } from '@nativescript/core';
import { ItemDisplay } from '@supabase-x-platforms/nativescript-data';
import { children, Component, createSignal, For, getOwner, Owner, runWithOwner } from 'solid-js';

function checkboxToggle(args: { data: ItemDisplay }) {
  console.log('toggle:', args.data);
}
export const Item: Component<{
  item?: () => ItemDisplay;
  index?: () => number;
  type: () => string;
}> = props => {
  return (
    <gridlayout rows="auto,1">
      <gridlayout columns="auto,*" class="p-3">
        <checkbox id={props.item().id} data={props.item()} checkboxChange={checkboxToggle} width="50" height="50" />

        <label col="1" text={props.item().name} class="text-lg text-gray-500" />
      </gridlayout>
      <contentview row="1" class="bg-gray-500"></contentview>
    </gridlayout>
  );
};

export const DynamicList: Component<
  {
    renderItem: (props: { item: any; index: any; type: any }) => any;
    items: any[];
    onItemType: (item: any, index: any) => string;
    itemTap?: (item: any, index: any) => void;
    itemTypes: string[];
    layoutStyle?: string;
    loaded: (event: { object: any }) => void;
  } & Omit<JSX.IntrinsicElements['collectionview'], 'itemTemplateSelector' | 'items' | 'itemTemplates' | 'itemTemplate'>
> = props => {
  const owner = getOwner();
  const { items, renderItem, onItemType, itemTypes, loaded, ...restProps } = props;
  const templates = props.itemTypes || ['_default'];

  return (
    <collectionview
      {...restProps}
      items={{
        length: props.items?.length || 0,
        getItem(index: number) {
          return props.items?.[index];
        },
      }}
      itemTemplateSelector={(item: any, index: any) => {
        return onItemType?.(item, index) || '_default';
      }}
      on:itemTap={(event: any) => {
        const { item, index } = event;
        props.itemTap?.(item, index);
      }}
      iosOverflowSafeArea={true}
      on:loaded={loaded}
    >
      <arrayprop key="itemTemplates">
        <For each={templates}>
          {key => (
            <itemtemplate
              key={key}
              on:itemLoading={(event: any) => {
                const { view, item, index } = event;
                const update_solid_context = (view as any).__update_solid_context;

                if (update_solid_context) {
                  update_solid_context(item, index, key);
                } else {
                  runWithOwner(owner as Owner, () => {
                    const [item, setItem] = createSignal(event.item);
                    const [index, setIndex] = createSignal<number>(event.index || 0);
                    const [type, setType] = createSignal<string>(key);
                    const element = children(() => renderItem({ item, index, type: type }));

                    (event.view as ContentView).content = element() as never;

                    (event.view as any).__update_solid_context = (item: any, index: number, type: string) => {
                      setItem(item);
                      setIndex(index);
                      setType(type);
                    };
                  });
                }
              }}
              on:createView={(event: any) => {
                event.view = document.createElement('ContentView') as any;
              }}
            />
          )}
        </For>
      </arrayprop>
    </collectionview>
  );
};
