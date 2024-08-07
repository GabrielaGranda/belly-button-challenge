// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata_field = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let filter = metadata_field.filter(value => value.id == sample);
   
    // Use d3 to select the panel with id of `#sample-metadata`
    let selection = d3.select('#sample-metadata');

    // Use `.html("") to clear any existing metadata
    selection.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(filter[0]).forEach(([key, value]) => {
      selection.append("h6").text(`${key.toUpperCase()}: ${value}`);
  });

  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let sample_field = data.samples;

    // Filter the samples for the object with the desired sample number
    let filter = sample_field.filter(value => value.id == sample);

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = filter[0].otu_ids;
    let otu_labels = filter[0].otu_labels;
    let sample_values = filter[0].sample_values;
    
    // Build a Bubble Chart
    let trace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Bluered"
            }
        };

    // Render the Bubble Chart
    let layout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Number of Bacteria"},
  };
    Plotly.newPlot("bubble", [trace], layout)

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let trace1 = {
      y: otu_ids.map(otu_id => `OTU ${otu_id}`).slice(0,10).reverse(),
      x: sample_values.slice(0,10).reverse(),
      text: otu_labels.slice(0,10),
      type: "bar",
      orientation: 'h'
    };

    // Build a Bar Chart
    let layout1 = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {title: "Number of Bacteria"},
      margin: {
        l: 100,
        r: 20,
        b: 100,
        t: 35,
        pad: 4}
  };
    // Don't forget to slice and reverse the input data appropriately
    // Render the Bar Chart
    Plotly.newPlot("bar", [trace1], layout1)
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let name = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select(`#selDataset`)

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (id of name){
      dropdown.append("option").text(id).property("value", id);
    };

    // Get the first sample from the list
    let first = name[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(first);
    buildCharts(first);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();
