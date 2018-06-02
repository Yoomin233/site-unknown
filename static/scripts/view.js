(function() {
  const $ = document.querySelector.bind(document);
  const videoElem = $("video");
  const videoShade = $(".videoLoadingShade");
  videoElem.addEventListener("canplay", () => {
    videoShade.style.opacity = 0;
    setTimeout(() => {
      videoShade.style.display = "none";
    }, 500);
  });
})();
