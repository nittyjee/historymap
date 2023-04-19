// Called dutch_grant_lots_info in the original project:
let dutchLots;
(async () => {
  const result = await xhrGetInPromise({}, '/dutchLots');
  dutchLots = JSON.parse(result);
})();
