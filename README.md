````markdown
# PageRank Algorithm Visualizer

A professional, interactive web application that visualizes the mathematics behind the PageRank algorithm — the ranking system originally developed by Google to organize the web.

This project lets users build a small-scale internet, connect websites through links, and observe how PageRank scores change dynamically using graph theory, probability, and matrix operations.

---

## Overview

PageRank is a link analysis algorithm that treats every hyperlink as a vote of trust.

If Page A links to Page B, then Page A is essentially saying that Page B is important. However, not every vote has equal value. A vote from a highly trusted page carries much more influence than a vote from a lesser-known page.

The algorithm works recursively:

- Important pages gain high scores because other important pages link to them.
- Pages with more incoming links tend to rank higher.
- Random user behavior is simulated through a damping factor.

This project demonstrates that process visually and mathematically.

---

## Features

- Interactive graph builder for websites and links
- Random graph generation for quick testing
- Real-time PageRank score updates
- Dynamic node sizing based on PageRank influence
- Live adjacency matrix and Google matrix visualization
- Adjustable damping factor slider
- Convergence chart using power iteration
- Responsive and visually engaging frontend

The graph visualization is powered by D3.js, while convergence tracking is handled using Chart.js. Matrix computations are performed in Python using NumPy.

---

## Tech Stack

### Frontend
- HTML
- CSS
- JavaScript
- D3.js
- Chart.js

### Backend
- Python
- Flask
- NumPy

---

## Project Structure

```bash
PageRank-Visualizer/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│
├── backend/
│   ├── app.py
│   ├── requirements.txt
│
└── README.md
````

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/CJC1406/PageRank-Visualizer.git
cd PageRank-Visualizer
```

### 2. Setup the Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

The backend server will run on:

```bash
http://127.0.0.1:5050
```

### 3. Setup the Frontend

Open a new terminal window:

```bash
cd frontend
python -m http.server 8000
```

Then open the following in your browser:

```bash
http://localhost:8000
```

---

## How the Algorithm Works

The backend calculates PageRank using matrix operations:

1. Create an adjacency matrix for the graph.
2. Convert it into a transition probability matrix.
3. Handle dangling nodes with uniform probability distribution.
4. Apply the damping factor.
5. Use power iteration repeatedly until the rank values converge.

The PageRank formula is:

```math
r_{next} = M' \times r_{current}
```

The Google matrix is defined as:

```math
M' = d \times M + (1 - d) \times E
```

Where:

* (M) is the transition matrix
* (d) is the damping factor
* (E) is the teleportation matrix
* (r) is the rank vector

---

## Real-World Applications

PageRank-style ranking systems are used in many industries beyond search engines:

* Social media influence analysis
* Product recommendation systems
* Network security and spam detection
* Traffic routing and congestion analysis
* Biology and protein interaction mapping
* Brain connectivity and neuroscience research

Companies such as Netflix, Amazon, and Spotify use related ranking methods in recommendation systems.

---

## Future Improvements

* Add weighted edges between websites
* Support importing graphs from CSV files
* Add dark mode support
* Export PageRank results as PDF or CSV
* Show shortest path and graph traversal algorithms
* Add support for community detection and clustering
* Add animated step-by-step PageRank iteration playback

---

## Authors

 Chiranth J Chigateri


---
