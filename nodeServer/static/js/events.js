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

let layerControls;

document.addEventListener('DOMContentLoaded', () => {
  const parent = document.querySelector('.mapControls');
  layerControls = new LayerManager();
  layerControls.generateAddLayerForm(parent);
  layerControls.generateAddMapForm(parent);
  parent.querySelector('.addToMap').checked = true;
  parent.querySelector('#name').value = 'testing testing';
  // parent.querySelector('#layer_id_created_in_mapbox').value = 'c7_dates-ajsksu-right-TEST 2';
  parent.querySelector('#source_layer').value = 'c7_dates-ajsksu';
  // called "database" before:
  parent.querySelector('#layer_source_url').value = 'mapbox://nittyjee.8krf945a';
  // parent.querySelector('#borough_to_which_the_layer_belongs').value = 'Manhattan';
  parent.querySelector('#borough').value = 'Manhattan';
  parent.querySelector('#feature_group').value = '1643-75|Demo Taxlot: C7 TEST';
  //parent.querySelector('#color').value = 'blue';
  //parent.querySelector('#opacity').value = '0.7';
/*
  Object.keys(maps).forEach((map, i) => {
    console.log(`map ${i}`);
    maps[map].addControl(draw);
    maps[map].on('error', (e) => {
      alert(e);
    });
  });*/
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
  if (e.target.classList.contains('fetchLayer')) {
    if (layerControls.returnLayers().includes(e.target.name)) {
      layerControls.toggleVisibility(e.target.name);
      return;
    }
    xhrPostInPromise({ _id: e.target.name }, './getLayerById').then((layerData) => {
      const parsedLayerData = JSON.parse(layerData);
      layerControls.addLayer(parsedLayerData);
    });
  }
});
