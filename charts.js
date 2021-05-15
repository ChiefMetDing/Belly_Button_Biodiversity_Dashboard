function init(){
    var selector = d3.select("#selDataset");
    d3.json("samples.json").then((data)=>{
        //console.log(data);
        var sampleNames = data.names;
        sampleNames.forEach((sample)=>{
            selector
                .append('option')
                .text(sample)
                .property('value',sample);
        });
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    })  
}

function optionChanged(newSample){
    //console.log(newSample);
    buildMetadata(newSample);
    buildCharts(newSample);
}

function buildMetadata(sample){
    d3.json("samples.json").then((data)=>{
        let metadata = data.metadata;
        let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        let result = resultArray[0]
        let PANEL = d3.select("#sample-metadata")

        PANEL.html("");
        
        Object.entries(result).forEach(function(x){
            let line = PANEL.append("h6")
            line.attr("class","font-weight-bold")
            line.text(x[0].toUpperCase()+" : "+x[1])
            
        })
    })
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
    // 2. Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {
      // 3. Create a variable that holds the samples array. 
        let samples = data. samples;
        let metadata = data.metadata;
      // 4. Create a variable that filters the samples for the object with the desired sample number.
        let resultSample = samples.filter(sampleObj => parseInt(sampleObj.id) == sample)
        let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      //  5. Create a variable that holds the first sample in the array.
        let result = resultSample[0]  
        let metaResult = resultArray[0]
        let washFreq = parseInt(metaResult.wfreq)
        //console.log(washFreq)
      // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
        let otu_ids = result.otu_ids
        // console.log(otu_ids)
        let otu_labels = result.otu_labels
        // console.log(otu_labels)
        let sample_values = result.sample_values
        // console.log(sample_values)
      // 7. Create the yticks for the bar chart.
      // Hint: Get the the top 10 otu_ids and map them in descending order  
      //  so the otu_ids with the most bacteria are last. 
      let yticks = otu_ids.slice(0,10).reverse()
      let y = yticks.map(ytick => "OTU " + ytick.toString())
      let hoverLabels=otu_labels.slice(0,10).reverse()
  
      // 8. Create the trace for the bar chart. 
      let barTrace = {
        x:sample_values.slice(0,10).reverse(),
        y:y,
        type:"bar",
        marker:{color:"black"},
        orientation:"h",
        text: hoverLabels
      }
       let bubbleTrace = {
        x:otu_ids,
        y:sample_values,
        mode:'markers',
        marker:{
          size:sample_values,
          color:otu_ids
        },
        text:otu_labels
      }
      let gaugeTrace = {
        domain:{x:[0,1],y:[0,1]},
        value:washFreq,
        title:{text:"Scrubs per Week",font:{size:15}},
        type:"indicator",
        mode:"gauge+number",
        gauge:{
          axis:{range:[null,10]},
          bar:{color:"black"},
          steps:[
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "lightgreen" },
            { range: [8, 10], color: "green" }
          ]
        }
      }
      let barData = [barTrace]
      let bubbleData = [bubbleTrace]
      let gagueData = [gaugeTrace]
      // 9. Create the layout for the bar chart. 
      let barLayout = {
          title:"Top 10 Bacteria Cultures Found",
          font: {size: 12,color:"white"},
          plot_bgcolor:"rgb(75, 75, 0)",
          paper_bgcolor:"rgb(75, 75, 0)",
          xaxis: {range: [0, Math.max(...sample_values.slice(0,10).reverse())]}
      };
      let bubbleLayout = {
        title:"Bacteria Cultures Per Sample",
        font: {size: 18,color:"white"},
        plot_bgcolor:"rgb(75, 75, 0)",
        paper_bgcolor:"rgb(75, 75, 0)",
        hovermode:'closest',
        xaxis:{
          title:"OTU ID"
        },
        xaxis: {range: [0, Math.max(...otu_ids)]},
        yaxis: {range: [0, Math.max(...sample_values)]}
      }
      let gaugeLayout = {
        title:"Belly Button Washing Frequency",
        font: {size: 18,color:"white"},
        plot_bgcolor:"rgb(75, 75, 0)",
        paper_bgcolor:"rgb(75, 75, 0)",
        width: 500,
        height: 400
      }
      barInitData = [{
        x:null,
        y:y,
        type:"bar",
        marker:{color:"black"},
        orientation:"h",
        text: hoverLabels
      }]
      let bubbleInitData = [{
        x:otu_ids,
        y:null,
        mode:'markers',
        marker:{
          size:sample_values,
          color:otu_ids
        },
        text:otu_labels
      }]



      // 10. Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar",barInitData,barLayout)
      Plotly.animate("bar",{data:barData,layout:barLayout},{transition:{duration:500,easing:"cubic-in-out"},frame:{duration:500}})
      Plotly.newPlot("bubble",bubbleInitData,bubbleLayout)
      Plotly.animate("bubble",{data:bubbleData,layout:bubbleLayout},{transition:{duration:500,easing:"cubic-in-out"},frame:{duration:500}})
      Plotly.newPlot("gauge",gagueData,gaugeLayout)
      
    });
  }

d3.selectAll('#dropdownMenu').on('change',optionChanged);

init();