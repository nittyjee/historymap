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
 * @param {string} string
 * @returns The same string with spaces replaced by an undescore
 * @description Small utility to declutter code.
 */
function removeSpaces (string) {
  return string.replaceAll(' ', '_');
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

  if(dutchLot){
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
  let mapBase;
  // For app owners to edit things, must be instantiated:
  this.layerControlEvents = () => {
    layerControls.addEventListener('click', (e) => {
      if (e.target.classList.contains('toggleVisibility')) {
        const hiddenContent = e.target.parentElement.querySelector('.hiddenContent');
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
        if (this.returnLayers().includes(e.target.name)) {
          this.toggleVisibility(e.target.name);
          return;
        }
        xhrPostInPromise({ _id: e.target.name }, './getLayerById').then((layerData) => {
          const parsedLayerData = JSON.parse(layerData);
          this.addLayer(parsedLayerData);
        });
      }

      if (e.target.classList.contains('editLayer')) {
        xhrPostInPromise({ _id: e.target.dataset._id }, './getLayerById').then((layerData) => {
          const parsedLayerData = JSON.parse(layerData);
          this.populateLayerEditor(parsedLayerData);
        });
      }

      if (e.target.classList.contains('deleteLayer')) {
        if (window.confirm('Are you sure you want to delete this layer?')) {
          xhrPostInPromise({ id: e.target.dataset._id }, './deleteLayer').then((response) => {
            el.parentElement.parentElement.remove(el.parentElement);
            alert(response);
          });
        }
      }
    });
  };

  this.resetLayerEditor = () => {
    return resetLayerEditorFn();
  };

  // This in the function isn't the outer constructor, so we have to point to that:
  const layerManager = this;
  function resetLayerEditorFn () {
    layerFormParent.innerHTML = '';
    layerManager.generateAddLayerForm(layerFormParent);
    layerManager.generateAddMapForm(layerFormParent);
    layerManager.layerControlEvents();
  }

  this.populateLayerEditor = (data) => {
    layerFormParent.querySelector('.title').textContent = `Editing Layer with id ${data._id}`;
    layerFormParent.querySelector('.title').classList.add('highlight');
    layerFormParent.dataset._id = data._id;
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

  /**
   * @param {String} mongoLayerId String with the DB id.
   * @description the IDs passed to mapbox contain information including the
   * name of the map to which they are added:
   *
   * Manhattan-1609|Manhattan-Lenape trails-line-beforeMap
   * Split by "-" the different parts are: borough, feature group, layer type, map
   */

  this.toggleVisibility = (mongoLayerId) => {
    const index = layersMongoId.indexOf(mongoLayerId);
    const mapboxMapIds = layersMapboxId[index];

    for (let i = 0; i < mapboxMapIds.length; i++) {
      const mapboxId = mapboxMapIds[i];
      const targetMapText = mapboxId.split('-')[mapboxId.split('-').length - 1];
      const targetMap = maps[targetMapText];
      const exists = targetMap.getLayer(mapboxId);
      if (!exists) {
        continue;
      }
      const visibility = targetMap.getLayoutProperty(mapboxId, 'visibility');
      if (visibility === 'none') {
        targetMap.setLayoutProperty(mapboxId, 'visibility', 'visible');
      } else {
        targetMap.setLayoutProperty(mapboxId, 'visibility', 'none');
      }
    }
  };

  this.generateAddMapForm = (parentElement) => {
    const data = {};

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

    mapBase = document.createElement('form');
    parentElement.appendChild(mapBase);

    mapBase.classList.add('layerform');
    const title = document.createElement('h2');
    title.classList.add('title');
    title.textContent = 'Add Map';
    mapBase.appendChild(title);

    const fields = ['title', 'id', 'style'];
    fields.forEach(fieldName => {
      textInputGenerator (fieldName, mapBase);
    });

    const submit = document.createElement('input');
    submit.setAttribute('type', 'submit');
    submit.textContent = 'submit';
    mapBase.appendChild(submit);

    mapBase.addEventListener('submit', (event) => {
      event.preventDefault();
      fields.forEach((id) => {
        data[id] = mapBase.querySelector(`#${id.replaceAll(' ', '_')}`).value;
      });

    //  createMap(data);
    });
  };

  /*
    function createMap (data) {
      const codeForMap = `var ${data.title}Map = new mapboxgl.Map({
        container: '$',
        style: ${data.style},
        center: [0, 0],
        hash: true,
        zoom: 0,
        attributionControl: false
      });`
      // toggleModal (codeFor);
    }
  */

  this.generateAddLayerForm = (parentElement) => {
    layerFormParent = document.createElement('form');
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

      layerFormParent.querySelectorAll('.addToMap').forEach((mapCheckbox, i) => {
        if (i === 0) {
          data['target map'].length = 0;
        }
        if (mapCheckbox.checked) {
          data['target map'].push(mapCheckbox.dataset.targetMap);
        }
      });

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
    // If the layer already exists as document in the DB, don't save:
    /*
      if (!data._id) {
          saveLayer(data);
        }

      // If the layer exits in the current session, don't make it again:
      if (layersMongoId.includes(data._id)) {
        return;
      }
    */

    // There can be more than one target map:
    data['target map'].forEach((target) => {
      // Multiple geometry types can also be handled through the same function:
      data.type.forEach((type) => {
        /* This is moved to its own function to make it easier to read and understand
        since a layer can have several representation on several maps */
        tanspileAndAddLayer(target, type, data);
      });
    });
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
        const targetMapText = mapboxId.split('-')[mapboxId.split('-').length - 1];
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
    const map = maps[targetMap];
    const layerId = `${data.borough}-${data['feature group']}-${data.name}-${type.type}-${targetMap}`;
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
      map.on('mouseenter', data.id, (event) => {
        map.getCanvas().style.cursor = 'pointer';
        const hoverPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 });
        hoverPopUp
          .setLngLat(event.lngLat)
          .setDOMContent(createHoverPopup(`${data.name}PopUp`, event, data.name))
          .addTo(map);

        map.on('mouseleave', data.id, () => {
          map.getCanvas().style.cursor = '';
          if (hoverPopUp.isOpen()) {
            hoverPopUp.remove();
          }
        });
      });
    }

    if (data.click) {
      const clickPopUp = new mapboxgl.Popup({ closeButton: true, closeOnClick: true, offset: 5 });
      map.on('click', data.id, (event) => {
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
  }
}

function toggleModal (jsCode) {
  const modal = document.querySelector('.modal');
  const header = modal.querySelector('.modal-header h1');
  const content = modal.querySelector('.modal-content');
  const close = modal.querySelector('#close');
  header.textContent = 'Code:';
  content.textContent = jsCode;
  document.querySelector('.modal').style.display = 'flex';
  close.addEventListener('click', () => {
    document.querySelector('.modal').style.display = 'none';
    header.textContent = '';
    content.textContent = '';
  });
}
