import * as THREE from "three";

import TWEEN from "three/addons/libs/tween.module.js";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import {
  CSS3DRenderer,
  CSS3DObject,
} from "three/addons/renderers/CSS3DRenderer.js";

function getRandomName() {
  const firstName = [
    "John",
    "Jane",
    "Michael",
    "Emily",
    "David",
    "Sarah",
    "Daniel",
    "Olivia",
    "Matthew",
    "Sophia",
  ];
  const lastName = [
    "Zhang",
    "Wong",
    "Yii",
    "Yek",
    "Liu",
    "Yew",
    "Kiu",
    "Lee",
    "Smith",
    "Johnson",
    "Brown",
    "Taylor",
    "Wilson",
    "Anderson",
    "Thomas",
    "Harris",
    "Clark",
    "Lewis",
  ];

  const randomFirstName =
    firstName[Math.floor(Math.random() * firstName.length)];
  const randomLastName = lastName[Math.floor(Math.random() * lastName.length)];
  return randomFirstName + " " + randomLastName;
}

function getRandomGender() {
  const genders = ["Male", "Female"];
  return genders[Math.floor(Math.random() * genders.length)];
}

function getRandomAge() {
  return Math.floor(Math.random() * 40) + 20; // Random age between 20 and 59
}

let table = [];
if (
  document.getElementById("status").innerHTML != "Please log into this webpage."
) {
  for (let i = 0; i < 100; i++) {
    const randomName = getRandomName();
    const randomGender = getRandomGender();
    const randomAge = getRandomAge();

    table.push(randomName);
    table.push(randomGender);
    table.push(randomAge);
    table.push(randomAge);
    table.push(randomAge);
  }
}

let camera, scene, renderer;
let controls;

const objects = [];
const targets = { table: [], sphere: [], helix: [], grid: [], cone: [] };

init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.z = 3000;

  scene = new THREE.Scene();

  //table
  const tableRows = 7;
  const tableColumns = 18;
  const tableSpacingX = 250; // Horizontal spacing
  const tableSpacingY = 250; // Vertical spacing

  // Calculate the total width of the table
  const tableWidth = tableColumns * tableSpacingX;

  for (let row = 0; row < tableRows; row++) {
    for (let col = 0; col < tableColumns; col++) {
      const dataIndex = row * tableColumns * 5 + col * 5;
      if (dataIndex >= table.length) {
        break; // Exit the loop if we've reached the end of the data
      }

      const element = document.createElement("div");
      element.className = "element";
      if (table[dataIndex + 1] == "Female") {
        element.style.backgroundColor =
          "rgba(255, 105, 180, " + (Math.random() * 0.5 + 0.25) + ")";
      } else
        element.style.backgroundColor =
          "rgba(0, 102, 204, " + (Math.random() * 0.5 + 0.25) + ")";

      //element.style.backgroundColor = 'rgba(0,127,127,' + (Math.random() * 0.5 + 0.25) + ')';

      const number = document.createElement("div");
      number.className = "number";
      number.textContent = dataIndex / 5 + 1;
      element.appendChild(number);

      const symbol = document.createElement("div");
      symbol.className = "symbol";
      symbol.textContent = table[dataIndex];
      element.appendChild(symbol);

      const details = document.createElement("div");
      details.className = "details";
      details.innerHTML = table[dataIndex + 1] + "<br>" + table[dataIndex + 2];
      element.appendChild(details);

      const objectCSS = new CSS3DObject(element);
      objectCSS.position.x =
        col * tableSpacingX - tableWidth / 2 + tableSpacingX / 2; // Start from the middle
      objectCSS.position.y = -row * tableSpacingY + 750; // Adjust the vertical position as needed
      objectCSS.position.z = Math.random() * 4000 - 2000;
      scene.add(objectCSS);

      objects.push(objectCSS);

      const object = new THREE.Object3D();
      object.position.x =
        col * tableSpacingX - tableWidth / 2 + tableSpacingX / 2; // Start from the middle
      object.position.y = -row * tableSpacingY + 750; // Adjust the vertical position as needed

      targets.table.push(object);
    }
  }

  // sphere

  const vector = new THREE.Vector3();

  for (let i = 0, l = objects.length; i < l; i++) {
    const phi = Math.acos(-1 + (2 * i) / l);
    const theta = Math.sqrt(l * Math.PI) * phi;

    const object = new THREE.Object3D();

    object.position.setFromSphericalCoords(800, phi, theta);

    vector.copy(object.position).multiplyScalar(2);

    object.lookAt(vector);

    targets.sphere.push(object);
  }

  // helix

  for (let i = 0, l = objects.length; i < l; i++) {
    const theta = i * 0.175 + Math.PI;
    const y = -(i * 8) + 450;
    const object = new THREE.Object3D();
    object.position.setFromCylindricalCoords(900, theta, y);
    vector.x = object.position.x * 2;
    vector.y = object.position.y;
    vector.z = object.position.z * 2;
    object.lookAt(vector);
    targets.helix.push(object);
  }

  // grid

  for (let i = 0; i < objects.length; i++) {
    const object = new THREE.Object3D();

    object.position.x = (i % 5) * 400 - 800;
    object.position.y = -(Math.floor(i / 5) % 5) * 400 + 800;
    object.position.z = Math.floor(i / 25) * 1000 - 2000;

    targets.grid.push(object);
  }

  // cone

  for (let i = 0, l = objects.length; i < l; i++) {
    const theta = i * 4 + Math.PI;
    const y = -(i * 12) + 450;
    const object = new THREE.Object3D();

    object.position.setFromCylindricalCoords(500, theta, y);

    vector.x = object.position.x * 2;
    vector.y = object.position.y;
    vector.z = object.position.z * 2;

    object.lookAt(vector);
    targets.cone.push(object);
  }

  //

  renderer = new CSS3DRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("container").appendChild(renderer.domElement);

  //

  controls = new TrackballControls(camera, renderer.domElement);
  controls.minDistance = 500;
  controls.maxDistance = 6000;
  controls.addEventListener("change", render);

  const buttonTable = document.getElementById("table");
  buttonTable.addEventListener("click", function () {
    transform(targets.table, 2000);
  });

  const buttonSphere = document.getElementById("sphere");
  buttonSphere.addEventListener("click", function () {
    transform(targets.sphere, 2000);
  });

  const buttonHelix = document.getElementById("helix");
  buttonHelix.addEventListener("click", function () {
    transform(targets.helix, 2000);
  });

  const buttonGrid = document.getElementById("grid");
  buttonGrid.addEventListener("click", function () {
    transform(targets.grid, 2000);
  });

  const buttonCone = document.getElementById("cone");
  buttonCone.addEventListener("click", function () {
    transform(targets.cone, 2000);
  });
  transform(targets.table, 2000);

  //

  window.addEventListener("resize", onWindowResize);
}

function transform(targets, duration) {
  TWEEN.removeAll();

  for (let i = 0; i < objects.length; i++) {
    const object = objects[i];
    const target = targets[i];

    new TWEEN.Tween(object.position)
      .to(
        { x: target.position.x, y: target.position.y, z: target.position.z },
        Math.random() * duration + duration
      )
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();

    new TWEEN.Tween(object.rotation)
      .to(
        { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z },
        Math.random() * duration + duration
      )
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();
  }

  new TWEEN.Tween(this)
    .to({}, duration * 2)
    .onUpdate(render)
    .start();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  render();
}

function animate() {
  requestAnimationFrame(animate);

  TWEEN.update();

  controls.update();
}

function render() {
  renderer.render(scene, camera);
}
