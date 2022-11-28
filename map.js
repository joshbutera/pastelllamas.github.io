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

   if (avg == 0.00) return 'Black';

   if (yearVal == 'All Years') {
      return countryColorScale(avg);
   } else {
      var cur = Math.abs(2015 - yearVal);
      return countryColorScale(allScores[cur]);
   }
}

function getScore(i, yearVal) {
   var avg = i.happiness_score_avg;
   var allScores = i.happiness_scores;

   if (yearVal == 'All Years') {
      return avg.toFixed(2);
   } else {
      var cur = Math.abs(2015 - yearVal);
      return allScores[cur].toFixed(2);
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
   }

   const countryColorScale = d3.scaleLinear()
      .domain([min, max])
      .range([min_color, max_color]);

   // draw world map
   const projection = d3.geoMercator();
   
   const pathGenerator = d3.geoPath()
      .projection(projection);

   // create a tooltip
   var tooltip = d3.select("#map")
      .append("div")
      .style("width", "auto")
      .style("height", "auto")
      .style("background-color", "white")
      .style("padding", "5px")
      .style("border", "solid 1px black")
      .style("border-radius", "5px")
      .style("position", "absolute")
      .style("visibility", "hidden");

   world_map.selectAll(".country")
      .data(countries.features)
      .join("path")
      .attr("class", "country")
      .attr("fill", d => calcFill(d, year, countryColorScale))
      .attr("d", feature => pathGenerator(feature))
      .on("mouseover", (d, i) => tooltip.style("visibility", "visible").style("top", d.pageY + "px").style("left", d.pageX + "px").text(i.properties.ADMIN + ", Happiness Score: " + getScore(i, year)))
      .on("mouseout", d => tooltip.style("visibility", "hidden")); 
}
