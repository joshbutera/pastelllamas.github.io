function calcAvgScore(country) {
   var sum = 0.0; 
   var found = false; 

   for (var i = 2015; i <= 2020; i++) {
      var cur = dataset[i];

      for (var j = 0; j < 132; j++) {
         if (cur[j].Country == country) {
            found = true; 
            sum += parseFloat(cur[j].happiness_score)
         }
      }
   }

   if (found) {
      return sum / 6; 
   } else {
      return 0.0; 
   }
}

function drawMap(countries) {
   countries.features[238].properties.ADMIN = 'United States'; // rename USA to match in both datasets

   // add happiness score to geojson data
   for (var i = 0; i < countries.features.length; i++) {
      var avg = calcAvgScore(countries.features[i].properties.ADMIN);
      countries.features[i].happiness_score = avg; 
   }

   // create color scale
   var countriesSubset = countries.features.filter(d => d.happiness_score != 0.0); // remove countries with no happiness score

   const minHappiness = d3.min(countriesSubset, d => d.happiness_score);
   const maxHappiness = d3.max(countriesSubset, d => d.happiness_score);

   const countryColorScale = d3.scaleLinear()
      .domain([minHappiness, maxHappiness])
      .range([min_color, max_color]);

   // draw world map
   const projection = d3.geoMercator();
   
   const pathGenerator = d3.geoPath()
      .projection(projection);

   world_map.selectAll(".country")
      .data(countries.features)
      .join("path")
      .attr("class", "country")
      .attr("fill", d => countryColorScale(d.happiness_score))
      .attr("d", feature => pathGenerator(feature));
}