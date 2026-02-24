const toggleEnabledButton = document.getElementById("enable-duckdduckgo-map-link-changer");

// Load the current setting and update the toggle state
chrome.storage.sync.get("duckduckgoMapLinkChangerEnabled", (result) => {
    // console.log("Retrieved duckduckgoMapLinkChangerEnabled setting:", result.duckduckgoMapLinkChangerEnabled);
    if (result.duckduckgoMapLinkChangerEnabled === undefined) {
        toggleEnabledButton.checked = true;
        chrome.storage.sync.set({ duckduckgoMapLinkChangerEnabled: true });
    }
    toggleEnabledButton.checked = result.duckduckgoMapLinkChangerEnabled;
});

toggleEnabledButton.addEventListener("change", () => {
    const isEnabled = toggleEnabledButton.checked;
    chrome.storage.sync.set({ duckduckgoMapLinkChangerEnabled: isEnabled }, () => {
        console.log(`DuckDuckGo Map Link Changer has been ${isEnabled ? "enabled" : "disabled"}.`);
    });
});