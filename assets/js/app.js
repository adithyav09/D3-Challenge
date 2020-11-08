var xaxis = "poverty";
var yaxis = "healthcare";

var margin = { top: 20, right: 20, bottom: 50, left: 70 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Function used for updating x-scale var upon click on axis label.
function xScale(data, xaxis, chartWidth) {
    // Create scales.
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[xaxis]) * .8,
            d3.max(data, d => d[xaxis]) * 1.1
        ])
        .range([0, chartWidth]);
    return xLinearScale;
}

// Function used for updating y-scale var upon click on axis label.
function yScale(data, yaxis, chartHeight) {
    // Create scales.
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[yaxis]) * .8,
            d3.max(data, d => d[yaxis]) * 1.2
        ])
        .range([chartHeight, 0]);
    return yLinearScale;
}

function scatterPlot() {

    // Select div by id.
    var svgArea = d3.select("#scatter").select("svg");
    // Clear SVG.
    if (!svgArea.empty()) {
        svgArea.remove();
    }

    //SVG params.
    var svgHeight = window.innerHeight / 1.2;
    var svgWidth = window.innerWidth / 1.7;

    // Chart area minus margins.
    var chartHeight = svgHeight - margin.top - margin.bottom;
    var chartWidth = svgWidth - margin.left - margin.right;

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

    d3.csv("assets/data/data.csv").then(function(demoData, err) {
        if (err) throw err;
        // Parse data.
        demoData.forEach(function(data) {
            data.poverty = +data.poverty;
            data.healthcare = +data.healthcare;
            data.age = +data.age;
            data.smokes = +data.smokes;
            data.income = +data.income;
            data.obesity = data.obesity;
        });

        // Create x/y linear scales.
        var xLinearScale = xScale(demoData, xaxis, chartWidth);
        var yLinearScale = yScale(demoData, yaxis, chartHeight);

        // Create initial axis functions.
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // Append x axis.
        var xAxis = chartGroup.append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(bottomAxis);

        svg.append("text")
            .attr("transform",
                "translate(" + (width / 2) + " ," +
                (height + margin.top + 215) + ")")
            .style("text-anchor", "middle")
            .text("In Poverty (%)");

        // text label for the y axis
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", 0 - (height / 1.5))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Lacks Healthcare (%)");

        // Append y axis.
        var yAxis = chartGroup.append("g")
            .call(leftAxis);

        // Set data used for circles.
        var circlesGroup = chartGroup.selectAll("circle")
            .data(demoData);

        // Bind data.
        var elemEnter = circlesGroup.enter();

        // Create circles.
        var circle = elemEnter.append("circle")
            .attr("cx", d => xLinearScale(d[xaxis]))
            .attr("cy", d => yLinearScale(d[yaxis]))
            .attr("r", 15)
            .classed("stateCircle", true);

        // Circles to plot onto the graph.
        var circleText = elemEnter.append("text")
            .attr("x", d => xLinearScale(d[xaxis]))
            .attr("y", d => yLinearScale(d[yaxis]))
            .attr("dy", ".35em")
            .text(d => d.abbr)
            .classed("stateText", true);

    }).catch(function(err) {
        console.log(err);
    });
}
scatterPlot();