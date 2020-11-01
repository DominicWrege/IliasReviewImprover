let marginStyle = "a";

async function replaceAnswer(linkElement) {
    if (linkElement) {
        const answerLink = linkElement.getAttribute("data-answer-href");
        const resp = await fetch(
            `https://www.ilias.fh-dortmund.de/ilias/${answerLink}`
        );
        if (resp.ok) {
            const txt = await resp.text();
            const respHtml = new DOMParser().parseFromString(txt, "text/html");
            const answerTd = respHtml.querySelector("div.ilc_qanswer_Answer");

            if (answerTd) {
                const div = document.createElement("div");
                div.style.marginRight = marginStyle;
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
    let links = document.querySelectorAll(
        "td.std > a.il_ContainerItemCommand[data-answer-href]"
    );

    let promises = [];
    for (const a of links) {
        promises.push(replaceAnswer(a));
    }
    if (promises.length > 0) {
        Promise.all(promises)
            .then(() => console.log("DONE!"))
            .catch(console.error);
    }
}

// //fixAnswersMain();
checkSettings().then((margin) => {
    marginStyle = `${margin}em`;
    const bar = document.querySelector(
        ".ilTableCommandRowTop > div:nth-child(2)"
    );
    const tabActive = document.querySelector("#tab_manscoring.active");
    if (bar && tabActive) {
        const btn = document.createElement("button");
        btn.classList = ["btn", "btn-default"];
        btn.textContent = "Show All Answers";
        btn.style.marginRight = "16px";
        btn.addEventListener("click", fixAnswersMain);
        bar.prepend(btn);
    }
});
