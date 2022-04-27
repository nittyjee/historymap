var grant_lots_view_id = null,
    dgrants_layer_view_id = null,
	farms_layer_view_id = null,
	curr_layer_view_id = null,
    grant_lots_view_flag = false,
    demo_layer_view_flag = false,
    castello_layer_view_flag = false,
	dgrants_layer_view_flag = false,
	farms_layer_view_flag = false,
	curr_layer_view_flag = false;
	
$("#infoLayerGrantLots").slideUp();
$("#infoLayerDutchGrants").slideUp();
$("#infoLayerFarms").slideUp();
$("#demoLayerInfo").slideUp();
$("#infoLayerCastello").slideUp();
$("#infoLayerCurrLots").slideUp();

/////////////////////////////
//ACCESS TOKEN
/////////////////////////////

mapboxgl.accessToken =
	"pk.eyJ1Ijoibml0dHlqZWUiLCJhIjoid1RmLXpycyJ9.NFk875-Fe6hoRCkGciG8yQ";




/////////////////////////////
//ADD MAP CONTAINER
/////////////////////////////

        var beforeMap = new mapboxgl.Map({
            container: 'before',
            style: 'mapbox://styles/nittyjee/cjooubzup2kx52sqdf9zmmv2j',
            center: [0, 0],
            zoom: 0,
			attributionControl: false
        });

        var afterMap = new mapboxgl.Map({
            container: 'after',
            style: 'mapbox://styles/nittyjee/cjowjzrig5pje2rmmnjb5b0y2',
            center: [0, 0],
            zoom: 0,
			attributionControl: false
        });

        var map = new mapboxgl.Compare(beforeMap, afterMap, {
            // Set this to enable comparing two maps by mouse movement:
            // mousemove: true
        });

        /////////////////////////////
        //ADD NAVIGATION CONTROLS (ZOOM IN AND OUT)
        /////////////////////////////

        //Before map
        var nav = new mapboxgl.NavigationControl();
        beforeMap.addControl(nav, "top-right");

        //After map
        var nav = new mapboxgl.NavigationControl();
        afterMap.addControl(nav, "top-right");



        /////////////////////////////
        //BASEMAP MENU SWITCHING FUNCTIONALITY
		/////////////////////////////


		//RIGHT MENU
        var rightInputs = document.getElementsByName('rtoggle');
		
        function switchRightLayer(layer) {
            var rightLayerClass = layer.target.className; //*A layer.target.id;
            afterMap.setStyle('mapbox://styles/nittyjee/' + rightLayerClass);
        }

        for (var i = 0; i < rightInputs.length; i++) {
            rightInputs[i].onclick = switchRightLayer;
		}


		//LEFT MENU
		var leftInputs = document.getElementsByName('ltoggle');
		
        function switchLeftLayer(layer) {
            var leftLayerClass = layer.target.className; //*A layer.target.id;
            beforeMap.setStyle('mapbox://styles/nittyjee/' + leftLayerClass);
        }

        for (var i = 0; i < leftInputs.length; i++) {
            leftInputs[i].onclick = switchLeftLayer;
		}







/////////////////////////////
// on Map events
/////////////////////////////

urlHash = window.location.hash;
var castello_click_ev = false,
    grant_lots_click_ev = false,
	demo_taxlot_click_ev = false,
	dutch_grant_click_ev = false,
	farms_click_ev = false,
	curr_layer_click_ev = false;
    

var afterMapPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false }),
    beforeMapPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false });

var coordinates = [];
var places_popup_html = "";

var afterMapPlacesPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false }),
    beforeMapPlacesPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false });
	
var afterHighCastelloPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false }),
    beforeHighCastelloPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false });

var afterHighDemoPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false }),
    beforeHighDemoPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false });
	
var afterHighGrantLotsPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 }),
    beforeHighGrantLotsPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 });
	
var afterHighCurrLotsPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 }),
    beforeHighCurrLotsPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 });
	
var afterMapGrantLotPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 }),
    beforeMapGrantLotPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 });

//*A#
var afterHighMapGrantLotPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 }),
    beforeHighMapGrantLotPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 });

var afterMapDutchGrantPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 }),
    beforeMapDutchGrantPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 });

var afterHighFarmPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 }),
    beforeHighFarmPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 });

var afterMapFarmPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 }),
    beforeMapFarmPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 });

var afterMapCurrLotsPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 }),
    beforeMapCurrLotsPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 });

var hoveredStateIdRight = null,
    hoveredStateIdLeft = null,
	hoveredStateIdRightCircle = null,
    hoveredStateIdLeftCircle = null,
	hoveredGrantStateIdRight = null,
	hoveredGrantStateIdLeft = null,
	hoveredGrantLotIdRight = null,
	hoveredGrantLotIdLeft = null,
	hoveredDutchGrantIdRight = null,
	hoveredDutchGrantIdLeft = null,
	hoveredFarmsIdRight = null,
	hoveredFarmsIdLeft = null,
	hoveredCurrLotsIdRight = null,
	hoveredCurrLotsIdLeft = null;
	
var clickedStateId = null;
	
var demo_layer_features = null;

beforeMap.on("load", function () {
	console.log("load");
	var sliderVal = moment($("#date").val()).unix();
	var yr = parseInt(moment.unix(sliderVal).format("YYYY"));
	var date = parseInt(moment.unix(sliderVal).format("YYYYMMDD"));
    
	
		// CLICK AND OPEN POPUP
		beforeMap.on('click', 'c7_dates-ajsksu-left', function (e) {
		          
            DemoClickHandle(e);
				  
		}).on('click', 'places-left', function (e) {
              
			CastelloClickHandle(e);
			  
        }).on('click', 'grant-lots-left' , function (e) {
				        
            GrantLotsHandle(e);
						
		}).on('click', 'stokes_farms_complete_5_reduc-6k9tbl-left' , function (e) {
					
		    FarmsClickHandle(e);
						
		}).on('click', 'grants1-5sp9tb-left' , function (e) {
				        
			DutchGrantsClickHandle(e);
						
		}).on('click', 'curr-lots-left' , function (e) {
				        
            CurrLotsHandle(e);
						
		}).on('click', function () {
					
			DefaultHandle();
					
		});
	
	
});

afterMap.on("load", function () {
	console.log("load");
	//*A var sliderVal = $("#date").val();
	var sliderVal = moment($("#date").val()).unix();
	var yr = parseInt(moment.unix(sliderVal).format("YYYY"));
	var date = parseInt(moment.unix(sliderVal).format("YYYYMMDD"));
    
	
		// CLICK AND OPEN POPUP
		afterMap.on('click', 'c7_dates-ajsksu-right', function (e) {
			
            DemoClickHandle(e);
			
		}).on('click', 'places-right', function (e) {
			
			CastelloClickHandle(e);
			
        }).on('click', 'grant-lots-right' , function (e) {
				        
            GrantLotsHandle(e);
						
		}).on('click', 'stokes_farms_complete_5_reduc-6k9tbl-right' , function (e) {
					
		    FarmsClickHandle(e);
						
		}).on('click', 'grants1-5sp9tb-right' , function (e) {
					
		    DutchGrantsClickHandle(e);
						
		}).on('click', 'curr-lots-right' , function (e) {
				        
			CurrLotsHandle(e);		
						
		}).on('click', function () {
			        
			DefaultHandle();
					
		});

	
});

beforeMap.on("error", function (e) {
	// Hide those annoying non-error errors
	if (e && e.error !== "Error") console.log(e);
});

afterMap.on("error", function (e) {
	// Hide those annoying non-error errors
	if (e && e.error !== "Error") console.log(e);
});


//////////////////////////////////////////////
// ===== Layers click event functions ======
//////////////////////////////////////////////
	    
		function DefaultHandle() {
		
		            if(!demo_taxlot_click_ev && !castello_click_ev && !grant_lots_click_ev && !dutch_grant_click_ev && !farms_click_ev && !curr_layer_click_ev) {
                        if(windoWidth > 555)
			                $('#view-hide-layer-panel').trigger('click');
					}
					
					demo_taxlot_click_ev = false;
					castello_click_ev = false;
					grant_lots_click_ev = false;
					dutch_grant_click_ev = false;
					farms_click_ev = false;
					curr_layer_click_ev = false;
		
		}
		
		
		function CurrLotsHandle(event) {
			            var highPopUpHTML = "<div class='infoLayerCurrLotsPopUp'>" + "<b>" + event.features[0].properties.OwnerName + "</b>" + "<br>" +
									        event.features[0].properties.Address + "</div>";	
			
			 		    if(layer_view_flag) {
							if(curr_layer_view_id == event.features[0].id) {
								if(curr_layer_view_flag) {
							        $("#infoLayerCurrLots").slideUp(); 
									curr_layer_view_flag = false;
									//*A#
									afterMap.setFeatureState(
                                        { source: 'curr-lots-high-right', sourceLayer: 'current_lots_1-ca6kq1', id: curr_layer_view_id},
                                        { hover: false }
                                    );
									beforeMap.setFeatureState(
                                        { source: 'curr-lots-high-left', sourceLayer: 'current_lots_1-ca6kq1', id: curr_layer_view_id},
                                        { hover: false }
                                    );
									if(afterHighCurrLotsPopUp.isOpen()) afterHighCurrLotsPopUp.remove();
									if(beforeHighCurrLotsPopUp.isOpen()) beforeHighCurrLotsPopUp.remove();
								} else {
									buildCurrLotsPopUpInfo(event.features[0].properties);
							        $("#infoLayerCurrLots").slideDown();
								    curr_layer_view_flag = true;
									//*A#
									afterMap.setFeatureState(
                                       { source: 'curr-lots-high-right', sourceLayer: 'current_lots_1-ca6kq1', id: curr_layer_view_id},
                                       { hover: true }
                                    );
									beforeMap.setFeatureState(
                                       { source: 'curr-lots-high-left', sourceLayer: 'current_lots_1-ca6kq1', id: curr_layer_view_id},
                                       { hover: true }
                                    );
									afterHighCurrLotsPopUp.setLngLat(event.lngLat).setHTML(highPopUpHTML);
							        if(!afterHighCurrLotsPopUp.isOpen()) afterHighCurrLotsPopUp.addTo(afterMap);
							        beforeHighCurrLotsPopUp.setLngLat(event.lngLat).setHTML(highPopUpHTML);
							        if(!beforeHighCurrLotsPopUp.isOpen()) beforeHighCurrLotsPopUp.addTo(beforeMap);
								}
							} else {
								buildCurrLotsPopUpInfo(event.features[0].properties);
							    $("#infoLayerCurrLots").slideDown();
								curr_layer_view_flag = true;
								//*A#
								afterMap.setFeatureState(
                                    { source: 'curr-lots-high-right', sourceLayer: 'current_lots_1-ca6kq1', id: curr_layer_view_id},
                                    { hover: false }
                                );
								afterMap.setFeatureState(
                                    { source: 'curr-lots-high-right', sourceLayer: 'current_lots_1-ca6kq1', id: event.features[0].id},
                                    { hover: true }
                                );
								beforeMap.setFeatureState(
                                    { source: 'curr-lots-high-left', sourceLayer: 'current_lots_1-ca6kq1', id: curr_layer_view_id},
                                    { hover: false }
                                );
							    beforeMap.setFeatureState(
                                    { source: 'curr-lots-high-left', sourceLayer: 'current_lots_1-ca6kq1', id: event.features[0].id},
                                    { hover: true }
                                );
								afterHighCurrLotsPopUp.setLngLat(event.lngLat).setHTML(highPopUpHTML);
								if(!afterHighCurrLotsPopUp.isOpen()) afterHighCurrLotsPopUp.addTo(afterMap);
							    beforeHighCurrLotsPopUp.setLngLat(event.lngLat).setHTML(highPopUpHTML);
							    if(!beforeHighCurrLotsPopUp.isOpen()) beforeHighCurrLotsPopUp.addTo(beforeMap);
							}
							curr_layer_view_id = event.features[0].id;
						} else {
							buildCurrLotsPopUpInfo(event.features[0].properties);
							$("#infoLayerCurrLots").slideDown();
							$('#view-hide-layer-panel').trigger('click');
							//*A#
							afterMap.setFeatureState(
                                { source: 'curr-lots-high-right', sourceLayer: 'current_lots_1-ca6kq1', id: curr_layer_view_id},
                                { hover: false }
                            );
							afterMap.setFeatureState(
                                { source: 'curr-lots-high-right', sourceLayer: 'current_lots_1-ca6kq1', id: event.features[0].id},
                                { hover: true }
                            );
						    beforeMap.setFeatureState(
                                { source: 'curr-lots-high-left', sourceLayer: 'current_lots_1-ca6kq1', id: curr_layer_view_id},
                                { hover: false }
                            );
							beforeMap.setFeatureState(
                                { source: 'curr-lots-high-left', sourceLayer: 'current_lots_1-ca6kq1', id: event.features[0].id},
                                { hover: true }
                            );
							afterHighCurrLotsPopUp.setLngLat(event.lngLat).setHTML(highPopUpHTML);
						    if(!afterHighCurrLotsPopUp.isOpen()) afterHighCurrLotsPopUp.addTo(afterMap);
							beforeHighCurrLotsPopUp.setLngLat(event.lngLat).setHTML(highPopUpHTML);
							if(!beforeHighCurrLotsPopUp.isOpen()) beforeHighCurrLotsPopUp.addTo(beforeMap);
							curr_layer_view_id = event.features[0].id;
							//curr_layer_view_id = null;
					    } 
						
						curr_layer_click_ev = true;
		}

			 

        function GrantLotsHandle(event) { 
		            
					var highPopUpHTML = "<div class='infoLayerGrantLotsPopUp'>" +
									    event.features[0].properties.name + "<br>" +
										"<b>Start:</b> " + event.features[0].properties.day1 + ", " + event.features[0].properties.year1 + "<br>" +
										"<b>End:</b> " + event.features[0].properties.day2 + ", " + event.features[0].properties.year2 + "<br>" +
										//"<br>" +
										"<b>Lot Division: </b>" + event.features[0].properties.dutchlot +
									    "</div>";
		
						if(layer_view_flag) {
							if(grant_lots_view_id == event.features[0].id) {
								if(grant_lots_view_flag) {
							        $("#infoLayerGrantLots").slideUp(); 
									grant_lots_view_flag = false;
									if(afterHighGrantLotsPopUp.isOpen()) afterHighGrantLotsPopUp.remove();
									if(beforeHighGrantLotsPopUp.isOpen()) beforeHighGrantLotsPopUp.remove();
								} else {
									//$("#infoLayerGrantLots").html(event.features[0].properties.name).slideDown();
									buildGrantLotsPopUpInfo(event.features[0].properties);
							        $("#infoLayerGrantLots").slideDown();
								    grant_lots_view_flag = true;
									afterHighGrantLotsPopUp.setLngLat(event.lngLat).setHTML(highPopUpHTML);
									if(!afterHighGrantLotsPopUp.isOpen()) afterHighGrantLotsPopUp.addTo(afterMap);
									beforeHighGrantLotsPopUp.setLngLat(event.lngLat).setHTML(highPopUpHTML);
									if(!beforeHighGrantLotsPopUp.isOpen()) beforeHighGrantLotsPopUp.addTo(beforeMap);
								}
							} else {
			                    //$("#infoLayerGrantLots").html(event.features[0].properties.name).slideDown();
								buildGrantLotsPopUpInfo(event.features[0].properties);
							    $("#infoLayerGrantLots").slideDown();
								grant_lots_view_flag = true;
								afterHighGrantLotsPopUp.setLngLat(event.lngLat).setHTML(highPopUpHTML);
								if(!afterHighGrantLotsPopUp.isOpen()) afterHighGrantLotsPopUp.addTo(afterMap);
								beforeHighGrantLotsPopUp.setLngLat(event.lngLat).setHTML(highPopUpHTML);
								if(!beforeHighGrantLotsPopUp.isOpen()) beforeHighGrantLotsPopUp.addTo(beforeMap);
							}
							grant_lots_view_id = event.features[0].id;
						} else {
							//$("#infoLayerGrantLots").html(event.features[0].properties.name).slideDown();
							buildGrantLotsPopUpInfo(event.features[0].properties);
							$("#infoLayerGrantLots").slideDown();
							$('#view-hide-layer-panel').trigger('click');
							grant_lots_view_id = null;
							afterHighGrantLotsPopUp.setLngLat(event.lngLat).setHTML(highPopUpHTML);
							if(!afterHighGrantLotsPopUp.isOpen()) afterHighGrantLotsPopUp.addTo(afterMap);
							beforeHighGrantLotsPopUp.setLngLat(event.lngLat).setHTML(highPopUpHTML);
							if(!beforeHighGrantLotsPopUp.isOpen()) beforeHighGrantLotsPopUp.addTo(beforeMap);
					    } 
						
						grant_lots_click_ev = true;
        }
		
			 
        function DemoClickHandle(event) { 
					if(demo_layer_view_flag) {
				        $("#demoLayerInfo").slideUp();
						demo_layer_view_flag = false;
						//if(afterMapPopUp.isOpen()) afterMapPopUp.remove();
						if(afterHighDemoPopUp.isOpen()) afterHighDemoPopUp.remove();
						if(beforeHighDemoPopUp.isOpen()) beforeHighDemoPopUp.remove();
					} else {
						
						buildPopUpInfo(event.features[0].properties);
					    $("#demoLayerInfo").slideDown();
						demo_layer_view_flag = true;
						if(!layer_view_flag) $('#view-hide-layer-panel').trigger('click');
						
						beforeHighDemoPopUp
                        .setLngLat(coordinates)
                        .setHTML("<div class='demoLayerInfoPopUp'><b><h2>Taxlot: <a href='https://nahc-mapping.org/mappingNY/encyclopedia/taxlot/c7' target='_blank'>C7</a></h2></b></div>");
					    if(!beforeHighDemoPopUp.isOpen()) beforeHighDemoPopUp.addTo(beforeMap);
					
					    afterHighDemoPopUp
                        .setLngLat(coordinates)
						.setHTML("<div class='demoLayerInfoPopUp'><b><h2>Taxlot: <a href='https://nahc-mapping.org/mappingNY/encyclopedia/taxlot/c7' target='_blank'>C7</a></h2></b></div>");
					    if(!afterHighDemoPopUp.isOpen()) afterHighDemoPopUp.addTo(afterMap);
					}
					demo_taxlot_click_ev = true;
        }
	
	
	    function CastelloClickHandle(event) {
	        if(castello_layer_view_flag && (clickedStateId == event.features[0].id) ) {
				        $("#infoLayerCastello").slideUp();
						castello_layer_view_flag = false;
						//if(afterMapPlacesPopUp.isOpen()) afterMapPlacesPopUp.remove();
						if(afterHighCastelloPopUp.isOpen()) afterHighCastelloPopUp.remove();
						if(beforeHighCastelloPopUp.isOpen()) beforeHighCastelloPopUp.remove();
		    } else {
				    clickedStateId = event.features[0].id;
				
					places_popup_html = "<h3>Castello Taxlot (1660)</h3><hr>" +
						"<br>" +
						"<b>" + "Taxlot: " + "</b>" + 
						event.features[0].properties.LOT2 +
						"<br>" +
						"<b>" + "Property Type: " + "</b>" + 
						event.features[0].properties.tax_lots_1 +
						"<br>" +
						"<br>" +
						"<b>" + "Encyclopedia Page: " + "</b>" + 
						"<br>" +
						'<a href="' + event.features[0].properties.new_link + '" target="_blank">' + event.features[0].properties.new_link + '</a>';
				
				coordinates = event.features[0].geometry.coordinates.slice();
                //var description = event.features[0].properties.description;

                // Ensure that if the map is zoomed out such that multiple
                // copies of the feature are visible, the popup appears
                // over the copy being pointed to.
                while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360;
                }
				
					beforeHighCastelloPopUp
                        .setLngLat(coordinates)
                        .setHTML("<div class='infoLayerCastelloPopUp'>" + "<b>Taxlot (1660):</b> " + "<br>" + event.features[0].properties.LOT2 + "</div>");
					if(!beforeHighCastelloPopUp.isOpen()) beforeHighCastelloPopUp.addTo(beforeMap);
					
					afterHighCastelloPopUp
                        .setLngLat(coordinates)
						.setHTML("<div class='infoLayerCastelloPopUp'>" + "<b>Taxlot (1660):</b> " + "<br>" + event.features[0].properties.LOT2 + "</div>");
					if(!afterHighCastelloPopUp.isOpen()) afterHighCastelloPopUp.addTo(afterMap);
					
					$("#infoLayerCastello").html(places_popup_html).slideDown();
				    castello_layer_view_flag = true;
					if(!layer_view_flag) $('#view-hide-layer-panel').trigger('click');
			}
		    castello_click_ev = true;
        }
	
	
		function FarmsClickHandle(event) {
	
			            var highPopUpHTML = "<div class='infoLayerFarmsPopUp'>" + event.features[0].properties.To + "</div>";
								
						if(layer_view_flag) {
							if(farms_layer_view_id == event.features[0].id) {
								if(farms_layer_view_flag) {
							        $("#infoLayerFarms").slideUp(); 
									farms_layer_view_flag = false;
									//*A#
							        afterMap.setFeatureState(
                                        { source: 'stokes_farms_complete_5_reduc-6k9tbl-right-highlighted', sourceLayer: 'stokes_farms_complete_5_reduc-6k9tbl', id: farms_layer_view_id},
                                        { hover: false }
                                    );
									beforeMap.setFeatureState(
                                        { source: 'stokes_farms_complete_5_reduc-6k9tbl-left-highlighted', sourceLayer: 'stokes_farms_complete_5_reduc-6k9tbl', id: farms_layer_view_id},
                                        { hover: false }
                                    );
									if(afterHighFarmPopUp.isOpen()) afterHighFarmPopUp.remove();
									if(beforeHighFarmPopUp.isOpen()) beforeHighFarmPopUp.remove();
								} else {
									buildFarmsPopUpInfo(event.features[0].properties);
							        $("#infoLayerFarms").slideDown();
								    farms_layer_view_flag = true;
									//*A#
									afterMap.setFeatureState(
                                       { source: 'stokes_farms_complete_5_reduc-6k9tbl-right-highlighted', sourceLayer: 'stokes_farms_complete_5_reduc-6k9tbl', id: farms_layer_view_id},
                                       { hover: true }
                                    );
									beforeMap.setFeatureState(
                                       { source: 'stokes_farms_complete_5_reduc-6k9tbl-left-highlighted', sourceLayer: 'stokes_farms_complete_5_reduc-6k9tbl', id: farms_layer_view_id},
                                       { hover: true }
                                    );
									afterHighFarmPopUp.setLngLat(event.lngLat).setHTML(highPopUpHTML);
									if(!afterHighFarmPopUp.isOpen()) afterHighFarmPopUp.addTo(afterMap);
									beforeHighFarmPopUp.setLngLat(event.lngLat).setHTML(highPopUpHTML);
									if(!beforeHighFarmPopUp.isOpen()) beforeHighFarmPopUp.addTo(beforeMap);
								}
							} else {
								buildFarmsPopUpInfo(event.features[0].properties);
							    $("#infoLayerFarms").slideDown();
								farms_layer_view_flag = true;
								//*A#
								afterMap.setFeatureState(
                                    { source: 'stokes_farms_complete_5_reduc-6k9tbl-right-highlighted', sourceLayer: 'stokes_farms_complete_5_reduc-6k9tbl', id: farms_layer_view_id},
                                    { hover: false }
                                );
							    afterMap.setFeatureState(
                                    { source: 'stokes_farms_complete_5_reduc-6k9tbl-right-highlighted', sourceLayer: 'stokes_farms_complete_5_reduc-6k9tbl', id: event.features[0].id},
                                    { hover: true }
                                );
								beforeMap.setFeatureState(
                                    { source: 'stokes_farms_complete_5_reduc-6k9tbl-left-highlighted', sourceLayer: 'stokes_farms_complete_5_reduc-6k9tbl', id: farms_layer_view_id},
                                    { hover: false }
                                );
							    beforeMap.setFeatureState(
                                    { source: 'stokes_farms_complete_5_reduc-6k9tbl-left-highlighted', sourceLayer: 'stokes_farms_complete_5_reduc-6k9tbl', id: event.features[0].id},
                                    { hover: true }
                                );
                                afterHighFarmPopUp.setLngLat(event.lngLat).setHTML(highPopUpHTML);
								if(!afterHighFarmPopUp.isOpen()) afterHighFarmPopUp.addTo(afterMap);
								beforeHighFarmPopUp.setLngLat(event.lngLat).setHTML(highPopUpHTML);
							    if(!beforeHighFarmPopUp.isOpen()) beforeHighFarmPopUp.addTo(beforeMap);
							}
							farms_layer_view_id = event.features[0].id;
						} else {
							buildFarmsPopUpInfo(event.features[0].properties);
							$("#infoLayerFarms").slideDown();
							$('#view-hide-layer-panel').trigger('click');
							//*A#
							afterMap.setFeatureState(
                                { source: 'stokes_farms_complete_5_reduc-6k9tbl-right-highlighted', sourceLayer: 'stokes_farms_complete_5_reduc-6k9tbl', id: farms_layer_view_id},
                                { hover: false }
                            );
							afterMap.setFeatureState(
                                { source: 'stokes_farms_complete_5_reduc-6k9tbl-right-highlighted', sourceLayer: 'stokes_farms_complete_5_reduc-6k9tbl', id: event.features[0].id},
                                { hover: true }
                            );
							beforeMap.setFeatureState(
                                { source: 'stokes_farms_complete_5_reduc-6k9tbl-left-highlighted', sourceLayer: 'stokes_farms_complete_5_reduc-6k9tbl', id: farms_layer_view_id},
                                { hover: false }
                            );
							beforeMap.setFeatureState(
                                { source: 'stokes_farms_complete_5_reduc-6k9tbl-left-highlighted', sourceLayer: 'stokes_farms_complete_5_reduc-6k9tbl', id: event.features[0].id},
                                { hover: true }
                            );
							afterHighFarmPopUp.setLngLat(event.lngLat).setHTML(highPopUpHTML);
							if(!afterHighFarmPopUp.isOpen()) afterHighFarmPopUp.addTo(afterMap);
							beforeHighFarmPopUp.setLngLat(event.lngLat).setHTML(highPopUpHTML);
							if(!beforeHighFarmPopUp.isOpen()) beforeHighFarmPopUp.addTo(beforeMap);
							farms_layer_view_id = event.features[0].id;
							//farms_layer_view_id = null;
					    } 
						
						farms_click_ev = true;
    }
	
	
	function DutchGrantsClickHandle(event) {
	
			        var highPopUpHTML = "";
					if( typeof dutch_grant_lots_info[event.features[0].properties.Lot] == "undefined" ) {
						highPopUpHTML = "<div class='infoLayerDutchGrantsPopUp'>" + event.features[0].properties.name + "<br>";	
					} else {	
						highPopUpHTML = "<div class='infoLayerDutchGrantsPopUp'>" + ( dutch_grant_lots_info[event.features[0].properties.Lot].name_txt.length > 0 ? dutch_grant_lots_info[event.features[0].properties.Lot].name_txt : event.features[0].properties.name ) + "<br>";
					}
					highPopUpHTML += "<b>Dutch Grant Lot: </b>" + event.features[0].properties.Lot + "</div>";
						
						if(layer_view_flag) {
							if(dgrants_layer_view_id == event.features[0].id) {
								if(dgrants_layer_view_flag) {
							        $("#infoLayerDutchGrants").slideUp(); 
									dgrants_layer_view_flag = false;
									//*A#
							        afterMap.setFeatureState(
                                        { source: 'grants1-5sp9tb-right-highlighted', sourceLayer: 'grants1-5sp9tb', id: dgrants_layer_view_id},
                                        { hover: false }
                                    );
									beforeMap.setFeatureState(
                                        { source: 'grants1-5sp9tb-left-highlighted', sourceLayer: 'grants1-5sp9tb', id: dgrants_layer_view_id},
                                        { hover: false }
                                    );
									if(afterHighMapGrantLotPopUp.isOpen()) afterHighMapGrantLotPopUp.remove();
									if(beforeHighMapGrantLotPopUp.isOpen()) beforeHighMapGrantLotPopUp.remove();
								} else {
									buildDutchGrantPopUpInfo(event.features[0].properties);
							        $("#infoLayerDutchGrants").slideDown();
								    dgrants_layer_view_flag = true;
									//*A#
									afterMap.setFeatureState(
                                       { source: 'grants1-5sp9tb-right-highlighted', sourceLayer: 'grants1-5sp9tb', id: dgrants_layer_view_id},
                                       { hover: true }
                                    );
									beforeMap.setFeatureState(
                                       { source: 'grants1-5sp9tb-left-highlighted', sourceLayer: 'grants1-5sp9tb', id: dgrants_layer_view_id},
                                       { hover: true }
                                    );
									afterHighMapGrantLotPopUp.setLngLat(event.lngLat).setHTML(highPopUpHTML);
									if(!afterHighMapGrantLotPopUp.isOpen()) afterHighMapGrantLotPopUp.addTo(afterMap);
									beforeHighMapGrantLotPopUp.setLngLat(event.lngLat).setHTML(highPopUpHTML);
									if(!beforeHighMapGrantLotPopUp.isOpen()) beforeHighMapGrantLotPopUp.addTo(beforeMap);
								}
							} else {
								buildDutchGrantPopUpInfo(event.features[0].properties);
							    $("#infoLayerDutchGrants").slideDown();
								dgrants_layer_view_flag = true;
								//*A#
								afterMap.setFeatureState(
                                    { source: 'grants1-5sp9tb-right-highlighted', sourceLayer: 'grants1-5sp9tb', id: dgrants_layer_view_id},
                                    { hover: false }
                                );
							    afterMap.setFeatureState(
                                    { source: 'grants1-5sp9tb-right-highlighted', sourceLayer: 'grants1-5sp9tb', id: event.features[0].id},
                                    { hover: true }
                                );
								beforeMap.setFeatureState(
                                    { source: 'grants1-5sp9tb-left-highlighted', sourceLayer: 'grants1-5sp9tb', id: dgrants_layer_view_id},
                                    { hover: false }
                                );
							    beforeMap.setFeatureState(
                                    { source: 'grants1-5sp9tb-left-highlighted', sourceLayer: 'grants1-5sp9tb', id: event.features[0].id},
                                    { hover: true }
                                );
                                afterHighMapGrantLotPopUp.setLngLat(event.lngLat).setHTML(highPopUpHTML);
								if(!afterHighMapGrantLotPopUp.isOpen()) afterHighMapGrantLotPopUp.addTo(afterMap);
								beforeHighMapGrantLotPopUp.setLngLat(event.lngLat).setHTML(highPopUpHTML);
							    if(!beforeHighMapGrantLotPopUp.isOpen()) beforeHighMapGrantLotPopUp.addTo(beforeMap);
							}
							dgrants_layer_view_id = event.features[0].id;
						} else {
							buildDutchGrantPopUpInfo(event.features[0].properties);
							$("#infoLayerDutchGrants").slideDown();
							$('#view-hide-layer-panel').trigger('click');
							//*A#
							afterMap.setFeatureState(
                                { source: 'grants1-5sp9tb-right-highlighted', sourceLayer: 'grants1-5sp9tb', id: dgrants_layer_view_id},
                                { hover: false }
                            );
							afterMap.setFeatureState(
                                { source: 'grants1-5sp9tb-right-highlighted', sourceLayer: 'grants1-5sp9tb', id: event.features[0].id},
                                { hover: true }
                            );
							beforeMap.setFeatureState(
                                { source: 'grants1-5sp9tb-left-highlighted', sourceLayer: 'grants1-5sp9tb', id: dgrants_layer_view_id},
                                { hover: false }
                            );
							beforeMap.setFeatureState(
                                { source: 'grants1-5sp9tb-left-highlighted', sourceLayer: 'grants1-5sp9tb', id: event.features[0].id},
                                { hover: true }
                            );
							afterHighMapGrantLotPopUp.setLngLat(event.lngLat).setHTML(highPopUpHTML);
							if(!afterHighMapGrantLotPopUp.isOpen()) afterHighMapGrantLotPopUp.addTo(afterMap);
							beforeHighMapGrantLotPopUp.setLngLat(event.lngLat).setHTML(highPopUpHTML);
							if(!beforeHighMapGrantLotPopUp.isOpen()) beforeHighMapGrantLotPopUp.addTo(beforeMap);
							dgrants_layer_view_id = event.features[0].id;
							//dgrants_layer_view_id = null;
					    } 
						
						dutch_grant_click_ev = true;
    }

//////////////////////////////////////////////
//TIME LAYER FILTERING. NOT SURE HOW WORKS.
//////////////////////////////////////////////


function changeDate(unixDate) {
	var year = parseInt(moment.unix(unixDate).format("YYYY"));
	var date = parseInt(moment.unix(unixDate).format("YYYYMMDD"));

	var yrFilter = ["all", ["<=", "YearStart", year], [">=", "YearEnd", year]];
	var dateFilter = ["all", ["<=", "DayStart", date], [">=", "DayEnd", date]];


    



	///////////////////////////////
	//LAYERS FOR FILTERING
	///////////////////////////////


	//NAHC
	beforeMap.setFilter("grants1-5sp9tb-left", dateFilter);
    afterMap.setFilter("grants1-5sp9tb-right", dateFilter);
	
	beforeMap.setFilter("grants1-5sp9tb-left-highlighted", dateFilter);
	afterMap.setFilter("grants1-5sp9tb-right-highlighted", dateFilter);
	
    beforeMap.setFilter("stokes_farms_complete_5_reduc-6k9tbl-left", dateFilter);
	afterMap.setFilter("stokes_farms_complete_5_reduc-6k9tbl-right", dateFilter);
	
	beforeMap.setFilter("stokes_farms_complete_5_reduc-6k9tbl-left-highlighted", dateFilter);
	afterMap.setFilter("stokes_farms_complete_5_reduc-6k9tbl-right-highlighted", dateFilter);
	
	beforeMap.setFilter("c7_dates-ajsksu-left", dateFilter);
	afterMap.setFilter("c7_dates-ajsksu-right", dateFilter);
	
	beforeMap.setFilter("grant-lots-left", dateFilter);
	afterMap.setFilter("grant-lots-right", dateFilter);
	

	
	beforeMap.setFilter("grant-lots-lines-left", dateFilter);
	afterMap.setFilter("grant-lots-lines-right", dateFilter);
	
	beforeMap.setFilter("farms-lines-left", dateFilter);
	afterMap.setFilter("farms-lines-right", dateFilter);
	
	beforeMap.setFilter("settlements-left", dateFilter);
	afterMap.setFilter("settlements-right", dateFilter);


/*START ADDED BY NITIN*/

	beforeMap.setFilter("settlements-labels-left", dateFilter);
	afterMap.setFilter("settlements-labels-right", dateFilter);
	
/*END ADDED BY NITIN*/

    demo_layer_features = afterMap.queryRenderedFeatures({ layers: ['c7_dates-ajsksu-right'] });
	
	if(demo_layer_view_flag) {
		buildPopUpInfo(demo_layer_features[0].properties);
	}
	
	
}//end function changeDate



/////////////////////////////
//LAYER CHANGING
/////////////////////////////

//BASEMAP SWITCHING
beforeMap.on('style.load', function () {
	//on the 'style.load' event, switch "basemaps" and then re-add layers
	//this is necessary because basemaps aren't a concept in Mapbox, all layers are added via the same primitives
	console.log("style change")
	//switchBeforeStyle();
	//*A var sliderVal = $("#date").val();
	//*A var sliderVal = moment($("#date").val()).unix();
	var sliderVal = moment($("#date").text()).unix();
	var yr = parseInt(moment.unix(sliderVal).format("YYYY"));
	var date = parseInt(moment.unix(sliderVal).format("YYYYMMDD"));
	console.log(sliderVal)
	console.log(yr)
	console.log(date)

	addBeforeLayers(yr, date);
	addBeforeFarmsLayer(date);
	addCastelloBeforeLayers();
	addSettlementsBeforeLayers(date);
	addSettlementsLabelsBeforeLayers(date);
	addGrantLotsBeforeLayers(date);
	addGrantLotsLinesBeforeLayers(date);
	addCurrentLotsBeforeLayers();
	addCurrentLotsLinesBeforeLayers();
	addCurrentBuildingsBeforeLayers();
	addCurrentBuildingsLinesBeforeLayers();
	addManahattaBeforeLayers();
	addLongIslandCoastlineBeforeLayers();
});

//BASEMAP SWITCHING
afterMap.on('style.load', function () {
	//on the 'style.load' event, switch "basemaps" and then re-add layers
	//this is necessary because basemaps aren't a concept in Mapbox, all layers are added via the same primitives
	console.log("style change after")
	//switchStyle();
	//*A var sliderVal = $("#date").val();
	//*A var sliderVal = moment($("#date").val()).unix();
	var sliderVal = moment($("#date").text()).unix();
	var yr = parseInt(moment.unix(sliderVal).format("YYYY"));
	var date = parseInt(moment.unix(sliderVal).format("YYYYMMDD"));
	console.log(sliderVal)
	console.log(yr)
	console.log(date)

	addAfterLayers(yr, date);
	addAfterFarmsLayer(date);
	addCastelloAfterLayers();
	addSettlementsAfterLayers(date);
	addSettlementsLabelsAfterLayers(date);
	addGrantLotsAfterLayers(date);
	addGrantLotsLinesAfterLayers(date);
	addCurrentLotsAfterLayers();
	addCurrentLotsLinesAfterLayers();
	addCurrentBuildingsAfterLayers();
	addCurrentBuildingsLinesAfterLayers();
	addManahattaAfterLayers();
	addLongIslandCoastlineAfterLayers();
});




