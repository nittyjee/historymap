// Called dutch_grant_lots_info in the original project:
let dutchLots;
(async () => {
  const result = await xhrGetInPromise({}, '/dutchLots');
  dutchLots = JSON.parse(result);
  // Object property names are changes in the script, it's not clear why: 
  dutchLots.forEach(lot => {
    lot.name_txt = lot.to_party_unlinked;
    // lot.to_party = lot.to_party.replace("href=\u0022", "target=\u0022_blank\u0022 href=\u0022https:\/\/nahc-mapping.org");
    lot.to_party_link = (lot.to_party) ? lot.to_party.match(/href=".*?"/)[0].match(/".*?"/)[0].replace(/"/g, "") : 'no link';
    lot.to_party_linkText = (lot.to_party) ? lot.to_party.match(/>(.*?)</)[1] : 'no link';

    lot.from_party_link = (lot.from_party) ? lot.from_party.match(/href=".*?"/)[0].match(/".*?"/)[0].replace(/"/g, "") : 'no link';
    lot.from_party_linkText = (lot.from_party) ? lot.from_party.match(/>(.*?)</)[1] : 'no link';
    // lot.from_party = lot.from_party.replace("href=\u0022", "target=\u0022_blank\u0022 href=\u0022https:\/\/nahc-mapping.org");
    // lot.from_party_link = (lot.from_party) ? lot.from_party.match(pathhref)[0].match(path)[0].replace(/"/g, "") : 'no link';
    lot.builds = lot.images.length > 0 ? lot.images.split(", ") : [];
    lot.notes = lot.note;
    lot.descr = lot.description;
  });
})();
