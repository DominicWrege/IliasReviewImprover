let questionExtract = false;

async function replaceAnswer(linkElement, widthStyle) {
    if (linkElement) {
        const answerLink = linkElement.getAttribute("data-answer-href");
        const resp = await fetch(
            `https://www.ilias.fh-dortmund.de/ilias/${answerLink}`
        );
        if (resp.ok) {
            const txt = await resp.text();
            const respHtml = new DOMParser().parseFromString(txt, "text/html");

            if (questionExtract === false) {
                const question = respHtml.querySelector(
                    ".ilc_qtitle_Title > p:nth-child(1)"
                ).textContent;
                const titleH3 = document.querySelector("h3.ilTableHeaderTitle");
                const questionDiv = document.createElement("div");
                questionDiv.textContent = question;
                const br = document.createElement("br");
                titleH3.appendChild(br);
                titleH3.appendChild(questionDiv);

                const assignmentNode = respHtml.querySelector(
                    ".ilc_qtitle_Title > p:nth-child(2)"
                );
                if (assignmentNode) {
                    const assignmentP = document.createElement("p");
                    const b = document.createElement("b");
                    const assignmentText = assignmentNode.textContent;
                    b.textContent = assignmentText;
                    assignmentP.appendChild(b);
                    titleH3.parentElement.appendChild(assignmentP);
                }
                questionExtract = true;
            }
            const answerTd = respHtml.querySelector("div.ilc_qanswer_Answer");
            if (answerTd) {
                const div = document.createElement("div");
                div.style.width = widthStyle;
                div.style.maxWidth = "460px";
                div.textContent = answerTd.textContent;
                linkElement.parentElement.replaceChild(div, linkElement);
            }
        } else {
            throw "Ilias error :/"; // best err handling!
        }
    }
}

function fixAnswersMain(e) {
    e.preventDefault();
    e.stopPropagation();

    const loadingDiv = document.querySelector("div#loadingText");
    loadingDiv.style.display = "inline-block";
    const showAllAnswersBtn = document.querySelector(
        "button#ShowAllAnswersBtn"
    );
    showAllAnswersBtn.hidden = true;
    checkSettings().then((width) => {
        let promises = [];
        const widthStyle = `${width}rem`;
        let links = document.querySelectorAll(
            "td.std > a.il_ContainerItemCommand[data-answer-href]"
        );
        for (const a of links) {
            promises.push(replaceAnswer(a, widthStyle));
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

if (bar && tabActive) {
    const btn = document.createElement("button");
    btn.classList = ["btn", "btn-default"];
    btn.id = "ShowAllAnswersBtn";
    btn.textContent = "Show All Answers";
    btn.style.marginRight = "16px";
    btn.addEventListener("click", fixAnswersMain);
    const loading = document.createElement("div");

    loading.style = "margin-right: 5em;display:none";
    loading.id = "loadingText";
    loading.textContent = "loading...";
    bar.prepend(loading);
    bar.prepend(btn);
}
