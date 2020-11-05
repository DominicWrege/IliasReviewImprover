const slider = document.querySelector("#width-slider");
const valueLabel = document.querySelector("#value-slider");

const unit = "rem";

checkSettings().then((width) => {
    slider.value = width;
    valueLabel.textContent = `${width}${unit}`;
});

slider.addEventListener("input", (e) => {
    e.preventDefault();
    const v = e.target.value;
    valueLabel.textContent = `${v}${unit}`;
    browser.storage.local.set({
        width: v,
    });
});
