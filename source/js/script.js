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
    this.prepareSvgs = this.prepareSvgs.bind(this);
    this.prepareLathe = this.prepareLathe.bind(this);
    this.resizeRenderer = this.resizeRenderer.bind(this);
    this.render = this.render.bind(this);
    this.init = this.init.bind(this);
  }

  init() {
    const initialWidth = window.innerWidth;
    const initialHeight = window.innerHeight;

    const canvas = this.canvas;
    this.renderer = new THREE.WebGLRenderer({canvas,
      alpha: true,
      antialias: true,
      logarithmicDepthBuffer: true
    });
    this.renderer.setClearColor(0x000000, 0.7);

    const params = {
      fov: 2 * Math.atan(window.innerHeight / (2 * 1000)) * 180 / Math.PI,
      aspect: initialWidth / initialHeight,
      near: 0.1,
      far: 10000
    };
    this.camera = new THREE.PerspectiveCamera(params.fov, params.aspect, params.near, params.far);
    this.camera.position.z = 2000;

    this.controls = new OrbitControls(this.camera, canvas);

    this.scene = new THREE.Scene();

    this.scene.add(this.prepareLight());
    this.prepareLathe();
    // this.prepareSvgs();

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

  prepareSvgs() {
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
  }

  prepareLathe() {
    const carpetPoints = [];
    for (let i = 763; i < 943; i++) {
      for (let j = 0; j < 3; j++) {
        carpetPoints.push(new THREE.Vector2(i, j));
      }
    }
    const carpetSegments = 20;
    const carpetPhiStart = Math.PI * 16 / 180;
    const carpetPhiLength = Math.PI * 58 / 180;
    const carpetGeometry = new THREE.LatheBufferGeometry(carpetPoints, carpetSegments, carpetPhiStart, carpetPhiLength);
    const carpetMaterial = new THREE.MeshBasicMaterial({color: 0xffff00});
    const carpetLathe = new THREE.Mesh(carpetGeometry, carpetMaterial);
    carpetLathe.position.z = 300;
    this.scene.add(carpetLathe);

    const roadPoints = [];
    for (let i = 732; i < 892; i++) {
      for (let j = 0; j < 3; j++) {
        roadPoints.push(new THREE.Vector2(i, j));
      }
    }
    const roadSegments = 20;
    const roadPhiStart = Math.PI * 0 / 180;
    const roadPhiLength = Math.PI * 90 / 180;
    const roadGeometry = new THREE.LatheBufferGeometry(roadPoints, roadSegments, roadPhiStart, roadPhiLength);
    const roadMaterial = new THREE.MeshBasicMaterial({color: 0x4eb543});
    const roadLathe = new THREE.Mesh(roadGeometry, roadMaterial);
    roadLathe.position.z = 100;
    roadLathe.position.y = 20;
    this.scene.add(roadLathe);

    const saturn = new THREE.Group();
    const planetGeometry = new THREE.SphereGeometry(60, 30, 30);
    const planetMaterial = new THREE.MeshBasicMaterial({color: 0xff003a});
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);

    const smallPlanetGeometry = new THREE.SphereGeometry(10, 30, 30);
    const smallPlanetMaterial = new THREE.MeshBasicMaterial({color: 0x7f47ea});
    const smallPlanet = new THREE.Mesh(smallPlanetGeometry, smallPlanetMaterial);
    smallPlanet.position.y = 120;

    const holderGeometry = new THREE.CylinderBufferGeometry(1, 1, 1000, 10);
    const holderMaterial = new THREE.MeshBasicMaterial({color: 0x7c8da9});
    const holder = new THREE.Mesh(holderGeometry, holderMaterial);
    holder.position.y = 500 + 60;

    const planetCirclePoints = [];
    for (let i = 80; i < 120; i++) {
      for (let j = 0; j < 2; j++) {
        planetCirclePoints.push(new THREE.Vector2(i, j));
      }
    }
    const planetCircleSegments = 20;
    const planetCirclePhiStart = Math.PI * 0 / 180;
    const planetCirclePhiLength = Math.PI * 360 / 180;
    const planetCircleGeometry = new THREE.LatheBufferGeometry(planetCirclePoints, planetCircleSegments, planetCirclePhiStart, planetCirclePhiLength);
    const planetCircleMaterial = new THREE.MeshBasicMaterial({color: 0x7f47ea});
    const planetCircle = new THREE.Mesh(planetCircleGeometry, planetCircleMaterial);
    planetCircle.rotateZ((18 * Math.PI) / 180);

    saturn.add(planet);
    saturn.add(smallPlanet);
    saturn.add(holder);
    saturn.add(planetCircle);
    this.scene.add(saturn);
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
