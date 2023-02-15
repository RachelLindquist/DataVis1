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
      //Using original d3.max I couldn't get above 9.99 and things got cut off
      //so I've hard coded it
      vis.yScale.domain([0, 10.94]);
      vis.xScale.domain([0, 109.46]);

  
      vis.renderVis();
    }
  
    /**
     * Bind data to visual elements.
     */
    renderVis() {
      let vis = this;
  
      // Add circles
      const circles = vis.chart.selectAll('.point')
          .data(vis.data, d => d.trail)
        .join('circle')
          .attr('class', 'point')
          .attr('r', 4)
          .attr('cy', d => vis.yScale(vis.yValue(d)))
          .attr('cx', d => vis.xScale(vis.xValue(d)))
          .attr('fill', d => { // fix this to match something else, maybe
            if(d.habit == 'Unknown')
              return '#444444';
            else if (d.habit == "habitable")
              return '#009085';
            else 
              return '#ff0a92';
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
              d3.select(event.currentTarget).style("fill", "#2e8bc0");
          })
          .on('mouseleave', () => {
            d3.select('#tooltip').style('display', 'none');
            
          })

          .on("mouseout", function(d){
            d3.select(event.currentTarget)
            .style("fill", d => { 
              if(d.habit == 'Unknown')
                return '#444444';
              else if (d.habit == "habitable")
                return '#009085';
              else 
                return '#ff0a92';
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