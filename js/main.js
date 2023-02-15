let filter = [];
//let usedForFilter = [];
let data, disc, sysStar, sysPlan, starType, habitability, scatterplot, distance, discTime, discoveryType;



d3.csv('data/exoplanets-1.csv')
  .then(_data => {
	data = _data;
	console.log('Data loading complete. Work with dataset.');
    console.log(data);
	//calculations to fix stars
	data.forEach( d => {
		let starType = d.st_spectype;
		if (starType.charAt(0).toUpperCase() == "A" || starType.charAt(0).toUpperCase() == "F" || starType.charAt(0).toUpperCase() == "G" || starType.charAt(0).toUpperCase() == "K" || starType.charAt(0).toUpperCase() == "M"){
			//stars.push ({'type': starType.charAt(0).toUpperCase(), 'pl_orbsmax':d.pl_orbsmax, });
			d ['type'] = starType.charAt(0).toUpperCase();
		} else {
			d ['type'] = "Unknown";
		}
	});

	//calculations for habitability
	data.forEach(d => {
		if (d.type == 'A'){
			if (d.pl_orbsmax >= 8.5 && d.pl_orbsmax <= 12.5){
				//habit.push({'type' : d.type, 'habit' : 'true'});
				d ['habit'] = 'habitable';
			} else{
				//habit.push({'type' : d.type, 'habit' : 'false'});
				d ['habit'] = 'uninhabitable';
			}
		} else if (d.type == 'F'){
			if (d.pl_orbsmax >= 1.5 && d.pl_orbsmax <= 2.2){
				//habit.push({'type' : d.type, 'habit' : 'true'});
				d ['habit'] = 'habitable';
			} else{
				//habit.push({'type' : d.type, 'habit' : 'false'});
				d ['habit'] = 'uninhabitable';
			}
		} else if (d.type == 'G'){
			if (d.pl_orbsmax >= 0.95 && d.pl_orbsmax <= 1.4){
				//habit.push({'type' : d.type, 'habit' : 'true'});
				d ['habit'] = 'habitable';
			} else{
				//habit.push({'type' : d.type, 'habit' : 'false'});
				d ['habit'] = 'uninhabitable';
			}
		} else if (d.type == 'K'){
			if (d.pl_orbsmax >= 0.38 && d.pl_orbsmax <= 0.56){
				//habit.push({'type' : d.type, 'habit' : 'true'});
				d ['habit'] = 'habitable';
			} else{
				//habit.push({'type' : d.type, 'habit' : 'false'});
				d ['habit'] = 'uninhabitable';
			}
		} else if (d.type == 'M'){
			if (d.pl_orbsmax >= 0.08 && d.pl_orbsmax <= 0.12){
				//habit.push({'type' : d.type, 'habit' : 'true'});
				d ['habit'] = 'habitable';
			} else{
				//habit.push({'type' : d.type, 'habit' : 'false'});
				d ['habit'] = 'uninhabitable';
			}
		} else {
			//habit.push({'type' : d.type, 'habit' : 'Unknown'});
			d ['habit'] = 'Unknown';
		}
	});


	//calculations for discovery year
	let minYear = d3.min( data, d => d.disc_year);
	let maxYear = d3.max( data, d=> d.disc_year );

	disc = []; //this will be our data for the line chart
	for(let i = minYear; i < maxYear; i++){

		let justOneYear = data.filter( d => d.disc_year == i ); //only include the selected year
		let total = d3.count(justOneYear, d => d.disc_year);

		disc.push( {"year": parseInt(i), "count":total});
	}


	//histogram calculations
	let minDis = 1.3; //d3.min didn't work, had to hard code
	let maxDis = 8500
	let binSize = (maxDis-minDis)/ 5;
	let dis = [];
	data.forEach(d => {
		if (d.sy_dist> 0 && d.sy_dist < binSize){
			//dis.push({'bin': '0-1700 pc'});
			d ['bin'] = '0-1700 pc';
		} else if (d.sy_dist> binSize && d.sy_dist < binSize * 2){
			//dis.push({'bin': '1700-3400 pc'});
			d ['bin'] = '1700-3400 pc';
		} else if (d.sy_dist> binSize * 2 && d.sy_dist < binSize * 3){
			//dis.push({'bin': '3400-5100 pc'});
			d ['bin'] = '3400-5100 pc';
		} else if (d.sy_dist> binSize * 3 && d.sy_dist < binSize * 4){
			//dis.push({'bin': '5100-6800 pc'});
			d ['bin'] = '5100-6800 pc';
		} else {
			//dis.push({'bin': '6800-8500 pc'});
			d ['bin'] = '6800-8500 pc';
		}

	});



	const starScale = d3.scaleOrdinal()
	.domain(['1', '2', '3', '4'])
	// https://www.color-hex.com/color-palette/29137
	.range(['#961890', '#00508c', '#750884', '#00576d']);
	//Number of stars in the system
	sysStar = new BarChart({
		'parentElement': '#multiStar',
		'colorScale' : starScale,
		'containerHeight': 200,
		'containerWidth': 600,
	}, data, "Stars per system", 'sy_snum', 'Number of Stars'); 
		sysStar.updateVis();

		
	const planScale = d3.scaleOrdinal()
		.domain(['1', '2', '3', '4', '5', '6', '7', '8'])
		.range(['#008080','#8d0a9d','#005b96','#ad57ea','#1ebbd7','#9e36d2','#43e8d8','#c280e7','#189ad3','#ca6095']);
	
	//Number of planets
	sysPlan = new BarChart({
		'parentElement': '#planetSys',
		'colorScale' : planScale,
		'containerHeight': 200,
		'containerWidth': 600,
	}, data, 'Planets per System', 'sy_pnum', 'Number of Planets'); 
	sysPlan.updateVis();

	//Star type orbits
	const typeScale = d3.scaleOrdinal()
	.domain(['A', 'F', 'G', 'K', 'M', 'Unknown'])
	//https://www.color-hex.com/color-palette/63874
	.range(['#001eff','#6f00ff','#a300ff','#c900ff','#e300ff','#444444']);

	starType = new BarChart({
		'parentElement': '#starType',
		'colorScale' : typeScale,
		'containerHeight': 200,
		'containerWidth': 600,
	}, data, 'Star Types', 'type', 'Star Type'); 
	starType.updateVis();



	//Habitable vs uninhabitable
	const habScale = d3.scaleOrdinal()
	.domain(['Unknown', 'habitable', 'uninhabitable'])
	// https://www.color-hex.com/color-palette/5548
	// https://www.color-hex.com/color-palette/43992
	.range(['#444444', '#009085', '#ff0a92']);

	habitability = new BarChart({
		'parentElement': '#habitability',
		'colorScale' : habScale,
		'containerHeight': 200,
		'containerWidth': 600,
	}, data, 'Number of Habitabitable Exoplanets', 'habit', 'Habitable?'); 
	habitability.updateVis();

	//radius vs mass
	//scatterchart

	scatterplot = new Scatterplot({ 
		'parentElement': '#radVMass',
		'containerHeight': 300,
		'containerWidth': 600,
	  }, data);
	  scatterplot.updateVis();

	d3.selectAll('.legend-btn').on('click', function() {
		// Toggle 'inactive' class
		d3.select(this).classed('inactive', !d3.select(this).classed('inactive'));
	  
		// Filter data accordingly and update vis
		let button = document.getElementById('unknown');
		if (button.classList.contains('inactive')){
			starType.data = starType.data.filter(d => d.type != "Unknown");
			habitability.data = habitability.data.filter(d => d.type != "Unknown");
			scatterplot.data = scatterplot.data.filter(d => d.st_rad != "");
			starType.updateVis();
			habitability.updateVis();
			scatterplot.updateVis();
		} else {
			starType.data = data;
			habitability.data = data;
			scatterplot.data = data;
			starType.updateVis();
			habitability.updateVis();
			scatterplot.updateVis();
		}
	  });



	//distance to us
	const disScale = d3.scaleOrdinal()
	.domain(['0-1700 pc', '1700-3400 pc', '3400-5100 pc', '5100-6800 pc', '6800-8500 pc'])
	// https://www.color-hex.com/color-palette/37681
	.range(['#e2d4f8', '#de76eb', '#b458f1', '#8538f7', '#6522fd']);


	distance = new BarChart({
		'parentElement': '#distance',
		'colorScale' : disScale,
		'containerHeight': 200,
		'containerWidth': 600,
	}, data, 'Distance from Earth in Parsecs', 'bin', 'Distance'); 
	distance.updateVis();
	

	//discovery over time
	//linechart
	discTime = new Line({
		'parentElement': '#disTime',
		'containerHeight': 300,
		'containerWidth': 600,
	}, disc, 'Discoveries each year');
	discTime.updateVis();




	  	
	//Discovery Method
	const discScale = d3.scaleOrdinal()
	.domain(['Radial Velocity', 'Transit', 'Imaging', 'Eclipse Timing Variation', 'Astometry', 'Microlensing', 'Pulsar Timing', 'Orbital Brightness Modulation', 'Disk Kinematics', 'Pulsation Timing Variations'])
	// https://www.color-hex.com/color-palette/7702
	//https://www.color-hex.com/color-palette/83434
	//https://www.color-hex.com/color-palette/85927
	.range(['#3d94ae','#a15dea','#67c6d4', '#b133c9', '#2c6c7a', '#7d0185', '#b5fff6', '#8977db', '#3d579f', '#853f8d', '#39beff']);


	discoveryType = new BarChart({
		'parentElement': '#discoveryType',
		'colorScale' : discScale,
		'containerHeight': 200,
		'containerWidth': 1420,
	}, data, 'Discovery Type', 'discoverymethod', 'Discovery Method'); 
	discoveryType.updateVis();


	//Tables TODO
	columns = [];
	let table = new Table({
		'parentElement': '#dataTable',
		'containerHeight': 200,
		'containerWidth': 1420,
	}, data, 'Planet Data Table', columns);

});

function filterData() {
	let button = document.getElementById('unknown');
		if (button.classList.contains('inactive')){
			starType.data = starType.data.filter(d => d.type != "Unknown");
			habitability.data = habitability.data.filter(d => d.type != "Unknown");
			scatterplot.data = scatterplot.data.filter(d => d.st_rad != "");
		} else {
			starType.data = data;
			habitability.data = data;
			scatterplot.data = data;
		}
	sysStar.data = data;
	sysPlan.data = data;
	distance.data = data;
	discTime.data = disc;
	discoveryType.data = data;
	let usedForFilter = [];
	filter.forEach (f => {
		let info = f.split(",");
		if (!usedForFilter.includes(info[0])){
			usedForFilter.push (info[0])
		}
	});
	//fix filtering, currently removed highlighted bar
	filter.forEach( f => {
		let info = f.split(",");
		if (!usedForFilter.includes("sy_snum")){
			sysStar.data = sysStar.data.filter(d => d[info[0]] != info[1]);
		}
		if (!usedForFilter.includes("sy_pnum")){
			sysPlan.data = sysPlan.data.filter(d => d[info[0]] != info[1]);
		}
		if (!usedForFilter.includes("type")){
			starType.data = starType.data.filter(d => d[info[0]] != info[1]);
		}
		if (!usedForFilter.includes("habit")){
			habitability.data = habitability.data.filter(d => d[info[0]] != info[1]);
		}
		if (!usedForFilter.includes("bin")){
			distance.data =distance.data.filter(d => d[info[0]] != info[1]);
		}
		if (!usedForFilter.includes("discoverymethod")){
			//TODO: Fix this
			discoveryType.data = discoveryType.data.filter(d => d[info[0]] != info[1]);
		}
		scatterplot.data = scatterplot.data.filter(d => d[info[0]] != info[1]);

		let minYear = d3.min( data, d => d.disc_year);
		let maxYear = d3.max( data, d=> d.disc_year );
		let currentData = scatterplot.data
		di = []; //next linechart datas
		for(let i = minYear; i < maxYear; i++){
	
			let justOneYear = currentData.filter( d => d.disc_year == i ); //only include the selected year
			let total = d3.count(justOneYear, d => d.disc_year);
	
			di.push( {"year": parseInt(i), "count":total});
		}
		discTime.data = di;
	});
	sysStar.updateVis();
	sysPlan.updateVis();
	starType.updateVis();
	habitability.updateVis();
	scatterplot.updateVis();
	distance.updateVis();
	discTime.updateVis();
	discoveryType.updateVis();
  }

function unfilterData(filter, value){

	scatterplot.data = data;
	scatterplot.updateVis();
}