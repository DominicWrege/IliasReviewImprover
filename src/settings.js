const slider = document.querySelector("#width-slider");
const valueLabel = document.querySelector("#value-slider");

if (slider && valueLabel) {
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
}

async function checkSettings() {
    if (typeof browser !== "undefined" && browser != null) {
        const obj = await browser.storage.local.get("width");
        if (obj["width"]) {
            return obj.width;
        }
    }
    return 40;
}
