let layersExplored = [];
let layerContainers = [];

function populateSideInfoDisplay (mapFeatureClickEvent, layerData) {
  let target;
  /**
   * The original code I wrote didn't contemplate multiple data (for each feature group)
   * as I though it was a bug. Two global variables were added, this could scoped in a constructor.
   */
  const infoDisplay = document.querySelector('.sideInfoDisplay');
  infoDisplay.classList.add('displayContent');
  infoDisplay.classList.remove('hiddenContent');

  // this block adds a single div per feature group:
  const featureGroup = layerData['feature group'];
  if (!layersExplored.includes(featureGroup)) {
    layersExplored.push(featureGroup);
    const newLayerContainer = document.createElement('div');
    layerContainers.push(newLayerContainer);
    infoDisplay.appendChild(newLayerContainer);
    target = newLayerContainer;
  } else {
    const index = layersExplored.indexOf(featureGroup);
    target = layerContainers[index];
  }

  target.innerHTML = '';

  while (target.firstChild) {
    target.removeChild(target.lastChild);
  }

  const mapboxData = mapFeatureClickEvent.features[0].properties;
  // corresponding content on Drupal:
  // nid names from : https://docs.google.com/spreadsheets/d/1aUzBGzVV2_kINSlCZ1d4lLrhdVZe3deU9AVSJ24IDOc/edit#gid=0 23/6/2023

  /* HACKS START */
  // All fields should have the same nid name:

  const drupalNid = mapboxData.drupalNid || mapboxData.nid || mapboxData.node_id || mapboxData.node || mapboxData.NID_num || null;
  // Lot name hack:
  const mapboxLot = mapboxData.Lot || null;
  if (!drupalNid && mapboxLot) {
    return populateSideInfoDisplayHack(mapFeatureClickEvent, layerData, target);
  }

  const cleanNid = drupalNid.replace(/[/a-z]/gi, '');

  if (!cleanNid) { return; }
  /* HACKS END */



  const url = `https://encyclopedia.nahc-mapping.org/rendered-export-single?nid=${cleanNid}`;

  xhrGetInPromise(null, url).then((content) => {
    let rmNewlines = JSON.parse(content)[0].rendered_entity.replace(/\n/g, '');
    rmNewlines = rmNewlines.replace(/<a (.*?)>/g, '');
    target.insertAdjacentHTML('beforeEnd', JSON.parse(content)[0].rendered_entity);
  });

  makeCloseButton(target);
}

function makeCloseButton (target) {
  const close = document.createElement('i');
  close.classList.add('fa', 'fa-window-close', 'close');
  close.style.float = 'right';
  close.style.cursor = 'pointer';
  close.title = 'Close';
  close.setAttribute('aria-hidden', 'true');
  close.addEventListener('click', () => {
    target.classList.remove('displayContent');
    target.classList.add('hiddenContent');
  });
  target.appendChild(close);
}
