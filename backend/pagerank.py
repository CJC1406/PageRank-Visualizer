import numpy as np

def compute_pagerank(nodes, edges, d=0.85, max_iter=100, tol=1.0e-6):
    """
    Computes PageRank for a given graph.
    nodes: list of node names (e.g., ["A", "B", "C"])
    edges: list of lists representing directed edges (e.g., [["A", "B"], ["B", "C"]])
    """
    n = len(nodes)
    if n == 0:
        return {"scores": {}, "history": [], "A": [], "M": [], "node_order": []}

    node_to_idx = {node: i for i, node in enumerate(nodes)}
    idx_to_node = {i: node for i, node in enumerate(nodes)}
    
    # Adjacency matrix A, initially zeroes
    A = np.zeros((n, n))
    
    for origin, dest in edges:
        if origin in node_to_idx and dest in node_to_idx:
            i = node_to_idx[dest]
            j = node_to_idx[origin]
            A[i, j] = 1 # A_ij = 1 if j links to i
            
    # Transition matrix M
    # If outdegree is 0 (dangling node), replace column with 1/n
    M = np.zeros((n, n))
    out_degrees = np.sum(A, axis=0)
    
    for j in range(n):
        if out_degrees[j] == 0:
            M[:, j] = 1.0 / n
        else:
            M[:, j] = A[:, j] / out_degrees[j]

    # Google matrix M'
    E = np.ones((n, n)) / n
    M_prime = d * M + (1 - d) * E
    
    # Power iteration
    # r^(0) = 1/n
    r = np.ones(n) / n
    
    history = []
    
    for iteration in range(max_iter):
        # Save current state to history
        current_scores = {idx_to_node[i]: float(r[i]) for i in range(n)}
        history.append({
            "iteration": iteration,
            "scores": current_scores
        })
        
        r_next = M_prime @ r
        if np.linalg.norm(r_next - r, ord=1) < tol:
            r = r_next
            # Save final converged state
            current_scores = {idx_to_node[i]: float(r[i]) for i in range(n)}
            history.append({
                "iteration": iteration + 1,
                "scores": current_scores
            })
            break
        r = r_next
        
    scores = {idx_to_node[i]: float(r[i]) for i in range(n)}
    
    # Return formatted matrices for visualization
    return {
        "scores": scores,
        "history": history,
        "A": np.round(A, 4).tolist(),
        "M": np.round(M_prime, 4).tolist(),  # Return the final Google Matrix
        "node_order": [idx_to_node[i] for i in range(n)]
    }
