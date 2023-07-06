const fs = require('fs');

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function generateGraphWithSpecialLamps(normalLampCount, specialLampCount) {
  const graph = {};
  const starterNode = 'Egyetem';
  const finishNode = 'Harrer';

  // Egyetem csúcs hozzáadása a gráfhoz
  graph[starterNode] = {};

  // Normális lámpás csúcsok generálása
  for (let i = 1; i <= normalLampCount; i++) {
    const nodeName = `Node${i}`;
    graph[nodeName] = {};
  }

  // Speciális lámpás csúcsok generálása
  for (let i = 1; i <= specialLampCount; i++) {
    const nodeName = `Specialnode${i}`;
    graph[nodeName] = {};
  }

  // Harrer csúcs hozzáadása a gráfhoz
  graph[finishNode] = {};

  // Élek generálása
  const nodes = Object.keys(graph);

  for (let i = 0; i < nodes.length; i++) {
    const currentNode = nodes[i];
    const neighbors = nodes.slice(i + 1); // Csak a későbbi csúcsok között generál éleket

    const numberOfEdges = randomNumber(1, Math.min(neighbors.length, 5)); // Módosított élek száma (1 és a későbbi csúcsok száma között, maximum 5)
    const selectedNeighbors = selectRandomElements(neighbors, numberOfEdges); // Véletlenszerűen kiválasztott szomszédok

    for (let j = 0; j < selectedNeighbors.length; j++) {
      const neighborNode = selectedNeighbors[j];
      const weight = randomNumber(1, 5);
      graph[currentNode][neighborNode] = weight;
      graph[neighborNode][currentNode] = weight; // Hozzáadott él a szomszédos csúcsok között
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

function findShortest(graph, start, end, max_lamps) {
  let queue = [];
  let distances = {};
  let lampsTouched = {};
  let path = {};

  for (let node in graph) {
    distances[node] = Infinity;
    lampsTouched[node] = 0;
    path[node] = null;
  }

  distances[start] = 0;
  lampsTouched[start] = 0;
  queue.push([distances[start], lampsTouched[start], start]);

  while (queue.length > 0) {
    queue.sort((a, b) => a[0] - b[0]);
    let [currentDistance, currentLamps, currentNode] = queue.shift();

    if (currentNode === end) {
      break;
    }

    if (currentDistance > distances[currentNode] || currentLamps > lampsTouched[currentNode]) {
      continue;
    }

    let neighbors = graph[currentNode];

    for (let neighbor in neighbors) {
      let distance = neighbors[neighbor];
      let newDistance = distances[currentNode] + distance;
      let newLamps = lampsTouched[currentNode] + (neighbor.startsWith('Specialnode') ? 1 : 0);

      if (newDistance < distances[neighbor] && newLamps <= max_lamps) {
        distances[neighbor] = newDistance;
        lampsTouched[neighbor] = newLamps;
        path[neighbor] = currentNode;
        queue.push([distances[neighbor], lampsTouched[neighbor], neighbor]);
      }
    }
  }

  if (path[end] === null) {
    return null;
  }

  let shortestPath = [];
  let currentNode = end;

  while (currentNode !== start) {
    shortestPath.unshift(currentNode);
    currentNode = path[currentNode];
  }

  shortestPath.unshift(start);

  return shortestPath
}

  //graph exportálás jsonbe
  function exportGraphToJSON(graph, fileName) {
    const data = JSON.stringify(graph, null, 2);
  
    fs.writeFile(fileName, data, (err) => {
      if (err) {
        console.error(`Error exporting graph to JSON: ${err}`);
      } else {
        console.log(`Graph successfully exported to ${fileName}`);
      }
    });
  }
  
  const exampleGraph = require('./graph3.json')
  
  
  //kezdő, végső csúcs inicializálása, és amximum lámpa generálás

  const startNode = 'Egyetem';
  const endNode = 'Harrer';
  const maxLamps = 2;
  
  const shortestPath = findShortest(exampleGraph, startNode, endNode, maxLamps);
  
  shortestPath === null? console.log('Nincs elérhető útvonal.') : console.log('Legrövidebb út:', shortestPath.join(' -> '));
  