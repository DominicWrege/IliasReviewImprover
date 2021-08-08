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
import { setupExportButtons } from "./export";
import * as settings from "./settings";
let questionIntoTitleInserted = false;

main();


async function fixAllAnswers(widthStyle: string) {
	let links = document.querySelectorAll(
		"td.std > a.il_ContainerItemCommand[data-answer-href]"
	);

	let promises: any[] = [];
	links.forEach((a: Element) => {
		promises.push(replaceAnswerShowQuestion(a as HTMLAnchorElement, widthStyle));
	}
	);

	if (promises.length > 0) {
		try {
			await Promise.all(promises);
		} catch (err) {
			console.error("error:", err);
		}
		const loadingDiv = document.querySelector("div#loadingText");
		loadingDiv?.parentElement?.prepend(checkBoxFont());
		loadingDiv?.remove();
	}
}

async function handlerFixAnswers(event: Event): Promise<void> {
	event.preventDefault();
	event.stopPropagation();

	const loadingDiv: HTMLButtonElement | null = document.querySelector("div#loadingText");
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
		loading.setAttribute("style", "margin-right: 5em;display:none");
	}
	loading.id = "loadingText";
	loading.textContent = "loading...";
	return loading;
}

function fixButton(): HTMLInputElement {
	// util.js
	const button = util.createBlueButton("Show Answers");
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

function createAnswerDiv(answer: HTMLDivElement, widthStyle: string): HTMLDivElement {
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
	const questionElement: HTMLDivElement | null = html.querySelector("div.ilc_qtitle_Title");
	if (questionElement?.style) {
		questionElement.setAttribute(
			"background-color", "#fff;padding: 0.4em;margin: 0.5em 0 0.5em 0;");
		const titleH3: Element | null = document.querySelector("h3.ilTableHeaderTitle");
		titleH3?.parentElement?.appendChild(questionElement);
	}
	questionIntoTitleInserted = true;
}

async function replaceAnswerShowQuestion(linkElement: HTMLAnchorElement | null, widthStyle: string): Promise<void> {
	if (linkElement) {
		// util.js
		const parsedResponse = util.parseAnswer(await util.downloadAnswer(linkElement));
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
}

function checkBoxFont(): HTMLDivElement {
	const wrapper = document.createElement("div");
	wrapper.style.display = "inline";
	wrapper.style.marginRight = "2em";
	const input = document.createElement("input");
	input.type = "checkbox";
	input.id = "font-style";
	input.name = "font";
	input.addEventListener("click", toggleFont);
	const label = document.createElement("label");
	label.setAttribute("for", "font-sytle");
	label.style.paddingLeft = "1em";
	label.textContent = "Monospace";
	wrapper.appendChild(input);
	wrapper.appendChild(label);
	return wrapper;
}
function main(): void {
	const bar = document.querySelector(
		".ilTableCommandRowTop > div:nth-child(2)"
	);
	const tabActive = document.querySelector("#tab_manscoring.active");
	const mainTable = document.querySelector("tbody>tr>td.ilCenter");
	if (bar && tabActive && !mainTable) {
		setupExportButtons();
		bar.prepend(fixButton());
		bar.prepend(loadingText());
	}
}
