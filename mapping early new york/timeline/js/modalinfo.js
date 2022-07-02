var modal_header_text = [];
var modal_content_html = [];

modal_header_text["about"] = "ABOUT";

			modal_content_html["about"] = `

			New York City was founded by the Dutch in 1624 as <i>New Amsterdam</i>, a trading post for the Dutch West India Company in New Netherland. The New Amsterdam History Center is devoted to documenting and mapping New Amsterdam, its diverse people, landscapes, institutions, and global legacy today.
			<p>
			<br>
			We’ve presented several versions of the <i>Castello Plan</i>, a 3D model, an encyclopedia, and other maps here.  You can see the settlement with its houses, farms, taverns, and workshops, surrounded by walls.   Over the centuries that followed, this area became the Financial District.   The east wall was torn down and named Wall Street.   The canals were paved over, became streets, and in between developed skyscrapers, while the island was expanded with infill.   Above ground, almost nothing remains of New Amsterdam except the original street pattern.   Underground, archeologists have found evidence of the plots of houses and gardens, Amsterdam yellow brick, and pollen samples of plants.
			<p>
			<br>
			You can swipe the map to compare the Castello Plan in 1660 to the present, explore each lot, view it in the 3D model, and use our encyclopedia to learn who lived there, how they earned a living, and in many cases, who they married.   
			<p>
			<br>
			Our next steps will be to expand the project to include all of Long Island and eventually the Hudson Valley, Connecticut and New Jersey. We will continue to add more detail to the timeline through 1664 when New Amsterdam was taken over by the English.
			<p>
			<br>
			Questions?  Contact us at <a href = "mailto: info@newamsterdamhistorycenter.org">info@newamsterdamhistorycenter.org</a>
			<p>
			<br>
			Donate now to develop the maps, 3D Model, and expand the research. We need your help to make this work happen!   
			<p>

			<br>
			<b><a href="http://newamsterdamhistorycenter.org/support/">Support Us</a></b>
			<p style="color: #b0691d; font-size: 16px; font-weight: bold;">
				<i>MAPPING EARLY NEW YORK</i> is made possible by grants from:<br>
				The SOCIETY OF THE DAUGHTERS OF HOLLAND DAMES<br>
				KEN CHASE<br>
				THE SOCIETY OF THE FIRST FAMILIES OF NEW YORK<br>
				THE ROBERT DAVID LION GARDINER FOUNDATION </b>

		<br>
		<br>
			<img src="https://nahc-mapping.org/mappingNY/encyclopedia/sites/default/files/gar-logo.jpg" width="96">
			<img src="https://nahc-mapping.org/mappingNY/encyclopedia/sites/default/files/first_families_logo.png" width="96">
			<img src="https://nahc-mapping.org/mappingNY/encyclopedia/sites/default/files/dohd_logo.png" width="96">

			<p>
		<br>
		<b>Creative Contributors:</b>
		<br>
		<a href = "https://www.linkedin.com/in/toya-dubin-44a3b82/">Toya Dubin</a>, Project Manager, <a href = "mailto: info@newamsterdamhistorycenter.org">info@newamsterdamhistorycenter.org</a>
		<br>
		<a href = "https://www.linkedin.com/in/nitingadia/">Nitin Gadia</a>, Mapping Director and Database Development
		<br>
		<a href = "https://www.linkedin.com/in/jerry-o-toole-0763934/">Daniel O’Toole</a>, Database Developer
		<br>
		<a href = "https://www.linkedin.com/in/eduard-van-dijk-76347329/">Eduard Van Dijk</a>, 3D Modeling
		<br>
		Firth Haring Fabend, PhD.,  Head of Scholarly Research
		<br>
		Esme Berg, Executive Director
		`;


		
modal_header_text["info"] = modal_header_text["about"];
modal_content_html["info"] = modal_content_html["about"];

modal_header_text["grants-info-layer"] = "The Dutch Grants";
modal_content_html["grants-info-layer"] = `
<!--
            <i class="fa fa-square" style="color: #e3ed58;" ></i> Dutch Grants
            <br>
			<i class="far fa-square" style="color: #e3ed58;" ></i> Dutch Grants Lines
			<br>
			<p>
-->

			The Dutch Grants were the first properties that the Dutch West India Company awarded to many of the residents of New Amsterdam. Slide the timeline beneath to see how they were granted over time, from 1640 to 1664. Hover over them to see who owned the grant, when it was granted, and click for a description and a link to the encyclopedia.
			<p>
			<br>
			The grants were traced from the Dutch Grants map in The Iconography of Manhattan Island, where they were drawn using property descriptions. You can see the Dutch Grants map overlay beneath: “Dutch Grants, Stokes 1914-1916”.
			<p>
			<br>
			This layer only shows the grants as they were first established, not as they were divided or sold. For example, if a grant was made in 1640, in 1641 it may have been divided, with different owners, but you will still see it as it was when it was granted, across the whole timeline. Only one Dutch Grant, C7,  has been divided to show its evolution over the whole Dutch period - See the map layer: “Demo Grant Divisions: C7”.  Future funding will allow us to show all of them this way.
			<p>
			<br>
			 `;


modal_header_text["boundaries-info-layer"] = "Boundaries, 1609-Present";
modal_content_html["boundaries-info-layer"] = `
<!--
			<i class="fa fa-square" style="color: #e3ed58;" ></i> Dutch Grants
			<br>
			<i class="far fa-square" style="color: #e3ed58;" ></i> Dutch Grants Lines
			<br>
			<p>
-->
			This layer is intended to show administrative boundaries, including major patents and town boundaries, and possibly territorial claims. Boundaries take time to draw in precision, and will be done from written records and tracing maps. Currently the only boundary that exists is of Gravesend, a town created in 1645. We are starting with precise maps and will be adding towns and patents that share boundaries. You can see the corresponding map of Gravesend below.
			`;


modal_header_text["ny_towns"] = "Long Island Towns, 1636-Present";
modal_content_html["ny_towns"] = `
			This layer shows town boundaries. In Brooklyn and Queens, and in much of Nassau county, towns were founded by the Dutch, while towns in Suffolk County and parts of Nassau were founded by the English.
			<br>
			<br>
			Researched and drawn by Karl Phillips
			`;



modal_header_text["farms-info-layer"] = "Original Grants & Farms";
modal_content_html["farms-info-layer"] = `


			The Original Farms and Grants were among the first properties that the Dutch West India Company awarded. Slide the timeline beneath to see how they were granted over time, from 1625. Hover over them to see who owned the grant and when it was granted.
			<p>
			<br>
			The layer is a supplement of the Dutch Grants map layer, both of which you can click to see side by side. The Dutch Grants Map covers what is within the walls of New Amsterdam, and the Original Farms and Grants layer covers what is north of the north wall (Wall Street today).
			<p>
			<br>
			The grants were traced from the Original Grants and Farms map in The Iconography of Manhattan Island, where they were drawn using property descriptions. You can see the Original Grants and Farms map overlay beneath: “Original Grants and Farms 1914 ”. There are many more boundaries drawn over one another, which include further divisions of grants and later farms.
			<p>
			<br>
			This layer only shows the grants as they were first established, not as they were divided or sold. For example, if a grant was made in 1640, in 1641 it may have been divided, with different owners, but you will still see it as it was when it was granted, across the whole timeline. In the Dutch Grants layer, only one Dutch Grant, C7,  has been divided to show its evolution over the whole Dutch period - See the map layer: “Demo Grant Divisions: C7”.  Future funding will allow us to show all of them this way.
			<p>
			<br>
			 `;
			
modal_header_text["castello-info-layer"] = "Castello Taxlots Layer";
modal_content_html["castello-info-layer"] = `
<!--
            <i class="fa fa-circle"  style="color: #FF0000;" ></i>  Castello Taxlots (1660)
-->

			The Castello Taxlots (1660) shows residents and owners of properties in 1660, when the Castello Plan was drawn. The information was gathered from Stokes’ Iconography of Manhattan Island, where each of the lots in the Castello Plan illustration was assigned a “taxlot number”, and historic information was given for each.
			<p>
			<br>
			Click on the dots to see some information for each taxlot, with a link to the encyclopedia, where you can see who lived there, the property type, and the description from Stokes’ Iconography along with additions from many other resources.
			<p>
			<br>
			Use in conjunction with the Castello Plan map overlays, and click their info buttons to learn more about the Castello Plan.
			<p>
			<br>
			`;

modal_header_text["current-lots-info-layer"] = "Current Lots Layer";
modal_content_html["current-lots-info-layer"] = `
<!--
            <i class="fa fa-square" style="color: #7B68EE;" ></i> Current Lots
			<br>
			<i class="far fa-square" style="color: #000080;"></i> Current Lots Lines
-->

			These are the current lots in the area (2021), that cover the other layers and map overlays. Hover over the features and see the current owners, and click for more information, such as the lot number.
			<p>
			<br>
			To use this layer, compare it with others by clicking them on and off. For example, turn the Current Lots layer group on, and turn the Dutch Grants layers on and off repeatedly to compare, and do the same in reverse - keep the Dutch Grants on and turn the Current Lots on and off repeatedly, so the differences can be seen. Hover over features as well to see how lot lines cross.
			<p>
			<br>
			`;
			

			
modal_header_text["current-buildings-lines-info-layer"] = "Current Buildings Layer";
modal_content_html["current-buildings-lines-info-layer"] = `
<!--
            <i class="far fa-square" style="color: #FF0000;"></i> Current Buildings Lines
-->
			These are the current building outlines - they often match up with the lot lines, but sometimes there are multiple buildings within a lot or buildings that cover multiple lots.
            `;

modal_header_text["demo-taxlot-info-layer"] = "Demo Taxlot Layer";
modal_content_html["demo-taxlot-info-layer"] = `
<!--
            <i class="fa fa-play-circle"  style="color: #097911;" ></i> Demo Taxlot: C7
-->


			In this layer is a single large dot over a Castello Plan lot. Click on the dot and move the timeline on the bottom, and you’ll see people who owned or lived there over the history of the Dutch Period in the sidebar. Each time an event happens, the dot color changes blue or green. The information is from the Castello Plan section of Stokes’ Iconography of Manhattan Island. Each taxlot was given a number, and taxlot C7 was chosen for our demo. 
			<p>
			<br>
			Use this layer in conjunction with the Castello Plan map overlays on the bottom.
			<p>
			<br>
			For more information, see the “Castello Taxlots” map overlay.
			`;

modal_header_text["native-groups-info-layer"] = "1600s | Long Island Native Groups ";
modal_content_html["native-groups-info-layer"] = `
        
		<ol>
		<li>Labels</li>
		<li>Area</li>
		<li>Borders</li>
		</ol>

			`;

modal_header_text["demo-grant-info-layer"] = "Demo Grant Divisions Layer";
modal_content_html["demo-grant-info-layer"] = `
<!--
            <i class="fa fa-square" style="color: #008888;" ></i> Demo Grant Divisions: C7
-->

			In this layer one Dutch Grant was taken and divided using property transfer descriptions, with owners added. Lots were subdivided and changed hands between multiple people. Slide the timeline and see the divisions happen and in between, hover or click the properties. Click on them for more information, such as the property description.
			<p>
			<br>
			Use the “Dutch Grants” layer for more context.
			<p>
			<br>
            `;



modal_header_text["castello-redrawn-plan"] = "Castello Redrawn 1913 (Default)";
modal_content_html["castello-redrawn-plan"] = `
			This is a colored draft of the Castello Plan, created in 1913 by John Wolcott Adams, and by Isaac Newton Phelps Stokes, who covered it extensively in Volume 2 of the Iconography of Manhattan Island.
			<p>
			<br>
			The Castello Plan was an illustrated map of New Amsterdam in 1660, created by Jacques Cortelyou. It was rediscovered in the Villa di Castello near Florence, Italy in 1900, and was printed in 1916. See other map overlays of versions of the Castello Plan from Stokes.
			<p>
			<br>
            `;



modal_header_text["original-castello-plan"] = "Original Castello Plan 1660";
modal_content_html["original-castello-plan"] = `
			This is the original copy of the Castello Plan, an illustrated map created in 1660 by Jacques Cortelyou. The copy was created by a draftsman between 1665-1670, from the lost original. Around 1667, cartographer Joan Blaeu brought the map to Europe and it was sold to Cosimo III de' Medici, Grand Duke of Tuscany. It was rediscovered in the Villa di Castello near Florence, Italy in 1900 and was printed in 1916. Today it is on display at the New York Public Library.
			<p>
			<br>
			Many drafts and illustrations were made of the Castello Plan, including by I.N. Phelps Stokes, who had depictions made and documented heavily in the Iconography of Manhattan Island. See other map overlays of versions of the Castello Plan from Stokes.
			<p>
			<br>
            `;


modal_header_text["stokes-key-castello"] = "Stokes Key to the Castello Plan 1912";
modal_content_html["stokes-key-castello"] = `
			This map is a key to the lots numbered in the Iconography of Manhattan Island of the Castello Plan (1660). For more information on the Castello Plan, click on the info button for the Original Castello Plan map overlay.
            `;
			
modal_header_text["new-amsterdam-legend"] = "Legend of New Amsterdam 1979";
modal_content_html["new-amsterdam-legend"] = `
			This illustration of the Castello Plan by Peter Spier shows the lot numbers in Stokes’ Key to the Castello Plan, along with what look like garden or lot lines. For more information, click the info buttons for Castello Plan map overlays.
            `;

modal_header_text["dutch-grants-stokes"] = "Dutch Grants, Stokes 1914-1916";
modal_content_html["dutch-grants-stokes"] = `
			This is a map of the Dutch Grants, drawn from property descriptions, meticulously sequenced and documented in Stokes’ Iconography of Manhattan Island. This map was traced to create the Dutch Grants layer, above. Turn on the Dutch Grants layer group to see information from Stokes’, with a link to the original grant documents. Click the info button for the Dutch Grants layer group for more information.
            `;

modal_header_text["ratzer-map"] = "Ratzer Map 1766";
modal_content_html["ratzer-map"] = `
			<i>The Plan of the City of New York in North America</i> by British military officer Bernard Ratzer, created in 1766-1767 and printed in 1770.
			<br><br>This is a colored version of the <i>Ratzer Map</i>, which It shows the city and vicinity in the years before the Revolutionary Era, full of the city streets, harbors, farms and fields, and hills, and many well illustrated details. Shown are Brooklyn and Manhattan, and the edges of Queens and New Jersey, right across from Manhattan.
            `;


			/* Novi Belgii Map */
modal_header_text["novi-belgii-map"] = "Belgii novi, 1651";
modal_content_html["novi-belgii-map"] = `

<i>Belgii novi, angliae novae, et partis Virginiae ; novissima delineatio</i>
<br>
Created in 1651 by Joannes Jansson.

			<br><br>This map shows the extent of New Netherland and the bordering areas of New England and New France. It goes from what is now Montreal on the north, and the border from Maine down past Washington DC in the south, and it locates dozens of places and Indian tribes. Belgii Novi is excellent cartographically for the time, and it aligns relatively well, except in the upper part, west of Montreal and east of the Great Lakes.
			It was followed by copies and updates by Nicholas Vissher, all the way through the 1680s.
			`;

			/* Manahatta Map Overlay */
modal_header_text["manahatta-map"] = "Manahatta Map Overlay (1609)";
modal_content_html["manahatta-map"] = `
			The Manahatta Project is an effort to create an image of Manhattan around the time Henry Hudson arrived in 1609. The reconstruction was developed using geography from maps from the 1700s and many historic documents and scientific data. The map overlay shows the landscape's forests, wetlands, beaches, ponds and streams, and hills and valleys. The Welikia Project has expanded beyond Manahatta into the what are today the surrounding boroughs of New York City.
			<p>Use this overlay in conjunction with the Manahatta layers above, of the Lenape trails, and the rivers and shorelines.
			<p>The Manahatta Map and the Welikia Project were developed by the Wildlife Conservation Society and led by Eric Sanderson.
			`;

			/* Manahatta Layers */
modal_header_text["manahatta-info"] = "Manahatta Map (1609)";
modal_content_html["manahatta-info"] = `
			These layers are of the shorelines, streams and ponds, as well as Lenape Trails around 1609. They were generated by the Wildlife Conservation Society's Manahatta Project.
			<p>Use this layer in conjunction with the Manahatta Map overlay below. Click the overlay's info button for more information about the project.
			<p>The Manahatta Map and the Welikia Project were developed by the Wildlife Conservation Society and led by Eric Sanderson.
			`;
			
modal_header_text["longisland-info-layer"] = "Long Island Area Coastline";
modal_content_html["longisland-info-layer"] = `
            <p>This layer is to be used in conjunction with the Belgii Novi map below. It is intended to show Long Island in relation to where it is shown on the map, as a reference.</p>
            `;

modal_header_text["nyc-map-plan"] = "A Plan of the City of New York, 1730";
modal_content_html["nyc-map-plan"] = `
A map of New York from an actual survey in 1730, engraved by I. Carwitham and presented to John Montgomerie, the English colonial governor of New York. The map shows buildings that line streets, with a few buildings that are illustrated from a bird's eye view. Comparing with the Castello Plan in 1660, one can see there was already considerable infill along the edges of Manhattan, and the size of the city more than doubled, growing nearly to where the Brooklyn Bridge is today. Though the population increased several times, it was still small, at around 8000 people.
            `;



modal_header_text["original-grants-map"] = "Original Grants & Farms, Stokes 1914-1916";
modal_content_html["original-grants-map"] = `
			This map details the grants made in Manhattan through the Dutch period and into the early English period in New York, going all the way up to present day Harlem. It is drawn from property descriptions of original documents, published in Stokes' <i>Iconography of Manhattan Island, Volume 6</i>. It is supplementary to the Dutch Grants map, which you can select in the sidebar.
            `;

modal_header_text["satellite-image"] = "Current Satellite";
modal_content_html["satellite-image"] = `
			This is a current satellite map of the area, with roads highlighted and labeled. Use this to compare other map overlays, and see then vs now, swiping the vertical bar left and right.
            `;


modal_header_text["ny-bay-and-harbor"] = "Map of New-York Bay and Harbor and the Environs, 1844";
modal_content_html["ny-bay-and-harbor"] = `
			This map shows much of the area around New York Bay, showing what is today the western half of Manhattan and Queens, all of Staten Island and Brooklyn, and the surrounding areas in New Jersey.
			<br><br>It was a culmination of the work of Ferdinand Hassler, who had to persist for decades to be able to finally create a high quality cartographically accurate map, which he was originally commissioned to do when the US Coast Survey was established in 1807.
			<br><br>Because this map is one of the earliest to show the precise locations of settlements that were founded in the 1600s, it is being used to locate places, which are unclear, paved over, or swallowed up by the city in the decades that followed.
			`;

modal_header_text["settlements-info-layer"] = "Places: 1600-1664";
modal_content_html["settlements-info-layer"] = `
			This layer shows the location and dates of Indian and Dutch places. Some places have a clear founding date, while others were settled before the place was named or officiated. So far locations have only been applied in Brooklyn. For the Dutch places, use in conjunction with the "NY Bay and Harbor" map, and for the Indian places, use in conjunction with the "Indian Paths & Places" maps below.
			`;


			/* Paths: 1600-1664 */

modal_header_text["indian-paths-info-layer"] = "Paths: 1600-1664";
modal_content_html["indian-paths-info-layer"] = `
			This layer traces the paths that existed prior to and during the early colonial period. Used in conjunction with the “Indian Paths & Places” map below, it helps to display paths that are likely a combination of Native American paths and those used by colonists. Some of these paths were eventually straightened and paved to become the streets and highways used today.
			`;


			/* Indian Paths & Places | 1600-64 */

modal_header_text["indian-paths-places"] = "Indian Villages Paths, Ponds and Places in Kings County, 1946";
modal_content_html["indian-paths-places"] = `
			This map by Brooklyn Borough Historian James Kelly shows paths created and used by Native Americans, along with several Native American settlements. Subsequently European colonists would have used them, and later expanded or incorporated them into their settlements. Use in conjunction with the map in the Long Island "Paths" and "Places" layers above.
			<p><br>
			Citation:
			<br>
			Indian Villages, Paths, Ponds, and Places in Kings County, James A. Kelly, 1946; MAP_1946-01-01; Brooklyn Public Library, Center for Brooklyn History.
			`;


			

			/* Indian Groups of Long Island */

			modal_header_text["indians-long-island"] = "The Indian tribes of Long Island, 1600-1700s";
			modal_content_html["indians-long-island"] = `
			
			A drawing of Long Island Native groups by Victor G. Becker in 1934.
			<p>
			<br>
			The notion has persisted for many decades that there were 13 tribes on Long Island. Reviews are needed to verify the accuracy of this, as well as their geographical range. Natives of Long Island did not have borders and land ownership in the same way as the Dutch and English, and tribes were often formed in order to negotiate with and form relationships with colonists. While documents and scholarship over the past centuries have used the term "tribe", many have found it more accurate to use terms like "groups" or "communities" to describe their relationships.
			`;


			/* Gravesend Map */

modal_header_text["gravesend-map"] = "Gravesend Map, 1873";
modal_content_html["gravesend-map"] = `
			This map is of Gravesend, a patent that was granted on December 19th, 1645, and was organized as a town. It is from the <i>Atlas of Long Island, New York</i> in 1873, and the borders shown had not changed since the town was created. However, the coastlines changed quite a bit, with infill over the following decades. Gravesend was the first patent granted to a woman, Deborah Moody. She and others fled religious persecution by the English colonists, and were welcomed by the Dutch. This town and patent was traced, which can be seen in the "Boundaries" layer above.
			`;
			
			/*Beer's Map Long Island */

modal_header_text["beers-long-island-map"] = "Long Island, 1873";
modal_content_html["beers-long-island-map"] = `
			This is a large map of Long Island from the <i>Atlas of Long Island, New York</i> in 1873. Most towns and their boundaries did not change much from when they were created in the 1600s. Queens County included what is now Nassau County, and there were towns in King's County that were later merged into Brooklyn. See the corresponding layer above called "Long Island Towns".
			`;
			

			/* Indian Paths & Places | 1600-64 */

modal_header_text["long-island-1734"] = "Long Island and Rhode Island, 1734";
modal_content_html["long-island-1734"] = `
			This map from 1734 shows Long Island in detail, and the coastline to the north from New Jersey through Connecticut and Rhode Island. Within the same eastern latitude there is a small part of the coast of Nova Scotia at Cape Conso, and part of Island Breton.
			<p>
			It was created by Cyprian Southack, an English cartographer and colonial naval commander in New England.
			`;
			
			
			/* New England 1670 */
modal_header_text["new-england-1670"] = "New England, 1670";
modal_content_html["new-england-1670"] = `

<i>A map of New England from Sandy Point in the south to the Saco River in the north New England and part of New York, including Long Island</i>
			<br><br>This map was created in 1670, shortly after the English captured New Netherland. 
			Previously the English relied on Dutch maps for areas to the west of New England, and this was the first 
			English map that showed the Hudson Valley in detail, and the most detail of Long Island in any map at the time.
			 Eastward is the central area of New England at the time - Connecticut, Rhode Island, Massachussets, and the southern parts of Vermont and New Hampshire.
			  The map was created by John Scott, a notorious figure in Long Island history, and faded considerably over time.
			`;

			/* Manatus Map */
			modal_header_text["manatus-map"] = "Manatus Map, 1639";
			modal_content_html["manatus-map"] = `
			
			<i>Manatvs Gelegen op de Noot Riuier</i>
			<br>(Manhattan Lying on the North River)
			<br><br>
			This is the first true map of Manhattan and settlements of New Netherland surrounding the harbor. Shown are 45 houses or farms and their owners, and Lenape settlements and slave quarters. It was created in 1639 following a survey commissioned the year before.
			<p>
			The author is believed by some to be Johannes Vingboons, but historians such as I. N. Stokes and Richard Stephenson consider that unlikely. This colorful copy created around 1670 by an unknown artist.

			`;

/*

//

modal_header_text["settlements-labels-info-layer"] = "settlements infoooo";
modal_content_html["settlements-labels-info-layer"] = `
			Description coming soon.
			`;
*/

