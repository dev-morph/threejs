import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer, thunder;
const cloudParticles = [];

function init() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	camera.position.set(0, 0, 10);
	// camera.rotation.x = 1.16;
	// camera.rotation.y = -0.12;

	const ambient = new THREE.AmbientLight(0xffffff); // Dimmed the ambient light
	scene.add(ambient);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	/**
	 * Add a box
	 */
	const box = new THREE.Mesh(
		new THREE.BoxGeometry(1, 1, 1),
		new THREE.MeshStandardMaterial({ color: 0xffffff }) // Changed to MeshStandardMaterial
	);
	box.position.set(0, 1, 0);

	scene.add(box);

	/**
	 * Add thunder effect
	 */
	thunder = new THREE.PointLight(0xff0000, 1000, 1000, 1.7); // Adjusted intensity and distance
	thunder.position.set(0, 500, 0);
	scene.add(thunder);

	const helper = new THREE.PointLightHelper(thunder, 0.5);
	scene.add(helper);

	const controls = new OrbitControls(camera, renderer.domElement);
	controls.target.set(0, 500, 0);
	controls.update();
	/**
	 * Add cloud effect
	 */
	const loader = new THREE.TextureLoader();
	const smokeUrl =
		'https://static.vecteezy.com/system/resources/previews/010/884/548/original/dense-fluffy-puffs-of-white-smoke-and-fog-on-transparent-background-abstract-smoke-clouds-movement-blurred-out-of-focus-smoking-blows-from-machine-dry-ice-fly-fluttering-in-air-effect-texture-png.png';
	loader.load(smokeUrl, (texture) => {
		const cloudGeo = new THREE.PlaneGeometry(500, 500);
		const cloudMaterial = new THREE.MeshLambertMaterial({
			map: texture,
			transparent: true,
			side: THREE.DoubleSide,
		});

		for (let p = 0; p < 25; p++) {
			let cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
			cloud.position.set(
				Math.random() * 800 - 400,
				500,
				Math.random() * 500 - 450
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
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}
