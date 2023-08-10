const baseURL = 'https://encyclopedia.nahc-mapping.org';

function LayerManager(parentElement) {
	// "this" in the function isn't the outer constructor, so we have to point to that:
	const layerManager = this;
	// Arrays to store and manage layers:
	const layersMongoId = [];
	const layersMapboxId = [];
  const layerDatas = [];
	// Maps is defined in ~/historymap/nodeServer/static/js/mapboxGlCalls.js
	const mapNames = Object.keys(maps);
	const layerControls = document.querySelector('.layerControls');
	let eventsAdded = false;

	let layerForm;
	let mapForm;

	function fetchLayer(layerId) {
		// const checkbox = document.querySelector(`[name="${layerId}"]`);
		const promise = new Promise((resolve, reject) => {
			if (layerManager.returnLayers().includes(layerId)) {
				layerManager.toggleVisibility();
				resolve();
			} else {
				xhrPostInPromise({ _id: layerId }, './getLayerById').then((layerData) => {
					const parsedLayerData = JSON.parse(layerData);
          layerDatas.push(parsedLayerData);
					createLayer(parsedLayerData).then(() => {
						// layer added
						resolve();
					});
				});
			}
		});
		return promise;
	}

	function zoomToLayer(zoom) {
		zoom.classList.remove('hiddenZoom');
		window.setTimeout(() => {
			const mapboxId = zoom.dataset.id;
			const map = mapboxId.split('/')[mapboxId.split('/').length - 1];
			maps[map].fitBounds(maps[map].getSource(mapboxId).bounds, { bearing: 0, padding: 15 });
		}, 500);
	}

  function getSourceCenter (bounds) {
    return [((bounds[2] + bounds[0]) / 2), ((bounds[3] + bounds[1]) / 2)];
  }

  function zoomToFeatureGroup (layers) {
    const group = [];
    layers.forEach((layer, i) => {
      const mapboxId = layer.parentElement.querySelector('.zoomToLayer').dataset.id;
      const map = mapboxId.split('/')[mapboxId.split('/').length - 1];
      const bounds = maps[map].getSource(mapboxId).bounds;

      let zoom;
      let bearing;
      let padding;
      layerDatas.forEach((layer) => {
        if (layer['feature group'] === mapboxId.split('/')[1]) {
          zoom = layer.zoom || 16.34;
          bearing = layer.bearing || -51.3;
          padding = layer.padding || 0;
        }
      });

      if (bounds) {
        group.push(bounds.slice(0, 2));
        group.push(bounds.slice(2));
      }
      if (i === layers.length - 1) {
        const groupBounds = determineBounds(group);
        maps[map].flyTo({
          center: getSourceCenter(groupBounds),
          zoom: zoom,
          speed: 0.5,
          bearing: bearing
        });
      }
    });

		function determineBounds(coords) {
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
						plusMinus.classList.remove('fa-minus-square');
						plusMinus.classList.add('fa-plus-square');
						hiddenContent.classList.remove('displayContent');
						return;
					}
					hiddenContent.classList.add('displayContent');
					plusMinus.classList.add('fa-minus-square');
					plusMinus.classList.remove('fa-plus-square');
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
          const bounds = maps[map].getSource(mapboxId).bounds;

          /* Both maps are the same size, so it makes no difference which map the function is
          called on */
          layerDatas.forEach((layer) => {
            if (layer['feature group'] === mapboxId.split('/')[1]) {
              maps[map].flyTo({
                center: getSourceCenter(bounds),
                zoom: layer.zoom,
                speed: 0.5,
                bearing: layer.bearing
              });
              /*
              maps[map].fitBounds(maps[map].getSource(mapboxId).bounds, { bearing: layer.bearing || 0, padding: layer.padding || 0 });
              //if (layer.zoom) { maps[map].setZoom(layer.zoom); }
              setTimeout(() => {
                if (zoom) { maps[map].setZoom(zoom); }
              }, 500);

              maps[map].getSource(mapboxId).getCenter
              */
            }
          });
        }

        if (e.target.classList.contains('easeToPoint')) {
          const point = JSON.parse(e.target.dataset.easetopoint);
          const bearing = (e.target.dataset.bearing || isFinite(e.target.dataset.bearing)) ? parseFloat(e.target.dataset.bearing) : 0;
          const zoom = (e.target.dataset.zoom || isFinite(e.target.dataset.zoom)) ? parseFloat(e.target.dataset.zoom) : 16;
          /* Both maps are the same size, so it makes no difference which map the function is
          called on */
          maps.beforeMap.flyTo({
            center: point,
            zoom,
            speed: 0.5,
            bearing
          });
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

	function resetLayerEditorFn() {
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

	function resetStyleEditorFn() {
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

      const fields = ['title', 'borough', 'style link', 'drupal node id', 'ease to point', 'bearing', 'zoom'];
      const titleDescriptors = [
        'Title is the name of a map e.g. "Stokes Key to Castello Plan"',
        'Borogh refers to a group of maps "1660|Castello Plan"',
        'The link to the style e.g. "mapbox://styles/nittyjee/ck7piltib01881ioc5i8bel7m"',
        'The node id is the drupal node you wish to display in the modal given a click on the info button e.g. "10056"',
        'Ease to point is a decimal coordinate pair (longitude, latitude) e.g -74.01255,40.704882',
        'Bearing in decimal degrees e.g. -51.3',
        'Zoom level 0-22'
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
			function saveStyle(data) {
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



	function layerTypeCheckbox (checkboxName) {
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
	
		return typeBoxText;
	  }
	

	  // LIKE YOU DO WITH PAINT OPTIONS BELOW, MAYBE YOU CAN DO FOR LAYOUT OPTIONS FOR TEXT-SIZES
	  function generateLabelLayerInputs (checkboxName) {
		const typeBoxText = layerTypeCheckbox(checkboxName);
		// anywhere an expression or function is used, the text will have to be interpolated as parsed json
		const paintProperties = ['color', 'text-color', 'text-halo-color', 'text-halo-width', 'text-halo-blur', 'text-opacity'];
		paintProperties.forEach((fieldName) => {
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

			function generateCheckbox(checkboxName) {
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

			function generateAddToMapCheckbox(checkboxName) {
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

			function generateLayersTypeCheckbox(checkboxName) {
				const typeBoxText = layerTypeCheckbox(checkboxName);

				const appearance = ['color', 'opacity', 'width', 'blur'];
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

			function dropDownGenerator(options) {
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
				'borough',
				'pop up color',
				'pop up border color',
				'info div color',
				'info div border color',
				'padding',
				'bearing',
				'zoom'
			];

			const titleDescriptors = [
				'The name that appears beside the feature group toggle checkbox e.g. "Information", "Lines", "Lenape trails"',
				'The source layer e.g. lenape_trails-9n6muf',
				'The source URL e.g. mapbox://nittyjee.4kio957z',
				'Feature Group: The group to which this layer bellongs e.g. 1609|Manahatta',
				'The article nid you wish to display in the modal when the info button for the feature group is clicked',
				'The borough where the feature group resides',
				'The color for (typically a hex value) for the pop up',
				'The color for (typically a hex value) for the border on the pop up',
				'The color for (typically a hex value) for the info slider',
				'The color for (typically a hex value) for the border on the info slider',
				'The bearing to display the feature group - a decimal representation of degrees, e.g. -51.4',
				'Padding can be ignored if using zoom, otherwise provides a minimum spacing from any edge of the map, to the group',
				'The zoom level 0-22, accepts decimals'
		
			  ];
		
			  textFields.forEach((fieldName, i) => {
				textInputGenerator(fieldName, layerForm, titleDescriptors[i]);
			});

			const types = ['circle', 'line', 'fill'];
			types.forEach((type) => {
				generateLayersTypeCheckbox(type);
			});

			generateLabelLayerInputs('labels');

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

					function typeCompile (type) {
						const typeObj = {};
						typeObj.type = type.dataset.layerType;
						const values = type.parentElement.querySelector('.typeBoxText').querySelectorAll('[type="text"]');
						for (let i = 0; i < values.length; i++) {
						  const input = values[i];
						  // checks is text is a number
						  const value = (input.value === !null || isFinite(input.value)) ? parseFloat(input.value) : input.value;
						  typeObj[input.dataset.typeStyle] = value;
						  if (i === values.length - 1) {
							return typeObj;
						  }
						}
					  }

					if (type.checked) {
						const typeFeature = typeCompile(type);
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

	function createLayer(data) {
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
	function saveLayer(data) {
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
		// const filter = ['all', ['<=', 'DayStart', minDate], ['>=', 'DayEnd', minDate]];

		const filter = ['all',
		['<=', 'DayStart', minDate],
		['>=', 'DayEnd', minDate]
		];
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


	//LIKE YOU DO WITH PAINT OPTIONS HERE, MAYBE YOU CAN DO LAYOUT OPTIONS FOR TEXT-SIZE FOR LABELS LAYERS
	function paintOptions (type) {
		if (type.type === 'labels') {
		  const paint = {
			'text-color': type['text-color'],
			'text-halo-color': type['text-halo-color'],
			'text-halo-width': type['text-halo-width'],
			'text-halo-blur': type['text-halo-blur'],
			'text-opacity': type['text-opacity']
		  };
		  return paint;
		}
		const defaultPaint = {
		  [`${type.type}-color`]: (type.color) ? type.color : '#AAAAAA',
		  [`${type.type}-opacity`]: (type.opacity)
			? ['case', ['boolean', ['feature-state', 'hover'], false], 0.8, parseFloat(type.opacity)]
			: ['case', ['boolean', ['feature-state', 'hover'], false], 0.8, 0.5]
		};
		return defaultPaint;
	  }




	function tanspileAndAddLayer(targetMap, type, data) {
		const promise = new Promise((resolve, reject) => {
			const map = maps[targetMap];
			const layerId = `${data.borough}/${data['feature group']}/${data.name}/${type.type}/${targetMap}`;
			data.id = layerId;

			const transpilledOptions = {
				id: layerId,
				type: (type.type === 'labels') ? 'symbol' : type.type,
				metadata: { _id: '' },
				source: {
					// url is tileset ID in mapbox:
					url: '',
					type: 'vector'
				},
				//THIS MAY BE WHERE YOU CAN HAVE "LAYOUT" OPTIONS FOR TEXT-SIZE FOR LABELS LAYERS, LIKE YOU DO FOR "PAINT" OPTIONS BELOW
				layout: {
					visibility: 'visible' // || none
				},
				// called 'source name'
				'source-layer': '',
				paint: paintOptions(type)
					// filter: ["all", ["<=", "DayStart", sliderConstructor.returnMinDate()], [">=", "DayEnd", sliderConstructor.returnMaxDate()]]
			};


			/*ONLY ONE OF THESE WORK AT A TIME. FIGURE OUT HOW TO MAKE ALL OF THEM WORK*/

			//Native Labels
			if (type.type === 'labels') {
				transpilledOptions.layout['text-field'] = '{name}';
				 transpilledOptions.layout['text-offset'] = [0,1],
				 transpilledOptions.layout['text-size'] = { stops: [ [0, 4], [22, 34] ] }
			  }
			
			/*

			//Settlements
			if (type.type === 'labels') {
			transpilledOptions.layout['text-field'] = '{corr_label}';
				transpilledOptions.layout['text-offset'] = [0,1],
				transpilledOptions.layout['text-size'] = { stops: [ [0, 4], [22, 21] ] }
			}
			
			//Information of Interest
			if (type.type === 'labels') {
			transpilledOptions.layout['text-field'] = '{Label}';
				transpilledOptions.layout['text-offset'] = [0,1],
				transpilledOptions.layout['text-size'] = { stops: [ [0, 4], [22, 21] ] }
			}


			
			*/

			//NOTE - DID NOT IMPORT MANY CHANGES BELOW YET - APPEARS TO BE MOSTLY AROUND HOVERING AND TIMELINE - 07/28/2023

if (data.hover) {
  let hoveredFeature = null; // Initialize a variable to keep track of the currently hovered feature
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

    if (event.features.length > 0) {
      if (hoveredFeature !== null && hoveredFeature !== event.features[0].id) {
        map.setFeatureState(
          { source: layerId, sourceLayer: data['source layer'], id: hoveredFeature },
          { hover: false }
        );
      }
      hoveredFeature = event.features[0].id;
      map.setFeatureState(
        { source: layerId, sourceLayer: data['source layer'], id: hoveredFeature },
        { hover: true }
      );
    }
  });

  map.on('mouseleave', data.id, () => {
    map.getCanvas().style.cursor = '';
    if (hoveredFeature !== null) {
      map.setFeatureState(
        { source: layerId, sourceLayer: data['source layer'], id: hoveredFeature },
        { hover: false }
      );
    }
    hoveredFeature = null; // Reset the hovered feature
    if (hoverPopUp.isOpen()) {
      hoverPopUp.remove();
    }
  });
}


if (data.click) {
  const clickPopUpA = new mapboxgl.Popup();
  const clickPopUpB = new mapboxgl.Popup();
  
  const closePopups = () => {
    clickPopUpA.remove();
    clickPopUpB.remove();
  };
  
  map.on('click', data.id, (event) => {
    console.log(data);
    
    populateSideInfoDisplay(event, data);
    
    clickPopUpB
      .setLngLat(event.lngLat)
      .setDOMContent(createHoverPopup(data, event))
      .addTo(maps.beforeMap);
      
    clickPopUpA
      .setLngLat(event.lngLat)
      .setDOMContent(createHoverPopup(data, event))
      .addTo(maps.afterMap);
  });
  
  clickPopUpA.on('close', closePopups);
  clickPopUpB.on('close', closePopups);
}


			if (data.name) {
				transpilledOptions.name = data.name;
			}
			// mongoDB id
			if (data._id) {
				transpilledOptions.metadata._id = data._id;
			}
			// type of map graphic: line, fill, circle
			// THIS MAY BE WHERE YOU CAN ADD MORE CONDITIONS FOR STYLING
			if (data.type) {
				//transpilledOptions.type = type.type;
				if (type.type === 'circle') {
					transpilledOptions.paint[`circle-radius`] = parseFloat(type.width);
				}
				if (type.type === 'line') {
					transpilledOptions.paint[`line-width`] = parseFloat(type.width);
					transpilledOptions.paint[`line-blur`] = parseFloat(type.blur);
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

      console.log(transpilledOptions);
      map.addLayer(transpilledOptions);
      map.on('sourcedata', () => {
        resolve();
      });
    });
    return promise;
  }
}
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
/**
 * @param {string} layerClass   -The layer being added e.g. 'infoLayerDutchGrantsPopUp'
 * @param {Object{}} event      -Event fired by Mapbox GL
 * @param {string} layerName    -The human readable layer name being added e.g. 'Dutch Grant Lot'
 * @description Function to create popup content when a feature is clicked and shows date information.
 * @returns A HTMLElemnt to use in the pop up
 */

function createClickedFeaturePopup (layerClass, event, layerName) {
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
}/**
  * Onload event
  * @event DOMContentLoaded
  * @fires MapConstructor#generateMap
  */

/*
 window.addEventListener('DOMContentLoaded', (event) => {
	const historyMap = new MapConstructor('#map', '80vh')
	  .generateMap()
	  .locateOnClick();
 });*/

/**
  * Onload event
  * @event DOMContentLoaded
  * @summary fires layer dialogue constructor
  * @fires Layer#generateAddLayerForm
  */

let layerControls;
let sliderConstructor;

document.addEventListener('DOMContentLoaded', () => {
	const parent = document.querySelector('.mapControls');

	layerControls = new LayerManager(parent);
	layerControls.generateAddLayerForm();
	layerControls.generateAddMapForm();
	layerControls.layerControlEvents();

	//TRIED INCORPORATING ON 7/29/2023 - BROKE THE TIMELINE. LIKELY NEED TO INVOLVE OTHER CODE:
  sliderConstructor = new SliderConstructor('1625-01-01T01:00:00.000Z', '1701-01-01T01:00:00.000Z', '1663-01-01T01:00:00.000Z');
	sliderConstructor.getDate();
	document.querySelectorAll('[data-featuregroup="Current Satellite"').forEach((radio) => {
		radio.click();
	});
	// For Firefox where checkboxes remain checked after reload:
	const layerControlsDiv = parent.querySelector('.layerControls');
	if (layerControlsDiv) {
		const checkboxes = layerControlsDiv.querySelectorAll('input[type="checkbox"]');
		checkboxes.forEach((checkbox, i) => {
			checkbox.checked = false;
		});
		document.querySelector('.layerToggle').querySelector('.toggleVisibility').click();
	}
});

// Global click event handler, others are defined in the "add layer" constructor:
document.querySelector('body').addEventListener('click', (e) => {
	// Hack to display content in modal from the encyclopedia
	if (e.target.classList.contains('toggleInfo')) {
		// refers to a node in Drupal:
		const modal = document.querySelector('.modal');
		const modalContent = document.querySelector('.modal-content');
		while (modalContent.firstChild) {
			modalContent.removeChild(modalContent.lastChild);
		}
		const nodeId = e.target.dataset.nodeid;
		const url = `https://encyclopedia.nahc-mapping.org/rendered-export-single?nid=${nodeId}`;
		xhrGetInPromise(null, url).then((content) => {
			let rmNewlines = JSON.parse(content)[0].rendered_entity.replace(/\n/g, '');
			rmNewlines = rmNewlines.replace(/<a (.*?)>/g, '');
			document.querySelector('.modal-content').insertAdjacentHTML('afterbegin', rmNewlines);
			modal.showModal();
		});
	}

	if (e.target.classList.contains('zoomToWorld')) {
		Object.values(maps).forEach((map) => {
			map.fitBounds([[-179, -59], [135, 77]]);
		});
	}

	if (e.target.classList.contains('displayStyleEditor')) {
		document.querySelector('.styleform').classList.remove('hiddenContent');
	}

	if (e.target.classList.contains('displayLayerEditor')) {
		document.querySelector('.layerform').classList.remove('hiddenContent');
	}

	if (e.target.classList.contains('hideMenuTab')) {
		// bad code trying to deal with hard code values
		const controlsDiv = document.querySelector('.mapControls');
		const mapContainer = document.querySelector('.mapContainer');
		const mapsInContainter = mapContainer.querySelectorAll('.map');
		if (e.target.textContent === '⏴') {
			controlsDiv.classList.add('hiddenControls');
			e.target.textContent = '⏵';
			e.target.style.left = '0px';
		} else {
			controlsDiv.classList.remove('hiddenControls');
			e.target.textContent = '⏴';
			//e.target.style.left = controlsDiv.offsetWidth;
			e.target.style.left = '337px';
		}
	}

	if (e.target.classList.contains('close')) {
		const modal = document.querySelector('.modal');
		modal.close();
	}
});
function createTooltips() {
	let zoomIcons = document.querySelectorAll('.fa-crosshairs');
	let infoIcons = document.querySelectorAll('.fa-info-circle')
	let documentBody = document.querySelector('body');
	let div = document.createElement('div');
	div.textContent = "Zoom to Layer";
	div.classList.add('custom-tooltip');
	documentBody.append(div);
	for (let icon of zoomIcons) {

		icon.onmousemove = function (e) {
			var x = e.clientX,
				y = e.clientY;
			div.textContent = "Zoom to Layer";
			div.style.top = (y + 20) + 'px';
			div.style.left = (x + 20) + 'px';
			div.style.opacity = '1';
			div.style.visibility = 'visible';
		};
		icon.onmouseleave = function (e) {
			var x = e.clientX,
				y = e.clientY;
			div.style.top = (y + 20) + 'px';
			div.style.left = (x + 20) + 'px';
			div.style.opacity = '0';
			div.style.visibility = 'hidden';
		};
	}
	for (let icon of infoIcons) {

		icon.onmousemove = function (e) {
			var x = e.clientX,
				y = e.clientY;
			div.textContent = "Layer Info";
			div.style.top = (y + 20) + 'px';
			div.style.left = (x + 20) + 'px';
			div.style.opacity = '1';
			div.style.visibility = 'visible';
		};
		icon.onmouseleave = function (e) {
			var x = e.clientX,
				y = e.clientY;
			div.style.top = (y + 20) + 'px';
			div.style.left = (x + 20) + 'px';
			div.style.opacity = '0';
			div.style.visibility = 'hidden';
		};
	}
}
createTooltips();/**
 * @param {string} layerClass   -The layer being added e.g. 'infoLayerDutchGrantsPopUp'
 * @param {Object{}} event      -Event fired by Mapbox GL
 * @param {string} layerName    -The human readable layer name being added e.g. 'Dutch Grant Lot'
 * @description Function to create popup content. From a security perspective
 * when taking uset input it is preferable to set text view textContent:
 * https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent#differences_from_innertext
 * Using DOM mutation like this also means we can add events easilly.
 * @returns A HTMLElemnt to use in the pop up
 */

//*THIS IS WHERE WE CAN CHANGE THE MAP PROPERTIES!!

/*These are the properties:

prop1: To, name, [link], LOT2, OwnerName, Name, Label
prop2: Lot, [day1, year1], Address, corr_label
prop3: [day2, year2]
prop4: dutchlot

*/
function createHoverPopup(data, event) {
    const layerName = data['feature group'].replace(/[0-9|-]/gi, '');
    const layerClass = `${layerName}PopUp`;
    const popUpHTML = document.createElement('div');
    const mapboxFeatureProperties = ((event && event.features) && event.features[0].properties) || null;
    const lot = mapboxFeatureProperties.LOT2 || mapboxFeatureProperties.Lot || mapboxFeatureProperties.TAXLOT || null;
    
    popUpHTML.classList.add('hoverPopUp');

    if (layerName.includes("testing")) { // Check if layerName contains "testing"
        const name = mapboxFeatureProperties.name || null;
        const day1 = mapboxFeatureProperties.day1 || null;
        const year1 = mapboxFeatureProperties.year1 || null;
        const day2 = mapboxFeatureProperties.day2 || null;
        const year2 = mapboxFeatureProperties.year2 || null;
        const dutchlot = mapboxFeatureProperties.dutchlot || null;

        const nameElement = document.createElement('p');
        popUpHTML.appendChild(nameElement);
        nameElement.innerHTML = name + "<br>" +
                                "<b>Start:</b> " + day1 + ", " + year1 + "<br>" +
                                "<b>End:</b> " + day2 + ", " + year2 + "<br>" +
                                "<b>Lot Division:</b> " + dutchlot;
    } else {
        const personNameSt = mapboxFeatureProperties.name || mapboxFeatureProperties.Name || mapboxFeatureProperties.To || null;

        const personName = document.createElement('p');
        popUpHTML.appendChild(personName);
        personName.textContent = personNameSt;

        const lotName = document.createElement('b');
        popUpHTML.appendChild(lotName);
        lotName.textContent = (lot) ? `${layerName} Lot: ${lot}` : lot;

        if (lotName.textContent.includes('Castello')) {
            popUpHTML.classList.add('red');
        }
    }

    return popUpHTML;
}











/**
 * @param {string} string
 * @returns The same string with spaces replaced by an undescore
 * @description Small utility to declutter code.
 */
function removeSpaces(string) {
	return string.replaceAll(' ', '_');
}
mapboxgl.accessToken = 'pk.eyJ1Ijoibml0dHlqZWUiLCJhIjoid1RmLXpycyJ9.NFk875-Fe6hoRCkGciG8yQ';

const beforeMap = new mapboxgl.Map({
	container: 'before',
	style: 'mapbox://styles/nittyjee/cjooubzup2kx52sqdf9zmmv2j',
	center: [0, 0],
	hash: true,
	zoom: 0,
	attributionControl: false
});

const afterMap = new mapboxgl.Map({
	container: 'after',
	style: 'mapbox://styles/nittyjee/cjowjzrig5pje2rmmnjb5b0y2',
	center: [0, 0],
	hash: true,
	zoom: 0,
	attributionControl: false
});

const maps = { beforeMap, afterMap };
const container = '.mapContainer';

const compare = new mapboxgl.Compare(beforeMap, afterMap, container, {
	// Set this to enable comparing two maps by mouse movement:
	// mousemove: true
});

window.setTimeout(() => {
	Object.values(maps).forEach((map) => {
		map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');
		//ATTEPT TO INCORPORATE NEW CODE HERE ON 7/29/2023 - MADE IT SO SIDEBAR DIDN'T APPEAR AT ALL
		//LIKELY NEED TO ADD MORE CODE
    /**
     * @description An event when the map is clicked, but not a feature.
     * It's using a hack (checking the type of cursor). Seems to work with touch events in
     * preliminary tests. As per https://github.com/mapbox/mapbox-gl-js/issues/1209
     */
    map.on('click', (e) => {
      const cursorType = map.getCanvas().style.cursor;
      const hideTab = document.querySelector('.hideMenuTab');
      toggleSideInfo();
      if (cursorType !== 'pointer') {
        hideTab.click();
      }
    });
  });
}, 1000);
layersExplored = [];
layerContainers = [];
function toggleSideInfo () {
  const infoDisplay = document.querySelector('.sideInfoDisplay');
  if (infoDisplay.classList.contains('displayContent') || infoDisplay.innerHTML === '') {
    infoDisplay.classList.remove('displayContent');
    infoDisplay.classList.add('hiddenContent');
  } else {
    infoDisplay.classList.add('displayContent');
    infoDisplay.classList.remove('hiddenContent');
  }
}

function populateSideInfoDisplay (mapFeatureClickEvent, layerData) {
  let target;
  /**
   * The original code I wrote didn't contemplate multiple data (for each feature group)
   * as I though it was a bug. Two global variables were added, this could scoped in a constructor.
   */
  const infoDisplay = document.querySelector('.sideInfoDisplay');
  infoDisplay.classList.add('displayContent');
  infoDisplay.classList.remove('hiddenContent');

  if (layerData['info div color']) { infoDisplay.style.backgroundColor = layerData['info div color']; }
  if (layerData['info div border color']) { infoDisplay.style.borderColor = layerData['info div border color']; }

  infoDisplay.querySelectorAll('.infoDivAdded').forEach((div, i) => {
    div.style.order = 2;
  });
  // this block adds a single div per feature group:
  const featureGroup = layerData['feature group'];
  if (!layersExplored.includes(featureGroup)) {
    layersExplored.push(featureGroup);
    const newLayerContainer = document.createElement('div');
    newLayerContainer.classList.add('infoDivAdded');
    layerContainers.push(newLayerContainer);
    // infoDisplay.appendChild(newLayerContainer);
    target = newLayerContainer;
    infoDisplay.insertBefore(target, infoDisplay.children[0]);
  } else {
	//This error message sucked.
    //alert('writing to preexisting');
    const index = layersExplored.indexOf(featureGroup);
    target = layerContainers[index];
  }

  target.style.order = 1;

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
    target.insertAdjacentHTML('afterbegin', JSON.parse(content)[0].rendered_entity);
  });

  // makeCloseButton(target);
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
/**
 * This file contains attempts to deal with messy source data, and is used while those sources are
 * updated so that content gets fetched directly from Drupal, via a nid.
 */

// Called dutch_grant_lots_info in the original project:
let Dutch_Grants;
// Self instantiating on start up:
(async () => {
  // const result = await xhrGetInPromise({}, '/dutchLots');
  const result = await xhrGetInPromise({}, 'https://encyclopedia.nahc-mapping.org/grant-lots-export-properly');
  Dutch_Grants = JSON.parse(result);
})();

// Called taxlot_event_entities_info in the original project:
let Castello_Taxlots;
(async () => {
  const result = await xhrGetInPromise({}, 'https://encyclopedia.nahc-mapping.org/taxlot-entities-export');
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
      if (drupalDataName === 'Dutch_Grants') {
                lotTitle = lot.title;
            }
            /* Title in Taxlot, so not compatible in anyway with dutchLots:
      Why fuck would you put a title in an object in an array???
      title = [{ value: "Director General DWIC" }]. This is the alternative to separete functions... */
      if (drupalDataName === 'Castello_Taxlots') {
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

function populateSideInfoDisplayHack (event, data, target) {
/*  const target = document.querySelector('.sideInfoDisplay');
  target.classList.add('displayContent');
  target.classList.remove('hiddenContent');
  target.innerHTML = '';
/*
  const close = document.createElement('i');
  close.classList.add('fa', 'fa-window-close');
  close.style.float = 'right';
  close.style.cursor = 'pointer';
  close.title = 'Close';
  close.setAttribute('aria-hidden', 'true');
  close.addEventListener('click', () => {
    target.classList.remove('displayContent');
    target.classList.add('hiddenContent');
  });
  target.appendChild(close);*/

    // mapbox feature data
    const mapboxData = event.features[0].properties;

    const mapboxLot = mapboxData.Lot;
    // REGEXING labels shouldn't be necesssary
  const drupalDataName = data['feature group'].replace(/[^a-z ]/gi, '').replace(' ', '_');


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
    const start = (lotInDrupal.start)
      ? lotInDrupal.start
      : (mapboxData.day1 && mapboxData.year1) ? `${mapboxData.day1} ${mapboxData.year1}` : 'no date';
    makeParagraph('Start: ', start);

    const end = (lotInDrupal.end)
      ? lotInDrupal.end
      : (mapboxData.day2 && mapboxData.year2) ? `${mapboxData.day2} ${mapboxData.year2}` : 'no date';
    makeParagraph('End: ', end);

    const description = lotInDrupal.description || mapboxData.descriptio || 'no description';
    makeParagraph('Description: ', description);
    // Images are stored at yet another location...
    // Images should be progressive jpeg of webp...
    const images = lotInDrupal.images.split(',');
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

  function makeLink (link, textContent, descriptor) {
    const p = document.createElement('p');
    p.textContent = `${descriptor}`;
    p.classList.add('boldItalic');
    const a = document.createElement('a');
    a.setAttribute('href', `${baseURL}${link}`);
    a.setAttribute('target', '_blank');
    a.textContent = textContent;
    p.appendChild(a);
    target.appendChild(p);
  }

  function linkFromRawHTML (textContent, html) {
    const p = document.createElement('p');
    p.classList.add('boldItalic');
    p.textContent = textContent;
    p.insertAdjacentHTML('beforeend', html);
    const link = p.querySelector('a');
    const path = new URL(link.href).pathname;
    link.setAttribute('target', '_blank');
    link.href = `${baseURL}${path}`;
    target.appendChild(p);
  }

  function makeImage (link, textContent) {
    const img = document.createElement('img');
    img.setAttribute('src', link);
    target.appendChild(img);
  }

  function makeParagraph (descriptor, data) {
    const p = document.createElement('p');
    p.textContent = `${descriptor}`;
    p.classList.add('boldItalic');
    const span = document.createElement('span');
    p.appendChild(span);
    span.textContent = data;
    target.appendChild(p);
  }
}
function SliderConstructor (min, max, preSelection) {
  [...arguments].forEach((date) => {
    if (typeof date !== 'string' || date.length !== 24) {
      const err = new Error('One or more of the dates provided does not appear to be an ISO-8601 string e.g. "1643-01-01T01:00:00.000Z"');
      throw err;
    }
  });

  const minDate = new Date(min);
  const minDateYear = minDate.getFullYear();

  const maxDate = new Date(max);
  const maxDateYear = maxDate.getFullYear();

  const checkBounds = new Date(preSelection);
  if (checkBounds < minDate || checkBounds > maxDate) {
    const err = new Error('Your preselected date is not between your min and max dates');
    throw err;
  }

  let load = false;
  // check rounding
  const step = (maxDateYear - minDateYear) / 10;
  const timeline = document.querySelector('.timeline');
  const slider = document.querySelector('.sliderHandle');
  const datePanel = document.querySelector('.datePanel');

  // REGARDING MOVING ACTION
  let isDown = false;
  let startX;
  let scrollLeft;
  let moveEvent;

  // REGARING DATE SELECTION ON MOVE
  const rulerPositionDimensions = () => {
    return document.querySelector('.timelineSlider').getBoundingClientRect();
  };
  const sliderPositionDimensions = () => {
    return slider.getBoundingClientRect();
  };
  const rulerWidth = () => {
    return rulerPositionDimensions().width;
  };

  const dateRange = dateDiffInDays(minDate, maxDate);

  const dayWidth = rulerWidth() / dateRange;

  const sliderCenterSelectionPosition = () => {
    return (sliderPositionDimensions().left - rulerPositionDimensions().x) + (sliderPositionDimensions().width / 2);
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  let selectedDateTimestamp;

  let selectedDate;

  /* PUBLIC METHODS */
  this.getDate = () => {
    return getSelection();
  };
  /* PUBLIC METHODS END */

  /* RENDER WIDGET */
  renderWidget(minDateYear, maxDateYear, step);

  function renderWidget (minDateYear, maxDateYear, step) {
    const steps = [];
    steps.push(Math.round(minDateYear += step));
    for (let i = 1; i < 10; i++) {
      if (i % 2 === 0) {
        steps.push(Math.round(minDateYear += step * 2));
      }
      if (i === 9) {
        makeDivs(steps);
      }
    }

		function makeDivs(steps) {
			for (let i = 0; i < steps.length; i++) {
				const year = document.createElement('div');
				year.classList.add('year');
				year.textContent = steps[i];
				timeline.appendChild(year);

        const yearCarat = document.createElement('span');
        yearCarat.classList.add('yearCarat');
        year.appendChild(yearCarat);
      }
    }
  }
  /* RENDER WIDGET  END */

  /* PRIVATE METHODS */

  function dateDiffInDays (date1, date2) {
    function getUTCTime (dateStr) {
      const date = new Date(dateStr.toString());
      /* If use 'Date.getTime()' it doesn't compute the right amount of days
      if there is a 'day saving time' change between dates. */
      return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
    }

    const date1Time = getUTCTime(date1);
    const date2Time = getUTCTime(date2);
    if (!date1Time || !date2Time) return 0;
    return Math.round((date2Time - date1Time) / (24 * 60 * 60 * 1000));
  }

  function getSelection (key) {
    // gets the currently selected day from start:
    const currentSelection = () => {
      return sliderCenterSelectionPosition() / dayWidth;
    };

    // sets the slider position:
    function setSliderSliderPosition () {
      const daysSinceStart = dateDiffInDays(minDate, selectedDate);
      const px = (dayWidth * daysSinceStart) - (sliderPositionDimensions().width / 2);
      slider.style.left = `${px}px`;
    }

    // writes date to date panel
    function writeToDiv (selection) {
      datePanel.textContent = formatDate(selection, 'string');
    }
    // if a mouse or a touch event:
    if (!key) {
      // onload, if a pre selected value is chosen;
      if (preSelection && !load) {
        selectedDateTimestamp = new Date(preSelection).getTime();
        load = true;
      } else {
        selectedDateTimestamp = new Date(min).setDate(currentSelection());
      }
    // if a keyboard event:
    } else {
      selectedDateTimestamp += (key * 24 * 60 * 60 * 1000);
    }

    selectedDate = new Date(selectedDateTimestamp);

    if (selectedDate > maxDate || selectedDate < minDate) {
      return;
    }
    const dateFormatMapbox = formatDate(selectedDate);
    setSliderSliderPosition();
    writeToDiv(dateFormatMapbox);
    layerControls.addDateFilter(dateFormatMapbox, dateFormatMapbox);
    return dateFormatMapbox;
  }

  function toggleMove () {
    if (moveEvent) {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('touchmove', move);
      moveEvent = true;
    }
    document.addEventListener('mousemove', move);
    document.addEventListener('touchmove', move);
    moveEvent = false;
  }




  // On drag start
  function start (e) {
    isDown = true;
    slider.classList.add('active');
    startX = e.pageX || e.touches[0].pageX - slider.offsetLeft;
    scrollLeft = slider.offsetLeft;
    // attach event
    toggleMove();
  }

  function move (e) {
    // if mouse is moving but not dragging slider
    if (!isDown) return;
    const x = e.pageX || e.touches[0].pageX - slider.offsetLeft;
    const y = e.pageY || e.touches[0].pageY;
    const dist = (x - startX);
    const px = scrollLeft + dist;
    // if (px > -14) {
    if (x > rulerPositionDimensions().left &&
      x < rulerPositionDimensions().right &&
      y < rulerPositionDimensions().bottom &&
      y > rulerPositionDimensions().top) {
      slider.style.left = `${px}px`;
      getSelection();
    }
  }

  /* On drag end */
  function end (e) {
    // remove event:
    toggleMove();
    isDown = false;
    slider.classList.remove('active');
  }

  // formats the date to the required form to query map features:
  function formatDate (selection, returnIntOrSt) {
    selection = (typeof selection === 'number')
      ? selection.toString()
      : selection;

		let format;
		if (selection.length > 4) {
			format = selection.split('');
			format.splice(4, 0, '/');
			format.splice(7, 0, '/');
			format = format.join('');
		} else {
			format = selection;
		}

		const date = new Date(format);
		if (!date.valueOf()) {
			console.error(`Invalid date ${selection} passed to "getDate()"
      getDate() expects a string formated YYYYMMDD.`);
			return;
		}
		const rawMonth = date.getMonth();
		const month = ((rawMonth + 1).toString().length === 1)
			? `0${rawMonth + 1}`
			: `${rawMonth + 1}`;

    const rawDay = date.getDate();
    const day = ((rawDay).toString().length === 1)
      ? `0${rawDay}`
      : `${rawDay}`;
    if (returnIntOrSt === 'string') {
      // return `${rawDay}${stNdRdTh(rawDay)} ${months[rawMonth]} ${date.getFullYear()}`;
      return `${rawDay} ${months[rawMonth]} ${date.getFullYear()}`;
    }
    return parseInt(`${date.getFullYear()}${month}${day}`);
  }

    //HERE I FIXED SOME TIME FORMATTING - MAY NEED TO REINSTATE
    /*
		const day = prettyPrint.getDate();
		const month = prettyPrint.getMonth();
		const year = prettyPrint.getFullYear();
		// this should be placed outside this constructor:
		//OLD: THIS DID NOT HAVE format: DD (eg 01), it had format: D (eg 1):
		//document.querySelector('.datePanel').textContent = `${day}${stNdRdTh(day)} ${months[month]} ${year}`;
		document.querySelector('.datePanel').textContent = `${String(day).padStart(2, "0")} ${months[month]} ${year}`;
    */

  timeline.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    slider.classList.add('active');
    startX = e.pageX || e.touches[0].pageX - slider.offsetLeft;
    slider.style.left = `${startX - 30}px`;
    getSelection();
  });

	slider.addEventListener('mousedown', start);
	slider.addEventListener('touchstart', start);

  slider.addEventListener('mouseup', end);
  slider.addEventListener('touchend', end);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      getSelection(1);
    }
    if (e.key === 'ArrowLeft') {
      getSelection(-1);
    }
  });

  timeline.addEventListener('mouseover', (e) => {
    slider.classList.add('redSlider');
  });

  timeline.addEventListener('mouseout', (e) => {
    slider.classList.remove('redSlider');
  });
  /* EVENTS END */
}
/**
 * @param {Object|string} items What you want to send to the server.
 * @param {string} route The route to the server (URL)
 * @param {string} callback The HTTP response from the server,
 * @description Function to handle POST requests
 */
function xhr (items, route, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', route);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(items));

  if (xhr.readyState === 1) {
    document.body.style.pointerEvents = 'none';
  }

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      if (xhr.responseText) {
        callback(xhr.responseText);
        document.body.style.pointerEvents = '';
        /* To add a loading gif uncomment the following, add a div that has a gif and obscures the screen */
        // document.querySelector('.loadingGif').style.display = 'none';
      }
    }
  };
}

/**
 * @param {Object|string} items What you want to send to the server.
 * @param {string} route The route to the server (URL)
 * @param {string} callback The HTTP response from the server,
 * @description Function to handle GET requests.
 */
function xhrget (items, route, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', route);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.timeout = 1000;
  xhr.send(encodeURI(items));
  xhr.ontimeout = (e) => {
    callback('404');
  };
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      callback(xhr.responseText);
    }
    if (xhr.status >= 500 && xhr.status < 600) {
      callback('An error occurred, please wait a bit and try again.');
    }
    if (xhr.status === 404) {
      callback('404');
    }
  };
}

/**
 * @param {Object|string} items What you want to send to the server.
 * @param {string} route The route to the server (URL)
 * @param {string} callback The HTTP response from the server,
 * @description Function to handle GET requests returning the result in a promise
 * @returns A promise with the response to the request or an error.
 */
function xhrGetInPromise (items, route) {
  const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', route);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.timeout = 5000;
    xhr.send(encodeURI(items));
    xhr.ontimeout = (e) => {
      const err = new Error('The request timed out, either the server is down, or there is an issue with the connection.');
      reject(err);
    };
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        resolve(xhr.responseText);
      }
      if (xhr.status >= 500 && xhr.status < 600) {
        const err = new Error('The server returned an error, please wait a bit and try again.');
        reject(err);
      }
      if (xhr.status === 404) {
        const err = new Error(`No resource at this end point: ${route}`);
        reject(err);
      }
    };
  });
  return promise;
}

/**
 * @param {Object|string} items What you want to send to the server.
 * @param {string} route The route to the server (URL)
 * @param {string} callback The HTTP response from the server,
 * @description Function to handle POST requests
 */
function xhrPostInPromise (items, route) {
  const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', route);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(items));
    xhr.ontimeout = (e) => {
      const err = new Error('The request timed out, either the server is down, or there is an issue with the connection.');
      reject(err);
    };
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 1) {
        document.body.style.pointerEvents = 'none';
      }
      if (xhr.readyState === 4 && xhr.status === 200) {
        document.body.style.pointerEvents = '';
        resolve(xhr.responseText);
      }
      if (xhr.status >= 500 && xhr.status < 600) {
        const err = new Error('The server returned an error, please wait a bit and try again.');
        reject(err);
      }
      if (xhr.status === 404) {
        const err = new Error('The server reports 404: No resource at this end point.');
        reject(err);
      }
    };
  });
  return promise;
}


document.addEventListener("DOMContentLoaded", function() {
	const labels = document.querySelectorAll(".field__label");
	labels.forEach(label => {
	  if (label.textContent.trim() === "Date Start") {
		label.textContent = "Date: ";
	  }
	});
  });

  $(document).ready(function() {
	$('.field__label').each(function() {
	  if ($(this).text().trim() === 'Date Start') {
		$(this).text('Date: ');
	  }
	});
  });
  
  


