function populateSideInfoDisplay (mapFeatureClickEvent, layerData) {
  console.log([...arguments]);
  const mapboxData = mapFeatureClickEvent.features[0].properties;
  console.log(mapboxData);
  // corresponding content on Drupal:
  // nid names from : https://docs.google.com/spreadsheets/d/1aUzBGzVV2_kINSlCZ1d4lLrhdVZe3deU9AVSJ24IDOc/edit#gid=0 23/6/2023

  /* HACKS START */
  // All fields should have the same nid name:
  const drupalNid = mapboxData.drupalNid || mapboxData.nid || mapboxData.node_id || mapboxData.node || mapboxData.NID_num || null;
  // Lot name hack:
  const mapboxLot = mapboxData.Lot || null;
  if (!drupalNid && mapboxLot) {
    return populateSideInfoDisplayHack(mapFeatureClickEvent, layerData);
  }

  const cleanNid = drupalNid.replace(/[/a-z]/gi, '');
  /* HACKS END */

  if (!cleanNid) { return; }

  const target = document.querySelector('.sideInfoDisplay');
  target.classList.add('displayContent');
  target.classList.remove('hiddenContent');
  target.innerHTML = '';

  while (target.firstChild) {
    target.removeChild(target.lastChild);
  }

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
