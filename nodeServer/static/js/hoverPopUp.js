/**
 * @param {string} layerClass   -The layer being added e.g. 'infoLayerDutchGrantsPopUp'
 * @param {Object{}} event      -Event fired by Mapbox GL
 * @param {string} layerName    -The human readable layer name being added e.g. 'Dutch Grant Lot'
 * @description Function to create popup content. From a security perspective
 * when taking uset input it is preferable to set text view textContent:
 * https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent#differences_from_innertext
 * Using DOM mutation like this also means we can add events easilly.
 * @returns A HTMLElemnt to use in the pop up
 */

function createHoverPopup (data, event) {
  const layerName = data['feature group'].replace(/[0-9|-]/gi, '');
  const layerClass = `${layerName}PopUp`;
  const popUpHTML = document.createElement('div');
  const mapboxFeatureProperties = ((event && event.features) && event.features[0].properties) || null;
  const lot = mapboxFeatureProperties.Lot || mapboxFeatureProperties.TAXLOT || null;
  // Maybe a semantic feature group name will be required:
  const personNameSt = mapboxFeatureProperties.name || mapboxFeatureProperties.To || null;
  console.log(mapboxFeatureProperties);

  console.log(lot);
  console.log(personNameSt);

  popUpHTML.classList.add(
    'hoverPopUp'
  );

  const personName = document.createElement('p');
  popUpHTML.appendChild(personName);
  personName.textContent = personNameSt;

  const lotName = document.createElement('b');
  popUpHTML.appendChild(lotName);
  lotName.textContent = (lot) ? `${layerName} Lot: ${lot}` : lot;

  return popUpHTML;
}

/**
 * @param {string} string
 * @returns The same string with spaces replaced by an undescore
 * @description Small utility to declutter code.
 */
function removeSpaces (string) {
  return string.replaceAll(' ', '_');
}
