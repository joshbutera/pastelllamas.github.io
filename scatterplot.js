function drawScatterPlot(scatterVar, dataset) {
   var y_selection = scatterVar
   var x_selection = 'happiness_score'
   var t = d3.transition()
      .duration(500);
   console.log(dataset)
   var points = d3.map(dataset, function(d) { 
      if (Number(d[y_selection]) != 0) {
         return {
            x: Number(d[x_selection]),
            y: Number(d[y_selection]),
            'country': d['Country'],
            'year': d['Year']
         }
      }
   })

   points = points.filter(function(d) {
      return d !== undefined;
   })

   console.log(points)

   var xScale = d3.scaleLinear().domain([0, d3.max(points, d => d.x)] ).range([0, width])
   var yScale = d3.scaleLinear().domain([0, d3.max(points, d => d.y)] ).range([height, 0])

   var linearRegression = ss.linearRegression(d3.map(points, d=> [Number(d.x), Number(d.y)]))
   var linearRegressionLine = ss.linearRegressionLine(linearRegression)
   var x_intercept =  d3.max([Number(points[0].x) - (linearRegressionLine( Number(points[0].x)) / linearRegression.m), 0])

   const xCoordinates = [x_intercept, d3.max(points, d=>d.x)];
   
   var regressionPoints = xCoordinates.map(d => ({
      x: d,
      y: linearRegressionLine(d)
   }));

   var rSquared = ss.rSquared(points.map(d => [Number(d.x), Number(d.y)]), linearRegressionLine);

   var tooltip = d3.select("#r2")
      .text("R Squared: " + rSquared.toFixed(2));

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
            .attr("cy", d => yScale(d.y))
            .attr("r", 3)
            .attr("fill", "#006D77"),
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