function _1(md){return(
md`# AnuranSet`
)}

function _anuraset_per_class_f1_counts(__query,FileAttachment,invalidation){return(
__query(FileAttachment("anuraset_per_class_f1_counts.csv"),{from:{table:"anuraset_per_class_f1_counts"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation)
)}

function _data(FileAttachment){return(
FileAttachment("anuraset_per_class_f1_counts.csv").csv({typed: true})
)}

function _4(data){return(
data.slice(0, 5)
)}

function _dataWithRarity(data){return(
data.map(d => {
  let rarity;
  if (d.n_samples < 50) rarity = "rare";
  else if (d.n_samples < 500) rarity = "frequent";
  else rarity = "common";

  return {...d, rarity};
})
)}

function _6(dataWithRarity){return(
dataWithRarity[0]
)}

function _frogColors(){return(
new Map([
  ["rare",     "#43123F"],  // Plum Purple (danger / rare)
  ["frequent", "#7E0950"],  // Deep Magenta (active but unstable)
  ["common",   "#C4C600"]   // Goldenrod Yellow (toxic warning / dominant)
])
)}

function _imbalancePerfPlot(Plot,frogColors,dataWithRarity)
{
  const plot = Plot.plot({
    title: "Transformer AST — Per-Species Performance vs Dataset Imbalance",
    width: 850,
    height: 520,
    marginTop:60,
    marginLeft: 70,
    marginBottom: 60,
    grid: true,
    
    // DARK THEME
    
    style: {
      background: "black",
      color: "white",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      fontSize: 13
    },
    x: {
      label: "Number of 3s samples per species",
      type: "linear"
    },
    y: {
      label: "F1 score (validation)",
      domain: [0, 1]
    },
    color: {
      legend: true,
      label: "Species rarity",
      domain: ["rare", "frequent", "common"],
      range: [
        frogColors.get("rare"),
        frogColors.get("frequent"),
        frogColors.get("common")
      ]
    },
    marks: [
      Plot.dot(dataWithRarity, {
        x: "n_samples",
        y: "f1",
        fill: "rarity",
        r: 10,
        opacity: 0.9,
        tip: false
      })
    ]
  });
  

  // Fix title and legend colors for dark theme
  
  setTimeout(() => {
    const title = plot.querySelector("h2");
    if (title) {
      title.style.color = "white";
    }
    
    // Target all text elements in the entire plot
    const allText = plot.querySelectorAll("text");
    allText.forEach(text => {
      text.setAttribute("fill", "white");
      text.style.fill = "white";
    });
    
    // Also target any spans or divs that might contain legend text
    
    plot.querySelectorAll("span, div").forEach(el => {
      if (el.textContent.trim()) {
        el.style.color = "white";
      }
    });
  }, 0);
  

  // Attach each row to its circle, by index

  const circles = plot.querySelectorAll("circle");
  circles.forEach((circle, i) => {
    circle.__row = dataWithRarity[i];
  });
  

  // Shared custom tooltip (white bg, black text)

  let tooltip = document.querySelector(".custom-heatmap-tooltip");
  if (!tooltip) {
    tooltip = document.body.appendChild(document.createElement("div"));
    tooltip.className = "custom-heatmap-tooltip";
    Object.assign(tooltip.style, {
      position: "fixed",
      pointerEvents: "none",
      zIndex: 9999,
      background: "white",
      color: "black",
      border: "1px solid black",
      borderRadius: "4px",
      padding: "6px 8px",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      fontSize: "12px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
      display: "none",
      whiteSpace: "pre"
    });
  }
  
  function hideTooltip() {
    tooltip.style.display = "none";
  }
  

  // Tooltip on dot hover

  plot.addEventListener("pointermove", (event) => {
    const { target, clientX, clientY } = event;
    if (target.tagName !== "circle" || !target.__row) {
      hideTooltip();
      return;
    }
    const d = target.__row;
    tooltip.textContent =
      `${d.label_name}\n` +
      `Samples: ${d.n_samples}\n` +
      `F1: ${d.f1.toFixed(3)}\n` +
      `Rarity: ${d.rarity}`;
    tooltip.style.display = "block";
    tooltip.style.left = clientX + 12 + "px";
    tooltip.style.top = clientY + 12 + "px";
  });
  
  plot.addEventListener("pointerleave", hideTooltip);
  
  return plot;
}


function _anuraset_f1_heatmap(__query,FileAttachment,invalidation){return(
__query(FileAttachment("anuraset_f1_heatmap.csv"),{from:{table:"anuraset_f1_heatmap"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation)
)}

function _speciesStats(FileAttachment){return(
FileAttachment("anuraset_per_class_f1_counts.csv").csv({typed: true})
)}

function _heatData(speciesStats){return(
speciesStats
  .filter(d => Number.isFinite(d.f1))
  .toSorted((a, b) => a.f1 - b.f1)
)}

function _f1StripPlot(Plot,heatData)
{
  const plot = Plot.plot({
    title: "Species F1 scores",
    width: 980,
    height: 220,
    marginBottom: 120,
    marginLeft: 60,
    
    // DARK THEME
    
    style: {
      background: "black",
      color: "white",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      fontSize: 13
    },
    x: {
      label: "Species",
      tickRotate: -90
    },
    y: {
      ticks: ["F1"],
      label: null
    },
    color: {
      type: "linear",
      label: "F1 score",
      domain: [0, 1],
      range: ["#43123F", "#7E0950", "#EC940C", "#C4C600"], // poison-frog gradient
      legend: true
    },
    marks: [
      Plot.cell(heatData, {
        x: "label_name",
        y: () => "F1",
        fill: "f1",
        inset: 1,
        tip: false 
      })
    ]
  });
  

  // Title and legend colors for dark theme

  setTimeout(() => {
    const title = plot.querySelector("h2");
    if (title) {
      title.style.color = "white";
    }
    
    // Target all text elements in the entire plot
    
    const allText = plot.querySelectorAll("text");
    allText.forEach(text => {
      text.setAttribute("fill", "white");
      text.style.fill = "white";
    });
    
    // Also target any spans or divs that might contain legend text
    
    plot.querySelectorAll("span, div").forEach(el => {
      if (el.textContent.trim()) {
        el.style.color = "white";
      }
    });
  }, 0);
  

  // Attach each row to its rect, by index
 
  const rects = plot.querySelectorAll("rect");
  rects.forEach((rect, i) => {
    rect.__row = heatData[i]; // { label_name, f1, n_samples, ... }
  });
  
  // Shared custom tooltip (white bg, black text)
 
  let tooltip = document.querySelector(".custom-heatmap-tooltip");
  if (!tooltip) {
    tooltip = document.body.appendChild(document.createElement("div"));
    tooltip.className = "custom-heatmap-tooltip";
    Object.assign(tooltip.style, {
      position: "fixed",
      pointerEvents: "none",
      zIndex: 9999,
      background: "white",
      color: "black",
      border: "1px solid black",
      borderRadius: "4px",
      padding: "6px 8px",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      fontSize: "12px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
      display: "none",
      whiteSpace: "pre"
    });
  }
  function hideTooltip() {
    tooltip.style.display = "none";
  }

  // Tooltip on cell hover
  
  plot.addEventListener("pointermove", (event) => {
    const { target, clientX, clientY } = event;
    if (target.tagName !== "rect" || !target.__row) {
      hideTooltip();
      return;
    }
    const d = target.__row;
    tooltip.textContent =
      `${d.label_name}\n` +
      `F1: ${d.f1.toFixed(3)}\n` +
      `Samples: ${d.n_samples}`;
    tooltip.style.display = "block";
    tooltip.style.left = clientX + 12 + "px";
    tooltip.style.top = clientY + 12 + "px";
  });
  plot.addEventListener("pointerleave", hideTooltip);
  return plot;
}


function _speciesStatsWithIndex(speciesStats){return(
speciesStats
)}

function _worstSpecies(speciesStatsWithIndex){return(
speciesStatsWithIndex
  .filter(d => Number.isFinite(d.f1))
  .toSorted((a, b) => a.f1 - b.f1)
  .slice(0, 5)
)}

function _frogGradient(){return(
["#43123F", "#7E0950", "#EC940C", "#C4C600"]
)}

function _speciesVoronoiPlot(Plot,frogGradient,speciesStatsWithIndex,worstSpecies)
{
  const plot = Plot.plot({
    title: "Species support vs performance",
    width: 900,
    height: 520,
    marginTop: 60,
    marginLeft: 80,
    marginBottom: 60,
    grid: true,
    
    // DARK THEME
    
    style: {
      background: "black",
      color: "white",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      fontSize: 13
    },
    x: {
      label: "Species index",
      tickFormat: d => d
    },
    y: {
      label: "Number of 3s samples (log scale)",
      type: "log"
    },
    color: {
      type: "linear",
      domain: [0, 1],
      range: frogGradient,
      label: "F1 score",
      legend: true
    },
    marks: [
      
      // Voronoi regions colored by F1
      
      Plot.voronoi(speciesStatsWithIndex, {
        x: "class_index",
        y: "n_samples",
        fill: "f1",
        stroke: "#222",
        strokeOpacity: 0.5,
        tip: false   // custom tooltip instead
      }),
      
      // Black dots at centers
      
      Plot.dot(speciesStatsWithIndex, {
        x: "class_index",
        y: "n_samples",
        r: 4,
        fill: "black",
        fillOpacity: 1,
        tip: false
      }),
      
      // Black labels for worst F1 species
      
      Plot.text(worstSpecies, {
        x: "class_index",
        y: d => d.n_samples,
        text: "label_name",
        dy: -8,
        fontSize: 11,
        fill: "black"
      })
    ]
  });
  

  // Fix title and legend colors for dark theme
 
  setTimeout(() => {
    const title = plot.querySelector("h2");
    if (title) {
      title.style.color = "white";
    }
    
    // Target all text elements in the entire plot
    
    const allText = plot.querySelectorAll("text");
    allText.forEach(text => {
      text.setAttribute("fill", "white");
      text.style.fill = "white";
    });
    
    // Also target any spans or divs that might contain legend text
    
    plot.querySelectorAll("span, div").forEach(el => {
      if (el.textContent.trim()) {
        el.style.color = "white";
      }
    });
  }, 0);
  
 
  // Attach the correct row to each dot, by INDEX
  // (1 circle per speciesStatsWithIndex row)
  
  const circles = plot.querySelectorAll("circle");
  circles.forEach((circle, i) => {
    circle.__row = speciesStatsWithIndex[i];  // {label_name, class_index, n_samples, f1, ...}
  });
 
  // Custom tooltip 
  
  let tooltip = document.querySelector(".custom-heatmap-tooltip");
  if (!tooltip) {
    tooltip = document.body.appendChild(document.createElement("div"));
    tooltip.className = "custom-heatmap-tooltip";
    Object.assign(tooltip.style, {
      position: "fixed",
      pointerEvents: "none",
      zIndex: 9999,
      background: "white",
      color: "black",
      border: "1px solid black",
      borderRadius: "4px",
      padding: "6px 8px",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      fontSize: "12px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
      display: "none",
      whiteSpace: "pre"
    });
  }
  function hideTooltip() {
    tooltip.style.display = "none";
  }
 
  // Tooltip on dot hover
  
  plot.addEventListener("pointermove", (event) => {
    const { target, clientX, clientY } = event;
    if (target.tagName !== "circle" || !target.__row) {
      hideTooltip();
      return;
    }
    const d = target.__row;
    const label = d.label_name ?? "(unknown)";
    const idx = d.class_index;
    const samples = d.n_samples;
    const f1 = d.f1 != null ? d.f1.toFixed(3) : "N/A";
    tooltip.textContent =
      `${label}\n` +
      `Index: ${idx}\n` +
      `Samples: ${samples}\n` +
      `F1: ${f1}`;
    tooltip.style.display = "block";
    tooltip.style.left = clientX + 12 + "px";
    tooltip.style.top = clientY + 12 + "px";
  });
  plot.addEventListener("pointerleave", hideTooltip);
  return plot;
}


function _17(d3){return(
d3.version
)}

function _confusionMatrixData(FileAttachment){return(
FileAttachment("confusion_matrix.json").json()
)}

function _d3(require){return(
require("d3@7")
)}

function _confusionMatrixPlot(Plot,frogGradient,confusionMatrixData,d3)
{
  const plot = Plot.plot({
    title: "Predicted vs True Species Confusion matrix",
    width: 1000,
    height: 900,
    marginLeft: 60,
    marginRight: 90,
    marginTop: 40,
    marginBottom: 60,
    padding: 0,
    
    // Dark theme 
    
    style: {
      background: "black",
      color: "white",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      fontSize: 13
    },
    x: {
      label: "Predicted species (j)",
      tickRotate: -90,
      tickSize: 0
    },
    y: {
      label: "True species present (i)",
      tickSize: 0
    },
    color: {
      type: "linear",
      range: frogGradient,
      label: "P(predicted j | true i present)",
      legend: true
    },
    marks: [
      Plot.cell(confusionMatrixData, {
        x: "j",
        y: "i",
        fill: "value",
        inset: 0,
        tip: false // we'll use the custom tooltip instead
      })
    ]
  });

  // Fix title and legend colors for dark theme

  setTimeout(() => {
    const title = plot.querySelector("h2");
    if (title) {
      title.style.color = "white";
    }
    
    // Target all text elements in the entire plot
    
    const allText = plot.querySelectorAll("text");
    allText.forEach(text => {
      text.setAttribute("fill", "white");
      text.style.fill = "white";
    });
    
    // Also target any spans or divs that might contain legend text
    
    plot.querySelectorAll("span, div").forEach(el => {
      if (el.textContent.trim()) {
        el.style.color = "white";
      }
    });
  }, 0);
  
  // Attach original rows to each rect (assumes 1:1 order)
  
  const rects = plot.querySelectorAll("rect");
  rects.forEach((rect, i) => {
    rect.__row = confusionMatrixData[i];
  });


  // Shared tooltip

  let tooltip = document.querySelector(".custom-heatmap-tooltip");
  if (!tooltip) {
    tooltip = document.body.appendChild(document.createElement("div"));
    tooltip.className = "custom-heatmap-tooltip";
    Object.assign(tooltip.style, {
      position: "fixed",
      pointerEvents: "none",
      zIndex: 9999,
      background: "white",
      color: "black",
      border: "1px solid black",
      borderRadius: "4px",
      padding: "6px 8px",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      fontSize: "12px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
      display: "none",
      whiteSpace: "pre"
    });
  }
  function hideTooltip() {
    tooltip.style.display = "none";
  }

  plot.addEventListener("pointermove", (event) => {
    const { target, clientX, clientY } = event;
    if (target.tagName !== "rect" || !target.__row) {
      hideTooltip();
      return;
    }
    const d = target.__row;
    const pStr = d.value != null ? d.value.toFixed(3) : "N/A";
    tooltip.textContent =
      `True: ${d.true_species}\n` +
      `Pred: ${d.pred_species}\n` +
      `P = ${pStr}`;
    tooltip.style.display = "block";
    tooltip.style.left = clientX + 12 + "px";
    tooltip.style.top = clientY + 12 + "px";
  });
  plot.addEventListener("pointerleave", hideTooltip);


  // NEW: Zoom & pan with d3-zoom

  const svg = plot.querySelector("svg");
  // Try to grab the main plot group (fallback to first <g> if needed)
  const g = svg.querySelector("g[aria-label='plot']") || svg.querySelector("g");

  const zoom = d3.zoom()
    .scaleExtent([1, 8])                    // min/max zoom
    .translateExtent([[0, 0], [1000, 900]]) // limit panning to canvas-ish area
    .on("zoom", (event) => {
      
      // Apply transform to the plot group
      
      const t = event.transform;
      g.setAttribute("transform", `translate(${t.x},${t.y}) scale(${t.k})`);
    });

  d3.select(svg).call(zoom);

  // Double click to reset zoom
  
  svg.addEventListener("dblclick", () => {
    d3.select(svg)
      .transition()
      .duration(250)
      .call(zoom.transform, d3.zoomIdentity);
  });

  return plot;
}


function _activity_heatmap(__query,FileAttachment,invalidation){return(
__query(FileAttachment("activity_heatmap.csv"),{from:{table:"activity_heatmap"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation)
)}

function _activityData(activity_heatmap){return(
activity_heatmap.flatMap(row =>
  Object.entries(row)
    .filter(([k]) => k !== "species")
    .map(([site, value]) => ({
      species: row.species,
      site,
      activity_rate: value
    }))
)
)}

function _uniqueSpecies(activityData){return(
[...new Set(activityData.map(d => d.species))].sort()
)}

function _uniqueSites(activityData){return(
[...new Set(activityData.map(d => d.site))].sort()
)}

function _siteFilter(Inputs,uniqueSites,html){return(
Inputs.select(
  ["All sites", ...uniqueSites],
  {
    label: html`<span style="color:white;">Filter by sites</span>`,
    value: "All sites"
  }
)
)}

function _speciesFilter(Inputs,uniqueSpecies,html){return(
Inputs.select(
  ["All species", ...uniqueSpecies],
  {
    label: html`<span style="color:white;">Filter by species</span>`,
    value: "All species"
  }
)
)}

function _filteredActivityData(activityData,speciesFilter,siteFilter){return(
activityData.filter(d =>
  (speciesFilter === "All species" || d.species === speciesFilter) &&
  (siteFilter === "All sites" || d.site === siteFilter)
)
)}

function _activityHeatmap(Plot,speciesFilter,siteFilter,uniqueSites,uniqueSpecies,frogGradient,filteredActivityData)
{
  const plot = Plot.plot({
    title: "Species Activity across Biomes",
    width: 900,
    height: speciesFilter === "All species" ? 820 : 260,
    marginLeft: 120,
    marginBottom: 80,
    marginRight: 100,
    
    // BLACK BG + WHITE TEXT
    
    style: {
      background: "black",
      color: "white",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      fontSize: 13
    },
    x: {
      label: "Site",
      tickRotate: -45,
      domain: siteFilter === "All sites"
        ? uniqueSites
        : [siteFilter]
    },
    y: {
      label: "Species",
      domain: speciesFilter === "All species"
        ? uniqueSpecies
        : [speciesFilter]
    },
    color: {
      type: "linear",
      range: frogGradient,
      label: "Activity rate",
      legend: true
    },
    grid: true,
    marks: [
      Plot.cell(filteredActivityData, {
        x: "site",
        y: "species",
        fill: "activity_rate",
        tip: false,   
        inset: 1
      })
    ]
  });
  
 
  // Fix title and legend colors for dark theme

  setTimeout(() => {
    const title = plot.querySelector("h2");
    if (title) {
      title.style.color = "white";
    }
    
    // Target all text elements in the entire plot
    
    const allText = plot.querySelectorAll("text");
    allText.forEach(text => {
      text.setAttribute("fill", "white");
      text.style.fill = "white";
    });
    
    // Also target any spans or divs that might contain legend text
    
    plot.querySelectorAll("span, div").forEach(el => {
      if (el.textContent.trim()) {
        el.style.color = "white";
      }
    });
  }, 0);
  

  // Attach original data rows to each rect

  const rects = plot.querySelectorAll("rect");
  rects.forEach((rect, i) => {
    rect.__row = filteredActivityData[i]; // { species, site, activity_rate, ... }
  });

  // Custom tooltip 

  let tooltip = document.querySelector(".custom-heatmap-tooltip");
  if (!tooltip) {
    tooltip = document.body.appendChild(document.createElement("div"));
    tooltip.className = "custom-heatmap-tooltip";
    Object.assign(tooltip.style, {
      position: "fixed",
      pointerEvents: "none",
      zIndex: 9999,
      background: "white",
      color: "black",
      border: "1px solid black",
      borderRadius: "4px",
      padding: "6px 8px",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      fontSize: "12px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
      display: "none",
      whiteSpace: "pre"
    });
  }
  function hideTooltip() {
    tooltip.style.display = "none";
  }
  plot.addEventListener("pointermove", (event) => {
    const { target, clientX, clientY } = event;
    if (target.tagName !== "rect" || !target.__row) {
      hideTooltip();
      return;
    }
    const d = target.__row;
    const activityPct = (d.activity_rate * 100).toFixed(2);
    tooltip.textContent =
      `Species: ${d.species}\n` +
      `Site: ${d.site}\n` +
      `Activity: ${activityPct}%`;
    tooltip.style.display = "block";
    tooltip.style.left = clientX + 12 + "px";
    tooltip.style.top = clientY + 12 + "px";
  });
  plot.addEventListener("pointerleave", hideTooltip);
  return plot;
}


function _species_activity_time_of_day_long(__query,FileAttachment,invalidation){return(
__query(FileAttachment("species_activity_time_of_day_long.csv"),{from:{table:"species_activity_time_of_day_long"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation)
)}

function _todOrder(){return(
["dawn", "dusk", "night"]
)}

function _speciesFilter2(Inputs,uniqueSpecies2,html){return(
Inputs.select(
  ["All species", ...uniqueSpecies2],
  {
    label: html`<span style="color:white;">Filter by species</span>`,
    value: "All species"
  }
)
)}

function _uniqueSpecies2(activity_heatmap){return(
[...new Set(activity_heatmap.map(d => d.species))].sort()
)}

function _filteredActivityTOD(speciesFilter2,species_activity_time_of_day_long){return(
speciesFilter2 === "All species"
  ? species_activity_time_of_day_long
  :species_activity_time_of_day_long.filter(d => d.species === speciesFilter2)
)}

function _speciesTODHeatmap(Plot,speciesFilter,todOrder,uniqueSpecies2,frogGradient,filteredActivityTOD)
{
  const plot = Plot.plot({
    title: "Species Activity across Time of Day",
    width: 850,
    height: speciesFilter === "All species" ? 900 : 250,
    marginLeft: 140,
    marginBottom: 80,
    inset: 12,
    
    // BLACK BG + WHITE TEXT
    
    style: {
      background: "black",
      color: "white",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      fontSize: 13
    },
    x: {
      label: "Time of day",
      domain: todOrder,
      tickRotate: -25
    },
    y: {
      label: "Species",
      domain: speciesFilter === "All species"
        ? uniqueSpecies2
        : [speciesFilter]
    },
    color: {
      type: "linear",
      range: frogGradient,
      label: "Activity rate (fraction of clips)",
      legend: true
    },
    grid: true,
    marks: [
      Plot.cell(filteredActivityTOD, {
        x: "time_of_day",
        y: "species",
        fill: "activity_rate",
        inset: 1,
        tip: false   // we use our own tooltip
      })
    ]
  });
  

  // Fix title and legend colors for dark theme

  setTimeout(() => {
    const title = plot.querySelector("h2");
    if (title) {
      title.style.color = "white";
    }
    
    // Target all text elements in the entire plot
    
    const allText = plot.querySelectorAll("text");
    allText.forEach(text => {
      text.setAttribute("fill", "white");
      text.style.fill = "white";
    });
    
    // Also target any spans or divs that might contain legend text
    
    plot.querySelectorAll("span, div").forEach(el => {
      if (el.textContent.trim()) {
        el.style.color = "white";
      }
    });
  }, 0);
  
 
  // Attach original data rows to each rect

  const rects = plot.querySelectorAll("rect");
  rects.forEach((rect, i) => {
    rect.__row = filteredActivityTOD[i]; // original row: {species, time_of_day, activity_rate, ...}
  });
 
  // Custom tooltip 

  let tooltip = document.querySelector(".custom-heatmap-tooltip");
  if (!tooltip) {
    tooltip = document.body.appendChild(document.createElement("div"));
    tooltip.className = "custom-heatmap-tooltip";
    Object.assign(tooltip.style, {
      position: "fixed",
      pointerEvents: "none",
      zIndex: 9999,
      background: "white",
      color: "black",
      border: "1px solid black",
      borderRadius: "4px",
      padding: "6px 8px",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      fontSize: "12px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
      display: "none",
      whiteSpace: "pre" // preserve newlines
    });
  }
  function hideTooltip() {
    tooltip.style.display = "none";
  }
  plot.addEventListener("pointermove", (event) => {
    const { target, clientX, clientY } = event;
    if (target.tagName !== "rect" || !target.__row) {
      hideTooltip();
      return;
    }
    const d = target.__row;   // ✅ your original data row
    const activityPct = (d.activity_rate * 100).toFixed(1);
    tooltip.textContent =
      `Species: ${d.species}\n` +
      `Time of day: ${d.time_of_day}\n` +
      `Activity: ${activityPct}%`;
    tooltip.style.display = "block";
    tooltip.style.left = clientX + 12 + "px";
    tooltip.style.top = clientY + 12 + "px";
  });
  plot.addEventListener("pointerleave", hideTooltip);
  return plot;
}


function _activity_tod(__query,FileAttachment,invalidation){return(
__query(FileAttachment("activity_tod.csv"),{from:{table:"activity_tod"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation)
)}

function _topSpeciesTod(d3,activity_tod)
{
  const avgBySpecies = d3.rollup(
    activity_tod,
    v => d3.mean(v, d => d.activity_rate),
    d => d.species
  );
  
  return Array.from(avgBySpecies, ([species, avg]) => ({species, avg}))
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 10)
    .map(d => d.species);
}


function _filteredTodDataa(activity_tod,topSpeciesTod){return(
activity_tod.filter(d => topSpeciesTod.includes(d.species))
)}

function _todLinePlot(Plot,d3,filteredTodDataa,frogGradient)
{
  const plot = Plot.plot({
    title: "Top 10 Active Species vs Time of Day",
    width: 900,
    height: 600,
    marginRight: 150,
    marginBottom: 60,
    
    // DARK THEME 
    
    style: {
      background: "black",
      color: "white",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      fontSize: 13
    },
    grid: true,
    x: {
      label: "Time of day",
      domain: ["dawn", "dusk", "night"]
    },
    y: {
      label: "Activity rate",
      domain: [0, d3.max(filteredTodDataa, d => d.activity_rate)]
    },
    color: {
      range: frogGradient,
      legend: true,
      label: "Species"
    },
    marks: [
      
      // Line (no tooltip)
      
      Plot.line(filteredTodDataa, {
        x: "time_of_day",
        y: "activity_rate",
        stroke: "species",
        marker: "circle",
        strokeWidth: 2,
        tip: false
      }),
      
      // Dots
      
      Plot.dot(filteredTodDataa, {
        x: "time_of_day",
        y: "activity_rate",
        fill: "species",
        r: 4,
        tip: false
      })
    ]
  });
  

  // Fix title and legend colors for dark theme

  setTimeout(() => {
    const title = plot.querySelector("h2");
    if (title) {
      title.style.color = "white";
    }
    
    // Target all text elements in the entire plot
    
    const allText = plot.querySelectorAll("text");
    allText.forEach(text => {
      text.setAttribute("fill", "white");
      text.style.fill = "white";
    });
    
    // Also target any spans or divs that might contain legend text
    
    plot.querySelectorAll("span, div").forEach(el => {
      if (el.textContent.trim()) {
        el.style.color = "white";
      }
    });
  }, 0);
  

  // Attacing correct data rows

  const markGroups = plot.querySelectorAll("g");
  const dotGroup = markGroups[markGroups.length - 1];  // last <g> = dots
  const dotCircles = dotGroup.querySelectorAll("circle");
  dotCircles.forEach((circle, i) => {
    circle.__row = filteredTodDataa[i];  // each dot <- its row
  });
 
  // Tooltip

  let tooltip = document.querySelector(".custom-heatmap-tooltip");
  if (!tooltip) {
    tooltip = document.body.appendChild(document.createElement("div"));
    tooltip.className = "custom-heatmap-tooltip";
    Object.assign(tooltip.style, {
      position: "fixed",
      pointerEvents: "none",
      zIndex: 9999,
      background: "white",
      color: "black",
      border: "1px solid black",
      borderRadius: "4px",
      padding: "6px 8px",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      fontSize: "12px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
      display: "none",
      whiteSpace: "pre"
    });
  }
  function hideTooltip() {
    tooltip.style.display = "none";
  }
  plot.addEventListener("pointermove", (event) => {
    const { target, clientX, clientY } = event;
    // Only respond to our dot circles with attached data
    if (target.tagName !== "circle" || !target.__row) {
      hideTooltip();
      return;
    }
    const d = target.__row;   // ✅ now the correct row from filteredTodDataa
    const pct = (d.activity_rate * 100).toFixed(1);
    tooltip.textContent =
      `Species: ${d.species}\n` +
      `Time of day: ${d.time_of_day}\n` +
      `Activity: ${pct}%`;
    tooltip.style.display = "block";
    tooltip.style.left = clientX + 12 + "px";
    tooltip.style.top = clientY + 12 + "px";
  });
  plot.addEventListener("pointerleave", hideTooltip);
  return plot;
}


function _umap_points(__query,FileAttachment,invalidation){return(
__query(FileAttachment("umap_points.csv"),{from:{table:"umap_points"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation)
)}

async function _dataumap(FileAttachment){return(
await FileAttachment("umap_points.csv").csv({ typed: true })
)}

function _filtered(dataumap,minConfidence){return(
dataumap.filter(d => (d.confidence ?? 1) >= minConfidence)
)}

function _minConfidence(Inputs){return(
Inputs.range([0, 1], {
  step: 0.05,
  value: 0,
  label: "Min confidence"
})
)}

async function _umapData(FileAttachment,d3)
{
  const text = await FileAttachment("umap_points.csv").text();
  return d3.csvParse(text, d => ({
    x: +d.x,
    y: +d.y,
    species: +d.species
  }));
}


function _umapSpeciesList(umapData,d3){return(
Array.from(
  new Set(umapData.map(d => d.species))
).sort((a, b) => d3.ascending(a, b))
)}

function _umapZoomPlot(d3,umapData,frogGradient)
{
  const width = 920;
  const height = 720;
  const margin = {top: 40, right: 40, bottom: 60, left: 60};

  // Outer container: matches activityHeatmap style
  const container = document.createElement("div");
  Object.assign(container.style, {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    background: "black",
    color: "white",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    fontSize: "13px",
    paddingBottom: "10px"
  });


  // TITLE
  
  const title = document.createElement("h2");
  title.textContent = "UMAP Projection of Species Embeddings";
  Object.assign(title.style, {
    margin: "10px 0 0 0",
    fontWeight: "600",
    color: "white",
    fontSize: "16px"
  });
  container.appendChild(title);

  // SVG ROOT

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const svg = d3.create("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("width", width)
    .attr("height", height)
    .style("background", "black")
    .style("border", "1px solid #444");

  container.appendChild(svg.node());


  // SCALES

  const xExtent = d3.extent(umapData, d => d.x);
  const yExtent = d3.extent(umapData, d => d.y);

  const xScale = d3.scaleLinear().domain(xExtent).range([0, innerWidth]).nice();
  const yScale = d3.scaleLinear().domain(yExtent).range([innerHeight, 0]).nice();

  const gRoot = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);


  // AXES (white text, subtle grid-like style)
 
  const xAxis = gRoot.append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(xScale).ticks(10));

  const yAxis = gRoot.append("g")
    .call(d3.axisLeft(yScale).ticks(10));

  xAxis.selectAll("text").attr("fill", "white");
  yAxis.selectAll("text").attr("fill", "white");
  xAxis.selectAll("line,path").attr("stroke", "rgba(255,255,255,0.3)");
  yAxis.selectAll("line,path").attr("stroke", "rgba(255,255,255,0.3)");

  xAxis.append("text")
    .attr("x", innerWidth / 2)
    .attr("y", 40)
    .attr("fill", "white")
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .text("UMAP dimension 1");

  yAxis.append("text")
    .attr("x", -innerHeight / 2)
    .attr("y", -45)
    .attr("transform", "rotate(-90)")
    .attr("fill", "white")
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .text("UMAP dimension 2");

  
  // COLOR SCALE (continuous, uses frogGradient)

  const speciesExtent = d3.extent(umapData, d => d.species);
  const colorScale = d3.scaleLinear()
    .domain(speciesExtent)
    .range([frogGradient[0], frogGradient[frogGradient.length - 1]]);


  // DOTS
 
  const gZoom = gRoot.append("g").attr("class", "zoom-layer");

  const dots = gZoom.append("g")
    .selectAll("circle")
    .data(umapData)
    .join("circle")
      .attr("cx", d => xScale(d.x))
      .attr("cy", d => yScale(d.y))
      .attr("r", 3)
      .attr("fill", d => colorScale(d.species))
      .attr("fill-opacity", 0.7);

 
  // TOOLTIP 

  let tooltip = document.querySelector(".custom-heatmap-tooltip");
  if (!tooltip) {
    tooltip = document.body.appendChild(document.createElement("div"));
    tooltip.className = "custom-heatmap-tooltip";
    Object.assign(tooltip.style, {
      position: "fixed",
      pointerEvents: "none",
      zIndex: 9999,
      background: "white",
      color: "black",
      border: "1px solid black",
      borderRadius: "4px",
      padding: "6px 8px",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      fontSize: "12px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
      display: "none",
      whiteSpace: "pre"
    });
  }

  const hideTooltip = () => { tooltip.style.display = "none"; };

  dots.on("pointermove", (event, d) => {
    legendSwatch.style.background = "transparent";
    legendValue.textContent = "Hover a point";

    legendSwatch.style.background = colorScale(d.species);
    legendValue.textContent = `Species ${d.species}`;

    const [clientX, clientY] = [event.clientX, event.clientY];
    tooltip.textContent =
      `Species ID: ${d.species}\n` +
      `UMAP x: ${d.x.toFixed(3)}\n` +
      `UMAP y: ${d.y.toFixed(3)}`;
    tooltip.style.display = "block";
    tooltip.style.left = clientX + 12 + "px";
    tooltip.style.top = clientY + 12 + "px";
  });

  dots.on("pointerleave", hideTooltip);

  
  // ZOOM (scroll / drag / dblclick reset)
 
  const zoomed = event => {
    const transform = event.transform;
    const zx = transform.rescaleX(xScale);
    const zy = transform.rescaleY(yScale);

    dots.attr("cx", d => zx(d.x)).attr("cy", d => zy(d.y));

    xAxis.call(d3.axisBottom(zx).ticks(10));
    yAxis.call(d3.axisLeft(zy).ticks(10));

    xAxis.selectAll("text").attr("fill", "white");
    yAxis.selectAll("text").attr("fill", "white");
    xAxis.selectAll("line,path").attr("stroke", "rgba(255,255,255,0.3)");
    yAxis.selectAll("line,path").attr("stroke", "rgba(255,255,255,0.3)");
  };

  const zoom = d3.zoom().scaleExtent([0.5, 20]).on("zoom", zoomed);
  svg.call(zoom);

  svg.on("dblclick.zoom-reset", () => {
    svg.transition().duration(250).call(zoom.transform, d3.zoomIdentity);
  });

  
// LEGEND that makes sense (categorical hover legend)

const legendContainer = document.createElement("div");
Object.assign(legendContainer.style, {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  marginTop: "4px",
  fontSize: "12px"
});

const legendLabel = document.createElement("span");
legendLabel.textContent = "Color = Species (categorical)";
legendLabel.style.color = "white";

const legendSwatch = document.createElement("div");
Object.assign(legendSwatch.style, {
  width: "14px",
  height: "14px",
  borderRadius: "3px",
  border: "1px solid #666",
  background: "transparent"
});

const legendValue = document.createElement("span");
legendValue.textContent = "Hover a point";
legendValue.style.color = "white";
legendValue.style.opacity = "0.9";

legendContainer.appendChild(legendLabel);
legendContainer.appendChild(legendSwatch);
legendContainer.appendChild(legendValue);
container.appendChild(legendContainer);


  return container;
}


export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["anuraset_per_class_f1_counts.csv", {url: new URL("./files/5597707276cbe7db8512258aa43e9380029cbea94457b92a2a725e4c2620f67cb19b83ba540f561c4e41cebeba40f2a4b61b8d518645a47c4bf752f3dbb2ce25.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["anuraset_f1_heatmap.csv", {url: new URL("./files/5a34fc044af873062da5ea57682ab4c65b71665cf8e8b346001070a03c621d80ea87e5d87cece90f407c601dc61f1119989fa109570bf2ff543053923bfcb4a7.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["confusion_matrix.json", {url: new URL("./files/b1796a7b18bffa4f3bdb789af4613cc7f70dcbfc968e8396a88db902e8c66bbc0620b8f27ae48b55e12694cbaacab2129b04bb54b3ae79d4f19fa1a5efd621c9.json", import.meta.url), mimeType: "application/json", toString}],
    ["activity_heatmap.csv", {url: new URL("./files/6f00b21fab851b4ced3cdd4a2bb2e4b51c8a26e508e2d28b17160d4c42de2f52acdf2f9323b813e3ec6d7b7fb81248ad2de43260f90a4b4427d4d9c41daa6809.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["species_activity_time_of_day_long.csv", {url: new URL("./files/c21cb6343868dc9610c114ec191f67687ac990d9fe8349e4f554d64a093108280a6913e70deef01818f078bdc3be366b637113216d4a5c60469ca6a6b447deb4.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["activity_tod.csv", {url: new URL("./files/c21cb6343868dc9610c114ec191f67687ac990d9fe8349e4f554d64a093108280a6913e70deef01818f078bdc3be366b637113216d4a5c60469ca6a6b447deb4.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["umap_points.csv", {url: new URL("./files/fa89ee5dcce8134dd6e18db29d8c98d401683e6f4f905d6aad72a3ca0bcb9442019edfd2aa2dc21ccc8c52f8851416552950d05cf86832e8db2ac2664cb945ee.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("anuraset_per_class_f1_counts")).define("anuraset_per_class_f1_counts", ["__query","FileAttachment","invalidation"], _anuraset_per_class_f1_counts);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer()).define(["data"], _4);
  main.variable(observer("dataWithRarity")).define("dataWithRarity", ["data"], _dataWithRarity);
  main.variable(observer()).define(["dataWithRarity"], _6);
  main.variable(observer("frogColors")).define("frogColors", _frogColors);
  main.variable(observer("imbalancePerfPlot")).define("imbalancePerfPlot", ["Plot","frogColors","dataWithRarity"], _imbalancePerfPlot);
  main.variable(observer("anuraset_f1_heatmap")).define("anuraset_f1_heatmap", ["__query","FileAttachment","invalidation"], _anuraset_f1_heatmap);
  main.variable(observer("speciesStats")).define("speciesStats", ["FileAttachment"], _speciesStats);
  main.variable(observer("heatData")).define("heatData", ["speciesStats"], _heatData);
  main.variable(observer("f1StripPlot")).define("f1StripPlot", ["Plot","heatData"], _f1StripPlot);
  main.variable(observer("speciesStatsWithIndex")).define("speciesStatsWithIndex", ["speciesStats"], _speciesStatsWithIndex);
  main.variable(observer("worstSpecies")).define("worstSpecies", ["speciesStatsWithIndex"], _worstSpecies);
  main.variable(observer("frogGradient")).define("frogGradient", _frogGradient);
  main.variable(observer("speciesVoronoiPlot")).define("speciesVoronoiPlot", ["Plot","frogGradient","speciesStatsWithIndex","worstSpecies"], _speciesVoronoiPlot);
  main.variable(observer()).define(["d3"], _17);
  main.variable(observer("confusionMatrixData")).define("confusionMatrixData", ["FileAttachment"], _confusionMatrixData);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("confusionMatrixPlot")).define("confusionMatrixPlot", ["Plot","frogGradient","confusionMatrixData","d3"], _confusionMatrixPlot);
  main.variable(observer("activity_heatmap")).define("activity_heatmap", ["__query","FileAttachment","invalidation"], _activity_heatmap);
  main.variable(observer("activityData")).define("activityData", ["activity_heatmap"], _activityData);
  main.variable(observer("uniqueSpecies")).define("uniqueSpecies", ["activityData"], _uniqueSpecies);
  main.variable(observer("uniqueSites")).define("uniqueSites", ["activityData"], _uniqueSites);
  main.variable(observer("viewof siteFilter")).define("viewof siteFilter", ["Inputs","uniqueSites","html"], _siteFilter);
  main.variable(observer("siteFilter")).define("siteFilter", ["Generators", "viewof siteFilter"], (G, _) => G.input(_));
  main.variable(observer("viewof speciesFilter")).define("viewof speciesFilter", ["Inputs","uniqueSpecies","html"], _speciesFilter);
  main.variable(observer("speciesFilter")).define("speciesFilter", ["Generators", "viewof speciesFilter"], (G, _) => G.input(_));
  main.variable(observer("filteredActivityData")).define("filteredActivityData", ["activityData","speciesFilter","siteFilter"], _filteredActivityData);
  main.variable(observer("activityHeatmap")).define("activityHeatmap", ["Plot","speciesFilter","siteFilter","uniqueSites","uniqueSpecies","frogGradient","filteredActivityData"], _activityHeatmap);
  main.variable(observer("species_activity_time_of_day_long")).define("species_activity_time_of_day_long", ["__query","FileAttachment","invalidation"], _species_activity_time_of_day_long);
  main.variable(observer("todOrder")).define("todOrder", _todOrder);
  main.variable(observer("viewof speciesFilter2")).define("viewof speciesFilter2", ["Inputs","uniqueSpecies2","html"], _speciesFilter2);
  main.variable(observer("speciesFilter2")).define("speciesFilter2", ["Generators", "viewof speciesFilter2"], (G, _) => G.input(_));
  main.variable(observer("uniqueSpecies2")).define("uniqueSpecies2", ["activity_heatmap"], _uniqueSpecies2);
  main.variable(observer("filteredActivityTOD")).define("filteredActivityTOD", ["speciesFilter2","species_activity_time_of_day_long"], _filteredActivityTOD);
  main.variable(observer("speciesTODHeatmap")).define("speciesTODHeatmap", ["Plot","speciesFilter","todOrder","uniqueSpecies2","frogGradient","filteredActivityTOD"], _speciesTODHeatmap);
  main.variable(observer("activity_tod")).define("activity_tod", ["__query","FileAttachment","invalidation"], _activity_tod);
  main.variable(observer("topSpeciesTod")).define("topSpeciesTod", ["d3","activity_tod"], _topSpeciesTod);
  main.variable(observer("filteredTodDataa")).define("filteredTodDataa", ["activity_tod","topSpeciesTod"], _filteredTodDataa);
  main.variable(observer("todLinePlot")).define("todLinePlot", ["Plot","d3","filteredTodDataa","frogGradient"], _todLinePlot);
  main.variable(observer("umap_points")).define("umap_points", ["__query","FileAttachment","invalidation"], _umap_points);
  main.variable(observer("dataumap")).define("dataumap", ["FileAttachment"], _dataumap);
  main.variable(observer("filtered")).define("filtered", ["dataumap","minConfidence"], _filtered);
  main.variable(observer("viewof minConfidence")).define("viewof minConfidence", ["Inputs"], _minConfidence);
  main.variable(observer("minConfidence")).define("minConfidence", ["Generators", "viewof minConfidence"], (G, _) => G.input(_));
  main.variable(observer("umapData")).define("umapData", ["FileAttachment","d3"], _umapData);
  main.variable(observer("umapSpeciesList")).define("umapSpeciesList", ["umapData","d3"], _umapSpeciesList);
  main.variable(observer("umapZoomPlot")).define("umapZoomPlot", ["d3","umapData","frogGradient"], _umapZoomPlot);
  return main;
}
