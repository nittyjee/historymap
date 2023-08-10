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
