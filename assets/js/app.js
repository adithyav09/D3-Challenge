var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// Function used for updating x-scale var upon click on axis label.
function xScale(data, chosenXAxis, chartWidth) {
    // Create scales.
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis]) * .8,
            d3.max(data, d => d[chosenXAxis]) * 1.1
        ])
        .range([0, chartWidth]);
    return xLinearScale;
}

// Function used for updating y-scale var upon click on axis label.
function yScale(data, chosenYAxis, chartHeight) {
    // Create scales.
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenYAxis]) * .8,
            d3.max(data, d => d[chosenYAxis]) * 1.2
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
    // Margins.
    var margin = {
        top: 50,
        right: 50,
        bottom: 100,
        left: 80
    };

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
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

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
        var xLinearScale = xScale(demoData, chosenXAxis, chartWidth);
        var yLinearScale = yScale(demoData, chosenYAxis, chartHeight);

        // Create initial axis functions.
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // Append x axis.
        var xAxis = chartGroup.append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(bottomAxis);

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
            .attr("cx", d => xLinearScale(d[chosenXAxis]))
            .attr("cy", d => yLinearScale(d[chosenYAxis]))
            .attr("r", 15)
            .classed("stateCircle", true);

        // Create circle text.
        var circleText = elemEnter.append("text")
            .attr("x", d => xLinearScale(d[chosenXAxis]))
            .attr("y", d => yLinearScale(d[chosenYAxis]))
            .attr("dy", ".35em")
            .text(d => d.abbr)
            .classed("stateText", true);

    }).catch(function(err) {
        console.log(err);
    });
}
scatterPlot();