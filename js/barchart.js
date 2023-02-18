//Starter code taken from
//https://codesandbox.io/s/github/UBC-InfoVis/2021-436V-examples/tree/master/d3-linked-charts-basic?file=%2Fjs%2Fbarchart.js
class BarChart{
    constructor(_config, _data, _name, _item, _classification) {
        // Configuration object with defaults
        this.config = {
          parentElement: _config.parentElement,
          colorScale: _config.colorScale,
          containerWidth: _config.containerWidth || 500,
          containerHeight: _config.containerHeight || 300,
          margin: _config.margin || {top: 50, bottom: 50, right: 50, left: 50 },
        }
        this.data = _data;
        this.na = _name;
        this.item = _item; // = "sy_snum"
        this.classification = _classification;
        this.initVis();
    
      }

    initVis() {
        let vis = this;
    
        // Calculate inner chart size. Margin specifies the space around the actual chart.
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
    
        vis.colorScale = d3.scaleOrdinal()
        .range (this.config.colorScale.range())
        .domain(this.config.colorScale.domain())

  
        vis.yScale = d3.scaleLinear()
            .range([vis.height, 0]) 
    
        vis.xScale = d3.scaleBand()
            .range([0, vis.width])
            .paddingInner(0.2);
    
        vis.xAxis = d3.axisBottom(vis.xScale)
            .ticks(this.config.colorScale.domain())
            .tickSizeOuter(0);
    
        vis.yAxis = d3.axisLeft(vis.yScale)
            .ticks(6)
            .tickSizeOuter(0)
    
        // Define size of SVG drawing area
        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);
    
        // SVG Group containing the actual chart; D3 margin convention
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
    
        // Append axis title
        vis.svg.append('text')
            .attr('class', 'axis-title')
            .attr('x', 0)
            .attr('y', 0)
            .attr('dy', '.71em')
            .style('fill', 'white')
            .text(this.na);
    } 

    updateVis() {
      let vis = this;
  
      const aggregatedDataMap = d3.rollups(vis.data, v => v.length, d => d[this.item]); //this.item = "sy_snum"
      vis.aggregatedData = Array.from(aggregatedDataMap, ([key, count]) => ({ key, count }));

      //add extra info for filtering
      vis.aggregatedData.forEach(function(e){
        e["title"] = vis.item;
        e ["k"] = String(e.key) + vis.item;
      });
      const orderedKeys = this.config.colorScale.domain();
      vis.aggregatedData = vis.aggregatedData.sort((a,b) => {
        return orderedKeys.indexOf(a.key) - orderedKeys.indexOf(b.key);
      });
  
      // Specificy accessor functions
      vis.colorValue = d => d.key;
      vis.xValue = d => d.key;
      vis.yValue = d => d.count;
  
      // Set the scale input domains
      vis.xScale.domain(vis.aggregatedData.map(vis.xValue));
      vis.yScale.domain([0, d3.max(vis.aggregatedData, vis.yValue)]);
  
      vis.renderVis();
    }

    renderVis() {
      let vis = this;
  
      // Add rectangles
      const bars = vis.chart.selectAll('.bar')
          .data(vis.aggregatedData, vis.xValue)
          .join('rect')
          .attr('class', 'bar')
          .attr('x', d => vis.xScale(vis.xValue(d)))
          .attr('width', vis.xScale.bandwidth())
          .attr('height', d => vis.height - vis.yScale(vis.yValue(d)))
          .attr('y', d => vis.yScale(vis.yValue(d)))
          .attr('fill', d => vis.colorScale(vis.colorValue(d)));

        bars
          .on('mouseover', (event,d) => {
            d3.select('#tooltip')
              .style('display', 'block')
              .style('left', (event.pageX) + 'px')   
              .style('top', (event.pageY) + 'px')
              .html(`
                <div class="tooltip-title">${this.classification}: ${d.key}</div>
                <div><i>Total: ${d.count}</i></div>
              `);
          })
          .on('mouseleave', () => {
            d3.select('#tooltip').style('display', 'none');
          });

        bars.on('click', function(event, d) {
          let fil = d.title + "," + d.key;
          const isActive = filter.includes(fil);
          if (isActive) {
            filter = filter.filter(f => f !== fil); // Remove from filter
            d3.select(event.currentTarget).style("stroke", "#000000");
          } else {
            filter.push(fil); // Add to filter
            d3.select(event.currentTarget).style("stroke", "#ffffff");
          }
          filterData(); // call filtering to update visualizations
          d3.select(this).classed('active', !isActive);
          
        });

      // Update axes
      vis.xAxisG.call(vis.xAxis);
      vis.yAxisG.call(vis.yAxis);
    }
}