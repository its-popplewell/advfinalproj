let blocked_subjects = [] 

const margin = {
  top: 10,
  right: 30,
  bottom: 30,
  left: 60
};

const W = 1100;
const H = 800;

const width = W - margin.right - margin.left;
const height = H - margin.top - margin.bottom;

const svg = d3.select('#datavis')
  .append('svg')
    .attr('width', W)
    .attr('height', H)
  .append('g')
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

const simplifySubject = (s) => {
    if (s.toLowerCase().indexOf('topolo') != -1) {
        return "Topology"
    } else if (s.toLowerCase().indexOf('geometr') != -1) {
        return "Geometry"
    } else if (s.toLowerCase().indexOf('mechanics') != -1) {
        return "Mechanics"
    } else if (s.toLowerCase().indexOf("algebr") != -1) {
        return "Algebra"
    } else if (s.toLowerCase().indexOf("differential equat") != -1) {
        return "Differential Equations"
    } else if (s.toLowerCase().indexOf("thermo") != -1 || s.toLowerCase().indexOf("circuits") != -1 || s.toLowerCase().indexOf("physics") != -1 || s.toLowerCase().indexOf("relativity") != -1 || s.toLowerCase().indexOf("quantum") != -1 || s.toLowerCase().indexOf("electromag") != -1 || s.toLowerCase().indexOf("potential") != -1) {
      return "Mathematical Physics"
    } else if (s.toLowerCase().indexOf('complex') != -1) {
      return "Complex Analysis"
    } else if (s.toLowerCase().indexOf('integr') != -1 || s.toLowerCase().indexOf('calculus') != -1) {
      return "Calculus"
    } else if (s.toLowerCase().indexOf('logic and') != -1){
      return "Logic and Foundations"
    } else if (s.toLowerCase().indexOf('analysis') != -1) {
      return "Analysis"
    } else if (s.toLowerCase().indexOf('programming') != -1) {
      return "Computer science"
    } else if (s.toLowerCase().indexOf('set theory') != -1 || s.toLowerCase().indexOf('general') != -1 ||s.toLowerCase().indexOf("systems") != -1 || s.toLowerCase().indexOf("$k") != -1 || s.toLowerCase().indexOf("dynamical") != -1 || s.toLowerCase().indexOf("sequences") != -1 || s.toLowerCase().indexOf('real functions') != -1 || s.toLowerCase().indexOf('special functions') != -1 || s.toLowerCase().indexOf('field theory') != -1 || s.toLowerCase().indexOf("approx") != -1 || s.toLowerCase().indexOf("operator theory") != -1 || s.toLowerCase().indexOf("difference") != -1) {
      return "Other"
    } else {
        return s
    }
}

let doop = {}
for (d in data) {
  let year = {};
  for (el of data[d]) {
    if (el[0] == "Other") {continue}

    if (simplifySubject(el[0]) in year) {
      year[simplifySubject(el[0])] += parseInt(el[1])
    } else {
      year[simplifySubject(el[0])] = parseInt(el[1])
    }
  }

  doop[d] = year;
}

let subjects = [];
for (d in doop) {
    for (el of Object.keys(doop[d])) {
        if (!(subjects.includes(el))) {
            subjects.push(el)
        }
    }
}

subjects = subjects
  .filter(el => isNaN(parseInt(el)))
  .filter(el => el != "General")
  .filter(el => el.toLowerCase().indexOf("bio") == -1)

for (d in doop) {
  for (s of subjects) {
    if (!(s in doop[d])) {
      doop[d][s] = 0;
    }
  }
}

const doopdat = []
for (d in doop) {
  doopdat.push({date: d, ...doop[d]})
}

const stack = d3.stack()
  .offset(d3.stackOffsetSilhouette)
  .keys(subjects)
  (doopdat);

// console.log('dd');
// console.log(doopdat);

const xScale = d3.scaleTime()
  .domain([1935, 2021])
  .range([0, width]);
svg.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(xScale).ticks(5).tickFormat(d3.format('d')));

const yScale = d3.scaleLinear()
    .domain([-75000, 75000])
    // .domain([0, 150000])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(yScale).tickFormat(Math.abs));

const colorScale = d3.scaleOrdinal()
  .domain(Object.keys(doop[1900]))
  .range(['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#dd00dd']);
  // .range([
  //   "#004B87", // Dark Blue
  //   "#2C6FBB", // Medium Blue
  //   "#7BAFD4", // Light Blue
  //   "#008972", // Dark Green
  //   "#34A287", // Medium Green
  //   "#8DD1B9", // Light Green
  //   "#8B008B", // Dark Magenta
  //   "#BB55BB", // Medium Magenta
  //   "#E899E8", // Light Magenta
  //   "#8B0000", // Dark Red
  //   "#BB5555", // Medium Red
  //   "#E88989", // Light Red
  //   "#FF8C00", // Dark Orange
  //   "#FFB655", // Medium Orange
  //   // "#FFDAA1", // Light Orange
  //   "#FFD700", // Dark Yellow
  //   // "#FFED99", // Medium Yellow
  //   // "#FFF3CD"  // Light Yellow
  // ]);


let cursorLine = svg.append("line")
  .attr("x1", 0)
  .attr("x2", 0)
  .attr("y1", 0)
  .attr("y2", height)
  .attr("stroke", "lightblue");

  // create a tooltip
  const Tooltip = svg
    .append("text")
    .attr("x", 200)
    .attr("y", 200)
    .style("opacity", 0)
    .style("font-size", 17);

// Three function that change the tooltip when user hover / move / leave a cell
  const mouseover = function(event,d) {
    Tooltip.style("opacity", 1);
    d3.selectAll(".myArea").style("opacity", .2);
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1);

    
  }
  const mousemove = function(event,d,i) {
    grp = d.key;
    Tooltip.text(grp);

  }
  const mouseleave = function(event,d) {
    Tooltip.style("opacity", 0);
    d3.selectAll(".myArea").style("opacity", 1).style("stroke", "none");
   }

svg
  .selectAll("mylayers")
  .data(stack)
  .join("path")
    .attr("class", "myArea")
    .style("fill", function (d) {return colorScale(d.key)})
    .attr("d", d3.area()
      .x(function(d, i) {return xScale("" + (d.data.date));})
      .y0(function(d) {return yScale(d[0])})
      .y1(function(d) {return yScale(d[1])}))
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);

// X Axis
svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height - 6)
    .text("Year");

// Y Axis
svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Papers Published");

let leg = svg.append('g')
  .attr('id', 'legend')
  
// Add one dot in the legend for each name.
leg.selectAll("mydots")
  .data(Object.keys(doop[1900]))
  .enter()
  .append("circle")
    .attr("cx", 100)
    .attr("cx", function(d, i) {
      if (i > 3 * (Object.keys(doop[1900]).length / 5)) {
        return 480;
      } else {
        return 100
    }
    })
    // .attr("cy", function(d,i){ return 100 + i*25 + (i < Object.keys(doop[1900]).length / 2) ? 275 : 0}) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("cy", function(d,i) {
      if (i < (3 * (Object.keys(doop[1900]).length / 5))) {
      return 125 + i*25 + 335
    } else {
      return 150 + i*25 + 135
    }
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 7)
    .style("fill", function(d){ return colorScale(d)})

// Add one dot in the legend for each name.
leg.selectAll("mylabels")
  .data(Object.keys(doop[1900]))
  .enter()
  .append("text")
    .attr("x", function(d, i) {
      if (i > (3 * (Object.keys(doop[1900]).length / 5))) {
        return 500;
      } else {
        return 120
    }
    })
    .attr("y", function(d,i) {
      if (i < (3 * (Object.keys(doop[1900]).length / 5))) {
      return 125 + i*25 + 335
    } else {
      return 150 + i*25 + 135
    }
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", function(d){ return '#111111'})
    .text(function(d){ return d})
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")

const svg_bp = d3.select('#barplot')
  .append('svg')
    .attr('width', 350)
    .attr('height', H)

// svg_bp.append("rect")
//   .attr("x", 0)
//   .attr("y", 0)
//   .attr("width", "250")
//   .attr("height", height)
//   .style("fill", "#ff0000")

let stackyear = 2000;

const redraw = (svg, year, doop) => {

  if (!(1935 <= year && year <= 2021)) return 0;

  console.log(`REDRAW: ${year}`)

  // svg.remove()
  d3.selectAll("#barplot > svg > *").remove()

  svg.append('g')
    .attr("transform", `translate(${margin.left + 20}, ${margin.top})`);

const y = d3.scaleLinear()
    .domain([0, 100])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y))
    .attr('transform', `translate(25, 0)`);

  let stackdata = []
  let stacksubj = []
  let stackcum = []

  let yearly_tot = Object.values(doop[year]).map(el => parseInt(el)).reduce((partialSum, a) => partialSum + a, 0);

  for (d in doop[year]) {
    // console.log(`d: ${}`)
    stacksubj.push(d)
    stackdata.push(parseInt(doop[year][d]) / yearly_tot);
  }

  let past = 0;
  for (let i = 0; i < stackdata.length; i++) {
    stackcum[i] = stackdata[i] + past;
    past = stackcum[i];
  }

  for (let i = 0; i < stackdata.length; i++) {
    svg.append("rect")
      .attr("x", 30)
      .attr("y", (stackcum[i]-stackdata[i]) * height)
      .attr("width", "225")
      .attr("height", stackdata[i] * height)
      .style("fill", colorScale(stacksubj[i]))
  }

  svg.append("text")
    .text(year)
    .attr('x', '400')
    .attr('y',  '-300')
    .attr('transform', `rotate(90)`)
    .style('font-size', '34px')
    .attr('text-anchor', 'middle')

  svg.append("text")
    .text("Papers by Proportion and Year")
    .attr("y", H - 10)
    .attr("x", 0)
    
}

// Event Listener

/*
 * I need to update on mouse click
 *
 * */

document.getElementById("datavis").addEventListener("mousemove", function (event) { 
    let mX = event.clientX - event.target.getBoundingClientRect().left; 
    redraw(svg_bp, Math.floor((((mX - margin.left)/width) * (2023 - 1935)) + 1935), doop);

    
    // Update the cursor line position
    cursorLine.attr("x1", mX - margin.left)
      .attr("x2", mX - margin.left);
})
