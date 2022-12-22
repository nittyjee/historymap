/**
  * Onload event
  * @event DOMContentLoaded
  * @fires MapConstructor#generateMap
  */
  window.addEventListener('DOMContentLoaded', (event) => {
    const historyMap = new MapConstructor('#map', '80vh')
      .generateMap()
      .locateOnClick();
  });
