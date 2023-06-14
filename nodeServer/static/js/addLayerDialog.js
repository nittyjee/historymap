const baseURL = 'https://encyclopedia.nahc-mapping.org';

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

function createHoverPopup (layerClass, event, layerName) {
/**
 * @param {string} string
 * @returns The same string with spaces replaced by an undescore
 * @description Small utility to declutter code.
 */
  function removeSpaces (string) {
    return string.replaceAll(' ', '_');
  }
  const popUpHTML = document.createElement('div');
  const lot = (event.features[0].properties.Lot)
    ? event.features[0].properties.Lot
    : event.features[0].properties.TAXLOT;

  popUpHTML.classList.add(
    removeSpaces(layerClass),
    removeSpaces(lot)
  );

  const paragraph = document.createElement('p');
  popUpHTML.appendChild(paragraph);
  const paragraphText = (event.features[0].properties.name)
    ? event.features[0].properties.name
    : 'TAXLOT';

  paragraph.textContent = paragraphText;
  paragraph.classList.add(`${removeSpaces(lot)}-${removeSpaces(paragraphText)}`);

  const name = document.createElement('b');
  popUpHTML.appendChild(name);
  name.textContent = `${layerName}: ${lot}`;
  return popUpHTML;
}

/**
 * @param {string} layerClass   -The layer being added e.g. 'infoLayerDutchGrantsPopUp'
 * @param {Object{}} event      -Event fired by Mapbox GL
 * @param {string} layerName    -The human readable layer name being added e.g. 'Dutch Grant Lot' 
 * @description Function to create popup content when a feature is clicked and shows date information.
 * @returns A HTMLElemnt to use in the pop up
 */
function createClickedFeaturePopup (layerClass, event, layerName) {
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
}

function LayerManager () {
  // Eventually a store to manage layers:
  const layersMongoId = [];
  const layersMapboxId = [];
  // Maps is defined in ~/historymap/nodeServer/static/js/mapboxGlCalls.js
  const mapNames = Object.keys(maps);
  const layerControls = document.querySelector('.layerControls');

  let layerFormParent;
  let mapFormParent;

  function fetchLayer (layerId) {
    //const checkbox = document.querySelector(`[name="${layerId}"]`);
    const promise = new Promise((resolve, reject) => {
      if (layerManager.returnLayers().includes(layerId)) {
        layerManager.toggleVisibility();
        console.group(`has layer ${layerId}`);
        resolve();
      } else {
        xhrPostInPromise({ _id: layerId }, './getLayerById').then((layerData) => {
          const parsedLayerData = JSON.parse(layerData);
          //checkbox.checked = true;
          createLayer(parsedLayerData).then(() => {
            // layer added
            resolve();
          });
        });
      }
    });
    return promise;
  }

  function zoomToLayer (zoom) {
    zoom.classList.remove('hiddenZoom');
    window.setTimeout(() => {
      const mapboxId = zoom.dataset.id;
      const map = mapboxId.split('/')[mapboxId.split('/').length - 1];
      maps[map].fitBounds(maps[map].getSource(mapboxId).bounds, { bearing: 0, padding: 15 });
    }, 500);
  }

  function zoomToFeatureGroup (layers) {
    const group = [];
    layers.forEach((layer, i) => {
      const mapboxId = layer.parentElement.querySelector('.zoomToLayer').dataset.id;
      console.log(mapboxId);
      const map = mapboxId.split('/')[mapboxId.split('/').length - 1];
      const bounds = maps[map].getSource(mapboxId).bounds;
      if (bounds) {
        group.push(bounds.slice(0, 2));
        group.push(bounds.slice(2));
      }
      if (i === layers.length - 1) {
        const groupBounds = determineBounds(group);
        maps[map].fitBounds(groupBounds, { bearing: 0, padding: 15 });
      }
    });

    function determineBounds (coords) {
      const bounds = {};
      let latitude;
      let longitude;
      for (let i = 0; i < coords.length; i++) {
        longitude = coords[i][0];
        latitude = coords[i][1];
        bounds.xMin = bounds.xMin < longitude ? bounds.xMin : longitude;
        bounds.xMax = bounds.xMax > longitude ? bounds.xMax : longitude;
        bounds.yMin = bounds.yMin < latitude ? bounds.yMin : latitude;
        bounds.yMax = bounds.yMax > latitude ? bounds.yMax : latitude;
        if (i === coords.length - 1) {
          return [bounds.xMin, bounds.yMin, bounds.xMax, bounds.yMax];
        }
      }
    }
  }
  // For app owners to edit things, must be instantiated:
  this.layerControlEvents = () => {
    layerControls.addEventListener('click', (e) => {
      if (e.target.classList.contains('toggleVisibility')) {
        // extra element added to center first item...
        const hiddenContent = e.target.parentElement.parentElement.querySelector('.hiddenContent');
        const plusMinus = e.target.parentElement.querySelector('i');
        if (hiddenContent.classList.contains('displayContent')) {
          plusMinus.classList.remove('fa-plus-square');
          plusMinus.classList.add('fa-minus-square');
          hiddenContent.classList.remove('displayContent');
          return;
        }
        hiddenContent.classList.add('displayContent');
        plusMinus.classList.add('fa-plus-square');
        plusMinus.classList.remove('fa-minus-square');
      }

      if (e.target.classList.contains('fetchLayer')) {
        fetchLayer(e.target.name).then(() => {
          // Uncommenting the following lines allows "zoom to layer" on add functionality:
          // const zoomIcon = e.target.parentElement.querySelector('.zoomToLayer');
          // zoomToLayer(zoomIcon);
        });
      }

      if (e.target.classList.contains('featureGroup')) {
        const featureGroupChecked = e.target.parentElement.querySelector('.featureGroup');
        const layers = e.target.parentElement.querySelectorAll('.fetchLayer');
        e.target.parentElement.querySelector('.zoomToFeatureGroup').classList.remove('hiddenZoom');
        const promises = [];
        layers.forEach((layer, i) => {
          promises.push(fetchLayer(layer.name));
          if (i === layers.length - 1) {
            Promise.all(promises).then(() => {
              console.log(featureGroupChecked.checked);
              if (featureGroupChecked.checked) {
                layers.forEach((checkbox) => {
                  checkbox.checked = true;
                });
              } else {
                layers.forEach((checkbox) => {
                  checkbox.checked = false;
                });
              }
              layerManager.toggleVisibility();
              // allows zoom to layers on add:
              // zoomToFeatureGroup(layers);
            });
          }
        });
      }

      if (e.target.classList.contains('zoomToLayer')) {
        const mapboxId = e.target.parentElement.querySelector('.zoomToLayer').dataset.id;
        const map = mapboxId.split('/')[mapboxId.split('/').length - 1];
        /* Both maps are the same size, so it makes no difference which map the function is
        called on */
        maps[map].fitBounds(maps[map].getSource(mapboxId).bounds, { bearing: 0, padding: 15 });
      }

      if (e.target.classList.contains('easeToPoint')) {
        const point = JSON.parse(e.target.dataset.easetopoint);
        /* Both maps are the same size, so it makes no difference which map the function is
        called on */
        maps.beforeMap.easeTo({ center: point, zoom: 16, pitch: 0 });
      }

      if (e.target.classList.contains('zoomToFeatureGroup')) {
        const layers = e.target.parentElement.querySelectorAll('.fetchLayer');
        zoomToFeatureGroup(layers);
      }

      if (e.target.classList.contains('fetchStyle')) {
        const targetMap = e.target.dataset.target;
        const url = e.target.dataset.url;
        const name = e.target.parentElement.querySelector('label').textContent;
        maps[targetMap].setStyle(url);
        const point = JSON.parse(e.target.parentElement.querySelector('.easeToPoint').dataset.easetopoint);
        /* Both maps are the same size, so it makes no difference which map the function is
        called on */
        maps.beforeMap.easeTo({ center: point, zoom: 16, pitch: 0 });
      }

      if (e.target.classList.contains('editLayer')) {
        xhrPostInPromise({ _id: e.target.dataset._id }, './getLayerById').then((layerData) => {
          const parsedLayerData = JSON.parse(layerData);
          this.populateLayerEditor(parsedLayerData);
        });
      }

      if (e.target.classList.contains('editStyle')) {
        xhrPostInPromise({ _id: e.target.dataset._id }, './getStyleById').then((styleData) => {
          const parsedStyleData = JSON.parse(styleData);
          this.populateStyleEditor(parsedStyleData);
        });
      }

      if (e.target.classList.contains('deleteLayer')) {
        if (window.confirm('Are you sure you want to delete this layer?')) {
          xhrPostInPromise({ id: e.target.dataset._id }, './deleteLayer').then((response) => {
            const layer = e.target.closest('.layer');
            layer.parentElement.remove(layer);
            alert(response);
          });
        }
      }
/*
      if (e.target.classList.contains('displayStyleEditor')) {
        mapFormParent.classList.remove('hiddenContent');
        mapFormParent.classList.add('displayContent');
      }

      if (e.target.classList.contains('displayLayerEditor')) {
        layerFormParent.classList.remove('hiddenContent');
        layerFormParent.classList.add('displayContent');
      }*/
    });
  };

  this.resetLayerEditor = () => {
    return resetLayerEditorFn();
  };

  // "this" in the function isn't the outer constructor, so we have to point to that:
  const layerManager = this;
  function resetLayerEditorFn () {
    layerFormParent.innerHTML = '';
    layerManager.generateAddLayerForm(layerFormParent);
    layerManager.layerControlEvents();
  }

  this.populateLayerEditor = (data) => {
    layerFormParent.querySelector('.title').textContent = `Editing Layer with id ${data._id}`;
    layerFormParent.querySelector('.title').classList.add('highlight');
    layerFormParent.dataset._id = data._id;
    layerFormParent.scrollIntoView(false);
    layerFormParent.classList.remove('hiddenContent');
    const keys = Object.keys(data);
    const values = Object.values(data);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i].replaceAll(' ', '_');
      if (key === '_id') {
        continue;
      }
      const correspondingInput = layerFormParent.querySelector(`#${key}`);
      if (correspondingInput) {
        correspondingInput.value = values[i];
        correspondingInput.classList.add('highlight');
      } else {
        /* unabstracted code, not ideal */
        if (key === 'target_map') {
          values[i].forEach((mapName) => {
            layerFormParent.querySelector(`#${mapName}`).checked = true;
            layerFormParent.querySelector(`#${mapName}`).classList.add('highlight');
          });
        }

        if (key === 'type') {
          values[i].forEach((type) => {
            const checkbox = layerFormParent.querySelector(`[data-layer-type="${type.type}"]`);
            const parent = checkbox.parentElement;
            if (checkbox) {
              checkbox.checked = true;
              checkbox.classList.add('highlight');
            }

            const textInputs = parent.querySelectorAll('input[type="text"]');
            textInputs.forEach((input) => {
              if (type[input.dataset.typeStyle]) {
                input.value = type[input.dataset.typeStyle];
                input.classList.add('highlight');
              }
            });
          });
        }
      }
    }
  };

  this.returnLayers = () => {
    return layersMongoId;
  };

  this.resetStyleEditor = () => {
    return resetStyleEditorFn();
  };

  function resetStyleEditorFn () {
    mapFormParent.innerHTML = '';
    mapFormParent.generateAddMapForm(mapFormParent);
    layerManager.layerControlEvents();
  }

  this.populateStyleEditor = (data) => {
    // resetStyleEditorFn();
    mapFormParent.querySelector('.title').textContent = `Editing style with id ${data._id}`;
    mapFormParent.querySelector('.title').classList.add('highlight');
    mapFormParent.dataset._id = data._id;
    mapFormParent.classList.remove('hiddenContent');
    mapFormParent.scrollIntoView(false);
    const keys = Object.keys(data);
    const values = Object.values(data);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i].replaceAll(' ', '_');
      if (key === '_id') {
        continue;
      }
      console.warn('classes should be used rather than ids for multiple mutable content');
      const correspondingInput = mapFormParent.querySelector(`#${key}`);
      if (correspondingInput) {
        correspondingInput.value = values[i];
        correspondingInput.classList.add('highlight');
      } else {
        if (key === 'style_source_url') {
          mapFormParent.querySelector('#style_link').value = values[i];
          mapFormParent.querySelector('#style_link').classList.add('highlight');
        }
        if (key === 'feature_group') {
          mapFormParent.querySelector('#title').value = values[i];
          mapFormParent.querySelector('#title').classList.add('highlight');
        }
      }
    }

    // -74.01255,40.704882
  };

  /**
   * @param {String} mongoLayerId String with the DB id.
   * @description the IDs passed to mapbox contain information including the
   * name of the map to which they are added:
   *
   * Manhattan-1609|Manhattan-Lenape trails-line-beforeMap
   * Split by "-" the different parts are: borough, feature group, layer type, map
   */
  this.toggleVisibility = (mongoLayerId) => {
    document.querySelectorAll('.fetchLayer').forEach((checkbox) => {
      const index = layersMongoId.indexOf(checkbox.name);
      const mapboxId = layersMapboxId[index];
      if (mapboxId) {
        mapboxId.forEach((map) => {
          const targetMapText = map.split('/')[map.split('/').length - 1];
          const targetMap = maps[targetMapText];
          if (checkbox.checked) {
            targetMap.setLayoutProperty(map, 'visibility', 'visible');
          } else {
            targetMap.setLayoutProperty(map, 'visibility', 'none');
          }
        });
      }
    });
  };

  /**
   * @param {HTMLElement} parentElement
   * @description Generates a small form to add maps. Currently the form fields
   * are set in the function rather than passed to the function. These are:
   * 'Title', 'Borough', 'Style link', 'Drupal node id'
   */
  this.generateAddMapForm = (parentElement) => {
    /* A map is a style */
    const mapData = {};

    function textInputGenerator (fieldName, target) {
      const nameLabel = document.createElement('label');
      nameLabel.htmlFor = fieldName;
      nameLabel.innerHTML = `${fieldName}: `;
      target.appendChild(nameLabel);

      const name = document.createElement('input');
      name.setAttribute('type', 'text');
      name.id = fieldName.replaceAll(' ', '_');
      target.appendChild(name);

      name.addEventListener('input', () => {
        mapData[fieldName] = name.value;
      });

      const br = document.createElement('br');
      target.appendChild(br);
    }

    mapFormParent = document.createElement('form');
    mapFormParent.classList.add('hiddenContent');
    parentElement.appendChild(mapFormParent);

    mapFormParent.classList.add('styleform');
    const title = document.createElement('h2');
    title.classList.add('title');
    title.textContent = 'Add Map';
    mapFormParent.appendChild(title);

    const fields = ['title', 'borough', 'style link', 'drupal node id', 'ease to point'];
    fields.forEach(fieldName => {
      textInputGenerator(fieldName, mapFormParent);
    });

    const submit = document.createElement('input');
    submit.setAttribute('type', 'submit');
    submit.textContent = 'submit';

    const hideButton = document.createElement('button');
    hideButton.textContent = 'hide form';
    hideButton.addEventListener('click', () => {
      mapFormParent.classList.add('hiddenContent');
      mapFormParent.classList.remove('displayContent');
    });
    mapFormParent.appendChild(hideButton);

    mapFormParent.appendChild(submit);

    mapFormParent.addEventListener('submit', (event) => {
      event.preventDefault();
      fields.forEach((id, i) => {
        mapData[id] = mapFormParent.querySelector(`#${id.replaceAll(' ', '_')}`).value;
        if (id === 'title') {
          mapData['feature group'] = mapData.title;
          delete mapData.title;
        }
        if (id === 'style link') {
          mapData['style source url'] = mapData['style link'];
          delete mapData['style link'];
        }
        if (id === 'ease to point') {
          mapData['ease to point'] = mapData['ease to point'].split(',');
        }
        if (mapFormParent.dataset._id) {
          mapData._id = mapFormParent.dataset._id;
        }
        // then save
        if (i === fields.length - 1) {
          saveStyle(mapData).then((response) => {
            alert(response);
          });
        }
      });
    //  createMap(data);
    });
    /**
     * @param {*} data Can accept partial data for updates, but requires an bson _id for updates.
     * @returns The same date saved in the DB after rendering a layer toggle widget. 
     */
    function saveStyle (data) {
      const promise = new Promise((resolve, reject) => {
        xhrPostInPromise(data, './saveStyle').then((response) => {
          document.querySelector('.areaList').insertAdjacentHTML('beforeend', response);
          resolve(data);
        });
      });
      return promise;
    }
  };

  this.generateAddLayerForm = (parentElement) => {
    layerFormParent = document.createElement('form');
    layerFormParent.classList.add('hiddenContent');
    parentElement.appendChild(layerFormParent);

    const data = {};
    data['target map'] = [];
    data.type = [];

    function textInputGenerator (fieldName, target) {
      const nameLabel = document.createElement('label');
      nameLabel.htmlFor = fieldName;
      nameLabel.innerHTML = `${fieldName}: `;
      target.appendChild(nameLabel);

      const name = document.createElement('input');
      name.setAttribute('type', 'text');
      name.id = fieldName.replaceAll(' ', '_');
      target.appendChild(name);

      name.addEventListener('input', () => {
        data[fieldName] = name.value;
      });

      const br = document.createElement('br');
      target.appendChild(br);
    }

    function generateCheckbox (checkboxName) {
      const nameLabel = document.createElement('label');
      nameLabel.htmlFor = checkboxName;
      nameLabel.innerHTML = `${checkboxName}: `;
      layerFormParent.appendChild(nameLabel);
      const name = document.createElement('input');
      name.setAttribute('type', 'checkbox');
      name.id = checkboxName;
      layerFormParent.appendChild(name);
      name.addEventListener('click', () => {
        if (name.checked === true) {
          data[checkboxName] = 1;
        } else {
          data[checkboxName] = 0;
        }
      });

      const br = document.createElement('br');
      layerFormParent.appendChild(br);
    }

    function generateAddToMapCheckbox (checkboxName) {
      const nameLabel = document.createElement('label');
      nameLabel.htmlFor = checkboxName;
      nameLabel.innerHTML = `Add to "${checkboxName}" map: `;
      layerFormParent.appendChild(nameLabel);
      const name = document.createElement('input');
      name.setAttribute('type', 'checkbox');
      name.classList.add('addToMap');
      name.id = checkboxName;
      name.dataset.targetMap = checkboxName;
      layerFormParent.appendChild(name);

      const br = document.createElement('br');
      layerFormParent.appendChild(br);
    }

    function generateLayersTypeCheckbox (checkboxName) {
      const wrapper = document.createElement('div');
      wrapper.classList.add('typeBox');
      layerFormParent.appendChild(wrapper);
      const nameLabel = document.createElement('label');
      nameLabel.htmlFor = checkboxName;
      nameLabel.innerHTML = `Add as "${checkboxName}" layer type: `;
      wrapper.appendChild(nameLabel);
      const name = document.createElement('input');
      name.setAttribute('type', 'checkbox');
      name.classList.add('layerType');
      name.id = checkboxName;
      name.dataset.layerType = checkboxName;
      wrapper.appendChild(name);
      const br = document.createElement('br');
      wrapper.appendChild(br);
      const typeBoxText = document.createElement('div');
      typeBoxText.classList.add('typeBoxText');
      wrapper.appendChild(typeBoxText);

      const appearance = ['color', 'opacity', 'width'];
      appearance.forEach((fieldName) => {
        const nameLabel = document.createElement('label');
        nameLabel.htmlFor = fieldName;
        nameLabel.innerHTML = `${fieldName}: `;
        typeBoxText.appendChild(nameLabel);

        const name = document.createElement('input');
        name.setAttribute('type', 'text');
        name.dataset.typeStyle = fieldName.replaceAll(' ', '_');
        name.classList.add(fieldName.replaceAll(' ', '_'));
        typeBoxText.appendChild(name);
        /* these options are not added dynamically to the data.object,
        but onsubmit */
        const br = document.createElement('br');
        typeBoxText.appendChild(br);
      });
    }

    function dropDownGenerator (options) {
      const select = document.createElement('select');
      layerFormParent.appendChild(select);

      select.addEventListener('change', () => {
        data.type = select.value;
      });

      options.forEach(value => {
        const option = document.createElement('option');
        option.setAttribute('value', value);
        option.textContent = value;
        select.appendChild(option);
      });
    }

    layerFormParent.classList.add('layerform');
    const title = document.createElement('h2');
    title.classList.add('title');
    title.textContent = 'Add Layer';
    layerFormParent.appendChild(title);

    const textFields = [
      'name',
      'source layer',
      'layer source url',
      'feature group',
      'drupal node id',
      // 'borough to which the layer belongs'
      'borough'
    ];

    textFields.forEach(fieldName => {
      textInputGenerator(fieldName, layerFormParent);
    });

    const types = ['circle', 'line', 'fill'];
    // dropDownGenerator(types);
    types.forEach((type) => {
      generateLayersTypeCheckbox(type);
    });

    // Maps are defined in the "Layer Manager" constuctor scope.
    mapNames.forEach((map) => {
      generateAddToMapCheckbox(map);
    });

    const checkboxes = ['hover', 'click', 'sidebar', 'sliderCheckBox'];

    checkboxes.forEach(label => {
      generateCheckbox(label);
    });

    const submit = document.createElement('input');
    submit.setAttribute('type', 'submit');
    submit.value = 'submit layer';
    layerFormParent.appendChild(submit);

    const hideButton = document.createElement('button');
    hideButton.textContent = 'hide form';
    hideButton.addEventListener('click', () => {
      mapFormParent.classList.add('hiddenContent');
      mapFormParent.classList.remove('displayContent');
    });

    const reset = document.createElement('button');
    reset.textContent = 'reset form';
    reset.classList.add('reset');
    layerFormParent.appendChild(reset);
    reset.addEventListener('click', (e) => {
      e.preventDefault();
      resetLayerEditorFn();
    });

    layerFormParent.addEventListener('submit', (event) => {
      event.preventDefault();
      /* n.b. note that only replacing spaces in fields might cause a future bug if
        other input types are added with a space.
      */
      textFields.forEach((id) => {
        data[id] = layerFormParent.querySelector(`#${id.replaceAll(' ', '_')}`).value;
      });

      const addToMapCheckboxes = layerFormParent.querySelectorAll('.addToMap');
      let checkedBoxes = 0;
      if (addToMapCheckboxes) {
        data['target map'].length = 0;
      }
      for (let i = 0; i < addToMapCheckboxes.length; i++) {
        const element = addToMapCheckboxes[i];
        if (element.checked) {
          data['target map'].push(element.dataset.targetMap);
          checkedBoxes++;
        }
        if (i === addToMapCheckboxes.length - 1) {
          if (checkedBoxes === 0) {
            const confirm = window.confirm('You have selected no maps to display this layer, is that correct?');
            if (!confirm) {
              return;
            }
          }
        }
      }

      layerFormParent.querySelectorAll('.layerType').forEach((type, i) => {
        if (i === 0) {
          data.type.length = 0;
        }
        if (type.checked) {
          const typeFeature = {
            type: type.dataset.layerType,
            color: type.parentElement.querySelector('[data-type-style="color"]').value,
            opacity: type.parentElement.querySelector('[data-type-style="opacity"]').value,
            width: type.parentElement.querySelector('[data-type-style="width"]').value
          };
          data.type.push(typeFeature);
        }
      });

      if (layerFormParent.dataset._id) {
        data._id = layerFormParent.dataset._id;
      }

      saveLayer(data).then(() => {
        createLayer(data);
      });
    });
  };

  /**
   * @param {Object} data The data to create a layer.
   * @param {String} data['borough to which the layer belongs'] A name of a geographical area.
   * @param {String} data.color The color to render the layer on the map in.
   * @param {String} data['feature group'] The group of features to which a layer belongs.
   * @param {String} data['layer id created in mapbox'] A unique id for a layer make in mapbox.
   * @param {String} data['layer source url'] The link to the layer in mapbox.
   * @param {String} data.name The name for this particular layer.
   * @param {String} data.opacity The opacity the layer is rendered with on the map.
   * @param {String} data['source layer'] Not sure, pertains to mapbox.
   * @param {Object[]} data.targetMap An array containing the names of the maps for which to render the layer(s).
   * @param {Object[]} data.type An aray of geometry types to be rendered from a layer, it can be a line, point, fill (area)
   * @returns null
   * @fires map.addLayer(data)
   * @descritption Also pushes the layer id and mongo id to arrays for state management.
   */

  function createLayer (data) {
    const promises = [];
    const promise = new Promise((resolve, reject) => {
      data['target map'].forEach((target) => {
        // Multiple geometry types can also be handled through the same function:
        data.type.forEach((type, i) => {
          /* This is moved to its own function to make it easier to read and understand
          since a layer can have several representation on several maps */
          promises.push(tanspileAndAddLayer(target, type, data));
          Promise.all(promises).then(() => {
            resolve();
          });
        });
      });
    });
    return promise;
  }

  /**
   * @param {*} data Can accept partial data for updates, but requires an bson _id for updates.
   * @returns The same date saved in the DB after rendering a layer toggle widget. 
   */
  function saveLayer (data) {
    const promise = new Promise((resolve, reject) => {
      xhrPostInPromise(data, './saveLayer').then((response) => {
        document.querySelector('.areaList').insertAdjacentHTML('beforeend', response);
        resolve(data);
      });
    });
    return promise;
  }

  this.addLayer = (data) => {
    return createLayer(data);
  };

  this.addDateFilter = (minDate, maxDate) => {
    const filter = ['all', ['<=', 'DayStart', minDate], ['>=', 'DayEnd', minDate]];
    for (let j = 0; j < layersMapboxId.length; j++) {
      for (let i = 0; i < layersMapboxId[j].length; i++) {
        const mapboxId = layersMapboxId[j][i];
        const targetMapText = mapboxId.split('/')[mapboxId.split('/').length - 1];
        const targetMap = maps[targetMapText];
        const exists = targetMap.getLayer(mapboxId);
        if (!exists) {
          console.warn(`${targetMapText} doesn't have ${mapboxId}`);
          continue;
        }
        targetMap.setFilter(mapboxId, filter);
      }
    }
  };

  function tanspileAndAddLayer (targetMap, type, data) {
    const promise = new Promise((resolve, reject) => {
      const map = maps[targetMap];
      const layerId = `${data.borough}/${data['feature group']}/${data.name}/${type.type}/${targetMap}`;
      data.id = layerId;

      const transpilledOptions = {
        id: layerId,
        type: '',
        metadata: { _id: '' },
        source: {
          // url is tileset ID in mapbox:
          url: '',
          type: 'vector'
        },
        layout: {
          visibility: 'visible' // || none
        },
        // called 'source name'
        'source-layer': '',
        paint: {
          [`${type.type}-color`]: (type.color) ? type.color : '#AAAAAA',
          [`${type.type}-opacity`]: (type.opacity) ? parseFloat(type.opacity) : 0.5
        }
        // filter: ["all", ["<=", "DayStart", sliderConstructor.returnMinDate()], [">=", "DayEnd", sliderConstructor.returnMaxDate()]]
      };

      if (data.hover) {
        const hoverPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 });
        map.on('mouseenter', data.id, (event) => {
          map.getCanvas().style.cursor = 'pointer';
          hoverPopUp
            .setLngLat(event.lngLat)
            .setDOMContent(createHoverPopup(`${data.name}PopUp`, event, data.name))
            .addTo(map);
        });

        map.on('mousemove', data.id, (event) => {
          map.getCanvas().style.cursor = 'pointer';
          hoverPopUp
            .setLngLat(event.lngLat)
            .setDOMContent(createHoverPopup(`${data.name}PopUp`, event, data.name));
        });

        map.on('mouseleave', data.id, () => {
          map.getCanvas().style.cursor = '';
          if (hoverPopUp.isOpen()) {
            hoverPopUp.remove();
          }
        });
      }

      if (data.click) {
        const clickPopUp = new mapboxgl.Popup({ closeButton: true, closeOnClick: true, offset: 5 });
        map.on('click', data.id, (event) => {
          console.log(data);
          //.split('/')[1].replace(/[^a-z -]/gi, '');
          populateSideInfoDisplay(event, data);
          clickPopUp
            .setLngLat(event.lngLat)
            .setDOMContent(createClickedFeaturePopup (`${data.name}PopUp`, event, null))
            .addTo(map);
        });
      }

      if (data.name) {
        transpilledOptions.name = data.name;
      }
      // mongoDB id
      if (data._id) {
        transpilledOptions.metadata._id = data._id;
      }
      // type of map graphic: line, fill, circle
      if (data.type) {
        transpilledOptions.type = type.type;
        if (type.type === 'circle') {
          transpilledOptions.paint[`circle-radius`] = parseFloat(type.width);
        }
        if (type.type === 'line') {
          transpilledOptions.paint[`line-width`] = parseFloat(type.width);
        }
      }

      if (data["source layer"]) {
        transpilledOptions['source-layer'] = data["source layer"];
      }

      if (data.database || data["layer source url"]) {
        transpilledOptions.source.url = data.database || data["layer source url"];
      }

      if (!layersMongoId.includes(data._id)) {
        layersMongoId.push(data._id);
      }
      if (layersMapboxId[layersMongoId.length - 1]) {
        layersMapboxId[layersMongoId.length - 1].push(layerId);
      } else {
        layersMapboxId.push([layerId]);
      }

      map.addLayer(transpilledOptions);
      map.on('sourcedata', () => {
        resolve();
      });
    });
    return promise;
  }
}