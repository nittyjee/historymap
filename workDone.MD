# 18/4/2023 

Installed node server locally, installed dotenv to securely connect to the database.

Get node server working and serving templates

Set up test tooling for API testing and integrattion testing using Mocha, Chai and Puppetter.

Start Make template with Pug.

Rebuilding API in Node.js

Wrote DB access function and improved general security of access using enviromental variables. 

# 19/4/2023

Begun rewrite of index.html to pug and separate .js files.

Wrote functions to manipulate data into correct format for subsequent saving in that correct format as a new database. (took longer than expect)

Created new database with data already transformed.

Changed passwords after mistake with .gitignore

# 20/4/2023

Made new DB for taxLots with correct information requiring no transforamtions on the front end. 

Keeping track of new vs old code in copyOfIndex.html, new code in data.js

Tidied data.js

# 21/4/2023

Rewrote the html structure (in Pug.js) *I hadn't counted on this at first*: But it will carry a number of advantages: Less code, one single file that works for all devices, remove inline styles, name things in a manner less likely to cause issues.

Installed sass, however using node sass for the time being, pointed it at the files in the node.js project.

Make a new layout using CSS Flexbox (no need for multiple layouts for each device type). 

Make a small component to toggle layers meaning all the code in index.html dealing with this can be replaced by one small
function.

Reintegrated the addlayer dialogue (for testing)

Re wrote some of the calls to the mapbox api in order to store data more consisely. 

# 24/4/2023

Installed: 
  -"body-parser" to accept POST requests, 
  -"any_object_validator" to sanitize anything being saved in the database,
  -"cookie-parser" to *later manage sessions*

**TODO**
- [] Session management and session database. 

Wrote end point to save layers in the database. 

Added function to post layer data to the database in "addLayerDialog.js"

Saves layer data in database: checks data can't include hacks, **does not check layer data is a valid layer**

**TODO**
- [] Validate a layer is a layer on the DB. 

Wrote an API end point to save layer data to the DB.

Wrote an API end point to fetch layer data. 

*Data is now returned as needed and not simply all loaded at once. State is managed so that the data is only fetched from the server once, reducing over heads and improving performance. This is tested with data that is hard coded into the orignal project and works as expected.*

Wrote a function to toggle layer visibility. 

*Visibility is toggle as part of the layer loading state manegement, no longer hard coded for each layer.*


# 25/4/2023

*National holiday*

# 26/4/2023

Reviewed the code. 

*message in upword details how objects should be reshaped*
```json

```

# 11/5/2023
Wrote a save/delete function that updates the map, the DOM and the database.

# 12/5/2023
Reviewed more code, some issues

# 15/5/2023
Make it so only a single object in the DB and front end control a layer, rather than adding layers for each
map etc. 

```json

```
# 16/5/2023
Wrote new templates and logic that allow appearance be rendered much like the first version of the site:

```json
  {
    Manhattan: {
      '1609|Manhattan': [
        {
          _id: new ObjectId("646367741b02ca0c10eb8d73"),
          'target map': [Array],
          type: [Array],
          name: 'Lenape trails',
          'source layer': 'lenape_trails-9n6muf',
          'layer source url': 'mapbox://nittyjee.4kio957z',
          'feature group': '1609|Manhattan',
          borough: 'Manhattan'
        }
      ]
    }
  }
```


**TODO**

- [] Finish writing the flexbox css so that the page works on any device. 

- [] Consider updating build pipeline to dart sass from node-sass **not important at this point**.

  ## CSS build pipeline: 

  Configured as a Grunt task. 

  sassStyles (.scss) -> styles (.css)-> concatenatedCSS (concatenated file)

  **TODO**

  - [] Minify concatenatedCSS css file

  ## Data transformation:

  ### Dutch Lots

  **TODO**
  
  - [] create inputs on the backend interface to store these extra fields correctly based on the
  changes bellow.

  **Original data example from Drupal, copied to MongoDB**

  ```json
  {
    "_id": {
      "$oid": "63973a3ef92a74f330fa0786"
    },
    "nid": "1789",
    "title": "B12",
    "start": "1645-01-10",
    "end": "1655-03-20",
    "from_party": "",
    "to_party": "",
    "to_party_unlinked": "Cornelis Groesens",
    "description": "Gr-br. to Cornelis Groesens. Not found of record, but recited in Lib. A, Deeds, N. Y. Co.: 11. A further &quot;order&quot; was subjoined, Oct. 8, 1646",
    "note": "",
    "images": ""
  }
  ```    

  **Original transformations in code:** 

  In the original code there are some data transformations that shouldn't really be needed,
  namely a bunch of regex operation to format links... which are unecessary when using relative 
  URLs. Also renaming things is bad form, the same name for the same thing should be used throughout
  the project. 
  
  Code cleared up and formated for clarity:  

  ```js
  if(/FortAmsterdam/.test(data_info_index)) {
    data_info_index = "Fort Amsterdam";
  }
  dutch_grant_lots_info[data_info_index] = { 
    name_txt: data[i].to_party_unlinked,
    to_party: data[i].to_party.replace("href=\u0022", "target=\u0022_blank\u0022 href=\u0022https:\/\/nahc-mapping.org"),
    from_party: data[i].from_party.replace("href=\u0022", "target=\u0022_blank\u0022 href=\u0022https:\/\/nahc-mapping.org"),
    start: data[i].start, 
    end: data[i].end, 
    notes: data[i].note, 
    descr: data[i].description,
    builds: data[i].images.length > 0 ? data[i].images.split(", ") : []
  };
  ```

  **new properties**

  - name_txt, same as to_party_unlinked
  - notes, alias of note
  - descr, alias of description
  - builds, converts a string list of image links to an array
  
  **aletered values**

  - to_party, formats raw html link from relative to absolute
  - from_party, formats raw html link from relative to absolute
  - the one instance of "FortAmsterdam" is checked (every cycle) and altered. 

  **data changes**
  
  The following script was used to save the data with the pertinent changes applied:
  
  ```js
  dutchLots.forEach(lot => {
    lot.name_txt = lot.to_party_unlinked;
    lot.to_party_link = (lot.to_party) ? lot.to_party.match(/href=".*?"/)[0].match(/".*?"/)[0].replace(/"/g, "") : 'no link';
    lot.to_party_linkText = (lot.to_party) ? lot.to_party.match(/>(.*?)</)[1] : 'no link';
    lot.from_party_link = (lot.from_party) ? lot.from_party.match(/href=".*?"/)[0].match(/".*?"/)[0].replace(/"/g, "") : 'no link';
    lot.from_party_linkText = (lot.from_party) ? lot.from_party.match(/>(.*?)</)[1] : 'no link';
    lot.builds = lot.images.length > 0 ? lot.images.split(", ") : [];
    lot.notes = lot.note;
    lot.descr = lot.description;
  });
  ```
  
  **new properties** 

  *some kept for the time being*
  - name_txt, same as to_party_unlinked
  - notes, alias of note
  - descr, alias of description
  - builds, converts a string list of image links to an array
  - to_party_link, a plain link
  - to_party_linkText, the link text
  - from_party_link, a plain link
  - from_party_linkText, the link text
  
  **aletered values**

  - to_party, formats raw html link from relative to absolute
  - from_party, formats raw html link from relative to absolute
  - the one instance of "FortAmsterdam" is checked (every cycle) and altered. 
 
  ## Tax Entities

  **Original data example from Drupal, copied to MongoDB**

  ```json
  {
    "_id": {
      "$oid": "639336ebd0d9f06e642fb3af"
    },
    "nid": [
      {
        "value": 10076
      }
    ],
    "uuid": [
      {
        "value": "a7df89fc-3431-42ca-8f86-640956bb79a9"
      }
    ],
    "vid": [
      {
        "value": 13466
      }
    ],
    "langcode": [
      {
        "value": "en"
      }
    ],
    "type": [
      {
        "target_id": "info_text",
        "target_type": "node_type",
        "target_uuid": "0f03d927-f7c0-494a-8578-8ebf85ed77f5"
      }
    ],
    "revision_timestamp": [
      {
        "value": "2022-09-15T04:35:08+00:00",
        "format": "Y-m-d\\TH:i:sP"
      }
    ],
    "revision_uid": [
      {
        "target_id": 1,
        "target_type": "user",
        "target_uuid": "d16181c3-ed56-4c07-b7d9-b40b7581ef4e",
        "url": "/nittyjee"
      }
    ],
    "revision_log": [],
    "status": [
      {
        "value": true
      }
    ],
    "uid": [
      {
        "target_id": 1,
        "target_type": "user",
        "target_uuid": "d16181c3-ed56-4c07-b7d9-b40b7581ef4e",
        "url": "/nittyjee"
      }
    ],
    "title": [
      {
        "value": "Manatus Map, 1639"
      }
    ],
    "created": [
      {
        "value": "2022-09-15T04:35:08+00:00",
        "format": "Y-m-d\\TH:i:sP"
      }
    ],
    "changed": [
      {
        "value": "2022-09-20T05:22:57+00:00",
        "format": "Y-m-d\\TH:i:sP"
      }
    ],
    "promote": [
      {
        "value": false
      }
    ],
    "sticky": [
      {
        "value": false
      }
    ],
    "default_langcode": [
      {
        "value": true
      }
    ],
    "revision_translation_affected": [
      {
        "value": true
      }
    ],
    "path": [
      {
        "alias": "/manatus-map-1639",
        "pid": 12796,
        "langcode": "en"
      }
    ],
    "body": [
      {
        "value": "<i>Manatvs Gelegen op de Noot Riuier</i>\r\n<br>(Manhattan Lying on the North River)\r\n<br><br>\r\nThis is the first true map of Manhattan and settlements of New Netherland surrounding the harbor. Shown are 45 houses or farms and their owners, and Lenape settlements and slave quarters. It was created in 1639 following a survey commissioned the year before.\r\n<p>\r\nThe author is believed by some to be Johannes Vingboons, but historians such as I. N. Stokes and Richard Stephenson consider that unlikely. This colorful copy created around 1670 by an unknown artist.\r\n<br>\r\n<br>\r\nThis map is warped to lay over its real location. <a href = \"https://encyclopedia.nahc-mapping.org/document/manatus-map-manatvs-gelegen-op-de-noot-sic-riuier\" target=\"_blank\">See the original map and article</a>.\r\n<br>",
        "format": "full_html",
        "processed": "<i>Manatvs Gelegen op de Noot Riuier</i>\n<br />(Manhattan Lying on the North River)\n<br /><br />\nThis is the first true map of Manhattan and settlements of New Netherland surrounding the harbor. Shown are 45 houses or farms and their owners, and Lenape settlements and slave quarters. It was created in 1639 following a survey commissioned the year before.\n<p>\nThe author is believed by some to be Johannes Vingboons, but historians such as I. N. Stokes and Richard Stephenson consider that unlikely. This colorful copy created around 1670 by an unknown artist.\n<br />\n<br />\nThis map is warped to lay over its real location. <a href=\"https://encyclopedia.nahc-mapping.org/document/manatus-map-manatvs-gelegen-op-de-noot-sic-riuier\" target=\"_blank\">See the original map and article</a>.\n<br /></p>",
        "summary": null
      }
    ],
    "feeds_item": [
      {
        "target_id": 12,
        "imported": "2022-09-20T05:22:57+00:00",
        "url": "/feed/12",
        "guid": null,
        "hash": "50563c59961203273b2bf4f02619f3d7",
        "target_type": "feeds_feed",
        "target_uuid": "a52207e6-4ad6-4009-b441-59fc5fd7ac02"
      }
    ],
    "field_element_id": [
      {
        "value": "manatus-map"
      }
    ],
    "field_infotext": []
  }
  ```

  **Original transformations in code:** 

  The data is a bit weird, for example there is no field_description anywhere in the data -why test for it? 
  In fact, there is no description. Also, all data pass the test "if (entity.nid[0].value)" making it pointless
  buthe there you have it. The chained terneries to generate html are probably the hardest possible way to do this.

  Code cleared up and formated for clarity:  

  ```js
		if (data.length > 0) {
		  for (let i = 0; i < data.length; i++) {
      	if ( typeof data[i].nid[0].value != "undefined" ) {
					data_info_index = "" + data[i].nid[0].value + "";
          taxlot_event_entities_info[data_info_index] = { 
            name: 
              data[i].title.length > 0 ? 
                data[i].title[0].value : 
                "",

            name_html: data[i].title.length > 0 ? 
              (( data[i].path.length > 0 ? 
              "<a href='https://encyclopedia.nahc-mapping.org/node/" + data_info_index + "' target='_blank'>" : "" ) + 
              data[i].title[0].value  + ( data[i].path.length > 0 ? "</a>"  : "" )) : 
              "",
              
              
            descr: data[i].field_description14.length > 0 ? data[i].field_description14[0].value : "" 
            };  
		
          taxlot_entities_info_length += 1;
				}
			}
		}  
  ```

  **New Transformations**

  *A reoccuring error is messy generation of html, here we extract the data only:*

  ```js
    const entities = [];
    taxEntities.forEach((entity) => {
      if (entity.nid[0].value) {
        const i = entities.length -1; 
        entities.push({});
        entities[i].name = data[i].title[0].value !== "";
        entities[i].link = `node${entity.nid[0].value}`;
        entities[i].linkText = data[i].title[0].value !== "";
        entities[i].descr = data[i].field_description14[0].value !== "";
      }
    });
  ```

# Globals: 
- maps
