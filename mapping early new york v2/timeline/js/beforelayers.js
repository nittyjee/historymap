
//////////////////
// Dynamic Layers
//////////////////

function addBeforeLayers(yr, date) {



	/////////////////
	//NAHC POINTS MAP
	/////////////////

	//beforeMap.on('load', function () {
		
		//REMOVING TAX LOT POINTS IF EXIST
		if (beforeMap.getLayer("c7_dates-ajsksu-left")) beforeMap.removeLayer("c7_dates-ajsksu-left");
        if (beforeMap.getSource("c7_dates-ajsksu")) beforeMap.removeSource("c7_dates-ajsksu");
		if (beforeMap.getLayer("grants1-5sp9tb-left")) beforeMap.removeLayer("grants1-5sp9tb-left");
        if (beforeMap.getSource("grants1-5sp9tb")) beforeMap.removeSource("grants1-5sp9tb");
       
	   
	    //ADD GRANTS POLYGONS

        beforeMap.addLayer({
			//ID: CHANGE THIS, 1 OF 3
			id: "grants1-5sp9tb-left",
			type: "fill",
			source: {
				type: "vector",
				//URL: CHANGE THIS, 2 OF 3
				url: "mapbox://nittyjee.b5bpfqeb"
			},
			layout: {
                visibility: document.getElementById('grants_layer').checked ? "visible" : "none",
            },
			"source-layer": "grants1-5sp9tb",
			paint: {
				"fill-color": "#e3ed58",
				"fill-opacity": [ 
					    'case',
                        ['boolean', ['feature-state', 'hover'], false],
                            0.8,
                            0.5
                        ],
				"fill-outline-color": "#000000"

			},

			filter: ["all", ["<=", "DayStart", date], [">=", "DayEnd", date]]
		});
		
		
		//CURSOR ON HOVER
            //ON HOVER
			beforeMap.on('mouseenter', 'grants1-5sp9tb-left', function (e) {
                beforeMap.getCanvas().style.cursor = 'pointer';
				beforeMapDutchGrantPopUp.setLngLat(e.lngLat).addTo(beforeMap);
			});
			
            beforeMap.on('mousemove', 'grants1-5sp9tb-left', function (e) {
				if (e.features.length > 0) {
                    if (hoveredDutchGrantIdLeft) {
                        beforeMap.setFeatureState(
                            { source: 'grants1-5sp9tb-left', sourceLayer: 'grants1-5sp9tb', id: hoveredDutchGrantIdLeft},
                            { hover: false }
                        );
                    }
					//console.log(e.features[0]);
                    hoveredDutchGrantIdLeft = e.features[0].id;
                    beforeMap.setFeatureState(
                        { source: 'grants1-5sp9tb-left', sourceLayer: 'grants1-5sp9tb', id: hoveredDutchGrantIdLeft},
                        { hover: true }
                    );
					
					//console.log(e.lngLat.lng);
                 
                 
					var PopUpHTML = "<div class='infoLayerDutchGrantsPopUp'>" + e.features[0].properties.name + "<br>" +
									"<b>Dutch Grant Lot: </b>" + e.features[0].properties.Lot + "</div>";		
					
					
					coordinates = e.features[0].geometry.coordinates.slice();
                //var description = e.features[0].properties.description;

                // Ensure that if the map is zoomed out such that multiple
                // copies of the feature are visible, the popup appears
                // over the copy being pointed to.
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }


                //BEFORE MAP POP UP CONTENTS
                beforeMapDutchGrantPopUp
                    .setLngLat(e.lngLat)
					.setHTML(
                        PopUpHTML
                    );
				
				}
				
            });

            //OFF HOVER
			beforeMap.on('mouseleave', 'grants1-5sp9tb-left', function () {
                beforeMap.getCanvas().style.cursor = '';
				if (hoveredDutchGrantIdLeft) {
                    beforeMap.setFeatureState(
                        { source: 'grants1-5sp9tb-left', sourceLayer: 'grants1-5sp9tb', id: hoveredDutchGrantIdLeft},
                        { hover: false }
                    );
                }
                hoveredDutchGrantIdLeft = null;		
				if(beforeMapDutchGrantPopUp.isOpen()) beforeMapDutchGrantPopUp.remove();
            });
			

		//ADD TAX LOT POINTS
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

                    //CIRCLE OPACITY
                    'circle-opacity':  [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                            0.5,
                            1
                        ],
					'circle-stroke-width': 2,
					'circle-stroke-color': {
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
					'circle-stroke-opacity': [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                            1,
                            0
                        ],


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
        //*A



		// CHANGE TO CURSOR WHEN HOVERING
		beforeMap.on('mouseenter', 'c7_dates-ajsksu-left', function (e) {
			beforeMap.getCanvas().style.cursor = 'pointer';
			        //*A console.log(e.features[0].id);
					//*A console.log(e.features[0]);
					
			        if (hoveredStateIdLeftCircle) {
                        beforeMap.setFeatureState(
                            { source: 'c7_dates-ajsksu-left', sourceLayer: 'c7_dates-ajsksu', id: hoveredStateIdLeftCircle},
                            { hover: false }
                        );
                    }
                    hoveredStateIdLeftCircle = e.features[0].id;
                    beforeMap.setFeatureState(
                        { source: 'c7_dates-ajsksu-left', sourceLayer: 'c7_dates-ajsksu', id: hoveredStateIdLeftCircle},
                        { hover: true }
                    );
					
				coordinates = e.features[0].geometry.coordinates.slice();
                //var description = e.features[0].properties.description;

                // Ensure that if the map is zoomed out such that multiple
                // copies of the feature are visible, the popup appears
                // over the copy being pointed to.
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }
				
				        beforeMapPopUp
				            .setLngLat(coordinates)
							.setHTML("<div class='demoLayerInfoPopUp'><b><h2>Taxlot: <a href='https://nahc-mapping.org/mappingNY/encyclopedia/taxlot/c7' target='_blank'>C7</a></h2></b></div>")
                            .addTo(beforeMap);
					
		});

		// CHANGE TO POINTER WHEN NOT HOVERING
		beforeMap.on('mouseleave', 'c7_dates-ajsksu-left', function () {
			beforeMap.getCanvas().style.cursor = '';
			    if (hoveredStateIdLeftCircle) {
                    beforeMap.setFeatureState(
                        { source: 'c7_dates-ajsksu-left', sourceLayer: 'c7_dates-ajsksu', id: hoveredStateIdLeftCircle},
                        { hover: false }
                    );
                }
                hoveredStateIdLeftCircle = null;		
				if(beforeMapPopUp.isOpen()) beforeMapPopUp.remove();
		});
	//*A });
}



function addGrantLotsBeforeLayers(date) {
	
	//REMOVING TAX LOT POINTS IF EXIST
		if (beforeMap.getLayer("grant-lots-left")) beforeMap.removeLayer("grant-lots-left");
        if (beforeMap.getSource("grant_lot_c7-6s06if")) beforeMap.removeSource("grant_lot_c7-6s06if");
	
	
	// Add a layer showing the places.
	        beforeMap.addLayer({
                id: "grant-lots-left",
                type: "fill",
                source: {
                    type: "vector",
                    url: "mapbox://nittyjee.4498iwgn"
                },
				layout: {
                    visibility: document.getElementById('grant_lots').checked ? "visible" : "none",
                },
                "source-layer": "grant_lot_c7-6s06if",
                paint: {
                    'fill-color': '#088',
                    'fill-opacity': [ 
					    'case',
                        ['boolean', ['feature-state', 'hover'], false],
                            0.8,
                            0.5
                        ],
					'fill-outline-color': "#FF0000"
                },
                filter: ["all", ["<=", "DayStart", date], [">=", "DayEnd", date]]
            });
			
					
			
			//CURSOR ON HOVER
            //ON HOVER
			beforeMap.on('mouseenter', 'grant-lots-left', function (e) {
                beforeMap.getCanvas().style.cursor = 'pointer';
				beforeMapGrantLotPopUp.setLngLat(e.lngLat).addTo(beforeMap);
			});
			
            beforeMap.on('mousemove', 'grant-lots-left', function (e) {
				if (e.features.length > 0) {
                    if (hoveredGrantLotIdLeft) {
                        beforeMap.setFeatureState(
                            { source: 'grant-lots-left', sourceLayer: 'grant_lot_c7-6s06if', id: hoveredGrantLotIdLeft},
                            { hover: false }
                        );
                    }
					//console.log(e.features[0]);
                    hoveredGrantLotIdLeft = e.features[0].id;
                    beforeMap.setFeatureState(
                        { source: 'grant-lots-left', sourceLayer: 'grant_lot_c7-6s06if', id: hoveredGrantLotIdLeft},
                        { hover: true }
                    );
					
					//console.log(e.lngLat.lng);
			    
                 
                 
				    var PopUpHTML = "<div class='infoLayerGrantLotsPopUp'>" +
									e.features[0].properties.name + "<br>" +
											"<b>Start:</b> " + e.features[0].properties.day1 + ", " + e.features[0].properties.year1 + "<br>" +
											"<b>End:</b> " + e.features[0].properties.day2 + ", " + e.features[0].properties.year2 + "<br>" +
											//"<br>" +
											"<b>Lot Division: </b>" + e.features[0].properties.dutchlot +
									"</div>";
					
					
					coordinates = e.features[0].geometry.coordinates.slice();
                //var description = e.features[0].properties.description;

                // Ensure that if the map is zoomed out such that multiple
                // copies of the feature are visible, the popup appears
                // over the copy being pointed to.
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }


                //BEFORE MAP POP UP CONTENTS
                beforeMapGrantLotPopUp
                    .setLngLat(e.lngLat)
					.setHTML(
                        PopUpHTML
                    );
				
				}
				
            });

            //OFF HOVER
			beforeMap.on('mouseleave', 'grant-lots-left', function () {
                beforeMap.getCanvas().style.cursor = '';
				if (hoveredGrantLotIdLeft) {
                    beforeMap.setFeatureState(
                        { source: 'grant-lots-left', sourceLayer: 'grant_lot_c7-6s06if', id: hoveredGrantLotIdLeft},
                        { hover: false }
                    );
                }
                hoveredGrantLotIdLeft = null;		
				if(beforeMapGrantLotPopUp.isOpen()) beforeMapGrantLotPopUp.remove();
            });
			
			
}



function addGrantLotsLinesBeforeLayers(date) {
	
	//REMOVING TAX LOT POINTS IF EXIST
		if (beforeMap.getLayer("grant-lots-lines-left")) beforeMap.removeLayer("grant-lots-lines-left");
        if (beforeMap.getSource("dutch_grants_lines-1n0e0p")) beforeMap.removeSource("dutch_grants_lines-1n0e0p");
	
	
	// Add a layer showing the places.
	        beforeMap.addLayer({
                id: "grant-lots-lines-left",
                type: "line",
                source: {
                    type: "vector",
                    url: "mapbox://nittyjee.1j4u7q5k"
                },
				layout: {
                    visibility: document.getElementById('grants_layer_lines').checked ? "visible" : "none",
                },
                "source-layer": "dutch_grants_lines-1n0e0p",
                paint: {
                    "line-color": "#FF0000",
					"line-width": 3,
					"line-opacity": 0.8
                },
                filter: ["all", ["<=", "DayStart", date], [">=", "DayEnd", date]]
            });
			
			
}


/////////////////////////
// Castello Static Layer
/////////////////////////

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
                    'circle-color': '#FF0000',
					'circle-opacity':  [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                            0.5,
                            1
                        ],
					'circle-stroke-width': 2,
					'circle-stroke-color': '#FF0000',
					'circle-stroke-opacity': [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                            1,
                            0
                        ]
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
            beforeMap.on('mouseenter', 'places-left', function (e) {
                beforeMap.getCanvas().style.cursor = 'pointer';
				if (e.features.length > 0) {
                    if (hoveredStateIdLeft) {
                        beforeMap.setFeatureState(
                            { source: 'places-left', sourceLayer: 'castello_points_new-3qkr6t', id: hoveredStateIdLeft},
                            { hover: false }
                        );
                    }
                    hoveredStateIdLeft = e.features[0].id;
                    beforeMap.setFeatureState(
                        { source: 'places-left', sourceLayer: 'castello_points_new-3qkr6t', id: hoveredStateIdLeft},
                        { hover: true }
                    );
					
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
                        "<div class='infoLayerCastelloPopUp'>" + "<b>Taxlot (1660):</b> " + "<br>" + e.features[0].properties.LOT2 + "</div>"
                    )
                    .addTo(beforeMap);
					
				}
            });

            //OFF HOVER
            beforeMap.on('mouseleave', 'places-left', function () {
                beforeMap.getCanvas().style.cursor = '';
				if (hoveredStateIdLeft) {
                    beforeMap.setFeatureState(
                        { source: 'places-left', sourceLayer: 'castello_points_new-3qkr6t', id: hoveredStateIdLeft},
                        { hover: false }
                    );
                }
                hoveredStateIdLeft = null;	
				if(beforeMapPlacesPopUp.isOpen()) beforeMapPlacesPopUp.remove();
            });
	
}



/////////////////////////
// Current Static Layers
/////////////////////////

function addCurrentLotsBeforeLayers() {
	
	    //REMOVING CURRENT LOTS IF EXIST
		if (beforeMap.getLayer("curr-lots-left")) beforeMap.removeLayer("curr-lots-left");
        if (beforeMap.getSource("current_lots_1-ca6kq1")) beforeMap.removeSource("current_lots_1-ca6kq1");
	
	        beforeMap.addLayer({
                id: "curr-lots-left",
                type: "fill",
                source: {
                    type: "vector",
                    url: "mapbox://nittyjee.441lyesf"
                },
				layout: {
                    visibility: document.getElementById('current_lots').checked ? "visible" : "none",
                },
                "source-layer": "current_lots_1-ca6kq1",
                paint: {
				"fill-color": "#7B68EE",
				"fill-opacity": [ 
					    'case',
                        ['boolean', ['feature-state', 'hover'], false],
                            0.8,
                            0.1
                            /*0.4*/
                        ],
				"fill-outline-color": "#000000"
                }
			
            });
			
			
			//CURSOR ON HOVER
            //ON HOVER
			beforeMap.on('mouseenter', 'curr-lots-left', function (e) {
                beforeMap.getCanvas().style.cursor = 'pointer';
				beforeMapCurrLotsPopUp.setLngLat(e.lngLat).addTo(beforeMap);
			});
			
            beforeMap.on('mousemove', 'curr-lots-left', function (e) {
				if (e.features.length > 0) {
                    if (hoveredCurrLotsIdLeft) {
                        beforeMap.setFeatureState(
                            { source: 'curr-lots-left', sourceLayer: 'current_lots_1-ca6kq1', id: hoveredCurrLotsIdLeft},
                            { hover: false }
                        );
                    }
					//console.log(e.features[0]);
                    hoveredCurrLotsIdLeft = e.features[0].id;
                    beforeMap.setFeatureState(
                        { source: 'curr-lots-left', sourceLayer: 'current_lots_1-ca6kq1', id: hoveredCurrLotsIdLeft},
                        { hover: true }
                    );
					
					//console.log(e.lngLat.lng);
                    //console.log(e.features[0].properties);
                    //Address
					//OwnerName
					var PopUpHTML = "<div class='infoLayerCurrLotsPopUp'>" + "<b>" + e.features[0].properties.OwnerName + "</b>" + "<br>" +
									e.features[0].properties.Address + "</div>";	
					
					/*
					coordinates = e.features[0].geometry.coordinates.slice();
                //var description = e.features[0].properties.description;

                // Ensure that if the map is zoomed out such that multiple
                // copies of the feature are visible, the popup appears
                // over the copy being pointed to.
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }
				*/


                //BEFORE MAP POP UP CONTENTS
                beforeMapCurrLotsPopUp
                    .setLngLat(e.lngLat)
					.setHTML(
                        PopUpHTML
                    );
				
				}
				
            });

            //OFF HOVER
			beforeMap.on('mouseleave', 'curr-lots-left', function () {
                beforeMap.getCanvas().style.cursor = '';
				if (hoveredCurrLotsIdLeft) {
                    beforeMap.setFeatureState(
                        { source: 'curr-lots-left', sourceLayer: 'current_lots_1-ca6kq1', id: hoveredCurrLotsIdLeft},
                        { hover: false }
                    );
                }
                hoveredCurrLotsIdLeft = null;		
				if(beforeMapCurrLotsPopUp.isOpen()) beforeMapCurrLotsPopUp.remove();
            });
			
}


function addCurrentLotsLinesBeforeLayers() {
	
	//REMOVING CURRENT LOTS IF EXIST
		if (beforeMap.getLayer("curr-lots-lines-left")) beforeMap.removeLayer("curr-lots-lines-left");
        if (beforeMap.getSource("selected_lots_lines-2qrhih")) beforeMap.removeSource("selected_lots_lines-2qrhih");
	
	         beforeMap.addLayer({
                id: "curr-lots-lines-left",
                type: "line",
                source: {
                    type: "vector",
                    url: "mapbox://nittyjee.dzxpgww5"
                },
				layout: {
                    visibility: document.getElementById('current_lots_lines').checked ? "visible" : "none",
                },
                "source-layer": "selected_lots_lines-2qrhih",
                paint: {
				    "line-color": "#00ff00",
					"line-width": 3,
					"line-opacity": 0.7
                }
			
            });
	
}


function addCurrentBuildingsLinesBeforeLayers() {
	
	//REMOVING CURRENT LOTS IF EXIST
		if (beforeMap.getLayer("curr-builds-lines-left")) beforeMap.removeLayer("curr-builds-lines-left");
        if (beforeMap.getSource("selected_buildings_lines-2gyw2x")) beforeMap.removeSource("selected_buildings_lines-2gyw2x");
	
	         beforeMap.addLayer({
                id: "curr-builds-lines-left",
                type: "line",
                source: {
                    type: "vector",
                    url: "mapbox://nittyjee.8icvriua"
                },
				layout: {
                    visibility: document.getElementById('current_buildings_lines').checked ? "visible" : "none",
                },
                "source-layer": "selected_buildings_lines-2gyw2x",
                paint: {
				    "line-color": "#0000FF",
					"line-width": 2,
					"line-opacity": 0.7
                }
			
            });
	
}

function addCurrentBuildingsBeforeLayers() {
	
	//REMOVING CURRENT LOTS IF EXIST
		if (beforeMap.getLayer("curr-builds-left")) beforeMap.removeLayer("curr-builds-left");
        if (beforeMap.getSource("current_buildings_1-cjgsm")) beforeMap.removeSource("current_buildings_1-cjgsm");
	
	         beforeMap.addLayer({
                id: "curr-builds-left",
                type: "fill",
                source: {
                    type: "vector",
                    url: "mapbox://nittyjee.8zoowskg"
                },
				layout: {
                    visibility: document.getElementById('current_buildings').checked ? "visible" : "none",
                },
                "source-layer": "current_buildings_1-cjgsm0",
                paint: {
				"fill-color": "#FF7F50",
				"fill-opacity": [ 
					    'case',
                        ['boolean', ['feature-state', 'hover'], false],
                            0.8,
                            0.3
                        ],
				"fill-outline-color": "#000000"
                }
			
            });
	
}


