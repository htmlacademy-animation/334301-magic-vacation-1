import * as THREE from "three";
import {SVGLoader} from "three/examples/jsm/loaders/SVGLoader";

class SceneObjects {
  constructor() {
    this.prepareLight = this.prepareLight.bind(this);
    this.prepareSvgs = this.prepareSvgs.bind(this);
    this.prepareLatheRing = this.prepareLatheRing.bind(this);
    this.prepareCarpet = this.prepareCarpet.bind(this);
    this.prepareRoad = this.prepareRoad.bind(this);
    this.prepareSaturn = this.prepareSaturn.bind(this);
    this.preparePyramid = this.preparePyramid.bind(this);
    this.prepareLattern = this.prepareLattern.bind(this);
    this.prepareSnowman = this.prepareSnowman.bind(this);
  }

  prepareLight(camera) {
    const cameraPosition = camera.position.z;

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

  prepareSvgs(svgsData, scene) {
    const loader = new SVGLoader();
    const svgObjects = [];

    svgsData.forEach((svg) => {
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
            scene.add(svgGroup);

            const title = svg.title;
            svgObjects.push({
              title,
              object: svgGroup,
            });
          },
      );
    });

    return (svgObjects);
  }

  prepareLatheRing(innerRadius, outerRadios, height, segments, startingAngel, finalAngel, color) {
    const lathePoints = [];
    for (let i = innerRadius; i < outerRadios; i++) {
      for (let j = 0; j < height; j++) {
        lathePoints.push(new THREE.Vector2(i, j));
      }
    }
    const phiStart = Math.PI * startingAngel / 180;
    const phiLength = Math.PI * (finalAngel - startingAngel) / 180;
    const geometry = new THREE.LatheBufferGeometry(lathePoints, segments, phiStart, phiLength);
    const material = new THREE.MeshBasicMaterial({color, side: THREE.DoubleSide});
    const lathe = new THREE.Mesh(geometry, material);

    return (lathe);
  }

  prepareCarpet() {
    const carpet = this.prepareLatheRing(763, 943, 3, 20, 16, 74, 0xffff00);
    carpet.position.z = 300;

    return carpet;
  }

  prepareRoad() {
    const road = this.prepareLatheRing(732, 892, 3, 20, 0, 90, 0x4eb543);
    road.position.z = 100;
    road.position.y = 20;

    return road;
  }

  prepareSaturn() {
    const saturn = new THREE.Group();
    const planetGeometry = new THREE.SphereGeometry(60, 30, 30);
    const planetMaterial = new THREE.MeshBasicMaterial({color: 0xff003a, side: THREE.DoubleSide});
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);

    const smallPlanetGeometry = new THREE.SphereGeometry(10, 30, 30);
    const smallPlanetMaterial = new THREE.MeshBasicMaterial({color: 0x7f47ea, side: THREE.DoubleSide});
    const smallPlanet = new THREE.Mesh(smallPlanetGeometry, smallPlanetMaterial);
    smallPlanet.position.y = 120;

    const holderGeometry = new THREE.CylinderBufferGeometry(1, 1, 1000, 10);
    const holderMaterial = new THREE.MeshBasicMaterial({color: 0x7c8da9, side: THREE.DoubleSide});
    const holder = new THREE.Mesh(holderGeometry, holderMaterial);
    holder.position.y = 560;

    const planetCircle = this.prepareLatheRing(80, 120, 2, 20, 0, 360, 0x7f47ea);
    planetCircle.rotateZ((18 * Math.PI) / 180);

    saturn.add(planet);
    saturn.add(smallPlanet);
    saturn.add(holder);
    saturn.add(planetCircle);

    return saturn;
  }

  preparePyramid() {
    const pyramidGeometry = new THREE.CylinderGeometry(0, 176, 280, 4);
    const pyramidMaterial = new THREE.MeshBasicMaterial({color: 0x2b62c7, side: THREE.DoubleSide});
    const pyramid = new THREE.Mesh(pyramidGeometry, pyramidMaterial);

    pyramid.rotateY((-5 * Math.PI) / 180);
    pyramid.position.y = -70;
    pyramid.position.x = -20;

    return pyramid;
  }

  prepareLattern() {
    const lattern = new THREE.Group();
    const mainLatternMaterial = new THREE.MeshBasicMaterial({color: 0x2b62c7, side: THREE.DoubleSide});

    const rootBottomGeometry = new THREE.CylinderBufferGeometry(16, 16, 120, 20);
    const rootBottom = new THREE.Mesh(rootBottomGeometry, mainLatternMaterial);

    const rootTopGeometry = new THREE.SphereGeometry(16, 40, 30);
    const rootTop = new THREE.Mesh(rootTopGeometry, mainLatternMaterial);
    rootTop.position.y = 60;

    const middleGeometry = new THREE.CylinderBufferGeometry(7, 7, 230, 20);
    const middle = new THREE.Mesh(middleGeometry, mainLatternMaterial);
    middle.position.y = 185;

    const underLatternGeometry = new THREE.BoxBufferGeometry(37, 4, 37);
    const underLattern = new THREE.Mesh(underLatternGeometry, mainLatternMaterial);
    underLattern.position.y = 302;

    const lampPyramid = new THREE.Geometry();
    lampPyramid.vertices.push(
        new THREE.Vector3(-0.4, 0, 0.4),
        new THREE.Vector3(0.4, 0, 0.4),
        new THREE.Vector3(-0.5, 1, 0.5),
        new THREE.Vector3(0.5, 1, 0.5),
        new THREE.Vector3(-0.4, 0, -0.4),
        new THREE.Vector3(0.4, 0, -0.4),
        new THREE.Vector3(-0.5, 1, -0.5),
        new THREE.Vector3(0.5, 1, -0.5),
    );
    lampPyramid.faces.push(
        new THREE.Face3(0, 3, 2),
        new THREE.Face3(0, 1, 3),
        new THREE.Face3(1, 7, 3),
        new THREE.Face3(1, 5, 7),
        new THREE.Face3(5, 6, 7),
        new THREE.Face3(5, 4, 6),
        new THREE.Face3(4, 2, 6),
        new THREE.Face3(4, 0, 2),
        new THREE.Face3(2, 7, 6),
        new THREE.Face3(2, 3, 7),
        new THREE.Face3(4, 1, 0),
        new THREE.Face3(4, 5, 1),
    );

    const lampTransformation = new THREE.Matrix4().makeScale(42, 60, 42);
    const lampMaterial = new THREE.MeshBasicMaterial({color: 0xa1b5e9, side: THREE.DoubleSide});
    const lamp = new THREE.Mesh(lampPyramid.applyMatrix4(lampTransformation), lampMaterial);
    lamp.position.y = 304;

    const upperLatternPyramid = new THREE.Geometry();
    upperLatternPyramid.vertices.push(
        new THREE.Vector3(-0.5, 0, 0.5),
        new THREE.Vector3(0.5, 0, 0.5),
        new THREE.Vector3(-0.4, 1, 0.4),
        new THREE.Vector3(0.4, 1, 0.4),
        new THREE.Vector3(-0.5, 0, -0.5),
        new THREE.Vector3(0.5, 0, -0.5),
        new THREE.Vector3(-0.4, 1, -0.4),
        new THREE.Vector3(0.4, 1, -0.4),
    );
    upperLatternPyramid.faces.push(
        new THREE.Face3(0, 3, 2),
        new THREE.Face3(0, 1, 3),
        new THREE.Face3(1, 7, 3),
        new THREE.Face3(1, 5, 7),
        new THREE.Face3(5, 6, 7),
        new THREE.Face3(5, 4, 6),
        new THREE.Face3(4, 2, 6),
        new THREE.Face3(4, 0, 2),
        new THREE.Face3(2, 7, 6),
        new THREE.Face3(2, 3, 7),
        new THREE.Face3(4, 1, 0),
        new THREE.Face3(4, 5, 1),
    );

    const ulampTransformation = new THREE.Matrix4().makeScale(57, 6, 57);
    upperLatternPyramid.faces.forEach((face, index) => {
      if (index === 9 || index === 8) {
        face.color = new THREE.Color(`#a1b5e9`);
      } else {
        face.color = new THREE.Color(`#2b62c7`);
      }
    });
    const upperLMaterial = new THREE.MeshBasicMaterial({vertexColors: THREE.FaceColors, side: THREE.DoubleSide});
    const upperLattern = new THREE.Mesh(upperLatternPyramid.applyMatrix4(ulampTransformation), upperLMaterial);
    upperLattern.position.y = 364;

    lattern.add(rootBottom);
    lattern.add(rootTop);
    lattern.add(middle);
    lattern.add(underLattern);
    lattern.add(lamp);
    lattern.add(upperLattern);

    lattern.position.y = -220;
    lattern.position.x = 380;
    lattern.position.z = 20;

    lattern.rotateX((7.5 * Math.PI) / 180);
    lattern.rotateY((-5 * Math.PI) / 180);

    return lattern;
  }

  prepareSnowman() {
    const snoman = new THREE.Group();
    const snomanHead = new THREE.Group();
    const widthSegments = 40;
    const heightSegments = 30;
    const snomanBottomGeometry = new THREE.SphereGeometry(75, widthSegments, heightSegments);
    const snomanTopGeometry = new THREE.SphereGeometry(44, widthSegments, heightSegments);

    const snowMaterial = new THREE.MeshBasicMaterial({color: 0xFFFFFF, side: THREE.DoubleSide});
    const bottomBall = new THREE.Mesh(snomanBottomGeometry, snowMaterial);

    const topBall = new THREE.Mesh(snomanTopGeometry, snowMaterial);
    const carrotMaterial = new THREE.MeshBasicMaterial({color: 0xc95629, side: THREE.DoubleSide});
    const carrotGeometry = new THREE.ConeBufferGeometry(18, 75, 50);
    const carrot = new THREE.Mesh(carrotGeometry, carrotMaterial);
    carrot.rotateZ((-90 * Math.PI) / 180);
    carrot.position.x = 44;

    snomanHead.add(topBall);
    snomanHead.add(carrot);
    snomanHead.position.y = 109;
    snomanHead.rotateY((-15 * Math.PI) / 180);
    snomanHead.rotateZ((-15 * Math.PI) / 180);

    snoman.add(bottomBall);
    snoman.add(snomanHead);
    snoman.position.y = -120;
    snoman.position.x = -130;

    return snoman;
  }
}

const sceneObjects = new SceneObjects();

export default sceneObjects;
