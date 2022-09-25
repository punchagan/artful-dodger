import ReactImageLightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

const ACTION_NONE = 0;
const MIN_SWIPE_DISTANCE = 50;
const SOURCE_TOUCH = 2;

const touchIsTargetMatchImage = (target) => {
  return target && /(ril-image-current|ril-inner)/.test(target.className);
};

class Lightbox extends ReactImageLightbox {
  handleTouchStart(event) {
    if (this.shouldHandleEvent(SOURCE_TOUCH) && touchIsTargetMatchImage(event.target)) {
      [].forEach.call(event.changedTouches, (eventTouch) =>
        this.addPointer(ReactImageLightbox.parseTouchPointer(eventTouch))
      );
      this.multiPointerStart(event);
    }
  }

  handleSwipeEnd(event) {
    const xDiff = this.swipeEndX - this.swipeStartX;
    const yDiff = this.swipeEndY - this.swipeStartY;
    const xDiffAbs = Math.abs(xDiff);
    const yDiffAbs = Math.abs(yDiff);

    this.currentAction = ACTION_NONE;
    this.swipeStartX = 0;
    this.swipeStartY = 0;
    this.swipeEndX = 0;
    this.swipeEndY = 0;

    if (!event || this.isAnimating()) {
      return;
    }

    if (xDiffAbs < MIN_SWIPE_DISTANCE && yDiffAbs < MIN_SWIPE_DISTANCE) {
      const boxRect = this.getLightboxRect();
      if (xDiffAbs < boxRect.width / 4 && yDiffAbs < boxRect.height / 4) {
        return;
      }
    }

    const direction = xDiffAbs > yDiffAbs ? "x" : "y";
    const isPrev = (direction === "x" && xDiff > 0) || (direction === "y" && yDiff > 0);
    const ev = { type: "scroll", direction: direction };

    if (isPrev && this.props.prevSrc) {
      event.preventDefault();
      this.requestMovePrev(ev);
    } else if (this.props.nextSrc) {
      event.preventDefault();
      this.requestMoveNext(ev);
    }
  }

  // Get sizing for when an image is larger than the window
  getFitSizes(width, height, stretch) {
    const boxSize = this.getLightboxRect();
    let maxHeight = boxSize.height - this.props.yImagePadding * 2;
    let maxWidth = boxSize.width - this.props.xImagePadding * 2;

    if (!stretch) {
      maxHeight = Math.min(maxHeight, height);
      maxWidth = Math.min(maxWidth, width);
    }

    const maxRatio = maxWidth / maxHeight;
    const srcRatio = width / height;

    if (maxRatio > srcRatio) {
      // height is the constraining dimension of the photo
      return {
        width: (width * maxHeight) / height,
        height: maxHeight,
      };
    }

    return {
      width: maxWidth,
      height: (height * maxWidth) / width,
    };
  }
}

export default Lightbox;
