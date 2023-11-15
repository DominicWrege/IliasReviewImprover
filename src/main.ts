/*

	What is the "improve button doing"?
    
	1. Get all the a elmenets who are just links to the answers from the table
	2. Extract the url from the a element 
	3. Fetch the annswer
	4. Parse the html from the response
	4. Replace the a element with a div containing the fecthed answer
	5. Do it only once: Insert the question into the title
*/

import * as util from "./util";
import * as settings from "./settings";

// -------- start point -------
function main(): void {
	const tabActive = document.querySelector("ul#ilTab>li#tab_manscoring");
	if (tabActive) {
		const tableBar = getTableBar();
		if (tableBar && tableIsNotEmpty()) {
			// setupExportButtons();
			tableBar.append(fixButton());
			tableBar.append(loadingText());
		}
	}
}

let questionIntoTitleInserted = false;
main();
// -------- start point -------

function tableIsNotEmpty(): boolean {
	return !document.querySelector("tbody>tr>td.ilCenter");
}

function getTableBar(): Element | null {
	return document.querySelector("fieldset.ilTableFilter > span");
}

async function fixAllAnswers(widthStyle: string) {
	let links = document.querySelectorAll(
		"td.std > a.il_ContainerItemCommand[data-answer-href]"
	);

	let promises: any[] = [];
	links.forEach((a: Element) => {
		promises.push(
			replaceAnswerShowQuestion(a as HTMLAnchorElement, widthStyle)
		);
	});

	if (promises.length > 0) {
		try {
			await Promise.all(promises);
		} catch (err) {
			console.error("error:", err);
		}
		const loadingDiv = document.querySelector(
			"div#loadingText"
		) as HTMLElement | null;

		loadingDiv?.parentElement?.append(checkBoxFont());
		loadingDiv?.remove();
	}
}

async function handlerFixAnswers(event: Event): Promise<void> {
	event.preventDefault();
	event.stopPropagation();

	const loadingDiv: HTMLButtonElement | null =
		document.querySelector("div#loadingText");
	if (loadingDiv) {
		loadingDiv.style.display = "inline-block";
	}
	document.querySelector("input#ImproveReview")?.remove();
	// settings.js
	await fixAllAnswers(`${await settings.load()}rem`);
}

function loadingText(): HTMLDivElement {
	const loading: HTMLDivElement | null = document.createElement("div");
	if (loading) {
		loading.style.display = "none";
		loading.style.marginRight = "3em";
		loading.style.marginBottom = "1.25em";
		loading.style.fontWeight = "bold";
		loading.style.marginLeft = "12px";
	}
	loading.id = "loadingText";
	loading.textContent = "loading...";
	return loading;
}

function fixButton(): HTMLInputElement {
	// util.js
	const button = util.createBlueButton("Antworten anzeigen");
	button.style.marginBottom = "1.25em";
	button.id = "ImproveReview";
	button.addEventListener("click", handlerFixAnswers);
	return button;
}

function toggleFont(event: Event): void {
	const checkbox = event.target as HTMLInputElement;
	const answers = document.querySelectorAll(
		"td.std div div.ilc_qanswer_Answer.solutionbox"
	);

	answers.forEach((element: any) => {
		if (checkbox.checked) {
			element.style.fontFamily = `Courier, Monaco, monospace`;
		} else {
			element.style.fontFamily = "";
		}
	});
}

function createAnswerDiv(
	answer: HTMLDivElement,
	widthStyle: string
): HTMLDivElement {
	const div = document.createElement("div");
	div.style.width = widthStyle;
	div.style.padding = "0";
	div.style.background = "#FFF !important";
	answer.style.border = "none";
	// div.style.maxWidth = "700px !important";
	answer.style.color = "black";
	div.appendChild(answer);
	return div;
}

function insertQuestionIntoTitle(html: Document): void {
	const questionElement: HTMLDivElement | null = html.querySelector(
		"div.ilc_qtitle_Title"
	);
	if (questionElement) {
		questionElement.setAttribute(
			"style",
			`background: #fff;
			 padding: 1rem 1.75rem;
			 margin: 0.75em 0;
			 width: 80%;
			 max-width: 850px;`
		);
		let title: Element | null = document.querySelector(
			"div.ilTableHeaderTitle"
		);
		if (!title) {
			title = document.querySelector("h3.ilTableHeaderTitle");
			title?.parentElement?.appendChild(questionElement);
		} else {
			title?.appendChild(questionElement);
		}
	}
	questionIntoTitleInserted = true;
}

async function replaceAnswerShowQuestion(
	linkElement: HTMLAnchorElement | null,
	widthStyle: string
): Promise<void> {
	if (!linkElement) {
		return;
	}
	// util.js
	const parsedResponse = util.parseAnswer(
		await util.downloadAnswer(linkElement)
	);
	if (parsedResponse.answer) {
		linkElement?.parentElement?.replaceChild(
			createAnswerDiv(parsedResponse.answer, widthStyle),
			linkElement
		);
	} else {
		throw "Ilias error :/";
	}
	if (!questionIntoTitleInserted) {
		insertQuestionIntoTitle(parsedResponse.html);
	}
}

function checkBoxFont(): HTMLDivElement {
	const wrapper = document.createElement("div");
	wrapper.style.display = "inline";
	wrapper.style.marginRight = "2em";
	const input = document.createElement("input");
	input.type = "checkbox";
	input.style.marginLeft = "10px";
	input.id = "font-style";
	input.name = "font";
	input.addEventListener("click", toggleFont);
	const label = document.createElement("label");
	label.setAttribute("for", "font-sytle");
	label.style.paddingLeft = "0.75em";
	label.textContent = "Monospace";
	wrapper.appendChild(input);
	wrapper.appendChild(label);
	return wrapper;
}
