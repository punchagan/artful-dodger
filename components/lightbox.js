import ReactImageLightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

const ACTION_NONE = 0;
const MIN_SWIPE_DISTANCE = 50;

class Lightbox extends ReactImageLightbox {
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
}

export default Lightbox;