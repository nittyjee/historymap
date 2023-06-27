/**
 * This file contains attempts to deal with messy source data, and is used while those sources are
 * updated so that content gets fetched directly from Drupal, via a nid.
 */

// Called dutch_grant_lots_info in the original project:
let Dutch_Grants;
// Self instantiating on start up:
(async () => {
    // const result = await xhrGetInPromise({}, '/dutchLots');
    const result = await xhrGetInPromise(
        {},
        "https://encyclopedia.nahc-mapping.org/grant-lots-export-properly"
    );
    Dutch_Grants = JSON.parse(result);
})();

// Called taxlot_event_entities_info in the original project:
let Castello_Taxlots;
(async () => {
    const result = await xhrGetInPromise(
        {},
        "https://encyclopedia.nahc-mapping.org/taxlot-entities-export"
    );
    Castello_Taxlots = JSON.parse(result);
})();

// drupal feature data
/* type can be taxLots or dutchLots (string) */
const drupalData = (drupalDataName, mapboxLot) => {
    // and yes... evil eval
    const data = eval(drupalDataName);
    const promise = new Promise((resolve, reject) => {
        for (let i = 0; i < data.length; i++) {
            const lot = data[i];
            //console.log(lot);
            let lotTitle;
            if (drupalDataName === "Dutch_Grants") {
                lotTitle = lot.title;
            }
            /* Title in Taxlot, so not compatible in anyway with dutchLots:
      Why fuck would you put a title in an object in an array???
      title = [{ value: "Director General DWIC" }]. This is the alternative to separete functions... */
            if (drupalDataName === "Castello_Taxlots") {
                lotTitle = lot.title[0].value;
            }
            if (lotTitle === mapboxLot) {
                resolve(data[i]);
                break;
            }
            if (i === data.length - 1) {
                resolve(null);
            }
        }
    });
    return promise;
};

function populateSideInfoDisplayHack(event, data) {
    const target = document.querySelector(".sideInfoDisplay");
    target.classList.add("displayContent");
    target.classList.remove("hiddenContent");
    target.innerHTML = "";

    const close = document.createElement("i");
    close.classList.add("fa", "fa-window-close");
    close.style.float = "right";
    close.style.cursor = "pointer";
    close.title = "Close";
    close.setAttribute("aria-hidden", "true");
    close.addEventListener("click", () => {
        target.classList.remove("displayContent");
        target.classList.add("hiddenContent");
    });
    target.appendChild(close);

    // mapbox feature data
    const mapboxData = event.features[0].properties;

    const mapboxLot = mapboxData.Lot;
    // REGEXING labels shouldn't be necesssary
    const drupalDataName = data["feature group"]
        .replace(/[^a-z ]/gi, "")
        .replace(" ", "_");

    // drupalDataTaxLots().then((res) => console.log(res));

    const containsHTML = (str) => /<[a-z][\s\S]*>/i.test(str);

    drupalData(drupalDataName, mapboxLot).then((lotInDrupal) => {
        if (drupalDataName === "Dutch_Grants") {
            makeDutchGrantInfo(
                drupalDataName,
                mapboxLot,
                lotInDrupal,
                mapboxData
            );
        }
        if (drupalDataName === "Castello_Taxlots") {
            makeTaxLotsInfo(drupalDataName, mapboxLot, lotInDrupal, mapboxData);
        }
    });

    function makeTaxLotsInfo(
        drupalDataName,
        mapboxLot,
        lotInDrupal,
        mapboxData
    ) {
        target.style.backgroundColor = "#ffecef";
        target.style.border = "solid 2px #ffecef";
        const h3 = document.createElement("h3");
        target.appendChild(h3);
        h3.style.textAlign = "left";
        // Hard coded...
        h3.textContent = data["feature group"];
        const taxlot = mapboxData.LOT2;
        if (taxlot) {
            makeParagraph("Taxlot: ", taxlot);
        }
        const propertyType = mapboxData.tax_lots_1;
        if (taxlot) {
            makeParagraph("Property Type: ", propertyType);
        }

        const articleLink = mapboxData.new_link;
        if (articleLink) {
            makeLink(articleLink, articleLink, "Encyclopedia Page: ");
        }
    }

    function makeDutchGrantInfo(
        drupalDataName,
        mapboxLot,
        lotInDrupal,
        mapboxData
    ) {
        target.style.backgroundColor = "rgba(255, 255, 0, 0.5)";
        target.style.border = "solid 2px #ffff00";

        const h3 = document.createElement("h3");
        target.appendChild(h3);
        h3.style.textAlign = "left";
        // Hard coded...
        h3.textContent = data["feature group"];
        // Lot link from mapbox... 🤦
        if (mapboxData.Lot) {
            makeLink(
                `/grantlot/${mapboxData.Lot}`,
                mapboxData.Lot,
                "Dutch Grant Lot: "
            );
        }
        // To party has several shapes...
        // raw HTML with a relative url and text content... or a plain string!!🤦
        const toParty =
            lotInDrupal.to_party ||
            lotInDrupal.to_party_unlinked ||
            mapboxData.name ||
            null;
        //console.log(toParty);
        if (toParty) {
            if (containsHTML(toParty)) {
                linkFromRawHTML("To party: ", toParty);
            } else {
                makeParagraph("To party: ", toParty);
            }
        }
        // raw HTML with a relative url and text content... or a plain string!!🤦
        if (lotInDrupal.from_party) {
            if (containsHTML(lotInDrupal.from_party)) {
                linkFromRawHTML("From party: ", lotInDrupal.from_party);
            } else {
                makeParagraph("From party: ", lotInDrupal.from_party);
            }
        }
        // DATES NEED TO BE STORED AS DATE OBJECTS OR TIMESTAMPS!
        const start = lotInDrupal.start
            ? lotInDrupal.start
            : mapboxData.day1 && mapboxData.year1
            ? `${mapboxData.day1} ${mapboxData.year1}`
            : "no date";
        makeParagraph("Start: ", start, "startDate");

        const end = lotInDrupal.end
            ? lotInDrupal.end
            : mapboxData.day2 && mapboxData.year2
            ? `${mapboxData.day2} ${mapboxData.year2}`
            : "no date";
        makeParagraph("End: ", end, "endDate");

        const description =
            lotInDrupal.description ||
            mapboxData.descriptio ||
            "no description";
        makeParagraph("Description: ", description, "description");
        // Images are stored at yet another location...
        // Images should be progressive jpeg of webp...
        const images = lotInDrupal.images.split(",");
        // split always creates an array
        if (images) {
            images.forEach((image) => {
                // if empty string
                if (image) {
                    //console.log(`${baseURL}${image.trim()}`);
                    makeImage(`${baseURL}${image.trim()}`);
                }
            });
        }
    }

    function makeLink(link, textContent, descriptor) {
        const p = document.createElement("p");
        p.textContent = `${descriptor}`;
        p.classList.add("boldItalic");
        const a = document.createElement("a");
        a.setAttribute("href", `${baseURL}${link}`);
        a.setAttribute("target", "_blank");
        a.textContent = textContent;
        p.appendChild(a);
        target.appendChild(p);
    }

    function linkFromRawHTML(textContent, html) {
        const p = document.createElement("p");
        p.classList.add("boldItalic");
        p.textContent = textContent;
        p.insertAdjacentHTML("beforeend", html);
        const link = p.querySelector("a");
        const path = new URL(link.href).pathname;
        link.setAttribute("target", "_blank");
        link.href = `${baseURL}${path}`;
        target.appendChild(p);
    }

    function makeImage(link, textContent) {
        const img = document.createElement("img");
        img.setAttribute("src", link);
        target.appendChild(img);
    }

    function makeParagraph(descriptor, data, extraClass = null) {
        const p = document.createElement("p");
        p.textContent = `${descriptor}`;
        p.classList.add("boldItalic");
        if (extraClass) {
            p.classList.add(extraClass);
        }

        const span = document.createElement("span");
        p.appendChild(span);
        span.textContent = data;
        target.appendChild(p);
    }
}
