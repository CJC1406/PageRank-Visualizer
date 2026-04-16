from flask import Flask, request, jsonify
from flask_cors import CORS
from pagerank import compute_pagerank

app = Flask(__name__)
CORS(app)

@app.route('/api/pagerank', methods=['POST'])
def calculate_pagerank():
    data = request.json
    nodes = data.get('nodes', [])
    edges = data.get('edges', [])
    d = float(data.get('d', 0.85))
    
    try:
        result = compute_pagerank(nodes, edges, d=d)
        return jsonify({"success": True, **result})
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5050)
