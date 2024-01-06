var app;
var graph;
var dragTarget = null;

function onDragMove(event) {
    if (!dragTarget) return;
    dragTarget.parent.toLocal(event.global, null, dragTarget.position);

    dragTarget.vertex.edges.forEach(edge => {
        edge.update();
    });
}

function onDragStart() {
    this.alpha = 0.5;
    dragTarget = this;
    app.stage.on('pointermove', onDragMove);
}

function onDragEnd() {
    if (!dragTarget) return;
    app.stage.off('pointermove', onDragMove);
    dragTarget.alpha = 1;
    dragTarget = null;
}

function createVertexContainer(label, x, y) {
    let container = new PIXI.Container();
    container.eventMode = 'static';
    container.cursor = 'pointer';
    container.x = x;
    container.y = y;

    let circleElement = new PIXI.Graphics();
    circleElement.lineStyle(0);
    circleElement.beginFill(0xFFFF0B, 0.5);
    circleElement.drawCircle(0, 0, 60);
    circleElement.endFill();
    container.addChild(circleElement);
    
    const labelElement = new PIXI.Text(label);
    labelElement.anchor.set(0.5);
    container.addChild(labelElement);

    container.on('pointerdown', onDragStart);

    app.stage.addChild(container);

    return container;
}

class Vertex {
    constructor(label, x, y) {
        this.label = label;
        this.container = createVertexContainer(label, x, y);
        this.container.vertex = this;
        this.edges = []
    }

    connectEdge(edge) {
        this.edges.push(edge);
    }
}

class Edge {
    constructor(vertex1, vertex2) {
        this.vertex1 = vertex1;
        this.vertex2 = vertex2;

        this.arrow = new PIXI.Graphics();
    
        app.stage.addChild(this.arrow);

        this.update();
    }

    update() {
        this.arrow.clear();
        this.arrow.lineStyle(5);
        this.arrow.moveTo(this.vertex1.container.x, this.vertex1.container.y);
        this.arrow.lineTo(this.vertex2.container.x, this.vertex2.container.y);
    }
}

class DiGraph {
    constructor() {
        this.vertices = [];
        this.edges = [];
    }

    addVertex(label, x, y) {
        this.vertices.push(new Vertex(label, x, y));
    }

    addEdge(label1, label2) {
        const vertex1 = this.vertices.find(x => x.label == label1);
        const vertex2 = this.vertices.find(x => x.label == label2);

        const new_edge = new Edge(vertex1, vertex2);

        vertex1.connectEdge(new_edge);
        vertex2.connectEdge(new_edge);

        this.edges.push(new_edge)
    }
}

function handleFormSubmission(event) {
    event.preventDefault();

    const firstSyllable = event.target.querySelector('#first-syllable').value;
    
    const form = document.querySelector('form');
    form.remove();

    startApp(firstSyllable);
}

function startApp(firstSyllable) {

    app = new PIXI.Application({
        background: '#1099bb',
        resizeTo: window,
    });

    app.stage.eventMode = 'static';
    app.stage.hitArea = app.screen;
    app.stage.on('pointerup', onDragEnd);
    app.stage.on('pointerupoutside', onDragEnd);

    document.body.appendChild(app.view);

    graph = new DiGraph();

    graph.addVertex(firstSyllable, app.screen.width / 2, app.screen.height / 2);
    graph.addVertex("jo",20,30);
    graph.addVertex("xa",50,30);

    graph.addEdge("quei", "jo");
}

