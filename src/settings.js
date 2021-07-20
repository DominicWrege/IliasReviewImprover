const slider = document.querySelector("#width-slider");
const valueLabel = document.querySelector("#value-slider");
const widthKey = "width";

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
		browser.storage.local.set({ width: width });
	}
}

function isChrome() {
	return chrome?.storage !== undefined && chrome?.storage !== null;
}

async function loadSettings() {
	const defaultWidth = 40;
	if (!isChrome) {
		const obj = await browser.storage.local.get(widthKey);
		if (obj[widthKey]) {
			return obj[widthKey];
		}
	} else {
		return new Promise((resolve, _reject) => {
			chrome.storage.local.get([widthKey], (result) => {
				if (result?.width) {
					return resolve(result.width);
				}
				return resolve(defaultWidth);
			});
		});
	}
	return defaultWidth;
}
