function buildMetadata(sample) {

    // @TODO: Complete the following function that builds the metadata panel
  
    // Use `d3.json` to fetch the metadata for a sample
    const url_metaData = `/metadata/<${sample}>`; 
  
    d3.json(url_metaData).then((response)=>{
      console.log(response);
  
      // Use d3 to select the panel with id of `#sample-metadata`
      const sampMetaPanel = d3.select('#sample-metadata');
  
      // Use `.html("") to clear any existing metadata
      sampMetaPanel.html("");
  
      // Use `Object.entries` to add each key and value pair to the panel
      Object.entries(response).forEach(([key,value])=>{
        sampMetaPanel.append("h6").text(`${key}:${value}`);
      });
      // BONUS: Build the Gauge Chart
      // buildGauge(data.WFREQ);
  
    })
      
  }
  
  function buildCharts(sample) {
  
    // @TODO: Use `d3.json` to fetch the sample data for the plots
    const url_sampleData = `/samples/${sample}`
    d3.json(url_sampleData).then((response)=>{
  
      const otu_ids = response.otu_ids;
      const otu_labels = response.otu_labels;
      const sample_values = response.sample_values;
      // @TODO: Build a Bubble Chart using the sample data
      const bubble_layout = {
        margin: { t: 0 },
        hovermode: "closest",
        xaxis: { title: "OTU ID" }
      };
      const bubble_data = [
        {
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: "markers",
          marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: "Earth"
          }
        }
      ];
  
      Plotly.plot("bubble", bubble_data, bubble_layout);
      // @TODO: Build a Pie Chart
      const pie_data = [
        {
          values: sample_values.slice(0, 10),
          labels: otu_ids.slice(0, 10),
          hovertext: otu_labels.slice(0, 10),
          hoverinfo: "hovertext",
          type: "pie"
        }
      ];
  
      const pie_layout = {
        margin: { t: 0, l: 0 }
      };
  
      Plotly.plot("pie", pie_data, pie_layout);
    });
      
  }
  
  function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("/names").then((sampleNames) => {
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      const firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
  }
  
  // Initialize the dashboard
  init();