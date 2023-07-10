function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function generateGraphWithSpecialLamps(normalLampCount, specialLampCount) {
  const graph = {};
  let starterNode = "Egyetem";
  let finishNode = "Harrer";

  
  for (let i = 1; i <= normalLampCount; i++) {
    if (i === 1) {
      const nodeName = starterNode;
      graph[nodeName] = {};
    } else if (i < normalLampCount) {
      const nodeName = `Node${i}`;
      graph[nodeName] = {};
    }
  }

  
  for (let i = 1; i <= specialLampCount; i++) {
    const nodeName = `Specialnode${i}`;
    graph[nodeName] = {};
  }
  const nodeName = finishNode;
  graph[nodeName] = {};

  
  const nodes = Object.keys(graph);

  for (let i = 0; i < nodes.length; i++) {
    const currentNode = nodes[i];
    const neighbors = nodes.slice(i + 1); 

    const numberOfEdges = randomNumber(0, neighbors.length); 
    const selectedNeighbors = selectRandomElements(neighbors, numberOfEdges); 

    for (let j = 0; j < selectedNeighbors.length; j++) {
      const neighborNode = selectedNeighbors[j];
      const weight = randomNumber(1, 5);
      graph[currentNode][neighborNode] = weight;
    }
  }

  return graph;
}

function selectRandomElements(array, count) {
  const shuffled = array.slice();
  let i = array.length;
  let temp, randomIndex;

  while (i-- > 0) {
    randomIndex = Math.floor((i + 1) * Math.random());
    temp = shuffled[randomIndex];
    shuffled[randomIndex] = shuffled[i];
    shuffled[i] = temp;
  }

  return shuffled.slice(0, count);
}

function findShorthestPath(graph, start, end, max_lamps) {
  let queue = [];
  let distances = {};
  let visited = {};
  let path = {};

  for (let node in graph) {
    distances[node] = Infinity;
    visited[node] = false;
    path[node] = null;
  }

  distances[start] = 0;
  queue.push([start, 0]);

  while (queue.length > 0) {
    let minIndex = 0;
    for (let i = 1; i < queue.length; i++) {
      if (distances[queue[i][0]] < distances[queue[minIndex][0]]) {
        minIndex = i;
      }
    }

    let [currentNode, lamps] = queue.splice(minIndex, 1)[0];
    visited[currentNode] = true;

    if (currentNode === end) {
      break;
    }

    let neighbors = graph[currentNode];

    for (let neighbor in neighbors) {
      let distance = neighbors[neighbor];
      let newDistance = distances[currentNode] + distance;

      if (newDistance < distances[neighbor] && !visited[neighbor]) {
        distances[neighbor] = newDistance;
        path[neighbor] = currentNode;
        queue.push([neighbor, lamps]);
      }
    }
  }

  if (path[end] === null) {
    return null;
  }

  let shortestPath = [];
  let currentNode = end;
  let lamps = 0;

  while (currentNode !== start) {
    if (
      graph[currentNode] &&
      graph[currentNode]["Specialnode"] &&
      lamps < max_lamps
    ) {
      shortestPath.unshift(["Specialnode", lamps + 1]);
      lamps += 1;
    }
    shortestPath.unshift([currentNode, lamps]);
    currentNode = path[currentNode];
  }

  shortestPath.unshift([start, lamps]);

  return shortestPath;
}

function selectRandomElements(array, count) {
  let shuffled = array.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}


let startNode = "Egyetem";
let endNode = "Harrer";
let maxLamps = 2;
let graph = require('./graph1.json')

let shortestPath = findShorthestPath(graph, startNode, endNode, maxLamps);

if (shortestPath === null) {
  console.log("Nincs elérhető útvonal.");
} else {
  let formattedPath = shortestPath.map(([node, lamps]) => {
    if (node === "Specialnode") {
      return `Specialnode${lamps}`;
    }
    return node;
  });

  console.log("Legrövidebb út:", formattedPath.join(" -> "));
}