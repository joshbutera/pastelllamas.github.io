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

function calcFill(yearVal, avg, allScores, countryColorScale) {
   if (yearVal == 'All Years') {
      return countryColorScale(avg);
   } else {
      var cur = Math.abs(2015 - yearVal);
      return countryColorScale(allScores[cur]);
   }
}

function drawMap(countries, year) {
   console.log(year)

   countries.features[238].properties.ADMIN = 'United States'; // rename USA to match in both datasets

   // add happiness score to geojson data
   for (var i = 0; i < countries.features.length; i++) {
      var country = countries.features[i].properties.ADMIN;
      var avg = calcAvgScore(country);
      countries.features[i].happiness_score_avg = avg; // add average happiness score over all years

      // add array of happiness score for each year for this country
      var happiness_scores = [];

      for (var y = 2015; y <= 2020; y++) {
         var cur = dataset[y];
   
         for (var j = 0; j < 132; j++) {
            if (cur[j].Country == country) {
               happiness_scores.push(cur[j].happiness_score);
            }
         }
      }

      countries.features[i].happiness_scores = happiness_scores; 
   }

   // create color scale
   var countriesSubset = countries.features.filter(d => d.happiness_score_avg != 0.0); // remove countries with no happiness score

   const minHappiness = d3.min(countriesSubset, d => d.happiness_score_avg);
   const maxHappiness = d3.max(countriesSubset, d => d.happiness_score_avg);

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
      //.attr("fill", d => countryColorScale(d.happiness_score_avg))
      .attr("fill", d => calcFill(year, d.happiness_score_avg, d.happiness_scores, countryColorScale))
      .attr("d", feature => pathGenerator(feature));
}