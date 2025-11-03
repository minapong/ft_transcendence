// Greeting.tsx
import { jsxDEV } from "reactor/jsx-dev-runtime";
import Nav from "./Nav"
import Footer from "./footer"
import "./abc.css"
function Main() {
	return (
	  <div>
		<Nav/>
		<div style="background:aqua;height:100vh;width:100vw">
			<h1 style="margin:0;height:100%;display:flex;justify-content:center;align-items:center">
				Transcend
			</h1>
		</div>
		<span id="hash">i am spanned</span>
		<Footer/>
	  </div>
	);
  }
  
  export default Main;
  