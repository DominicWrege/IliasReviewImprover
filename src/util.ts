interface Answer {
	html: Document;
	answer: HTMLDivElement | null;
}

export function parseAnswer(text: string): Answer {
	const html = new DOMParser().parseFromString(text, "text/html");
	return {
		html,
		answer: html.querySelector("div.ilc_qanswer_Answer"),
	};
}

function formatAnswerLink(linkPart: string): string {
	if (location.pathname.includes("/ilias/")) {
		`${window.location.origin}${linkPart}${linkPart}`;
	}
	return `${window.location.origin}/${linkPart}`;
}

export async function downloadAnswer(
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

export function createBlueButton(text: string): HTMLInputElement {
	const button = document.createElement("input");
	button.type = "submit";
	button.classList.add("btn-default");
	button.classList.add("btn");
	button.value = text;
	button.style.marginLeft = "0.35em";
	return button;
}
