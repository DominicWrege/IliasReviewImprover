async function checkSettings() {
    const obj = await browser.storage.local.get("width");
    if (!obj["width"]) {
        return 37;
    }
    return obj.width;
}
