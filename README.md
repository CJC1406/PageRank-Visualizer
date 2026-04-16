# PageRank Algorithm Visualizer

A professional, interactive web application that demonstrates how the PageRank algorithm works using real-time D3.js network visualizations and Python/NumPy matrix computations.

## Overview
This application visually explains the PageRank algorithm originally pioneered by Google. It computes the "pagerank" or relative importance of a set of linked nodes (such as web pages) based on their incoming links.

### Features
- **Interactive Graph Generation:** Add custom nodes and edges, or use the built-in random graph generator.
- **Dynamic Visualization:** Uses D3.js to render a physics-based network graph where node size corresponds to its PageRank score.
- **Real-Time Matrix Math:** View the Adjacency Matrix (A) and the Stochastic Transition/Google Matrix (M') live.
- **Convergence Tracking:** Visualizes how the algorithm uses the power iteration method to reach a steady-state score through an interactive Chart.js graph.
- **Adjustable Damping Factor:** Tweak the damping factor ($d$) and observe how it impacts the node scaling and rank distributions.

## Tech Stack
- **Frontend:** HTML5, CSS3 with Glassmorphism UI, Vanilla JavaScript
- **Visualization Libraries:** [D3.js](https://d3js.org/) for the network graph and [Chart.js](https://www.chartjs.org/) for the convergence chart.
- **Backend:** Python + Flask
- **Calculations:** NumPy for rapid matrix multiplication and power iterations.

## Setup Instructions

### 1. Start the Backend
Make sure you have Python installed. Navigate to the `backend` directory and install the required dependencies:
```bash
cd backend
pip install -r requirements.txt
```

Start the Flask server:
```bash
python app.py
```
*(The server will run at http://127.0.0.1:5050)*

### 2. Launch the Frontend
You can launch the frontend by simply double-clicking the `index.html` file in the `frontend` folder, or by serving it using a local HTTP server:
```bash
cd frontend
python -m http.server 8000
```
Then navigate to `http://localhost:8000` in your web browser.

## How it works (The Math)
The PageRank of a node is determined by the equation:
`r = d * M * r + (1-d)/n * 1`

Where:
- `r`: The PageRank vector.
- `M`: The transition matrix of probabilities.
- `d`: The Damping Factor (typically 0.85).
- `n`: Total number of nodes.

The backend uses **Power Iteration**, continuously multiplying the PageRank vector by the Google Matrix until the values converge (stop changing).