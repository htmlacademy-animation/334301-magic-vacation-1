import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {SVGLoader} from "three/examples/jsm/loaders/SVGLoader";

// modules
import mobileHeight from './modules/mobile-height-adjust.js';
import slider from './modules/slider.js';
import menu from './modules/menu.js';
import footer from './modules/footer.js';
import chat from './modules/chat.js';
import result from './modules/result.js';
import form from './modules/form.js';
import social from './modules/social.js';
import FullPageScroll from './modules/full-page-scroll';
import body from './modules/body.js';
import rules from './modules/rules.js';
import introElements from './modules/intro.js';
import game from './modules/game.js';
import prizes from './modules/prizes.js';

import canvasFrame from './modules/canvas-frame';

// init modules
mobileHeight();
slider();
menu();
footer();
chat();
result();
form();
social();
body();
rules();

game.init();
prizes.init();
const fullPageScroll = new FullPageScroll();
fullPageScroll.init();
introElements.forEach((element) => element.init());

class SvgTask {
  constructor(canvas) {
    this.canvas = canvas;
    this.svgsOptions = [
      {
        title: `flamingo`,
        url: `img/flamingo.svg`,
        height: 85,
        depth: 8,
        cap: 2,
        x: 100,
        y: 100,
        z: 30,
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
      },
      {
        title: `keyhole`,
        url: `img/keyhole.svg`,
        height: 2000,
        depth: 20,
        cap: 2,
        x: 500,
        y: -500,
        z: 0,
      },
      {
        title: `flowerRoom1`,
        url: `img/flower.svg`,
        height: 413,
        depth: 4,
        cap: 2,
        x: -200,
        y: 200,
        z: 50,
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
      },
    ];
    this.svgObjects = {};

    this.prepareLight = this.prepareLight.bind(this);
    this.resizeRenderer = this.resizeRenderer.bind(this);
    this.render = this.render.bind(this);
    this.init = this.init.bind(this);
  }

  init() {
    const initialWidth = window.innerWidth;
    const initialHeight = window.innerHeight;

    const canvas = this.canvas;
    this.renderer = new THREE.WebGLRenderer({canvas});
    this.renderer.setClearColor(0xf0f0f0, 0.3);

    const params = {
      fov: 2 * Math.atan(window.innerHeight / (2 * 1000)) * 180 / Math.PI,
      aspect: initialWidth / initialHeight,
      near: 0.1,
      far: 10000
    };
    this.camera = new THREE.PerspectiveCamera(params.fov, params.aspect, params.near, params.far);
    this.camera.position.z = 1000;

    this.controls = new OrbitControls(this.camera, canvas);

    this.scene = new THREE.Scene();

    this.scene.add(this.prepareLight());

    let loader = new SVGLoader();

    this.svgsOptions.forEach((svg) => {
      loader.load(
          svg.url,
          (svgData) => {
            const paths = svgData.paths;
            const svgGroup = new THREE.Group();

            for (let i = 0; i < paths.length; i++) {
              const path = paths[i];

              const shapeMaterial = new THREE.MeshBasicMaterial({
                color: path.color,
                side: THREE.DoubleSide,
                opacity: path.userData.style.fillOpacity,
                transparent: path.userData.style.fillOpacity < 1,
                depthWrite: false
              });

              const shapes = path.toShapes(true);

              for (let j = 0; j < shapes.length; j++) {
                const shape = shapes[j];
                const extrudeSettings = {
                  steps: 1,
                  depth: svg.depth,
                  bevelEnabled: true,
                  bevelThickness: svg.cap,
                  bevelSize: svg.cap,
                };

                const extrudeGeometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings);
                const shapeMesh = new THREE.Mesh(extrudeGeometry, shapeMaterial);
                svgGroup.add(shapeMesh);
              }
            }

            const box = new THREE.Box3().setFromObject(svgGroup);
            const size = new THREE.Vector3();
            box.getSize(size);
            let scaleValue = svg.height / size.y;
            svgGroup.position.x = svg.x;
            svgGroup.position.y = svg.y;
            svgGroup.position.z = svg.z;
            svgGroup.rotateZ((180 * Math.PI) / 180);
            svgGroup.scale.multiplyScalar(scaleValue);

            this.svgObjects[svg.title] = svgGroup;

            this.scene.add(svgGroup);
          },
      );
    });

    this.resizeRenderer();
    window.addEventListener(`resize`, this.resizeRenderer);

    canvasFrame.addRender(this.render);
  }

  prepareLight() {
    const cameraPosition = this.camera.position.z;

    const light = new THREE.Group();

    const directionaLight = new THREE.DirectionalLight(new THREE.Color(`rgb(255,255,255)`), 0.84);

    const directionalY = Math.pow(Math.abs(Math.pow(Math.pow(Math.pow(2, 3 / 2) / (Math.pow(3, 1 / 2) + cameraPosition), 2) - cameraPosition, 2) - cameraPosition), 1 / 2);
    directionaLight.position.set(0, directionalY, cameraPosition);

    light.add(directionaLight);

    const pointLight1 = new THREE.PointLight(new THREE.Color(`rgb(246,242,255)`), 0.6, 975, 2);
    pointLight1.position.set(785, 350, 710);

    light.add(pointLight1);

    const pointLight2 = new THREE.PointLight(new THREE.Color(`rgb(245,254,255)`), 0.95, 975, 2);
    pointLight1.position.set(730, 800, 985);

    light.add(pointLight2);

    return light;
  }

  resizeRenderer() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const needResize = this.canvas.width !== width || this.canvas.height !== height;

    if (needResize) {
      this.renderer.setSize(width, height, false);
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

const svgTask = new SvgTask(document.querySelector(`#lessonCanvas`));
svgTask.init();
