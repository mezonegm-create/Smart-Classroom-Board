/**
 * Every page uses a fixed logical coordinate space so drawings, exports and
 * saved boards look identical regardless of the device's actual screen size.
 * The DOM canvas is scaled with CSS to fit whatever container it lives in.
 */
export const LOGICAL_WIDTH = 1600;
export const LOGICAL_HEIGHT = 1000;
export const LOGICAL_ASPECT = LOGICAL_WIDTH / LOGICAL_HEIGHT;
