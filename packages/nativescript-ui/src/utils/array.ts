import { ItemDisplay } from '@supabase-x-platforms/nativescript-data';

export function sortDoneUpdated(array: Array<ItemDisplay>) {
  return array.sort((a, b) => {
    if (a.done !== b.done) {
      const aDone = a.done ? 1 : 0;
      const bDone = b.done ? 1 : 0;
      return aDone - bDone;
    }
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });
}
