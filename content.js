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

    // Left click
    document.addEventListener('click', function(e) {
        const target = e.target;
        
        const isMapImage = target.alt === 'map' || target.src?.includes('external-content.duckduckgo.com/ssv2');
        const mapLink = target.closest('[data-zci-link="maps"], a[href*="iaxm=maps"], a[href*="ia=maps"]');
        
        if (mapLink || isMapImage) {
            e.preventDefault();
            e.stopPropagation();
            
            let query = null;
            if (mapLink && mapLink.href) {
                const linkUrl = new URL(mapLink.href);
                query = linkUrl.searchParams.get('q');
            }
            if (!query) {
                query = new URLSearchParams(window.location.search).get('q');
            }
            
            if (query) {
                window.location.href = googleMapsSearchUrl + "&q=" + encodeURIComponent(query);
            }
            return false;
        }
    }, true);

    // Middle click
    document.addEventListener('auxclick', function(e) {
        const target = e.target;
        
        const isMapImage = target.alt === 'map' || target.src?.includes('external-content.duckduckgo.com/ssv2');
        const mapLink = target.closest('[data-zci-link="maps"], a[href*="iaxm=maps"], a[href*="ia=maps"]');
        
        if (mapLink || isMapImage) {
            e.preventDefault();
            e.stopPropagation();
            
            let query = null;
            if (mapLink && mapLink.href) {
                const linkUrl = new URL(mapLink.href);
                query = linkUrl.searchParams.get('q');
            }
            if (!query) {
                query = new URLSearchParams(window.location.search).get('q');
            }
            
            if (query) {
                if (e.button === 1) {
                    window.open(googleMapsSearchUrl + "&q=" + encodeURIComponent(query), '_blank');
                }
            }
            return false;
        }
    }, true);

    document.addEventListener('click', function(e) {
        console.log("Click event detected:", e);
        const target = e.target;
        
        const directionsButton = target.closest('[data-zci-link="directions"], button[href*="iaxm=directions"], button[href*="ia=directions"]');
        if (directionsButton) {
            e.preventDefault();
            e.stopPropagation();

            let source = null;
            let end = null;
            // TODO: Figure out duckduckgo transport modes
            let transport = null;
            
            if (directionsButton.getAttribute('href')) {
                const linkUrl = new URL(document.location.origin + directionsButton.getAttribute('href'));

                source = linkUrl.searchParams.get('source');
                end = linkUrl.searchParams.get('end');
                transport = linkUrl.searchParams.get('transport');
            }

            // Prevent default duckduckgo source
            if (source === "directions") {
                source = null;
            }

            // Get query from URL if not found in link
            if (!end) {
                end = new URLSearchParams(window.location.search).get('q');
            }
            
            if (end) {
                // window.open(googleMapsSearchUrl + encodeURIComponent(query), '_blank');
                let url = googleMapsDirectionUrl;
                if (source) {
                    url += "&origin=" + encodeURIComponent(source);
                }
                if (end) {
                    url += "&destination=" + encodeURIComponent(end);
                }
                window.location.href = googleMapsDirectionUrl + encodeURIComponent(source) + encodeURIComponent(end);
            }
            return false;
        }
    }, true);
}