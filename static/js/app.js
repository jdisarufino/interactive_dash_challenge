// // Preview 'samples.json' in the Console
// d3.json("data/samples.json").then(function(allData) {
//   console.log("All json data:", allData);
//   console.log("Name Object:", allData.names);
//   console.log("Samples Object:", allData.samples);
// });

// Build panel metadata | use nameID to match metadata in input to html panel
function buildMetadata(nameID) { // pulling metadata for the info panel
  d3.json("data/samples.json").then(function(allData) {
    var metadata = allData.metadata;
      console.log("metadata", metadata);
    var resultList = metadata.filter(choice => choice.id == nameID); // only 2 equal signs is a fuzzy match, especailly since names and ids are strings and integers in the data json file
      console.log("resultList", resultList);
    var oneResult = resultList[0]; // here the nameID resides in the first index [0]
      console.log("metadata oneResult", oneResult);
    var thePanel = d3.select("#sample-metadata");
    thePanel.html(""); // keeps the html cleared out writing a blank string
    Object.entries(oneResult).forEach(function([key,value]) {
      thePanel.append("p").append("strong").text(`${key}: ${value}`);
    });
  });
};

// Build all charts | 
function buildCharts(nameID) {
  d3.json("data/samples.json").then(allData => {
    var samples = allData.samples; // Called "samples" in 'samples.json'
    var resultList = samples.filter(choice => choice.id == nameID); // only 2 equal signs is a fuzzy match, especailly since names and ids are strings and integers in the data json file
    var oneResult = resultList[0];
    // Call data lists objects as variables
    var otu_ids = oneResult.otu_ids;
    var otu_labels = oneResult.otu_labels;
    var sample_values = oneResult.sample_values;

    // BAR CHART
    var yticks = otu_ids //this is the slice and dice the data to get top ten before sending to barchart
      .slice(0, 10)
      .map(id => `OTU ${id}`)
      .reverse();
    var barChart = [
      {
        y:yticks,
        x:sample_values.slice(0, 10).reverse(),
        text:otu_labels.slice(0, 10).reverse(),
        type:"bar",
        orientation:"h",
        marker: {
          color: 'rgb(134,170,255)'
        }
      }
    ];
    var barLayout = {
      title: `Belly Button Goo of test subject #${nameID}`,
      xaxis: { title: "Sample Values" },
      yaxis: { title: "Top 10 OTU"}
    };
    Plotly.newPlot("bar", barChart, barLayout);

    // BUBBLE CHART
    var bubbleChart = [
      {
        x:otu_ids,
        y:sample_values,
        text:otu_labels,
        mode:"markers",
        marker:{
          size: sample_values,
          color: otu_ids,
          colorscale: "Hot"
        }
      }
    ];
    var bubbleLayout = {
      title:"Bubbles!",
      xaxis:{ title: "OTU IDs" },
      yaxis: { title: "Sample Values"}
    };
    Plotly.newPlot("bubble", bubbleChart, bubbleLayout);  
  });
}

function init() {
  // Create dropdown | loop through allData.names and add an html 'option'
  const dropDown = d3.select("#selDataset");
  d3.json("data/samples.json").then(allData => {
      console.log(allData); // Preview allData
    var allNameIDs = allData.names;
      console.log(allNameIDs); // Preview id names
    allNameIDs.forEach(function(nameID) {
      dropDown.append("option").text(nameID).property("value", nameID);
    });
  var oneSample = allNameIDs[0];
  buildCharts(oneSample);
  buildMetadata(oneSample);  
  });
}

// Option changed function | 
function optionChanged(nameID) {
  buildCharts(nameID);
  buildMetadata(nameID);
}

// Run it
init();