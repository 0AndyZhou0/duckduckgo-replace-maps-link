let toolbarContainer = document.getElementById("react-duckbar");
let tabsContainer = null;

// wait until the tabs are loaded
const observer = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
        if (mutation.type === "childList") {
            for (let outerTab of mutation.addedNodes) {
                // console.log("Checking added node:", outerTab);
                
                // TODO: This runs multiple times when Maps is in the More submenu. Prevent this from running multiple times.
                if (outerTab.innerText === "Maps") {
                    // console.log("Found Maps tab:", outerTab);
                    updateOuterTabMapsLink(outerTab);
                    break;
                }

                if (outerTab.innerText.includes("Maps") && outerTab.innerText.includes("More")) {
                    // console.log("Found Maps tab in More submenu:", outerTab);
                    let currNode = outerTab;
                    while (currNode.hasChildNodes() && (currNode.innerText !== "Maps")) {
                        for (let child of currNode.childNodes) {
                            if (child.innerText && child.innerText.includes("Maps")) {
                                currNode = child;
                                break;
                            }
                        }
                    }
                    updateMapsLinkInMoreSubmenu(currNode);
                    break;
                }
            }
        }
    }
});

observer.observe(toolbarContainer, { childList: true, subtree: true });

function updateMapsLink(mapsTabContainer) {
    let newMapsTab = mapsTabContainer.cloneNode(true);

    const query = new URLSearchParams(window.location.search).get("q") || "";
    let mapsLink = `https://google.com/maps?q=${encodeURIComponent(query)}`;

    console.log("Updating Maps tab link to:", mapsLink);
    newMapsTab.href = mapsLink;
    console.log(newMapsTab);

    mapsTabContainer.parentNode.replaceChild(newMapsTab, mapsTabContainer);
}

function updateOuterTabMapsLink(outerTab) {
    let mapsTab = outerTab.firstChild;
    let newMapsTab = mapsTab.cloneNode(true);

    const query = new URLSearchParams(window.location.search).get("q") || "";
    let mapsLink = `https://google.com/maps?q=${encodeURIComponent(query)}`;
    
    console.log("Updating Maps tab link to:", mapsLink);
    newMapsTab.href = mapsLink;
    console.log(newMapsTab);

    outerTab.replaceChild(newMapsTab, mapsTab);
}

function updateMapsLinkInMoreSubmenu(mapsTabContainer) {
    let newMapsTab = mapsTabContainer.cloneNode(true);

    const query = new URLSearchParams(window.location.search).get("q") || "";
    let mapsLink = `https://google.com/maps?q=${encodeURIComponent(query)}`;

    let mapsLinkContainer = newMapsTab.getElementsByTagName("a")[0];
    console.log("Updating Maps tab in More submenu link to:", mapsLink);
    mapsLinkContainer.href = mapsLink;
    console.log(newMapsTab);

    mapsTabContainer.parentNode.replaceChild(newMapsTab, mapsTabContainer);
}