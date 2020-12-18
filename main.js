/*

   Explanation:

    1. Get all the a elmenets who are just links to the answers from the table
    2. Extract the url from the a element 
    3. Fetch the annswer
    4. Parse the html from the response
    4. Replace the a element with a div containing the fecthed answer
    5. Do it only once: Insert the question into the title

*/

function fixAnswersMain(e) {
    e.preventDefault();
    e.stopPropagation();

    const loadingDiv = document.querySelector("div#loadingText");
    loadingDiv.style.display = "inline-block";
    const showAllAnswersBtn = document.querySelector("button#ImproveReview");
    showAllAnswersBtn.hidden = true;
    checkSettings().then((width) => {
        let promises = [];
        const widthStyle = `${width}rem`;
        let links = document.querySelectorAll(
            "td.std > a.il_ContainerItemCommand[data-answer-href]"
        );
        for (const a of links) {
            promises.push(replaceAnswerShowQuestion(a, widthStyle));
        }
        if (promises.length > 0) {
            showAllAnswersBtn.hidden = true;
            Promise.all(promises)
                .then(() => {
                    loadingDiv.remove();
                    showAllAnswersBtn.remove();
                })
                .catch(console.error);
        }
    });
}

const bar = document.querySelector(".ilTableCommandRowTop > div:nth-child(2)");
const tabActive = document.querySelector("#tab_manscoring.active");
let questionIntoTitleInserted = false;
if (bar && tabActive) {
    const btn = document.createElement("button");
    btn.classList = ["btn", "btn-default"];
    btn.id = "ImproveReview";
    btn.textContent = "Improve Review";
    btn.style.marginRight = "16px";
    btn.addEventListener("click", fixAnswersMain);
    const loading = document.createElement("div");

    loading.style = "margin-right: 5em;display:none";
    loading.id = "loadingText";
    loading.textContent = "loading...";
    bar.prepend(loading);
    bar.prepend(btn);
}


async function downloadAnswer(linkElement) {
    const link = linkElement.getAttribute("data-answer-href");
    let response = await fetch(
        `${this.window.location.origin}/ilias/${link}`
    );
    if (!response.ok) {
        throw new Error("Error while download the answer")
    }
    return response.text();
}

function parseAnswer(text) {
    const html = new DOMParser().parseFromString(text, "text/html");
    return {
        html: html,
        anwserText: html.querySelector("div.ilc_qanswer_Answer").textContent
    }
}

function createAnswerDiv(textContent, widthStyle) {
    const div = document.createElement("div");
    div.style.width = widthStyle;
    div.style.maxWidth = "460px";
    div.textContent = textContent
    return div;
}

function insertQuestionIntoTitle(html) {
    const questionElement = html.querySelector(
        "div.ilc_qtitle_Title"
    );
    questionElement.style =
        "background-color: #fff;padding: 0.4em;margin: 0.5em 0 0.5em 0;";
    const titleH3 = document.querySelector("h3.ilTableHeaderTitle");
    titleH3.parentElement.appendChild(questionElement);
    questionIntoTitleInserted = true;

}

async function replaceAnswerShowQuestion(linkElement, widthStyle) {
    if (linkElement) {
        const parsedResponse = parseAnswer(await downloadAnswer(linkElement));
        if (parsedResponse.anwserText != null && parsedResponse.anwserText != undefined) {
            linkElement.parentElement.replaceChild(
                createAnswerDiv(parsedResponse.anwserText, widthStyle),
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
