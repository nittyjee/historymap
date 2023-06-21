/**
 * @param {string} layerClass   -The layer being added e.g. 'infoLayerDutchGrantsPopUp'
 * @param {Object{}} event      -Event fired by Mapbox GL
 * @param {string} layerName    -The human readable layer name being added e.g. 'Dutch Grant Lot'
 * @description Function to create popup content when a feature is clicked and shows date information.
 * @returns A HTMLElemnt to use in the pop up
 */

/**
 * 
 *   height: 1em;
  width: 100%;
  display: inline-block;
  color: black;
}
*/
function createClickedFeaturePopup (layerClass, event, layerName) {
  const popUpContent = document.createElement('form');
  popUpContent.classList.add('clickPopupAdmin');
  const featureProperties = event.features[0].properties;
  console.log(event.features);
  const properties = Object.keys(featureProperties);
  const values = Object.values(featureProperties);

  for (let i = 0; i < properties.length; i++) {
    const propertyContainer = createEditPropertyInput(properties[i], values[i]);
    popUpContent.append(propertyContainer);
    if (i === properties.length - 1) {
      const saveButton = saveBtn();
      popUpContent.appendChild(saveButton);
      return popUpContent;
    }
  }

  function createEditPropertyInput (property, value) {
    const propertyContainer = document.createElement('div');
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.value = value;
    input.name = property;

    input.addEventListener('input', () => {
      featureProperties[property] = input.value;
    });

    const label = document.createElement('label');
    label.setAttribute('for', property);
    label.textContent = `${property}: `;
    propertyContainer.appendChild(label);
    propertyContainer.appendChild(input);
    return propertyContainer;
  }

  function saveBtn () {
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'save changes';
    saveBtn.addEventListener('click', () => {
      alert(JSON.stringify(featureProperties));
    });
    return saveBtn;
  }

  /*
  const changes = {};
  const lot = event.features[0].properties.Lot;
  const popUpHTML = document.createElement('div');
  const registrarName = event.features[0].properties.name;
  const dutchLot = event.features[0].properties.dutchlot;
  const day1 = event.features[0].properties.day1;
  const day2 = event.features[0].properties.day2;
  const year1 = event.features[0].properties.year1;
  const year2 = event.features[0].properties.year2;

  popUpHTML.classList.add(layerClass.replaceAll(' ', '_'));

  const registrarNameParagraph = document.createElement('p');
  registrarNameParagraph.textContent = registrarName;
  registrarNameParagraph.setAttribute('contenteditable', 'true');
  registrarNameParagraph.addEventListener('input', (e) => {
    changes.registrarName = registrarNameParagraph.textContent;
  });
  popUpHTML.appendChild(registrarNameParagraph);

  const startBold = document.createElement('b');
  startBold.textContent = 'Start:';
  popUpHTML.appendChild(startBold);

  const startPara = document.createElement('p');
  startPara.textContent = day1 && year1
    ? `${day1}, ${year1}`
    : `${day1 || year1}`;
  startPara.setAttribute('contenteditable', 'true');
  startPara.addEventListener('input', (e) => {
    changes.start = startPara.textContent;
  });
  popUpHTML.appendChild(startPara);

  const endBold = document.createElement('b');
  endBold.textContent = 'End:';
  popUpHTML.appendChild(endBold);

  const endPara = document.createElement('p');
  endPara.textContent = day2 && year2
    ? `${day2}, ${year2}`
    : `${day2 || year2}`;
  endPara.setAttribute('contenteditable', 'true');
  endPara.addEventListener('input', (e) => {
    changes.end = endPara.textContent;
  });
  popUpHTML.appendChild(endPara);

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'save changes';
  saveBtn.addEventListener('click', () => {
    alert(JSON.stringify(changes));
  });
  popUpHTML.appendChild(saveBtn);

  if (dutchLot) {
    const lotBold = document.createElement('b');
    lotBold.textContent = 'Lot Division:';
    popUpHTML.appendChild(lotBold);

    const lotPara = document.createElement('p');
    lotPara.textContent = dutchLot;
    startPara.setAttribute('contenteditable', 'true');
    popUpHTML.appendChild(lotPara);
    startPara.setAttribute('contenteditable', 'true');
  }

  return popUpHTML;

  */
}