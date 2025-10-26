import "./index.css";
import "reactor";
import Greeting from "components/Greeting";

const root = document.getElementById("app");
if (root) {
  root.innerHTML = "";
  root.append(<Greeting/>);
}
// console.log("Greeting returns:", Greeting());
