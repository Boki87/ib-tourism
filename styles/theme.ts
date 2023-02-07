import { extendTheme } from "@chakra-ui/react";

const styles = {
  global: () => ({
    html: {
      h: "100%",
      w: "100%",
      scrollBehavior: "smooth",
    },
    body: {
      h: "100%",
      w: "100%",
    },
    "#__next": {
      h: "100%",
      w: "100%",
    },
    "#nprogress .bar": {
      height: "5px",
      background: "var(--chakra-colors-green-400)",
    },
    // ".bg-gradient": {
    //   position: "fixed",
    //   background:
    //     "conic-gradient(from 136.95deg at 50% 50%,#0294fe -55.68deg,#ff2136 113.23deg,#9b4dff 195deg,#0294fe 304.32deg,#ff2136 473.23deg)",
    //   backgroundImage:
    //     "conic-gradient(from 136.95deg at 50% 50%, rgb(2, 148, 254) -55.68deg, rgb(255, 33, 54) 113.23deg, rgb(155, 77, 255) 195deg, rgb(2, 148, 254) 304.32deg, rgb(255, 33, 54) 473.23deg)",
    //   "background-position-x": "initial",
    //   "background-position-y": "initial",
    //   "background-size": "initial",
    //   "background-repeat-x": "initial",
    //   "background-repeat-y": "initial",
    //   "background-attachment": "initial",
    //   "background-origin": "initial",
    //   "background-clip": "initial",
    //   "background-color": "initial",
    //   filter: "blur(200px)",
    //   opacity: ".5",
    //   "z-index": "-10",
    //   height: "300px",
    //   width: "300px",
    //   top: "-150px",
    //   right: "0px",
    // },
  }),
};

const config = {
  initialColorMode: "light",
  useSystemColorMode: true,
};

const theme = extendTheme({
  config,
  styles,
});

export default theme;
