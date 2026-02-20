const googleMapsSearchUrl = "https://google.com/maps?q=";
const googleMapsDirectionUrl = "https://google.com/maps/dir/?api=1&destination=";


// Replace Maps in tab bar
const mapsTabObserver = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
        if (mutation.type === "childList") {
            for (let outerTab of mutation.addedNodes) {
                if (outerTab.nodeType !== Node.ELEMENT_NODE) {
                    continue;
                }
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
let toolbarContainer = document.getElementById("react-duckbar");
mapsTabObserver.observe(toolbarContainer, { childList: true, subtree: true });


// Replace links in interactive map and directions button
let duckduckgoSearchBody = document.getElementById("react-layout");
// console.log("Found DuckDuckGo search body:", duckduckgoSearchBody);
// For the interactive map and directions button
const findInteractiveMapObserver = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
        if (mutation.type === "childList") {
            for (let bodyNode of mutation.addedNodes) {
                if (bodyNode.nodeType !== Node.ELEMENT_NODE) {
                    continue;
                }
                // console.log("Checking added node for interactive map:", bodyNode);
                if (bodyNode.className === "react-module" && bodyNode.getAttribute("data-react-module-id") === "maps_maps") {
                    // console.log("Found simple map container (no description, no editing):", bodyNode);
                    waitForSimpleMap(bodyNode);
                }
                if (bodyNode.className === "mk-map-node-element") {
                    let directionsInteractiveMap = bodyNode.closest("[class=\"react-module\"]");
                    // console.log("Found interactive directions map container", directionsInteractiveMap);
                    updateDirectionsInteractiveMap(directionsInteractiveMap);
                }
                if (bodyNode.getAttribute("data-testid") === "about-map") {
                    let blurbInteractiveMap = bodyNode.closest("[class=\"react-module\"]");
                    // console.log("Found info blurb map container:", blurbInteractiveMap);
                }
            }
        }
    }
});
findInteractiveMapObserver.observe(duckduckgoSearchBody, { childList: true, subtree: true });

function waitForSimpleMap(mapContainer) {
    simpleMapObserver.observe(mapContainer, { childList: true, subtree: true });
    findInteractiveMapObserver.disconnect();
}

const simpleMapObserver = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
        if (mutation.type === "childList") {
            for (let mapNode of mutation.addedNodes) {
                if (mapNode.nodeType !== Node.ELEMENT_NODE) {
                    continue;
                }
                if (mapNode.querySelector("a") && mapNode.querySelector("button")) {
                    console.log("Found interactive map image element:", mapNode); // Seems to be the last element added
                    updateSimpleMap(mapNode);
                    break;
                }
            }
        }
    }
});

function updateMapsLink(mapsTabContainer) {
    mapsTabObserver.disconnect();

    let newMapsTab = mapsTabContainer.cloneNode(true);

    const query = new URLSearchParams(window.location.search).get("q") || "";
    let mapsLink = `${googleMapsSearchUrl}${encodeURIComponent(query)}`;

    console.log("Updating Maps tab link to:", mapsLink);
    newMapsTab.href = mapsLink;
    // console.log(newMapsTab);

    mapsTabContainer.parentNode.replaceChild(newMapsTab, mapsTabContainer);
}

function updateOuterTabMapsLink(outerTab) {
    mapsTabObserver.disconnect();

    let mapsTab = outerTab.getElementsByTagName("a")[0];
    let newMapsTab = mapsTab.cloneNode(true);

    const query = new URLSearchParams(window.location.search).get("q") || "";
    let mapsLink = `${googleMapsSearchUrl}${encodeURIComponent(query)}`;
    
    console.log("Updating Maps tab link to:", mapsLink);
    newMapsTab.href = mapsLink;
    // console.log(newMapsTab);

    outerTab.replaceChild(newMapsTab, mapsTab);
}

function updateMapsLinkInMoreSubmenu(mapsTabContainer) {
    mapsTabObserver.disconnect();

    let newMapsTab = mapsTabContainer.cloneNode(true);

    const query = new URLSearchParams(window.location.search).get("q") || "";
    let mapsLink = `${googleMapsSearchUrl}${encodeURIComponent(query)}`;

    let mapsLinkContainer = newMapsTab.getElementsByTagName("a")[0];
    console.log("Updating Maps tab in More submenu link to:", mapsLink);
    mapsLinkContainer.href = mapsLink;
    // console.log(newMapsTab);

    mapsTabContainer.parentNode.replaceChild(newMapsTab, mapsTabContainer);
}

function updateSimpleMap(outerNode) {
    simpleMapObserver.disconnect();

    let simpleMap = outerNode.firstChild;
    if (!simpleMap) {
        console.log("Could not find simple map element inside:", outerNode);
        return;
    }
    let newSimpleMap = simpleMap.cloneNode(true);

    const query = new URLSearchParams(window.location.search).get("q") || "";
    let mapsLink = `${googleMapsSearchUrl}${encodeURIComponent(query)}`;
    let directionsLink = `${googleMapsDirectionUrl}${encodeURIComponent(query)}`;

    console.log("Updating simple map links to:", mapsLink, directionsLink);
    let expandButton = newSimpleMap.querySelector("a");
    let directionsButton = newSimpleMap.querySelector("button");
    newSimpleMap.addEventListener("click", (e) => {
        e.preventDefault();
        if (e.target.tagName === "BUTTON") {
            window.open(directionsLink, "_self");
        } else {
            window.open(mapsLink, "_self");
        }
    });
    console.log("Updating simple map expand button", mapsLink);
    expandButton.href = mapsLink;
    console.log(newSimpleMap);

    simpleMap.parentNode.replaceChild(newSimpleMap, simpleMap);
}

function updateDirectionsInteractiveMap(outerNode) {
    findInteractiveMapObserver.disconnect();
    
    let mapCanvas = outerNode.querySelector("canvas");
    let mapCanvasContainer = mapCanvas.parentNode.parentNode.parentNode;
    // console.log("mapCanvasContainer:", mapCanvasContainer);
    let newMapCanvasContainer = mapCanvasContainer.cloneNode(false);

    // ! Doesn't replace link but instead adds listener on top.
    // newMapCanvasContainer.addEventListener("click", (e) => {
    mapCanvasContainer.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(getFromToDirectionsLink(outerNode), "_self");
    });
    // mapCanvasContainer.parentNode.replaceChild(newMapCanvasContainer, mapCanvasContainer);

    let footer = outerNode.querySelector("footer");
    // let newFooter = footer.cloneNode(true);
    let directionsButton = footer.querySelector("a");
    let directionsButtonContainer = directionsButton.parentNode;
    let newDirectionsButtonContainer = directionsButtonContainer.cloneNode(true);
    let newDirectionsButton = newDirectionsButtonContainer.querySelector("a");
    newDirectionsButton.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(getFromToDirectionsLink(outerNode), "_self");
    });
    newDirectionsButton.addEventListener("mouseup", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.button === 1) { // Middle click
            window.open(getFromToDirectionsLink(outerNode), "_blank");
        }
    });
    directionsButtonContainer.parentNode.replaceChild(newDirectionsButtonContainer, directionsButtonContainer);
    
    // TODO: replace integrated map completely with google embed maybe
}

function getFromToDirectionsLink(directionsMapContainer) {
    let locationInputs = directionsMapContainer.querySelectorAll("input");
    let fromLocationInput = locationInputs[0];
    let toLocationInput = locationInputs[1];
    let directionsLink = `${googleMapsDirectionUrl}${encodeURIComponent(toLocationInput.value)}&origin=${encodeURIComponent(fromLocationInput.value)}`;
    return directionsLink;
}