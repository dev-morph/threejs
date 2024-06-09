import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer;
const thunder = new THREE.PointLight(0x062d89, 10000, 500, 0.6);
const rainGeo = new THREE.BufferGeometry();
const rainCount = 1000;
const rainDrops = [];

const cloudParticles = [];
function init() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	camera.position.set(0, 0, 1);
	camera.rotation.x = 1.16;
	camera.rotation.y = -0.12;
	camera.position.z = 30;

	// camera.rotation.z = 0.27;

	const directionalLight = new THREE.DirectionalLight(0x989898);
	directionalLight.position.set(0, 0, 1);
	scene.add(directionalLight);

	const ambient = new THREE.AmbientLight(0x555555); //0x555555
	scene.add(ambient);

	/**
	 * 비 효과
	 */
	// addLinearRain();
	addRain();

	/**
	 * 번개효과
	 */
	thunder.position.set(300, 500, 100);
	scene.add(thunder);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	// addControl();
	/**
	 * 구름 효과 추가
	 */
	const loader = new THREE.TextureLoader();
	const smokeUrl =
		'https://static.vecteezy.com/system/resources/previews/010/884/548/original/dense-fluffy-puffs-of-white-smoke-and-fog-on-transparent-background-abstract-smoke-clouds-movement-blurred-out-of-focus-smoking-blows-from-machine-dry-ice-fly-fluttering-in-air-effect-texture-png.png';
	loader.load(smokeUrl, (texture) => {
		const cloudGeo = new THREE.PlaneGeometry(500, 500);
		const cloudMaterial = new THREE.MeshLambertMaterial({
			map: texture,
			transparent: true,
		});

		for (let p = 0; p < 25; p++) {
			let cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
			cloud.position.set(
				Math.random() * 800 - 300, // -300 ~ 500
				500,
				Math.random() * 500 - 450 // -450 ~ 50
			);
			cloud.rotation.x = 1.16;
			cloud.rotation.y = -0.12;
			cloud.rotation.z = Math.random() * 360;
			cloud.material.opacity = 0.6;
			cloudParticles.push(cloud);
			scene.add(cloud);
		}
		animate();
	});
	window.addEventListener('resize', onWindowResize);
}

init();

function animate() {
	cloudParticles.forEach((c) => {
		c.rotation.z -= 0.002;
	});

	// fallRain();
	dropRain();

	if ((Math.random() > 0.91) | (thunder.power > 20000)) {
		if (thunder.power < 20000) {
			thunder.position.set(
				Math.random() * 400,
				300 + Math.random() * 200,
				100
			);
		}
		thunder.power = Math.random() * 30000;
	} else {
		thunder.power = 0;
	}
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}

function addLinearRain() {
	const rainGeo = new THREE.BufferGeometry();
	const vertices = new Float32Array([
		0,
		0,
		0,
		0,
		-8,
		0, // A line from (0, 0, 0) to (0, -15, 0)
	]);
	rainGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

	const material = new THREE.LineBasicMaterial({ color: 0x626262 });

	for (let i = 0; i < rainCount; i++) {
		const rainDrop = new THREE.Line(rainGeo, material);
		rainDrop.position.set(
			Math.random() * 650 - 250, // -150 ~ 250
			Math.random() * 160 + 90, // 90~250
			// Math.random() * 150 + 70, // 70 ~ 220
			Math.random() * 440 - 350 // -350 ~ 90

			// Math.random() * 150 - 100 // -100 ~ 50
		);
		scene.add(rainDrop);
		rainDrops.push(rainDrop);
	}
}

function addRain() {
	const rainPositions = [];
	const sizes = [];
	const rainLoader = new THREE.TextureLoader();
	const rainDrop = rainLoader.load('/disc.png');

	for (let i = 0; i < rainCount; i++) {
		const rainDrop = new THREE.Vector3(
			Math.random() * 400 - 200,
			Math.random() * 150 + 70, //70 ~ 220
			Math.random() * 150 - 100 //-100 ~ 50

			// Math.random() * 250 - 200 // -200 ~ 20
		);

		rainPositions.push(rainDrop.x, rainDrop.y, rainDrop.z);
		sizes.push(30);
	}

	rainGeo.setAttribute(
		'position',
		new THREE.BufferAttribute(new Float32Array(rainPositions), 3)
	);
	rainGeo.setAttribute(
		'size',
		new THREE.BufferAttribute(new Float32Array(sizes), 1)
	);

	const rainMaterial = new THREE.PointsMaterial({
		color: 0x626262,
		sizes: 5,
		transparent: true,
		map: rainDrop,
	});

	const rain = new THREE.Points(rainGeo, rainMaterial);
	scene.add(rain);
}

function fallRain() {
	for (let i = 0; i < rainDrops.length; i++) {
		const rainDrop = rainDrops[i];
		rainDrop.position.y -= 2;
		// rainDrop.position.z -= 0.1;
		if (rainDrop.position.y < 90) {
			rainDrop.position.y = Math.random() * 160 + 90; // 90~250
		}
		// if (rainDrop.position.z < -350) {
		// 	rainDrop.position.z = Math.random() * 440 - 350; // -350 ~ 90
		// }
	}
}

function dropRain() {
	const positions = rainGeo.attributes.position.array;
	for (let i = 0; i < positions.length; i += 3) {
		positions[i + 1] -= 2;
		positions[i + 2] -= 2;
		if (positions[i + 1] < 50) {
			positions[i + 1] = Math.random() * 150 + 70; //70 ~ 220
		}
		if (positions[i + 2] < -100) {
			positions[i + 2] = Math.random() * 150 - 100; //-100 ~ 50
		}
	}
	rainGeo.attributes.position.needsUpdate = true;
}

function addControl() {
	const controls = new OrbitControls(camera, renderer.domElement);
	controls.target.set(0, 500, 0);
	controls.update();
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}
