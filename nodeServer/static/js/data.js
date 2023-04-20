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
