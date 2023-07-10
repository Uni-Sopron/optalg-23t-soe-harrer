from collections import deque
import random
import json
from collections import deque




def findShorthestPath(graph, start, end, max_lamps):
    """
    Legrövidebb útvonalat keres az adott gráfban a kezdőponttól a végpontig, figyelembe véve a maximális lámpás kereszteződések számát.

    Args:
        graph (dict): A gráf reprezentációja, amely a csúcsok és azok közötti élek tárolására szolgál.
        start (str): A kezdőcsúcs neve.
        end (str): A végcsúcs neve.
        max_lamps (int): A maximális lámpás kereszteződések száma, amelyet az útvonalban engedélyezünk.

    Returns:
        list or None: A legrövidebb útvonal csúcsok listájaként, vagy None, ha nincs elérhető útvonal.
    """
    queue = []
    distances = {}
    visited = {}
    path = {}

    for node in graph:
        distances[node] = float("inf")
        visited[node] = False
        path[node] = None

    distances[start] = 0
    queue.append((start, 0))

    while queue:
        # Find the node with the minimum distance in the queue
        min_index = 0
        for i in range(1, len(queue)):
            if distances[queue[i][0]] < distances[queue[min_index][0]]:
                min_index = i

        current_node, lamps = queue.pop(min_index)
        visited[current_node] = True

        if current_node == end:
            break

        neighbors = graph[current_node]

        for neighbor, distance in neighbors.items():
            new_distance = distances[current_node] + distance

            if new_distance < distances[neighbor] and not visited[neighbor]:
                distances[neighbor] = new_distance
                path[neighbor] = current_node
                queue.append((neighbor, lamps))

    if path[end] is None:
        return None

    shortest_path = []
    current_node = end

    while current_node != start:
        if (
            graph[current_node]
            and "Specialnode" in graph[current_node]
            and lamps < max_lamps
        ):
            shortest_path.insert(0, ("Specialnode", lamps + 1))
            lamps += 1
        shortest_path.insert(0, (current_node, lamps))
        current_node = path[current_node]

    shortest_path.insert(0, (start, lamps))

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
