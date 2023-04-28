import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import { GLTFLodder } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { gsap } from "gsap";

import fragment from './shader/fragment.glsl'
import vertex from './shader/vertex.glsl'
import * as dat from 'lil-gui'

import noisetexture from '../utils/textures/noise.jpg'


export default class Sketch {
    constructor(options) {
        this.scene = new THREE.Scene()

        this.container = options.dom
        this.width = this.container.offsetWidth
        this.height = this.container.offsetHeight
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.renderer.setSize(this.width, this.height)
        // this.renderer.setClearColor(0xeeeeee, 1)
        this.renderer.setClearColor(0xF9A9FF, 1)
        this.renderer.physicallyCorrectLights = true
        this.renderer.outputEncoding = THREE.sRGBEncoding

        this.container.appendChild(this.renderer.domElement)

        this.camera = new THREE.PerspectiveCamera(
            70,
            this.width / this.height,
            0.001,
            1000
        )

        // let frustumSize = 10
        // let aspect = this.width / this.height
        // this.camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 0.1, 1000 )
        this.camera.position.set(0, 0, 2)
        // this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.time = 0

        this.isPlaying = true


        this.isMouseDown = false
        this.stateAnimation = false
        this.mousePos = new THREE.Vector2()
        this.mouseDownTime = null;
        
        this.cursorElement = document.querySelector(".cursor");
        this.progressBar = document.querySelector(".progress-bar div");

        // Ajouter des écouteurs d'événements pour le clic de la souris
        this.container.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.container.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.container.addEventListener('mouseleave', this.onMouseUp.bind(this));

        // element to add the animation when cursor is hover
        this.variableElement = document.querySelectorAll(".variable-font");

        // loader element
        this.loader = document.querySelector(".loader");
        this.loaderTitle = document.querySelector(".loader-title");

        this.addObjects()
        this.resize()
        this.render()
        this.setupResize()
        this.settings()
    }

    settings() {
        let that = this
        this.settings = {
            progress: 0,
        }
        // this.gui = new dat.GUI({ width: 100 })
        // this.gui.add(this.settings, 'progress', 0, .8, 0.01).listen(); // écouteur de changement de la valeur pour prendre en compte la limite de 1
    }

    setupResize() {
        window.addEventListener('resize', this.resize.bind(this))
    }

    resize() {
        this.width = this.container.offsetWidth
        this.height = this.container.offsetHeight
        this.renderer.setSize(this.width, this.height)
        this.camera.aspect = this.width / this.height

        // image cover
        this.imageAspect = 853 / 1280
        let a1, a2
        if (this.width / this.height > this.imageAspect) {
            a1 = (this.width / this.height) / this.imageAspect
            a2 = 1
        } else {
            a1 = 1
            a2 = this.height / this.width * this.imageAspect
        }

        this.material.uniforms.resolution.value.x = this.width
        this.material.uniforms.resolution.value.y = this.height
        this.material.uniforms.resolution.value.z = a1
        this.material.uniforms.resolution.value.w = a2


        this.camera.updateProjectionMatrix()
    }

    addObjects() {
        let that = this
        this.material = new THREE.ShaderMaterial({
            extensions: {
                derivatives: '#extension GL_OES_standard_derivatives : enable',
            },
            side: THREE.DoubleSide,
            uniforms: {
                time: { value: 0 },
                progress: { value: 0 },
                noisetexture: { value: new THREE.TextureLoader().load(noisetexture) },
                resolution: { value: new THREE.Vector4() },
            },
            // wireframe: true,
            // transparent: true,
            vertexShader: vertex,
            fragmentShader: fragment,
        })

        // this.material = new THREE.MeshNormalMaterial({
        //     side: THREE.DoubleSide,
        // })

        // this.geometry = new THREE.BoxBufferGeometry(1, 1, 1, 10, 10, 10)
        this.geometry = new THREE.TorusKnotGeometry(0.45, 0.18, 100, 16)

        this.plane = new THREE.Mesh(this.geometry, this.material)
        this.scene.add(this.plane)
    }


    onMouseDown(event) {
        // Marquer que le bouton de la souris est enfoncé
        this.isMouseDown = true
        // Mettre à jour la position de la souris
        // this.onMouseMove(event)
    }

    onMouseMove(event) {
        // Mettre à jour la position de la souris
        this.mousePos.x = event.clientX / this.width
        this.mousePos.y = 1 - event.clientY / this.height

        this.plane.position.x = (this.mousePos.x - 0.5) / 3
        this.plane.position.y = (this.mousePos.y - 0.5) / 3
    }

    onMouseUp(event) {
        // Marquer que le bouton de la souris est relâché
        this.isMouseDown = false
    }

    handlerMouseAnimation(){
        // Mettre à jour la valeur de progress en fonction de l'état du bouton de la souris
        let _step1 = 0.3
        let _step2 = 0.5
        let _start = 0
        let _end = 0.9
        let _increment = 0.01
        
        this.progressBar.style.width = `${(this.settings.progress * 100) / _end}%`
        // this.renderer.setClearColor(new THREE.Color(0x000000), this.settings.progress)
        this.renderer.setClearColor(0xfbc2ff, this.settings.progress)

        let _weightProgress = ((this.settings.progress * 1000) / _end);
        let _midlineProgress = ((1 - this.settings.progress) * (1000 - 1)) + 1 - ((this.settings.progress * 100) / _end) * 2;
        this.variableElement.forEach(element => {
            element.style.setProperty('--font-weight', `${_weightProgress}`);
            element.style.setProperty('--font-midline', `${_midlineProgress}`);
            element.style.setProperty('--font-contrast', `${_weightProgress}`);
        });

        if (this.isMouseDown && !this.stateAnimation) {
            if (this.settings.progress < _end) {
              this.settings.progress = Math.min(this.settings.progress + _increment, _end);
            } else {
              this.stateAnimation = true;
            }
        } else if (!this.isMouseDown && !this.stateAnimation) {
            if (this.settings.progress > _step1) {
              this.settings.progress = Math.min(this.settings.progress + _increment, _end);
            } else if (this.settings.progress > _start) {
              this.settings.progress = Math.max(this.settings.progress - _increment, _start);
            }
        } else if (this.isMouseDown && this.stateAnimation) {
            this.settings.progress = Math.max(this.settings.progress - _increment, _start);
        } else if (!this.isMouseDown && this.stateAnimation) {
            if (this.settings.progress < _step2 && this.settings.progress > _start) {
              this.settings.progress = Math.max(this.settings.progress - _increment, _start);
            } else if (this.settings.progress < _end && this.settings.progress >= _step2) {
              this.settings.progress = Math.min(this.settings.progress + _increment, _end);
            } else {
              this.stateAnimation = false;
            }
        }
    }

    stop() {
        this.isPlaying = false
    }

    play() {
        if (!this.isPlaying) {
            this.render()
            this.isPlaying = true
        }
    }

    render() {
        if (!this.isPlaying) return
        this.time += 0.005
        this.plane.rotation.x = this.time
        this.plane.rotation.y = this.time
        this.material.uniforms.time.value = this.time

        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        
        this.handlerMouseAnimation()
        this.material.uniforms.progress.value = this.settings.progress

        window.requestAnimationFrame(this.render.bind(this))
        this.renderer.render(this.scene, this.camera)
    }
}

new Sketch({
    dom: document.getElementById('container'),
})