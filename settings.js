const slider = document.querySelector("#width-slider");
const valueLabel = document.querySelector("#value-slider");

checkSettings().then((width) => {
    valueLabel.textContent = `${width}em`;
});

slider.addEventListener("input", (e) => {
    e.preventDefault();
    const v = e.target.value;
    valueLabel.textContent = `${v}rem`;
    browser.storage.local.set({
        width: v,
    });
});
