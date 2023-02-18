class Table{
    constructor(_config, _data, _name) {
        // Configuration object with defaults
        this.config = {
          parentElement: _config.parentElement,
          containerWidth: _config.containerWidth || 500,
          containerHeight: _config.containerHeight || 300,
          margin: _config.margin || {top: 50, bottom: 50, right: 50, left: 50 },
        }
        this.data = _data;
        this.na = _name;
        this.initVis();
    
      }

    initVis(){
      let vis = this;
      vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
      vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
  
      vis.xScale = d3.scaleLinear()
          .range([0, vis.width]);
  
      vis.yScale = d3.scaleLinear()
          .range([vis.height, 0]);

      vis.svg = d3.select(vis.config.parentElement)
          .attr('width', vis.config.containerWidth)
          .attr('height', vis.config.containerHeight);


      vis.chart = vis.svg.append('g')
          .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

      vis.svg.append('text')
          .attr('class', 'axis-title')
          .attr('x', 0)
          .attr('y', 0)
          .attr('dy', '.71em')
          .style('fill', 'white')
          .text("Exoplanet Data");

      this.updateVis();
    }

    updateVis(){
      let vis = this;

      vis.renderVis();
    }

    renderVis(){
      let vis = this;

      
    }
}