///////////////////////////////////////////////////////////
// Fixing flexbox gap property missing in some Safari versions
export function checkFlexGap() {
  var flex = document.createElement("div");
  flex.style.display = "flex";
  flex.style.flexDirection = "column";
  flex.style.rowGap = "1px";

  flex.appendChild(document.createElement("div"));
  flex.appendChild(document.createElement("div"));

  document.body.appendChild(flex);
  var isSupported = flex.scrollHeight === 1;
  flex.parentNode.removeChild(flex);
  console.log("OK", isSupported);

  if (!isSupported) document.body.classList.add("no-flexbox-gap");
}

///////////////////////////////////////////////////////////
// pour calculer copyright year
export function setCopyright() {
  const copyrightYear = (
    document
    .querySelector(".copyright-year")
    .textContent =  new Date().getFullYear()
    );
  return copyrightYear;
}

///////////////////////////////////////////////////////////
// NAVIGATION et header/bouton MOBILE
export function setScrolling() {
  const btnNav = document.querySelector(".btn-mobile-nav");
  const headerNav = document.querySelector(".header");

  btnNav.addEventListener("click", function () {
    return headerNav.classList.toggle("nav-open");
  });

  // smooth scrolling
  const allLinks = document.querySelectorAll("a:link");
  allLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      const href = link.getAttribute("href");
      if (href.startsWith("#")) {
        e.preventDefault();
        // scroll back to top
        if (href === "#") {
          window.scrollTo({
            behavior: "smooth",
            top: 0
          });
        }
        // scroll to links
        if (href !== "#" && href.startsWith("#")) {
          const sectionEl = document.querySelector(href);
          sectionEl.scrollIntoView({ behavior: "smooth" });
        }
      }

      // close mobile nav
      if (link.classList.contains("main-nav-link")) {
        return headerNav.classList.toggle("nav-open");
      }
    });
  });

  // back to top arrow
  const showOnPx = 100;
  const backToTopButton = document.querySelector(".back-to-top");
  const scrollContainer = () => document.documentElement || document.body;

  document.addEventListener(
    "scroll", () => (scrollContainer().scrollTop > showOnPx)
    ? backToTopButton.classList.remove("to-hide")
    : backToTopButton.classList.add("to-hide")
  );
}
