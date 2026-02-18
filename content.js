let toolbarContainer = document.getElementById("react-duckbar");
let tabsContainer = null;

// wait until the tabs are loaded
const observer = new MutationObserver((mutations) => {
    let mapsTabExists = false;

    for (let mutation of mutations) {
        if (mutation.type === "childList") {
            for (let node of mutation.addedNodes) {
                if (node.innerText === "Maps") {
                    // console.log("Found Maps tab:", node);
                    mapsTabExists = true;
                    updateMapsLink(node);
                    break;
                }
            }
        }
        if (mapsTabExists) {
            break;
        }
    }
});

observer.observe(toolbarContainer, { childList: true, subtree: true });

function updateMapsLink(mapsTabContainer) {
    let mapsTab = mapsTabContainer.firstChild;
    let newMapsTab = mapsTab.cloneNode(true);

    const query = new URLSearchParams(window.location.search).get("q") || "";
    let mapsLink = `https://google.com/maps?q=${encodeURIComponent(query)}`;

    console.log("Updating Maps tab link to:", mapsLink);
    newMapsTab.href = mapsLink;
    console.log(newMapsTab);

    mapsTabContainer.replaceChild(newMapsTab, mapsTab);
}