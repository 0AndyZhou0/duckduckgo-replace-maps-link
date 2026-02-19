const googleMapsSearchUrl = "https://google.com/maps?q=";
const googleMapsDirectionUrl = "https://google.com/maps/dir/?api=1&destination=";

let toolbarContainer = document.getElementById("react-duckbar");
let tabsContainer = null;

// Replace Maps in tab bar
const mapsTabObserver = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
        if (mutation.type === "childList") {
            for (let outerTab of mutation.addedNodes) {
                if (outerTab.innerText === "Maps") {
                    // console.log("Found Maps tab:", outerTab);
                    updateOuterTabMapsLink(outerTab);
                }

                if (outerTab.innerText && outerTab.innerText.includes("Maps") && outerTab.innerText.includes("More")) {
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
                }
            }
        }
    }
});
// Changes link in tab bar
mapsTabObserver.observe(toolbarContainer, { childList: true, subtree: true });


// Replace links in interactive map and directions button
let duckduckgoSearchBody = document.getElementById("react-layout");
let interactiveMapContainer = null;
console.log("Found DuckDuckGo search body:", duckduckgoSearchBody);
// For the interactive map and directions button
const findInteractiveMapObserver = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
        if (mutation.type === "childList") {
            for (let bodyNode of mutation.addedNodes) {
                if (bodyNode.getAttribute("data-react-module-id") === "maps_maps") {
                    // console.log("Found interactive map:", bodyNode);
                    interactiveMapContainer = bodyNode;
                    waitForInteractiveMap(bodyNode);
                }
            }
        }
    }
});
findInteractiveMapObserver.observe(duckduckgoSearchBody, { childList: true, subtree: true });

function waitForInteractiveMap(interactiveMapContainer) {
    interactiveMapObserver.observe(interactiveMapContainer, { childList: true, subtree: true });
    findInteractiveMapObserver.disconnect();
}

const interactiveMapObserver = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
        if (mutation.type === "childList") {
            for (let mapNode of mutation.addedNodes) {
                if (mapNode.tagName === "IMG") {
                    // TODO: maybe find a better way to check if map is fully loaded
                    // console.log("Found interactive map image element:", mapNode); // Seems to be the last element added
                    updateInteractiveMap(interactiveMapContainer);
                    break;
                }
            }
        }
    }
});

function updateMapsLink(mapsTabContainer) {
    let newMapsTab = mapsTabContainer.cloneNode(true);

    const query = new URLSearchParams(window.location.search).get("q") || "";
    let mapsLink = `${googleMapsSearchUrl}${encodeURIComponent(query)}`;

    console.log("Updating Maps tab link to:", mapsLink);
    newMapsTab.href = mapsLink;
    console.log(newMapsTab);

    mapsTabContainer.parentNode.replaceChild(newMapsTab, mapsTabContainer);

    mapsTabObserver.disconnect();
}

function updateOuterTabMapsLink(outerTab) {
    let mapsTab = outerTab.firstChild;
    let newMapsTab = mapsTab.cloneNode(true);

    const query = new URLSearchParams(window.location.search).get("q") || "";
    let mapsLink = `${googleMapsSearchUrl}${encodeURIComponent(query)}`;
    
    console.log("Updating Maps tab link to:", mapsLink);
    newMapsTab.href = mapsLink;
    console.log(newMapsTab);

    outerTab.replaceChild(newMapsTab, mapsTab);

    mapsTabObserver.disconnect();
}

function updateMapsLinkInMoreSubmenu(mapsTabContainer) {
    let newMapsTab = mapsTabContainer.cloneNode(true);

    const query = new URLSearchParams(window.location.search).get("q") || "";
    let mapsLink = `${googleMapsSearchUrl}${encodeURIComponent(query)}`;

    let mapsLinkContainer = newMapsTab.getElementsByTagName("a")[0];
    console.log("Updating Maps tab in More submenu link to:", mapsLink);
    mapsLinkContainer.href = mapsLink;
    console.log(newMapsTab);

    mapsTabContainer.parentNode.replaceChild(newMapsTab, mapsTabContainer);

    mapsTabObserver.disconnect();
}

function updateInteractiveMap(outerNode) {
    let interactiveMap = outerNode.firstChild.firstChild;
    if (!interactiveMap) {
        console.log("Could not find interactive map element inside:", outerNode);
        return;
    }
    let newInteractiveMap = interactiveMap.cloneNode(true);

    const query = new URLSearchParams(window.location.search).get("q") || "";
    let mapsLink = `${googleMapsSearchUrl}${encodeURIComponent(query)}`;
    let directionsLink = `${googleMapsDirectionUrl}${encodeURIComponent(query)}`;

    console.log("Updating interactive map links to:", mapsLink, directionsLink);
    let expandButton = newInteractiveMap.querySelector("a");
    let directionsButton = newInteractiveMap.querySelector("button");
    newInteractiveMap.addEventListener("click", (e) => {
        e.preventDefault();
        if (e.target.tagName === "BUTTON") {
            window.open(directionsLink, "_self");
        } else {
            window.open(mapsLink, "_self");
        }
    });
    console.log("Updating interactive map expand button", mapsLink);
    expandButton.href = mapsLink;
    console.log(newInteractiveMap);

    interactiveMap.parentNode.replaceChild(newInteractiveMap, interactiveMap);

    findInteractiveMapObserver.disconnect();
}