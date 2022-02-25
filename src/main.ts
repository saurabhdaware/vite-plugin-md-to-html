import testMd, { attributes } from "./test.md";

document.title = attributes.title;
document.querySelector("#app").innerHTML = testMd;
