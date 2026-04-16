document.addEventListener('DOMContentLoaded', () => {
    // Inputs & Controls
    const nodeFromInput = document.getElementById('node-from');
    const nodeToInput = document.getElementById('node-to');
    const addEdgeBtn = document.getElementById('add-edge-btn');
    const calculateBtn = document.getElementById('calculate-btn');
    const clearBtn = document.getElementById('clear-btn');
    const randomBtn = document.getElementById('random-graph-btn');
    const edgesList = document.getElementById('edges-list');
    
    // Sliders & Details
    const dSlider = document.getElementById('d-slider');
    const dValue = document.getElementById('d-value');
    
    // Outputs
    const rankingsTableBody = document.querySelector('#rankings-table tbody');
    const d3Container = document.getElementById('d3-container');
    const matrixA = document.getElementById('matrix-a');
    const matrixM = document.getElementById('matrix-m');

    let edges = [];
    let nodes = new Set();
    
    // State logic
    let pagerankScores = {};
    let iterationHistory = [];
    let nodeOrder = [];
    let chartInstance = null;

    let svg, simulation, link, nodeGroup, tooltip;

    // Default init
    function initDefault() {
        edges = [
            ["google.com", "wiki.org"],
            ["google.com", "youtube.com"],
            ["wiki.org", "google.com"],
            ["youtube.com", "google.com"]
        ];
        updateNodes();
        renderEdges();
        renderGraph();
    }

    // Dynamic UI Updates
    dSlider.addEventListener('input', (e) => {
        dValue.innerText = e.target.value;
    });

    randomBtn.addEventListener('click', () => {
        const websites = ["google.com", "wiki.org", "youtube.com", "github.com", "reddit.com", "Netflix"];
        edges = [];
        nodes.clear();
        
        let numNodes = Math.floor(Math.random() * 3) + 4; // 4 to 6 nodes
        let activeNodes = websites.slice(0, numNodes);
        
        // Ensure some random connections
        activeNodes.forEach(source => {
            let numEdges = Math.floor(Math.random() * 3) + 1;
            for(let i=0; i<numEdges; i++) {
                let target = activeNodes[Math.floor(Math.random() * numNodes)];
                if (source !== target) {
                    const exists = edges.some(e => e[0] === source && e[1] === target);
                    if (!exists) edges.push([source, target]);
                }
            }
        });

        updateNodes();
        renderEdges();
        renderGraph();
    });

    function updateNodes() {
        nodes.clear();
        edges.forEach(edge => {
            nodes.add(edge[0]);
            nodes.add(edge[1]);
        });
    }

    function addEdge(from, to) {
        if (!from || !to || from === to) return;
        const exists = edges.some(e => e[0] === from && e[1] === to);
        if (!exists) {
            edges.push([from, to]);
            updateNodes();
            renderEdges();
            renderGraph();
        }
    }

    addEdgeBtn.addEventListener('click', () => {
        const from = nodeFromInput.value.trim().toLowerCase();
        const to = nodeToInput.value.trim().toLowerCase();
        if (from && to) {
            addEdge(from, to);
            nodeFromInput.value = '';
            nodeToInput.value = '';
            nodeFromInput.focus();
        }
    });

    clearBtn.addEventListener('click', () => {
        edges = [];
        nodes.clear();
        pagerankScores = {};
        iterationHistory = [];
        renderEdges();
        renderGraph();
        renderRankings();
        renderChart();
        matrixA.innerHTML = "Run calculation to view...";
        matrixM.innerHTML = "Run calculation to view...";
    });

    function renderEdges() {
        edgesList.innerHTML = '';
        edges.forEach((edge, index) => {
            const li = document.createElement('li');
            li.className = 'edge-item';
            
            const textSpan = document.createElement('span');
            textSpan.innerHTML = `${edge[0]} &rarr; ${edge[1]}`;
            
            const delBtn = document.createElement('button');
            delBtn.className = 'delete-btn';
            delBtn.innerHTML = '&times;';
            delBtn.onclick = () => {
                edges.splice(index, 1);
                updateNodes();
                renderEdges();
                renderGraph();
            };
            
            li.appendChild(textSpan);
            li.appendChild(delBtn);
            edgesList.appendChild(li);
        });
    }

    // MAIN CALCULATE
    calculateBtn.addEventListener('click', async () => {
        if (edges.length === 0) return;

        calculateBtn.disabled = true;
        calculateBtn.innerText = 'Calculating...';

        try {
            const response = await fetch('http://127.0.0.1:5050/api/pagerank', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nodes: Array.from(nodes),
                    edges: edges,
                    d: parseFloat(dSlider.value)
                })
            });

            const data = await response.json();
            if (data.success) {
                pagerankScores = data.scores;
                iterationHistory = data.history;
                nodeOrder = data.node_order;
                
                renderRankings();
                updateGraphAnimations(); // Transition node sizes
                renderChart();
                renderMatrices(data.A, data.M);
            } else {
                alert("Error calculating PageRank: " + data.error);
            }
        } catch (error) {
            alert("Error connecting to server. Is the Flask backend running?");
            console.error(error);
        } finally {
            calculateBtn.disabled = false;
            calculateBtn.innerText = ' Calculate PageRank';
        }
    });

    function renderRankings() {
        rankingsTableBody.innerHTML = '';
        if (Object.keys(pagerankScores).length === 0) return;

        const sortedNodes = Object.entries(pagerankScores).sort((a, b) => b[1] - a[1]);
        const maxScore = sortedNodes[0][1];

        sortedNodes.forEach(([node, score], index) => {
            const tr = document.createElement('tr');
            
            // Medals Logic
            const rankTd = document.createElement('td');
            let medal = '';
            if (index === 0) medal = '🥇';
            else if (index === 1) medal = '🥈';
            else if (index === 2) medal = '🥉';
            else medal = `<span style="display:inline-block; width:1.3rem; text-align:center;">${index + 1}</span>`;

            rankTd.innerHTML = `<span class="medal">${medal}</span>`;
            
            // Node name
            const nodeTd = document.createElement('td');
            nodeTd.style.fontWeight = 'bold';
            nodeTd.textContent = node;
            
            // Percentage Bar & Raw PageRank Score
            const percent = ((score / maxScore) * 100).toFixed(1);
            
            const scoreTd = document.createElement('td');
            scoreTd.className = "progress-cell";
            scoreTd.innerHTML = `
                <div style="font-size: 0.8rem; margin-bottom: 6px; color: #a5b4fc; font-family: monospace;">Rank/Score: ${score.toFixed(6)}</div>
                <div class="progress-bar-container">
                    <div class="progress-fill" style="width: 0%"></div>
                    <span class="progress-text">${percent}%</span>
                </div>
            `;
            
            // Trigger animation frame for width
            setTimeout(() => {
                scoreTd.querySelector('.progress-fill').style.width = `${percent}%`;
            }, 50);

            tr.appendChild(rankTd);
            tr.appendChild(nodeTd);
            tr.appendChild(scoreTd);
            
            rankingsTableBody.appendChild(tr);
        });
    }

    function renderMatrices(A, M) {
        // Output matrix headers aligned to Node Order array
        let headers = `     ` + nodeOrder.map(n => n.padEnd(10)).join('') + "\n";
        
        let strA = headers;
        nodeOrder.forEach((node, i) => {
            strA += node.padEnd(5).substring(0,4) + " ";
            strA += A[i].map(val => val.toString().padEnd(10)).join('') + "\n";
        });
        
        let strM = headers;
        nodeOrder.forEach((node, i) => {
            strM += node.padEnd(5).substring(0,4) + " ";
            strM += M[i].map(val => val.toFixed(4).padEnd(10)).join('') + "\n";
        });

        matrixA.innerText = strA;
        matrixM.innerText = strM;
    }

    function renderChart() {
        const ctx = document.getElementById('convergence-chart').getContext('2d');
        
        if (chartInstance) {
            chartInstance.destroy();
        }

        if (!iterationHistory || iterationHistory.length === 0) return;

        const labels = iterationHistory.map(h => `Iter ${h.iteration}`);
        
        // Color generator for chart lines
        const colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'];
        
        const datasets = nodeOrder.map((node, index) => {
            return {
                label: node,
                data: iterationHistory.map(h => h.scores[node]),
                borderColor: colors[index % colors.length],
                tension: 0.3,
                borderWidth: 2,
                pointRadius: 2
            }
        });

        chartInstance = new Chart(ctx, {
            type: 'line',
            data: { labels, datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                color: '#fff',
                scales: {
                    x: { ticks: { color: 'rgba(255,255,255,0.7)' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                    y: { ticks: { color: 'rgba(255,255,255,0.7)' }, grid: { color: 'rgba(255,255,255,0.1)' } }
                },
                plugins: {
                    legend: { labels: { color: '#fff' } }
                }
            }
        });
    }

    // Graph Initialization
    function renderGraph() {
        d3Container.innerHTML = '';
        if (nodes.size === 0) return;

        const width = window.innerWidth;
        const height = window.innerHeight;

        svg = d3.select("#d3-container")
            .append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", [0, 0, width, height]);

        const zoomGroup = svg.append("g");
        const zoom = d3.zoom().on("zoom", (event) => {
            zoomGroup.attr("transform", event.transform);
        });
        svg.call(zoom);

        tooltip = d3.select("body").select(".tooltip");
        if (tooltip.empty()) {
            tooltip = d3.select("body").append("div").attr("class", "tooltip");
        }

        const graphNodes = Array.from(nodes).map(n => ({ id: n }));
        const graphLinks = edges.map(e => ({ source: e[0], target: e[1] }));

        svg.append("defs").append("marker")
            .attr("id", "arrow")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 25)
            .attr("refY", 0)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("path")
            .attr("fill", "#a5b4fc")
            .attr("d", "M0,-5L10,0L0,5");

        simulation = d3.forceSimulation(graphNodes)
            .force("link", d3.forceLink(graphLinks).id(d => d.id).distance(250))
            .force("charge", d3.forceManyBody().strength(-800))
            .force("center", d3.forceCenter((width / 2) + 300, height / 2))
            .force("collision", d3.forceCollide().radius(d => (d.visualRadius || 25) + 25));

        link = zoomGroup.append("g")
            .selectAll("line")
            .data(graphLinks)
            .join("line")
            .attr("class", "graph-link")
            .attr("stroke", "rgba(165, 180, 252, 0.4)")
            .attr("stroke-width", 2)
            .attr("marker-end", "url(#arrow)");

        nodeGroup = zoomGroup.append("g")
            .selectAll("g")
            .data(graphNodes)
            .join("g")
            .call(drag(simulation));

        nodeGroup.append("circle")
            .attr("r", 25) // Default optimized sizing
            .attr("fill", "#818cf8")
            .attr("stroke", "#ffffff")
            .attr("stroke-width", 2)
            .on("mouseover", function(event, d) {
                // Highlight incoming links
                link.attr("stroke", l => l.target.id === d.id ? "#fbbf24" : "rgba(165, 180, 252, 0.2)")
                    .attr("stroke-width", l => l.target.id === d.id ? 4 : 2);
                    
                tooltip.style("opacity", 1)
                       .html(`<b>${d.id}</b><br>Rank: ${pagerankScores[d.id] ? (pagerankScores[d.id]*100).toFixed(2)+'%' : 'N/A'}`)
                       .style("left", (event.pageX + 15) + "px")
                       .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function() {
                link.attr("stroke", "rgba(165, 180, 252, 0.4)").attr("stroke-width", 2);
                tooltip.style("opacity", 0);
            });

        nodeGroup.append("text")
            .text(d => d.id)
            .attr("text-anchor", "middle")
            .attr("dy", d => (d.visualRadius || 25) + 18)
            .attr("fill", "white")
            .style("pointer-events", "none")
            .style("font-size", "12px")
            .style("font-weight", "600");

        simulation.on("tick", () => {
            link.attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => {
                    const dx = d.target.x - d.source.x, dy = d.target.y - d.source.y;
                    const len = Math.sqrt(dx*dx + dy*dy);
                    let r = d.target.visualRadius || 25;
                    return len === 0 ? d.target.x : d.target.x - (dx * (r + 4) / len);
                })
                .attr("y2", d => {
                    const dx = d.target.x - d.source.x, dy = d.target.y - d.source.y;
                    const len = Math.sqrt(dx*dx + dy*dy);
                    let r = d.target.visualRadius || 25;
                    return len === 0 ? d.target.y : d.target.y - (dy * (r + 4) / len);
                });

            nodeGroup.attr("transform", d => `translate(${d.x},${d.y})`);
        });

        startRandomSurfer();

        function drag(simulation) {
            return d3.drag()
                .on("start", (e, d) => { if (!e.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
                .on("drag", (e, d) => { d.fx = e.x; d.fy = e.y; })
                .on("end", (e, d) => { if (!e.active) simulation.alphaTarget(0); d.fx = null; d.fy = null; });
        }
    }

    function updateGraphAnimations() {
        if (!nodeGroup) return;

        // Find the top node for the golden glow
        let maxScore = Math.max(...Object.values(pagerankScores));
        let topNodeId = Object.keys(pagerankScores).find(k => pagerankScores[k] === maxScore);

        nodeGroup.select("circle")
            .attr("class", d => d.id === topNodeId ? "top-node" : "")
            .transition()
            .duration(800)
            .attr("r", d => {
                if(pagerankScores[d.id] !== undefined) {
                    let score = pagerankScores[d.id];
                    // Using square root scaling to balance math visual hierarchy
                    let r = 25 + Math.sqrt(score) * 80;
                    r = Math.min(r, 75); // Cap radius maximums
                    d.visualRadius = r; // save for link calculations
                    return r;
                }
                d.visualRadius = 25;
                return 25;
            })
            .attr("fill", "#818cf8");

        // Sync text labels outwards relative to new radius limits
        nodeGroup.select("text")
            .transition()
            .duration(800)
            .attr("dy", d => (d.visualRadius || 25) + 18);
            
        // Reset and deploy new layout collision parameters relative to new radiuses
        simulation.force("collision", d3.forceCollide().radius(d => (d.visualRadius || 25) + 30));
        simulation.alpha(0.3).restart();
    }

    // Random Surfer Animation Logic
    let surferTimeout;
    function startRandomSurfer() {
        if(surferTimeout) clearTimeout(surferTimeout);
        svg.selectAll('.surfer').remove();

        if(!link || link.data().length === 0) return;

        const surfer = zoomGroup.append("circle")
            .attr("class", "surfer")
            .attr("r", 6)
            .attr("fill", "#fbbf24")
            .style("filter", "drop-shadow(0 0 5px #fbbf24)")
            .style("opacity", 0);

        let linksArray = link.data();
        let currentLink = linksArray[Math.floor(Math.random() * linksArray.length)];

        function simulateSurf() {
            surfer.style("opacity", 1)
                  .attr("cx", currentLink.source.x)
                  .attr("cy", currentLink.source.y);

            surfer.transition()
                  .duration(1200)
                  .ease(d3.easeCubicInOut)
                  .attr("cx", currentLink.target.x)
                  .attr("cy", currentLink.target.y)
                  .on("end", () => {
                      // With probability 'd', follow an outgoing link
                      // Else (or no outgoing links), jump randomly
                      let damping = parseFloat(dSlider.value);
                      let rand = Math.random();
                      
                      let outgoingLinks = linksArray.filter(l => l.source.id === currentLink.target.id);
                      
                      if (rand < damping && outgoingLinks.length > 0) {
                          currentLink = outgoingLinks[Math.floor(Math.random() * outgoingLinks.length)];
                      } else {
                          // Random Teleport sequence!
                          surfer.style("opacity", 0); // Disappear
                          currentLink = linksArray[Math.floor(Math.random() * linksArray.length)];
                      }
                      
                      surferTimeout = setTimeout(simulateSurf, 300);
                  });
        }
        
        setTimeout(simulateSurf, 1000);
    }

    initDefault();
});
