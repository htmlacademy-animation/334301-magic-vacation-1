import * as THREE from "three";
import {SVGLoader} from "three/examples/jsm/loaders/SVGLoader";

import colors from './colors';

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


    this.prepareSoftMaterial = this.prepareSoftMaterial.bind(this);
    this.prepareBasicMaterial = this.prepareBasicMaterial.bind(this);
    this.prepareStrongMaterial = this.prepareStrongMaterial.bind(this);
  }

  prepareSoftMaterial(color) {
    return new THREE.MeshStandardMaterial({
      color,
      metalness: 0.65,
      roughness: 0.85,
      side: THREE.DoubleSide,
    });
  }

  prepareBasicMaterial(color) {
    return new THREE.MeshStandardMaterial({
      color,
      metalness: 0.5,
      roughness: 0.75,
      side: THREE.DoubleSide,
    });
  }

  prepareStrongMaterial(color) {
    return new THREE.MeshStandardMaterial({
      color,
      metalness: 0.2,
      roughness: 0.75,
      side: THREE.DoubleSide,
    });
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

    const ambientLight = new THREE.AmbientLight(0xffffff);
    light.add(ambientLight);

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
              let shapeMaterial;

              switch (svg.material) {
                case `soft`:
                  shapeMaterial = this.prepareSoftMaterial(svg.color);
                  break;
                case `basic`:
                  shapeMaterial = this.prepareBasicMaterial(svg.color);
                  break;
                default:
                  shapeMaterial = new THREE.MeshBasicMaterial({
                    color: path.color,
                    side: THREE.DoubleSide,
                  });
              }
              shapeMaterial.opacity = path.userData.style.fillOpacity;
              shapeMaterial.transparent = path.userData.style.fillOpacity < 1;

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

            const title = svg.title;
            svgObjects.push({
              title,
              object: svgGroup,
            });

            if (title === `keyhole`) {
              const keyholeGroup = new THREE.Group();
              const svgBox = new THREE.Box3().setFromObject(svgGroup);

              const backWidth = svgBox.max.x - svgBox.min.x;
              const backHeight = svg.height;
              const backDepth = 0;
              const backWidthSegments = 1;
              const backHeightSegments = 1;
              const backDepthSegments = 1;
              const backGeometry = new THREE.BoxBufferGeometry(
                  backWidth, backHeight, backDepth,
                  backWidthSegments, backHeightSegments, backDepthSegments);
              const backMaterial = new THREE.MeshBasicMaterial({
                color: colors.brightPurple,
              });
              const back = new THREE.Mesh(backGeometry, backMaterial);

              scene.add(svgGroup);
              scene.add(back);

              back.position.z = svg.z;

              scene.add(keyholeGroup);
            } else {
              scene.add(svgGroup);
            }
          },
      );
    });

    return (svgObjects);
  }

  prepareLatheRing(innerRadius, outerRadios, height, segments, startingAngel, finalAngel, color, materialType = `default`) {
    const lathePoints = [];
    for (let i = innerRadius; i < outerRadios; i++) {
      for (let j = 0; j < height; j++) {
        lathePoints.push(new THREE.Vector2(i, j));
      }
    }
    const phiStart = Math.PI * startingAngel / 180;
    const phiLength = Math.PI * (finalAngel - startingAngel) / 180;
    const geometry = new THREE.LatheBufferGeometry(lathePoints, segments, phiStart, phiLength);
    let material;

    switch (materialType) {
      case `soft`:
        material = this.prepareSoftMaterial(color);
        break;
      case `basic`:
        material = this.prepareBasicMaterial(color);
        break;
      case `strong`:
        material = this.prepareStrongMaterial(color);
        break;
      default:
        material = new THREE.MeshBasicMaterial({color, side: THREE.DoubleSide});
    }
    const lathe = new THREE.Mesh(geometry, material);

    return (lathe);
  }

  prepareCarpet() {
    const carpet = this.prepareLatheRing(763, 943, 3, 40, 16, 74, 0xffff00);

    return carpet;
  }

  prepareRoad() {
    const road = this.prepareLatheRing(732, 892, 3, 40, 0, 90, 0x4eb543);

    return road;
  }

  prepareSaturn(planetColor, smallPlanetColor) {
    const saturn = new THREE.Group();
    const planetGeometry = new THREE.SphereGeometry(60, 30, 30);
    const planetMaterial = this.prepareSoftMaterial(planetColor);
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);

    const smallPlanetGeometry = new THREE.SphereGeometry(10, 30, 30);
    const smallPlanetMaterial = this.prepareSoftMaterial(smallPlanetColor);
    const smallPlanet = new THREE.Mesh(smallPlanetGeometry, smallPlanetMaterial);
    smallPlanet.position.y = 120;

    const holderGeometry = new THREE.CylinderBufferGeometry(1, 1, 1000, 10);
    const holderMaterial = this.prepareSoftMaterial(colors.metalGrey);
    const holder = new THREE.Mesh(holderGeometry, holderMaterial);
    holder.position.y = 560;

    const planetCircle = this.prepareLatheRing(80, 120, 2, 20, 0, 360, 0x7f47ea, `soft`);
    planetCircle.rotateZ((18 * Math.PI) / 180);

    saturn.add(planet);
    saturn.add(smallPlanet);
    saturn.add(holder);
    saturn.add(planetCircle);

    return saturn;
  }

  preparePyramid() {
    const pyramidGeometry = new THREE.CylinderGeometry(0, 176, 280, 4);
    const pyramidMaterial = this.prepareSoftMaterial(colors.blue);
    const pyramid = new THREE.Mesh(pyramidGeometry, pyramidMaterial);

    return pyramid;
  }

  prepareLattern() {
    const lattern = new THREE.Group();
    const mainLatternMaterial = this.prepareSoftMaterial(colors.blue);

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
    lampPyramid.computeFaceNormals();
    const lampTransformation = new THREE.Matrix4().makeScale(42, 60, 42);
    const lampMaterial = this.prepareSoftMaterial(colors.lightBlue);
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
    upperLatternPyramid.computeFaceNormals();
    const ulampTransformation = new THREE.Matrix4().makeScale(57, 6, 57);
    const upperLattern = new THREE.Mesh(upperLatternPyramid.applyMatrix4(ulampTransformation), mainLatternMaterial);
    upperLattern.position.y = 364;

    lattern.add(rootBottom);
    lattern.add(rootTop);
    lattern.add(middle);
    lattern.add(underLattern);
    lattern.add(lamp);
    lattern.add(upperLattern);

    return lattern;
  }

  prepareSnowman() {
    const snowman = new THREE.Group();
    const snowmanHead = new THREE.Group();
    const widthSegments = 40;
    const heightSegments = 30;

    const snowmanBottomGeometry = new THREE.SphereGeometry(75, widthSegments, heightSegments);
    const snowmanTopGeometry = new THREE.SphereGeometry(44, widthSegments, heightSegments);
    const snowMaterial = this.prepareStrongMaterial(colors.snowColor);
    const bottomBall = new THREE.Mesh(snowmanBottomGeometry, snowMaterial);
    const topBall = new THREE.Mesh(snowmanTopGeometry, snowMaterial);

    const carrotMaterial = this.prepareSoftMaterial(colors.orange);
    const carrotGeometry = new THREE.ConeBufferGeometry(18, 75, 50);
    const carrot = new THREE.Mesh(carrotGeometry, carrotMaterial);
    carrot.rotateZ((-90 * Math.PI) / 180);
    carrot.position.x = 44;

    snowmanHead.add(topBall);
    snowmanHead.add(carrot);
    snowmanHead.position.y = 109;
    snowmanHead.rotateY((-15 * Math.PI) / 180);
    snowmanHead.rotateZ((-15 * Math.PI) / 180);

    snowman.add(bottomBall);
    snowman.add(snowmanHead);

    return snowman;
  }
}

const sceneObjects = new SceneObjects();

export default sceneObjects;
