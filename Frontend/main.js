const routes = {
  "/": () => `<h1>🏠 Home</h1><p>Welcome to the tiny SPA!</p>`,
  "/about": () => `<h1>ℹ️ About</h1><p>This page was loaded without a full reload.</p>`,
  "/contact": () => `<h1>📬 Contact</h1><p>Drop us a message in the void.</p>`
};

// SPA 404 page as a function returning HTML
const notFound = () => `
  <header>The Deep Dark of Moria</header>
  <main>
    <h1>404 – The Path Is Lost</h1>
    <p>The page you seek is hidden in shadow, as if lost among the endless halls of Khazad-dûm.</p>
    <blockquote>
      “I have no memory of this place.”<br>
      — <em>Gandalf, The Fellowship of the Ring</em>
    </blockquote>
    <img class="gandalf" src="https://i.makeagif.com/media/1-17-2016/kghAIS.gif" alt="Gandalf lost in Moria">
    <p>The path you hoped to follow does not exist. Turn back before the beast awakens.</p>
  </main>
  <footer>
    ✠ The Lost Ways of Moria ✠
  </footer>
`;

function router() {
  const path = window.location.pathname;
  const view = routes[path] || notFound;
  document.querySelector("#app").innerHTML = view();
}

document.addEventListener("click", (e) => {
  const link = e.target.closest("[data-link]");
  if (!link) return;
  e.preventDefault();
  window.history.pushState(null, "", link.href);
  router();
});

window.addEventListener("popstate", router);
router();
