/**
 * Future clicked popup function that renders mapbox feature properties that can be altered:
 * This will require a Mapbox api key with the correct permissions and for the edits to be
 * "PUT" on mapbox
 */

function createClickedFeaturePopupAdmin (layerClass, event, layerName) {
  const popUpContent = document.createElement('form');
  popUpContent.classList.add('clickPopupAdmin');

  const featureProperties = event.features[0].properties;
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

  // https://api.mapbox.com/datasets/v1/{username}/{dataset_id}/features/{feature_id}

  function saveBtn () {
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'save changes';
    saveBtn.addEventListener('click', () => {
      alert(JSON.stringify(featureProperties));
      saveFeatureAlterations(userName, dataSetId, featureId);
    });
    return saveBtn;
  }
}
