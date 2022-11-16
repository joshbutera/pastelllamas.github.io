function drawBarChart(dataset) {
   year = 2015
   color_filter = 'gdp_per_capita'
   bar_filter = "happiness_score"
   dataset[year].sort((a, b) => b[bar_filter] - a[bar_filter])
   var colorScale = d3.scaleLinear().domain([d3.min(dataset[year], d => d[color_filter]), d3.max(dataset[year], d => d[color_filter])]).range(['#E29578', '#006D77'])
   var xScale = d3.scaleLinear().domain([0, d3.max(dataset[year], d => d[bar_filter])] ).range([0, getWidth()-margin.right-margin.left])
   var yScale = d3.scaleBand().domain(d3.map(dataset[year], d => d["Country"]) ).range([0, 1800-margin.top-margin.bottom]).padding(0.4)

   var xAxis = d3.axisBottom()
   .scale(xScale); 
   var yAxis = d3.axisLeft()
   .scale(yScale);

   bar_chart.append("g")
   .attr("class", "axis")
   .attr("transform", "translate(0, " + (1800-margin.top-margin.bottom) + ")")
   .call(xAxis)

   bar_chart.append("g")
   .attr("class", "axis")
   .call(yAxis)

   d3.selectAll(".axis > g").remove()

   bar_chart.selectAll("rect")
      .data(dataset[year])
      .enter()
         .append("rect")
         .attr("x", 0)
         .attr("y", d => yScale(d["Country"]))
         .attr("width", d => xScale(d[bar_filter]))
         .attr("height", yScale.bandwidth())
         .attr("border", "1px solid black")
         .attr("fill", d => colorScale(d[color_filter]))
}
