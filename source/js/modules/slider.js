import Swiper from "swiper";
import * as THREE from "three";

const PLANE_WIDTH = 2048;
const PLANE_HEIGHT = 1024;

export default () => {
  let storySlider;
  const sliderContainer = document.getElementById(`story`);
  const storyCanvas = sliderContainer.querySelector(`#storyCanvas`);
  let storyBackground = null;
  const scenes = [
    {
      src: `img/scene-1.png`,
      hueRotation: 0,
    },
    {
      src: `img/scene-2.png`,
      hueRotation: 330,
    },
    {
      src: `img/scene-3.png`,
      hueRotation: 0,
    },
    {
      src: `img/scene-4.png`,
      hueRotation: 0,
    },
  ];

  class StoryBackground {
    constructor(parentCanvas) {
      this.canvas = parentCanvas;
      this.renderer = null;
      this.camera = null;
      this.scene = null;
      this.objects = {};
      this.animationId = null;

      this.main = this.main.bind(this);
      this.render = this.render.bind(this);
      this.resizeRendererToDisplaySize = this.resizeRendererToDisplaySize.bind(this);
      this.makeInstance = this.makeInstance.bind(this);
      this.stopBackground = this.stopBackground.bind(this);
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

      const planeWidth = PLANE_WIDTH;
      const planeHeight = PLANE_HEIGHT;
      const planeGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight);

      const planeMaterials = scenes.map((scene, index) => {
        return new THREE.RawShaderMaterial(
            {
              uniforms: {
                map: {
                  value: loader.load(scene.src)
                },
                slideIndex: {
                  type: `i`,
                  value: index,
                },
                hueRotation: {
                  type: `i`,
                  value: scene.hueRotation,
                },
                uResolution: {
                  type: `v2`,
                  value: new THREE.Vector2(window.innerWidth, window.innerHeight),
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
              uniform int hueRotation;
              uniform vec2 uResolution;
              uniform int slideIndex;

              varying vec2 vUv;

              float bubble(in vec2 st, in float radius, in float offsetX, in float offsetY) {
                vec2 dist = st - vec2(0. + offsetX, 0. + offsetY);

                return 1. - smoothstep(
                  radius - (radius * 1.),
                  radius+(radius * 1.),
                  dot(dist, dist) * 4.
                );
              }

              vec4 bubbleVisual(in float bubble, in vec2 st, in float offsetX, in float offsetY) {
                if (bubble > .0) {
                  float border;
                  float shine;
                  vec2 dist = st - vec2(0. + offsetX, 0. + offsetY);
                  vec2 shift = -1.0 * normalize(vec2(bubble, bubble)) * 0.005;

                  if (bubble < 0.0001) {
                    border = 1.0;
                  }

                  if ( bubble > 0.49 && bubble < 0.50 && st.x - offsetX > -0.11 && st.x - offsetX < -0.03 && st.y - offsetY > 0. && st.y - offsetY < 0.3) {
                    shine = 1.0;
                  }

                  return vec4(shift, border, shine);
                }
              }

              void main() {
                vec4 texel;
                vec4 visual;
                vec4 border;
                vec4 shine;
                vec2 shift;

                vec2 st = gl_FragCoord.xy/vec2(uResolution.x, uResolution.x);

                float aDeg = float(hueRotation);
                float aRad = radians(aDeg);

                float cos = cos(aRad);
                float sin = sin(aRad);
                float lumR = 0.213;
                float lumG = 0.715;
                float lumB = 0.072;

                mat4 colorMatrix = mat4(
                  lumR + cos * (1.0 - lumR) + sin * (-lumR), lumG + cos * (-lumG) + sin * (-lumG), lumB + cos * (-lumB) + sin * (1.0 - lumB), 0,
                  lumR + cos * (-lumR) + sin * (0.143), lumG + cos * (1.0 - lumG) + sin * (0.140), lumB + cos * (-lumB) + sin * (-0.283), 0,
                  lumR + cos * (-lumR) + sin * (-(1.0 - lumR)), lumG + cos * (-lumG) + sin * (lumG), lumB + cos * (1.0 - lumB) + sin * (lumB), 0,
                  0, 0, 0, 1.0
                );

                if (slideIndex == 1) {
                  float bubbleA = bubble(st, 0.08, 0.5, 1.);
                  float bubbleB = bubble(st, 0.08, 1.6, 0.4);
                  float bubbleC = bubble(st, 0.1, 2.6, 0.8);
                  float bubbleD = bubble(st, 0.07, 3.4, 0.9);

                  if (bubbleA > .0 || bubbleB > .0 || bubbleC > .0 || bubbleD > .0) {
                    visual = bubbleVisual(bubbleA, st, 0.5, 1.);
                    shift =  vec2(visual.r, visual.g);
                    border = vec4(visual.b);
                    shine = vec4(visual.a);

                    visual = bubbleVisual(bubbleB, st, 1.6, 0.4);
                    shift =  vec2(visual.r, visual.g);
                    border = vec4(visual.b);
                    shine = vec4(visual.a);

                    visual = bubbleVisual(bubbleC, st, 2.6, 0.8);
                    shift =  vec2(visual.r, visual.g);
                    border = vec4(visual.b);
                    shine = vec4(visual.a);

                    visual = bubbleVisual(bubbleD, st, 3.4, 0.9);
                    shift =  vec2(visual.r, visual.g);
                    border = vec4(visual.b);
                    shine = vec4(visual.a);
                  }
                }

                texel = texture2D( map, vUv + shift) + border + shine;

                gl_FragColor = texel * colorMatrix;
              }`
            }
        );
      });

      loadManager.onLoad = () => {
        this.objects.planes = [];
        planeMaterials.forEach((material, index) => {
          this.objects.planes.push(this.makeInstance(planeGeometry, material, index));
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

      plane.position.x = PLANE_WIDTH * x;

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
