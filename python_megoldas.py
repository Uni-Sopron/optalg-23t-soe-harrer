import json
import random


def random_number(min_val, max_val):
    return random.randint(min_val, max_val)


def generate_graph_with_special_lamps(normal_lamp_count, special_lamp_count):
    graph = {}
    starter_node = 'Egyetem'
    finish_node = 'Harrer'

    # Egyetem csúcs hozzáadása a gráfhoz
    graph[starter_node] = {}

    # Normális lámpás csúcsok generálása
    for i in range(1, normal_lamp_count + 1):
        node_name = f"Node{i}"
        graph[node_name] = {}

    # Speciális lámpás csúcsok generálása
    for i in range(1, special_lamp_count + 1):
        node_name = f"Specialnode{i}"
        graph[node_name] = {}

    # Harrer csúcs hozzáadása a gráfhoz
    graph[finish_node] = {}

    # Élek generálása
    nodes = list(graph.keys())

    for i in range(len(nodes)):
        current_node = nodes[i]
        neighbors = nodes[i+1:]

        number_of_edges = random_number(1, min(len(neighbors), 5))
        selected_neighbors = select_random_elements(neighbors, number_of_edges)

        for j in range(len(selected_neighbors)):
            neighbor_node = selected_neighbors[j]
            weight = random_number(1, 5)
            graph[current_node][neighbor_node] = weight
            graph[neighbor_node][current_node] = weight

    return graph


def select_random_elements(array, count):
    shuffled = array[:]
    random.shuffle(shuffled)
    return shuffled[:count]


def find_shortest_path(graph, start, end, max_lamps):
    queue = []
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
        current_node = queue.pop(0)
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
        if current_node.startswith('Specialnode') and lamps < max_lamps:
            shortest_path.insert(0, 'Specialnode')
            lamps += 1
        else:
            shortest_path.insert(0, current_node)

        current_node = path[current_node]

    shortest_path.insert(0, start)

    return shortest_path


def export_graph_to_json(graph, file_name):
    with open(file_name, 'w') as file:
        json.dump(graph, file, indent=2)


f = open('graph3.json')
example_graph = json.load(f)
export_graph_to_json(example_graph, 'graph4.json')

start_node = 'Egyetem'
end_node = 'Harrer'
max_lamps = 2

shortest_path = find_shortest_path(
    example_graph, start_node, end_node, max_lamps)

if shortest_path is None:
    print('Nincs elérhető útvonal.')
else:
    print('Legrövidebb út:', ' -> '.join(shortest_path))
