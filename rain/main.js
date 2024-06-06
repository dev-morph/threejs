import * as THREE from 'three';

let scene, camera, renderer, thunder;

const cloudParticles = [];
function init() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(
		60,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	camera.position.z = 1.5;
	camera.rotation.x = 1.16;
	camera.rotation.y = -0.12;
	camera.rotation.z = 0.27;

	const ambient = new THREE.AmbientLight(0x555555);
	scene.add(ambient);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	/**
	 * 번개효과
	 */
	thunder = new THREE.PointLight(0x062d89, 2000, 1000, 1.7);
	thunder.position.set(1, 3, 1);
	scene.add(thunder);

	const plHelper = new THREE.PointLightHelper(thunder, 0.5);
	scene.add(plHelper);
	scene.add(new THREE.AxesHelper(5));

	// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
	// directionalLight.position.set(0, 1, 1);
	// scene.add(directionalLight);

	// // 빛 헬퍼 추가
	// const dlhelper = new THREE.DirectionalLightHelper(directionalLight, 0.5);
	// scene.add(dlhelper);
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
	cloudParticles.forEach((c) => {
		c.rotation.z -= 0.002;
	});

	if (Math.random() > 0.93 || thunder.power > 100) {
		if (thunder.power < 100) {
			console.log('g');
			thunder.power = 50 + Math.random() * 500;
		}
		thunder.position.set(0, 1, 1);
		thunder.power = 500 + Math.random() * 500; // 번개 강도 업데이트
	}
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}

function generateSmoke() {}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}
