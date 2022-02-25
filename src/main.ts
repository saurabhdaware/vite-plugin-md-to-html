import testMd, { attributes } from "./test.md";
import "./calvera-theme.css";

document.title = attributes.title;
document.querySelector("#app").innerHTML = testMd;
