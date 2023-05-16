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

/*afterMap.on('load', () => {
  const result = xhrGetInPromise({}, '/getLayers');
  maps.afterMap.addLayer(result);
});*/

const draw = new MapboxDraw({
  displayControlsDefault: false,
  // Select which mapbox-gl-draw control buttons to add to the map.
  controls: {
    polygon: true,
    trash: true
  },
  // Set mapbox-gl-draw to draw by default.
  // The user does not have to click the polygon control button first.
  defaultMode: 'draw_polygon'
});


/*
afterMap.setFeatureState(
  { source: 'grants1-5sp9tb-right-highlighted', sourceLayer: 'grants1-5sp9tb', id: dgrants_layer_view_id},
  { hover: false }
);
beforeMap.setFeatureState(
  { source: 'grants1-5sp9tb-left-highlighted', sourceLayer: 'grants1-5sp9tb', id: dgrants_layer_view_id},
  { hover: false }
);*/

