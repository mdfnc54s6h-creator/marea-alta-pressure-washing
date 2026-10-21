import './styles.css';
import { createMotionSystem } from './motion.js';

// Page sections and their interactions will be added in the next brief.
const motion = createMotionSystem();

if (import.meta.hot) {
  import.meta.hot.dispose(() => motion.destroy());
}
