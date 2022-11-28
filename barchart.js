function drawBarChart(dataset) {
   year = 2015
   color_filter = 'gdp_per_capita'
   bar_filter = "happiness_score"
   dataset[year].sort((a, b) => a[bar_filter] - b[bar_filter])
   var colorScale = d3.scaleLinear().domain([d3.min(dataset[year], d => d[color_filter]), d3.max(dataset[year], d => d[color_filter])]).range([min_color, max_color])
   var yScale = d3.scaleLinear().domain([0, d3.max(dataset[year], d => d[bar_filter])] ).range([600 - margin.top - margin.bottom, 0])
   var xScale = d3.scaleBand().domain(d3.map(dataset[year], d => d["Country"]) ).range([0, getWidth()-margin.right-margin.left]).padding(0.4)

   var xAxis = d3.axisBottom()
   .scale(xScale); 
   var yAxis = d3.axisLeft()
   .scale(yScale);

   bar_chart.append("g")
   .attr("class", "axis")
   .attr("transform", "translate(0, " + (600-margin.top-margin.bottom) + ")")
   .call(xAxis)

   bar_chart.append("g")
   .attr("class", "axis")
   .call(yAxis)

   d3.selectAll(".axis > g").remove()

   bar_chart.selectAll("rect")
      .data(dataset[year])
      .enter()
         .append("rect")
         .attr("x", d => xScale(d.Country))
         .attr("y", d => yScale(d[bar_filter]))
         .attr("width", xScale.bandwidth())
         .attr("height", d => 600-margin.top-margin.bottom - yScale(d[bar_filter]))
         .attr("border", "1px solid black")
         .attr("fill", d => colorScale(d[color_filter]))
}
