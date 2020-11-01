async function checkSettings() {
    const obj = await browser.storage.sync.get("margin");
    if (!obj["margin"]) {
        return 4;
    }
    return obj.margin;
}
