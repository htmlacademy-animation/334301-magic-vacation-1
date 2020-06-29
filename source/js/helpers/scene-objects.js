import * as THREE from "three";
import {SVGLoader} from "three/examples/jsm/loaders/SVGLoader";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

import colors from './colors';

class SceneObjects {
  constructor() {
    this.obgjLoader = new OBJLoader();
    this.gltfLoader = new GLTFLoader();

    this.prepareLight = this.prepareLight.bind(this);
    this.prepareSvgs = this.prepareSvgs.bind(this);
    this.prepare3dObj = this.prepare3dObj.bind(this);
    this.prepareGltfObj = this.prepareGltfObj.bind(this);
    this.prepareLatheRing = this.prepareLatheRing.bind(this);
    this.prepareCarpet = this.prepareCarpet.bind(this);
    this.prepareRoad = this.prepareRoad.bind(this);
    this.prepareSaturn = this.prepareSaturn.bind(this);
    this.preparePyramid = this.preparePyramid.bind(this);
    this.prepareLattern = this.prepareLattern.bind(this);
    this.prepareSnowman = this.prepareSnowman.bind(this);
    this.prepareCircle = this.prepareCircle.bind(this);

    this.prepareSoftMaterial = this.prepareSoftMaterial.bind(this);
    this.prepareBasicMaterial = this.prepareBasicMaterial.bind(this);
    this.prepareStrongMaterial = this.prepareStrongMaterial.bind(this);
    this.selectMaterial = this.selectMaterial.bind(this);
  }

  selectMaterial(materialType, color) {
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

    return material;
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

    const pointLight1 = new THREE.PointLight(new THREE.Color(`rgb(246,242,255)`), 0.6, 0, 2);
    pointLight1.position.set(0, 500, 1350);
    pointLight1.castShadow = true;
    pointLight1.shadow.mapSize.width = 512;
    pointLight1.shadow.mapSize.height = 512;
    pointLight1.shadow.camera.near = 0.5;
    pointLight1.shadow.camera.far = 500;

    light.add(pointLight1);

    const pointLight2 = new THREE.PointLight(new THREE.Color(`rgb(246,242,255)`), 0.6, 0, 2);
    pointLight2.position.set(1350, 500, 0);
    pointLight2.castShadow = true;
    pointLight2.shadow.mapSize.width = 512;
    pointLight2.shadow.mapSize.height = 512;
    pointLight2.shadow.camera.near = 0.5;
    pointLight2.shadow.camera.far = 500;

    light.add(pointLight2);

    const pointLight3 = new THREE.PointLight(new THREE.Color(`rgb(246,242,255)`), 0.6, 0, 2);
    pointLight3.position.set(-1350, 500, 9);
    pointLight3.castShadow = true;
    pointLight3.shadow.mapSize.width = 512;
    pointLight3.shadow.mapSize.height = 512;
    pointLight3.shadow.camera.near = 0.5;
    pointLight3.shadow.camera.far = 500;

    light.add(pointLight3);

    const pointLight4 = new THREE.PointLight(new THREE.Color(`rgb(246,242,255)`), 0.6, 0, 2);
    pointLight4.position.set(0, 500, -1350);
    pointLight4.castShadow = true;
    pointLight4.shadow.mapSize.width = 512;
    pointLight4.shadow.mapSize.height = 512;
    pointLight4.shadow.camera.near = 0.5;
    pointLight4.shadow.camera.far = 500;

    light.add(pointLight4);

    const ambientLight = new THREE.AmbientLight(0xffffff);
    light.add(ambientLight);

    return light;
  }

  prepareSvgs(svgsData, scene) {
    return new Promise((resolve) => {
      const loader = new SVGLoader();
      const svgObjects = {};

      svgsData.forEach((svg) => {
        loader.load(
            svg.url,
            (svgData) => {
              const paths = svgData.paths;
              const svgGroup = new THREE.Group();

              for (let i = 0; i < paths.length; i++) {
                const path = paths[i];
                const shapeMaterial = this.selectMaterial(svg.material, svg.color);

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

                  const extrudeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
                  const shapeMesh = new THREE.Mesh(extrudeGeometry, shapeMaterial);
                  shapeMesh.castShadow = true;
                  shapeMesh.receiveShadow = true;
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
              svgGroup.rotateX((svg.rotX * Math.PI) / 180);
              svgGroup.rotateY((svg.rotY * Math.PI) / 180);
              svgGroup.rotateZ((svg.rotZ * Math.PI) / 180);
              svgGroup.scale.multiplyScalar(scaleValue);

              const title = svg.title;
              svgObjects[`${title}`] = svgGroup;

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
                back.castShadow = true;
                back.receiveShadow = true;

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

      resolve(svgObjects);
    });
  }

  prepare3dObj(url, color, materialType) {
    return new Promise((resolve) => {
      this.obgjLoader.load(
          url,
          (obj) => {
            obj.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                child.material = this.selectMaterial(materialType, color);
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });
            resolve(obj);
          }
      );
    });
  }

  prepareGltfObj(url) {
    return new Promise((resolve) => {
      this.gltfLoader.load(
          url,
          (gltf) => {
            const root = gltf.scene;
            root.castShadow = true;
            root.receiveShadow = true;

            resolve(root);
          }
      );
    });
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
    const material = this.selectMaterial(materialType, color);

    const lathe = new THREE.Mesh(geometry, material);
    lathe.castShadow = true;
    lathe.receiveShadow = true;

    return (lathe);
  }

  prepareCarpet() {
    const carpet = new THREE.Group();
    const carpetPartsNumber = 7;
    const carpetStep = 54 / carpetPartsNumber;

    for (let i = 0; i < carpetPartsNumber; i++) {
      const startingAngel = 16 + carpetStep * i;
      const finalAngel = 16 + carpetStep * (i + 1);
      const blockColor = i % 2 === 0 ? colors.purple : colors.additionalPurple;
      const carpetBlock = this.prepareLatheRing(763, 943, 3, 40, startingAngel, finalAngel, blockColor, `soft`);

      carpet.add(carpetBlock);
    }

    return carpet;
  }

  prepareRoad() {
    const road = new THREE.Group();
    const roadBody = this.prepareLatheRing(732, 892, 3, 40, 0, 90, colors.grey, `soft`);
    road.add(roadBody);
    const lineLength = 90 / 12;

    let startingAngel = lineLength;

    for (let i = 0; i < 4; i++) {
      const finalAngel = startingAngel + lineLength;

      const roadLine = this.prepareLatheRing(802, 822, 1, 40, startingAngel, finalAngel, colors.white, `soft`);
      roadLine.position.y = 3;
      road.add(roadLine);

      startingAngel = finalAngel + 2 * lineLength;
    }


    return road;
  }

  prepareSaturn(planetColor, smallPlanetColor, noHolder = false) {
    const saturn = new THREE.Group();
    const planetGeometry = new THREE.SphereGeometry(60, 30, 30);
    const planetMaterial = this.prepareSoftMaterial(planetColor);
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    planet.castShadow = true;
    planet.receiveShadow = true;


    if (noHolder === false) {
      const smallPlanetGeometry = new THREE.SphereGeometry(10, 30, 30);
      const smallPlanetMaterial = this.prepareSoftMaterial(smallPlanetColor);
      const smallPlanet = new THREE.Mesh(smallPlanetGeometry, smallPlanetMaterial);
      smallPlanet.castShadow = true;
      smallPlanet.receiveShadow = true;
      smallPlanet.position.y = 120;

      const holderGeometry = new THREE.CylinderBufferGeometry(1, 1, 1000, 10);
      const holderMaterial = this.prepareSoftMaterial(colors.metalGrey);
      const holder = new THREE.Mesh(holderGeometry, holderMaterial);
      holder.castShadow = true;
      holder.receiveShadow = true;
      holder.position.y = 560;

      saturn.add(holder);
      saturn.add(smallPlanet);
    }

    const planetCircle = this.prepareLatheRing(80, 120, 2, 20, 0, 360, 0x7f47ea, `soft`);
    planetCircle.rotateZ((18 * Math.PI) / 180);

    saturn.add(planet);
    saturn.add(planetCircle);

    return saturn;
  }

  preparePyramid() {
    const pyramidGeometry = new THREE.CylinderGeometry(0, 176, 280, 4);
    const pyramidMaterial = this.prepareSoftMaterial(colors.blue);
    const pyramid = new THREE.Mesh(pyramidGeometry, pyramidMaterial);
    pyramid.castShadow = true;
    pyramid.receiveShadow = true;

    return pyramid;
  }

  prepareLattern() {
    const lattern = new THREE.Group();
    const mainLatternMaterial = this.prepareSoftMaterial(colors.blue);

    const rootBottomGeometry = new THREE.CylinderBufferGeometry(16, 16, 120, 20);
    const rootBottom = new THREE.Mesh(rootBottomGeometry, mainLatternMaterial);
    rootBottom.castShadow = true;
    rootBottom.receiveShadow = true;

    const rootTopGeometry = new THREE.SphereGeometry(16, 40, 30);
    const rootTop = new THREE.Mesh(rootTopGeometry, mainLatternMaterial);
    rootTop.castShadow = true;
    rootTop.receiveShadow = true;
    rootTop.position.y = 60;

    const middleGeometry = new THREE.CylinderBufferGeometry(7, 7, 230, 20);
    const middle = new THREE.Mesh(middleGeometry, mainLatternMaterial);
    middle.castShadow = true;
    middle.receiveShadow = true;
    middle.position.y = 185;

    const underLatternGeometry = new THREE.BoxBufferGeometry(37, 4, 37);
    const underLattern = new THREE.Mesh(underLatternGeometry, mainLatternMaterial);
    underLattern.castShadow = true;
    underLattern.receiveShadow = true;
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
    lamp.castShadow = true;
    lamp.receiveShadow = true;
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
    upperLattern.castShadow = true;
    upperLattern.receiveShadow = true;
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
    topBall.castShadow = true;
    bottomBall.receiveShadow = true;

    const carrotMaterial = this.prepareSoftMaterial(colors.orange);
    const carrotGeometry = new THREE.ConeBufferGeometry(18, 75, 50);
    const carrot = new THREE.Mesh(carrotGeometry, carrotMaterial);
    carrot.castShadow = true;
    carrot.receiveShadow = true;
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

  prepareCircle(radius, startingAngel = 0, finalAngel = 360, color, materialType = `default`) {
    const thetaStart = Math.PI * startingAngel / 180;
    const thetaLength = Math.PI * (finalAngel - startingAngel) / 180;
    const circleGeometry = new THREE.CircleBufferGeometry(radius, 20, thetaStart, thetaLength);

    const material = this.selectMaterial(materialType, color);

    const circle = new THREE.Mesh(circleGeometry, material);
    circle.castShadow = true;
    circle.receiveShadow = true;

    return (circle);
  }
}

const sceneObjects = new SceneObjects();

export default sceneObjects;
