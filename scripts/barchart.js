function drawBarChart(barVar, dataset) {
   var year = 2015
   var color_filter = "happiness_score"
   var bar_filter = variableOptions[barVar]
   var t = d3.transition()
      .duration(500);

   margin.right = 20
   dataset[year].sort((a, b) => a[bar_filter] - b[bar_filter])
   
   var colorScale = d3.scaleLinear().domain([d3.min(dataset[year], d => d[color_filter]), d3.max(dataset[year], d => d[color_filter])]).range([min_color, max_color])
   var yScale = d3.scaleLinear().domain([0, d3.max(dataset[year], d => d[bar_filter])] ).range([600 - margin.top - margin.bottom, 0])
   var xScale = d3.scaleBand().domain(d3.map(dataset[year], d => d["Country"]) ).range([0, getWidth()-100-margin.right-margin.left]).padding(0.4)

   var xAxis = d3.axisBottom()
   .scale(xScale); 
   var yAxis = d3.axisLeft()
   .scale(yScale);

   d3.selectAll('.bar-axis').remove()
   bar_chart.append("g")
      .attr("class", "bar-axis")
      .attr("transform", "translate(0, " + (600-margin.top-margin.bottom) + ")")
      .call(xAxis)

   d3.select('#bar-x-axis-label').remove()
   bar_chart.append("g")
      .attr('id', 'bar-x-axis-label')
      .attr('transform', 'translate(' + ((width)/2) + ', ' + (520+35) + ')')
      .append("text")
      .attr("text-anchor", "middle")
      .text(barVar);

   d3.selectAll('.bar-y-axis').remove()
   bar_chart.append("g")
   .attr("class", "bar-y-axis")
   .call(yAxis)

   d3.selectAll(".bar-axis > g").remove()

   bar_chart.selectAll("rect")
      .data(dataset[year])
      .join(
         enter => enter.append('rect')
            .attr("x", d => xScale(d.Country))
            .attr("y", d => yScale(d[bar_filter]))
            .attr("width", xScale.bandwidth())
            .attr("height", d => 600-margin.top-margin.bottom - yScale(d[bar_filter]))
            .attr("border", "1px solid black")
            .attr("fill", d => colorScale(d[color_filter])),
         update => update
            .transition(t)
            .attr("x", d => xScale(d.Country))
            .attr("height", d => 600-margin.top-margin.bottom - yScale(d[bar_filter]))
            .attr("y", d => yScale(d[bar_filter]))
            .attr("fill", function(d) { 
               console.log('test')
               return colorScale(d[color_filter])
            }),
         exit => exit
            .remove()

      )
      .enter()
         .append("rect")

   //Append a defs (for definition) element to your SVG
   d3.selectAll("#defs").remove()
   var defs = bar_chart_legend.append("defs")
      .attr("id", "bar-defs");

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
   
   d3.select("#bar-legend").remove()
   bar_chart_legend.append("rect")
      .attr("id", "bar-legend")
      .attr("width", 20)
      .attr("height", 300)
      .attr("transform", "translate(" + 25 + "," + 0 + ")")
      .style("fill", "url(#linear-gradient)");
   
   bar_chart_legend.append("text")
      .attr("x", 0)
      .attr("y", -55)
      .attr("transform", "rotate(90)")
      .text("Most Happy")
   
   bar_chart_legend.append("text")
      .attr("x", 210)
      .attr("y", -5)
      .attr("transform", "rotate(90)")
      .text("Least Happy")
   }
   