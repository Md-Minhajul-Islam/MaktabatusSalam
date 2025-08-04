document.addEventListener("DOMContentLoaded", () => {
  const verse = document.querySelector(".verse");
  const verseNum = document.querySelector(".verse-num");
  const administrationButton = document.querySelector(".administration");
  const administrationPanel = document.querySelector(".administration-panel");
  
  if (administrationButton && administrationPanel) {
    administrationButton.addEventListener("click", () => {
      administrationPanel.classList.toggle("administration-panel-visible");
    });
  }

  if (
    verse &&
    verseNum &&
    typeof quranicVerse !== "undefined" &&
    quranicVerse.length > 0
  ) {
    function showVerse() {
      const index = Math.floor(Math.random() * quranicVerse.length);
      verse.innerText = quranicVerse[index].verse;
      verseNum.innerText = quranicVerse[index].verseNum;
    }
    showVerse();
    setInterval(showVerse, 10000);
  }

  
});
