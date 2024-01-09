"use strict";
var program;
var gl;
var vertices = [];
var indexed_vertices = [];
var faces = [];
var numVertices = 0;
var start_vertice = false;
var maxPoint = vec3(-Infinity, -Infinity, -Infinity);
var minPoint = vec3(Infinity, Infinity, Infinity);
var maxWidth;
var minX = Infinity;
var minY = Infinity;
var minZ = Infinity;
var maxX = -Infinity;
var maxY = -Infinity;
var maxZ = -Infinity;
var translate = [0, 0, 0];
var scale = [1,1,1];
var prevScale = [0, 0, 0]
var prevWidth = [0, 0, 0];
var rotate = [0, 0, 0];
var prevRotate = [0, 0, 0];
var colorBunny = [0,0,0];
var reflect = [false, false, false]


function initShaderFiles(file1, file2) {
    function createElementWithFile(file, element_id) {
        const req = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if (req.readyState == 4) {
                // The request is done; did it work?
                if (req.status == 200) {
                    // ***Yes, use `req.responseText` here***
                    const head = document.head;
                    const element = document.createElement("shader");
                    element.setAttribute("id", element_id);
                    element.textContent = req.responseText;
                    head.appendChild(element);
                } else {
                    // ***No, tell the callback the call failed***
                    alert('Cannot read ' + req.responseURL)
                }
            }
        };
        req.open("GET", 'http://localhost:8000/'+file, false)
        req.send(null)
    }
    createElementWithFile(file1, "vtx-head");
    createElementWithFile(file2, "frg-head");

    return initShaders(gl, "vtx-head", "frg-head"); // connecting to the shaders
}

const parseFile = (file) => {
        let input = file.toString()
        let lines = input.split('\n')
        for (var i=0; i<lines.length; i++){
            if(start_vertice){
                if(!lines[i].startsWith('3 ')){
                    const vertice = lines[i].split(' ')
                    const a = Number(vertice[0])
                    const b = Number(vertice[1])
                    const c = Number(vertice[2])
                    const point = vec3(a,b,c)
                    vertices.push(point)
                    if (isNaN(a) || isNaN(b) || isNaN(c));
                    else{
                        minX = Math.min(minX, a);
                        minY = Math.min(minY, b);
                        minZ = Math.min(minZ, c);
                        maxX = Math.max(maxX, a);
                        maxY = Math.max(maxY, b);
                        maxZ = Math.max(maxZ, c);
                    }
                }else{
                    const face = lines[i].split(' ')
                    faces.push(Number(face[1]),Number(face[2]), Number(face[3]))
                }
            }
            if (lines[i].includes('element vertex')){
                numVertices = lines[i].split(' ')[2]
            }
            if (lines[i].includes('end_header')){
                start_vertice = true
            }
        }
        // translating scaling the bunny to the origin
        maxPoint = vec3(maxX, maxY, maxZ)
        minPoint = vec3(minX, minY, minZ)
        const X_width = maxX - minX
        const Y_width = maxY - minY
        const Z_width = maxZ - minZ
        maxWidth = Math.max(X_width, Y_width, Z_width)
        scale = [1/maxWidth, 1/maxWidth, 1/maxWidth];
        translate = [(maxX + minX) / 2,
                    (maxY + minY) / 2,
                    (maxZ + minZ) / 2]

        //iterating through the faces array to retrieve that index of vertex from the vertices array
        //essentially creating fragments one by one by fetching their respective vertex
        for(var i=0; i<faces.length; i++){
            indexed_vertices.push(vertices[faces[i]])
        }
        colorBunny = [0,1,0];
        preRender()
}

const readFileContent = (file) => {
    const reader = new FileReader();
      
    reader.onload = function (event) {
        const fileContent = event.target.result; 
        parseFile(fileContent)
    };
      
    reader.readAsText(file); 
}

// Reflecting the bunny about the X axis
const reflectX = () => {
    var v = [];
    for(var i = 0; i<indexed_vertices.length; ++i){
        var new_vertex = vec3(indexed_vertices[i][0],1.5*maxWidth-indexed_vertices[i][1],indexed_vertices[i][2]);
        v.push(new_vertex);
        }
    indexed_vertices = v;
    if (reflect[0])
        reflect[0] = false;
    else reflect[0] = true;
    preRender()
}

// Reflecting the bunny about the Y axis
const reflectY = () => {
    var v = [];
    for(var i = 0; i<indexed_vertices.length; ++i){
        var new_vertex = vec3(-indexed_vertices[i][0],indexed_vertices[i][1],indexed_vertices[i][2]);
        v.push(new_vertex);
        }
    indexed_vertices = v;
    preRender()
    if (reflect[1])
        reflect[1] = false;
    else reflect[1] = true;
}

// Reflecting the bunny about the Z axis
const reflectZ = () => {
    var v = [];
    for(var i = 0; i<indexed_vertices.length; ++i){
        var new_vertex = vec3(indexed_vertices[i][0],indexed_vertices[i][1],-indexed_vertices[i][2]);
        v.push(new_vertex);
        }
    indexed_vertices = v;
    if (reflect[2])
        reflect[2] = false;
    else reflect[2] = true;
    preRender()
}


window.onload = () => {

    const translate_X = document.getElementById('vertex1RSlider');
    const valueTranslate_X = document.getElementById('vertex1RValue');
    const translate_Y = document.getElementById('vertex1RSlider_Y');
    const valueTranslate_Y = document.getElementById('vertex1RValue_Y');
    const translate_Z = document.getElementById('vertex1RSlider_Z');
    const valueTranslate_Z = document.getElementById('vertex1RValue_Z');
    const scale_X = document.getElementById('sliderScale_X');
    const valueScale_X = document.getElementById('valueScale_X');
    const scale_Y = document.getElementById('sliderScale_Y');
    const valueScale_Y = document.getElementById('valueScale_Y');
    const scale_Z = document.getElementById('sliderScale_Z');
    const valueScale_Z = document.getElementById('valueScale_Z');
    const rotate_X = document.getElementById('sliderRotate_X');
    const valueRotate_X = document.getElementById('valueRotate_X');
    const rotate_Y = document.getElementById('sliderRotate_Y');
    const valueRotate_Y = document.getElementById('valueRotate_Y');
    const rotate_Z = document.getElementById('sliderRotate_Z');
    const valueRotate_Z = document.getElementById('valueRotate_Z');
    const reflect_X = document.getElementById('reflect_x');
    const reflect_Y = document.getElementById('reflect_y');
    const reflect_Z = document.getElementById('reflect_z');
    const reset = document.getElementById('reset');
    const color_reset = document.getElementById('colorReset')

    // Listening to the input event on the sliders
    translate_X.addEventListener('input', function() {
        valueTranslate_X.textContent = this.value;
        translate[0] -= (this.value - prevWidth[0])/100;
        preRender()
        prevWidth[0] = this.value;
    });
    
    translate_Y.addEventListener('input', function() {
        valueTranslate_Y.textContent = this.value;
        translate[1] -= (this.value - prevWidth[1])/100;
        preRender()
        prevWidth[1] = this.value;
    });
    
    translate_Z.addEventListener('input', function() {
        valueTranslate_Z.textContent = this.value;
        translate[2] -= (this.value - prevWidth[2])/100;
        preRender()
        prevWidth[2] = this.value;
    })

    scale_X.addEventListener('input', function() {
        valueScale_X.textContent = this.value;
        scale[0] += (this.value - prevScale[0])/5;
        preRender()
        prevScale[0] = this.value;
    })

    scale_Y.addEventListener('input', function() {
        valueScale_Y.textContent = this.value;
        scale[1] += (this.value - prevScale[1])/5;
        preRender()
        prevScale[1] = this.value;
    })

    scale_Z.addEventListener('input', function() {
        valueScale_Z.textContent = this.value;
        scale[2] += (this.value - prevScale[2])/5;
        preRender()
        prevScale[2] = this.value;
    })

    rotate_X.addEventListener('input', function() {
        valueRotate_X.textContent = this.value;
        rotate[0] += (this.value - prevRotate[0])/3.18;
        preRender()
        prevRotate[0] = this.value;
    })

    rotate_Y.addEventListener('input', function() {
        valueRotate_Y.textContent = this.value;
        rotate[1] += (this.value - prevRotate[1])/3.18;
        preRender()
        prevRotate[1] = this.value;
    })

    rotate_Z.addEventListener('input', function() {
        valueRotate_Z.textContent = this.value;
        rotate[2] += (this.value - prevRotate[2])/3.18;
        preRender()
        prevRotate[2] = this.value;
    })

    // Listening to the click event on the reflection buttons
    reflect_X.addEventListener('click',function() {
        reflectX()
        preRender()
    })

    reflect_Y.addEventListener('click',function() {
        reflectY()
        preRender()
    })

    reflect_Z.addEventListener('click',function() {
        reflectZ()
        preRender()
    })

    reset.addEventListener('click',function() {
        scale = [1/maxWidth, 1/maxWidth, 1/maxWidth];
        translate = [(maxX + minX) / 2,
                    (maxY + minY) / 2,
                    (maxZ + minZ) / 2]
        rotate = [0, 0, 0];
        colorBunny = [0,1,0];
        // checking if the bunny is reflected and resetting it
        if (reflect[0]){
            reflectX()
        }
        if (reflect[1]){
            reflectY()
        }
        if (reflect[2]){
            reflectZ()
        }
        preRender()
        // resetting the html sliders
        valueTranslate_X.textContent = 0;
        translate_X.value = 0;
        valueTranslate_Y.textContent = 0;
        translate_Y.value = 0;
        valueTranslate_Z.textContent = 0;
        translate_Z.value = 0;
        valueScale_X.textContent = 0;
        scale_X.value = 0;
        valueScale_Y.textContent = 0;
        scale_Y.value = 0;
        valueScale_Z.textContent = 0;
        scale_Z.value = 0;
        valueRotate_X.textContent = 0;
        rotate_X.value = 0;
        valueRotate_Y.textContent = 0;
        rotate_Y.value = 0;
        valueRotate_Z.textContent = 0;
        rotate_Z.value = 0;
    })

    color_reset.addEventListener('click',function(){
        colorBunny=[Math.random(),Math.random(),Math.random()]
        console.log(colorBunny)
        preRender()
    })

    document.getElementById("fileInput").addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            readFileContent(file);
        }
    });
}

const preRender = () => {
    let canvas = document.getElementById("gl-canvas"); // Retrieving Canvas element from html
    gl = canvas.getContext("webgl2"); // getting the webgl2 context
    if (!gl) alert("WebGL isn't available"); // Alerts if WebGL is not supported by the browser
    
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    
    program = initShaderFiles( "mesh-vshader.glsl", "mesh-fshader.glsl" ); // connecting to the shader

    // Associate out shader variables with our data buffer
    let vPosition = gl.getAttribLocation(program, "vPosition"); // Connecting vPosition from vertex shader to vertices

    // var maxWidthUniform = gl.getUniformLocation(program, "maxWidth");
    var scaleR = gl.getUniformLocation(program, "scale");
    var translateR = gl.getUniformLocation(program, "translate");
    var rotateR = gl.getUniformLocation(program, "rotate");
    var colorR = gl.getUniformLocation(program,"color");

     // Creating a Buffer
     var positionBuffer =  gl.createBuffer()

     // Connecting vertices to the shader
    var vao = gl.createVertexArray();

    gl.bindVertexArray(vao);

    gl.enableVertexAttribArray(vPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);

    gl.viewport(0, 0, canvas.width, canvas.height); // setting the viewing port and the default color of the canvas
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.useProgram(program); // using the shader program

    gl.bindVertexArray(vao);

    // gl.uniform1f(maxWidthUniform,maxWidth);  
    gl.uniform1fv(scaleR, scale);
    gl.uniform1fv(translateR, translate);
    gl.uniform1fv(rotateR, rotate);
    gl.uniform1fv(colorR, colorBunny);

    gl.bufferData(gl.ARRAY_BUFFER, flatten(indexed_vertices), gl.STATIC_DRAW); // Transforming (flattening) vertices into data type that Shaders can understand

    render(); // calling render function
};



let render = () => {
    gl.clear(gl.COLOR_BUFFER_BIT| gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, indexed_vertices.length);
};