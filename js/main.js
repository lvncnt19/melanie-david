(function () {
  var toggle = document.querySelector(".menu-toggle");
  var panel = document.querySelector("#nav-panel");

  if (!toggle || !panel) return;

  toggle.addEventListener("click", function () {
    var open = panel.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  panel.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      panel.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
})();

document.addEventListener("click", function (e) {
  var btn = e.target.closest(".text-expand-toggle");
  if (!btn || btn.tagName !== "BUTTON") return;

  var id = btn.getAttribute("aria-controls");
  var panel = id && document.getElementById(id);
  if (!panel) return;

  panel.hidden = !panel.hidden;
  var expanded = !panel.hidden;
  btn.setAttribute("aria-expanded", expanded ? "true" : "false");

  var moreLabel = btn.querySelector(".toggle-label--more");
  var lessLabel = btn.querySelector(".toggle-label--less");
  if (moreLabel && lessLabel) {
    moreLabel.hidden = expanded;
    lessLabel.hidden = !expanded;
  }
});