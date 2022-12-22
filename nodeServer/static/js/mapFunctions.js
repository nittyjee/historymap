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
