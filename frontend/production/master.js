

//////////////////
// Dynamic Layers
//////////////////

function addAfterLayers(yr, date) {

    //afterMap.on('load', function () {
        
		//REMOVING TAX LOT POINTS IF EXIST
        if (afterMap.getLayer("c7_dates-ajsksu-right")) afterMap.removeLayer("c7_dates-ajsksu-right");
        if (afterMap.getSource("c7_dates-ajsksu")) afterMap.removeSource("c7_dates-ajsksu");
		if (afterMap.getLayer("grants1-5sp9tb-right")) afterMap.removeLayer("grants1-5sp9tb-right");
        if (afterMap.getSource("grants1-5sp9tb")) afterMap.removeSource("grants1-5sp9tb");
       
	   
	    //ADD GRANTS POLYGONS
        
		//*A#
    
        afterMap.addLayer({
			//ID: CHANGE THIS, 1 OF 3
			id: "grants1-5sp9tb-right-highlighted",
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
                            0
                        ],
				"fill-outline-color": "#FF0000"

			},

			filter: ["all", ["<=", "DayStart", date], [">=", "DayEnd", date]]
		});



        afterMap.addLayer({
          //ID: CHANGE THIS, 1 OF 3
          id: "grants1-5sp9tb-right",
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
                                0.45
                            ],
            "fill-outline-color": "#FF0000"

          },

          filter: ["all", ["<=", "DayStart", date], [">=", "DayEnd", date]]
        });

    
        //CURSOR ON HOVER
            //ON HOVER
			afterMap.on('mouseenter', 'grants1-5sp9tb-right', function (e) {
        afterMap.getCanvas().style.cursor = 'pointer';
				afterMapDutchGrantPopUp.setLngLat(e.lngLat).addTo(afterMap);
			});
			
      afterMap.on('mousemove', 'grants1-5sp9tb-right', function (e) {
        console.log(e.features);
				if (e.features.length > 0) {
          if (hoveredDutchGrantIdRight) {
            afterMap.setFeatureState(
              { source: 'grants1-5sp9tb-right', sourceLayer: 'grants1-5sp9tb', id: hoveredDutchGrantIdRight},
              { hover: false }
          );
        }
					
        hoveredDutchGrantIdRight = e.features[0].id;
        afterMap.setFeatureState(
          { source: 'grants1-5sp9tb-right', sourceLayer: 'grants1-5sp9tb', id: hoveredDutchGrantIdRight},
          { hover: true }
        );
	
				coordinates = e.features[0].geometry.coordinates.slice();
        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        //AFTER MAP POP UP CONTENTS
        afterMapDutchGrantPopUp
          .setLngLat(e.lngLat)
          .setDOMContent(createHoverPopup('infoLayerDutchGrantsPopUp', e, 'Dutch Grant Lot'));
				
			}
		});

            //OFF HOVER
			afterMap.on('mouseleave', 'grants1-5sp9tb-right', function () {
                afterMap.getCanvas().style.cursor = '';
				if (hoveredDutchGrantIdRight) {
                    afterMap.setFeatureState(
                        { source: 'grants1-5sp9tb-right', sourceLayer: 'grants1-5sp9tb', id: hoveredDutchGrantIdRight},
                        { hover: false }
                    );
                }
                hoveredDutchGrantIdRight = null;		
				if(afterMapDutchGrantPopUp.isOpen()) afterMapDutchGrantPopUp.remove();
            });
		
		
		

		//ADD TAX LOT POINTS
/*
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

  */  
  
		//TAX LOT POPUP
		// CLICK AND OPEN POPUP
		//*A
		           
		            
                    
					
		// CHANGE TO CURSOR WHEN HOVERING
		afterMap.on('mouseenter', 'c7_dates-ajsksu-right', function (e) {
			afterMap.getCanvas().style.cursor = 'pointer';
					
			        if (hoveredStateIdRightCircle) {
                        afterMap.setFeatureState(
                            { source: 'c7_dates-ajsksu-right', sourceLayer: 'c7_dates-ajsksu', id: hoveredStateIdRightCircle},
                            { hover: false }
                        );
                    }
                    hoveredStateIdRightCircle = e.features[0].id;
                    afterMap.setFeatureState(
                        { source: 'c7_dates-ajsksu-right', sourceLayer: 'c7_dates-ajsksu', id: hoveredStateIdRightCircle},
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
				
				afterMapPopUp
				  .setLngLat(coordinates)
					.setHTML("<div class='demoLayerInfoPopUp'><b><h2>Taxlot: <a href='https://encyclopedia.nahc-mapping.org/taxlot/c7' target='_blank'>C7</a></h2></b></div>")
          .addTo(afterMap);
		});

		// CHANGE TO POINTER WHEN NOT HOVERING
		afterMap.on('mouseleave', 'c7_dates-ajsksu-right', function () {
			afterMap.getCanvas().style.cursor = '';
			    if (hoveredStateIdRightCircle) {
                    afterMap.setFeatureState(
                        { source: 'c7_dates-ajsksu-right', sourceLayer: 'c7_dates-ajsksu', id: hoveredStateIdRightCircle},
                        { hover: false }
                    );
                }
                hoveredStateIdRightCircle = null;		
				if(afterMapPopUp.isOpen()) afterMapPopUp.remove();
		})
	//});
}



function addGrantLotsLinesAfterLayers(date) {
	
	//REMOVING TAX LOT POINTS IF EXIST
		if (afterMap.getLayer("grant-lots-lines-right")) afterMap.removeLayer("grant-lots-lines-right");
        if (afterMap.getSource("dutch_grants_lines-1n0e0p")) afterMap.removeSource("dutch_grants_lines-1n0e0p");
	
	
	// Add a layer showing the places.
	        afterMap.addLayer({
                id: "grant-lots-lines-right",
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





function addLongIslandNativeGroupsAfterLayers() {


    /* Long Island Indian Borders - 2 Versions: With Coastlines and Without coastlines */

    /* With Coastlines */

    /*

	        afterMap.addLayer({
                id: "native-groups-lines-right",
                type: "line",
                source: {
                    type: "vector",
                    url: "mapbox://nittyjee.02m6t3qm"
                },
				layout: {
                    visibility: document.getElementById('native_groups_lines').checked ? "visible" : "none",
                },
                "source-layer": "long_island_indian_area_lines-b7m3lt",
                paint: {
                "line-color": "#FF0000",
                "line-width": 2,
                "line-opacity": 1.0
                }
			
            });
	*/	


    /* Without coastlines*/

    afterMap.addLayer({
        id: "native-groups-lines-right",
        type: "line",
        source: {
            type: "vector",
            url: "mapbox://nittyjee.bxsaikea"
        },
        layout: {
            visibility: document.getElementById('native_groups_lines').checked ? "visible" : "none",
        },
        "source-layer": "simplified_indian_long_island-d223sy",
        paint: {
        //Light Blue:
        //"line-color": "#3a96f8",
        //Orange:
        "line-color": "#ff9900",
        //Red:
        //"line-color": "#FF0000",
        "line-width": 15,
        "line-blur" : 20,
        "line-opacity": 1.0
        }
    
    });


			
			afterMap.addLayer({
                id: "native-groups-area-right",
                type: "fill",
                source: {
                    type: "vector",
                    url: "mapbox://nittyjee.9dmuvuk4"
                },
				layout: {
                    visibility: document.getElementById('native_groups_area').checked ? "visible" : "none",
                },
                "source-layer": "long_island_indian_areas-3o4hr7",
                paint: {
				"fill-color": "#FF1493",
				"fill-opacity": [ 
					    'case',
                        ['boolean', ['feature-state', 'hover'], false],
                            0.5,
                            0.2
                        ],
				"fill-outline-color": "#FFD700"
                }
            });
			
			
			afterMap.addLayer({
                id: "native-groups-area-right-highlighted",
                type: "fill",
                source: {
                    type: "vector",
                    url: "mapbox://nittyjee.9dmuvuk4"
                },
				layout: {
                    visibility: document.getElementById('native_groups_area').checked ? "visible" : "none",
                },
                "source-layer": "long_island_indian_areas-3o4hr7",
                paint: {
				"fill-color": "#FF1493",
				"fill-opacity": [ 
					    'case',
                        ['boolean', ['feature-state', 'hover'], false],
                            0.3,
                            0
                        ],
				"fill-outline-color": "#FFD700"
                }
            });
			
			
			afterMap.addLayer({
                id: "native-groups-labels-right",
                type: "symbol",
                source: {
                    type: "vector",
                    url: "mapbox://nittyjee.978p2v80"
                },
				layout: {
                    visibility: document.getElementById('native_groups_labels').checked ? "visible" : "none",
				"text-field": "{name}",
					"text-offset": [0,1],
                    "text-size": {
                    stops: [
                        [0, 4],
                        [22, 34]
                    ]
                    }
                },
                "source-layer": "indian_long_island_labels-483rzu",
                paint: {
                    "text-color": "#000080",
                    "text-halo-color": "#ffffff",
                    "text-halo-width": 5,
                    "text-halo-blur": 1,
                    "text-opacity": {
                        stops: [
                        [6, 0],
                        [7, 1]
                        ]
                    }
                }
            });
			
			
			//CURSOR ON HOVER
            //ON HOVER
			afterMap.on('mouseenter', 'native-groups-area-right', function (e) {
                afterMap.getCanvas().style.cursor = 'pointer';
				afterMapNativeGroupsPopUp.setLngLat(e.lngLat).addTo(afterMap);
			});
			
            afterMap.on('mousemove', 'native-groups-area-right', function (e) {
				if (e.features.length > 0) {
                    if (hoveredNativeGroupsIdRight) {
                        afterMap.setFeatureState(
                            { source: 'native-groups-area-right', sourceLayer: 'long_island_indian_areas-3o4hr7', id: hoveredNativeGroupsIdRight},
                            { hover: false }
                        );
                    }
					//console.log(e.features[0]);
                    hoveredNativeGroupsIdRight = e.features[0].id;
                    afterMap.setFeatureState(
                        { source: 'native-groups-area-right', sourceLayer: 'long_island_indian_areas-3o4hr7', id: hoveredNativeGroupsIdRight},
                        { hover: true }
                    );
					
					//console.log(e.lngLat.lng);
                    var PopUpHTML = "";
					if( (typeof taxlot_event_entities_info[e.features[0].properties.nid] == "undefined") || (e.features[0].properties.nid == "") ) {
						PopUpHTML = "<div class='infoLayerCastelloPopUp'><b>Name : </b>" + e.features[0].properties.name + "</div>";	
					} else {	
						PopUpHTML = "<div class='infoLayerCastelloPopUp'><b>Name : </b>" + ( taxlot_event_entities_info[e.features[0].properties.nid].name.length > 0 ? taxlot_event_entities_info[e.features[0].properties.nid].name : e.features[0].properties.name ) + "</div>";
					}
					//PopUpHTML += "<div class='infoLayerCastelloPopUp'><b>Name : </b>" + e.features[0].properties.name + "</div>";
					
					coordinates = e.features[0].geometry.coordinates.slice();
                //var description = e.features[0].properties.description;

                // Ensure that if the map is zoomed out such that multiple
                // copies of the feature are visible, the popup appears
                // over the copy being pointed to.
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }


                //AFTER MAP POP UP CONTENTS
                afterMapNativeGroupsPopUp
                    .setLngLat(e.lngLat)
					.setHTML(
                        PopUpHTML
                        //createHoverPopup('infoLayerCastelloPopUp');
                    );
				
				}
				
            });

            //OFF HOVER
			afterMap.on('mouseleave', 'native-groups-area-right', function () {
                afterMap.getCanvas().style.cursor = '';
				if (hoveredNativeGroupsIdRight) {
                    afterMap.setFeatureState(
                        { source: 'native-groups-area-right', sourceLayer: 'long_island_indian_areas-3o4hr7', id: hoveredNativeGroupsIdRight},
                        { hover: false }
                    );
                }
                hoveredNativeGroupsIdRight = null;		
				if(afterMapNativeGroupsPopUp.isOpen()) afterMapNativeGroupsPopUp.remove();
            });
}


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
        //*A#
        beforeMap.addLayer({
			//ID: CHANGE THIS, 1 OF 3
			id: "grants1-5sp9tb-left-highlighted",
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
                            0
                        ],
				"fill-outline-color": "#FF0000"

			},

			filter: ["all", ["<=", "DayStart", date], [">=", "DayEnd", date]]
		});


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
                 /*
                    var PopUpHTML = "";
					if( typeof dutch_grant_lots_info[e.features[0].properties.Lot] == "undefined" ) {
						PopUpHTML = "<div class='infoLayerDutchGrantsPopUp'>" + e.features[0].properties.name + "<br>";	
					} else {	
						PopUpHTML = "<div class='infoLayerDutchGrantsPopUp'>" + ( dutch_grant_lots_info[e.features[0].properties.Lot].name_txt.length > 0 ? dutch_grant_lots_info[e.features[0].properties.Lot].name_txt : e.features[0].properties.name ) + "<br>";
					}
					PopUpHTML += "<b>Dutch Grant Lot: </b>" + e.features[0].properties.Lot + "</div>";		
					*/
					
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
        					.setDOMContent(createHoverPopup('infoLayerDutchGrantsPopUp', e, 'Dutch grant lot'));
				
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
							.setHTML("<div class='demoLayerInfoPopUp'><b><h2>Taxlot: <a href='https://encyclopedia.nahc-mapping.org/taxlot/c7' target='_blank'>C7</a></h2></b></div>")
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






function addLongIslandNativeGroupsBeforeLayers() {



    /* Long Island Indian Borders - 2 Versions: With Coastlines and Without coastlines */

    /* With Coastlines */

    /*

	        beforeMap.addLayer({
                id: "native-groups-lines-right",
                type: "line",
                source: {
                    type: "vector",
                    url: "mapbox://nittyjee.02m6t3qm"
                },
				layout: {
                    visibility: document.getElementById('native_groups_lines').checked ? "visible" : "none",
                },
                "source-layer": "long_island_indian_area_lines-b7m3lt",
                paint: {
                "line-color": "#FF0000",
                "line-width": 2,
                "line-opacity": 1.0
                }
			
            });
	*/	


    /* Without coastlines*/

    beforeMap.addLayer({
        id: "native-groups-lines-left",
        type: "line",
        source: {
            type: "vector",
            url: "mapbox://nittyjee.bxsaikea"
        },
        layout: {
            visibility: document.getElementById('native_groups_lines').checked ? "visible" : "none",
        },
        "source-layer": "simplified_indian_long_island-d223sy",
        paint: {
        //Light Blue:
        //"line-color": "#3a96f8",
        //Orange:
        "line-color": "#ff9900",
        //Red:
        //"line-color": "#FF0000",
        "line-width": 15,
        "line-blur" : 20,
        "line-opacity": 1.0
        }
    
    });



			
	beforeMap.addLayer({
                id: "native-groups-area-left",
                type: "fill",
                source: {
                    type: "vector",
                    url: "mapbox://nittyjee.9dmuvuk4"
                },
				layout: {
                    visibility: document.getElementById('native_groups_area').checked ? "visible" : "none",
                },
                "source-layer": "long_island_indian_areas-3o4hr7",
                paint: {
				"fill-color": "#FF1493",
				"fill-opacity": [ 
					    'case',
                        ['boolean', ['feature-state', 'hover'], false],
                            0.5,
                            0.2
                        ],
				"fill-outline-color": "#FFD700"
                }
            });
			
			
	beforeMap.addLayer({
                id: "native-groups-area-left-highlighted",
                type: "fill",
                source: {
                    type: "vector",
                    url: "mapbox://nittyjee.9dmuvuk4"
                },
				layout: {
                    visibility: document.getElementById('native_groups_area').checked ? "visible" : "none",
                },
                "source-layer": "long_island_indian_areas-3o4hr7",
                paint: {
				"fill-color": "#FF1493",
				"fill-opacity": [ 
					    'case',
                        ['boolean', ['feature-state', 'hover'], false],
                            0.3,
                            0
                        ],
				"fill-outline-color": "#FFD700"
                }
            });
			
			
	beforeMap.addLayer({
                id: "native-groups-labels-left",
                type: "symbol",
                source: {
                    type: "vector",
                    url: "mapbox://nittyjee.978p2v80"
                },
				layout: {
                    visibility: document.getElementById('native_groups_labels').checked ? "visible" : "none",
				"text-field": "{name}",
					"text-offset": [0,1],
                    "text-size": {
                    stops: [
                        [0, 4],
                        [22, 34]
                    ]
                    }
                },
                "source-layer": "indian_long_island_labels-483rzu",
                paint: {
                    "text-color": "#000080",
                    "text-halo-color": "#ffffff",
                    "text-halo-width": 5,
                    "text-halo-blur": 1,
                    "text-opacity": {
                        stops: [
                        [6, 0],
                        [7, 1]
                        ]
                    }
                }
            });

    /*
    beforeMap.on('click', 'native-groups-labels-left', function (e) {
		 console.warn("load natie groups labels");
		 console.log(e.features[0]);
	});
    */
	
	//CURSOR ON HOVER
            //ON HOVER
			beforeMap.on('mouseenter', 'native-groups-area-left', function (e) {
                beforeMap.getCanvas().style.cursor = 'pointer';
				beforeMapNativeGroupsPopUp.setLngLat(e.lngLat).addTo(beforeMap);
			});
			
            beforeMap.on('mousemove', 'native-groups-area-left', function (e) {
				if (e.features.length > 0) {
                    if (hoveredNativeGroupsIdLeft) {
                        beforeMap.setFeatureState(
                            { source: 'native-groups-area-left', sourceLayer: 'long_island_indian_areas-3o4hr7', id: hoveredNativeGroupsIdLeft},
                            { hover: false }
                        );
                    }
					//console.log(e.features[0]);
                    hoveredNativeGroupsIdLeft = e.features[0].id;
                    beforeMap.setFeatureState(
                        { source: 'native-groups-area-left', sourceLayer: 'long_island_indian_areas-3o4hr7', id: hoveredNativeGroupsIdLeft},
                        { hover: true }
                    );
					
					//console.log(e.lngLat.lng);
                    var PopUpHTML = "";
					if( (typeof taxlot_event_entities_info[e.features[0].properties.nid] == "undefined") || (e.features[0].properties.nid == "") ) {
						PopUpHTML = "<div class='infoLayerCastelloPopUp'><b>Name : </b>" + e.features[0].properties.name + "</div>";	
					} else {	
						PopUpHTML = "<div class='infoLayerCastelloPopUp'><b>Name : </b>" + ( taxlot_event_entities_info[e.features[0].properties.nid].name.length > 0 ? taxlot_event_entities_info[e.features[0].properties.nid].name : e.features[0].properties.name ) + "</div>";
					}
					//PopUpHTML += "<div class='infoLayerCastelloPopUp'><b>Name : </b>" + e.features[0].properties.name + "</div>";
					
					coordinates = e.features[0].geometry.coordinates.slice();
                //var description = e.features[0].properties.description;

                // Ensure that if the map is zoomed out such that multiple
                // copies of the feature are visible, the popup appears
                // over the copy being pointed to.
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }


                //AFTER MAP POP UP CONTENTS
                beforeMapNativeGroupsPopUp
                    .setLngLat(e.lngLat)
					.setHTML(
                        PopUpHTML
                    );
				
				}
				
            });

            //OFF HOVER
			beforeMap.on('mouseleave', 'native-groups-area-left', function () {
                beforeMap.getCanvas().style.cursor = '';
				if (hoveredNativeGroupsIdLeft) {
                    beforeMap.setFeatureState(
                        { source: 'native-groups-area-left', sourceLayer: 'long_island_indian_areas-3o4hr7', id: hoveredNativeGroupsIdLeft},
                        { hover: false }
                    );
                }
                hoveredNativeGroupsIdLeft = null;		
				if(beforeMapNativeGroupsPopUp.isOpen()) beforeMapNativeGroupsPopUp.remove();
            });
}


/**
 * 
 * @param {string} layerClass   -The layer being added e.g. 'infoLayerDutchGrantsPopUp'
 * @param {Object{}} event      -Event fired by Mapbox GL
 * @param {string} layerName    -The human readable layer name being added e.g. 'Dutch Grant Lot' 
 * @description Function to create popup content. From a security perspective
 * when taking uset input it is preferable to set text view textContent:
 * https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent#differences_from_innertext
 * Using DOM mutation like this also means we can add events easilly.
 * @returns A HTMLElemnt to use in the pop up
 */

function createHoverPopup (layerClass, event, layerName) {
  const popUpHTML = document.createElement('div');
  
  const lot = (event.features[0].properties.Lot) 
    ? event.features[0].properties.Lot
    : event.features[0].properties.TAXLOT;
  
  popUpHTML.classList.add(
    removeSpaces(layerClass),
    removeSpaces(lot)
  );

  const paragraph = document.createElement('p');
  popUpHTML.appendChild(paragraph);
  const paragraphText = (event.features[0].properties.name)
   ? event.features[0].properties.name
   : 'TAXLOT';

  paragraph.textContent = paragraphText;
  paragraph.classList.add(`${removeSpaces(lot)}-${removeSpaces(paragraphText)}`);

  const name = document.createElement('b');
  popUpHTML.appendChild(name);
  name.textContent = `${layerName}: ${lot}`;
  return popUpHTML;
}

/**
 * 
 * @param {string} string 
 * @returns The same string with spaces replaced by an undescore
 * @description Small utility to declutter code. 
 */
function removeSpaces (string) {
  return string.replaceAll(' ', '_');
}

/**
 * 
 * @param {string} layerClass   -The layer being added e.g. 'infoLayerDutchGrantsPopUp'
 * @param {Object{}} event      -Event fired by Mapbox GL
 * @param {string} layerName    -The human readable layer name being added e.g. 'Dutch Grant Lot' 
 * @description Function to create popup content when a feature is clicked and shows date information.
 * @returns A HTMLElemnt to use in the pop up
 */
function createClickedFeaturePopup (layerClass, event, layerName) {
  console.log(event.features[0]);
  
  const changes = {};
  const lot = event.features[0].properties.Lot;
  const popUpHTML = document.createElement('div');
  const registrarName = event.features[0].properties.name;
  const dutchLot = event.features[0].properties.dutchlot;
  const day1 = event.features[0].properties.day1;
  const day2 = event.features[0].properties.day2;
  const year1 = event.features[0].properties.year1;
  const year2 = event.features[0].properties.year2; 

  popUpHTML.classList.add(layerClass.replaceAll(' ', '_'));
  
  const registrarNameParagraph = document.createElement('p');
  registrarNameParagraph.textContent = registrarName;
  registrarNameParagraph.setAttribute('contenteditable', 'true');
  registrarNameParagraph.addEventListener('input', (e) => {
    changes.registrarName = registrarNameParagraph.textContent;
  });
  popUpHTML.appendChild(registrarNameParagraph);

  const startBold = document.createElement('b');
  startBold.textContent = 'Start:';
  popUpHTML.appendChild(startBold);

  const startPara = document.createElement('p');
  startPara.textContent = day1 && year1 
    ? `${day1}, ${year1}`
    : `${day1 || year1}`;
  startPara.setAttribute('contenteditable', 'true');
  startPara.addEventListener('input', (e) => {
    changes.start = startPara.textContent;
  });
  popUpHTML.appendChild(startPara);

  const endBold = document.createElement('b');
  endBold.textContent = 'End:';
  popUpHTML.appendChild(endBold);

  const endPara = document.createElement('p');
  endPara.textContent = day2 && year2 
    ? `${day2}, ${year2}`
    : `${day2 || year2}`;
  endPara.setAttribute('contenteditable', 'true');
  endPara.addEventListener('input', (e) => {
    changes.end = endPara.textContent;
  });
  popUpHTML.appendChild(endPara);

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'save changes';
  saveBtn.addEventListener('click', () => {
    alert(JSON.stringify(changes));
  });
  popUpHTML.appendChild(saveBtn);

  if(dutchLot){
    const lotBold = document.createElement('b');
    lotBold.textContent = 'Lot Division:';
    popUpHTML.appendChild(lotBold);
  
    const lotPara = document.createElement('p');
    lotPara.textContent = dutchLot;
    startPara.setAttribute('contenteditable', 'true');
    popUpHTML.appendChild(lotPara);


    startPara.setAttribute('contenteditable', 'true');
  }

  return popUpHTML;
}

function LayerManager () {
  const layers = [];
  let base;

  this.generateAddLayerForm = (parentElement) => {
    const data = {};
    
    base = document.createElement('form');
    parentElement.appendChild(base);

    base.classList.add('layerform');
    const title = document.createElement('p');
    title.classList.add('title');
    title.textContent = 'Add Layer';
    base.appendChild(title);

    const fields = ['name', 'source layer', 'id', 'database', 'group', 'color', 'opacity'];
    function textInputGenerator (fieldName) {          
      const nameLabel = document.createElement('label');
      nameLabel.htmlFor = fieldName;
      nameLabel.innerHTML = `${fieldName}: `;
      base.appendChild(nameLabel);
  
      const name = document.createElement('input');
      name.setAttribute('type', 'text');
      name.id = fieldName.replaceAll(' ', '_');
      base.appendChild(name);

      name.addEventListener('input', () => {
        data[fieldName] = name.value;
      });
  
      const br = document.createElement('br');
      base.appendChild(br);
    }
    fields.forEach(fieldName => {
      textInputGenerator (fieldName);
    });
  
    const types = ['circle', 'line', 'fill'];
    dropDownGenerator(types);
    function dropDownGenerator (options) {
      const select = document.createElement('select');
      base.appendChild(select);

      select.addEventListener('change', () => {
        data.type = select.value; 
      });

      options.forEach(value => {
        const option = document.createElement('option');
        option.setAttribute('value', value);
        option.textContent = value;
        select.appendChild(option);
      });
    }

    const checkboxes =  ['hover', 'click', 'sidebar', 'sliderCheckBox'];
    function generateCheckbox (checkboxName) {
      const nameLabel = document.createElement('label');
      nameLabel.htmlFor = checkboxName;
      nameLabel.innerHTML = `${checkboxName}: `;
      base.appendChild(nameLabel);
      
      const name = document.createElement('input');
      name.setAttribute('type', 'checkbox');
      name.id = checkboxName;
      base.appendChild(name);

      name.addEventListener('click', () => {
        if(name.checked === true) {
          data[checkboxName] = 1;
        } else {
          data[checkboxName] = 0;
        }
      });

      const br = document.createElement('br');
      base.appendChild(br);
    }

    checkboxes.forEach(label => {
      generateCheckbox(label);
    });

    const submit = document.createElement('input');
    submit.setAttribute('type', 'submit');
    submit.textContent = 'submit';
    base.appendChild(submit);

    
    base.addEventListener('submit', (event)=> {
      event.preventDefault();
      fields.forEach((id)=> {        
        data[id] = base.querySelector(`#${id.replaceAll(' ', '_')}`).value;
      });

      data.type = base.querySelector(`select`).value;
      createLayer(afterMap, data);
    });
  };

  function createLayer (map, data) {
    const transpilledOptions = {
      id: '',
      type: '',
      source: {
        //url is tileset ID in mapbox: 
        url: '',
        type: 'vector'
      },
      layout:  {
        visibility : 'visible' // || none
      },
      // called "source name"
      "source-layer": '',
      paint: {
        [`${data.type}-color`]: (data.color) ? data.color : '#AAAAAA',
        [`${data.type}-opacity`]: (data.opacity) ? parseFloat(data.opacity) : 0.5
      }
    };

    if (data.hover) {
      map.on('mouseenter', data.id, (event) => {
        map.getCanvas().style.cursor = 'pointer';
      
        const hoverPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 })

        hoverPopUp
          .setLngLat(event.lngLat)
          .setDOMContent(createHoverPopup (`${data.name}PopUp`, event, data.name))
          .addTo(map);
      
			map.on('mouseleave', data.id, () => {
        map.getCanvas().style.cursor = '';
        if (hoverPopUp.isOpen()) {
          hoverPopUp.remove();
        }
      });

			});
    }

    if (data.click) {
      const clickPopUp = new mapboxgl.Popup({ closeButton: true, closeOnClick: true, offset: 5 });
      map.on('click', data.id, (event) => {
        clickPopUp
          .setLngLat(event.lngLat)
          .setDOMContent(createClickedFeaturePopup (`${data.name}PopUp`, event, null))
          .addTo(map);
      });
    }

    if (data.name) {
      transpilledOptions.name = data.name;
    }
    if (data.id) {
      transpilledOptions.id = data.id;
    }
    if (data.type) {
      transpilledOptions.type = data.type;
    }
    if (data["source layer"]) {
      transpilledOptions['source-layer'] = data["source layer"];
    }
    if (data.database) {
      transpilledOptions.source.url = data.database;
    }
    if (data.color) {
      transpilledOptions.paint[`${data.type}-color`] = data.color;
    }

    map.addLayer(transpilledOptions); 
  }
}


  /**
    * Onload event
    * @event DOMContentLoaded
    * @summary fires layer dialogue constructor
    * @fires Layer#generateAddLayerForm
    */

document.addEventListener('DOMContentLoaded', () => {
  const parent = document.querySelector('#studioMenu');
  const layerControls = new LayerManager();
  layerControls.generateAddLayerForm(parent);

  parent.querySelector('#name').value = "testing testing";
  parent.querySelector('#id').value = "c7_dates-ajsksu-right-TEST";
  parent.querySelector('#source_layer').value = "c7_dates-ajsksu";
  parent.querySelector('#database').value = "mapbox://nittyjee.8krf945a";
  parent.querySelector('#group').value = "1643-75|Demo Taxlot: C7 TEST";
});

var grant_lots_view_id = null,
    dgrants_layer_view_id = null,
	native_group_layer_view_id = null,
    grant_lots_view_flag = false,
    demo_layer_view_flag = false,
	dgrants_layer_view_flag = false,
	native_group_layer_view_flag = false;
	
$("#infoLayerGrantLots").slideUp();
$("#infoLayerDutchGrants").slideUp();
$("#demoLayerInfo").slideUp();
$("#infoLayerNativeGroups").slideUp();

// world bounds
const WorldBounds = [

	
	/*
	//For Sidebar Closed
	//Less of Greenland shown
	//Most ideal but Western third of North America cut off when sidebar open
    [-160,-61], // [west, south]
    [163,74]  // [east, north]
	*/
	

	/*
	//For Sidebar Open
	//Western portion beyond lower United States is cut off but Bering Strait seen
    [-179,-60], // [west, south]
    [146,75]  // [east, north]
	*/
	

	/*
	//For Sidebar Open
	//All Eurasia and North America visible
	//Shows too much of Greenland which is projected too large
    [-156,-69], // [west, south]
    [55,82]  // [east, north]
	*/

	
	//CURRENT CHOSEN:
	//For Sidebar Open
	//Alaska and Eastern most tip of Russia cut off
	//Shows less but still too much of Greenland which is projected too large
    [-179,-59], // [west, south]
    [135,77]  // [east, north]
	
	

];

// area bounds
	var LongIslandBounds = [[-74.0419692,40.5419011],[-71.8562705,41.161155]],
        ManhattanBounds = [[-74.04772962697074,40.682916945445164],[-73.90665099539478,40.879038046804695]],
		NYCbounds = [[-74.25559136315213,40.496133987611834],[-73.7000090638712,40.91553277650267]],
		BronxBounds = [[-73.93360592036706,40.785356620508495],[-73.76533243995276,40.91553277650267]],
		BrooklynBounds = [[-74.04189660705046,40.56952999398417],[-73.8335592388046,40.73912795313439]],
		QueensBounds = [[-73.96262015898652,40.54183396045311],[-73.7000090638712,40.80101146781903]],
		StatenIslandBounds = [[-74.25559136315213,40.496133987611834],[-74.04923629842045,40.648925552276076]],
		NewNLbounds = [[-75.5588888888889,39.5483333333333],[-71.6483333333333,42.64485]],
		NewEnglandBounds = [[-73.6468505859375, 41.017210578228436],[-69.708251953125,43.97700467496408]];

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
            hash: true,
            zoom: 0,
			attributionControl: false
        });

        var afterMap = new mapboxgl.Map({
          container: 'after',
          style: 'mapbox://styles/nittyjee/cjowjzrig5pje2rmmnjb5b0y2',
          center: [0, 0],
          hash: true,
          zoom: 0,
			    attributionControl: false
        });

        var map = new mapboxgl.Compare(beforeMap, afterMap, {
            // Set this to enable comparing two maps by mouse movement:
            // mousemove: true
        });

        // Set the map's max bounds
		/*
		beforeMap.setMaxBounds(WorldBounds);
        afterMap.setMaxBounds(WorldBounds);
        */
        /////////////////////////////
        //ADD NAVIGATION CONTROLS (ZOOM IN AND OUT)
        /////////////////////////////
        //Before map
        var nav = new mapboxgl.NavigationControl();
        beforeMap.addControl(nav, "bottom-right");
		
        //After map
        var nav = new mapboxgl.NavigationControl();
        afterMap.addControl(nav, "bottom-right");
		

		
		
		var init_bearing,
		    init_center,
			init_zoom;
			
		var na_bearing = -51.3,
		    na_center = [-74.01255, 40.704882],
			na_zoom = 16.34;

		

		function testZoom() {
            var current_bearing = beforeMap.getBearing();
            var TestBounds = [-74.01507471506183, 40.70239266372983, -74.00734180289922, 40.709035402164524]; //dutch grants
            //[-74.0128690093802, 40.705887398291175, -73.9457283353804, 40.817639419566085]; //Farms Layer
            beforeMap.fitBounds(TestBounds, {bearing: current_bearing});
				afterMap.fitBounds(TestBounds, {bearing: current_bearing});
		}
		
        function zoomtobounds(boundsName){
			switch(boundsName){
				case 'LongIsland':
				if(windoWidth <= 637) {
					beforeMap.fitBounds(LongIslandBounds, {bearing: 0});
				    afterMap.fitBounds(LongIslandBounds, {bearing: 0});
				} else {
			        beforeMap.fitBounds(LongIslandBounds, {bearing: 0, padding: {top: 5, bottom:5, left: 350, right: 5}});
				    afterMap.fitBounds(LongIslandBounds, {bearing: 0, padding: {top: 5, bottom:5, left: 350, right: 5}});
				}
				break;
				case 'Brooklyn':
			    beforeMap.fitBounds(BrooklynBounds, {bearing: 0});
				afterMap.fitBounds(BrooklynBounds, {bearing: 0});
				break;
				case 'NYC':
			    beforeMap.fitBounds(NYCbounds, {bearing: 0});
				afterMap.fitBounds(NYCbounds, {bearing: 0});
				break;
				case 'NewNL':
			    beforeMap.fitBounds(NewNLbounds, {bearing: 0});
				afterMap.fitBounds(NewNLbounds, {bearing: 0});
				break;
				case 'NewEngland':
			    beforeMap.fitBounds(NewEnglandBounds, {bearing: 0});
				afterMap.fitBounds(NewEnglandBounds, {bearing: 0});
				break;
				case 'Manhattan':
			    beforeMap.fitBounds(ManhattanBounds, {bearing: na_bearing});
				afterMap.fitBounds(ManhattanBounds, {bearing: na_bearing});
				break;
				case 'World':
			    beforeMap.fitBounds(WorldBounds, {bearing: 0});
				afterMap.fitBounds(WorldBounds, {bearing: 0});
				break;
			}
		}
		
		function zoomtocenter(centerName){
			switch(centerName){
				case 'NA':
			    beforeMap.easeTo({center: na_center, zoom: na_zoom, bearing: na_bearing, pitch: 0});
			    afterMap.easeTo({center: na_center, zoom: na_zoom, bearing: na_bearing, pitch: 0});
				break;
				case 'Manatus Map':
			    beforeMap.easeTo({center: [-73.9512,40.4999], zoom: 9, bearing: -89.7, pitch: 0});
			    afterMap.easeTo({center: [-73.9512,40.4999], zoom: 9, bearing: -89.7, pitch: 0});
				break;
				case 'Original Grants':
			    beforeMap.easeTo({center: [-73.9759,40.7628], zoom: 12, bearing: -51.3, pitch: 0});
			    afterMap.easeTo({center: [-73.9759,40.7628], zoom: 12, bearing: -51.3, pitch: 0});
				break;
				case 'NYC plan':
			    beforeMap.easeTo({center: [-74.01046,40.70713], zoom: 15, bearing: -51.3, pitch: 0});
			    afterMap.easeTo({center: [-74.01046,40.70713], zoom: 15, bearing: -51.3, pitch: 0});
				break;
				case 'Ratzer Map':
			    beforeMap.easeTo({center: [-74.00282,40.69929], zoom: 12, bearing: -6.5, pitch: 0});
			    afterMap.easeTo({center: [-74.00282,40.69929], zoom: 12, bearing: -6.5, pitch: 0});
				break;
				case 'Long Island':
			    beforeMap.easeTo({center: [-73.094,41.1], zoom: 8, bearing: 0, pitch: 0});
			    afterMap.easeTo({center: [-73.094,41.1], zoom: 8, bearing: 0, pitch: 0});
				break;
				case 'NY Bay':
			    beforeMap.easeTo({center: [-73.9998,40.6662], zoom: 11, bearing: 0, pitch: 0});
			    afterMap.easeTo({center: [-73.9998,40.6662], zoom: 11, bearing: 0, pitch: 0});
				break;
				case 'Gravesend Map':
			    beforeMap.easeTo({center: [-73.97629,40.60105], zoom: 13, bearing: 0, pitch: 0});
			    afterMap.easeTo({center: [-73.97629,40.60105], zoom: 13, bearing: 0, pitch: 0});
				break;
				case 'Long Island 1873':
			    beforeMap.easeTo({center: [-73.2739,40.876], zoom: 8.6, bearing: 0, pitch: 0});
			    afterMap.easeTo({center: [-73.2739,40.876], zoom: 8.6, bearing: 0, pitch: 0});
				break;
				case 'Belgii Novi':
			    beforeMap.easeTo({center: [-74.39,40.911], zoom: 5.7, bearing: -7.2, pitch: 0});
			    afterMap.easeTo({center: [-74.39,40.911], zoom: 5.7, bearing: -7.2, pitch: 0});
				break;
				case 'New England':
			    beforeMap.easeTo({center: [-72.898,42.015], zoom: 7, bearing: 0, pitch: 0});
			    afterMap.easeTo({center: [-72.898,42.015], zoom: 7, bearing: 0, pitch: 0});
				break;
			}
		}

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

var grant_lots_click_ev = false,
	demo_taxlot_click_ev = false,
	dutch_grant_click_ev = false,
	native_groups_click_ev = false;

var afterMapPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false }),
    beforeMapPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false });

var coordinates = [];
var places_popup_html = "",
    settlements_popup_html = "";

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

var afterHighMapGrantLotPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 }),
    beforeHighMapGrantLotPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 });

var afterMapDutchGrantPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 }),
    beforeMapDutchGrantPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 });
	
	
/* REPLACE THIS */
var afterMapGravesendPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 }),
    beforeMapGravesendPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 });

var afterHighMapGravesendPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 }),
    beforeHighMapGravesendPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 });

var afterMapGravesendTwoPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 }),
    beforeMapGravesendTwoPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 });
/* REPLACE THIS */


var afterMapNativeGroupsPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 }),
    beforeMapNativeGroupsPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 });

var afterHighMapNativeGroupsPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 }),
    beforeHighMapNativeGroupsPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 });


var afterMapKarlPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 }),
    beforeMapKarlPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 });

var afterHighMapKarlPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 }),
    beforeHighMapKarlPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 });

var afterMapKarlTwoPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 }),
    beforeMapKarlTwoPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 });
	

var afterHighFarmPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 }),
    beforeHighFarmPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 });

var afterMapFarmPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 }),
    beforeMapFarmPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 });

var afterMapCurrLotsPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 }),
    beforeMapCurrLotsPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 5 });
	
var afterMapSettlementsPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false }),
    beforeMapSettlementsPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false });
	
var afterHighMapSettlementsPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false }),
    beforeHighMapSettlementsPopUp = new mapboxgl.Popup({ closeButton: false, closeOnClick: false });

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
	hoveredNativeGroupsIdRight = null,
	hoveredNativeGroupsIdLeft = null,
	hoveredKarlIdRight = null,
	hoveredKarlIdLeft = null,
	hoveredFarmsIdRight = null,
	hoveredFarmsIdLeft = null,
	hoveredCurrLotsIdRight = null,
	hoveredCurrLotsIdLeft = null,
	hoveredSettlementsIdRight = null,
	hoveredSettlementsIdLeft = null;
	
var clickedStateId = null,
    clickedSettlementsId = null;
	
var demo_layer_features = null;

beforeMap.on("load", function () {
	console.log("load");
	/*
	console.log(beforeMap.getBearing());
	console.log(beforeMap.getZoom());
	console.log(beforeMap.getCenter());
	*/
	init_zoom = beforeMap.getZoom();
	init_bearing = beforeMap.getBearing();
	init_center = beforeMap.getCenter();

	var sliderVal = moment($("#date").val()).unix();
	var yr = parseInt(moment.unix(sliderVal).format("YYYY"));
	var date = parseInt(moment.unix(sliderVal).format("YYYYMMDD"));
    
	
		// CLICK AND OPEN POPUP
		beforeMap.on('click', 'c7_dates-ajsksu-left', function (e) {
		          
            DemoClickHandle(e);
				  
		}).on('click', 'grant-lots-left' , function (e) {
				        
            GrantLotsHandle(e);
						
		}).on('click', 'grants1-5sp9tb-left' , function (e) {
      console.log(e);
			DutchGrantsClickHandle(e);
						
		}).on('click', 'native-groups-area-left' , function (e) {
					
		    NativeGroupsClickHandle(e);
						
		}).on('click', function () {
					
			DefaultHandle();
					
		});
	
	
});

afterMap.on("load", function () {
	//*A var sliderVal = $("#date").val();
	var sliderVal = moment($("#date").val()).unix();
	var yr = parseInt(moment.unix(sliderVal).format("YYYY"));
	var date = parseInt(moment.unix(sliderVal).format("YYYYMMDD"));
    
	
		// CLICK AND OPEN POPUP
		afterMap.on('click', 'c7_dates-ajsksu-right', function (e) {
			
            DemoClickHandle(e);
			
		}).on('click', 'grant-lots-right' , function (e) {
				        
            GrantLotsHandle(e);
						
		}).on('click', 'grants1-5sp9tb-right' , function (e) {
      console.log(e);
		    DutchGrantsClickHandle(e);
						
		}).on('click', 'native-groups-area-right' , function (e) {
					
		    NativeGroupsClickHandle(e);
						
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
		
		            if(!demo_taxlot_click_ev && !grant_lots_click_ev && !dutch_grant_click_ev && !native_groups_click_ev ) {
                        if(windoWidth > 637)
			                $('#view-hide-layer-panel').trigger('click');
					}
					
					demo_taxlot_click_ev = false;
					grant_lots_click_ev = false;
					dutch_grant_click_ev = false;
					native_groups_click_ev = false;
		
		}

			 

        function GrantLotsHandle(event) { 
		            
					var highPopUpHTML = createClickedFeaturePopup ('infoLayerGrantLotsPopUp', event, null);
          
          /*"<div class='infoLayerGrantLotsPopUp'>" +
									    event.features[0].properties.name + "<br>" +
										"<b>Start:</b> " + event.features[0].properties.day1 + ", " + event.features[0].properties.year1 + "<br>" +
										"<b>End:</b> " + event.features[0].properties.day2 + ", " + event.features[0].properties.year2 + "<br>" +
										//"<br>" +
										"<b>Lot Division: </b>" + event.features[0].properties.dutchlot +
									    "</div>";*/
		
						if(layer_view_flag) {
							if(grant_lots_view_id == event.features[0].id) {
								if(grant_lots_view_flag) {
							        $("#infoLayerGrantLots").slideUp(); 
									grant_lots_view_flag = false;
									if(afterHighGrantLotsPopUp.isOpen()) afterHighGrantLotsPopUp.remove();
									if(beforeHighGrantLotsPopUp.isOpen()) beforeHighGrantLotsPopUp.remove();
								} else {
									if(windoWidth > 637) {
									    //$("#infoLayerGrantLots").html(event.features[0].properties.name).slideDown();
									    buildGrantLotsPopUpInfo(event.features[0].properties);
									    console.log($(".infoLayerElem").first().attr("id"));
									    if($(".infoLayerElem").first().attr("id") != "infoLayerGrantLots")
									        $("#infoLayerGrantLots").insertBefore($(".infoLayerElem").first());
							            $("#infoLayerGrantLots").slideDown();
								    }
								    grant_lots_view_flag = true;
									afterHighGrantLotsPopUp.setLngLat(event.lngLat).setDOMContent(highPopUpHTML);
									if(!afterHighGrantLotsPopUp.isOpen()) afterHighGrantLotsPopUp.addTo(afterMap);
									beforeHighGrantLotsPopUp.setLngLat(event.lngLat).setDOMContent(highPopUpHTML);
									if(!beforeHighGrantLotsPopUp.isOpen()) beforeHighGrantLotsPopUp.addTo(beforeMap);
								}
							} else {
								if(windoWidth > 637) {
			                        //$("#infoLayerGrantLots").html(event.features[0].properties.name).slideDown();
								    buildGrantLotsPopUpInfo(event.features[0].properties);
								    console.log($(".infoLayerElem").first().attr("id") );
								    if($(".infoLayerElem").first().attr("id") != "infoLayerGrantLots")
								        $("#infoLayerGrantLots").insertBefore($(".infoLayerElem").first()); //($("#rightInfoBar"));
							        $("#infoLayerGrantLots").slideDown();
								}
								grant_lots_view_flag = true;
								afterHighGrantLotsPopUp.setLngLat(event.lngLat).setDOMContent(highPopUpHTML);
								if(!afterHighGrantLotsPopUp.isOpen()) afterHighGrantLotsPopUp.addTo(afterMap);
								beforeHighGrantLotsPopUp.setLngLat(event.lngLat).setDOMContent(highPopUpHTML);
								if(!beforeHighGrantLotsPopUp.isOpen()) beforeHighGrantLotsPopUp.addTo(beforeMap);
							}
							grant_lots_view_id = event.features[0].id;
						} else {
							//$("#infoLayerGrantLots").html(event.features[0].properties.name).slideDown();
							if(windoWidth > 637) {
							    buildGrantLotsPopUpInfo(event.features[0].properties);
							    console.log($(".infoLayerElem").first().attr("id") );
							    if($(".infoLayerElem").first().attr("id") != "infoLayerGrantLots")
							        $("#infoLayerGrantLots").insertBefore($(".infoLayerElem").first());
							    $("#infoLayerGrantLots").slideDown();
							    $('#view-hide-layer-panel').trigger('click');
							}
							grant_lots_view_id = null;
							afterHighGrantLotsPopUp.setLngLat(event.lngLat).setDOMContent(highPopUpHTML);
							if(!afterHighGrantLotsPopUp.isOpen()) afterHighGrantLotsPopUp.addTo(afterMap);
							beforeHighGrantLotsPopUp.setLngLat(event.lngLat).setDOMContent(highPopUpHTML);
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
						if(windoWidth > 637) {
						    buildPopUpInfo(event.features[0].properties);
						    if($(".infoLayerElem").first().attr("id") != "demoLayerInfo")
						        $("#demoLayerInfo").insertBefore($(".infoLayerElem").first());
					        $("#demoLayerInfo").slideDown();
						    
						    if(!layer_view_flag) $('#view-hide-layer-panel').trigger('click');
						}
						
						demo_layer_view_flag = true;
						
						beforeHighDemoPopUp
                        .setLngLat(coordinates)
                        .setHTML("<div class='demoLayerInfoPopUp'><b><h2>Taxlot: <a href='https://encyclopedia.nahc-mapping.org/taxlot/c7' target='_blank'>C7</a></h2></b></div>");
					    if(!beforeHighDemoPopUp.isOpen()) beforeHighDemoPopUp.addTo(beforeMap);
					
					    afterHighDemoPopUp
                        .setLngLat(coordinates)
						.setHTML("<div class='demoLayerInfoPopUp'><b><h2>Taxlot: <a href='https://encyclopedia.nahc-mapping.org/taxlot/c7' target='_blank'>C7</a></h2></b></div>");
					    if(!afterHighDemoPopUp.isOpen()) afterHighDemoPopUp.addTo(afterMap);
					}
					demo_taxlot_click_ev = true;
        }
	
	
	
	function DutchGrantsClickHandle(event) {
    console.log('DUTCH GRANTS');
    
    console.log(event);
	  // var highPopUpHTML = createHoverPopup('infoLayerDutchGrantsPopUp', event, 'Dutch grant lot');
    var highPopUpHTML = createClickedFeaturePopup ('infoLayerGrantLotsPopUp', event, null);
    
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
									if(windoWidth > 637) {
									    buildDutchGrantPopUpInfo(event.features[0].properties);
									    if($(".infoLayerElem").first().attr("id") != "infoLayerDutchGrants")
									        $("#infoLayerDutchGrants").insertBefore($(".infoLayerElem").first());
							            $("#infoLayerDutchGrants").slideDown();
								    }
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
									afterHighMapGrantLotPopUp.setLngLat(event.lngLat).setDOMContent(highPopUpHTML);
									if(!afterHighMapGrantLotPopUp.isOpen()) afterHighMapGrantLotPopUp.addTo(afterMap);
									beforeHighMapGrantLotPopUp.setLngLat(event.lngLat).setDOMContent(highPopUpHTML);
									if(!beforeHighMapGrantLotPopUp.isOpen()) beforeHighMapGrantLotPopUp.addTo(beforeMap);
								}
							} else {
								if(windoWidth > 637) {
								    buildDutchGrantPopUpInfo(event.features[0].properties);
								    if($(".infoLayerElem").first().attr("id") != "infoLayerDutchGrants")
								        $("#infoLayerDutchGrants").insertBefore($(".infoLayerElem").first());
							        $("#infoLayerDutchGrants").slideDown();
								}
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
                                afterHighMapGrantLotPopUp.setLngLat(event.lngLat).setDOMContent(highPopUpHTML);
								if(!afterHighMapGrantLotPopUp.isOpen()) afterHighMapGrantLotPopUp.addTo(afterMap);
								beforeHighMapGrantLotPopUp.setLngLat(event.lngLat).setDOMContent(highPopUpHTML);
							    if(!beforeHighMapGrantLotPopUp.isOpen()) beforeHighMapGrantLotPopUp.addTo(beforeMap);
							}
							dgrants_layer_view_id = event.features[0].id;
						} else {
							if(windoWidth > 637) {
							    buildDutchGrantPopUpInfo(event.features[0].properties);
							    if($(".infoLayerElem").first().attr("id") != "infoLayerDutchGrants")
							        $("#infoLayerDutchGrants").insertBefore($(".infoLayerElem").first());
							    $("#infoLayerDutchGrants").slideDown();
							    $('#view-hide-layer-panel').trigger('click');
							}
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
	


    function NativeGroupsClickHandle(event) {
		var highPopUpHTML = "";
		    
			if( (typeof taxlot_event_entities_info[event.features[0].properties.nid] == "undefined") || (event.features[0].properties.nid == "") ) {
		        highPopUpHTML = "<div class='infoLayerCastelloPopUp'><b>Name : </b>" + event.features[0].properties.name + "</div>";
	        } else {
				highPopUpHTML = "<div class='infoLayerCastelloPopUp'><b>Name : </b>" + ( taxlot_event_entities_info[event.features[0].properties.nid].name.length > 0 ? taxlot_event_entities_info[event.features[0].properties.nid].name : event.features[0].properties.name ) + "</div>";
			}
			
						if(layer_view_flag) {
							if(native_group_layer_view_id == event.features[0].id) {
								if(native_group_layer_view_flag) {
							        $("#infoLayerNativeGroups").slideUp(); 
									native_group_layer_view_flag = false;
									//*A#
							        afterMap.setFeatureState(
                                        { source: 'native-groups-area-right-highlighted', sourceLayer: 'long_island_indian_areas-3o4hr7', id: native_group_layer_view_id},
                                        { hover: false }
                                    );
									beforeMap.setFeatureState(
                                        { source: 'native-groups-area-left-highlighted', sourceLayer: 'long_island_indian_areas-3o4hr7', id: native_group_layer_view_id},
                                        { hover: false }
                                    );
									if(afterHighMapNativeGroupsPopUp.isOpen()) afterHighMapNativeGroupsPopUp.remove();
									if(beforeHighMapNativeGroupsPopUp.isOpen()) beforeHighMapNativeGroupsPopUp.remove();
								} else {
									if(windoWidth > 637) {
									    buildNativeGroupPopUpInfo(event.features[0].properties);
									    if($(".infoLayerElem").first().attr("id") != "infoLayerNativeGroups")
									        $("#infoLayerNativeGroups").insertBefore($(".infoLayerElem").first());
							            $("#infoLayerNativeGroups").slideDown();
								    }
								    native_group_layer_view_flag = true;
									//*A#
									afterMap.setFeatureState(
                                       { source: 'native-groups-area-right-highlighted', sourceLayer: 'long_island_indian_areas-3o4hr7', id: native_group_layer_view_id},
                                       { hover: true }
                                    );
									beforeMap.setFeatureState(
                                       { source: 'native-groups-area-left-highlighted', sourceLayer: 'long_island_indian_areas-3o4hr7', id: native_group_layer_view_id},
                                       { hover: true }
                                    );
									afterHighMapNativeGroupsPopUp.setLngLat(event.lngLat).setHTML(highPopUpHTML);
									if(!afterHighMapNativeGroupsPopUp.isOpen()) afterHighMapNativeGroupsPopUp.addTo(afterMap);
									beforeHighMapNativeGroupsPopUp.setLngLat(event.lngLat).setHTML(highPopUpHTML);
									if(!beforeHighMapNativeGroupsPopUp.isOpen()) beforeHighMapNativeGroupsPopUp.addTo(beforeMap);
								}
							} else {
								if(windoWidth > 637) {
								    buildNativeGroupPopUpInfo(event.features[0].properties);
								    if($(".infoLayerElem").first().attr("id") != "infoLayerNativeGroups")
								        $("#infoLayerNativeGroups").insertBefore($(".infoLayerElem").first());
							        $("#infoLayerNativeGroups").slideDown();
							    }
								native_group_layer_view_flag = true;
								//*A#
								afterMap.setFeatureState(
                                    { source: 'native-groups-area-right-highlighted', sourceLayer: 'long_island_indian_areas-3o4hr7', id: native_group_layer_view_id},
                                    { hover: false }
                                );
							    afterMap.setFeatureState(
                                    { source: 'native-groups-area-right-highlighted', sourceLayer: 'long_island_indian_areas-3o4hr7', id: event.features[0].id},
                                    { hover: true }
                                );
								beforeMap.setFeatureState(
                                    { source: 'native-groups-area-left-highlighted', sourceLayer: 'long_island_indian_areas-3o4hr7', id: native_group_layer_view_id},
                                    { hover: false }
                                );
							    beforeMap.setFeatureState(
                                    { source: 'native-groups-area-left-highlighted', sourceLayer: 'long_island_indian_areas-3o4hr7', id: event.features[0].id},
                                    { hover: true }
                                );
                                afterHighMapNativeGroupsPopUp.setLngLat(event.lngLat).setHTML(highPopUpHTML);
								if(!afterHighMapNativeGroupsPopUp.isOpen()) afterHighMapNativeGroupsPopUp.addTo(afterMap);
								beforeHighMapNativeGroupsPopUp.setLngLat(event.lngLat).setHTML(highPopUpHTML);
							    if(!beforeHighMapNativeGroupsPopUp.isOpen()) beforeHighMapNativeGroupsPopUp.addTo(beforeMap);
							}
							native_group_layer_view_id = event.features[0].id;
						} else {
							if(windoWidth > 637) {
							    buildNativeGroupPopUpInfo(event.features[0].properties);
							    if($(".infoLayerElem").first().attr("id") != "infoLayerNativeGroups")
							        $("#infoLayerNativeGroups").insertBefore($(".infoLayerElem").first());
							    $("#infoLayerNativeGroups").slideDown();
							    $('#view-hide-layer-panel').trigger('click');
							}
							//*A#
							afterMap.setFeatureState(
                                { source: 'native-groups-area-right-highlighted', sourceLayer: 'long_island_indian_areas-3o4hr7', id: native_group_layer_view_id},
                                { hover: false }
                            );
							afterMap.setFeatureState(
                                { source: 'native-groups-area-right-highlighted', sourceLayer: 'long_island_indian_areas-3o4hr7', id: event.features[0].id},
                                { hover: true }
                            );
							beforeMap.setFeatureState(
                                { source: 'native-groups-area-left-highlighted', sourceLayer: 'long_island_indian_areas-3o4hr7', id: native_group_layer_view_id},
                                { hover: false }
                            );
							beforeMap.setFeatureState(
                                { source: 'native-groups-area-left-highlighted', sourceLayer: 'long_island_indian_areas-3o4hr7', id: event.features[0].id},
                                { hover: true }
                            );
							afterHighMapNativeGroupsPopUp.setLngLat(event.lngLat).setHTML(highPopUpHTML);
							if(!afterHighMapNativeGroupsPopUp.isOpen()) afterHighMapNativeGroupsPopUp.addTo(afterMap);
							beforeHighMapNativeGroupsPopUp.setLngLat(event.lngLat).setHTML(highPopUpHTML);
							if(!beforeHighMapNativeGroupsPopUp.isOpen()) beforeHighMapNativeGroupsPopUp.addTo(beforeMap);
							native_group_layer_view_id = event.features[0].id;
							//native_group_layer_view_id = null;
					    } 
						
						native_groups_click_ev = true;
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
	
	beforeMap.setFilter("c7_dates-ajsksu-left", dateFilter);
	afterMap.setFilter("c7_dates-ajsksu-right", dateFilter);
	
	beforeMap.setFilter("grant-lots-lines-left", dateFilter);
	afterMap.setFilter("grant-lots-lines-right", dateFilter);

	
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
	addGrantLotsLinesBeforeLayers(date);
	addLongIslandNativeGroupsBeforeLayers();
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
	addGrantLotsLinesAfterLayers(date);
	addLongIslandNativeGroupsAfterLayers();
});function getInfoText(modal_header_text, modal_content_html) {
	$.ajax({
		url: 'https://encyclopedia.nahc-mapping.org/info-text-export',
		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		type: 'get',
		dataType: 'json',
		data: {}
	}).done(function (data) {
		if (data.length > 0) {
			for (let i = 0; i < data.length; i++) {
				if (data[i].id.length > 0) {
					modal_header_text[data[i].id] = data[i].title.replace(/&amp;/g, '&');
					modal_content_html[data[i].id] = data[i].body;
				}
			}
		}
	}).fail(function (xhr, textStatus, errorThrown) {
		console.warn("jQuery AJAX request  ERROR !!!");
		console.log(xhr.responseText);
		console.log(textStatus);
	});
}function buildPopUpInfo(props) {
				var popup_html =

					///////
					//TITLE
					///////
					"<b><h2>Demo Taxlot: <a href='https://encyclopedia.nahc-mapping.org/taxlot/c7' target='_blank'>C7</a></h2></b>" +
                    // CAN'T GET THE TAXLOT LINK TO WORK: <a href='https://encyclopedia.nahc-mapping.org/taxlot/c7'>
					////////////////
					//PROPERTY TYPE
					////////////////
					"<b>Property Type: </b>" +
					"House" +


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
					'<b> <h3><a href="https://encyclopedia.nahc-mapping.org/taxlot-events" target="_blank">SEE ALL TAXLOT EVENTS</a></h3></b>'

//NEED TO MAKE THIS OPEN IN SEPARATE TAB!!
;

//console.log(popup_html);
$("#demoLayerInfo").html(popup_html);

}

function buildGrantLotsPopUpInfo(props) {

				var popup_html =
				    `<h3>${props.title}</h3><hr>` +
					"<br>" +
					"<b>Original Dutch Grant: </b>" + props.Lot +
					"<br>" +
					"<b>Lot Division: </b>" + props.dutchlot +
				    "<br>" +
					"<b>Castello Taxlot (1660): </b>" + props.castello +
					"<br>" +
				    "<br>" +
				    "<b>Ownership:</b> " + props.name + "<br>" +
				    "<b>From:</b> " + props.from +
					"<br>" +
				    "<br>" +
					"<b>Start:</b> " + props.day1 + ", " + props.year1 + "<br>" +
					"<b>End:</b> " + props.day2 + ", " + props.year2 + "<br>" +
				    "<br>" +
				    "<b>Description:</b> " + "<br>" +
					props.descriptio + "<br><br>"
				;
				//console.log(props);
    
	$("#infoLayerGrantLots").html(popup_html);

}



function buildDutchGrantPopUpInfo(props) {
	        var popup_html = "";
			console.log(props);
	    console.log(dutch_grant_lots_info[props.Lot]);
			if( typeof dutch_grant_lots_info[props.Lot] == "undefined" ) {
			    popup_html = 
				    "<h3>Dutch Grant</h3><hr>" +
				    props.name + "<br>" +
				    "<b>Dutch Grant Lot:</b> <a href='https://encyclopedia.nahc-mapping.org/grantlot/" + props.Lot + "' target='_blank'>" + props.Lot + "</a><br>" +
					"<br>" +
					"<b>Start:</b> <i>" + props.day1 + " " + props.year1 + "</i><br>" +
					"<b>End:</b> <i>" + props.day2 + " " + props.year2 + "</i><br>" +
					"<br>" +
					"<b>Description (partial):</b>" +
					"<br>" +
					props.descriptio + "<br><br>"
				;
			} else {
				var builds_imgs = "";
				if(dutch_grant_lots_info[props.Lot].builds.length > 0) {
					for(let i = 0; i < dutch_grant_lots_info[props.Lot].builds.length; i++){
						//builds_imgs += "<img src='" + dutch_grant_lots_info[props.Lot].builds[i].url + "'  width='258' alt='" + dutch_grant_lots_info[props.Lot].builds[i].alt  + "' title='" + dutch_grant_lots_info[props.Lot].builds[i].title  + "'><br><br>";
					        builds_imgs += "<img src='https://nahc-mapping.org" + dutch_grant_lots_info[props.Lot].builds[i] + "'  width='258' ><br><br>";
					}
				}
				popup_html = 
				    "<h3>Dutch Grant</h3><hr>" +
				    "<br>" +
				    "<b>Dutch Grant Lot:</b> <a href='https://encyclopedia.nahc-mapping.org/grantlot/" + props.Lot + "' target='_blank'>" + props.Lot + "</a><br>" +
					"<br>" +
					"<b>To Party:</b>" + ( dutch_grant_lots_info[props.Lot].to_party.length > 0 ? "<br>" : "" ) + "<i>" + dutch_grant_lots_info[props.Lot].to_party + "</i><br>" +
					"<br>" +
					"<b>From Party:</b>" + ( dutch_grant_lots_info[props.Lot].from_party.length > 0 ? "<br>" : "" ) + "<i>" + dutch_grant_lots_info[props.Lot].from_party + "</i><br>" +
					"<br>" +
					"<b>Start:</b> <i>" + dutch_grant_lots_info[props.Lot].start + "</i><br>" +
					"<b>End:</b> <i>" + dutch_grant_lots_info[props.Lot].end + "</i><br>" +
					"<br>" +
					"<b>Description:</b>" +
					"<br>" +
					"<i>" + dutch_grant_lots_info[props.Lot].descr + "</i><br><br>" +
                                        builds_imgs
				        ;
			}
				
    
	$("#infoLayerDutchGrants").html(popup_html);

}



/*REPLACE THIS*/
function buildGravesendPopUpInfo(props) {
	        var popup_html = "";

			    popup_html = 
				    "<h3>Boundaries</h3><hr>" +
				    //"<b>Name:</b> <i>" + props.Name + "</i><br>" +
					"<b>" + props.Name + "</b>" +
					//"<a href = 'https://encyclopedia.nahc-mapping.org/place/gravesend' target='_blank'>Gravesend</a>" +
					"<br><br>" +
					"<b>Date:</b> <i>" + props['Date Text'] + "</i>" +
					"<br><br>" +
					"<i>" + props['Groups Dyl'] + "</i>" +
					"<br><br>"
				;



    
	$("#infoLayerGravesend").html(popup_html);

}
/*REPLACE THIS*/



function buildNativeGroupPopUpInfo(props) {
	        var popup_html = "<h3>Long Island Tribes</h3><hr>";
                
			if( (typeof taxlot_event_entities_info[props.nid] == "undefined") || (props.nid == "") ) {
			    popup_html += "<b>" + props.name + "</b>";
			} else {
				popup_html += "<b>" + ( taxlot_event_entities_info[props.nid].name_html.length > 0 ? taxlot_event_entities_info[props.nid].name_html : props.name ) + "</b>" +
				              "<br><br>" +
							  "<b>Description:</b>" +
					          "<br>" +
					          taxlot_event_entities_info[props.nid].descr + "<br><br>"
							  ;
			}
			
			popup_html += "<br><br>";
			
			console.log(props);

	$("#infoLayerNativeGroups").html(popup_html);

}




function buildKarlPopUpInfo(props) {
	        var popup_html = "";
            //var ref_name = props.Name.replace(/\s+/g, '');
			//var ref_name = props.enc_name.replace(/\s+/g, '');
			var node_id = props.node_id.replace(/\/node\//g, '');
			
			    popup_html = 
				    "<h3>Long Island Towns</h3><hr>";
				    //"<b>Name:</b> <i>" + props.Name + "</i><br>" 
					//if( typeof settlements_info[ref_name] == "undefined" ) {
					if( typeof settlements_info[node_id] == "undefined" ) {
						//popup_html += "<b>" + props.Name + "</b>";
						popup_html += "<b>" + props.enc_name + "</b>";
				    } else {
						//popup_html += "<b>" + settlements_info[ref_name].name + "</b>";
						popup_html += "<b>" + settlements_info[node_id].name + "</b><br>" +
						              "<b>Date:</b> <i>" + settlements_info[node_id].date + "</i>" +
									  "<br><br>" +
					                  "<b>Description:</b>" +
					                  "<br>" +
					                  "<i>" + settlements_info[node_id].descr + "</i>";
									  
					}
					
					
				popup_html +=	
					"<br>";
					// +
					//props.TownStart + "-" + props.TownEnd +
					//"<a href = 'https://encyclopedia.nahc-mapping.org/place/karl' target='_blank'>Karl</a>" +
					/*
					"<br><br>" +
					props.YearDisp +
					"<br>" +
					props.Event
					*/
				;

    console.log(props);

    
	$("#infoLayerKarl").html(popup_html);

}


function buildFarmsPopUpInfo(props) {
	        var popup_html = "";
			//console.log(props);

			    popup_html = 
				    "<h3>Original Grants &amp; Farms</h3><hr>" +
					"<br>" +
					"<b>To:</b> <i>" + props.To + "</i><br>" +
					"<b>Date:</b> <i>" + props.Date + "</i><br>" +
					"<br>" 
				;
				
			
				
    
	$("#infoLayerFarms").html(popup_html);

}


function buildCurrLotsPopUpInfo(props) {
				var popup_html = 
					"<h3>Current Lot</h3><hr>" +
					"<b>Owner:</b>" + "<br>" + props.OwnerName + "<br><br>" +
					"<b>Address:</b>" + "<br>" + props.Address + "<br><br>" +
					"<b>Lot:</b>" + "<br>" + props.BBL + "<br><br>"
				;




				//console.log(props);
    
	$("#infoLayerCurrLots").html(popup_html);

}




/**
 * @param {Object|string} items What you want to send to the server.
 * @param {string} route The route to the server (URL)
 * @param {string} callback The HTTP response from the server,
 * @description Function to handle POST requests
 */
function xhr (items, route, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', route);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(items));

  if (xhr.readyState === 1) {
    console.log(`blocking ${route}`);
    document.body.style.pointerEvents = 'none';
  }

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      if (xhr.responseText) {
        console.log(`response for route ${route} should have been received`);
        callback(xhr.responseText);
        document.body.style.pointerEvents = '';
        /* To add a loading gif uncomment the following, add a div that has a gif and obscures the screen */
        // document.querySelector('.loadingGif').style.display = 'none';
      }
    }
  };
}

/**
 * @param {Object|string} items What you want to send to the server.
 * @param {string} route The route to the server (URL)
 * @param {string} callback The HTTP response from the server,
 * @description Function to handle GET requests. 
 */
function xhrget (items, route, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', route);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.timeout = 1000;
  xhr.send(encodeURI(items));
  xhr.ontimeout = (e) => {
    callback('404');
  };
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      callback(xhr.responseText);
    }
    if (xhr.status >= 500 && xhr.status < 600) {
      callback('An error occurred, please wait a bit and try again.');
    }
    if (xhr.status === 404) {
      callback('404');
    }
  };
}
const dutchLots = () => {
  xhrget ({}, '/dutchLots', (response) => {
    return JSON.parse(response);
  });
};
/**
  * Onload event
  * @event DOMContentLoaded
  * @fires MapConstructor#generateMap
  */
  window.addEventListener('DOMContentLoaded', (event) => {
    const historyMap = new MapConstructor('#map', '80vh')
      .generateMap()
      .locateOnClick();
  });
/**
 * 
 * @param {(Object|string)} baseHTMLElement A HTML element onto which to render 
 * the map or a query selector of the HTML element you want to render the 
 * map on.
 * @param {string} height CSS property, if none is set it will inherit the height 
 * of the parent element.
 */

function MapConstructor (baseHTMLElement, height) { 
  let map; 
  // contains the reference to the individual markers:
  const markerTracker = [];  
  // contains the type of marker to filter by type or theme:
  const indexByType = [];

  if (typeof baseHTMLElement === 'string') {
    baseHTMLElement = document.querySelector(baseHTMLElement);
  }

  if (height) {
    baseHTMLElement.style.height = height;
  } else {
    baseHTMLElement.style.height = 'inherit';
  }
  /**
   * @type {function}
   * @fires L.map (leaflet.js or mapbox.js)
   * @returns itself
   * @description Generates a map passed initially to the constructor and returns itself.
   * Typically the first function to be called in the map constructor.
   */

    this.generateMap = () => {
      const mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
      const ocmlink = '<a href="http://thunderforest.com/">Thunderforest</a>';


      // https://tile.thunderforest.com/static/transport/40.72,-73.99,11/200x200.png?apikey=ac75df8345724f518ad6b483690151f8
      // http://a.tile.thunderforest.com/cycle/11/602/769.png?apikey=ac75df8345724f518ad6b483690151f8
      map = L.map(baseHTMLElement, {
        layers: [
          L.tileLayer('http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=ac75df8345724f518ad6b483690151f8', {
            attribution: `&copy; ${mapLink} Contributors & ${ocmlink}`,
          })],
        preferCanvas: true,
        center: [40.72438847512333, -73.99464442052532],
        zoom: 11
      });
      L.control.scale().addTo(map).setPosition('bottomright');
      return this;
    }

  /**
   * @param {function} save function to call on click.
   * @calls makeClientMarker
   * @returns itself
   */
  this.locateOnClick = () => {
    const innerThis = this;
    map.addEventListener('click', function onLocationFound(e) {
      innerThis.makeClientMarker([e.latlng.lat, e.latlng.lng]);
    });
    return this;
  };

  /**
   * @param {Object[]} Array with lat lng at 0 and 1
   * @param {string} Text to bind to a marker
   * @description latLng, latitude and logitude in the form [lat, lng],
   * it also swaps the marker's location.
   * @returns itself
   */
   this.makeClientMarker = (latLng) => {
    const marker = L.marker(latLng, {
      zIndexOffset: 1000
    });

    const popUpContent = this.generateAddLayerForm();

    marker.bindPopup(L.popup({ autoPan: false }).setContent(popUpContent)).openPopup();
    if (indexByType.includes('clientMarker')) {
      const index = indexByType.indexOf('clientMarker');
      markerTracker[index].providerMarkers[0].setLatLng(latLng);
      map.setView(latLng, 11);
    } else {
      markerTracker.push({type: 'clientMarker', providerMarkers: [marker]});
      indexByType.push('clientMarker');
      marker.addTo(map);
      map.setView(latLng, 11);
    }
    return this;
  };

  this.generateAddLayerForm = () => {
    const base = document.createElement('div');
    const fields = ['Name', 'Source name', 'ID']
    function textInputGenerator (fieldName) {          
      const nameLabel = document.createElement('label');
      nameLabel.htmlFor = fieldName;
      nameLabel.innerHTML = `${fieldName}: `;
      base.appendChild(nameLabel);

      const name = document.createElement('input');
      name.setAttribute('type', 'text');
      name.id = fieldName;
      base.appendChild(name);

      const br = document.createElement('br');
      base.appendChild(br);
    }

    const types = ['ImageOverlay', 'VideoOverlay', 'TileLayer'];
    dropDownGenerator(types);
    
    function dropDownGenerator (options) {
      const select = document.createElement('select');
      base.appendChild(select);
      options.forEach(value => {
        const option = document.createElement('option');
        option.setAttribute('value', value);
        option.textContent = value;
        select.appendChild(option);
      });

    }

    fields.forEach(fieldName => {
      textInputGenerator (fieldName);
    });
    
    return base;
  };

};
