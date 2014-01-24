infogra
=======

Infographic Modeller &amp; Viewer

## Features
 * Canvas base
 * Barcode Symbols
 * Rectangle
 * Circle
 * Line
 * Text
 * Image
 
## Usage

```js
var infogra = require('infogra');

var modeler = infogra.createModeler(canvas, {
	keydown : onKeyDownHandler,
    selectionchange : onSelectionChange,
    propertychange : onPropertyChange
});

var viewer = infogra.createViewer(canvas, {
	keydown : onKeyDownHandler
});
```

## API

### Objects
* modeler / viewer
* symbol (model) 

### Modeler(Viewer) Properties
* get / set
 * edit mode
 * width
 * height
 * root model
* symbol : get symbol

### Symbols (Models) Manipulation
* add : add symbol(s)
* remove : remove symbol(s)
* get : get child symbol(s)

### Selections
* selected : get or set selected symbol

### Move
* move : move delta or move to

### Editing
* undo
* redo
* cut
* copy
* paste

### Align
* align : top, bottom, left, right, vcenter, hcenter

### Arrange Z-Order
* arrange : front, back, forward, backward

### Scale
* scale : enlarge, reduce or set scale
 
## Events

### Modeler(Viewer) Property Change
* before / after property change
* before / after close

### Symbols Structure Change
* When symbols structure is changed
* It means some symbol is added, removed or moved on their symbol hierarchy

### Symbol(Model) Property Change


## License
Copyright (c) 2014 Hearty, Oh. Licensed under the MIT license.
