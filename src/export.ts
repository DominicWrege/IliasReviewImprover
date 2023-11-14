const JSZip = require("jszip");
import * as util from "./util";

function getAssignmentName(): string | null {
	const select: HTMLSelectElement | null = document.querySelector(
		"div.ilTableFilterInput select#question"
	);
	const firstChild = select?.options[select.selectedIndex]?.firstChild;

	if (firstChild?.textContent) {
		return firstChild?.textContent.replace(/\s/g, "").split("(")[0];
	}

	return null;
}

async function exportArchiveHandler(event: Event) {
	const button = event.target as HTMLInputElement;
	const oldValue = button.value.slice();
	button.value = "loading...";
	event.preventDefault();
	try {
		const rows = await downloadRowData();
		const zip = new JSZip();
		for (const row of rows) {
			zip.file(`${row.username}.txt`, row.answerText);
		}
		const zipContent = await zip.generateAsync({ type: "blob" });
		createFile(zipContent, `${getAssignmentName()}.zip`);
	} catch (err) {
		console.error(err);
	} finally {
		button.value = oldValue;
	}
}

async function exportJSONHandler(event: Event): Promise<void> {
	event.preventDefault();
	const button = event.target as HTMLButtonElement;
	const oldValue = button.value.slice();
	button.value = "loading...";

	try {
		const rows = await downloadRowData();
		createFile(
			JSON.stringify(rows),
			`${getAssignmentName() ?? "ilias_export"}.json`,
			"application/json"
		);
	} catch (err) {
		console.error(err);
	} finally {
		button.value = oldValue;
	}
}

async function downloadRowData(): Promise<any> {
	const data = getDataFromRows().map(async (row: TableRow) => {
		// util.js
		const answerData = await util.downloadAnswer(row.answerLink);
		// if (row?.answerLink) {
		//     delete row.answerLink;
		// }
		return {
			...row, // util.js
			answerText: util.parseAnswer(answerData).answer?.textContent,
		};
	});
	return Promise.all(data);
}

interface TableRow {
	lastName: string;
	firstName: string;
	username: string;
	points: number;
	answerLink: HTMLAnchorElement | null;
}

function getDataFromRows(): TableRow[] {
	let data: TableRow[] = [];

	document.querySelectorAll("tr.tblrow1,tr.tblrow2").forEach((tr) => {
		let div = tr.children[3]?.querySelector(
			"div.form-inline > input"
		) as HTMLInputElement;
		data.push({
			lastName: tr.children[0]?.textContent ?? "",
			firstName: tr.children[1]?.textContent ?? "",
			username: tr.children[2]?.textContent ?? "",
			points: parseFloat(div.value ?? 0),
			answerLink: tr.children[4]?.firstElementChild as HTMLAnchorElement,
		});
	});

	return data;
}

function createFile(
	data: BlobPart,
	filename: string,
	type = "application/zip"
) {
	const file = new Blob([data], { type: type });

	// Others
	const a = document.createElement("a"),
		url = URL.createObjectURL(file);
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	setTimeout(() => {
		document.body.removeChild(a);
		window.URL.revokeObjectURL(url);
	}, 0);
}

export function setupExportButtons(): void {
	const span: HTMLSpanElement | null = document.querySelector(
		"fieldset.ilTableFilter > span:nth-child(3)"
	);
	// util.js
	const jsonButton = util.createBlueButton("Export to JSON");
	// util.js
	const archiveButton = util.createBlueButton("Export to archive");
	jsonButton.addEventListener("click", exportJSONHandler);
	archiveButton.addEventListener("click", exportArchiveHandler);
	span?.append(archiveButton);
	span?.append(jsonButton);
}
