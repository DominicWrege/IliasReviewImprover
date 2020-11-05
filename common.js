async function checkSettings() {
    const obj = await browser.storage.local.get("width");
    if (!obj["width"]) {
        return 36;
    }
    return obj.width;
}
