
document.addEventListener('DOMContentLoaded', () => {
    //quranic Verse
    const verse = document.querySelector('.verse');
    const verseNum = document.querySelector(".verse-num");

    if (!verse || !verseNum || !quranicVerse || quranicVerse.length === 0)
        return;

    function showVerse() {
        const index = Math.floor(Math.random() * quranicVerse.length);
        verse.innerText = quranicVerse[index].verse;
        verseNum.innerText = quranicVerse[index].verseNum;
    }
    showVerse();
    setInterval(showVerse, 10000);
});
