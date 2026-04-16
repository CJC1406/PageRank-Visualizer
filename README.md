# PageRank Algorithm Visualizer 🌐

A professional, interactive web application that demystifies and visualizes the PageRank algorithm—the foundational mathematics originally pioneered by Google to organize the World Wide Web.

---

## 🔍 What is PageRank?
At its core, PageRank is a **link analysis algorithm**. Before PageRank, search engines primarily ranked pages by counting how many times a search keyword appeared in the text. This was easily manipulated. 

Google revolutionized this by treating a link from one page to another as a **"vote."** If Page A links to Page B, Page A is effectively saying, "I trust Page B; it is a valuable resource." The more "votes" (incoming links) a page receives, the higher its rank.

However, **not all votes are equal**. A vote from a highly trusted, popular page (like Wikipedia or BBC) carries substantially more weight than a vote from a brand new, unknown blog. This recursive logic—that a page is important if it is linked to by other important pages—is the genius behind PageRank.

---

## 🧠 How PageRank Conceptually Ranks Web Pages
If you want to understand exactly how this translates to search engine rankings, imagine the **"Random Surfer" model**:

1. **The Democratic Web:** Imagine the entire internet as a giant web of connected rooms. Every time you click a link, you walk through a door.
2. **Following Links:** A hypothetical "random surfer" starts on a random web page and clicks links indefinitely. Over time, the surfer will naturally end up on pages with the most incoming pathways (links) much more frequently than isolated pages.
3. **The Damping Factor ($d$):** Users don't just click links forever. Sometimes they get bored, close the tab, or type a completely new URL. This is modeled by a **damping factor** (usually set to 0.85 or 85%). This means there's an 85% chance the surfer clicks a link on the current page, and a 15% chance they magically teleport to a random new page on the internet.
4. **The Final Score:** Over millions of virtual clicks, the percentage of time the surfer spends on any given page becomes its **PageRank Score**. If a page has a score of 0.05, you have a 5% chance of finding the surfer there at any given moment. Google uses this probability to rank search results!

---

## 🚀 Application Features
This visualizer allows you to build a mini-internet and watch the algorithm dynamically solve for the rankings using real-time Matrix Mathematics.
- **Interactive Graph Generation:** Add custom nodes (websites) and directed edges (links), or instantly spawn a randomized internet graph.
- **Dynamic Bubble Visualization:** Powered by **D3.js**, the physics-based network graph visually scales the size of each node based on its exact PageRank influence score.
- **Live Matrix Output:** Peek under the hood! View the Adjacency Matrix (A) and the Stochastic Transition/Google Matrix (M') updating in real-time as you add links.
- **Algorithmic Convergence Charting:** Uses **Chart.js** to track the "Power Iteration" loop. Watch the line graph stabilize as the mathematical scores finally converge on their steady-state values.
- **Adjustable Damping:** Tweak the damping factor ($d$) slider on the fly and watch how altering human behavior shifts the balance of power on the web.

---

## 🔧 Setup Instructions

### 1. Start the Python Backend
Make sure you have Python installed. The backend uses NumPy optimized for heavy linear algebra computations.
```bash
cd backend
pip install -r requirements.txt
python app.py
```
*(The JSON API will listen at `http://127.0.0.1:5050`)*

### 2. Launch the Frontend
You can launch the frontend by simply double-clicking the `index.html` file inside the `frontend` folder, or by serving it using a local HTTP server:
```bash
cd frontend
python -m http.server 8000
```
Navigate to `http://localhost:8000` in your web browser to start visualizing!

---

## 📐 The Mathematics (Under the Hood)
For the mathematically inclined, our Python/NumPy backend performs the following steps calculation to replicate Google's exact ranking method:

1. **Adjacency Matrix ($A$):** Represents the network as a binary square matrix. $A_{i,j} = 1$ if node $j$ links to node $i$, otherwise $0$.
2. **Transition Matrix ($M$):** We divide the values by the node's total outgoing links, effectively converting the binary links into probability fractions. 
   * **Dangling Nodes:** If a node has 0 outgoing links (a dead end), we insert $1/N$ (where N is total pages) across its entire column to ensure the calculation doesn't crash, assuming the surfer "teleports" away.
3. **The Damping Factor ($d$):** We formally implement the random surfer using the equation $M' = d \times M + (1 - d) \times E$, where $E$ is a matrix of $1/N$ teleport probabilities. This yields the strictly positive stochastic **Google Matrix**.
4. **Power Iteration Phase:** To find the principal eigenvector (the final influence scores), we start with a uniform probability vector where $r_i = 1/N$. We multiply this vector by the Google Matrix repeatedly in a loop: $r_{next} = M' \times r_{current}$. 
5. **Convergence:** When the difference between $r_{next}$ and $r_{current}$ is microscopic (e.g., $< 10^{-6}$), the vector has reached its steady state. This vector contains the final PageRank scores.

---

## 🌍 Real-World Uses of PageRank Architecture
While Google used it for web pages, the underlying **eigenvector centrality algorithm** is crucial across many different modern industries:
1. **Social Network Analysis:** Twitter and Instagram use it to identify massive central influencers within a web of users and recommend "who to follow."
2. **Recommendation Engines:** Netflix, Amazon, and Spotify use bipartite variations of PageRank. By treating users and products/movies as nodes, the math predicts what you will uniquely engage with next.
3. **Biology & Neuroscience:** Identifying the most critical, highly connected proteins within complex metabolic pathways or mapping structural bottlenecks in the human brain.
4. **Traffic & Road Routing:** Assisting GPS routing algorithms to identify heavily congested intersections (traffic nodes) to provide proactive, efficient detours.
5. **Cybersecurity:** Identifying malicious clusters of interlinked spam web pages or analyzing the rapid structural spread of botnet malware vectors.