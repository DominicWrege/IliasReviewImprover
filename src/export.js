function getAssignmentName() {
    const select = document.querySelector(
        "div.ilTableFilterInput select#question"
    );
    const options = select.options;
    return options[select.selectedIndex].firstChild.textContent
        .replace(/\s/g, "")
        .split("(")[0];
}

async function exportArchiveHandler(event) {
    event.preventDefault();
    try {
        const rows = await downloadRowData();
        const zip = new JSZip();
        for (const row of rows) {
            zip.file(`${row.username}.txt`, row.answerText);
        }
        console.log(rows);
        const zipContent = await zip.generateAsync({ type: "blob" });
        createFile(zipContent, `${getAssignmentName()}.zip`);
    } catch (err) {
        console.error(err);
    }
}

async function exportJSONHandler(event) {
    event.preventDefault();
    try {
        const rows = await downloadRowData();
        createFile(
            JSON.stringify(rows),
            `${getAssignmentName() ?? ilias_export}.json`,
            "application/json"
        );
    } catch (err) {
        console.error(err);
    }
}

async function downloadRowData() {
    const data = getDataFromRows().map(async (row) => {
        const answerData = await downloadAnswer(row.answerLink);
        delete row.answerLink;
        return {
            ...row,
            answerText: parseAnswer(answerData).anwser.textContent,
        };
    });
    return await Promise.all(data);
}

function getDataFromRows() {
    let data = [];
    for (const tr of document.querySelectorAll("tr.tblrow1,tr.tblrow2")) {
        console.log();

        data.push({
            lastName: tr.children[0]?.textContent ?? "",
            firstName: tr.children[1]?.textContent ?? "",
            username: tr.children[2]?.textContent ?? "", 
            points: parseInt(tr.children[3]?.querySelector("div.form-inline > input").value ?? 0),
            answerLink: tr.children[4]?.firstElementChild ?? "",
        });
    }
    return data;
}

function createFile(data, filename, type = "application/zip") {
    const file = new Blob([data], { type: type });
    if (window.navigator.msSaveOrOpenBlob)
        // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else {
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
}

function setupExportButtons() {
    const span = document.querySelector(
        "fieldset.ilTableFilter > span:nth-child(3)"
    );
    const jsonButton = createBlueButton("Export to JSON");
    const archiveButton = createBlueButton("Export to archive");
    jsonButton.addEventListener("click", exportJSONHandler);
    archiveButton.addEventListener("click", exportArchiveHandler);
    span.append(archiveButton);
    span.append(jsonButton);
}
