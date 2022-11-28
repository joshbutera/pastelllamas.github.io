function drawScatterPlot(scatterVar, dataset) {
   var year = 2015
   var y_selection = scatterVar
   var x_slection = 'happiness_score'
   var t = d3.transition()
      .duration(500);
   var points = d3.map(dataset[year], function(d) { 
      return {
         x: d[x_slection],
         y: d[y_selection],
         'country': d['Country']
      }
   })

   var xScale = d3.scaleLinear().domain([0, d3.max(points, d => d.x)] ).range([0, width])
   var yScale = d3.scaleLinear().domain([0, d3.max(points, d => d.y)] ).range([height, 0])

   var linearRegression = ss.linearRegression(points.map(d => [Number(d.x), Number(d.y)]))
   var linearRegressionLine = ss.linearRegressionLine(linearRegression)
   var x_intercept =  d3.max([Number(points[0].x) - (linearRegressionLine( Number(points[0].x)) / linearRegression.m), 0])

   const xCoordinates = [x_intercept, d3.max(points, d=>d.x)];
   
   var regressionPoints = xCoordinates.map(d => ({
      x: d,
      y: linearRegressionLine(d)
   }));

   d3.selectAll('.scatter-axis').remove()
   var xAxis = d3.axisBottom()
      .scale(xScale); 
   var yAxis = d3.axisLeft()
      .scale(yScale);

   scatter_plot.append("g")
      .attr("class", "scatter-axis")
      .attr("transform", "translate(0, " + height + ")")
      .call(xAxis)

   scatter_plot.append("g")
      .attr("class", "scatter-axis")
      .call(yAxis)

   d3.selectAll(".scatter-axis > g").remove()
   d3.select("#scatter-x-axis-label").remove()
   
   scatter_plot.append("g")
      .attr('id', 'scatter-x-axis-label')
      .attr('transform', 'translate(' + (width/2) + ', ' + (height+35) + ')')
      .append("text")
      .attr("text-anchor", "middle")
      .text("Happiness Score");

   scatter_plot.selectAll("circle")
      .data(points)
      .join(
         enter => enter.append("circle")
            .on("mouseover", function(event, d) {
               console.log(event)
               d3.select(this).attr("fill", "#E29578")
               console.log(yScale(d.y))
               d3.select(".tooltip")
                  .style("top", (event.pageY-160)+"px")
                  .style("left",(event.pageX)+"px")
                  .style('visibility', 'visible')
                  .text(d.country)
            })
            .on("mouseout", function(event, d) {
               d3.select(this).attr("fill", "#006D77")
               d3.select(".tooltip")
                  .style('visibility', 'hidden')
            })
            .transition()
            .delay((d, i) => 10 * i)
            .duration(600)
            .attr("cx", d => xScale(d.x))
            .attr("cy", d => yScale(d.y))
            .attr("r", 3)
            .attr("fill", "#006D77"),
         update => update
            .transition(t)
            .attr("cx", d => xScale(d.x))
            .attr("cy", d => yScale(d.y)),
         exit => exit
            .remove()
      )
      
   d3.select("#best-fit-line").remove()
   scatter_plot.append('line')
      .attr("id", "best-fit-line")
      .style("stroke", "#E29578")
      .style("stroke-width", 2)
      .style("stroke-dasharray", 5)
      .transition(t)
      .attr("x1", xScale(regressionPoints[0].x))
      .attr("y1", yScale(regressionPoints[0].y))
      .attr("x2", xScale(regressionPoints[1].x))
      .attr("y2", yScale(regressionPoints[1].y));
}