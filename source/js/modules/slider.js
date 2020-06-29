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
      // this.makeInstance = this.makeInstance.bind(this);
      this.blurAnimationTick = this.blurAnimationTick.bind(this);
      this.translateYAnimationTick = this.translateYAnimationTick.bind(this);
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

      // const loadManager = new THREE.LoadingManager();
      // const loader = new THREE.TextureLoader(loadManager);

      // const planeWidth = PLANE_WIDTH;
      // const planeHeight = PLANE_HEIGHT;
      // const planeGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight);

      // const planeMaterials = scenes.map((scene, index) => {
      //   return new THREE.RawShaderMaterial(
      //       {
      //         uniforms: {
      //           map: {
      //             value: loader.load(scene.src)
      //           },
      //           uSlideIndex: {
      //             type: `i`,
      //             value: index,
      //           },
      //           uHueRotation: {
      //             type: `f`,
      //             value: scene.hueRotation,
      //           },
      //           uResolution: {
      //             type: `v2`,
      //             value: new THREE.Vector2(initialWidth / (window.devicePixelRatio * 2), initialHeight),
      //           },
      //           uBlurProgress: {
      //             type: `f`,
      //             value: 0.0,
      //           },
      //           uTranslateYProgress: {
      //             type: `f`,
      //             value: 0.0,
      //           },
      //           uAmplitudeModifier: {
      //             type: `f`,
      //             value: 0.0,
      //           },
      //           uTime: {
      //             type: `f`,
      //             value: 0.0,
      //           }
      //         },
      //         vertexShader: `
      //         uniform mat4 projectionMatrix;
      //         uniform mat4 modelMatrix;
      //         uniform mat4 viewMatrix;

      //         attribute vec3 position;
      //         attribute vec3 normal;
      //         attribute vec2 uv;

      //         varying vec2 vUv;

      //         void main() {
      //           vUv = uv;

      //           gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );
      //         }`,

      //         fragmentShader: `
      //         #define PI 3.14159265359

      //         precision mediump float;

      //         uniform sampler2D map;
      //         uniform float uHueRotation;
      //         uniform vec2 uResolution;
      //         uniform int uSlideIndex;
      //         uniform float uBlurProgress;
      //         uniform float uTranslateYProgress;
      //         uniform float uTime;
      //         uniform float uAmplitudeModifier;

      //         varying vec2 vUv;

      //         float bubble(in vec2 st, in float radius, in float offsetX, in float offsetY, in float xAmplitude, in int bubbleIndex) {
      //           vec2 dist = st - vec2(0. + offsetX + xAmplitude * float(bubbleIndex + 1) * uAmplitudeModifier * sin(uTime * 5.0), 0. + offsetY * uTranslateYProgress);

      //           return 1. - smoothstep(
      //             radius - (radius * 1.),
      //             radius+(radius * 1.),
      //             dot(dist, dist) * 4.
      //           );
      //         }

      //         vec4 bubbleVisual(in float bubble, in vec2 st, in float offsetX, in float offsetY, in float xAmplitude, in int bubbleIndex) {
      //           if (bubble > .0) {
      //             float border;
      //             float shine;

      //             vec2 dist = st - vec2(0. + offsetX + xAmplitude * float(bubbleIndex + 1) * uAmplitudeModifier * sin(uTime * 5.0), 0. + offsetY * uTranslateYProgress);
      //             vec2 shift = -1.0 * normalize(vec2(bubble, bubble)) * 0.005;

      //             if (bubble < 0.0005) {
      //               border = 1.0;
      //             }

      //             if ( bubble > 0.49 && bubble < 0.50 && dist.x > -0.11 && dist.x < -0.03 && dist.y > 0. && dist.y < 0.3) {
      //               shine = 1.0;
      //             }

      //             return vec4(shift, border, shine);
      //           }
      //         }

      //         void main() {
      //           vec4 texel;
      //           vec4 visual;
      //           vec4 border;
      //           vec4 shine;
      //           vec2 shift;

      //           vec2 st = gl_FragCoord.xy/vec2(uResolution.x, uResolution.x);

      //           float aDeg = uHueRotation + (360.0 - uHueRotation) * uBlurProgress;
      //           float aRad = radians(aDeg);

      //           float cos = cos(aRad);
      //           float sin = sin(aRad);
      //           float lumR = 0.213;
      //           float lumG = 0.715;
      //           float lumB = 0.072;

      //           mat4 colorMatrix = mat4(
      //             lumR + cos * (1.0 - lumR) + sin * (-lumR), lumG + cos * (-lumG) + sin * (-lumG), lumB + cos * (-lumB) + sin * (1.0 - lumB), 0,
      //             lumR + cos * (-lumR) + sin * (0.143), lumG + cos * (1.0 - lumG) + sin * (0.140), lumB + cos * (-lumB) + sin * (-0.283), 0,
      //             lumR + cos * (-lumR) + sin * (-(1.0 - lumR)), lumG + cos * (-lumG) + sin * (lumG), lumB + cos * (1.0 - lumB) + sin * (lumB), 0,
      //             0, 0, 0, 1.0
      //           );

      //           texel = texture2D(map, vUv);

      //           if (uSlideIndex == 1) {
      //             mat4 bubblesMatrix = mat4(
      //               0.04, 1.5, 4.2, 0.1,
      //               0.08, 2.0, 6.7, 0.15,
      //               0.02, 2.6, 2.4, 0.2,
      //               0, 0, 0, 0
      //             );

      //             for(int i=0; i < int(3); i++) {
      //               float currentBubble = bubble(st, bubblesMatrix[i].r, bubblesMatrix[i].g, bubblesMatrix[i].b, bubblesMatrix[i].a, i);

      //               if (currentBubble > .0) {
      //                 visual = bubbleVisual(currentBubble, st, bubblesMatrix[i].g, bubblesMatrix[i].b, bubblesMatrix[i].a, i);
      //                 shift =  vec2(visual.r, visual.g);
      //                 border = vec4(visual.b);
      //                 shine = vec4(visual.a);
      //               }
      //             }

      //             texel = texture2D(map, vUv + shift) + border + shine;
      //           }

      //           gl_FragColor = texel * colorMatrix;
      //         }`
      //       }
      //   );
      // });

      // loadManager.onLoad = () => {
      //   this.objects.planes = [];
      //   planeMaterials.forEach((material, index) => {
      //     this.makeInstance(planeGeometry, material, index);
      //   });
      // };

      canvasFrame.addRender(this.render);
      window.addEventListener(`resize`, this.resizeRenderer);
    }

    render() {
      this.controls.update();
      // time *= 0.001;

      // if (this.objects.planes && this.objects.planes.length > 0) {
      //   if (this.toggleBlurAnimation === true) {
      //     this.toggleBlurAnimation = false;

      //     animate.easing(this.blurAnimationTick(this.objects.planes[1].material.uniforms.uBlurProgress.value, 1 - this.objects.planes[1].material.uniforms.uBlurProgress.value), 1000, bezierEasing(0.00, 0.0, 0.58, 1.0));
      //   }

      //   if (this.bubbleAnimation === true) {
      //     this.bubbleAnimation = false;

      //     animate.easing(this.translateYAnimationTick(-0.5, 2.0), 16000, bezierEasing(0.00, 0.0, 0.58, 1.0));
      //     animate.easing(this.translateAmlitudeModifierTick(1.5, 0.0), 6000, bezierEasing(0.00, 0.0, 0.58, 1.0));
      //   }

      //   this.objects.planes[1].material.uniforms.uTime.value = time;
      //   this.objects.planes[1].material.uniformsNeedUpdate = true;
      // }

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

        // if (this.objects.planes && this.objects.planes.length > 0) {
        //   this.objects.planes.forEach((plane, index) => {
        //     if (index === 1) {
        //       plane.material.uniforms.uResolution.value = new THREE.Vector2(width / (window.devicePixelRatio * 2), height);
        //       plane.material.uniformsNeedUpdate = true;
        //     }
        //   });
        // }

        this.camera.updateProjectionMatrix();
      }
    }

    // makeInstance(geometry, material, x) {
    //   const instanceGroup = new THREE.Group();

    //   const plane = new THREE.Mesh(geometry, material);
    //   this.objects.planes.push(plane);

    //   instanceGroup.add(plane);
    //   instanceGroup.position.x = PLANE_WIDTH * x;

    //   this.scene.add(instanceGroup);
    // }

    blurAnimationTick(from, to) {
      return (progress) => {
        this.objects.planes[1].material.uniforms.uBlurProgress.value = from + progress * Math.sign(to - from) * Math.abs(to - from);

        if (progress === 1 && this.blurCounter < 3) {
          this.blurCounter = this.blurCounter + 1;

          this.toggleBlurAnimation = true;
        }
      };
    }

    translateYAnimationTick(from, to) {
      return (progress) => {
        this.objects.planes[1].material.uniforms.uTranslateYProgress.value = from + progress * Math.sign(to - from) * Math.abs(to - from);
      };
    }

    translateAmlitudeModifierTick(from, to) {
      return (progress) => {
        this.objects.planes[1].material.uniforms.uAmplitudeModifier.value = from + progress * Math.sign(to - from) * Math.abs(to - from);
      };
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
          slideChange: () => {
            storyBackground.blurCounter = 0;
            storyBackground.toggleBlurAnimation = false;
            storyBackground.bubbleAnimation = false;
            if (storySlider.activeIndex === 0 || storySlider.activeIndex === 1) {
              storyBackground.camera.position.x = 2048 * 0;
            } else if (storySlider.activeIndex === 2 || storySlider.activeIndex === 3) {
              storyBackground.camera.position.x = 2048 * 1;
              storyBackground.toggleBlurAnimation = true;
              storyBackground.bubbleAnimation = true;
            } else if (storySlider.activeIndex === 4 || storySlider.activeIndex === 5) {
              storyBackground.camera.position.x = 2048 * 2;
            } else if (storySlider.activeIndex === 6 || storySlider.activeIndex === 7) {
              storyBackground.camera.position.x = 2048 * 3;
            }
          },
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
          slideChange: () => {
            storyBackground.blurCounter = 0;
            storyBackground.toggleBlurAnimation = false;
            storyBackground.bubbleAnimation = false;
            if (storySlider.activeIndex === 0) {
              storyBackground.camera.position.x = 2048 * 0;
            } else if (storySlider.activeIndex === 2) {
              storyBackground.camera.position.x = 2048 * 1;
              storyBackground.toggleBlurAnimation = true;
              storyBackground.bubbleAnimation = true;
            } else if (storySlider.activeIndex === 4) {
              storyBackground.camera.position.x = 2048 * 2;
            } else if (storySlider.activeIndex === 6) {
              storyBackground.camera.position.x = 2048 * 3;
            }
          },
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
