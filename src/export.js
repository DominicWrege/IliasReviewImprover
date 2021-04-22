console.log("1234");
//test();
function test() {
    // eslint-disable-next-line no-undef
    // var zip = new JSZip();
    // zip.file("Hello.txt", "Hello World\n");
    // zip.file("Hello222222.txt", "Hello\n");
    // var img = zip.folder("images");
    // console.log(img);
    // zip.generateAsync({ type: "blob" }).then((content) => {
    //     // see FileSaver.js
    //     console.log("s");
    //     console.log(content);
    //     //    download(content, "test.zip");
    // });
    exportHandler().then(console.lo^0g);
    console.log(getAssignmentName);
}

function getAssignmentName() {
    const select = document.querySelector(
        "div.ilTableFilterInput select#question"
    );
    const options = select.options;
    return options[select.selectedIndex].firstChild.textContent.replace(
        /\s/g,
        ""
    );
}

async function exportArchiveHandler(){
    let rows = await downloadRowData();
    const zip = new JSZip();
    for(const row of rows){
       zip.file(`${row.username}.txt`, row.answerText);
    }
    const zipContent = await zip.generateAsync({ type: "blob" });
    createFile(zipContent, `${getAssignmentName()}.zip`);
}

async function exportHandler() {
    let rows = await downloadRowData();
    createFile(JSON.stringify(rows), "test.json", (type = "application/json"));
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
    for (let tr of document.querySelectorAll("tr.tblrow1,tr.tblrow2")) {
        data.push({
            lastname: tr.children[0].textContent,
            firstname: tr.children[1].textContent,
            username: tr.children[2].textContent,
            answerLink: tr.children[4].firstElementChild,
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
    jsonButton.addEventListener("click", exportHandler);
    archiveButton.addEventListener("click", exportArchiveHandler);
    span.append(jsonButton);
}
