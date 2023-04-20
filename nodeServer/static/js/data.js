// Called dutch_grant_lots_info in the original project:
let dutchLots;
// Self instantiating on start up:
(async () => {
  const result = await xhrGetInPromise({}, '/dutchLots');
  dutchLots = JSON.parse(result);
})();

// Called taxlot_event_entities_info in the original project:
let taxLots;
// Self instantiating on start up:
let entities = [];

(async () => {
  const result = await xhrGetInPromise({}, '/taxLots');
  const parsed = JSON.parse(result);
  console.log(parsed);
  for (let j = 0; j < parsed.length; j++) {
    const entity = parsed[j];
    if (entity.nid[0].value) {
      console.log(entity.nid[0].value);
      entities.push({});
      let i = entities.length - 1;
      entities[i].name = (entity.title[0].value) ? entity.title[0].value : '';
      entities[i].link = `node${entity.nid[0].value}`;
      entities[i].linkText = (entity.title[0].value) ? entity.title[0].value : '';
      entities[i].descr = (entity.field_description14 && entity.field_description14[0].value) ? entity.field_description14[0].value : '';
      console.log(entities);
    }

    /*if (entity.nid[0].value) {
      entities.push({});
      const i = entities.length - 1;
      entities[i].name = (entity.title[0].value) ? entity.title[0].value : '';
      entities[i].link = `node${entity.nid[0].value}`;
      entities[i].linkText = (entity.title[0].value) ? entity.title[0].value : '';
      entities[i].descr = (entity.field_description14[0].value) ? entity.field_description14[0].value : '';
    }
    if (j === parsed.length - 1) {
      taxLots = JSON.parse(result);
    }*/
  }
})();
