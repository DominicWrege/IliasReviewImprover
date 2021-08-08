interface Answer {
    html: Document,
    answer: HTMLDivElement | null
}

export function parseAnswer(text: string): Answer {
    const html = new DOMParser().parseFromString(text, "text/html");
    return {
        html,
        answer: html.querySelector("div.ilc_qanswer_Answer"),
    };
}

export async function downloadAnswer(linkElement: HTMLAnchorElement | null): Promise<string> {

    const link = linkElement?.getAttribute("data-answer-href");

    let answerUrl = "";
    const origin = window.location.origin;
    // check if instance is ilias or openbook
    if (origin.includes("openbook.")) {
        answerUrl = `${origin}/${link}`;
    } else { //ilias
        answerUrl = `${origin}/ilias/${link}`;
    }
    let response = await fetch(`${answerUrl}`);

    if (!response.ok) {
        throw new Error(`Util.js: Error while download the answer : answerUrl = ${answerUrl}`);
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

