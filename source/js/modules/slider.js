import Swiper from "swiper";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

// import {BezierEasing as bezierEasing} from "../helpers/cubicBezier";
// import animate from '../helpers/animate-functions';
import canvasFrame from '../helpers/canvas-frame';
import sceneObjects from '../helpers/scene-objects';
import colors from '../helpers/colors';

// const PLANE_WIDTH = 2048;
// const PLANE_HEIGHT = 1024;
const CAMERA_DIST = 2550;
const CAMERA_Y = 800;

const degToRadians = (deg) => (deg * Math.PI) / 180;

export default () => {
  let storySlider;
  const sliderContainer = document.getElementById(`story`);
  const storyCanvas = sliderContainer.querySelector(`#storyCanvas`);
  let storyBackground = null;
  // const scenes = [
  //   {
  //     src: `img/scene-1.png`,
  //     hueRotation: 0,
  //   },
  //   {
  //     src: `img/scene-2.png`,
  //     hueRotation: 330,
  //   },
  //   {
  //     src: `img/scene-3.png`,
  //     hueRotation: 0,
  //   },
  //   {
  //     src: `img/scene-4.png`,
  //     hueRotation: 0,
  //   },
  // ];

  class Story {
    constructor(basicRotation) {
      this.story = new THREE.Group();

      this.story.rotation.copy(new THREE.Euler(degToRadians(0), degToRadians(basicRotation), degToRadians(0), `XYZ`));

      this.objects = {};

      this.prepareFloor = this.prepareFloor.bind(this);
      this.init = this.init.bind(this);
      this.addObject = this.addObject.bind(this);
      this.addSvgObjects = this.addSvgObjects.bind(this);
      this.getStory = this.getStory.bind(this);
    }

    prepareFloor(color, material) {
      const floor = sceneObjects.prepareCircle(1350, 0, 90, color, material);
      floor.rotation.copy(new THREE.Euler(degToRadians(90), degToRadians(0), degToRadians(0), `XYZ`));
      floor.position.set(0, -7, 0);

      return floor;
    }

    async init(wallUrl, wallColor, wallMaterial, staticUrl, floorColor, floorMaterial) {
      const wall = await sceneObjects.prepare3dObj(wallUrl, wallColor, wallMaterial);
      const storyStatic = await sceneObjects.prepareGltfObj(staticUrl);
      const floor = sceneObjects.prepareCircle(1350, 0, 90, floorColor, floorMaterial);

      floor.rotation.copy(new THREE.Euler(degToRadians(90), degToRadians(0), degToRadians(0), `XYZ`));
      floor.position.set(0, -7, 0);

      this.addObject(wall, `wall`);
      this.addObject(storyStatic, `storyStatic`);
      this.addObject(floor, `floor`);
    }

    addSvgObjects(objects) {
      this.objects.svgObjects = objects;
    }

    addObject(object, title) {
      this.story.add(object);

      this.objects[title] = object;
    }

    getStory() {
      return this.story;
    }
  }

  class StoryBackground {
    constructor(parentCanvas) {
      this.canvas = parentCanvas;
      this.renderer = null;
      this.camera = null;
      this.scene = null;
      this.objects = {};
      this.stories = {};
      this.toggleBlurAnimation = false;
      this.bubbleAnimation = false;
      this.blurCounter = 0;

      this.init = this.init.bind(this);
      this.render = this.render.bind(this);
      this.resizeRenderer = this.resizeRenderer.bind(this);
      this.prepareFirstStory = this.prepareFirstStory.bind(this);
      this.prepareSecondStory = this.prepareSecondStory.bind(this);
      this.prepareThirdStory = this.prepareThirdStory.bind(this);
      this.prepareFourthStory = this.prepareFourthStory.bind(this);
      this.prepareFloor = this.prepareFloor.bind(this);
    }

    prepareFloor(color, material) {
      const floor = sceneObjects.prepareCircle(1350, 0, 90, color, material);
      floor.rotation.copy(new THREE.Euler(degToRadians(90), degToRadians(0), degToRadians(0), `XYZ`));
      floor.position.set(0, -7, 0);

      return floor;
    }

    async prepareFirstStory() {
      this.svgItems = [
        {
          title: `flower`,
          url: `img/flower.svg`,
          height: 413,
          depth: 4,
          cap: 2,
          x: 75,
          y: 420,
          z: 75,
          rotX: 0,
          rotY: 90,
          rotZ: 180,
          material: `soft`,
          color: colors.darkPurple,
        }
      ];

      const firstStory = new Story(-45);
      await firstStory.init(`img/WallCornerUnit.obj`, colors.purple, `soft`, `img/scene1-static-output-1.gltf`, colors.darkPurple, `soft`);

      const dog = await sceneObjects.prepareGltfObj(`img/dog.gltf`);
      const svgObjects = await sceneObjects.prepareSvgs(this.svgItems, firstStory.getStory());
      const carpet = sceneObjects.prepareCarpet();
      const saturn = sceneObjects.prepareSaturn(colors.dominantRed, colors.brightPurple);

      dog.position.set(500, 0, 450);
      dog.rotation.copy(new THREE.Euler(degToRadians(0), degToRadians(65), degToRadians(0), `XYZ`));

      saturn.position.set(300, 450, 250);
      saturn.rotation.copy(new THREE.Euler(degToRadians(0), degToRadians(65), degToRadians(0), `XYZ`));

      firstStory.addObject(dog, `dog`);
      firstStory.addObject(carpet, `carpet`);
      firstStory.addObject(saturn, `saturn`);
      firstStory.addSvgObjects(svgObjects);

      this.stories.firstStory = firstStory;
    }

    async prepareSecondStory() {
      this.svgItems = [
        {
          title: `leaf1`,
          url: `img/leaf.svg`,
          height: 335.108,
          depth: 3,
          cap: 3,
          x: 100,
          y: 350,
          z: 320,
          rotX: 0,
          rotY: 270,
          rotZ: 210,
          material: `basic`,
          color: colors.green,
        },
        {
          title: `leaf2`,
          url: `img/leaf.svg`,
          height: 150,
          depth: 3,
          cap: 3,
          x: 110,
          y: 150,
          z: 430,
          rotX: 0,
          rotY: 270,
          rotZ: 170,
          material: `basic`,
          color: colors.green,
        }
      ];

      const secondStory = new Story(45);
      await secondStory.init(`img/WallCornerUnit.obj`, colors.blue, `basic`, `img/scene2-static-output-1.gltf`, colors.brightBlue, `soft`);

      const svgObjects = await sceneObjects.prepareSvgs(this.svgItems, secondStory.getStory());
      const lattern = sceneObjects.prepareLattern();
      const pyramid = sceneObjects.preparePyramid();

      lattern.position.set(600, 47, 90);
      lattern.rotation.copy(new THREE.Euler(degToRadians(0), degToRadians(45), degToRadians(0), `XYZ`));

      pyramid.position.set(220, 133, 250);
      pyramid.rotation.copy(new THREE.Euler(degToRadians(0), degToRadians(45), degToRadians(0), `XYZ`));

      secondStory.addObject(lattern, `lattern`);
      secondStory.addObject(pyramid, `pyramid`);
      secondStory.addSvgObjects(svgObjects);

      this.stories.secondStory = secondStory;
    }

    async prepareThirdStory() {
      const thirdStory = new Story(135);
      await thirdStory.init(`img/WallCornerUnit.obj`, colors.skyLightBlue, `soft`, `img/scene3-static-output-1.gltf`, colors.mountainBlue, `soft`);

      const compass = await sceneObjects.prepareGltfObj(`img/compass.gltf`);
      const road = sceneObjects.prepareRoad();
      const snowman = sceneObjects.prepareSnowman();

      snowman.position.set(150, 120, 370);
      snowman.rotation.copy(new THREE.Euler(degToRadians(0), degToRadians(45), degToRadians(0), `XYZ`));

      compass.position.set(0, 0, 0);
      compass.rotation.copy(new THREE.Euler(degToRadians(0), degToRadians(0), degToRadians(0), `XYZ`));

      thirdStory.addObject(road, `road`);
      thirdStory.addObject(snowman, `snowman`);
      thirdStory.addObject(compass, `compass`);

      this.stories.thirdStory = thirdStory;
    }

    async prepareFourthStory() {
      const fourthStory = new Story(-135);
      await fourthStory.init(`img/WallCornerUnit.obj`, colors.shadowedPurple, `basic`, `img/scene4-static-output-1.gltf`, colors.shadowedDarkPurple, `soft`);

      const sonya = await sceneObjects.prepareGltfObj(`img/sonya.gltf`);
      const saturn = sceneObjects.prepareSaturn(colors.shadowedDominantRed, colors.shadowedBrightPurple);
      const carpet = sceneObjects.prepareCarpet();

      sonya.position.set(300, 75, 150);
      sonya.rotation.copy(new THREE.Euler(degToRadians(0), degToRadians(15), degToRadians(0), `XYZ`));

      saturn.position.set(300, 450, 250);
      saturn.rotation.copy(new THREE.Euler(degToRadians(0), degToRadians(65), degToRadians(0), `XYZ`));

      fourthStory.addObject(sonya, `sonya`);
      fourthStory.addObject(saturn, `saturn`);
      fourthStory.addObject(carpet, `carpet`);

      this.stories.fourthStory = fourthStory;
    }

    async init() {
      const initialWidth = window.innerWidth;
      const initialHeight = window.innerHeight;

      const canvas = this.canvas;
      this.renderer = new THREE.WebGLRenderer({canvas});
      this.renderer.setClearColor(0x000000, 0.7);
      this.renderer.setSize(initialWidth, initialHeight);
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      const fov = 2 * Math.atan(initialHeight / (2 * CAMERA_DIST)) * 180 / Math.PI;
      const aspect = initialWidth / initialHeight;
      const near = 0.1;
      const far = 50000;
      this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
      this.camera.position.z = CAMERA_DIST;
      this.camera.position.y = CAMERA_Y;
      this.camera.rotation.x = degToRadians(15);

      this.controls = new OrbitControls(this.camera, canvas);

      this.scene = new THREE.Scene();

      const light = sceneObjects.prepareLight(this.camera);
      this.scene.add(light);
      this.objects.light = light;

      await this.prepareFirstStory();
      await this.prepareSecondStory();
      await this.prepareThirdStory();
      await this.prepareFourthStory();

      const suitGroup = new THREE.Group();
      const suitcase = await sceneObjects.prepareGltfObj(`img/suitcase.gltf`);
      const t = 0;
      const a = 20;
      const R = 850;
      const x = 0 + R * Math.cos(t * a);
      const z = 0 + R * Math.sin(t * a);
      suitcase.position.set(x, 0, z);
      suitcase.rotation.copy(new THREE.Euler(degToRadians(0), degToRadians(90), degToRadians(0), `XYZ`));
      suitGroup.add(suitcase);
      suitGroup.rotation.copy(new THREE.Euler(degToRadians(0), degToRadians(-115), degToRadians(0), `XYZ`));
      this.scene.add(suitGroup);
      this.objects.suitGroup = suitGroup;
      this.objects.suitcase = suitcase;

      this.storiesGroup = new THREE.Group();

      this.storiesGroup.add(this.stories.firstStory.getStory());
      this.storiesGroup.add(this.stories.secondStory.getStory());
      this.storiesGroup.add(this.stories.thirdStory.getStory());
      this.storiesGroup.add(this.stories.fourthStory.getStory());

      this.scene.add(this.storiesGroup);

      canvasFrame.addRender(this.render);
      window.addEventListener(`resize`, this.resizeRenderer);
    }

    render() {
      this.controls.update();

      this.renderer.render(this.scene, this.camera);
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
  }

  if (storyCanvas && storyCanvas.getContext) {
    storyBackground = new StoryBackground(storyCanvas);
    storyBackground.init();
  }

  const setSlider = function () {
    if (((window.innerWidth / window.innerHeight) < 1) || window.innerWidth < 769) {
      storySlider = new Swiper(`.js-slider`, {
        pagination: {
          el: `.swiper-pagination`,
          type: `bullets`
        },
        keyboard: {
          enabled: true
        },
        on: {
          resize: () => {
            storySlider.update();
          }
        },
        observer: true,
        observeParents: true
      });
    } else {
      storySlider = new Swiper(`.js-slider`, {
        slidesPerView: 2,
        slidesPerGroup: 2,
        pagination: {
          el: `.swiper-pagination`,
          type: `fraction`
        },
        navigation: {
          nextEl: `.js-control-next`,
          prevEl: `.js-control-prev`,
        },
        keyboard: {
          enabled: true
        },
        on: {
          resize: () => {
            storySlider.update();
          }
        },
        observer: true,
        observeParents: true
      });
    }
  };

  window.addEventListener(`resize`, function () {
    if (storySlider) {
      storySlider.destroy();
    }
    setSlider();
  });

  setSlider();
};
