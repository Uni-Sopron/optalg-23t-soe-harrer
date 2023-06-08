from collections import deque
import random


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


def generate_graph_with_special_lamps(normal_lamp_count, special_lamp_count):
    graph = {}
    starter_node = 'Egyetem'
    finish_node = 'Harrer'

    # Normális lámpás csúcsok generálása
    for i in range(1, normal_lamp_count + 1):
        if i == 1:
            node_name = starter_node
            graph[node_name] = {}
        elif i < normal_lamp_count:
            node_name = f"Node{i}"
            graph[node_name] = {}

    # Speciális lámpás csúcsok generálása
    for i in range(1, special_lamp_count + 1):
        node_name = f"Specialnode{i}"
        graph[node_name] = {}

    node_name = finish_node
    graph[node_name] = {}

    # élek generálása
    nodes = list(graph.keys())
    for i in range(0, len(nodes)):
        for j in range(i + 1, len(nodes)):
            weight = random.randint(1, 5)
            if nodes[i] != nodes[j]:
                if nodes[j] not in graph[nodes[i]]:
                    graph[nodes[i]][nodes[j]] = weight
                else:
                    graph[nodes[i]][nodes[j]] += weight

    return graph


graph = generate_graph_with_special_lamps(5, 2)
start_node = 'Egyetem'
end_node = 'Harrer'
max_lamps = 2

shortest_path = findShorthestPath(graph, start_node, end_node, max_lamps)

if shortest_path is None:
    print('Nincs elérhető útvonal.')
else:
    print('Legrövidebb út:', ' -> '.join(shortest_path))
