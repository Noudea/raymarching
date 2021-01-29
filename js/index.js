import * as THREE from "three";

import fragment from "./shader/fragment.glsl";
import vertex from "./shader/vertex.glsl";
import * as dat from "dat.gui";

import { TimelineMax } from "gsap";
let OrbitControls = require("three-orbit-controls")(THREE);

export default class Sketch {
    constructor(selector){
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0xeeeeee, 1);

        this.container = document.getElementById("container");

        this.camera = new THREE.PerspectiveCamera(
            70,
            window.innerWidth / window.innerHeight,
            0.001,
            1000
        )
        this.camera.position.set(0,0,2)
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.time = 0;
        this.paused = false;

        this.setupResize();
        this.addObjects();
        this.resize();
        this.render()
    }

settings() {
    let that = this;
    this.settings = {
        time : 0,
    }
    this.gui = new dat.GUI();
    this.gui.add(this.settings, "time",0,100,0.01); 
}

setupResize() {
    window.addEventListener("resize", this.resize.bind(this))
}

resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight,
    this.renderer.SetSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;

    //image cover
    this.imageAspect = 853/1280
    let a1
    let a2
    if (this.height/this.width>this.imageAspect)
    {
        a1 = (this.width/this.height) * this.imageAspect
        a2 = 1
    } else {
        a1=1
        a2=(this.height/this.width)/this.imageAspect
    }
    this.material.uniforms.resolution.value.x = this.width;
    this.material.uniforms.resolution.value.y = this.height;
    this.material.uniforms.resolution.value.z = a1
    this.material.uniforms.resolution.value.w = a2

    //optional cover with quad
    const dist = this.camera.position.z
    const height = 1 
    this.camera.fov = 2*(180/Math.PI)*Math.atan(height/(2*dist))

    if(this.width/this.height>1){
        this.plane.scale.x = this.camera.aspect
    } else{
        this.plane.scale.y = 1/this.camera.aspect
    }

    this.camera.updateProjectionMatrix();

}

addObjects() {
    let that = this;
    this.material = new THREE.ShaderMaterial({
        extensions: {
            derivatives : "#extention GL_OES_standard_derivatives :"
        },
        side : THREE.DoubleSide,
        uniforms : {
            time: {type : "f", value:0},
            mouse: {type : "f", value: new THREE.Vector2(0,0)},
            resolution: {type: "v4", value: new THREE.Vector4()},
            uvRate1: {
                value: new THREE.Vector2(1,1)
            }
        },
        // vertexShader: vertex,
        frameShader: fragment
    })
}

}

new Sketch()