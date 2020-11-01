const slider = document.querySelector("#margin-slider");
const valueLabel = document.querySelector("#value-slider");

checkSettings().then((margin) => {
    valueLabel.textContent = `${margin}em`;
});

slider.addEventListener("input", (e) => {
    e.preventDefault();
    const v = e.target.value;
    valueLabel.textContent = `${v}em`;
    console.log(v);
    browser.storage.sync.set({
        margin: v,
    });
});
