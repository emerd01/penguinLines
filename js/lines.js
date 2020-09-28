/*var yearsData = [
    {
        year:2000,
        amt1:1000,
        amt2:2000
    },
    {
        year:2001,
        amt1:null,
        amt2:2000
    },
    {
        year:2002,
        amt1:1000,
        amt2:2000
    },
    {
        year:2010,
        amt1:1200,
        amt2:1800
    },
    {
        year:2020,
        amt1:800,
        amt2:500
    }
]

console.log("yearsData", yearsData)

var xScale = d3.scaleLinear()
                .domain([2000,2020])
                .range([0,600])

var yScale = d3.scaleLinear()
                .domain([0,1200])
                .range([590,20])



var lineGenerator = d3.line()
                    .x(function(yearRec)
                      {
                        return xScale(yearRec.year)
                    })
                    .y(function(yearRec)
                      {
                        return yScale(yearRec.amt1)
                    })
                    .curve(d3.curveCardinal)
                    .defined(function(weight)
                            {
                        if(weight.amt1)
                            {
                                return true
                            }
                        else
                            {
                                return false
                            }
                    })

console.log("linegen", lineGenerator(yearsData))




d3.select("svg")
    .append("path")
    .datum(yearsData)
    .attr("d", lineGenerator)
    
*/



//penguins is the array of data
//target is the selection of the g element to place the graph in
//xscale,yscale are the x and y scales.
var drawLines = function (penguins, target,
    xScale, yScale) {
    var lineGenerator = d3.line()
        .x(function (quiz) {
            return xScale(quiz.day)
        })
        .y(function (quiz) {
            return yScale(quiz.grade)
        })
        .curve(d3.curveCardinal)

    var lines = d3.select("svg")
        .select("#graph")
        .selectAll("g")
        .data(penguins)
        .enter()
        .append("g")
        .classed("line", true)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 10)
        .on("mouseover", function (penguin) {
            if (!d3.select(this).classed("off")) {
                d3.selectAll(".line")
                    .classed("selected", false)

                d3.select(this)
                    .classed("selected", true)
                    .raise()


            }
            var xPos = d3.event.pageX;
            var yPos = d3.event.pageY;

            d3.select("#tooltip")
                .classed("hidden", false)
                .style("top", yPos + "px")
                .style("left", xPos + "px")
            d3.select("#pics")
                .attr("src", "imgs/" + penguin.picture)
        })
        .on("mouseout", function (penguin) {
            if (!d3.select(this).classed("off")) {
                d3.selectAll(".line")
                    .classed("selected", false)
            }
            d3.select("#tooltip")
                .classed("hidden", true)



        })


    lines.append("path")
        .datum(function (penguin) {
            return penguin.quizes

        })
        .attr("d", lineGenerator)

}

/*
var createLegend = function(screen, margins, graph, target)
{
    var legend = d3.select(target)
                    .append("g")
                    .classed("legend", true)
                    .attr("transform", "translate("+(margins.left + 10) + "," + (margins.top + 10) + ")")
    var entries  = legend.selectAll("g")
    .data(penguins)
    .enter()
    .append("g")
    .classed("legendEntry", true)
    .attr("fill", function)
}
*/

var makeTranslateString = function (x, y) {
    return "translate(" + x + "," + y + ")";
}


//graphDim is an object that describes the width and height of the graph area.
//margins is an object that describes the space around the graph
//xScale and yScale are the scales for the x and y scale.
var drawAxes = function (graphDim, margins,
    xScale, yScale) {

    var xAxis = d3.axisBottom()
        .scale(xScale)

    var yAxis = d3.axisLeft()
        .scale(yScale)

    var axes = d3.select("svg")
        .append("g")
    axes.append("g")
        .attr("transform", makeTranslateString(margins.left, margins.top + graphDim.height))
        .call(xAxis)
    axes.append("g")
        .attr("transform", makeTranslateString(margins.left, margins.top))
        .call(yAxis)
    /*   
    d3.select("svg")
        .append("g")
        .attr("class", "axis")
        .attr("transform", makeTranslateString(margins.left + 10, graphDim.height))
        .call(xAxis)

    d3.select("svg")
        .append("g")
        .attr("class", "axis")
        .attr("transform", makeTranslateString(margins.left + 10, 0))
        .call(yAxis)
*/

}

//graphDim -object that stores dimensions of the graph area
//margins - object that stores the size of the margins
var drawLabels = function (graphDim, margins) {
    var labels = d3.select("svg")
        .append("g")
        .classed("labels", true)

    labels.append("text")
        .text("Penguin Quiz Scores")
        .classed("title", true)
        .attr("text-anchor", "middle")
        .attr("x", margins.left + (graphDim.width / 2))
        .attr("y", margins.top - 10)
    labels.append("text")
        .text("Progress Through the Semester")
        .classed("label", true)
        .attr("text-anchor", "middle")
        .attr("x", margins.left + (graphDim.width / 2))
        .attr("y", graphDim.height + 85)

    labels.append("g")
        .attr("transform", "translate(0," +
            ((graphDim.height / 2)) + ")")
        .append("text")
        .text("Score on Quiz")
        .classed("label", true)
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(90)")
}


//sets up several important variables and calls the functions for the visualization.
var initGraph = function (penguins) {
    //size of screen
    var screen = {
        width: 800,
        height: 700
    }
    //how much space on each side
    var margins = {
        left: 35,
        right: 20,
        top: 50,
        bottom: 50
    }



    var graph = {
        width: screen.width - margins.left - margins.right,
        height: screen.height - margins.top - margins.bottom
    }
    console.log(graph);

    d3.select("svg")
        .attr("width", screen.width)
        .attr("height", screen.height)

    var target = d3.select("svg")
        .append("g")
        .attr("id", "graph")
        .attr("transform",
            "translate(" + margins.left + "," +
            margins.top + ")");

    var maxDay = d3.max(penguins[0].quizes,
        function (quiz) {
            return quiz.day
        });

    var xScale = d3.scaleLinear()
        .domain([1, maxDay])
        .range([0, graph.width])

    var yScale = d3.scaleLinear()
        .domain([0, 10])
        .range([graph.height, 0])

    drawAxes(graph, margins, xScale, yScale);
    drawLines(penguins, target, xScale, yScale);
    drawLabels(graph, margins);

}




var successFCN = function (penguins) {
    console.log("penguins", penguins);
    initGraph(penguins);
}

var failFCN = function (error) {
    console.log("error", error);
}

var polPromise = d3.json("classData.json")
polPromise.then(successFCN, failFCN);
