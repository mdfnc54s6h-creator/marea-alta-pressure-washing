import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/** Creates the shared scroll system; call destroy() during teardown or HMR. */
export function createMotionSystem() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let lenis = null;
  let onTick = null;

  const start = () => {
    if (reduceMotion.matches || lenis) return;
    lenis = new Lenis({ autoRaf: false, smoothWheel: true, syncTouch: false });
    onTick = (time) => lenis?.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);
    lenis.on('scroll', ScrollTrigger.update);
  };

  const stop = () => {
    if (onTick) gsap.ticker.remove(onTick);
    lenis?.destroy();
    lenis = null;
    onTick = null;
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  };

  const onMotionChange = () => (reduceMotion.matches ? stop() : start());
  reduceMotion.addEventListener('change', onMotionChange);
  start();

  return {
    gsap,
    ScrollTrigger,
    destroy() {
      reduceMotion.removeEventListener('change', onMotionChange);
      stop();
    },
  };
}
