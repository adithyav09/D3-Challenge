var xaxis = "poverty";
var yaxis = "healthcare";

var margin = { top: 20, right: 20, bottom: 50, left: 70 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Updates the x scale.
function xScale(data, xaxis, graphWidth) {
    // Create scales.
    var Xlinear = d3.scaleLinear()
        .domain([d3.min(data, d => d[xaxis]) * .8,
            d3.max(data, d => d[xaxis]) * 1.1
        ])
        .range([0, graphWidth]);
    return Xlinear;
}

// Function used for updating y-scale var upon click on axis label.
function yScale(data, yaxis, graphHeight) {
    // Create scales.
    var YLinear = d3.scaleLinear()
        .domain([d3.min(data, d => d[yaxis]) * .8,
            d3.max(data, d => d[yaxis]) * 1.2
        ])
        .range([graphHeight, 0]);
    return YLinear;
}

function scatterPlot() {

    var svgHeight = window.innerHeight / 1.2;
    var svgWidth = window.innerWidth / 1.7;

    // Graph area minus margins.
    var graphHeight = svgHeight - margin.top - margin.bottom;
    var graphWidth = svgWidth - margin.left - margin.right;

    // Create an SVG wrapper, append an SVG group that will hold our chart,
    // and shift the latter by left and top margins.
    var svg = d3
        .select("#scatter")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // Append an SVG group
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)

    d3.csv("assets/data/data.csv").then(function(data, err) {
        if (err) throw err;
        // Loop through the data in the CSV in order to plot the graph.
        data.forEach(function(data) {
            data.poverty = +data.poverty;
            data.healthcare = +data.healthcare;
            data.age = +data.age;
            data.smokes = +data.smokes;
            data.income = +data.income;
            data.obesity = data.obesity;
        });

        // Create x and y linear scale.
        var Xlinear = xScale(data, xaxis, graphWidth);
        var YLinear = yScale(data, yaxis, graphHeight);

        // Initialize the x and y axis.
        var bottomAxis = d3.axisBottom(Xlinear);
        var leftAxis = d3.axisLeft(YLinear);

        // Add the x axis.
        var xAxis = chartGroup.append("g")
            .attr("transform", `translate(0, ${graphHeight})`)
            .call(bottomAxis);

        // X axis Label
        svg.append("text")
            .attr("transform",
                "translate(" + (width / 2) + " ," +
                (height + margin.top + 215) + ")")
            .style("text-anchor", "middle")
            .text("In Poverty (%)");

        // Y axis Label
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", 0 - (height / 1.5))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Lacks Healthcare (%)");

        // Add the y axis.
        var yAxis = chartGroup.append("g")
            .call(leftAxis);

        // Add the data for each of the circles.
        var circles = chartGroup.selectAll("circle")
            .data(data);

        // Combine the data.
        var elemEnter = circles.enter();

        // Create circles.
        var circle = elemEnter.append("circle")
            .attr("cx", d => Xlinear(d[xaxis]))
            .attr("cy", d => YLinear(d[yaxis]))
            .attr("r", 15)
            .classed("stateCircle", true);

        // Circles to plot onto the graph.
        var circleText = elemEnter.append("text")
            .attr("x", d => Xlinear(d[xaxis]))
            .attr("y", d => YLinear(d[yaxis]))
            .attr("dy", ".35em")
            .text(d => d.abbr)
            .classed("stateText", true);

    }).catch(function(err) {
        console.log(err);
    });
}

// Call the Scatter plot function to display.
scatterPlot();