/**
 * 
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
 * 
 * @param {string} string 
 * @returns The same string with spaces replaced by an undescore
 * @description Small utility to declutter code. 
 */
function removeSpaces (string) {
  return string.replaceAll(' ', '_');
}

/**
 * 
 * @param {string} layerClass   -The layer being added e.g. 'infoLayerDutchGrantsPopUp'
 * @param {Object{}} event      -Event fired by Mapbox GL
 * @param {string} layerName    -The human readable layer name being added e.g. 'Dutch Grant Lot' 
 * @description Function to create popup content when a feature is clicked and shows date information.
 * @returns A HTMLElemnt to use in the pop up
 */
function createClickedFeaturePopup (layerClass, event, layerName) {
  console.log(event.features[0]);
  
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
  const layers = [];
  let base;

  this.generateAddLayerForm = (parentElement) => {
    const data = {};
    
    base = document.createElement('form');
    parentElement.appendChild(base);

    base.classList.add('layerform');
    const title = document.createElement('p');
    title.classList.add('title');
    title.textContent = 'Add Layer';
    base.appendChild(title);

    const fields = ['name', 'source layer', 'id', 'database', 'group', 'color', 'opacity'];
    function textInputGenerator (fieldName) {          
      const nameLabel = document.createElement('label');
      nameLabel.htmlFor = fieldName;
      nameLabel.innerHTML = `${fieldName}: `;
      base.appendChild(nameLabel);
  
      const name = document.createElement('input');
      name.setAttribute('type', 'text');
      name.id = fieldName.replaceAll(' ', '_');
      base.appendChild(name);

      name.addEventListener('input', () => {
        data[fieldName] = name.value;
      });
  
      const br = document.createElement('br');
      base.appendChild(br);
    }
    fields.forEach(fieldName => {
      textInputGenerator (fieldName);
    });
  
    const types = ['circle', 'line', 'fill'];
    dropDownGenerator(types);
    function dropDownGenerator (options) {
      const select = document.createElement('select');
      base.appendChild(select);

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

    const checkboxes =  ['hover', 'click', 'sidebar', 'sliderCheckBox'];
    function generateCheckbox (checkboxName) {
      const nameLabel = document.createElement('label');
      nameLabel.htmlFor = checkboxName;
      nameLabel.innerHTML = `${checkboxName}: `;
      base.appendChild(nameLabel);
      
      const name = document.createElement('input');
      name.setAttribute('type', 'checkbox');
      name.id = checkboxName;
      base.appendChild(name);

      name.addEventListener('click', () => {
        if(name.checked === true) {
          data[checkboxName] = 1;
        } else {
          data[checkboxName] = 0;
        }
      });

      const br = document.createElement('br');
      base.appendChild(br);
    }

    checkboxes.forEach(label => {
      generateCheckbox(label);
    });

    const submit = document.createElement('input');
    submit.setAttribute('type', 'submit');
    submit.textContent = 'submit';
    base.appendChild(submit);

    
    base.addEventListener('submit', (event)=> {
      event.preventDefault();
      fields.forEach((id)=> {        
        data[id] = base.querySelector(`#${id.replaceAll(' ', '_')}`).value;
      });

      data.type = base.querySelector(`select`).value;
      createLayer(afterMap, data);
    });
  };

  function createLayer (map, data) {
    const transpilledOptions = {
      id: '',
      type: '',
      source: {
        //url is tileset ID in mapbox: 
        url: '',
        type: 'vector'
      },
      layout:  {
        visibility : 'visible' // || none
      },
      // called "source name"
      "source-layer": '',
      paint: {
        [`${data.type}-color`]: (data.color) ? data.color : '#AAAAAA',
        [`${data.type}-opacity`]: (data.opacity) ? parseFloat(data.opacity) : 0.5
      }
    };

    if (data.hover) {
      map.on('mouseenter', data.id, (event) => {
        map.getCanvas().style.cursor = 'pointer';
      
        const hoverPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 })

        hoverPopUp
          .setLngLat(event.lngLat)
          .setDOMContent(createHoverPopup (`${data.name}PopUp`, event, data.name))
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
    if (data.id) {
      transpilledOptions.id = data.id;
    }
    if (data.type) {
      transpilledOptions.type = data.type;
    }
    if (data["source layer"]) {
      transpilledOptions['source-layer'] = data["source layer"];
    }
    if (data.database) {
      transpilledOptions.source.url = data.database;
    }
    if (data.color) {
      transpilledOptions.paint[`${data.type}-color`] = data.color;
    }

    map.addLayer(transpilledOptions); 
  }
}


