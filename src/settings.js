
const slider = document.querySelector("#width-slider");
const valueLabel = document.querySelector("#value-slider");

if (slider && valueLabel) {
	const unit = "rem";
	load().then((width) => {
		slider.value = width;
		valueLabel.textContent = `${width}${unit}`;
	});

	slider.addEventListener("input", (e) => {
		e.preventDefault();
		const width = e.target.value;
		valueLabel.textContent = `${width}${unit}`;
		saveWidthSettings(width);
	});
}

function saveWidthSettings(width) {
	if (!width) {
		return;
	}
	chrome.storage.local.set({ width });
}

export async function load() {
	const defaultWidth = 40;
	return new Promise((resolve, _reject) => {
		chrome.storage.local.get(["width"], (result) => {
			resolve(result.width ?? defaultWidth);
		});
	});
}
