import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import AnimatedText from './animated-text';

import canvasFrame from '../helpers/canvas-frame';
import sceneObjects from '../helpers/scene-objects';
import colors from '../helpers/colors';

const introTitle = new AnimatedText(document.querySelector(`.intro__title`));
const introDate = new AnimatedText(document.querySelector(`.intro__date`));

const svgItems = [
  {
    title: `flamingo`,
    url: `img/flamingo.svg`,
    height: 85,
    depth: 8,
    cap: 2,
    x: 100,
    y: 150,
    z: 30,
    material: `soft`,
    color: colors.lightDominantRed,
  },
  {
    title: `snowflake`,
    url: `img/snowflake.svg`,
    height: 74,
    depth: 8,
    cap: 2,
    x: 200,
    y: 200,
    z: 35,
    material: `basic`,
    color: colors.blue,
  },
  {
    title: `question`,
    url: `img/question.svg`,
    height: 56,
    depth: 8,
    cap: 2,
    x: -100,
    y: -100,
    z: 40,
    material: `basic`,
    color: colors.blue,
  },
  {
    title: `keyhole`,
    url: `img/keyhole.svg`,
    height: 2000,
    depth: 20,
    cap: 2,
    x: 1000,
    y: 1000,
    z: -300,
    material: `soft`,
    color: colors.darkPurple,
  },
  {
    title: `leafKeyhole`,
    url: `img/leaf.svg`,
    height: 117,
    depth: 8,
    cap: 2,
    x: 100,
    y: -100,
    z: 45,
    material: `basic`,
    color: colors.green,
  },
  {
    title: `leafRoom2`,
    url: `img/leaf.svg`,
    height: 335.108,
    depth: 3,
    cap: 3,
    x: 500,
    y: 300,
    z: 55,
    material: `basic`,
    color: colors.green,
  },
];

class IntroCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.objects = {};

    this.init = this.init.bind(this);
    this.render = this.render.bind(this);
    this.resizeRenderer = this.resizeRenderer.bind(this);
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
      fov: 2 * Math.atan((window.innerHeight) / (2 * 1000)) * 180 / Math.PI,
      aspect: initialWidth / initialHeight,
      near: 0.1,
      far: 10000
    };
    this.camera = new THREE.PerspectiveCamera(params.fov, params.aspect, params.near, params.far);
    this.camera.position.z = 2000;

    this.controls = new OrbitControls(this.camera, canvas);

    this.scene = new THREE.Scene();

    const light = sceneObjects.prepareLight(this.camera);
    const carpet = sceneObjects.prepareCarpet();
    const road = sceneObjects.prepareRoad();
    const saturn1 = sceneObjects.prepareSaturn(colors.dominantRed, colors.brightPurple);
    const saturn2 = sceneObjects.prepareSaturn(colors.shadowedDominantRed, colors.shadowedBrightPurple);
    const svgObjects = sceneObjects.prepareSvgs(svgItems, this.scene);
    const pyramid = sceneObjects.preparePyramid();
    const snowman = sceneObjects.prepareSnowman();
    const lattern = sceneObjects.prepareLattern();

    this.objects = {
      light,
      carpet,
      road,
      saturn1,
      saturn2,
      svgObjects,
      pyramid,
      snowman,
      lattern,
    };

    carpet.position.z = 300;

    road.position.y = 20;
    road.position.z = 100;

    saturn1.position.x = -150;

    saturn2.position.x = 150;

    pyramid.position.x = -200;
    pyramid.position.y = -200;
    pyramid.rotateY((-5 * Math.PI) / 180);

    snowman.position.x = 330;
    snowman.position.y = 330;

    lattern.position.x = 250;
    lattern.position.y = 250;
    lattern.position.z = 100;
    lattern.rotateX((7.5 * Math.PI) / 180);
    lattern.rotateY((-5 * Math.PI) / 180);

    this.scene.add(light);
    this.scene.add(carpet);
    this.scene.add(road);
    this.scene.add(saturn1);
    this.scene.add(saturn2);
    this.scene.add(pyramid);
    this.scene.add(snowman);
    this.scene.add(lattern);

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
      this.camera.fov = 2 * Math.atan(window.innerHeight / (2 * 1000)) * 180 / Math.PI;
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
