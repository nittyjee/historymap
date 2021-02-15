var layer_view_flag2 = false,
    layer_view_flag3 = false;
$("#studioMenu2").slideUp();
$("#studioMenu3").slideUp();

/////////////////////////////
//ACCESS TOKEN
/////////////////////////////

mapboxgl.accessToken =
	"pk.eyJ1Ijoibml0dHlqZWUiLCJhIjoid1RmLXpycyJ9.NFk875-Fe6hoRCkGciG8yQ";




/////////////////////////////
//ADD MAP CONTAINER
/////////////////////////////
/*
var map = new mapboxgl.Map({
	container: "map",
	style: "mapbox://styles/nittyjee/ck2f3s0ks0u8o1cpfruf0qne6",
	hash: true,
	center: [-74.01229, 40.70545],
	zoom: 16.7,
	pitchWithRotate: false,
	attributionControl: false
});
*/

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
		
        var rightLayerList = document.getElementById('basemapmenuRight');
        var rightInputs = rightLayerList.getElementsByTagName('input');

        function switchRightLayer(layer) {
            //afterMap.removeLayer('c7_dates-ajsksu');
			//console.warn(afterMap.getStyle().layers);
			//afterMap.remove();
			
            var rightLayerClass = layer.target.className; //*A layer.target.id;
            afterMap.setStyle('mapbox://styles/nittyjee/' + rightLayerClass);
        }

        for (var i = 0; i < rightInputs.length; i++) {
            rightInputs[i].onclick = switchRightLayer;
		}


		//LEFT MENU
		
        var leftLayerList = document.getElementById('basemapmenuLeft');
        var leftInputs = leftLayerList.getElementsByTagName('input');

        function switchLeftLayer(layer) {
            //afterMap.removeLayer('c7_dates-ajsksu');
			//console.warn(afterMap.getStyle().layers);
			//afterMap.remove();
			
            var leftLayerClass = layer.target.className; //*A layer.target.id;
            beforeMap.setStyle('mapbox://styles/nittyjee/' + leftLayerClass);
        }

        for (var i = 0; i < leftInputs.length; i++) {
            leftInputs[i].onclick = switchLeftLayer;
		}


/////////////////////////////
//ADD NAVIGATION CONTROL (ZOOM IN AND OUT)
/////////////////////////////
/*
var nav = new mapboxgl.NavigationControl();
map.addControl(nav, "top-left");
*/




/////////////////////////////
//NOT SURE WHAT THIS IS
/////////////////////////////

urlHash = window.location.hash;
var map_click_ev = false;

var afterMapPopUp = new mapboxgl.Popup(),
    beforeMapPopUp = new mapboxgl.Popup();

var coordinates = [];
var places_popup_html = "";

var afterMapPlacesPopUp = new mapboxgl.Popup(),
    beforeMapPlacesPopUp = new mapboxgl.Popup();



afterMapPopUp.on('close', function(e) {
    if(beforeMapPopUp.isOpen()) {
		beforeMapPopUp.remove();
		if(layer_view_flag2) {
		    $("#studioMenu2").slideUp();
		    layer_view_flag2 = false;
		}
	}
});

beforeMapPopUp.on('close', function(e) {
    if(afterMapPopUp.isOpen()) {
		afterMapPopUp.remove();
		if(layer_view_flag2) {
		    $("#studioMenu2").slideUp();
		    layer_view_flag2 = false;
		}
    }
});


afterMapPlacesPopUp.on('close', function(e) {
    if(beforeMapPlacesPopUp.isOpen()) {
		beforeMapPlacesPopUp.remove();
		if(layer_view_flag3) {
		    $("#studioMenu3").slideUp();
		    layer_view_flag3 = false;
		}
	}
});

beforeMapPlacesPopUp.on('close', function(e) {
    if(afterMapPlacesPopUp.isOpen()) {
		afterMapPlacesPopUp.remove();
		if(layer_view_flag3) {
		    $("#studioMenu3").slideUp();
		    layer_view_flag3 = false;
		}
    }
});

beforeMap.on("load", function () {
	console.log("load");
	//*A var sliderVal = $("#date").val();
	var sliderVal = moment($("#date").val()).unix();
	var yr = parseInt(moment.unix(sliderVal).format("YYYY"));
	var date = parseInt(moment.unix(sliderVal).format("YYYYMMDD"));
    /*
	$("#linkButton").on("click", function () {
		document.location.href = "raster-version.html" + urlHash;
	});
	*/
	
	if (beforeMap.getLayer("c7_dates-ajsksu-left")) {
		// CLICK AND OPEN POPUP
		beforeMap.on('click', 'c7_dates-ajsksu-left', function (e) {
		            if(layer_view_flag2) {
				        $("#studioMenu2").slideUp();
						layer_view_flag2 = false;
					} else {
						
						coordinates = e.features[0].geometry.coordinates.slice();
			            //var description = e.features[0].properties.description;

			            // Ensure that if the map is zoomed out such that multiple
			            // copies of the feature are visible, the popup appears
			            // over the copy being pointed to.
			            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
				            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
			            }

	              		//POPUP CONTENTS
			            beforeMapPopUp
				            .setLngLat(coordinates)
							.setHTML("<b><h2>Taxlot: <a href='https://nahc-mapping.org/mappingNY/encyclopedia/taxlot/c7' target='_blank'>C7</a></h2></b><br>")
                            .addTo(beforeMap);
						
						afterMapPopUp
				            .setLngLat(coordinates)
							.setHTML("<b><h2>Taxlot: <a href='https://nahc-mapping.org/mappingNY/encyclopedia/taxlot/c7' target='_blank'>C7</a></h2></b><br>")
                            .addTo(afterMap);
				
						buildPopUpInfo(e.features[0].properties);
					    $("#studioMenu2").slideDown();
						layer_view_flag2 = true;
					}
					map_click_ev = true;
		}).on('click', function () {
			        if(layer_view_flag2 && !map_click_ev) {
				        $("#studioMenu2").slideUp();
						layer_view_flag2 = false;
					}	
					map_click_ev = false;
		});
	}
	
	
	if (beforeMap.getLayer("places-left")) {
		beforeMap.on('click', 'places-left', function (e) {
			if(layer_view_flag3) {
				        $("#studioMenu3").slideUp();
						layer_view_flag3 = false;
		    } else {
                coordinates = e.features[0].geometry.coordinates.slice();
                //var description = e.features[0].properties.description;

                // Ensure that if the map is zoomed out such that multiple
                // copies of the feature are visible, the popup appears
                // over the copy being pointed to.
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }


                //BEFORE MAP POP UP CONTENTS
                beforeMapPlacesPopUp
                    .setLngLat(coordinates)
                    .setHTML(
                        e.features[0].properties.LOT2
                    )
                    .addTo(beforeMap);
					
			//AFTER MAP POP UP CONTENTS
                afterMapPlacesPopUp
                    .setLngLat(coordinates)
                    .setHTML(
                        e.features[0].properties.LOT2 
                    )
                    .addTo(afterMap);
					
					places_popup_html = e.features[0].properties.LOT2 +
                        ": " +
                        e.features[0].properties.tax_lots_1 +
                        "<br>" +
                        e.features[0].properties.tax_lots_2 +
                        "<br>" +
                        '<a href="' + e.features[0].properties.new_link + '" target="_blank">' + e.features[0].properties.new_link + '</a>';
					
					$("#studioMenu3").html(places_popup_html).slideDown();
				    layer_view_flag3 = true;
			}
		    map_click_ev = true;
        }).on('click', function () {
			        if(layer_view_flag3 && !map_click_ev) {
				        $("#studioMenu3").slideUp();
						layer_view_flag3 = false;
					}	
					map_click_ev = false;
		});
	}
	
});

afterMap.on("load", function () {
	console.log("load");
	//*A var sliderVal = $("#date").val();
	var sliderVal = moment($("#date").val()).unix();
	var yr = parseInt(moment.unix(sliderVal).format("YYYY"));
	var date = parseInt(moment.unix(sliderVal).format("YYYYMMDD"));
    /*
	$("#linkButton").on("click", function () {
		document.location.href = "raster-version.html" + urlHash;
	});
	*/
	
	if (afterMap.getLayer("c7_dates-ajsksu-right")) {
		// CLICK AND OPEN POPUP
		afterMap.on('click', 'c7_dates-ajsksu-right', function (e) {
			        if(layer_view_flag2) {
				        $("#studioMenu2").slideUp();
						layer_view_flag2 = false;
					} else {
						
						coordinates = e.features[0].geometry.coordinates.slice();
			            //var description = e.features[0].properties.description;

			            // Ensure that if the map is zoomed out such that multiple
			            // copies of the feature are visible, the popup appears
			            // over the copy being pointed to.
			            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
				            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
			            }
						
						//POPUP CONTENTS
			            beforeMapPopUp
				            .setLngLat(coordinates)
							.setHTML("<b><h2>Taxlot: <a href='https://nahc-mapping.org/mappingNY/encyclopedia/taxlot/c7' target='_blank'>C7</a></h2></b><br>")
                            .addTo(beforeMap);
						
						afterMapPopUp
				            .setLngLat(coordinates)
							.setHTML("<b><h2>Taxlot: <a href='https://nahc-mapping.org/mappingNY/encyclopedia/taxlot/c7' target='_blank'>C7</a></h2></b><br>")
                            .addTo(afterMap);
						
						buildPopUpInfo(e.features[0].properties);
					    $("#studioMenu2").slideDown();
						layer_view_flag2 = true;
					}
					map_click_ev = true;
		}).on('click', function () {
			        if(layer_view_flag2 && !map_click_ev) {
				        $("#studioMenu2").slideUp();
						layer_view_flag2 = false;
					}	
					map_click_ev = false;
		});
	}
	
	
	if (afterMap.getLayer("places-right")) {
		afterMap.on('click', 'places-right', function (e) {
			if(layer_view_flag3) {
				        $("#studioMenu3").slideUp();
						layer_view_flag3 = false;
		    } else {
                coordinates = e.features[0].geometry.coordinates.slice();
                //var description = e.features[0].properties.description;

                // Ensure that if the map is zoomed out such that multiple
                // copies of the feature are visible, the popup appears
                // over the copy being pointed to.
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }


                //AFTER MAP POP UP CONTENTS
                afterMapPlacesPopUp
                    .setLngLat(coordinates)
                    .setHTML(
                        e.features[0].properties.LOT2
                    )
                    .addTo(afterMap);
				
				//BEFORE MAP POP UP CONTENTS
                beforeMapPlacesPopUp
                    .setLngLat(coordinates)
                    .setHTML(
                        e.features[0].properties.LOT2
                    )
                    .addTo(beforeMap);
				
					places_popup_html = e.features[0].properties.LOT2 +
                        ": " +
                        e.features[0].properties.tax_lots_1 +
                        "<br>" +
                        e.features[0].properties.tax_lots_2 +
                        "<br>" +
                        '<a href="' + e.features[0].properties.new_link + '" target="_blank">' + e.features[0].properties.new_link + '</a>';
					
					$("#studioMenu3").html(places_popup_html).slideDown();
				    layer_view_flag3 = true;
			}
		    map_click_ev = true;
        }).on('click', function () {
			        if(layer_view_flag3 && !map_click_ev) {
				        $("#studioMenu3").slideUp();
						layer_view_flag3 = false;
					}	
					map_click_ev = false;
		});
	}
	
});

beforeMap.on("error", function (e) {
	// Hide those annoying non-error errors
	if (e && e.error !== "Error") console.log(e);
});

afterMap.on("error", function (e) {
	// Hide those annoying non-error errors
	if (e && e.error !== "Error") console.log(e);
});

        /*
        beforeMap.on('click', function () {
			        if(layer_view_flag2) {
				        $("#studioMenu2").slideUp();
						layer_view_flag2 = false;
					}
		});
		
		afterMap.on('click', function () {
			        if(layer_view_flag2) {
				        $("#studioMenu2").slideUp();
						layer_view_flag2 = false;
					}
		});
		*/

//////////////////////////////////////////////
//TIME LAYER FILTERING. NOT SURE HOW WORKS.
//////////////////////////////////////////////


function changeDate(unixDate) {
	var year = parseInt(moment.unix(unixDate).format("YYYY"));
	var date = parseInt(moment.unix(unixDate).format("YYYYMMDD"));

	var sv = $("#year");
	if (year < 1700) {
		sv
			.removeClass("y1700")
			.removeClass("y1800")
			.removeClass("y1850")
			.removeClass("y1900")
			.removeClass("y1950")
			.removeClass("y2000")
			.addClass("y1600");
	}
	if (year >= 1700 && year < 1800) {
		sv
			.removeClass("y1600")
			.removeClass("y1800")
			.removeClass("y1850")
			.removeClass("y1900")
			.removeClass("y1950")
			.removeClass("y2000")
			.addClass("y1700");
	}
	if (year >= 1800 && year < 1850) {
		sv
			.removeClass("y1700")
			.removeClass("y1600")
			.removeClass("y1850")
			.removeClass("y1900")
			.removeClass("y1950")
			.removeClass("y2000")
			.addClass("y1800");
	}
	if (year >= 1850 && year < 1900) {
		sv
			.removeClass("y1700")
			.removeClass("y1800")
			.removeClass("y1600")
			.removeClass("y1900")
			.removeClass("y1950")
			.removeClass("y2000")
			.addClass("y1850");
	}
	if (year >= 1900 && year < 1950) {
		sv
			.removeClass("y1700")
			.removeClass("y1800")
			.removeClass("y1850")
			.removeClass("y1600")
			.removeClass("y1950")
			.removeClass("y2000")
			.addClass("y1900");
	}
	if (year >= 1950 && year < 2000) {
		sv
			.removeClass("y1700")
			.removeClass("y1800")
			.removeClass("y1850")
			.removeClass("y1900")
			.removeClass("y1600")
			.removeClass("y2000")
			.addClass("y1950");
	}
	if (year >= 2000) {
		sv
			.removeClass("y1700")
			.removeClass("y1800")
			.removeClass("y1850")
			.removeClass("y1900")
			.removeClass("y1950")
			.removeClass("y1600")
			.addClass("y2000");
	}


	var yrFilter = ["all", ["<=", "YearStart", year], [">=", "YearEnd", year]];

	var dateFilter = ["all", ["<=", "DayStart", date], [">=", "DayEnd", date]];


	///////////////////////////////
	//LAYERS FOR FILTERING
	///////////////////////////////


	//NAHC
	beforeMap.setFilter("c7_dates-ajsksu-left", dateFilter);
	afterMap.setFilter("c7_dates-ajsksu-right", dateFilter);

	var layer_features = afterMap.queryRenderedFeatures({ layers: ['c7_dates-ajsksu-right'] });
	//console.log(layer_features[0].properties.DATE2);
	//console.log(layer_features[0].properties);
	//buildPopUpInfo(layer_features[0].properties);
	                if(layer_view_flag2) {
						buildPopUpInfo(layer_features[0].properties);
					}
	
}//end function changeDate









/////////////////////////////
//LAYERS AND LEGEND
/////////////////////////////
function setBeforeLayers() {

	//TOGGLE LAYERS
	var toggleableLayerIds = [

	];

	//LEGEND?
	/*
	var legend = document.getElementById("legend");
	while (legend.hasChildNodes()) {
		legend.removeChild(legend.lastChild);
	}
	*/

	//TOGGLING
	for (var i = 0; i < toggleableLayerIds.length; i++) {
		//use closure to deal with scoping
		(function () {
			var id = toggleableLayerIds[i];

			//ADD CHECKBOX
			var input = document.createElement("input");
			input.type = "checkbox";
			input.id = id;
			input.checked = true;

			//ADD LABEL
			var label = document.createElement("label");
			label.setAttribute("for", id);
			label.textContent = id;

			//CHECKBOX CHANGING (CHECKED VS. UNCHECKED)
			input.addEventListener("change", function (e) {
				beforeMap.setLayoutProperty(
					id,
					"visibility",
					e.target.checked ? "visible" : "none"
				);
			});

			//NOTE?
			/*
			var layers = document.getElementById("legend");
			layers.appendChild(input);
			layers.appendChild(label);
			layers.appendChild(document.createElement("br"));
			*/
		})();
	}

}


function setAfterLayers() {

	//TOGGLE LAYERS
	var toggleableLayerIds = [

	];

	//LEGEND?
	/*
	var legend = document.getElementById("legend");
	while (legend.hasChildNodes()) {
		legend.removeChild(legend.lastChild);
	}
	*/

	//TOGGLING
	for (var i = 0; i < toggleableLayerIds.length; i++) {
		//use closure to deal with scoping
		(function () {
			var id = toggleableLayerIds[i];

			//ADD CHECKBOX
			var input = document.createElement("input");
			input.type = "checkbox";
			input.id = id;
			input.checked = true;

			//ADD LABEL
			var label = document.createElement("label");
			label.setAttribute("for", id);
			label.textContent = id;

			//CHECKBOX CHANGING (CHECKED VS. UNCHECKED)
			input.addEventListener("change", function (e) {
				afterMap.setLayoutProperty(
					id,
					"visibility",
					e.target.checked ? "visible" : "none"
				);
			});

			//NOTE?
			/*
			var layers = document.getElementById("legend");
			layers.appendChild(input);
			layers.appendChild(label);
			layers.appendChild(document.createElement("br"));
			*/
		})();
	}

}



function addCastelloBeforeLayers() {
	
	// Add a layer showing the places.
	        beforeMap.addLayer({
                id: "places-left",
                type: "circle",
                source: {
                    type: "vector",
                    url: "mapbox://nittyjee.ap08s4n9"
                },
				layout: {
                    visibility: document.getElementById('castello_points').checked ? "visible" : "none",
                },
                "source-layer": "castello_points_new-3qkr6t",
                paint: {
                    'circle-color': '#FF0000'
                }
            });


            //POP UP
			/*
            beforeMap.on('click', 'places-left', function (e) {
                var coordinates = e.features[0].geometry.coordinates.slice();
                var description = e.features[0].properties.description;

                // Ensure that if the map is zoomed out such that multiple
                // copies of the feature are visible, the popup appears
                // over the copy being pointed to.
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }

                new mapboxgl.Popup()
                    .setLngLat(coordinates)

                    //BEFORE MAP POP UP CONTENTS
                    .setHTML(
                        e.features[0].properties.LOT2 +
                        "<br>" +
                        e.features[0].properties.tax_lots_1 +
                        "<br>" +
                        e.features[0].properties.tax_lots_2 +
                        "<br>" +
                        '<a href="' + e.features[0].properties.new_link + '" target="_blank">' + e.features[0].properties.new_link + '</a>'
                    )

                    .addTo(beforeMap);
            });
            */
			
            //CURSOR ON HOVER

            //ON HOVER
            beforeMap.on('mouseenter', 'places-left', function () {
                beforeMap.getCanvas().style.cursor = 'pointer';
            });

            //OFF HOVER
            beforeMap.on('mouseleave', 'places-left', function () {
                beforeMap.getCanvas().style.cursor = '';
            });
	
}

function addCastelloAfterLayers() {
	
	// Add a layer showing the places.
            afterMap.addLayer({
                id: "places-right",
                type: "circle",
                source: {
                    type: "vector",
                    url: "mapbox://nittyjee.ap08s4n9"
                },
				layout: {
                    visibility:  document.getElementById('castello_points').checked ? "visible" : "none",
                },
                "source-layer": "castello_points_new-3qkr6t",
                paint: {
                    'circle-color': '#FF0000'
                }
            });


            // When a click event occurs on a feature in the places layer, open a popup at the
            // location of the feature, with description HTML from its properties.
			/*
            afterMap.on('click', 'places-right', function (e) {
                var coordinates = e.features[0].geometry.coordinates.slice();
                var description = e.features[0].properties.description;

                // Ensure that if the map is zoomed out such that multiple
                // copies of the feature are visible, the popup appears
                // over the copy being pointed to.
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }


                //AFTER MAP POP UP CONTENTS
                new mapboxgl.Popup()
                    .setLngLat(coordinates)

                    .setHTML(
                        e.features[0].properties.LOT2 +
                        "<br>" +
                        e.features[0].properties.tax_lots_1 +
                        "<br>" +
                        e.features[0].properties.tax_lots_2 +
                        "<br>" +
                        '<a href="' + e.features[0].properties.new_link + '" target="_blank">' + e.features[0].properties.new_link + '</a>'
                    )

                    .addTo(afterMap);
					
            });
			*/

            //CURSOR ON HOVER

            //ON HOVER
            afterMap.on('mouseenter', 'places-right', function () {
                afterMap.getCanvas().style.cursor = 'pointer';
            });

            //OFF HOVER
            afterMap.on('mouseleave', 'places-right', function () {
                afterMap.getCanvas().style.cursor = '';
            });
	
}


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
	//setBeforeLayers();
	addBeforeLayers(yr, date);
	addCastelloBeforeLayers();
});
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
	//setAfterLayers();
	addAfterLayers(yr, date);
	addCastelloAfterLayers();
});







/////////////////////////////
//MAP LAYERS
/////////////////////////////

function addBeforeLayers(yr, date) {



	/////////////////
	//NAHC POINTS MAP
	/////////////////

	//beforeMap.on('load', function () {
		
		//REMOVING TAX LOT POINTS IF EXIST
		if (beforeMap.getLayer("c7_shape-47qiak-left")) beforeMap.removeLayer("c7_shape-47qiak-left");
        if (beforeMap.getSource("c7_shape-47qiak")) beforeMap.removeSource("c7_shape-47qiak");
		if (beforeMap.getLayer("c7_dates-ajsksu-left")) beforeMap.removeLayer("c7_dates-ajsksu-left");
        if (beforeMap.getSource("c7_dates-ajsksu")) beforeMap.removeSource("c7_dates-ajsksu");
		

		//ADD TAX LOT POINTS

		beforeMap.addLayer({
			//ID: CHANGE THIS, 1 OF 3
			id: "c7_shape-47qiak-left",
			type: "fill",
			source: {
				type: "vector",
				//URL: CHANGE THIS, 2 OF 3
				url: "mapbox://nittyjee.8wpxjzzv"
			},
			layout: {
                visibility: document.getElementById('rect_point').checked ? "visible" : "none",
            },
			"source-layer": "c7_shape-47qiak",
			paint: {
				//FILL COLOR
				'fill-color': "#ffffff",
				//FILL COLOR OUTLINE
				'fill-outline-color': "#ffffff"
			}
		});

		beforeMap.addLayer({
			//ID: CHANGE THIS, 1 OF 3
			id: "c7_dates-ajsksu-left",
			type: "circle",
			source: {
				type: "vector",
				//URL: CHANGE THIS, 2 OF 3
				url: "mapbox://nittyjee.8krf945a"
			},
			layout: {
                visibility: document.getElementById('circle_point').checked ? "visible" : "none",
            },
			"source-layer": "c7_dates-ajsksu",
			paint: {

				//CIRCLE COLOR
				'circle-color': {
					type: "categorical",
					property: "color",
					stops: [
						["6", "#0000ee"],
						["5", "#097911"],
						["4", "#0000ee"],
						["3", "#097911"],
						["2", "#0000ee"],
						["1", "#097911"]
					],
					default: "#FF0000"
				},

				//CIRCLE RADIUS
				"circle-radius": {
					type: "categorical",
					property: "TAXLOT",
					stops: [
						["C7", 9]
					]
				}

			},
			filter: ["all", ["<=", "DayStart", date], [">=", "DayEnd", date]]
		});



		//TAX LOT POPUP

		// CLICK AND OPEN POPUP
		/*
		beforeMap.on('click', 'c7_dates-ajsksu-left', function (e) {
			var coordinates = e.features[0].geometry.coordinates.slice();
			var description = e.features[0].properties.description;

			// Ensure that if the map is zoomed out such that multiple
			// copies of the feature are visible, the popup appears
			// over the copy being pointed to.
			while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
				coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
			}


			//POPUP CONTENTS
			new mapboxgl.Popup()
				.setLngLat(coordinates)

				.setHTML(

					///////
					//TITLE
					///////
					"<b><h2>Taxlot: <a href='https://nahc-mapping.org/mappingNY/encyclopedia/taxlot/c7' target='_blank'>C7</a></h2></b>" +
// CAN'T GET THE TAXLOT LINK TO WORK: <a href='https://nahc-mapping.org/mappingNY/encyclopedia/taxlot/c7'>
					////////////////
					//PROPERTY TYPE
					////////////////
					"<b>House</b>" +


					//LINE
					"<hr>" +


					/////////////
					//DATE RANGE
					////////////

					//FROM
					//example: June 3, 1643
					"<b> FROM: </b>" +
					e.features[0].properties.DATE1 +

					//TO
					//example: January 19, 1659
					"<br>" +
					"<b> TO: </b>" +
					e.features[0].properties.DATE2 +



					/////////////////////////////////////////////////////////////////////////////////////////////
					//UNKNOWN (DISPLAY TITLE AND EXPLANATION WHERE UNKNOWN OR NOTHING, %nbsp)
					//example 1: <br><br><b>TAXLOT EVENTS UNKNOWN</b><br>Needs research beyond sources used.
					//example 2: &nbsp;
					//////////////////////////////////////////////////////////////////////////////////////////////
					e.features[0].properties.Unknown +



					//LINE
					"<hr>" +




					//KEEP THIS AS ALTERNATIVE WAY OF LINKING:
					//'<a href="' + e.features[0].properties.tax_lots_3 + '" target="_blank">' + e.features[0].properties.tax_lots_3 + '</a>'



					//////////////////////////////////////////////////
					//NEXT
					//example 1: <b>OWNERSHIP:</b><br>
					//example 2: <b>NEXT KNOWN OWNERSHIP:</b><br>
					//////////////////////////////////////////////////
					e.features[0].properties.Next +




					///////////////////////
					//OWNERS EXAMPLES:
					//////////////////////

					//NOTE: Not sure if NULLs are a problem, check in the future.

					//TAXLOT EVENT PARTY ROLE 1
					//TO_PAR1 / TO_PAR2 / FROM_PAR1 / FROM PAR2
					//example 1: /nahc/encyclopedia/node/1537 hreflang="en" target="_blank">Joint Owner</a>
					//example 2: NULL

					//FROM PARTY 1 (ANCESTOR)
					//TO_1 / T0_2 / FROM_1 / FROM_2
					//example 1: /nahc/encyclopedia/node/1536 hreflang="en" target="_blank">Signatory</a>
					//example 2: NULL

					//TAXLOT ENTITY DESCRIPTIONS 2
					//TO_ENT1 / TO_ENT2 / FROM_ENT1 / FROM_ENT2
					//example 1: /nahc/encyclopedia/node/1535 hreflang="en" target="_blank">Corporation</a>
					//example 2: NULL




					//////////////////////////////////////////
					//TO OWNERS
					//examples: See Above (OWNER EXAMPLES)
					//////////////////////////////////////////



					//OWNER 1
					'<a href=https://nahc-mapping.org/mappingNY' + e.features[0].properties.TO_PAR1 + ": " +
					"<br>" +
					'<a href=https://nahc-mapping.org/mappingNY' + e.features[0].properties.TO_1 +
					" (" + '<a href=https://nahc-mapping.org/mappingNY' + e.features[0].properties.TO_ENT1 + ")" +
					"<br>" +
					"<br>" +

					//OWNER 2
					'<a href=https://nahc-mapping.org/mappingNY' + e.features[0].properties.TO_PAR2 + ": " +
					"<br>" +
					'<a href=https://nahc-mapping.org/mappingNY' + e.features[0].properties.TO_2 +
					" (" + '<a href=https://nahc-mapping.org/mappingNY' + e.features[0].properties.TO_ENT2 + ")" +

					"<br>" +
					"<br>" +



					//////////////////
					//TAXLOT EVENT
					//////////////////

					//TAXLOT EVENT TITLE
					//example 1: <b>TAXLOT EVENT:</b>
					//example 2: <b>NEXT TAXLOT EVENT:</b>
					e.features[0].properties.Tax_Event +

					"<br>" +


					//TAXLOT EVENT TYPE
					//example: /nahc/encyclopedia/node/1528 hreflang="en" target="_blank">Land Grant or Patent</a>
					'<a href=https://nahc-mapping.org/mappingNY' + e.features[0].properties.EVENT1 +
					"<hr>" +


					//////////////////////////////
					//FROM OWNERS
					//examples: see above, OWNER EXAMPLES
					//////////////////////////////


					//FROM TITLE
					//example 1: <b>FROM:</b>
					//example 2: <b>PREVIOUS KNOWN FROM:</b>
					e.features[0].properties.Previous +

					"<br>" +

					//FROM 1

					//TAXLOT EVENT PARTY ROLE 1
					'<a href=https://nahc-mapping.org/mappingNY' + e.features[0].properties.FROM_PAR1 + ": " +
					"<br>" +
					//FROM PARTY 1 (ANCESTOR)
					'<a href=https://nahc-mapping.org/mappingNY' + e.features[0].properties.FROM_1 +
					//TAXLOT ENTITY DESCRIPTIONS 2
					" (" + '<a href=https://nahc-mapping.org/mappingNY' + e.features[0].properties.FROM_ENT1 + ")" +
					"<br>" +
					"<br>" +


					//FROM 2

					//TAXLOT EVENT PARTY ROLE 1
					'<a href=https://nahc-mapping.org/mappingNY' + e.features[0].properties.FROM_PAR2 + ": " +
					"<br>" +
					//FROM PARTY 2 (ANCESTOR)
					'<a href=https://nahc-mapping.org/mappingNY' + e.features[0].properties.FROM_2 +
					//TAXLOT ENTITY DESCRIPTIONS 2
					" (" + '<a href=https://nahc-mapping.org/mappingNY' + e.features[0].properties.FROM_ENT2 + ")" +




					///////////////////////////
					//PREVIOUS TAXLOT EVENT (SHOWS UP IF TAXLOT EVENTS UNKNOWN, OTHERWISE BLANK, &nbsp;)
					//////////////////////////

					//TITLE: "PREVIOUS TAXLOT EVENT"
					//example 1: <br><br><b>PREVIOUS TAXLOT EVENT:</b><br>
					//example 2: &nbsp;
					e.features[0].properties.Event +

					//PREVIOUS TAXLOT EVENT
					//example 1: /nahc/encyclopedia/node/1528 hreflang="en" target="_blank">Land Grant or Patent</a>
					//example 2: &nbsp;
					'<a href=https://nahc-mapping.org/mappingNY' + e.features[0].properties.Prev_Event +






					//LINK TO ALL TAXLOT EVENTS: "SEE ALL TAXLOT EVENTS"
					"<br>" +
					"<hr>" +
					'<b> <h3><a href="https://nahc-mapping.org/mappingNY/encyclopedia/taxlot-events" target="_blank">SEE ALL TAXLOT EVENTS</a></h3></b>'

//NEED TO MAKE THIS OPEN IN SEPARATE TAB!!




				)
				.addTo(beforeMap);
				
				    
		});
		*/

		// CHANGE TO CURSOR WHEN HOVERING
		beforeMap.on('mouseenter', 'c7_dates-ajsksu-left', function () {
			beforeMap.getCanvas().style.cursor = 'pointer';
		});

		// CHANGE TO POINTER WHEN NOT HOVERING
		beforeMap.on('mouseleave', 'c7_dates-ajsksu-left', function () {
			beforeMap.getCanvas().style.cursor = '';
		});
	//*A });
}


function addAfterLayers(yr, date) {

    //afterMap.on('load', function () {
        
		//REMOVING TAX LOT POINTS IF EXIST
		if (afterMap.getLayer("c7_shape-47qiak-right")) afterMap.removeLayer("c7_shape-47qiak-right");
        if (afterMap.getSource("c7_shape-47qiak")) afterMap.removeSource("c7_shape-47qiak");
        if (afterMap.getLayer("c7_dates-ajsksu-right")) afterMap.removeLayer("c7_dates-ajsksu-right");
        if (afterMap.getSource("c7_dates-ajsksu")) afterMap.removeSource("c7_dates-ajsksu");
       

		//ADD TAX LOT POINTS

		afterMap.addLayer({
			//ID: CHANGE THIS, 1 OF 3
			id: "c7_shape-47qiak-right",
			type: "fill",
			source: {
				type: "vector",
				//URL: CHANGE THIS, 2 OF 3
				url: "mapbox://nittyjee.8wpxjzzv"
			},
			layout: {
                visibility:  document.getElementById('rect_point').checked ? "visible" : "none",
            },
			"source-layer": "c7_shape-47qiak",
			paint: {
				//FILL COLOR
				'fill-color': "#ffffff",
				//FILL COLOR OUTLINE
				'fill-outline-color': "#ffffff"
			}
		});

		afterMap.addLayer({
			//ID: CHANGE THIS, 1 OF 3
			id: "c7_dates-ajsksu-right",
			type: "circle",
			source: {
				type: "vector",
				//URL: CHANGE THIS, 2 OF 3
				url: "mapbox://nittyjee.8krf945a"
			},
			layout: {
                visibility: document.getElementById('circle_point').checked ? "visible" : "none",
            },
			"source-layer": "c7_dates-ajsksu",
			paint: {

				//CIRCLE COLOR
				'circle-color': {
					type: "categorical",
					property: "color",
					stops: [
						["6", "#0000ee"],
						["5", "#097911"],
						["4", "#0000ee"],
						["3", "#097911"],
						["2", "#0000ee"],
						["1", "#097911"]
					],
					default: "#FF0000"
				},

				//CIRCLE RADIUS
				"circle-radius": {
					type: "categorical",
					property: "TAXLOT",
					stops: [
						["C7", 9]
					]
				}

			},
			filter: ["all", ["<=", "DayStart", date], [">=", "DayEnd", date]]
		});



		//TAX LOT POPUP

		// CLICK AND OPEN POPUP
		/*
		afterMap.on('click', 'c7_dates-ajsksu-right', function (e) {
			var coordinates = e.features[0].geometry.coordinates.slice();
			var description = e.features[0].properties.description;

			// Ensure that if the map is zoomed out such that multiple
			// copies of the feature are visible, the popup appears
			// over the copy being pointed to.
			while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
				coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
			}

            //console.log(e.features[0].properties.DATE2);
            //console.log(e.features[0].properties);

			//POPUP CONTENTS
			new mapboxgl.Popup()
				.setLngLat(coordinates)

				.setHTML(

					///////
					//TITLE
					///////
					"<b><h2>Taxlot: <a href='https://nahc-mapping.org/mappingNY/encyclopedia/taxlot/c7' target='_blank'>C7</a></h2></b>" +
// CAN'T GET THE TAXLOT LINK TO WORK: <a href='https://nahc-mapping.org/mappingNY/encyclopedia/taxlot/c7'>
					////////////////
					//PROPERTY TYPE
					////////////////
					"<b>House</b>" +


					//LINE
					"<hr>" +


					/////////////
					//DATE RANGE
					////////////

					//FROM
					//example: June 3, 1643
					"<b> FROM: </b>" +
					e.features[0].properties.DATE1 +

					//TO
					//example: January 19, 1659
					"<br>" +
					"<b> TO: </b>" +
					e.features[0].properties.DATE2 +



					/////////////////////////////////////////////////////////////////////////////////////////////
					//UNKNOWN (DISPLAY TITLE AND EXPLANATION WHERE UNKNOWN OR NOTHING, %nbsp)
					//example 1: <br><br><b>TAXLOT EVENTS UNKNOWN</b><br>Needs research beyond sources used.
					//example 2: &nbsp;
					//////////////////////////////////////////////////////////////////////////////////////////////
					e.features[0].properties.Unknown +



					//LINE
					"<hr>" +




					//KEEP THIS AS ALTERNATIVE WAY OF LINKING:
					//'<a href="' + e.features[0].properties.tax_lots_3 + '" target="_blank">' + e.features[0].properties.tax_lots_3 + '</a>'



					//////////////////////////////////////////////////
					//NEXT
					//example 1: <b>OWNERSHIP:</b><br>
					//example 2: <b>NEXT KNOWN OWNERSHIP:</b><br>
					//////////////////////////////////////////////////
					e.features[0].properties.Next +




					///////////////////////
					//OWNERS EXAMPLES:
					//////////////////////

					//NOTE: Not sure if NULLs are a problem, check in the future.

					//TAXLOT EVENT PARTY ROLE 1
					//TO_PAR1 / TO_PAR2 / FROM_PAR1 / FROM PAR2
					//example 1: /nahc/encyclopedia/node/1537 hreflang="en" target="_blank">Joint Owner</a>
					//example 2: NULL

					//FROM PARTY 1 (ANCESTOR)
					//TO_1 / T0_2 / FROM_1 / FROM_2
					//example 1: /nahc/encyclopedia/node/1536 hreflang="en" target="_blank">Signatory</a>
					//example 2: NULL

					//TAXLOT ENTITY DESCRIPTIONS 2
					//TO_ENT1 / TO_ENT2 / FROM_ENT1 / FROM_ENT2
					//example 1: /nahc/encyclopedia/node/1535 hreflang="en" target="_blank">Corporation</a>
					//example 2: NULL




					//////////////////////////////////////////
					//TO OWNERS
					//examples: See Above (OWNER EXAMPLES)
					//////////////////////////////////////////



					//OWNER 1
					'<a href=https://nahc-mapping.org/mappingNY' + e.features[0].properties.TO_PAR1 + ": " +
					"<br>" +
					'<a href=https://nahc-mapping.org/mappingNY' + e.features[0].properties.TO_1 +
					" (" + '<a href=https://nahc-mapping.org/mappingNY' + e.features[0].properties.TO_ENT1 + ")" +
					"<br>" +
					"<br>" +

					//OWNER 2
					'<a href=https://nahc-mapping.org/mappingNY' + e.features[0].properties.TO_PAR2 + ": " +
					"<br>" +
					'<a href=https://nahc-mapping.org/mappingNY' + e.features[0].properties.TO_2 +
					" (" + '<a href=https://nahc-mapping.org/mappingNY' + e.features[0].properties.TO_ENT2 + ")" +

					"<br>" +
					"<br>" +



					//////////////////
					//TAXLOT EVENT
					//////////////////

					//TAXLOT EVENT TITLE
					//example 1: <b>TAXLOT EVENT:</b>
					//example 2: <b>NEXT TAXLOT EVENT:</b>
					e.features[0].properties.Tax_Event +

					"<br>" +


					//TAXLOT EVENT TYPE
					//example: /nahc/encyclopedia/node/1528 hreflang="en" target="_blank">Land Grant or Patent</a>
					'<a href=https://nahc-mapping.org/mappingNY' + e.features[0].properties.EVENT1 +
					"<hr>" +


					//////////////////////////////
					//FROM OWNERS
					//examples: see above, OWNER EXAMPLES
					//////////////////////////////


					//FROM TITLE
					//example 1: <b>FROM:</b>
					//example 2: <b>PREVIOUS KNOWN FROM:</b>
					e.features[0].properties.Previous +

					"<br>" +

					//FROM 1

					//TAXLOT EVENT PARTY ROLE 1
					'<a href=https://nahc-mapping.org/mappingNY' + e.features[0].properties.FROM_PAR1 + ": " +
					"<br>" +
					//FROM PARTY 1 (ANCESTOR)
					'<a href=https://nahc-mapping.org/mappingNY' + e.features[0].properties.FROM_1 +
					//TAXLOT ENTITY DESCRIPTIONS 2
					" (" + '<a href=https://nahc-mapping.org/mappingNY' + e.features[0].properties.FROM_ENT1 + ")" +
					"<br>" +
					"<br>" +


					//FROM 2

					//TAXLOT EVENT PARTY ROLE 1
					'<a href=https://nahc-mapping.org/mappingNY' + e.features[0].properties.FROM_PAR2 + ": " +
					"<br>" +
					//FROM PARTY 2 (ANCESTOR)
					'<a href=https://nahc-mapping.org/mappingNY' + e.features[0].properties.FROM_2 +
					//TAXLOT ENTITY DESCRIPTIONS 2
					" (" + '<a href=https://nahc-mapping.org/mappingNY' + e.features[0].properties.FROM_ENT2 + ")" +




					///////////////////////////
					//PREVIOUS TAXLOT EVENT (SHOWS UP IF TAXLOT EVENTS UNKNOWN, OTHERWISE BLANK, &nbsp;)
					//////////////////////////

					//TITLE: "PREVIOUS TAXLOT EVENT"
					//example 1: <br><br><b>PREVIOUS TAXLOT EVENT:</b><br>
					//example 2: &nbsp;
					e.features[0].properties.Event +

					//PREVIOUS TAXLOT EVENT
					//example 1: /nahc/encyclopedia/node/1528 hreflang="en" target="_blank">Land Grant or Patent</a>
					//example 2: &nbsp;
					'<a href=https://nahc-mapping.org/mappingNY' + e.features[0].properties.Prev_Event +






					//LINK TO ALL TAXLOT EVENTS: "SEE ALL TAXLOT EVENTS"
					"<br>" +
					"<hr>" +
					'<b> <h3><a href="https://nahc-mapping.org/mappingNY/encyclopedia/taxlot-events" target="_blank">SEE ALL TAXLOT EVENTS</a></h3></b>'

//NEED TO MAKE THIS OPEN IN SEPARATE TAB!!




				)
				.addTo(afterMap);
				
		});
		*/        
		           
		            
                    
					
		// CHANGE TO CURSOR WHEN HOVERING
		afterMap.on('mouseenter', 'c7_dates-ajsksu-right', function () {
			afterMap.getCanvas().style.cursor = 'pointer';
		});

		// CHANGE TO POINTER WHEN NOT HOVERING
		afterMap.on('mouseleave', 'c7_dates-ajsksu-right', function () {
			afterMap.getCanvas().style.cursor = '';
		})
	//});
}




function buildPopUpInfo(props) {
				var popup_html =

					///////
					//TITLE
					///////
					"<b><h2>Taxlot: <a href='https://nahc-mapping.org/mappingNY/encyclopedia/taxlot/c7' target='_blank'>C7</a></h2></b>" +
// CAN'T GET THE TAXLOT LINK TO WORK: <a href='https://nahc-mapping.org/mappingNY/encyclopedia/taxlot/c7'>
					////////////////
					//PROPERTY TYPE
					////////////////
					"<b>House</b>" +


					//LINE
					"<hr>" +


					/////////////
					//DATE RANGE
					////////////

					//FROM
					//example: June 3, 1643
					"<b> FROM: </b>" +
					props.DATE1 +

					//TO
					//example: January 19, 1659
					"<br>" +
					"<b> TO: </b>" +
					props.DATE2 +



					/////////////////////////////////////////////////////////////////////////////////////////////
					//UNKNOWN (DISPLAY TITLE AND EXPLANATION WHERE UNKNOWN OR NOTHING, %nbsp)
					//example 1: <br><br><b>TAXLOT EVENTS UNKNOWN</b><br>Needs research beyond sources used.
					//example 2: &nbsp;
					//////////////////////////////////////////////////////////////////////////////////////////////
					props.Unknown +



					//LINE
					"<hr>" +




					//KEEP THIS AS ALTERNATIVE WAY OF LINKING:
					//'<a href="' + props.tax_lots_3 + '" target="_blank">' + props.tax_lots_3 + '</a>'



					//////////////////////////////////////////////////
					//NEXT
					//example 1: <b>OWNERSHIP:</b><br>
					//example 2: <b>NEXT KNOWN OWNERSHIP:</b><br>
					//////////////////////////////////////////////////
					props.Next +




					///////////////////////
					//OWNERS EXAMPLES:
					//////////////////////

					//NOTE: Not sure if NULLs are a problem, check in the future.

					//TAXLOT EVENT PARTY ROLE 1
					//TO_PAR1 / TO_PAR2 / FROM_PAR1 / FROM PAR2
					//example 1: /nahc/encyclopedia/node/1537 hreflang="en" target="_blank">Joint Owner</a>
					//example 2: NULL

					//FROM PARTY 1 (ANCESTOR)
					//TO_1 / T0_2 / FROM_1 / FROM_2
					//example 1: /nahc/encyclopedia/node/1536 hreflang="en" target="_blank">Signatory</a>
					//example 2: NULL

					//TAXLOT ENTITY DESCRIPTIONS 2
					//TO_ENT1 / TO_ENT2 / FROM_ENT1 / FROM_ENT2
					//example 1: /nahc/encyclopedia/node/1535 hreflang="en" target="_blank">Corporation</a>
					//example 2: NULL




					//////////////////////////////////////////
					//TO OWNERS
					//examples: See Above (OWNER EXAMPLES)
					//////////////////////////////////////////



					//OWNER 1
					'<a href=https://nahc-mapping.org/mappingNY' + props.TO_PAR1 + ": " +
					"<br>" +
					'<a href=https://nahc-mapping.org/mappingNY' + props.TO_1 +
					" (" + '<a href=https://nahc-mapping.org/mappingNY' + props.TO_ENT1 + ")" +
					"<br>" +
					"<br>" +

					//OWNER 2
					'<a href=https://nahc-mapping.org/mappingNY' + props.TO_PAR2 + ": " +
					"<br>" +
					'<a href=https://nahc-mapping.org/mappingNY' + props.TO_2 +
					" (" + '<a href=https://nahc-mapping.org/mappingNY' + props.TO_ENT2 + ")" +

					"<br>" +
					"<br>" +



					//////////////////
					//TAXLOT EVENT
					//////////////////

					//TAXLOT EVENT TITLE
					//example 1: <b>TAXLOT EVENT:</b>
					//example 2: <b>NEXT TAXLOT EVENT:</b>
					props.Tax_Event +

					"<br>" +


					//TAXLOT EVENT TYPE
					//example: /nahc/encyclopedia/node/1528 hreflang="en" target="_blank">Land Grant or Patent</a>
					'<a href=https://nahc-mapping.org/mappingNY' + props.EVENT1 +
					"<hr>" +


					//////////////////////////////
					//FROM OWNERS
					//examples: see above, OWNER EXAMPLES
					//////////////////////////////


					//FROM TITLE
					//example 1: <b>FROM:</b>
					//example 2: <b>PREVIOUS KNOWN FROM:</b>
					props.Previous +

					"<br>" +

					//FROM 1

					//TAXLOT EVENT PARTY ROLE 1
					'<a href=https://nahc-mapping.org/mappingNY' + props.FROM_PAR1 + ": " +
					"<br>" +
					//FROM PARTY 1 (ANCESTOR)
					'<a href=https://nahc-mapping.org/mappingNY' + props.FROM_1 +
					//TAXLOT ENTITY DESCRIPTIONS 2
					" (" + '<a href=https://nahc-mapping.org/mappingNY' + props.FROM_ENT1 + ")" +
					"<br>" +
					"<br>" +


					//FROM 2

					//TAXLOT EVENT PARTY ROLE 1
					'<a href=https://nahc-mapping.org/mappingNY' + props.FROM_PAR2 + ": " +
					"<br>" +
					//FROM PARTY 2 (ANCESTOR)
					'<a href=https://nahc-mapping.org/mappingNY' + props.FROM_2 +
					//TAXLOT ENTITY DESCRIPTIONS 2
					" (" + '<a href=https://nahc-mapping.org/mappingNY' + props.FROM_ENT2 + ")" +




					///////////////////////////
					//PREVIOUS TAXLOT EVENT (SHOWS UP IF TAXLOT EVENTS UNKNOWN, OTHERWISE BLANK, &nbsp;)
					//////////////////////////

					//TITLE: "PREVIOUS TAXLOT EVENT"
					//example 1: <br><br><b>PREVIOUS TAXLOT EVENT:</b><br>
					//example 2: &nbsp;
					props.Event +

					//PREVIOUS TAXLOT EVENT
					//example 1: /nahc/encyclopedia/node/1528 hreflang="en" target="_blank">Land Grant or Patent</a>
					//example 2: &nbsp;
					'<a href=https://nahc-mapping.org/mappingNY' + props.Prev_Event +






					//LINK TO ALL TAXLOT EVENTS: "SEE ALL TAXLOT EVENTS"
					"<br>" +
					"<hr>" +
					'<b> <h3><a href="https://nahc-mapping.org/mappingNY/encyclopedia/taxlot-events" target="_blank">SEE ALL TAXLOT EVENTS</a></h3></b>'

//NEED TO MAKE THIS OPEN IN SEPARATE TAB!!
;

//console.log(popup_html);
$("#studioMenu2").html(popup_html);

}




