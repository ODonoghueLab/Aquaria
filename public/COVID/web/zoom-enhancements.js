let pinchZoomEnabled = false;

function enableTouchPinchZoom() {
    let startX = 0, startY = 0;
    let initialPinchDistance = 0;
    let pinchScale = 1;
    const viewer = document.getElementById("viewer");
    const container = document.getElementById("viewerContainer");
    const reset = () => { startX = startY = initialPinchDistance = 0; pinchScale = 1; };

    viewer.addEventListener("touchstart", (e) => {
        if (e.touches.length > 1) {
            startX = (e.touches[0].pageX + e.touches[1].pageX) / 2;
            startY = (e.touches[0].pageY + e.touches[1].pageY) / 2;
            initialPinchDistance = Math.hypot((e.touches[1].pageX - e.touches[0].pageX), (e.touches[1].pageY - e.touches[0].pageY));
        } else {
            initialPinchDistance = 0;
        }
    });

    viewer.addEventListener("touchmove", (e) => {
        if (initialPinchDistance <= 0 || e.touches.length < 2) { return; }

        const pinchDistance = Math.hypot((e.touches[1].pageX - e.touches[0].pageX), (e.touches[1].pageY - e.touches[0].pageY));
        const originX = startX + container.scrollLeft;
        const originY = startY + container.scrollTop;
        pinchScale = pinchDistance / initialPinchDistance;

        viewer.style.transform = `scale(${pinchScale})`;
        viewer.style.transformOrigin = `${originX}px ${originY}px`;
    });

    viewer.addEventListener("touchend", (e) => {
        if (initialPinchDistance <= 0) { return; }

        viewer.style.transform = `none`;
        viewer.style.transformOrigin = `unset`;

        PDFViewerApplication.pdfViewer.currentScale *= pinchScale;
        const rect = container.getBoundingClientRect();
        const dx = startX - rect.left;
        const dy = startY - rect.top;
        container.scrollLeft += dx * (pinchScale - 1);
        container.scrollTop += dy * (pinchScale - 1);

        reset();
    });

}

function enableGesturePinchZoom() {

  // @TODO consider using CSS transform on change
  // then applying the actual zoom on end
  // like the above touch handlers (might be more performant)

  let pinchScale = 1;

  // Prevent native iOS page zoom
  document.addEventListener("gesturestart", (e) => e.preventDefault(), { passive: false });

  viewer.addEventListener("gesturestart", (e) => gesturestart(e));
  viewer.addEventListener("gesturechange", (e) => gesturechange(e));
  viewer.addEventListener("gestureend", (e) => gestureend(e));

  function gesturestart (event) {
    event.preventDefault();
    pinchScale = PDFViewerApplication.pdfViewer.currentScale;
  }

  function gesturechange (event) {
    event.preventDefault();
    PDFViewerApplication.pdfViewer.currentScale = pinchScale * event.scale;
  }

  function gestureend (event) {
    event.preventDefault();
    pinchScale = 1;
  }
}

document.addEventListener('webviewerloaded', () => {
  if (!pinchZoomEnabled) {
    pinchZoomEnabled = true;
    if (typeof GestureEvent !== 'undefined') {
      enableGesturePinchZoom(); // Safari
    } else {
      enableTouchPinchZoom(); // other browsers (Android, Windows w/ Touch)
    }
  }
});