/*

	What is the "improve button doing"?
    
	1. Get all the a elmenets who are just links to the answers from the table
	2. Extract the url from the a element 
	3. Fetch the annswer
	4. Parse the html from the response
	4. Replace the a element with a div containing the fecthed answer
	5. Do it only once: Insert the question into the title
*/
import * as settings from "./settings";

// -------- start point -------
function main(): void {
	const tabActive = document.querySelector("ul#ilTab>li#tab_manscoring");
	if (tabActive) {
		const tableBar = getTableBar();
		if (tableBar && tableIsNotEmpty()) {
			// setupExportButtons();
			tableBar.append(fixButton());
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
	customAlert("⏳ Bitte warten ... ", 4000);
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
			customAlert("Antworten wurden geladen 🚀", 1700);
		} catch (err: any) {
			console.error("error:", err);
			customAlert(err?.message, 4000);
		}
	}
}

async function handlerFixAnswers(event: Event): Promise<void> {
	event.preventDefault();
	event.stopPropagation();

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
	loading.textContent = "Bitte warten...";
	return loading;
}

function fixButton(): HTMLInputElement {
	const button = createBlueButton("Antworten anzeigen");
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
	const bodyText = await downloadAnswer(linkElement);
	const tr = linkElement.parentElement?.parentElement;

	const parsedResponse = parseAnswer(bodyText);
	if (parsedResponse.html && tr) {
		addRatingInput(parsedResponse.html, tr);
	}

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

function beforeUnloadListener(e: any) {
	e.returnValue = null;
}

function addRatingInput(doc: Document, tr: HTMLElement): void {
	const modalForm = doc?.querySelector("form#form_") as HTMLFormElement;

	const scoreTd = tr.querySelector(
		'[class^="reached_points"]'
	) satisfies HTMLElement | null;

	if (!scoreTd || !modalForm) {
		return;
	}

	const selectorsHide = [
		"textarea.form-control",
		"div.checkbox",
		"div.ilFormHeader",
		"div.ilFormFooter",
		"div.form-group",
	];

	const form = modalForm.cloneNode(true) as HTMLFormElement;

	for (const item of selectorsHide) {
		const element = form.querySelector(item) as HTMLElement | null;
		if (!element) {
			continue;
		}
		element.style.display = "none";
	}

	form
		.querySelectorAll("label")
		.forEach((item: HTMLElement) => (item.style.display = "none"));

	scoreTd.innerHTML = "";
	scoreTd.appendChild(form);

	form.addEventListener("submit", async (event) => {
		event.preventDefault();

		const actionUrl = new URL(form.action);
		const actionQueryParams = new URLSearchParams(actionUrl.search);

		const queryParams = new URLSearchParams({
			ref_id: actionQueryParams.get("ref_id")!,
			cmd: "checkConstraintsBeforeSaving",
			cmdClass: "iltestscoringbyquestionsgui",
			cmdNode: actionQueryParams.get("cmdNode")!,
			baseClass: "ilRepositoryGUI",
			cmdMode: "asynch",
		});

		const url = `${location.origin}${
			location.pathname
		}?${queryParams.toString()}`;

		try {
			const response = await fetch(url, {
				body: new FormData(form),
				method: "post",
			});

			if (response?.ok) {
				customAlert("✅ Gespeichert!");
			}
		} finally {
			window.removeEventListener("beforeunload", beforeUnloadListener);
		}
	});
}

function customAlert(message: string, time = 2000): void {
	const existingAlert = document.querySelector(".custom-alert");
	if (existingAlert) {
		document.body.removeChild(existingAlert);
	}
	const alertContainer = document.createElement("div");
	alertContainer.textContent = message;

	alertContainer.className = "custom-alert";
	Object.assign(alertContainer.style, {
		position: "fixed",
		top: "2em",
		left: "50%",
		transform: "translateX(-50%)",
		backgroundColor: "#f0f0f0",
		color: "#000",
		padding: "10px",
		borderRadius: "5px",
		boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
		zIndex: "9999",
		transition: "opacity 0.3s ease-in-out",
		opacity: "0",
	});

	document.body.appendChild(alertContainer);
	alertContainer.offsetHeight;
	alertContainer.style.opacity = "1";
	setTimeout(() => {
		// Set opacity to 0 to initiate the fade-out transition
		alertContainer.style.opacity = "0";
	}, time - 250); //

	setTimeout(() => {
		document.body.removeChild(alertContainer);
	}, time); // Remove the al
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

interface Answer {
	html: Document;
	answer: HTMLDivElement | null;
}

function parseAnswer(text: string): Answer {
	const html = new DOMParser().parseFromString(text, "text/html");
	return {
		html,
		answer: html.querySelector("div.ilc_qanswer_Answer"),
	};
}

function formatAnswerLink(linkPart: string): string {
	if (location.pathname.includes("/ilias/")) {
		return `${window.location.origin}/ilias/${linkPart}`;
	}
	return `${window.location.origin}/${linkPart}`;
}

async function downloadAnswer(
	linkElement: HTMLAnchorElement | null
): Promise<string> {
	const targetLink = linkElement?.getAttribute("data-answer-href");

	if (!targetLink) {
		throw "no data-answer-href found";
	}

	const answerUrl = formatAnswerLink(targetLink);
	const response = await fetch(answerUrl);

	if (!response.ok) {
		throw new Error(
			`Util.js: Error while download the answer : answerUrl = ${answerUrl}`
		);
	}
	return response.text();
}

function createBlueButton(text: string): HTMLInputElement {
	const button = document.createElement("input");
	button.type = "submit";
	button.classList.add("btn-default");
	button.classList.add("btn");
	button.value = text;
	button.style.marginLeft = "0.35em";
	return button;
}
