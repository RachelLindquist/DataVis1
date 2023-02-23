//started code taken from
//https://codesandbox.io/s/github/UBC-InfoVis/2021-436V-examples/tree/master/d3-linked-charts-basic?file=%2Fjs%2Fscatterplot.js
class Scatterplot {

    constructor(_config, _data) {
      this.config = {
        parentElement: _config.parentElement,
        containerWidth: _config.containerWidth || 500,
        containerHeight: _config.containerHeight || 300,
        margin: _config.margin || { top: 50, bottom: 100, right: 100, left: 100 },
        tooltipPadding: _config.tooltipPadding || 15
      }
      this.data = _data;
      this.initVis();
    }
    
    initVis() {
      let vis = this;
  
      // Calculate inner chart size. Margin specifies the space around the actual chart.
      vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
      vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
  
      vis.xScale = d3.scaleLinear()
          .range([0, vis.width]);
  
      vis.yScale = d3.scaleLinear()
          .range([vis.height, 0]);
  
      // Initialize axes
      vis.xAxis = d3.axisBottom(vis.xScale)
          .ticks(6)
          .tickSize(-vis.height - 10)
          .tickPadding(10);
  
      vis.yAxis = d3.axisLeft(vis.yScale)
          .ticks(6)
          .tickSize(-vis.width - 10)
          .tickPadding(10);
  
      // Define size of SVG drawing area
      vis.svg = d3.select(vis.config.parentElement)
          .attr('width', vis.config.containerWidth)
          .attr('height', vis.config.containerHeight);
  
      // Append group element that will contain our actual chart 
      // and position it according to the given margin config
      vis.chart = vis.svg.append('g')
          .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);
  
      // Append empty x-axis group and move it to the bottom of the chart
      vis.xAxisG = vis.chart.append('g')
          .style('color', 'white')
          .attr('class', 'axis x-axis')
          .attr('transform', `translate(0,${vis.height})`);
      
      // Append y-axis group
      vis.yAxisG = vis.chart.append('g')
          .style('color', 'white')
          .attr('class', 'axis y-axis');
  
      // Append both axis titles
      vis.chart.append('text')
          .attr('class', 'axis-title')
          .attr('y', vis.height+ 20)
          .attr('x', vis.width + 15)
          .attr('dy', '.71em')
          .style('text-anchor', 'end')
          .style('fill', 'white')
          .text('Radius');
  
      vis.svg.append('text')
          .attr('class', 'axis-title')
          .attr('x', 40)
          .attr('y', 40)
          .attr('dy', '.71em')
          .style('fill', 'white')
          .text('Mass');

        // Append axis title
        vis.svg.append('text')
            .attr('class', 'axis-title')
            .attr('x', 0)
            .attr('y', 0)
            .attr('dy', '.71em')
            .style('fill', 'white')
            .text("Mass vs Radius");

        
          //Legend
          vis.chart.append("circle").attr("cx",-80).attr("cy",95).attr("r", 5).style("fill", '#c435ff');
          vis.chart.append("circle").attr("cx",10).attr("cy",95).attr("r", 5).style("fill", '#158844');
          vis.chart.append("circle").attr("cx",100).attr("cy",95).attr("r", 5).style("fill", '#1d939b');
          vis.chart.append("circle").attr("cx",190).attr("cy",95).attr("r", 5).style("fill", "#c4ffd9");
          vis.chart.append("circle").attr("cx",-80).attr("cy",115).attr("r", 5).style("fill", "#2fdbd1");
          vis.chart.append("circle").attr("cx",10).attr("cy",115).attr("r", 5).style("fill", "#eed0ff");
          vis.chart.append("circle").attr("cx",100).attr("cy",115).attr("r", 5).style("fill", "#00efff");
          vis.chart.append("circle").attr("cx",190).attr("cy",115).attr("r", 5).style("fill", '#444444');
          vis.chart.append("text").attr("x", -75).attr("y", 100).text("Asterodian").style("font-size", "15px").attr("alignment-baseline","middle").attr("fill", "white");
          vis.chart.append("text").attr("x", 15).attr("y", 100).text("Mercurian").style("font-size", "15px").attr("alignment-baseline","middle"). attr ("fill", "white");
          vis.chart.append("text").attr("x", 105).attr("y", 100).text("Subterran").style("font-size", "15px").attr("alignment-baseline","middle"). attr ("fill", "white");
          vis.chart.append("text").attr("x", 195).attr("y", 100).text("Terran").style("font-size", "15px").attr("alignment-baseline","middle"). attr ("fill", "white");
          vis.chart.append("text").attr("x", -75).attr("y", 120).text("Superterran").style("font-size", "15px").attr("alignment-baseline","middle"). attr ("fill", "white");
          vis.chart.append("text").attr("x", 15).attr("y", 120).text("Neptunian").style("font-size", "15px").attr("alignment-baseline","middle"). attr ("fill", "white");
          vis.chart.append("text").attr("x", 105).attr("y", 120).text("Jovian").style("font-size", "15px").attr("alignment-baseline","middle"). attr ("fill", "white");
          vis.chart.append("text").attr("x", 195).attr("y", 120).text("Missing/Other").style("font-size", "15px").attr("alignment-baseline","middle"). attr ("fill", "white");
    }
  
    /**
     * Prepare the data and scales before we render it.
     */
    updateVis() {
      let vis = this;
      
      // Specificy accessor functions
      vis.xValue = d => d.st_rad;
      vis.yValue = d => d.st_mass;
  
      // Set the scale input domains
      //Using d3.max I couldn't get above 9.99 and things got cut off
      //so I've hard coded it
      vis.yScale.domain([0, 10.94]); //try to get this to work with d3.max so I can use filtering
      vis.xScale.domain([0, 109.46]);

  
      vis.renderVis();
    }
  
    renderVis() {
      let vis = this;
  
      // Add circles
      const circles = vis.chart.selectAll('.point')
          .data(vis.data)
          .join('circle')
          .attr('class', 'point');

      circles          
      .merge(circles) // https://stackoverflow.com/questions/40153291/d3-js-update-with-transition
      .transition()
      .duration(1000)
          .attr('r', 3)
          .attr('cy', d => vis.yScale(vis.yValue(d)))
          .attr('cx', d => vis.xScale(vis.xValue(d)))
          // https://www.color-hex.com/color-palette/1022562
          // https://www.color-hex.com/color-palette/1022560
          .attr('fill', d => {
            if(d.st_mass < 0.00001)
              return '#c435ff'; //asterodian
            else if (d.st_mass < 0.1)
              return '#158844'; //mercurian
            else if (d.st_mass < 0.5)
              return '#1d939b'; //subterran
            else if (d.st_mass < 2)
              return "#c4ffd9"; //terran
            else if (d.st_mass < 10)
              return "#2fdbd1"; //superterran
            else if (d.st_mass < 50)
              return "#eed0ff"; // Neptunian
            else if (d.st_mass < 5000)
              return "#00efff"; //Jovian
            else
              return '#444444'; //Missing/Other
          });

      // Tooltip event listeners
      circles
          .on('mouseover', (event,d) => {
            d3.select('#tooltip')
              .style('display', 'block')
              .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
              .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
              .html(`
                <div class="tooltip-title">${d.pl_name}</div>
                <div><i>System Name: ${d.sys_name}</i></div>
                <ul>
                  <li>Mass: ${d.st_mass}</li>
                  <li>Radius: ${d.st_rad}</li>
                </ul>
              `)
              d3.select(event.currentTarget).style("fill", "red");
          })
          .on('mouseleave', () => {
            d3.select('#tooltip').style('display', 'none');
            
          })

          .on("mouseout", function(d){
            d3.select(event.currentTarget)
            .style('fill', d => {
              if(d.st_mass < 0.00001)
                return '#c435ff';
              else if (d.st_mass < 0.1)
                return '#158844';
              else if (d.st_mass < 0.5)
                return '#1d939b';
              else if (d.st_mass < 2)
                return "#c4ffd9";
              else if (d.st_mass < 10)
                return "#2fdbd1";
              else if (d.st_mass < 50)
                return "#eed0ff";
              else if (d.st_mass < 5000)
                return "#00efff";
              else
                return '#444444';
            });
           });
      
      // Update the axes/gridlines
      // We use the second .call() to remove the axis and just show gridlines
      vis.xAxisG
          .call(vis.xAxis)
          .call(g => g.select('.domain').remove());
  
      vis.yAxisG
          .call(vis.yAxis)
          .call(g => g.select('.domain').remove())
    }
  }