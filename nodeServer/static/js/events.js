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
    const url = `https://encyclopedia.nahc-mapping.org/node/${nodeId}`;
    // create a div, but don't attach it to the modal:
    let obj = document.createElement('div');
    xhrGetInPromise(null, url).then((content) => {
      // load the entire content into the not displayed div:
      obj.innerHTML = content;
      // get the article content:
      const article = obj.querySelector('#content');
      // attach it to the modal:
      document.querySelector('.modal-content').appendChild(article);
      // dereference the not displayed div:
      obj = null;
      // display the modal:
      modal.showModal();
    });
  }
  if (e.target.classList.contains('close')) {
    const modal = document.querySelector('.modal');
    modal.close();
  }

});
