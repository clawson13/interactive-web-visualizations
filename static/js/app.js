// Read in samples.json from the URL
const samples = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

  // OUTLINE
// 1.  Webpage will have the following:
//     *  Dropdown that will allow selection of a name/id
//     *  Horizontal bar chart that shows data related to only the id
//     *  Bubble chart shows data related only to id
//     *  Summary section that only shows data related to id
// 2.  So every graphic is needs the id and the only part that is independent is the dropdown
// 3.  The dropdown has many options so it needs created dynamically based on what is in the data file
// 4.  The page will load with a default selected id but needs to update based on the dropdown selection
//     *  This tells me that I need to run code once and then same code again with only an id change.
//     *  Thi sounds like a good time to use a function like  `createPlot(id)`
// 5.  Note:  The html already has several things built-in:
//     a.  you are given empty divs with ids called:
//         *  `selDataset` ==> used for the dropdown
//         *  `sample-metadata` ==> used for the summary data section
//         *  `bar` ==> used for the horizontal bar chrt
//         *  `gauge` ==> (optional) used for gauge chart
//         *  `bubble` ==> used for bubble chart
//     b.  There is an inline event handler in the html.  It looks like this:
//         `<select id="selDataset" onchange="optionChanged(this.value)"></select>`
//         This line of code is part of the dropdown, aka in html terms a `select`
//         If you look up the code for a select it is made up of options (dropdown entries)
//         and values associated with each option.  The value for the select is based on what option is selected.
//         i.e.  Dropdown has selected 'Subject 940' and maybe the value associated with this is `940`.
//               The '940' is captured by using 'this.value'... So 'this.value' captures the current selection value.
//               The 'optionChanged()' is a function that you need to make in your app.js that updates
//               some type of data filter that filters the data only related to '940' and then that 
//               data is used in all the charts.
//     c.  On Day 3 we will cover event handlers from the js file but we do not cover inline event handlers in the html.  
//         The only differene is where we call them but otherwise they work the same.
//     d.  You already have the data connected - notice the names list matches the id's used in the 
//         other data structures below.  Inspect the data - there are several sections - which one would 
//         be used for each chart.  Look at the images in the readme and matchup the data.  There is not
//         much that needs done except filtering and ordering of the existing data.



// SAMPLE STRUCTURE
// 1.  Check inspector console to see if each function is running on page load


// function that contains instructions at page load/refresh
// function does not run until called
function init(){
    // code that runs once (only on page load or refresh)
    // Fetch the JSON data and console log it to confirm retrieval
    d3.json(samples).then(function(data) {
        console.log(data);

        let id_select = d3.select('#selDataset');
        for(let i=0; i<data.names.length; i++){
            id_select.append("option")
            .text(data.names[i])
            .attr("value", data.names[i])
        }
        
    });

    // run functions to generate plots
    createScatter('940')
    createBar('940')
    createSummary('940')
    createGauge('940')

}

// function that runs whenever the dropdown is changed
// this function is in the HTML and is called with an input called 'this.value'
// that comes from the select element (dropdown)
function optionChanged(newID){
    // code that updates graphics
    // one way is to recall each function
    createScatter(newID)
    createBar(newID)
    createSummary(newID)
    createGauge(newID)

}

function createScatter(id){
    // code that makes scatter plot at id='bubble'
    d3.json(samples).then(function(data) {
        for(let i=0; i<data.samples.length; i++){
            if (data.samples[i].id == id) {
                let ids = data.samples[i].otu_ids;
                let values = data.samples[i].sample_values;
                let labels = data.samples[i].otu_labels;

                var trace1 = {
                    x: ids,
                    y: values,
                    text: labels,
                    mode: 'markers',
                    marker: {
                      color: ids,
                      size: values,
                      colorscale: 'Earth'
                    }
                  };
                  
                  var data = [trace1];
                  
                  var layout = {
                    // title: list(text = "OTU ID", y = 0.05),
                    title: {'text': "OTU ID",
                        'y': 0.05},
                    showlegend: false,
                  };
                  
                  Plotly.newPlot('bubble', data, layout);

              } else {};
    }})
    // checking to see if function is running
    console.log(`This function generates scatter plot of ${id} `)
}

function createBar(id){
    // code that makes bar chart at id='bar'
    d3.json(samples).then(function(data) {
        for(let i=0; i<data.samples.length; i++){
            if (data.samples[i].id == id) {
                let ids = data.samples[i].otu_ids.slice(0,10);
                let values = data.samples[i].sample_values.slice(0,10);
                let labels = data.samples[i].otu_labels.slice(0,10);

                let reversedIds = ids.reverse();
                let reversedValues = values.reverse();
                let reversedLabels = labels.reverse();
                
                let finalIds = reversedIds.map(function(ids) {
                    return `OTU ${ids}`;
                    });
                
                let trace1 = {
                    x: reversedValues,
                    y: finalIds,
                    text: reversedLabels,
                    type: "bar",
                    orientation: "h"
                  };

                let traceData = [trace1];

                let layout = {
                    barmode: "group"
                  };

                Plotly.newPlot('bar', traceData, layout);

              } else {};
    }})
            
    // checking to see if function is running
    console.log(`This function generates bar chart of ${id} `)

}

function createSummary(id){
    // code that makes list, paragraph, text/linebreaks at id='sample-metadata'
    d3.json(samples).then(function(data) {
        for(let i=0; i<data.metadata.length; i++){
            if (data.metadata[i].id == id) {
                let summary = d3.select('#sample-metadata');
                summary.join(
                    enter => enter.append("div")
                                  .html(`<strong>ethnicity: </strong>${data.metadata[i].id}<br>
                                  <strong>ethnicity: </strong>${data.metadata[i].ethnicity}<br>
                                  <strong>gender: </strong>${data.metadata[i].gender}<br>
                                  <strong>age: </strong>${data.metadata[i].age}<br>
                                  <strong>location: </strong>${data.metadata[i].location}<br>
                                  <strong>bbtype: </strong>${data.metadata[i].bbtype}<br>
                                  <strong>wfreq: </strong>${data.metadata[i].wfreq}`),
                    update => update.html(`<strong>ethnicity: </strong>${data.metadata[i].id}<br>
                                  <strong>ethnicity: </strong>${data.metadata[i].ethnicity}<br>
                                  <strong>gender: </strong>${data.metadata[i].gender}<br>
                                  <strong>age: </strong>${data.metadata[i].age}<br>
                                  <strong>location: </strong>${data.metadata[i].location}<br>
                                  <strong>bbtype: </strong>${data.metadata[i].bbtype}<br>
                                  <strong>wfreq: </strong>${data.metadata[i].wfreq}`)
                  )
              } else {};
    }})
    // checking to see if function is running
    console.log(`This function generates summary info of ${id} `)
}

function createGauge(id){
    // code that gauge chart at id='gauge'
    d3.json(samples).then(function(data) {
        for(let i=0; i<data.metadata.length; i++){
            if (data.metadata[i].id == id) {
                var level = data.metadata[i].wfreq / 9 * 180;

                // Trig to calc meter point
                var degrees = 180 - level,
                    radius = .5;
                var radians = degrees * Math.PI / 180;
                var x = radius * Math.cos(radians);
                var y = radius * Math.sin(radians);

                // Path: may have to change to create a better triangle
                var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
                    pathX = String(x),
                    space = ' ',
                    pathY = String(y),
                    pathEnd = ' Z';
                var path = mainPath.concat(pathX,space,pathY,pathEnd);

                var data = [{ type: 'scatter',
                x: [0], y:[0],
                    marker: {size: 28, color:'850000'},
                    showlegend: false,
                    name: 'Scrubs',
                    text: data.metadata[i].wfreq,
                    hoverinfo: 'text+name'},
                { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
                rotation: 90,
                text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3',
                            '1-2', '0-1', ''],
                textinfo: 'text',
                textposition:'inside',
                marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(46, 136, 7, .5)', 'rgba(78, 145, 14, .5)', 'rgba(110, 154, 22, .5)',
                                'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                                'rgba(210, 206, 145, .5)', 'rgba(221, 216, 174, .5)', 'rgba(232, 226, 202, .5)',
                                'rgba(255, 255, 255, 0)']},
                labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
                hoverinfo: 'label',
                hole: .5,
                type: 'pie',
                showlegend: false
                }];

                var layout = {
                shapes:[{
                    type: 'path',
                    path: path,
                    fillcolor: '850000',
                    line: {
                        color: '850000'
                    }
                    }],
                title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
                height: 500,
                width: 500,
                xaxis: {zeroline:false, showticklabels:false,
                            showgrid: false, range: [-1, 1]},
                yaxis: {zeroline:false, showticklabels:false,
                            showgrid: false, range: [-1, 1]}
                };

                Plotly.newPlot('gauge', data, layout);

              } else {};
    }})
    // checking to see if function is running
    console.log(`This function generates summary info of ${id} `)
}

// function called, runs init instructions
// runs only on load and refresh of browser page
init()





// STRATEGIES
// 1.  Inside-Out:  Generate each chart by assuming an ID/name then refactor the code to 
//                  work for any ID/name coming from the function.  I typically do this practice.
// 2.  Outside-In:  Generate the control (dropdown) and how the control interacts with the other parts.
//                  I gave you the basics of how it interacts above.  You could generate the dropdown
//                  and then see in the console the ID/names update as you make a change.  Then you could
//                  make your chart code.

// Overall, the above are the two steps you need to do (1.  Make plots with data, 2. make dropdown that passes id to functions)
// You could do it in either order.
