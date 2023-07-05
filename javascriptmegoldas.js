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

function findShortest(exampleGraph, start, end, maxLamps) {
    //értékek beállítása
    const currentQueue = [];
    const distances = {};
    const alreadyVisited = {};
    const path = {};
    //gráfon végigmenni, minden csúcsot beállítani nem meglátogatottra, és a súlyok számát beállítja végtelenre.

    for (let node in exampleGraph) {
      distances[node] = Infinity;
      alreadyVisited[node] = false;
      path[node] = null;
    }
  
    distances[start] = 0;
    currentQueue.push(start);
  
    while (currentQueue.length > 0) {
      const currentNode = currentQueue.shift();
      alreadyVisited[currentNode] = true;
  
      if (currentNode === end) {
        break;
      }
  
      const neighbors = exampleGraph[currentNode];
  
      for (let neighbor in neighbors) {
        const distance = distances[currentNode] + neighbors[neighbor];
  
        if (distance < distances[neighbor] && !alreadyVisited[neighbor]) {
          distances[neighbor] = distance;
          path[neighbor] = currentNode;
          currentQueue.push(neighbor);
        }
      }
    }

    // ez azt jelenti hogy nincs elérhető útvonal
    if (path[end] === null) {
      return null; 
      
    }
  
    // Útvonal visszafejtése
    const shortestPath = [];
    let currentNode = end;
    let lamps = 0;
  
    while (currentNode !== start) {
      if (exampleGraph[currentNode] && 'Specialnode' in exampleGraph[currentNode] && lamps < maxLamps) {
        shortestPath.unshift('Specialnode');
        lamps++;
      }
      shortestPath.unshift(currentNode);
      currentNode = path[currentNode];
    }
  
    shortestPath.unshift(start);
  
    return shortestPath;
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
  