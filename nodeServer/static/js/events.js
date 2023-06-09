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
      console.log(rmNewlines);
      document.querySelector('.modal-content').insertAdjacentHTML('afterbegin', rmNewlines);
      modal.showModal();
    });
  }
  if (e.target.classList.contains('close')) {
    const modal = document.querySelector('.modal');
    modal.close();
  }
});
