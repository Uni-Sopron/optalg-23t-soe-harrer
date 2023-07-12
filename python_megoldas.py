from collections import deque
import random
import json
from collections import deque




def findShorthestPath(graph, start, end, max_lamps):
    queue = []
    distances = {}
    visited = {}
    path = {}

    for node in graph:
        for lamps in range(max_lamps + 1):
            distances[(node, lamps)] = float("inf")
        visited[node] = False
        path[node] = None

    distances[(start, 0)] = 0
    queue.append((start, 0))

    while queue:
        min_index = 0
        for i in range(1, len(queue)):
            if distances[queue[i]] < distances[queue[min_index]]:
                min_index = i

        current_node, lamps = queue.pop(min_index)
        visited[current_node] = True

        if current_node == end:
            break

        neighbors = graph[current_node]

        for neighbor, distance in neighbors.items():
            new_distance = distances[(current_node, lamps)] + distance

            if new_distance < distances.get((neighbor, lamps), float("inf")) and not visited[neighbor]:
                distances[(neighbor, lamps)] = new_distance
                path[neighbor] = current_node
                queue.append((neighbor, lamps))

    if path[end] is None:
        return None
    
    shortest_path = []
    current_node = end
    

    #special node nem lehet nagyobb mint 2
    while current_node != start and lamps <= 2:
        if (graph[current_node] and "Specialnode" in graph[current_node] and lamps <= max_lamps):
            shortest_path.insert(0, ("Specialnode", lamps + 1))
            lamps += 1
            
        shortest_path.insert(0, (current_node, lamps))
        current_node = path[current_node]

    shortest_path.insert(0, (start, lamps))

    if lamps <= 2 and current_node != start:
        shortest_path.insert(0, (current_node, lamps))

    return shortest_path


def select_random_elements(array, count):
    shuffled = array[:]
    random.shuffle(shuffled)
    return shuffled[:count]


f = open("graph1.json")
graph = json.load(f)

start_node = "Egyetem"
end_node = "Harrer"
max_lamps = 2

shortest_path = findShorthestPath(graph, start_node, end_node, max_lamps)

if shortest_path is None:
    print("Nincs elérhető útvonal.")
else:
    path_str = " -> ".join(node[0] for node in shortest_path)
    print("Legrövidebb út:", path_str)
