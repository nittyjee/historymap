const baseURL = 'https://encyclopedia.nahc-mapping.org';

function LayerManager (parentElement) {
  // "this" in the function isn't the outer constructor, so we have to point to that:
  const layerManager = this;
  // Arrays to store and manage layers:
  const layersMongoId = [];
  const layersMapboxId = [];
  // Maps is defined in ~/historymap/nodeServer/static/js/mapboxGlCalls.js
  const mapNames = Object.keys(maps);
  const layerControls = document.querySelector('.layerControls');
  let eventsAdded = false;

  let layerForm;
  let mapForm;

  function fetchLayer (layerId) {
    // const checkbox = document.querySelector(`[name="${layerId}"]`);
    const promise = new Promise((resolve, reject) => {
      if (layerManager.returnLayers().includes(layerId)) {
        layerManager.toggleVisibility();
        resolve();
      } else {
        xhrPostInPromise({ _id: layerId }, './getLayerById').then((layerData) => {
          const parsedLayerData = JSON.parse(layerData);
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
    const promise = new Promise((resolve, reject) => {
      if (eventsAdded) { layerControls.removeEventListener('click'); }
      layerControls.addEventListener('click', (e) => {
        eventsAdded = true;
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
            // zoomToLayer(zoomIcon);
            const zoomIcon = e.target.parentElement.querySelector('.zoomToLayer');
            zoomIcon.classList.remove('hiddenZoom');
          });
        }

        if (e.target.classList.contains('featureGroup')) {
          const featureGroupChecked = e.target.parentElement.querySelector('.featureGroup');
          const layers = e.target.parentElement.querySelectorAll('.fetchLayer');
          e.target.parentElement.querySelector('.zoomToFeatureGroup').classList.remove('hiddenZoom');
          const promises = [];
          layers.forEach((layer, i) => {
            const zoomIcon = layer.parentElement.querySelector('.zoomToLayer');
            zoomIcon.classList.remove('hiddenZoom');

            promises.push(fetchLayer(layer.name));
            if (i === layers.length - 1) {
              Promise.all(promises).then(() => {
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
          if (e.target.dataset.featuregroup === 'Current Satellite') {
            return;
          }
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
      });
      resolve('layer control events attached');
    });
    return promise;
  };

  this.resetLayerEditor = () => {
    return resetLayerEditorFn();
  };

  function resetLayerEditorFn () {
    const promise = new Promise((resolve, reject) => {
      layerForm.remove();
      layerManager.generateAddLayerForm().then(() => {
        layerManager.layerControlEvents();
        layerForm.classList.remove('hiddenContent');
        resolve('layer form reset');
      });
    });
    return promise;
  }

  this.populateLayerEditor = (data) => {
    const promise = new Promise((resolve, reject) => {
      resetLayerEditorFn().then(() => {
        layerForm.querySelector('.title').textContent = `Editing Layer with id ${data._id}`;
        layerForm.querySelector('.title').classList.add('highlight');
        layerForm.dataset._id = data._id;
        layerForm.scrollIntoView(false);
        layerForm.classList.remove('hiddenContent');
        const keys = Object.keys(data);
        const values = Object.values(data);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i].replaceAll(' ', '_');
          if (key === '_id') {
            continue;
          }
          if (key === 'target_map') {
            values[i].forEach((mapName) => {
              layerForm.querySelector(`#${mapName}`).checked = true;
              layerForm.querySelector(`#${mapName}`).classList.add('highlight');
            });
          }
          if (key === 'type') {
            values[i].forEach((type) => {
              const checkbox = layerForm.querySelector(`[data-layer-type="${type.type}"]`);
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

          const correspondingInput = layerForm.querySelector(`input[type="text"]#${key}`);
          if (correspondingInput) {
            correspondingInput.value = values[i];
            correspondingInput.classList.add('highlight');
          }

          const checkbox = layerForm.querySelector(`input[type="checkbox"]#${key}`);
          if (checkbox) {
            const actions = ['click', 'hover', 'sidebar', 'sliderCheckBox'];
            if (actions.includes(key)) {
              if (values[i] === 1) {
                checkbox.checked = true;
                checkbox.classList.add('highlight');
              }
            }
          }
          if (i === keys.length - 1) {
            resolve();
          }
        }
      });
    });
    return promise;
  };

  this.returnLayers = () => {
    return layersMongoId;
  };

  this.resetStyleEditor = () => {
    return resetStyleEditorFn();
  };

  function resetStyleEditorFn () {
    mapForm.remove();
    layerManager.generateAddMapForm().then(() => {
      layerManager.layerControlEvents();
      mapForm.classList.remove('hiddenContent');
    });
  }

  this.populateStyleEditor = (data) => {
    // Reseting this editor isn't necessary because all the field are the same for each Object. 
    mapForm.querySelector('.title').textContent = `Editing style with id ${data._id}`;
    mapForm.querySelector('.title').classList.add('highlight');
    mapForm.dataset._id = data._id;
    mapForm.classList.remove('hiddenContent');
    mapForm.scrollIntoView(false);
    const keys = Object.keys(data);
    const values = Object.values(data);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i].replaceAll(' ', '_');
      if (key === '_id') {
        continue;
      }
      console.warn('classes should be used rather than ids for multiple mutable content');
      const correspondingInput = mapForm.querySelector(`#${key}`);
      if (correspondingInput) {
        correspondingInput.value = values[i];
        correspondingInput.classList.add('highlight');
      } else {
        if (key === 'style_source_url') {
          mapForm.querySelector('#style_link').value = values[i];
          mapForm.querySelector('#style_link').classList.add('highlight');
        }
        if (key === 'feature_group') {
          mapForm.querySelector('#title').value = values[i];
          mapForm.querySelector('#title').classList.add('highlight');
        }
      }
    }
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
  this.generateAddMapForm = () => {
    const promise = new Promise((resolve, reject) => {
      /* A map is a style */
      const mapData = {};

      function textInputGenerator (fieldName, target, description) {
        const nameLabel = document.createElement('label');
        nameLabel.htmlFor = fieldName;
        nameLabel.innerHTML = `${fieldName}: `;
        target.appendChild(nameLabel);

        const name = document.createElement('input');
        name.setAttribute('type', 'text');
        name.id = fieldName.replaceAll(' ', '_');
        target.appendChild(name);

        name.title = description;

        name.addEventListener('input', () => {
          mapData[fieldName] = name.value;
        });

        const br = document.createElement('br');
        target.appendChild(br);
      }

      mapForm = document.createElement('form');
      mapForm.classList.add('hiddenContent');
      parentElement.appendChild(mapForm);

      mapForm.classList.add('styleform');
      const title = document.createElement('h2');
      title.classList.add('title');
      title.textContent = 'Add Map';
      mapForm.appendChild(title);

      const fields = ['title', 'borough', 'style link', 'drupal node id', 'ease to point'];
      const titleDescriptors = [
        'Title is the name of a map e.g. "Stokes Key to Castello Plan"',
        'Borogh refers to a group of maps "1660|Castello Plan"',
        'The link to the style e.g. "mapbox://styles/nittyjee/ck7piltib01881ioc5i8bel7m"',
        'The node id is the drupal node you wish to display in the modal given a click on the info button e.g. "10056"',
        'Ease to point is a decimal coordinate pair (longitude, latitude) e.g -74.01255,40.704882'
      ];

      fields.forEach((fieldName, i) => {
        textInputGenerator(fieldName, mapForm, titleDescriptors[i]);
      });

      const submit = document.createElement('input');
      submit.setAttribute('type', 'submit');
      submit.value = 'submit map style';
      mapForm.appendChild(submit);

      const hideButton = document.createElement('button');
      hideButton.textContent = 'hide form';
      mapForm.appendChild(hideButton);
      hideButton.addEventListener('click', () => {
        mapForm.classList.add('hiddenContent');
        mapForm.classList.remove('displayContent');
      });

      const reset = document.createElement('button');
      reset.textContent = 'reset form';
      reset.classList.add('reset');
      mapForm.appendChild(reset);
      reset.addEventListener('click', (e) => {
        e.preventDefault();
        resetStyleEditorFn();
      });

      mapForm.addEventListener('submit', (event) => {
        event.preventDefault();
        fields.forEach((id, i) => {
          mapData[id] = mapForm.querySelector(`#${id.replaceAll(' ', '_')}`).value;
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
          if (mapForm.dataset._id) {
            mapData._id = mapForm.dataset._id;
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

      resolve('map form added');
    });
    return promise;
  };

  this.generateAddLayerForm = () => {
    const promise = new Promise((resolve, reject) => {
      function textInputGenerator (fieldName, target, description) {
        const nameLabel = document.createElement('label');
        nameLabel.htmlFor = fieldName;
        nameLabel.innerHTML = `${fieldName}: `;
        target.appendChild(nameLabel);

        const name = document.createElement('input');
        name.setAttribute('type', 'text');
        name.id = fieldName.replaceAll(' ', '_');
        name.title = description;
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
        layerForm.appendChild(nameLabel);
        const name = document.createElement('input');
        name.setAttribute('type', 'checkbox');
        name.id = checkboxName;
        layerForm.appendChild(name);
        name.addEventListener('click', () => {
          if (name.checked === true) {
            data[checkboxName] = 1;
          } else {
            data[checkboxName] = 0;
          }
        });

        const br = document.createElement('br');
        layerForm.appendChild(br);
      }

      function generateAddToMapCheckbox (checkboxName) {
        const nameLabel = document.createElement('label');
        nameLabel.htmlFor = checkboxName;
        nameLabel.innerHTML = `Add to "${checkboxName}" map: `;
        layerForm.appendChild(nameLabel);
        const name = document.createElement('input');
        name.setAttribute('type', 'checkbox');
        name.classList.add('addToMap');
        name.id = checkboxName;
        name.dataset.targetMap = checkboxName;
        layerForm.appendChild(name);

        const br = document.createElement('br');
        layerForm.appendChild(br);
      }

      function generateLayersTypeCheckbox (checkboxName) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('typeBox');
        layerForm.appendChild(wrapper);
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
        layerForm.appendChild(select);

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

      layerForm = document.createElement('form');
      layerForm.classList.add('hiddenContent');
      parentElement.appendChild(layerForm);

      const data = {};
      data['target map'] = [];
      data.type = [];

      layerForm.classList.add('layerform');
      const title = document.createElement('h2');
      title.classList.add('title');
      title.textContent = 'Add Layer';
      layerForm.appendChild(title);

      const textFields = [
        'name',
        'source layer',
        'layer source url',
        'feature group',
        'drupal node id',
        // 'borough to which the layer belongs'
        'borough'
      ];

      const titleDescriptors = [
        'The name that appears beside the feature group toggle checkbox e.g. "Information", "Lines", "Lenape trails"',
        'The source layer e.g. lenape_trails-9n6muf',
        'The source URL e.g. mapbox://nittyjee.4kio957z',
        'Feature Group: The group to which this layer bellongs e.g. 1609|Manahatta',
        'The article nid you wish to display in the modal when the info button for the feature group is clicked',
        'The borough where the feature group resides'
      ];

      textFields.forEach((fieldName, i) => {
        textInputGenerator(fieldName, layerForm, titleDescriptors[i]);
      });

      const types = ['circle', 'line', 'fill'];
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
      layerForm.appendChild(submit);

      const hideButton = document.createElement('button');
      hideButton.textContent = 'hide form';
      layerForm.appendChild(hideButton);
      hideButton.addEventListener('click', (e) => {
        e.preventDefault();
        layerForm.classList.add('hiddenContent');
        layerForm.classList.remove('displayContent');
      });

      const reset = document.createElement('button');
      reset.textContent = 'reset form';
      reset.classList.add('reset');
      layerForm.appendChild(reset);
      reset.addEventListener('click', (e) => {
        e.preventDefault();
        resetLayerEditorFn();
      });

      layerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let checkedTypes = 0;
        const types = layerForm.querySelectorAll('.layerType');

        for (let i = 0; i < types.length; i++) {
          const checkbox = types[i];
          if (checkbox.checked === true) {
            checkedTypes++;
          }
          if (checkedTypes > 1) {
            alert(`At this time only one data type can be added for each source. To add
            another data type a new layer has to be added.`);
            return;
          }
        }
        /* n.b. note that only replacing spaces in fields might cause a future bug if
          other input types are added with a space.
        */
        textFields.forEach((id) => {
          data[id] = layerForm.querySelector(`#${id.replaceAll(' ', '_')}`).value;
        });

        const addToMapCheckboxes = layerForm.querySelectorAll('.addToMap');
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

        layerForm.querySelectorAll('.layerType').forEach((type, i) => {
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

        if (layerForm.dataset._id) {
          data._id = layerForm.dataset._id;
        }

        saveLayer(data).then(() => {
          createLayer(data);
        });
      });

      resolve('form generated');
    });
    return promise;
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
            .setDOMContent(createHoverPopup(data, event))
            .addTo(map);
        });

        map.on('mousemove', data.id, (event) => {
          map.getCanvas().style.cursor = 'pointer';
          hoverPopUp
            .setLngLat(event.lngLat)
            .setDOMContent(createHoverPopup(data, event));
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
          populateSideInfoDisplay(event, data);
          clickPopUp
            .setLngLat(event.lngLat)
            .setDOMContent(createHoverPopup(data, event))
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
