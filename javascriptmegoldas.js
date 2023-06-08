function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function generateGraphWithSpecialLamps(normalLampCount, specialLampCount) {
  const graph = {};
  let starterNode = 'Egyetem'
  let finishnode = 'Harrer'

  // Normális lámpás csúcsok generálása
  for (let i = 1; i <= normalLampCount; i++) {
      if (i ===1){
          const nodeName = starterNode;
          graph[nodeName] = {};
      } else if (i < normalLampCount ){
          const nodeName = `Node${i}`;
          graph[nodeName] = {};
      }
  }

  // Speciális lámpás csúcsok generálása
  for (let i = 1; i <= specialLampCount; i++) {
      const nodeName = `Specialnode${i}`;
      graph[nodeName] = {};
  }
  const nodeName = finishnode;
  graph[nodeName] = {};

  //élek generálása
  const nodes = Object.keys(graph);
  

  for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
          const weight = randomNumber(1, 5);
          graph[nodes[i]][nodes[j]] = weight;

      }
  }

  return graph;
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
  

  const exampleGraph = generateGraphWithSpecialLamps(6,2);
  console.log(exampleGraph);
  //kezdő, végső csúcs inicializálása, és amximum lámpa generálás

  const startNode = 'Egyetem';
  const endNode = 'Harrer';
  const maxLamps = 2;
  
  const shortestPath = findShortest(exampleGraph, startNode, endNode, maxLamps);
  
  shortestPath === null? console.log('Nincs elérhető útvonal.') : console.log('Legrövidebb út:', shortestPath.join(' -> '));
  