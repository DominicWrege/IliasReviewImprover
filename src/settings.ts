
const slider: HTMLInputElement | null = document.querySelector("#width-slider");
const valueLabel: HTMLDivElement | null = document.querySelector("#value-slider-text");

if (slider && valueLabel) {
	const unit = "rem";
	load().then((width: any) => {
		slider.value = width;
		valueLabel.textContent = `${width}${unit}`;
	});

	slider.addEventListener("input", (e: Event) => {
		e?.preventDefault();
		const element: HTMLInputElement | null = e?.target as HTMLInputElement;
		const width = element?.value;
		valueLabel.textContent = `${width}${unit}`;
		saveWidthSettings(width);
	});
}

function saveWidthSettings(width: string): void {
	if (!width) {
		return;
	}
	// @ts-ignore
	chrome.storage.local.set({ width });
}

export async function load(): Promise<number> {
	const defaultWidth = 40;
	return new Promise((resolve, _reject) => {
		// @ts-ignore
		chrome.storage.local.get(["width"], (result: any) => {
			resolve(result.width ?? defaultWidth);
		});
	});
}
