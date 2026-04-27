chrome.storage.sync.get("duckduckgoMapLinkChangerEnabled", (result) => {
    console.log("Retrieved duckduckgoMapLinkChangerEnabled setting:", result.duckduckgoMapLinkChangerEnabled);
    if (!result.duckduckgoMapLinkChangerEnabled) {
        console.log("DuckDuckGo Map Link Changer is disabled, not modifying links.");
        return;
    } else {
        main();
    }
});

function main() {
    const googleMapsSearchUrl = "https://google.com/maps?";
    const googleMapsDirectionUrl = "https://google.com/maps/dir/?api=1";

    function tryGetMapLink(target) {
        const isMapImage = target.alt === 'map' || target.src?.includes('external-content.duckduckgo.com/ssv2');
        const mapLink = target.closest('[data-zci-link="maps"], a[href*="iaxm=maps"], a[href*="ia=maps"]');
        
        if (mapLink || isMapImage) {
            let query = null;
            if (mapLink && mapLink.href) {
                const linkUrl = new URL(mapLink.href);
                query = linkUrl.searchParams.get('q');
            }
            if (!query) {
                query = new URLSearchParams(window.location.search).get('q');
            }
            return googleMapsSearchUrl + "&q=" + encodeURIComponent(query);
        }
        return null;
    }

    function tryGetDirectionsLink(target) {
        const directionsLink = target.closest('[class="mk-map-node-element"], a[href*="iaxm=directions"], a[href*="ia=directions"]');
        const directionsButton = target.closest('[class="mk-map-node-element"], button[href*="iaxm=directions"], button[href*="ia=directions"]');
        if (directionsLink || directionsButton) {
            let start = null;
            let end = null;
            let transport = null;

            let linkUrl = null;
            
            if (directionsButton && directionsButton.getAttribute('href')) {
                linkUrl = new URL(document.location.origin + directionsButton.getAttribute('href'));
            } else if (directionsLink && directionsLink.href) {
                linkUrl = new URL(directionsLink.href);
            }

            if (linkUrl) {
                start = linkUrl.searchParams.get('start');
                end = linkUrl.searchParams.get('end');
                transport = linkUrl.searchParams.get('transport');
            }

            // Get query from URL if not found in link
            if (!end) {
                end = new URLSearchParams(window.location.search).get('q');
            }
            
            if (end) {
                let url = googleMapsDirectionUrl;
                if (start) {
                    url += "&origin=" + encodeURIComponent(start);
                }
                if (end) {
                    url += "&destination=" + encodeURIComponent(end);
                }
                return url;
            }
        }
        return null;
    }

    // Left click
    document.addEventListener('click', function(e) {
        const target = e.target;

        let url = tryGetMapLink(target);
        if (url) {
            e.preventDefault();
            e.stopPropagation();
            console.log("Redirecting to Google Maps URL:", url);
            window.location.href = url;
            return false;
        }

        url = tryGetDirectionsLink(target);
        if (url) {
            e.preventDefault();
            e.stopPropagation();
            console.log("Redirecting to Google Maps Directions URL:", url);
            window.location.href = url;
            return false;
        }
    }, true);

    // Middle click
    document.addEventListener('auxclick', function(e) {
        const target = e.target;

        let url = tryGetMapLink(target);
        if (url) {
            e.preventDefault();
            e.stopPropagation();
            console.log("Opening Google Maps URL in new tab:", url);
            window.open(url, '_blank');
            return false;
        }

        url = tryGetDirectionsLink(target);
        if (url) {
            e.preventDefault();
            e.stopPropagation();
            console.log("Opening Google Maps Directions URL in new tab:", url);
            window.open(url, '_blank');
            return false;
        }
    }, true);
}