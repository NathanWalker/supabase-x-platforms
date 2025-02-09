import { CollectionView } from '@nstudio/ui-collectionview';
import { collectionViewEvents } from './common';
import { Color } from '@nativescript/core';

export * from './common';

export function registerLayouts() {
  CollectionView.registerLayoutStyle('swipeWithDelete', {
    createLayout,
  });
}

export function createLayout(collectionView: CollectionView) {
  const config = UICollectionLayoutListConfiguration.alloc().initWithAppearance(UICollectionLayoutListAppearance.Plain);
  config.showsSeparators = true;

  config.trailingSwipeActionsConfigurationProvider = (p1: NSIndexPath) => {
    const archiveAction = UIContextualAction.contextualActionWithStyleTitleHandler(
      UIContextualActionStyle.Normal,
      'Archive',
      (action: UIContextualAction, sourceView: UIView, actionPerformed: (p1: boolean) => void) => {
        collectionViewEvents.next({
          type: 'swipeActionPerformed',
          data: {
            type: 'delete',
            index: p1.row,
          },
        });
        actionPerformed(true);
      }
    );
    archiveAction.backgroundColor = new Color('#b80f0a').ios;
    archiveAction.image = UIImage.systemImageNamed('archivebox.fill');

    return UISwipeActionsConfiguration.configurationWithActions([archiveAction]);
  };

  return UICollectionViewCompositionalLayout.layoutWithListConfiguration(config);
}
