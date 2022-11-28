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

function calcFill(d, yearVal, countryColorScale) {
   var avg = d.happiness_score_avg;
   var allScores = d.happiness_scores;

   if (avg == 0.00) return 'rgba(175, 175, 175, 0.10';

   if (yearVal == 'All Years') {
      return countryColorScale(avg);
   } else {
      var cur = Math.abs(2015 - yearVal);
      return countryColorScale(allScores[cur]);
   }
}

function drawMap(countries, year) {
   countries.features[238].properties.ADMIN = 'United States'; // rename USA to match in both datasets

   var max = -1.0;
   var min = 100.0; 

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

      var curMin = d3.min(happiness_scores);
      var curMax = d3.max(happiness_scores);

      if (curMin != 0 && curMin < min) min = curMin;
      if (curMax > max) max = curMax;

      countries.features[i].happiness_scores = happiness_scores; 
      min = Number(min)
      max = Number(max)
   }

   const countryColorScale = d3.scaleLinear()
      .domain([min, max])
      .range([min_color, max_color]);

   // draw world map
   const projection = d3.geoMercator();
   
   const pathGenerator = d3.geoPath()
      .projection(projection);

   world_map.selectAll(".country")
      .data(countries.features)
      .join("path")
      .attr("class", "country")
      .attr("fill", d => calcFill(d, year, countryColorScale))
      .attr("d", feature => pathGenerator(feature));

   //Append a defs (for definition) element to your SVG
   var defs = world_map.append("defs");

   //Append a linearGradient element to the defs and give it a unique id
   var linearGradient = defs.append("linearGradient")
      .attr("id", "linear-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%")
   
   linearGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", max_color); //light blue
  
   //Set the color for the end (100%)
   linearGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", min_color); //dark blue
   
   world_map.append("rect")
      .attr("width", 20)
      .attr("height", 300)
      .attr("transform", "translate(" + 1000 + "," + 0 + ")")
      .style("fill", "url(#linear-gradient)");
   
   world_map.append("text")
      .attr("x", 0)
      .attr("y", -1030)
      .attr("transform", "rotate(90)")
      .text("Most Happy")
   
   world_map.append("text")
      .attr("x", 210)
      .attr("y", -980)
      .attr("transform", "rotate(90)")
      .text("Least Happy")
}