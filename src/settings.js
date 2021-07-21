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
	if (isChrome) {
		chrome.storage.local.set({ width });
	} else {
		browser.storage.local.set({ width });
	}
}

function isChrome() {
	return chrome?.storage !== undefined && chrome?.storage !== null;
}

async function loadSettings() {
	const defaultWidth = 40;
	if (isChrome) {
		return new Promise((resolve, _reject) => {
			chrome.storage.local.get(["width"], (result) => {
				resolve(result.width ?? defaultWidth);
			});
		});
	}
	return (await browser.storage.local.get("width")) ?? defaultWidth;
}
