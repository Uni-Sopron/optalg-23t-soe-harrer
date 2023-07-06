from collections import deque
import random
import json

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
    queue = deque()
    distances = {}
    visited = {}
    path = {}

    for node in graph:
        distances[node] = float('inf')
        visited[node] = False
        path[node] = None

    distances[start] = 0
    queue.append(start)

    while queue:
        current_node = queue.popleft()
        visited[current_node] = True

        if current_node == end:
            break

        neighbors = graph[current_node]

        for neighbor, distance in neighbors.items():
            new_distance = distances[current_node] + distance

            if new_distance < distances[neighbor] and not visited[neighbor]:
                distances[neighbor] = new_distance
                path[neighbor] = current_node
                queue.append(neighbor)

    if path[end] is None:
        return None

    shortest_path = []
    current_node = end
    lamps = 0

    while current_node != start:
        if graph[current_node] and 'Specialnode' in graph[current_node] and lamps < max_lamps:
            shortest_path.insert(0, 'Specialnode')
            lamps += 1
        shortest_path.insert(0, current_node)
        current_node = path[current_node]

    shortest_path.insert(0, start)

    return shortest_path


def find_shortest_path(graph, start, end, max_lamps):
    queue = []
    distances = {}
    lamps_touched = {}
    path = {}

    for node in graph:
        distances[node] = float('inf')
        lamps_touched[node] = 0
        path[node] = None

    distances[start] = 0
    lamps_touched[start] = 0
    queue.append((distances[start], lamps_touched[start], start))

    while queue:
        queue.sort()
        current_distance, current_lamps, current_node = queue.pop(0)

        if current_node == end:
            break

        if current_distance > distances[current_node] or current_lamps > lamps_touched[current_node]:
            continue

        neighbors = graph[current_node]

        for neighbor, distance in neighbors.items():
            new_distance = distances[current_node] + distance
            new_lamps = lamps_touched[current_node] + (neighbor.startswith('Specialnode'))

            if new_distance < distances[neighbor] and new_lamps <= max_lamps:
                distances[neighbor] = new_distance
                lamps_touched[neighbor] = new_lamps
                path[neighbor] = current_node
                queue.append((distances[neighbor], lamps_touched[neighbor], neighbor))

    if path[end] is None:
        return None

    shortest_path = []
    current_node = end

    while current_node != start:
        shortest_path.insert(0, current_node)
        current_node = path[current_node]

    shortest_path.insert(0, start)

    return shortest_path

def select_random_elements(array, count):
    shuffled = array[:]
    random.shuffle(shuffled)
    return shuffled[:count]

f = open('graph1.json')
graph = json.load(f)

start_node = 'Egyetem'
end_node = 'Harrer'
max_lamps = 2

shortest_path = findShorthestPath(graph, start_node, end_node, max_lamps)

if shortest_path is None:
    print('Nincs elérhető útvonal.')
else:
    print('Legrövidebb út:', ' -> '.join(shortest_path))
