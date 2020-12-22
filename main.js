/*

   Explanation:

    1. Get all the a elmenets who are just links to the answers from the table
    2. Extract the url from the a element 
    3. Fetch the annswer
    4. Parse the html from the response
    4. Replace the a element with a div containing the fecthed answer
    5. Do it only once: Insert the question into the title

*/
let questionIntoTitleInserted = false;
main();

async function handlerFixAnswers(event) {
    event.preventDefault();
    event.stopPropagation();

    const loadingDiv = document.querySelector("div#loadingText");
    loadingDiv.style.display = "inline-block";
    const showAllAnswersBtn = document.querySelector("button#ImproveReview");
    showAllAnswersBtn.hidden = true;
    await fixAllAnswers(`${await checkSettings()}rem`);
}

async function fixAllAnswers(widthStyle) {
    let links = document.querySelectorAll(
        "td.std > a.il_ContainerItemCommand[data-answer-href]"
    );
    let promises = [];
    for (const a of links) {
        promises.push(replaceAnswerShowQuestion(a, widthStyle));
    }
    if (promises.length > 0) {
        try {
            await Promise.all(promises);
        } catch (err) {
            console.error(err);
        }
        loadingDiv.parentElement.prepend(checkBoxFont());
        loadingDiv.remove();
        showAllAnswersBtn.remove();
    }
}

function main() {
    const bar = document.querySelector(
        ".ilTableCommandRowTop > div:nth-child(2)"
    );
    const tabActive = document.querySelector("#tab_manscoring.active");
    if (bar && tabActive) {
        bar.prepend(fixButton());
        bar.prepend(loadingText());
    }
}

function loadingText() {
    const loading = document.createElement("div");
    loading.style = "margin-right: 5em;display:none";
    loading.id = "loadingText";
    loading.textContent = "loading...";
    return loading;
}

function fixButton() {
    const btn = document.createElement("button");
    btn.classList = ["btn", "btn-default"];
    btn.id = "ImproveReview";
    btn.textContent = "Improve Review";
    btn.style.marginRight = "16px";
    btn.addEventListener("click", handlerFixAnswers);
    return btn;
}

function toogleFont(event) {
    const checkbox = event.target;
    const answers = document.querySelectorAll(
        "td.std div div.ilc_qanswer_Answer.solutionbox"
    );

    for (const element of answers)
        if (checkbox.checked) {
            element.style.fontFamily = `Courier, Monaco, monospace`;
        } else {
            element.style.fontFamily = "";
        }
}

async function downloadAnswer(linkElement) {
    const link = linkElement.getAttribute("data-answer-href");
    let response = await fetch(`${this.window.location.origin}/ilias/${link}`);
    if (!response.ok) {
        throw new Error("Error while download the answer");
    }
    return response.text();
}

function parseAnswer(text) {
    const html = new DOMParser().parseFromString(text, "text/html");
    return {
        html: html,
        anwser: html.querySelector("div.ilc_qanswer_Answer"),
    };
}

function createAnswerDiv(anwser, widthStyle) {
    const div = document.createElement("div");
    div.style.width = widthStyle;
    div.style.padding = 0;
    div.style.background = "#FFF !important";
    anwser.style.border = "none";
    div.style.maxWidth = "500px";
    anwser.style.color = "black";
    div.appendChild(anwser);
    return div;
}

function insertQuestionIntoTitle(html) {
    const questionElement = html.querySelector("div.ilc_qtitle_Title");
    questionElement.style =
        "background-color: #fff;padding: 0.4em;margin: 0.5em 0 0.5em 0;";
    const titleH3 = document.querySelector("h3.ilTableHeaderTitle");
    titleH3.parentElement.appendChild(questionElement);
    questionIntoTitleInserted = true;
}

async function replaceAnswerShowQuestion(linkElement, widthStyle) {
    if (linkElement) {
        const parsedResponse = parseAnswer(await downloadAnswer(linkElement));
        if (parsedResponse.anwser) {
            linkElement.parentElement.replaceChild(
                createAnswerDiv(parsedResponse.anwser, widthStyle),
                //parsedResponse.anwser,
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

function checkBoxFont() {
    const wrapper = document.createElement("div");
    wrapper.style.display = "inline";
    wrapper.style.marginRight = "2em";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = "font-style";
    input.name = "font";
    input.addEventListener("click", toogleFont);
    const label = document.createElement("label");
    label.for = "font-sytle";
    label.style.paddingLeft = "1em";
    label.textContent = "Monospace";
    wrapper.appendChild(input);
    wrapper.appendChild(label);
    return wrapper;
}
