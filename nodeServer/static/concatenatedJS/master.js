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
  // eventually a store to manage layers: 
  const layers = [];
  let base;
  let mapBase;

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
    const title = document.createElement('p');
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

      createMap(data);
    });
  };

  function createMap (data) { 
    const codeForMap = `var ${data.title}Map = new mapboxgl.Map({
      container: '$',
      style: ${data.style},
      center: [0, 0],
      hash: true,
      zoom: 0,
      attributionControl: false
    });`
    toggleModal (codeFor);
  };

  this.generateAddLayerForm = (parentElement) => {
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
  
    base = document.createElement('form');
    parentElement.appendChild(base);

    base.classList.add('layerform');
    const title = document.createElement('p');
    title.classList.add('title');
    title.textContent = 'Add Layer';
    base.appendChild(title);

    const fields = ['target map', 'name', 'source layer', 'id', 'database', 'group', 'color', 'opacity'];
    
    fields.forEach(fieldName => {
      textInputGenerator (fieldName, base);
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

    checkboxes.forEach(label => {
      generateCheckbox(label);
    });

    const submit = document.createElement('input');
    submit.setAttribute('type', 'submit');
    submit.textContent = 'submit';
    base.appendChild(submit);

    base.addEventListener('submit', (event) => {
      event.preventDefault();
      fields.forEach((id) => {
        data[id] = base.querySelector(`#${id.replaceAll(' ', '_')}`).value;
      });

      data.type = base.querySelector(`select`).value;
      const targetMap = document.querySelector('#target_map').value;
      createLayer(targetMap, data);
    });
  };

  function createLayer (targetMap, data) {
    // hack, the maps be in an array of objects, not floating about in the global scope:
    const map = maps[targetMap];
    const transpilledOptions = {
      id: '',
      type: '',
      source: {
        // url is tileset ID in mapbox:
        url: '',
        type: 'vector'
      },
      layout: {
        visibility: 'visible' // || none
      },
      // called "source name"
      'source-layer': '',
      paint: {
        [`${data.type}-color`]: (data.color) ? data.color : '#AAAAAA',
        [`${data.type}-opacity`]: (data.opacity) ? parseFloat(data.opacity) : 0.5
      }
    };

    if (data.hover) {
      map.on('mouseenter', data.id, (event) => {
        map.getCanvas().style.cursor = 'pointer';
        const hoverPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 });
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
    // toggleModal (`${targetMap}.addLayer(${JSON.stringify(transpilledOptions)});`);
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
// Called dutch_grant_lots_info in the original project:
let dutchLots;
// Self instantiating on start up:
(async () => {
  const result = await xhrGetInPromise({}, '/dutchLots');
  dutchLots = JSON.parse(result);
})();

// Called taxlot_event_entities_info in the original project:
let taxLots;
(async () => {
  const result = await xhrGetInPromise({}, '/taxLots');
  dutchLots = JSON.parse(result);
})();
/**
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

document.addEventListener('DOMContentLoaded', () => {
  const parent = document.querySelector('.mapControls');
  const layerControls = new LayerManager();
  layerControls.generateAddLayerForm(parent);
  layerControls.generateAddMapForm(parent);
  parent.querySelector('#target_map').value = 'afterMap';
  parent.querySelector('#name').value = 'testing testing';
  parent.querySelector('#id').value = 'c7_dates-ajsksu-right-TEST';
  parent.querySelector('#source_layer').value = 'c7_dates-ajsksu';
  parent.querySelector('#database').value = 'mapbox://nittyjee.8krf945a';
  parent.querySelector('#group').value = '1643-75|Demo Taxlot: C7 TEST';
  parent.querySelector('#color').value = 'blue';
  parent.querySelector('#opacity').value = '0.7';
});

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('toggleFeatureVisibility')) {
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
});
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
/**
 * 
 * @param {(Object|string)} baseHTMLElement A HTML element onto which to render 
 * the map or a query selector of the HTML element you want to render the 
 * map on.
 * @param {string} height CSS property, if none is set it will inherit the height 
 * of the parent element.
 */

function MapConstructor (baseHTMLElement, height) { 
  let map; 
  // contains the reference to the individual markers:
  const markerTracker = [];  
  // contains the type of marker to filter by type or theme:
  const indexByType = [];

  if (typeof baseHTMLElement === 'string') {
    baseHTMLElement = document.querySelector(baseHTMLElement);
  }

  if (height) {
    baseHTMLElement.style.height = height;
  } else {
    baseHTMLElement.style.height = 'inherit';
  }
  /**
   * @type {function}
   * @fires L.map (leaflet.js or mapbox.js)
   * @returns itself
   * @description Generates a map passed initially to the constructor and returns itself.
   * Typically the first function to be called in the map constructor.
   */

    this.generateMap = () => {
      const mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
      const ocmlink = '<a href="http://thunderforest.com/">Thunderforest</a>';


      // https://tile.thunderforest.com/static/transport/40.72,-73.99,11/200x200.png?apikey=ac75df8345724f518ad6b483690151f8
      // http://a.tile.thunderforest.com/cycle/11/602/769.png?apikey=ac75df8345724f518ad6b483690151f8
      map = L.map(baseHTMLElement, {
        layers: [
          L.tileLayer('http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=ac75df8345724f518ad6b483690151f8', {
            attribution: `&copy; ${mapLink} Contributors & ${ocmlink}`,
          })],
        preferCanvas: true,
        center: [40.72438847512333, -73.99464442052532],
        zoom: 11
      });
      L.control.scale().addTo(map).setPosition('bottomright');
      return this;
    }

  /**
   * @param {function} save function to call on click.
   * @calls makeClientMarker
   * @returns itself
   */
  this.locateOnClick = () => {
    const innerThis = this;
    map.addEventListener('click', function onLocationFound(e) {
      innerThis.makeClientMarker([e.latlng.lat, e.latlng.lng]);
    });
    return this;
  };

  /**
   * @param {Object[]} Array with lat lng at 0 and 1
   * @param {string} Text to bind to a marker
   * @description latLng, latitude and logitude in the form [lat, lng],
   * it also swaps the marker's location.
   * @returns itself
   */
   this.makeClientMarker = (latLng) => {
    const marker = L.marker(latLng, {
      zIndexOffset: 1000
    });

    const popUpContent = this.generateAddLayerForm();

    marker.bindPopup(L.popup({ autoPan: false }).setContent(popUpContent)).openPopup();
    if (indexByType.includes('clientMarker')) {
      const index = indexByType.indexOf('clientMarker');
      markerTracker[index].providerMarkers[0].setLatLng(latLng);
      map.setView(latLng, 11);
    } else {
      markerTracker.push({type: 'clientMarker', providerMarkers: [marker]});
      indexByType.push('clientMarker');
      marker.addTo(map);
      map.setView(latLng, 11);
    }
    return this;
  };

  this.generateAddLayerForm = () => {
    const base = document.createElement('div');
    const fields = ['Name', 'Source name', 'ID']
    function textInputGenerator (fieldName) {          
      const nameLabel = document.createElement('label');
      nameLabel.htmlFor = fieldName;
      nameLabel.innerHTML = `${fieldName}: `;
      base.appendChild(nameLabel);

      const name = document.createElement('input');
      name.setAttribute('type', 'text');
      name.id = fieldName;
      base.appendChild(name);

      const br = document.createElement('br');
      base.appendChild(br);
    }

    const types = ['ImageOverlay', 'VideoOverlay', 'TileLayer'];
    dropDownGenerator(types);
    
    function dropDownGenerator (options) {
      const select = document.createElement('select');
      base.appendChild(select);
      options.forEach(value => {
        const option = document.createElement('option');
        option.setAttribute('value', value);
        option.textContent = value;
        select.appendChild(option);
      });

    }

    fields.forEach(fieldName => {
      textInputGenerator (fieldName);
    });
    
    return base;
  };

};
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
    console.log(`blocking ${route}`);
    document.body.style.pointerEvents = 'none';
  }

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      if (xhr.responseText) {
        console.log(`response for route ${route} should have been received`);
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
    xhr.timeout = 1000;
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
        const err = new Error('The server reports 404: No resource at this end point.');
        reject(err);
      }
    };
  });
  return promise;
}
