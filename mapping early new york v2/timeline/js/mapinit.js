var grant_lots_view_id = null,
    dgrants_layer_view_id = null,
	curr_layer_view_id = null,
    grant_lots_view_flag = false,
    demo_layer_view_flag = false,
    castello_layer_view_flag = false,
	dgrants_layer_view_flag = false,
	curr_layer_view_flag = false;
	
$("#infoLayerGrantLots").slideUp();
$("#infoLayerDutchGrants").slideUp();
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
	curr_layer_click_ev = false;
    

var afterMapPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false }),
    beforeMapPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false });

var coordinates = [];
var places_popup_html = "";

var afterMapPlacesPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false }),
    beforeMapPlacesPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false });

var afterMapGrantLotPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 }),
    beforeMapGrantLotPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 });

var afterMapDutchGrantPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 }),
    beforeMapDutchGrantPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 });

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
		            if(demo_layer_view_flag) {
				        $("#demoLayerInfo").slideUp();
						demo_layer_view_flag = false;
					} else {
						
						
						buildPopUpInfo(e.features[0].properties);
					    $("#demoLayerInfo").slideDown();
						demo_layer_view_flag = true;
						if(!layer_view_flag) $('#view-hide-layer-panel').trigger('click');
					}
					
	                demo_taxlot_click_ev = true;
		}).on('click', 'places-left', function (e) {
			if(castello_layer_view_flag && (clickedStateId == e.features[0].id) ) {
				        $("#infoLayerCastello").slideUp();
						castello_layer_view_flag = false;
		    } else {
				   clickedStateId = e.features[0].id;
				
				
					places_popup_html = "<h3>Castello Taxlot (1660)</h3><hr>" +
						"<br>" +
						"<b>" + "Taxlot: " + "</b>" + 
						e.features[0].properties.LOT2 +
						"<br>" +
						"<b>" + "Property Type: " + "</b>" + 
						e.features[0].properties.tax_lots_1 +
						"<br>" +
						"<br>" +
						"<b>" + "Encyclopedia Page: " + "</b>" + 
						"<br>" +
						'<a href="' + e.features[0].properties.new_link + '" target="_blank">' + e.features[0].properties.new_link + '</a>';
					
					$("#infoLayerCastello").html(places_popup_html).slideDown();
				    castello_layer_view_flag = true;
					if(!layer_view_flag) $('#view-hide-layer-panel').trigger('click');
			}
			
			castello_click_ev = true;
        }).on('click', 'grant-lots-left' , function (e) {
				        
						if(layer_view_flag) {
							if(grant_lots_view_id == e.features[0].id) {
								if(grant_lots_view_flag) {
							        $("#infoLayerGrantLots").slideUp(); 
									grant_lots_view_flag = false;
								} else {
									//$("#infoLayerGrantLots").html(e.features[0].properties.name).slideDown();
									buildGrantLotsPopUpInfo(e.features[0].properties);
							        $("#infoLayerGrantLots").slideDown();
								    grant_lots_view_flag = true;
								}
							} else {
			                    //$("#infoLayerGrantLots").html(e.features[0].properties.name).slideDown();
								buildGrantLotsPopUpInfo(e.features[0].properties);
							    $("#infoLayerGrantLots").slideDown();
								grant_lots_view_flag = true;
							}
							grant_lots_view_id = e.features[0].id;
						} else {
							//$("#infoLayerGrantLots").html(e.features[0].properties.name).slideDown();
							buildGrantLotsPopUpInfo(e.features[0].properties);
							$("#infoLayerGrantLots").slideDown();
							$('#view-hide-layer-panel').trigger('click');
							grant_lots_view_id = null;
					    } 
						
						grant_lots_click_ev = true;
						
		}).on('click', 'grants1-5sp9tb-left' , function (e) {
				        
						if(layer_view_flag) {
							if(dgrants_layer_view_id == e.features[0].id) {
								if(dgrants_layer_view_flag) {
							        $("#infoLayerDutchGrants").slideUp(); 
									dgrants_layer_view_flag = false;
								} else {
									buildDutchGrantPopUpInfo(e.features[0].properties);
							        $("#infoLayerDutchGrants").slideDown();
								    dgrants_layer_view_flag = true;
								}
							} else {
								buildDutchGrantPopUpInfo(e.features[0].properties);
							    $("#infoLayerDutchGrants").slideDown();
								dgrants_layer_view_flag = true;
							}
							dgrants_layer_view_id = e.features[0].id;
						} else {
							buildDutchGrantPopUpInfo(e.features[0].properties);
							$("#infoLayerDutchGrants").slideDown();
							$('#view-hide-layer-panel').trigger('click');
							dgrants_layer_view_id = null;
					    } 
						
						dutch_grant_click_ev = true;
						
		}).on('click', 'curr-lots-left' , function (e) {
				        
						if(layer_view_flag) {
							if(curr_layer_view_id == e.features[0].id) {
								if(curr_layer_view_flag) {
							        $("#infoLayerCurrLots").slideUp(); 
									curr_layer_view_flag = false;
								} else {
									buildCurrLotsPopUpInfo(e.features[0].properties);
							        $("#infoLayerCurrLots").slideDown();
								    curr_layer_view_flag = true;
								}
							} else {
								buildCurrLotsPopUpInfo(e.features[0].properties);
							    $("#infoLayerCurrLots").slideDown();
								curr_layer_view_flag = true;
							}
							curr_layer_view_id = e.features[0].id;
						} else {
							buildCurrLotsPopUpInfo(e.features[0].properties);
							$("#infoLayerCurrLots").slideDown();
							$('#view-hide-layer-panel').trigger('click');
							curr_layer_view_id = null;
					    } 
						
						curr_layer_click_ev = true;
						
		}).on('click', function () {
					
					if(!demo_taxlot_click_ev && !castello_click_ev && !grant_lots_click_ev && !dutch_grant_click_ev && !curr_layer_click_ev) {
						/*
						$("#infoLayerGrantLots").slideUp(); 
						grant_lots_view_flag = false;
                        $("#demoLayerInfo").slideUp();
			            demo_layer_view_flag = false;
                        $("#infoLayerCastello").slideUp();
			            castello_layer_view_flag = false;
						*/
						
						//*A
                        if(windoWidth > 555)
			                $('#view-hide-layer-panel').trigger('click');
					}
					
					demo_taxlot_click_ev = false;
					castello_click_ev = false;
					grant_lots_click_ev = false;
					dutch_grant_click_ev = false;
					curr_layer_click_ev = false;
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
			        if(demo_layer_view_flag) {
				        $("#demoLayerInfo").slideUp();
						demo_layer_view_flag = false;
						//if(afterMapPopUp.isOpen()) afterMapPopUp.remove();
					} else {
						
						buildPopUpInfo(e.features[0].properties);
					    $("#demoLayerInfo").slideDown();
						demo_layer_view_flag = true;
						if(!layer_view_flag) $('#view-hide-layer-panel').trigger('click');
					}
					demo_taxlot_click_ev = true;
		}).on('click', 'places-right', function (e) {
			if(castello_layer_view_flag && (clickedStateId == e.features[0].id) ) {
				        $("#infoLayerCastello").slideUp();
						castello_layer_view_flag = false;
						//if(afterMapPlacesPopUp.isOpen()) afterMapPlacesPopUp.remove();
		    } else {
				    clickedStateId = e.features[0].id;
				
					places_popup_html = "<h3>Castello Taxlot (1660)</h3><hr>" +
						"<br>" +
						"<b>" + "Taxlot: " + "</b>" + 
						e.features[0].properties.LOT2 +
						"<br>" +
						"<b>" + "Property Type: " + "</b>" + 
						e.features[0].properties.tax_lots_1 +
						"<br>" +
						"<br>" +
						"<b>" + "Encyclopedia Page: " + "</b>" + 
						"<br>" +
						'<a href="' + e.features[0].properties.new_link + '" target="_blank">' + e.features[0].properties.new_link + '</a>';
					
					$("#infoLayerCastello").html(places_popup_html).slideDown();
				    castello_layer_view_flag = true;
					if(!layer_view_flag) $('#view-hide-layer-panel').trigger('click');
			}
		    castello_click_ev = true;
        }).on('click', 'grant-lots-right' , function (e) {
				        
						if(layer_view_flag) {
							if(grant_lots_view_id == e.features[0].id) {
								if(grant_lots_view_flag) {
							        $("#infoLayerGrantLots").slideUp();						
									grant_lots_view_flag = false;
								} else {
									buildGrantLotsPopUpInfo(e.features[0].properties);
							        $("#infoLayerGrantLots").slideDown();
								    grant_lots_view_flag = true;
								}
							} else {
								buildGrantLotsPopUpInfo(e.features[0].properties);
							    $("#infoLayerGrantLots").slideDown();
								grant_lots_view_flag = true;
							}
							grant_lots_view_id = e.features[0].id;
						} else {
							//$("#infoLayerGrantLots").html(e.features[0].properties.name).slideDown();
							buildGrantLotsPopUpInfo(e.features[0].properties);
							$("#infoLayerGrantLots").slideDown();
							$('#view-hide-layer-panel').trigger('click');
							grant_lots_view_id = null;
					    } 
						
						grant_lots_click_ev = true;
						
		}).on('click', 'grants1-5sp9tb-right' , function (e) {
				        
						if(layer_view_flag) {
							if(dgrants_layer_view_id == e.features[0].id) {
								if(dgrants_layer_view_flag) {
							        $("#infoLayerDutchGrants").slideUp(); 
									dgrants_layer_view_flag = false;
								} else {
									buildDutchGrantPopUpInfo(e.features[0].properties);
							        $("#infoLayerDutchGrants").slideDown();
								    dgrants_layer_view_flag = true;
								}
							} else {
								buildDutchGrantPopUpInfo(e.features[0].properties);
							    $("#infoLayerDutchGrants").slideDown();
								dgrants_layer_view_flag = true;
							}
							dgrants_layer_view_id = e.features[0].id;
						} else {
							buildDutchGrantPopUpInfo(e.features[0].properties);
							$("#infoLayerDutchGrants").slideDown();
							$('#view-hide-layer-panel').trigger('click');
							dgrants_layer_view_id = null;
					    } 
						
						dutch_grant_click_ev = true;
						
		}).on('click', 'curr-lots-right' , function (e) {
				        
						if(layer_view_flag) {
							if(curr_layer_view_id == e.features[0].id) {
								if(curr_layer_view_flag) {
							        $("#infoLayerCurrLots").slideUp(); 
									curr_layer_view_flag = false;
								} else {
									buildCurrLotsPopUpInfo(e.features[0].properties);
							        $("#infoLayerCurrLots").slideDown();
								    curr_layer_view_flag = true;
								}
							} else {
								buildCurrLotsPopUpInfo(e.features[0].properties);
							    $("#infoLayerCurrLots").slideDown();
								curr_layer_view_flag = true;
							}
							curr_layer_view_id = e.features[0].id;
						} else {
							buildCurrLotsPopUpInfo(e.features[0].properties);
							$("#infoLayerCurrLots").slideDown();
							$('#view-hide-layer-panel').trigger('click');
							curr_layer_view_id = null;
					    } 
						
						curr_layer_click_ev = true;
						
		}).on('click', function () {
			        if(!demo_taxlot_click_ev && !castello_click_ev && !grant_lots_click_ev && !dutch_grant_click_ev && !curr_layer_click_ev) {
						if(windoWidth > 555)
						    $('#view-hide-layer-panel').trigger('click');
					}
					
					demo_taxlot_click_ev = false;
					castello_click_ev = false;
					grant_lots_click_ev = false;	
					dutch_grant_click_ev = false;
					curr_layer_click_ev = false;
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
	
	beforeMap.setFilter("c7_dates-ajsksu-left", dateFilter);
	afterMap.setFilter("c7_dates-ajsksu-right", dateFilter);
	
	beforeMap.setFilter("grant-lots-left", dateFilter);
	afterMap.setFilter("grant-lots-right", dateFilter);

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
	addCastelloBeforeLayers();
	addGrantLotsBeforeLayers(date);
	addCurrentLotsBeforeLayers();
	addCurrentBuildingsBeforeLayers();
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
	addCastelloAfterLayers();
	addGrantLotsAfterLayers(date);
	addCurrentLotsAfterLayers();
	addCurrentBuildingsAfterLayers();
});












