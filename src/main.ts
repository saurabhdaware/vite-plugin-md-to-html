import testMd, { attributes } from "./test.md";
import "highlightjs-calvera-dark/theme.css";

document.title = attributes.title;
document.querySelector("#app").innerHTML = testMd;
