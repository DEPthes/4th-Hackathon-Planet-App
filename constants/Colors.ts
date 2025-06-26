// main
const MAIN_COLOR = "#FFFFFF";
const MAIN_COLOR2 = "#ECEDFE";
const MAIN_COLOR_DARK = "#3A3A3A";
const SUB_COLOR = "#9C9FEE";
const SUB_COLOR_LIGHT = "#E4E4E4";
const POINT_COLOR = "#FFFFFF";

// font
const FONT_MAIN = "#3A3A3A";
const FONT_SUB = "#929498";
const FONT_SUB2 = "#CBCED3";

export default {
  light: {
    text: FONT_MAIN,
    background: POINT_COLOR,
    tint: MAIN_COLOR,
    main: MAIN_COLOR,
    sub: SUB_COLOR,
    subLight: SUB_COLOR_LIGHT,
    point: POINT_COLOR,
    fontMain: FONT_MAIN,
    fontSub: FONT_SUB,
    fontSub2: FONT_SUB2,
    tabIconDefault: "#ccc",
    tabIconSelected: MAIN_COLOR,
  },
  dark: {
    text: POINT_COLOR,
    background: MAIN_COLOR_DARK,
    tint: MAIN_COLOR_DARK,
    main: MAIN_COLOR_DARK,
    sub: SUB_COLOR,
    subLight: SUB_COLOR_LIGHT,
    point: POINT_COLOR,
    fontMain: POINT_COLOR,
    fontSub: FONT_SUB,
    fontSub2: FONT_SUB2,
    tabIconDefault: "#ccc",
    tabIconSelected: MAIN_COLOR_DARK,
  },
};

export {
  MAIN_COLOR,
  MAIN_COLOR2,
  MAIN_COLOR_DARK,
  POINT_COLOR,
  SUB_COLOR,
  SUB_COLOR_LIGHT,
};
