const slider = document.querySelector("#width-slider");
const valueLabel = document.querySelector("#value-slider");

if (slider && valueLabel) {
	const unit = "rem";
	loadSettings().then((width) => {
		slider.value = width;
		valueLabel.textContent = `${width}${unit}`;
	});

	slider.addEventListener("input", (e) => {
		e.preventDefault();
		const width = e.target.value;
		console.log(width);
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

async function loadSettings() {
	const defaultWidth = 40;
	return new Promise((resolve, _reject) => {
		chrome.storage.local.get(["width"], (result) => {
			resolve(result.width ?? defaultWidth);
		});
	});
}
