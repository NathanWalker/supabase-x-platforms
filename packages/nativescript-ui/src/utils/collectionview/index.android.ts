import { Color, ImageSource, Utils } from '@nativescript/core';
import { CollectionView } from '@nstudio/ui-collectionview';
import { collectionViewEvents } from './common';

export * from './common';

import GridLayoutManager = androidx.recyclerview.widget.GridLayoutManager;
import ItemTouchHelper = androidx.recyclerview.widget.ItemTouchHelper;
import BitmapDrawable = android.graphics.drawable.BitmapDrawable;
import ColorDrawable = android.graphics.drawable.ColorDrawable;
import Paint = android.graphics.Paint;
import RecyclerView = androidx.recyclerview.widget.RecyclerView;
import Canvas = android.graphics.Canvas;

@NativeClass()
class SwipeToDeleteCallback extends ItemTouchHelper.SimpleCallback {
  owner: WeakRef<CollectionView>;
  mBackground: ColorDrawable;
  backgroundColor: number;
  mClearPaint: Paint;
  deleteDrawable: BitmapDrawable;
  deleteIconSize: { width: number; height: number };
  swipeIndex: number;
  removing = false;

  static initWithOwner(owner: WeakRef<CollectionView>) {
    const swipe = new SwipeToDeleteCallback(
      ItemTouchHelper.UP | ItemTouchHelper.DOWN | ItemTouchHelper.START | ItemTouchHelper.END,
      ItemTouchHelper.LEFT
    );
    swipe.owner = owner;
    return swipe;
  }

  constructor(dragDirs: number, swipeDirs: number) {
    super(dragDirs, swipeDirs);
    this.mBackground = new ColorDrawable();
    this.backgroundColor = new Color('#b80f0a').android;
    this.mClearPaint = new Paint();
    this.mClearPaint.setXfermode(new android.graphics.PorterDuffXfermode(android.graphics.PorterDuff.Mode.CLEAR));
    const img = ImageSource.fromFileOrResourceSync('res://ic_delete');
    this.deleteDrawable = new BitmapDrawable(Utils.android.getResources(), img.android);
    this.deleteIconSize = {
      width: img.width,
      height: img.height,
    };
    return global.__native(this);
  }

  getMovementFlags(recyclerView: RecyclerView, viewHolder: RecyclerView.ViewHolder) {
    this.swipeIndex = viewHolder.getAdapterPosition();
    return ItemTouchHelper.SimpleCallback.makeMovementFlags(0, ItemTouchHelper.LEFT);
  }

  onMove(recyclerview: RecyclerView, viewHolder: RecyclerView.ViewHolder, target: RecyclerView.ViewHolder): boolean {
    return false;
  }

  public onChildDraw(
    c: Canvas,
    recyclerView: RecyclerView,
    viewHolder: RecyclerView.ViewHolder,
    dX: number,
    dY: number,
    actionState: number,
    isCurrentlyActive: boolean
  ): void {
    super.onChildDraw(c, recyclerView, viewHolder, dX, dY, actionState, isCurrentlyActive);

    const itemView = viewHolder.itemView;
    const itemHeight = itemView.getHeight();

    const isCancelled = dX == 0 && !isCurrentlyActive;

    if (isCancelled) {
      this.clearCanvas(c, itemView.getRight() + dX, itemView.getTop(), itemView.getRight(), itemView.getBottom());
      super.onChildDraw(c, recyclerView, viewHolder, dX, dY, actionState, isCurrentlyActive);
      return;
    }

    this.mBackground.setColor(this.backgroundColor);
    this.mBackground.setBounds(itemView.getRight() + dX, itemView.getTop(), itemView.getRight(), itemView.getBottom());
    this.mBackground.draw(c);

    const deleteIconTop = itemView.getTop() + (itemHeight - this.deleteIconSize.height) / 2;
    const deleteIconMargin = (itemHeight - this.deleteIconSize.height) / 2;
    const deleteIconLeft = itemView.getRight() - deleteIconMargin - this.deleteIconSize.width;
    const deleteIconRight = itemView.getRight() - deleteIconMargin;
    const deleteIconBottom = deleteIconTop + this.deleteIconSize.height;

    this.deleteDrawable.setBounds(deleteIconLeft, deleteIconTop, deleteIconRight, deleteIconBottom);
    this.deleteDrawable.draw(c);
  }

  clearCanvas(c: android.graphics.Canvas, left: number, top: number, right: number, bottom: number) {
    if (!this.removing) {
      c.drawRect(left, top, right, bottom, this.mClearPaint);
    }
  }

  getSwipeThreshold(viewHolder: RecyclerView.ViewHolder) {
    return 0.7;
  }

  onSwiped(viewHolder: RecyclerView.ViewHolder, i: number) {
    const owner = this.owner?.deref();
    if (owner) {
      // Note: could show confirm dialog or notify event for handling outside
      this.removing = true;
      collectionViewEvents.next({
        type: 'swipeActionPerformed',
        data: {
          type: 'delete',
          index: this.swipeIndex,
        },
      });
    }
  }
}

@NativeClass()
class SwipeToDeleteAnimation extends RecyclerView.ItemDecoration {
  mBackground: ColorDrawable;

  constructor() {
    super();
    return global.__native(this);
  }

  init() {
    this.mBackground = new ColorDrawable(new Color('#b80f0a').android);
  }

  // @ts-ignore
  onDrawOver(c: Canvas, parent: RecyclerView, state: RecyclerView.State) {
    // only if animation is in progress
    if (parent.getItemAnimator()?.isRunning()) {
      const left = 0;
      const right = parent.getWidth();

      let lastViewComingDown = null;
      let firstViewComingUp = null;
      let top = 0;
      let bottom = 0;

      // find relevant translating views
      const childCount = parent.getLayoutManager().getChildCount();
      for (let i = 0; i < childCount; i++) {
        const child = parent.getLayoutManager().getChildAt(i);
        if (child.getTranslationY() < 0) {
          // view is coming down
          lastViewComingDown = child;
        } else if (child.getTranslationY() > 0) {
          // view is coming up
          if (firstViewComingUp == null) {
            firstViewComingUp = child;
          }
        }
      }

      if (lastViewComingDown != null && firstViewComingUp != null) {
        // views are coming down AND going up to fill the void
        top = lastViewComingDown.getBottom() + lastViewComingDown.getTranslationY();
        bottom = firstViewComingUp.getTop() + firstViewComingUp.getTranslationY();
      } else if (lastViewComingDown != null) {
        // views are going down to fill the void
        top = lastViewComingDown.getBottom() + lastViewComingDown.getTranslationY();
        bottom = lastViewComingDown.getBottom();
      } else if (firstViewComingUp != null) {
        // views are coming up to fill the void
        top = firstViewComingUp.getTop();
        bottom = firstViewComingUp.getTop() + firstViewComingUp.getTranslationY();
      }

      this.mBackground.setBounds(left, top, right, bottom);
      this.mBackground.draw(c);
    }
    super.onDraw(c, parent, state);
  }
}

export function registerLayouts() {
  CollectionView.registerLayoutStyle('swipeWithDelete', {
    createLayout,
  });
}

export function createLayout(view: CollectionView) {
  const recyclerView = <RecyclerView>view?.nativeView;
  if (!recyclerView) {
    return;
  }
  const swipeToDeleteCallback = SwipeToDeleteCallback.initWithOwner(new WeakRef(view));

  const itemTouchHelper = new ItemTouchHelper(swipeToDeleteCallback);
  itemTouchHelper.attachToRecyclerView(recyclerView);

  recyclerView.addItemDecoration(
    // @ts-ignore
    new SwipeToDeleteAnimation()
  );

  return new GridLayoutManager(Utils.android.getApplicationContext(), 1);
}
