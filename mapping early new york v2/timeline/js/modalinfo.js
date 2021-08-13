var modal_header_text = [];
var modal_content_html = [];

modal_header_text["about"] = "ABOUT";
modal_content_html["about"] = `
             New York City was founded by the Dutch in 1624 as <i>New Amsterdam</i>,
			 the capital of New Netherland. The New Amsterdam History Center
			 is devoted to documenting and mapping New Amsterdam, its
			 diverse people, landscapes, institutions and global legacy today.
			<p>
			We’ve presented several versions of the <i>Castello Plan</i> and the 
			 <i>Dutch Grants Map</i> here.
			 You can see the settlement of houses, farms,
			 taverns and workshops, surrounded by walls. Over the three
			 centuries that followed, the area became the Financial District.
			 The east wall was torn down and named Wall Street. The canals
			 were paved over and turned into streets and in between developed
			 skysrapers, and the island was expanded with infill.
			 Above ground, almost nothing remains of New Amsterdam except the 
			 original street pattern.  Underground, archeologists have found 
			 evidence of the plots of houses and gardens, Amsterdam yellow 
			 brick, and pollen samples of plants.
			<p>
			You can swipe the map to compare the Castello Plan in 1660
			 to the present,
			 and explore each lot, where it shows what was there and who lived
			 there. Our next steps are to expand through the full history
			 of New Amsterdam with a timeline from 1624 to 1664, when it
			 was taken over
			 by the English.
			<p>
			We need your help to make this work happen. Donate now to
			 develop the map and expand the research.
			<p>
			`;
		
modal_header_text["info"] = modal_header_text["about"];
modal_content_html["info"] = modal_content_html["about"];

modal_header_text["grants-info-layer"] = "Dutch Grants Layer";
modal_content_html["grants-info-layer"] = `
            <i class="fa fa-square" style="color: #e3ed58;" ></i> Dutch Grants
            <br>
			<i class="far fa-square" style="color: #e3ed58;" ></i> Dutch Grants Lines
            `;
			
modal_header_text["castello-info-layer"] = "Castello Taxlots Layer";
modal_content_html["castello-info-layer"] = `
            <i class="fa fa-circle"  style="color: #FF0000;" ></i>  Castello Taxlots (1660)
            `;

modal_header_text["current-lots-info-layer"] = "Current Lots Layer";
modal_content_html["current-lots-info-layer"] = `
            <i class="fa fa-square" style="color: #7B68EE;" ></i> Current Lots
			<br>
			<i class="far fa-square" style="color: #000080;"></i> Current Lots Lines
            `;
			
modal_header_text["current-buildings-lines-info-layer"] = "Current Buildings Layer";
modal_content_html["current-buildings-lines-info-layer"] = `
            <i class="far fa-square" style="color: #FF0000;"></i> Current Buildings Lines
            `;


			