var app;
var dragTarget = null;

function onDragMove(event) {
    if (!dragTarget) return;
    dragTarget.parent.toLocal(event.global, null, dragTarget.position);
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

class vertice {
    constructor(label, x, y) {
        
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

        this.label = label;
    }
}

class DiGraph {
    constructor() {
        this.vertices = [];
        this.edges = [];
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

    new vertice(firstSyllable, app.screen.width / 2, app.screen.height / 2);
}

