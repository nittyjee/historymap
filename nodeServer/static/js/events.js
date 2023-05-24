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
let sliderConstructor;

document.addEventListener('DOMContentLoaded', () => {
  const parent = document.querySelector('.mapControls');

  layerControls = new LayerManager();
  layerControls.generateAddLayerForm(parent);
  layerControls.generateAddMapForm(parent);
  layerControls.layerControlEvents();

  sliderConstructor = new SliderConstructor(1625, 1701);
  sliderConstructor.getDate();
  // For Firefox where checkboxes remain checked after reload:
  const layerControlsDiv = parent.querySelector('.layerControls');
  if (layerControlsDiv) {
    const checkboxes = layerControlsDiv.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox, i) => {
      checkbox.checked = false;
    });
  }
});
