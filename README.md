# PageRank Algorithm Visualizer

A professional, interactive web application that demonstrates how the PageRank algorithm works using real-time D3.js network visualizations and Python/NumPy matrix computations.

## Overview
This application visually explains the PageRank algorithm originally pioneered by Google. It computes the "pagerank" or relative importance of a set of linked nodes (such as web pages) based on their incoming links.

### Features
- **Interactive Graph Generation:** Add custom nodes and edges, or use the built-in random graph generator.
- **Dynamic Visualization:** Uses D3.js to render a physics-based network graph where node size corresponds to its PageRank score.
- **Real-Time Matrix Math:** View the Adjacency Matrix (A) and the Stochastic Transition/Google Matrix (M') live.
- **Convergence Tracking:** Visualizes how the algorithm uses the power iteration method to reach a steady-state score through an interactive Chart.js graph.
- **Adjustable Damping Factor:** Tweak the damping factor (d) and observe how it impacts the node scaling and rank distributions.

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

## How it Works (The Math)
The PageRank calculation determines the probability that a person randomly clicking on web links will arrive at any particular page.

Our Python/NumPy backend calculates this using Matrix Math:
1. **Adjacency Matrix (A):** Represents the network as a binary square matrix. $A_{i,j} = 1$ if node $j$ links to node $i$, and $0$ otherwise.
2. **Transition Matrix (M):** The values are divided by the node's total outgoing links, effectively converting links into probabilities. If a node is a **"Dangling Node"** (it has 0 outgoing links), we insert $1/N$ along the column to assume the user randomly jumps to another page.
3. **The Damping Factor ($d$):** This represents a "random surfer", simulating the probability that the user actually clicks a link (usually $d = 0.85$ or 85%) instead of typing a random new URL into their browser (15%). 
4. **The Google Matrix (M'):** It applies the Damping factor to the Transition Matrix to create a strictly positive Stochastic Matrix (the "Google Matrix") $M'$.
5. **Power Iteration:** To find the principal eigenvector (the final influence scores), the system starts with an equal probability vector where every page acts as $r_i = 1/N$. It multiplies this vector by the Google Matrix repeatedly in a loop: $r_{next} = M' \times r$. This loop continues until the scores converge (cease to change).

## Real-World Uses of PageRank
While originating with Google Search to rank web pages, the underlying eigenvector centrality algorithm is used heavily across various industries:
1. **Social Network Analysis:** Used heavily by platforms like Twitter and Instagram to recommend who to follow and identify massive influencers in a network of users.
2. **Recommendation Systems:** Services like Netflix, Amazon, or Spotify predicting what products or media you engage with by treating items and users as nodes.
3. **Biology & Neuroscience:** Identifying critical proteins within metabolic networks or understanding dominant structural connections in the human brain.
4. **Traffic & Road Routing:** Assisting GPS systems to map out heavily congested traffic nodes (streets/intersections) to provide efficient detours.
5. **Cybersecurity:** Identifying malicious clusters of web pages in a network or analyzing the rapid spread patterns of botnets and malware.