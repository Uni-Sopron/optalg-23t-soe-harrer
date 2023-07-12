import java.util.*;

public class SOE_Harrer_utvonal {
    private static class Node {
        private final String name;
        private final List<Edge> neighbors;

        public Node(String name) {
            this.name = name;
            this.neighbors = new ArrayList<>();
        }

        public void addNeighbor(Node neighbor, int weight) {
            neighbors.add(new Edge(neighbor, weight));
        }

        public List<Edge> getNeighbors() {
            return neighbors;
        }

        @Override
        public String toString() {
            return name;
        }
    }

    private static class Edge {
        private final Node targetNode;
        private final int weight;

        public Edge(Node targetNode, int weight) {
            this.targetNode = targetNode;
            this.weight = weight;
        }

        public Node getTargetNode() {
            return targetNode;
        }

        public int getWeight() {
            return weight;
        }
    }

    private static class Path {
        private final List<Node> nodes;
        private final int distance;

        public Path() {
            this.nodes = new ArrayList<>();
            this.distance = Integer.MAX_VALUE;
        }

        public Path(List<Node> nodes, int distance) {
            this.nodes = nodes;
            this.distance = distance;
        }

        public List<Node> getNodes() {
            return nodes;
        }

        public int getDistance() {
            return distance;
        }
    }

    private static Path Route(Node startNode, Node targetNode) {
        PriorityQueue<Path> queue = new PriorityQueue<>(Comparator.comparingInt(Path::getDistance));
        Set<Node> visited = new HashSet<>();

        queue.add(new Path(List.of(startNode), 0));

        while (!queue.isEmpty()) {
            Path currentPath = queue.poll();
            Node currentNode = currentPath.getNodes().get(currentPath.getNodes().size() - 1);

            if (currentNode.equals(targetNode)) {
                return currentPath;
            }

            if (!visited.contains(currentNode)) {
                visited.add(currentNode);

                for (Edge edge : currentNode.getNeighbors()) {
                    Node neighbor = edge.getTargetNode();

                    if (!visited.contains(neighbor)) {
                        List<Node> newPath = new ArrayList<>(currentPath.getNodes());
                        newPath.add(neighbor);

                        int newDistance = currentPath.getDistance() + edge.getWeight();
                        queue.add(new Path(newPath, newDistance));
                    }
                }
            }
        }

        return new Path();
    }

    public static void main(String[] args) {
        // Gráf
        Node egyetem = new Node("Egyetem");
        Node a = new Node("Bajcsy-Zsilinszky utca");
        Node b = new Node("Beke ut");
        Node c = new Node("Felsobuki Nagy Pal utca");
        Node d = new Node("Koszegi ut");
        Node e = new Node("Fapiac");
        Node f = new Node("Hid utca");
        Node g = new Node("Rakosi ut");
        Node h = new Node("Elkerulo");
        Node i = new Node("Vero Jozsef utca");


        Node j = new Node("Csengery utca");
        Node harrer = new Node("Harrer");

        egyetem.addNeighbor(a, 0);

        a.addNeighbor(b, 0);

        b.addNeighbor(j, 1);
        b.addNeighbor(c, 0);

        j.addNeighbor(d, 2);
        c.addNeighbor(d, 0);

        d.addNeighbor(e, 0);
        e.addNeighbor(f, 0);
        f.addNeighbor(g, 1);
        g.addNeighbor(h, 0);
        h.addNeighbor(i, 0);

        i.addNeighbor(harrer, 0);



        // Legrövidebb út keresése
        Path ShortestRoute = Route(egyetem, harrer);

        // Eredmény kiírása
        if (ShortestRoute.getDistance() > 2) {
            System.out.println("Nem talalhato utvonal. :(");
        } else {
            System.out.println("Legrovidebb ut az Egyetemtol, a Harrerig:");
            for (Node node : ShortestRoute.getNodes()) {
                System.out.println(" - " + node);
            }
            System.out.println("Ennyi jelzolampan haladtal at: " + ShortestRoute.getDistance());
        }
    }
}
