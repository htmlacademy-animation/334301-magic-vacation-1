import Swiper from "swiper";
import * as THREE from "three";

export default () => {
  let storySlider;
  const sliderContainer = document.getElementById(`story`);
  const storyCanvas = sliderContainer.querySelector(`#storyCanvas`);
  let storyBackground = null;
  const scenes = [
    `img/scene-1.png`,
    `img/scene-2.png`,
    `img/scene-3.png`,
    `img/scene-4.png`,
  ];

  class StoryBackground {
    constructor(parentCanvas) {
      this.canvas = parentCanvas;
      this.renderer = null;
      this.camera = null;
      this.scene = null;
      this.planes = [];
      this.animationId = null;

      this.main = this.main.bind(this);
      this.render = this.render.bind(this);
      this.resizeRendererToDisplaySize = this.resizeRendererToDisplaySize.bind(this);
      this.prepareImageColorMatrix = this.prepareImageColorMatrix.bind(this);
      this.makeInstance = this.makeInstance.bind(this);
      this.stopBackground = this.stopBackground.bind(this);
    }

    prepareImageColorMatrix(filterType = ``, value = 0) {
      const colorFilter = new THREE.Matrix4();

      switch (filterType) {
        case `hue`:
          const rotation = (value / 180) * Math.PI;
          const cos = Math.cos(rotation);
          const sin = Math.sin(rotation);
          const lumR = 0.213;
          const lumG = 0.715;
          const lumB = 0.072;

          colorFilter.set(
              lumR + cos * (1 - lumR) + sin * (-lumR), lumG + cos * (-lumG) + sin * (-lumG), lumB + cos * (-lumB) + sin * (1 - lumB), 0,
              lumR + cos * (-lumR) + sin * (0.143), lumG + cos * (1 - lumG) + sin * (0.140), lumB + cos * (-lumB) + sin * (-0.283), 0,
              lumR + cos * (-lumR) + sin * (-(1 - lumR)), lumG + cos * (-lumG) + sin * (lumG), lumB + cos * (1 - lumB) + sin * (lumB), 0,
              0, 0, 0, 1
          );
          break;

        default:
          colorFilter.set(
              1, 0, 0, 0,
              0, 1, 0, 0,
              0, 0, 1, 0,
              0, 0, 0, 1
          );
      }

      return colorFilter;
    }

    main() {
      const canvas = this.canvas;
      this.renderer = new THREE.WebGLRenderer({canvas});
      this.renderer.setClearColor(0xEEEEEE);
      this.renderer.setPixelRatio(window.devicePixelRatio);

      const fov = 2 * Math.atan(window.innerHeight / (2 * 1000)) * 180 / Math.PI;
      const aspect = window.innerWidth / window.innerHeight;
      const near = 0.1;
      const far = 1000;
      this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
      this.camera.position.z = 1000;

      this.scene = new THREE.Scene();
      const loadManager = new THREE.LoadingManager();
      const loader = new THREE.TextureLoader(loadManager);

      const planes = [];
      const planeWidth = 2048;
      const planeHeight = 1024;
      const planeGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight);

      const planeMaterials = scenes.map((scene, index) => {
        return new THREE.RawShaderMaterial(
            {
              uniforms: {
                map: {
                  value: loader.load(scene)
                },
                filterMatrix: {
                  type: `m4`,
                  value: index === 1 ? this.prepareImageColorMatrix(`hue`, 10) : this.prepareImageColorMatrix(),
                },
              },
              vertexShader: `
              uniform mat4 projectionMatrix;
              uniform mat4 modelMatrix;
              uniform mat4 viewMatrix;

              attribute vec3 position;
              attribute vec3 normal;
              attribute vec2 uv;

              varying vec2 vUv;

              void main() {
                vUv = uv;

                gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );
              }`,

              fragmentShader: `
              precision mediump float;

              uniform sampler2D map;
              uniform mat4 filterMatrix;

              varying vec2 vUv;

              void main() {
                vec4 texel = texture2D( map, vUv );

                gl_FragColor = texel * filterMatrix;
              }`
            }
        );
      });

      loadManager.onLoad = () => {
        planeMaterials.forEach((material, index) => {
          planes.push(this.makeInstance(planeGeometry, material, index));
        });
      };

      requestAnimationFrame(this.render);
    }

    render() {
      if (this.resizeRendererToDisplaySize()) {
        const canvasElement = this.renderer.domElement;
        this.camera.aspect = canvasElement.clientWidth / canvasElement.clientHeight;
        this.camera.updateProjectionMatrix();
      }

      this.renderer.render(this.scene, this.camera);
      this.animationId = requestAnimationFrame(this.render);
    }

    makeInstance(geometry, material, x) {
      const plane = new THREE.Mesh(geometry, material);
      this.scene.add(plane);

      plane.position.x = 2048 * x;

      return plane;
    }

    resizeRendererToDisplaySize() {
      const canvasElement = this.renderer.domElement;
      const pixelRatio = window.devicePixelRatio;
      const width = canvasElement.clientWidth * pixelRatio | 0;
      const height = canvasElement.clientHeight * pixelRatio | 0;
      const needResize = canvasElement.width !== width || canvasElement.height !== height;
      this.camera.fov = 2 * Math.atan(window.innerHeight / (2 * 1000)) * 180 / Math.PI;

      if (needResize) {
        this.renderer.setSize(width, height, false);
      }

      return needResize;
    }

    stopBackground() {
      cancelAnimationFrame(this.animationId);
    }
  }

  if (storyCanvas && storyCanvas.getContext) {
    storyBackground = new StoryBackground(storyCanvas);
    storyBackground.main();
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
            if (storySlider.activeIndex === 0 || storySlider.activeIndex === 1) {
              storyBackground.camera.position.x = 2048 * 0;
            } else if (storySlider.activeIndex === 2 || storySlider.activeIndex === 3) {
              storyBackground.camera.position.x = 2048 * 1;
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
            if (storySlider.activeIndex === 0) {
              storyBackground.camera.position.x = 2048 * 0;
            } else if (storySlider.activeIndex === 2) {
              storyBackground.camera.position.x = 2048 * 1;
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
