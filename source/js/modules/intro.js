import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import AnimatedText from './animated-text';

import canvasFrame from '../helpers/canvas-frame';
import sceneObjects from '../helpers/scene-objects';
import colors from '../helpers/colors';
const CAMERA_DIST = 1405;

const introTitle = new AnimatedText(document.querySelector(`.intro__title`));
const introDate = new AnimatedText(document.querySelector(`.intro__date`));

const degToRadians = (deg) => (deg * Math.PI) / 180;

class IntroCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.objects = {};
    this.svgItems = [
      {
        title: `keyhole`,
        url: `img/keyhole.svg`,
        height: 2000,
        depth: 20,
        cap: 2,
        x: 1000,
        y: 1000,
        z: 0,
        rotX: 0,
        rotY: 0,
        rotZ: 180,
        material: `soft`,
        color: colors.darkPurple,
      },
      {
        title: `flamingo`,
        url: `img/flamingo.svg`,
        height: 85,
        depth: 8,
        cap: 2,
        x: -400,
        y: 300,
        z: 75,
        rotX: -10,
        rotY: 15,
        rotZ: 2000,
        material: `soft`,
        color: colors.lightDominantRed,
      },
      {
        title: `snowflake`,
        url: `img/snowflake.svg`,
        height: 74,
        depth: 8,
        cap: 2,
        x: -275,
        y: 50,
        z: 60,
        rotX: 10,
        rotY: 35,
        rotZ: 10,
        material: `basic`,
        color: colors.blue,
      },
      {
        title: `question`,
        url: `img/question.svg`,
        height: 56,
        depth: 8,
        cap: 2,
        x: 110,
        y: -250,
        z: 80,
        rotX: -40,
        rotY: 180,
        rotZ: 160,
        material: `basic`,
        color: colors.blue,
      },
      {
        title: `leafKeyhole`,
        url: `img/leaf.svg`,
        height: 117,
        depth: 8,
        cap: 2,
        x: 400,
        y: 250,
        z: 110,
        rotX: -20,
        rotY: 140,
        rotZ: 260,
        material: `basic`,
        color: colors.green,
      },
    ];

    this.init = this.init.bind(this);
    this.render = this.render.bind(this);
    this.resizeRenderer = this.resizeRenderer.bind(this);
    this.addObject = this.addObject.bind(this);
  }

  addObject(title, object) {
    this.objects[`${title}`] = object;
  }

  init() {
    const initialWidth = window.innerWidth;
    const initialHeight = window.innerHeight;

    const canvas = this.canvas;
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      logarithmicDepthBuffer: true
    });
    this.renderer.setClearColor(0x000000, 0.7);
    this.renderer.setSize(initialWidth, initialHeight);

    const params = {
      fov: 2 * Math.atan((window.innerHeight) / (2 * CAMERA_DIST)) * 180 / Math.PI,
      aspect: initialWidth / initialHeight,
      near: 0.1,
      far: 10000
    };
    this.camera = new THREE.PerspectiveCamera(params.fov, params.aspect, params.near, params.far);
    this.camera.position.z = CAMERA_DIST;

    this.controls = new OrbitControls(this.camera, canvas);

    this.scene = new THREE.Scene();

    const light = sceneObjects.prepareLight(this.camera);
    const saturn = sceneObjects.prepareSaturn(colors.shadowedDominantRed, colors.shadowedBrightPurple, true);
    sceneObjects.prepareSvgs(this.svgItems, this.scene, this.addObject);
    sceneObjects.prepare3dObj(this.scene, this.addObject, `img/airplane.obj`, `airplane`, colors.white, `basic`, 200, 75, 100, 60, 140, -15);
    sceneObjects.prepareGltfObj(this.scene, this.addObject, `img/suitcase.gltf`, `suitcase`, -80, -175, 50, 20, 220, 10, 0.5);
    sceneObjects.prepareGltfObj(this.scene, this.addObject, `img/watermelon.gltf`, `watermelon`, -450, -175, 100, 15, 160, 40, 1.5);

    this.addObject(`light`, light);
    this.addObject(`saturn`, saturn);

    saturn.position.x = 400;
    saturn.position.y = -200;
    saturn.position.z = 100;
    saturn.scale.set(0.5, 0.5, 0.5);
    saturn.rotation.copy(new THREE.Euler(degToRadians(10), degToRadians(0), degToRadians(10), `XYZ`));

    this.scene.add(light);
    this.scene.add(saturn);

    canvasFrame.addRender(this.render);
    window.addEventListener(`resize`, this.resizeRenderer);
  }

  resizeRenderer() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const needResize = this.canvas.width !== width || this.canvas.height !== height;

    if (needResize) {
      this.renderer.setSize(width, height);
      this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
      this.camera.fov = 2 * Math.atan(window.innerHeight / (2 * CAMERA_DIST)) * 180 / Math.PI;
      this.camera.updateProjectionMatrix();
    }
  }

  render() {
    this.controls.update();

    this.renderer.render(this.scene, this.camera);
  }
}

const introCanvas = new IntroCanvas(document.querySelector(`#introCanvas`));
introCanvas.init();

export default [introTitle, introDate];
