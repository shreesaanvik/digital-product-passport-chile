export const PHONE_SCREEN_ID = "phone-screen";

const FRAME_MEDIA = "(min-width: 768px)";

/** Lock the phone screen while the frame is showing, and the document on a real phone. */
export function lockOverlayScroll(): () => void {
  const screen = document.getElementById(PHONE_SCREEN_ID);
  const framed = window.matchMedia(FRAME_MEDIA).matches && screen != null;

  if (framed && screen) {
    const previous = screen.style.overflowY;
    screen.style.overflowY = "hidden";
    return () => {
      screen.style.overflowY = previous;
    };
  }

  const previous = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  return () => {
    document.body.style.overflow = previous;
  };
}
