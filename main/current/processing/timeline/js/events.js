  /**
    * Onload event
    * @event DOMContentLoaded
    * @summary fires layer dialogue constructor
    * @fires Layer#generateAddLayerForm
    */

document.addEventListener('DOMContentLoaded', () => {
  const parent = document.querySelector('#studioMenu');
  const layerControls = new LayerManager();
  layerControls.generateAddLayerForm(parent);

  parent.querySelector('#name').value = "testing testing";
  parent.querySelector('#id').value = "c7_dates-ajsksu-right-TEST";
  parent.querySelector('#source_layer').value = "c7_dates-ajsksu";
  parent.querySelector('#database').value = "mapbox://nittyjee.8krf945a";
  parent.querySelector('#group').value = "1643-75|Demo Taxlot: C7 TEST";
  parent.querySelector('#color').value = "blue";
  parent.querySelector('#opacity').value = "0.7";
});

