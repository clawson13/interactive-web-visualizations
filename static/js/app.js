// Read in samples.json from the URL
const samples = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Function that contains instructions at page load/refresh
// Function does not run until called
function init(){
    // Code that runs once (only on page load or refresh)
    // Fetch the JSON data and console log it to confirm retrieval
    d3.json(samples).then(function(data) {
        console.log(data);
        // Populate the dropdown menu with the sample ids
        let id_select = d3.select('#selDataset');
        for(let i=0; i<data.names.length; i++){
            id_select.append("option")
            .text(data.names[i])
            .attr("value", data.names[i])
        }
    });

    // Run functions to generate plots
    createScatter('940')
    createBar('940')
    createSummary('940')
    createGauge('940')

}

// Function that runs whenever the dropdown is changed
function optionChanged(newID){
    // code that updates graphics
    createScatter(newID)
    createBar(newID)
    createSummary(newID)
    createGauge(newID)
}

function createScatter(id){
    // Code that makes scatter plot at id='bubble'
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
    // Checking to see if function is running
    console.log(`This function generates scatter plot of ${id} `)
}

function createBar(id){
    // Code that makes bar chart at id='bar'
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
            
    // Checking to see if function is running
    console.log(`This function generates bar chart of ${id} `)

}

function createSummary(id){
    // Code that makes list, paragraph, text/linebreaks at id='sample-metadata'
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
    // Checking to see if function is running
    console.log(`This function generates summary info of ${id} `)
}

function createGauge(id){
    // Code that gauge chart at id='gauge'
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
    // Checking to see if function is running
    console.log(`This function generates summary info of ${id} `)
}

// Function called, runs init instructions
// Runs only on load and refresh of browser page
init();

