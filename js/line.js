//starter code taken from
//https://codesandbox.io/s/github/UBC-InfoVis/2021-436V-examples/tree/master/d3-interactive-line-chart
class Line {

  constructor(_config, _data, _name) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 500,
      containerHeight: _config.containerHeight || 140,
      margin: { top: 50, bottom: 50, right: 100, left: 100 }
    }

    this.data = _data; 
    this.na = _name;
    // Call a class function
    this.initVis();


  }

  initVis() {
    // the start of each function to store the this-accessor
    let vis = this; 
  

    // Width and height as the inner dimensions of the chart area- as before
    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;


    vis.svg = d3.select(vis.config.parentElement)
    .attr('width', vis.config.containerWidth)
    .attr('height', vis.config.containerHeight)

    vis.xScale = d3.scaleLinear()
        .range([0, vis.width]);

    vis.yScale = d3.scaleLinear()
        .range([vis.height, 0])
        .nice();

      // Initialize axes
    vis.xAxis = d3.axisBottom(vis.xScale)
        .ticks(6)
        .tickSizeOuter(0)
        .tickPadding(10)
        .tickFormat(d => d);

    vis.yAxis = d3.axisLeft(vis.yScale);
        //.ticks(6)
        //.tickSizeOuter(0)
        //.tickPadding(10);


    // Draw the axis
    /** 
    vis.xAxisGroup = vis.chart.append('g')
      .attr('class', 'axis x-axis') 
      .call(vis.xAxis);

    vis.yAxisGroup = vis.chart.append('g')
      .attr('class', 'axis y-axis')
      .call(vis.yAxis); **/


     // Define size of SVG drawing area
     vis.svg = d3.select(vis.config.parentElement)
     .attr('width', vis.config.containerWidth)
     .attr('height', vis.config.containerHeight);



    vis.xValue = d => d.year;
    vis.yValue = d => d.count;

    vis.area = d3.area()
        .x(d => vis.xScale(vis.xValue(d)))
        .y1(d => vis.yScale(vis.yValue(d)))
       .y0(vis.height);

    vis.line = d3.line()
        .x(d => vis.xScale(vis.xValue(d)))
        .y(d => vis.yScale(vis.yValue(d)));

    // Set the scale input domains
    

  }



 updateVis() { 
  let vis = this; 
  vis.xScale.domain(d3.extent(vis.data, vis.xValue));
  vis.yScale.domain(d3.extent(vis.data, vis.yValue));
  vis.svg.selectAll("g").remove()
  vis.chart = vis.svg.append('g')
  .attr('transform', `translate(${vis.config.margin.left}, ${vis.config.margin.top})`);

      // Append empty x-axis group and move it to the bottom of the chart
      vis.xAxisG = vis.chart.append('g')
      .style('color', 'white')
      .attr('class', 'axis x-axis')
      .attr('transform', `translate(0,${vis.height})`);
  
  // Append y-axis group
  vis.yAxisG = vis.chart.append('g')
      .style('color', 'white')
      .attr('class', 'axis y-axis');


     // Add area path
     vis.chart.append('path')
     .data([vis.data])
     .transition()
     .duration(1000)
     .attr('class', 'chart-area')
     .attr('d', vis.area)
     .style('fill', '#d2afff')
     .style ('opacity', 0.5);

    // Add line path
    vis.chart.append('path')
     .data([vis.data])
     .attr('class', 'chart-line')
     .attr('d', vis.line)
     .style ("stroke", "#ba84ff")
     .transition()
     .duration(6000)
     .style('fill', 'none');

     vis.chart.append('text')
     .attr('class', 'axis-title')
     .attr('x', -20)
     .attr('y', -20)
     .attr('dy', '.71em')
     .style('fill', 'white')
     .text(this.na);

     vis.marks = vis.chart.append('g');
     vis.trackingArea = vis.chart.append('rect')
         .attr('width', vis.width)
         .attr('height', vis.height)
         .attr('fill', 'none')
         .attr('pointer-events', 'all');

     vis.tooltip = vis.chart.append('g')
     .attr('class', 'tooltip')
     .style('display', 'none');

 vis.tooltip.append('circle')
     .attr('r', 4);

 vis.tooltip.append('text');
 vis.marks = vis.chart.append('g');

    vis.xAxisG.call(vis.xAxis);
    vis.yAxisG.call(vis.yAxis);
    vis.bisectDate = d3.bisector(vis.xValue).left;
   
   this.renderVis(); 

 }



 renderVis() { 
  let vis = this; 
  vis.marks.selectAll('.chart-line')
        .data([vis.data])
      .join('path')
        .attr('class', 'chart-line')
        .attr('d', vis.line)
        .style('fill', 'none');
  vis.trackingArea
        .on('mouseenter', () => {
          vis.tooltip.style('display', 'block');
        })
        .on('mouseleave', () => {
          vis.tooltip.style('display', 'none');
        })
        .on('mousemove', function(event) {
          // Get date that corresponds to current mouse x-coordinate
          const xPos = d3.pointer(event, this)[0]; // First array element is x, second is y
          const date = vis.xScale.invert(xPos);

          // Find nearest data point
          const index = vis.bisectDate(vis.data, date, 1);
          const a = vis.data[index - 1];
          const b = vis.data[index];
          const d = b && (date - a.year > b.year- date) ? b : a; 

          // Update tooltip
          vis.tooltip.select('circle')
              .style('fill', 'white')
              .attr('transform', `translate(${vis.xScale(d.year)},${vis.yScale(d.count)})`);
          
          vis.tooltip.select('text')
              .attr('transform', `translate(${vis.xScale(d.year)},${(vis.yScale(d.count) - 15)})`)
              .style('fill', 'white')
              .text(Math.round(d.count));
        });

  }



}