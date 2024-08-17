import * as THREE from 'three';

export default class GameModule {
	private scene: THREE.Scene;
	private camera: THREE.PerspectiveCamera;
	private renderer: THREE.WebGLRenderer;
	private controlKeys: { [action: string]: string };
	private playerId: number;

	constructor(playerId: number, controlKeys: { [action: string]: string }) {
		this.playerId = playerId;
		this.controlKeys = controlKeys;
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);
		this.renderer = new THREE.WebGLRenderer();

		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(this.renderer.domElement);

		this.initScene();
		this.animate();
	}

	private initScene(): void {
		const geometry = new THREE.BoxGeometry();
		const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
		const cube = new THREE.Mesh(geometry, material);

		this.scene.add(cube);
		this.camera.position.z = 5;
	}

	private animate(): void {
		requestAnimationFrame(() => this.animate());

		// Example animation
		this.scene.children.forEach((child: THREE.Object3D) => {
			if (child instanceof THREE.Mesh) {
				child.rotation.x += 0.01;
				child.rotation.y += 0.01;
			}
		});

		this.renderer.render(this.scene, this.camera);
	}

	public updateControls(newControlKeys: { [action: string]: string }): void {
		this.controlKeys = newControlKeys;
		// Update control logic
	}

	public getElement(): HTMLElement {
		return this.renderer.domElement;
	}
}
