import * as THREE from "three";
import { Player } from "./Player";
import TournamentState from "./TournamentState";
import { Team } from "./TournamentState";

export default class GameModule {
	private readonly CAMERA_FOV = 70;
	private readonly CAMERA_NEAR = 0.1;
	private readonly CAMERA_FAR = 1000;
	private readonly CAMERA_A_POSITION = new THREE.Vector3(-17, 0.9, 0);
	private readonly CAMERA_B_POSITION = new THREE.Vector3(17, 0.9, 0);
	private readonly CAMERA_LOOK_AT = new THREE.Vector3(0, 0, 0);

	private readonly TABLE_COLOR = 0x004400;
	private readonly TABLE_DIMENSIONS = { width: 18, height: 0.3, depth: 10 };
	private readonly TABLE_POSITION = new THREE.Vector3(0, -3, 0);

	private readonly PADDLE_DIMENSIONS = { width: 0.1, height: 0.4, depth: 1.5 };
	private readonly PADDLE_OPACITY = 0.6;
	private readonly PADDLE_X_OFFSET = 5;
	private readonly PADDLE_X_POSITION =
		this.CAMERA_B_POSITION.x - this.PADDLE_X_OFFSET;
	private readonly PADDLE_Y_POSITION = -1;
	private readonly PADDLE_Z_OFFSET = 2;
	private readonly PADDLE_MOVE_DISTANCE = 0.78;
	private readonly BALL_COLOR = 0xff00ff;
	private readonly BALL_RADIUS = 0.08;
	private readonly BALL_SEGMENTS = 32;
	private readonly BALL_INITIAL_VELOCITY = new THREE.Vector3(0.14, 0, 0);

	private readonly LIGHT_INTENSITY = 5.5;
	private readonly LIGHT_DISTANCE = 100;
	private readonly LIGHT_POSITION = new THREE.Vector3(0, 30, 0);
	private readonly AMBIENT_LIGHT_INTENSITY = 0x404040;

	private readonly FLOOR_Y_POSITION = -5;
	private readonly PLAY_AREA = {
		width: (this.PADDLE_X_POSITION + 2) * 2,
		depth: this.TABLE_DIMENSIONS.depth + 1,
	};

	private animationFrameId: number | null = null;
	private players: Player[] = [];
	private scene: THREE.Scene;
	private cameraA: THREE.PerspectiveCamera;
	private cameraB: THREE.PerspectiveCamera;
	private renderer: THREE.WebGLRenderer;
	private ball: THREE.Mesh | undefined;
	private ballVelocity: THREE.Vector3;
	private controlKeys: ReturnType<typeof Player.getControlKeys>;
	private teams: Team[];
	private scoreA: number = 0;
	private scoreB: number = 0;
	private scoreLimit: number;
	private onGameEnd: (winner: Team) => void;
	private keyState: { [key: string]: boolean } = {};
	private playerCount: number;
	private scoreCallback: ((scoreA: number, scoreB: number) => void) | null =
		null;

	constructor(
		playerCount: number,
		teams: Team[],
		scoreLimit: number,
		onGameEnd: (winner: Team) => void
	) {
		this.playerCount = playerCount;
		this.teams = teams;
		this.scoreLimit = scoreLimit;
		this.onGameEnd = onGameEnd;
		this.controlKeys = Player.getControlKeys();

		this.scene = new THREE.Scene();

		this.cameraA = new THREE.PerspectiveCamera(
			this.CAMERA_FOV,
			window.innerWidth / window.innerHeight,
			this.CAMERA_NEAR,
			this.CAMERA_FAR
		);
		this.cameraA.position.copy(this.CAMERA_A_POSITION);
		this.cameraA.lookAt(this.CAMERA_LOOK_AT);

		this.cameraB = new THREE.PerspectiveCamera(
			this.CAMERA_FOV,
			window.innerWidth / window.innerHeight,
			this.CAMERA_NEAR,
			this.CAMERA_FAR
		);
		this.cameraB.position.copy(this.CAMERA_B_POSITION);
		this.cameraB.lookAt(this.CAMERA_LOOK_AT);

		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setScissorTest(true);
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		document.body.appendChild(this.renderer.domElement);

		this.ballVelocity = this.BALL_INITIAL_VELOCITY.clone();

		window.addEventListener("resize", () => this.onWindowResize());
		this.initGame();
		this.animate();
	}

	public setScoreCallback(
		callback: (scoreA: number, scoreB: number) => void
	): void {
		this.scoreCallback = callback;
	}

	private initGame(): void {
		this.setupLighting();
		this.setupEnvironment();
		this.setupTable();
		this.setupPlayers();
		this.setupBall();
		this.addEventListeners();
	}

	private setupLighting(): void {
		const lightDistance = 500;
		const lightPositions = [
			new THREE.Vector3(-50, 100, -50),
			new THREE.Vector3(50, 100, -50),
			new THREE.Vector3(-50, 100, 50),
			new THREE.Vector3(50, 100, 50),
		];

		lightPositions.forEach((position) => {
			const light = new THREE.PointLight(0xffffff, 1.5, lightDistance);
			light.position.copy(position);
			light.castShadow = true;
			light.shadow.mapSize.width = 2048;
			light.shadow.mapSize.height = 2048;
			light.shadow.camera.near = 0.5;
			light.shadow.camera.far = 500;
			this.scene.add(light);
		});

		const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
		this.scene.add(ambientLight);
	}

	private setupEnvironment(): void {
		const floorGeometry = new THREE.PlaneGeometry(100, 100);
		const floorMaterial = new THREE.MeshStandardMaterial({
			color: 0x050505,
			roughness: 1.0,
		});
		const floor = new THREE.Mesh(floorGeometry, floorMaterial);
		floor.rotation.x = -Math.PI / 2;
		floor.position.y = this.FLOOR_Y_POSITION;
		floor.receiveShadow = true;
		this.scene.add(floor);

		const wallGeometry = new THREE.PlaneGeometry(100, 50);
		const wallMaterial = new THREE.MeshStandardMaterial({
			color: 0x111111,
			roughness: 1.0,
		});

		// 벽 1 - 탁구대 뒤쪽
		const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
		backWall.position.set(0, 25, -50);
		backWall.receiveShadow = true;
		this.scene.add(backWall);

		// 벽 2 - 탁구대 왼쪽
		const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
		leftWall.position.set(-50, 25, 0);
		leftWall.rotation.y = Math.PI / 2;
		leftWall.receiveShadow = true;
		this.scene.add(leftWall);

		// 벽 3 - 탁구대 오른쪽
		const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
		rightWall.position.set(50, 25, 0);
		rightWall.rotation.y = -Math.PI / 2;
		rightWall.receiveShadow = true;
		this.scene.add(rightWall);

		// 벽 4 - 탁구대 앞쪽
		const frontWall = new THREE.Mesh(wallGeometry, wallMaterial);
		frontWall.position.set(0, 25, 50);
		frontWall.rotation.y = Math.PI;
		frontWall.receiveShadow = true;
		this.scene.add(frontWall);
	}

	private setupTable(): void {
		const textureLoader = new THREE.TextureLoader();
		const tableTexture = textureLoader.load("/images/table.jpg");
		const tableMaterial = new THREE.MeshStandardMaterial({
			map: tableTexture,
			roughness: 0.8,
			metalness: 0.01,
		});

		const tableGeometry = new THREE.BoxGeometry(
			this.TABLE_DIMENSIONS.width,
			this.TABLE_DIMENSIONS.height,
			this.TABLE_DIMENSIONS.depth
		);
		const table = new THREE.Mesh(tableGeometry, tableMaterial);
		table.position.copy(this.TABLE_POSITION);
		table.castShadow = true;
		this.scene.add(table);

		// 탁구대 다리
		const legHeight =
			this.TABLE_POSITION.y -
			this.FLOOR_Y_POSITION -
			this.TABLE_DIMENSIONS.height / 2;
		const legGeometry = new THREE.BoxGeometry(
			this.TABLE_DIMENSIONS.width * 0.05,
			legHeight,
			this.TABLE_DIMENSIONS.depth * 0.05
		);
		const legMaterial = new THREE.MeshStandardMaterial({
			color: 0x333333,
			roughness: 1.0,
		});

		// 다리 위치 설정
		const positions = [
			new THREE.Vector3(
				this.TABLE_DIMENSIONS.width / 2 - legGeometry.parameters.width / 2,
				this.FLOOR_Y_POSITION + legHeight / 2,
				this.TABLE_DIMENSIONS.depth / 2 - legGeometry.parameters.depth / 2
			), // 앞 왼쪽
			new THREE.Vector3(
				this.TABLE_DIMENSIONS.width / 2 - legGeometry.parameters.width / 2,
				this.FLOOR_Y_POSITION + legHeight / 2,
				-this.TABLE_DIMENSIONS.depth / 2 + legGeometry.parameters.depth / 2
			), // 뒤 왼쪽
			new THREE.Vector3(
				-this.TABLE_DIMENSIONS.width / 2 + legGeometry.parameters.width / 2,
				this.FLOOR_Y_POSITION + legHeight / 2,
				this.TABLE_DIMENSIONS.depth / 2 - legGeometry.parameters.depth / 2
			), // 앞 오른쪽
			new THREE.Vector3(
				-this.TABLE_DIMENSIONS.width / 2 + legGeometry.parameters.width / 2,
				this.FLOOR_Y_POSITION + legHeight / 2,
				-this.TABLE_DIMENSIONS.depth / 2 + legGeometry.parameters.depth / 2
			), // 뒤 오른쪽
		];

		// 다리 생성
		positions.forEach((position) => {
			const leg = new THREE.Mesh(legGeometry, legMaterial);
			leg.position.copy(position);
			leg.castShadow = true;
			this.scene.add(leg);
		});

		// 가름망
		const netGeometry = new THREE.BoxGeometry(
			this.TABLE_DIMENSIONS.width * 0.02,
			this.TABLE_DIMENSIONS.height * 4,
			this.TABLE_DIMENSIONS.depth
		);
		const netMaterial = new THREE.MeshStandardMaterial({
			color: 0x00ff00,
			transparent: true,
			opacity: 0.3,
		});
		const net = new THREE.Mesh(netGeometry, netMaterial);
		net.position.set(
			0,
			this.TABLE_POSITION.y + this.TABLE_DIMENSIONS.height / 2,
			0
		);
		net.castShadow = true;
		this.scene.add(net);

		// 벽
		const wallThickness = 0.2;
		const wallHeight = this.PADDLE_Y_POSITION - this.TABLE_POSITION.y;
		const wallGeometry = new THREE.BoxGeometry(
			this.TABLE_DIMENSIONS.width * 1.35,
			wallHeight,
			wallThickness
		);
		const wallMaterial = new THREE.MeshStandardMaterial({
			color: 0x333333,
			roughness: 1.0,
		});

		// 왼쪽 벽
		const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
		leftWall.position.set(
			0,
			(this.TABLE_POSITION.y + this.PADDLE_Y_POSITION) / 2,
			-this.TABLE_DIMENSIONS.depth / 2 - wallThickness / 2
		);
		leftWall.castShadow = true;
		this.scene.add(leftWall);

		// 오른쪽 벽
		const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
		rightWall.position.set(
			0,
			(this.TABLE_POSITION.y + this.PADDLE_Y_POSITION) / 2,
			this.TABLE_DIMENSIONS.depth / 2 + wallThickness / 2
		);
		rightWall.castShadow = true;
		this.scene.add(rightWall);
	}

	private setupPlayers(): void {
		const paddleGeometry = new THREE.BoxGeometry(
			this.PADDLE_DIMENSIONS.width,
			this.PADDLE_DIMENSIONS.height,
			this.PADDLE_DIMENSIONS.depth
		);

		for (let i = 0; i < this.playerCount; i++) {
			const teamIndex = i < this.playerCount / 2 ? 0 : 1;
			const paddleMaterial = new THREE.MeshStandardMaterial({
				color:
					i % 2 === 0
						? this.teams[teamIndex].color1
						: this.teams[teamIndex].color2,
				opacity: this.PADDLE_OPACITY,
				transparent: true,
			});
			const paddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
			const xPos =
				teamIndex === 0 ? -this.PADDLE_X_POSITION : this.PADDLE_X_POSITION;
			paddle.position.set(
				xPos,
				this.PADDLE_Y_POSITION,
				(i % 2) * this.PADDLE_Z_OFFSET - 1
			);
			this.scene.add(paddle);

			const player = new Player(paddle, this.controlKeys[i + 1]);
			this.players.push(player);
		}
	}

	private setupBall(): void {
		const ballGeometry = new THREE.SphereGeometry(
			this.BALL_RADIUS,
			this.BALL_SEGMENTS,
			this.BALL_SEGMENTS
		);
		const ballMaterial = new THREE.MeshStandardMaterial({
			color: this.BALL_COLOR,
		});
		this.ball = new THREE.Mesh(ballGeometry, ballMaterial);
		this.ball.position.set(0, this.PADDLE_Y_POSITION, 0);
		this.scene.add(this.ball);
	}

	public removeEventListeners(): void {
		window.removeEventListener("keydown", this.handleKeyDown);
		window.removeEventListener("keyup", this.handleKeyUp);
		window.removeEventListener("resize", this.onWindowResize);
	}

	private handleKeyDown = (event: KeyboardEvent) => {
		this.keyState[event.key] = true;
	};

	private handleKeyUp = (event: KeyboardEvent) => {
		this.keyState[event.key] = false;
	};

	private addEventListeners(): void {
		window.addEventListener("keydown", this.handleKeyDown);
		window.addEventListener("keyup", this.handleKeyUp);
	}

	private onWindowResize(): void {
		const width = window.innerWidth;
		const height = window.innerHeight;

		this.cameraA.aspect = width / height;
		this.cameraA.updateProjectionMatrix();

		this.cameraB.aspect = width / height;
		this.cameraB.updateProjectionMatrix();

		this.renderer.setSize(width, height);
	}

	private animate(): void {
		this.animationFrameId = requestAnimationFrame(() => this.animate());
		this.playGame();
	}

	public stopAnimation(): void {
		if (this.animationFrameId) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}
	}

	private playGame(): void {
		this.movePaddles();
		this.moveBall();
		this.checkCollisions();

		if (this.isGoalScored()) {
			this.resetRound();
		}

		this.render();
	}

	private movePaddles(): void {
		this.players.forEach((player, index) => {
			const teamIndex = index < this.playerCount / 2 ? 0 : 1;
			const directionMultiplier = teamIndex === 0 ? 1 : -1;

			player.movePaddle(
				directionMultiplier,
				this.PADDLE_MOVE_DISTANCE * 0.1,
				this.PLAY_AREA.depth,
				this.keyState
			);
		});
	}

	private moveBall(): void {
		if (this.ball) {
			this.ball.position.add(this.ballVelocity);

			let progressX = 0;

			if (this.ballVelocity.x > 0) {
				// 팀 A -> 팀 B
				const startX =
					-this.PADDLE_X_POSITION +
					this.BALL_RADIUS +
					this.PADDLE_DIMENSIONS.width / 2;
				progressX = this.ball.position.x - startX;
			} else {
				// 팀 B -> 팀 A
				const startX =
					this.PADDLE_X_POSITION -
					this.BALL_RADIUS -
					this.PADDLE_DIMENSIONS.width / 2;
				progressX = startX - this.ball.position.x;
			}

			this.ball.position.y = this.mapXToY(progressX);

			this.handleWallCollisions();
		}
	}

	private checkCollisions(): void {
		if (this.ball) {
			const ballX = this.ball.position.x;
			const ballZ = this.ball.position.z;

			this.players.forEach((player) => {
				const paddle = player.paddle;
				const paddleX = paddle.position.x;
				const paddleZ = paddle.position.z;

				const paddleMinX =
					paddleX - this.BALL_RADIUS / 2 - this.PADDLE_DIMENSIONS.width / 2;
				const paddleMaxX =
					paddleX + this.BALL_RADIUS / 2 + this.PADDLE_DIMENSIONS.width / 2;

				if (ballX >= paddleMinX && ballX <= paddleMaxX) {
					const paddleMinZ = paddleZ - this.PADDLE_DIMENSIONS.depth / 2;
					const paddleMaxZ = paddleZ + this.PADDLE_DIMENSIONS.depth / 2;

					if (ballZ >= paddleMinZ && ballZ <= paddleMaxZ) {
						this.handlePaddleCollision(paddle);
					}
				}
			});

			this.handleGoalScoring();
		}
	}

	private handleWallCollisions(): void {
		if (this.ball) {
			if (Math.abs(this.ball.position.z) > this.TABLE_DIMENSIONS.depth / 2) {
				this.ballVelocity.z *= -1;
			}
		}
	}

	private handlePaddleCollision(paddle: THREE.Mesh): void {
		if (this.ball) {
			// const targetX = -paddle.position.x;

			// const targetZ =
			// 	Math.random() * this.TABLE_DIMENSIONS.depth -
			// 	this.TABLE_DIMENSIONS.depth / 2;

			const directionMultiplier = paddle.position.x < 0 ? 1 : -1;

			const targetZ =
				Math.random() * (this.PLAY_AREA.depth - 2 * this.BALL_RADIUS) -
				(this.PLAY_AREA.depth - this.BALL_RADIUS) / 2;

			const targetX =
				(directionMultiplier *
					(this.PADDLE_DIMENSIONS.width - this.BALL_RADIUS)) /
				2;

			const targetY = this.mapXToY(targetX);

			const direction = new THREE.Vector3(targetX, targetY, targetZ)
				.sub(this.ball.position)
				.normalize();

			this.ballVelocity = direction.multiplyScalar(
				this.BALL_INITIAL_VELOCITY.length()
			);
		}
	}

	private handleGoalScoring(): void {
		if (this.ball) {
			const ballPositionX = this.ball.position.x;
			const boundaryX = this.PLAY_AREA.width / 2;

			if (ballPositionX > boundaryX) {
				this.updateScore(0);
			} else if (ballPositionX < -boundaryX) {
				this.updateScore(1);
			}
		}
	}

	private updateScore(teamIndex: number): void {
		if (teamIndex === 0) {
			this.scoreA += 1;
		} else {
			this.scoreB += 1;
		}

		if (
			(teamIndex === 0 && this.scoreA >= this.scoreLimit) ||
			(teamIndex === 1 && this.scoreB >= this.scoreLimit)
		) {
			const winner = this.teams[teamIndex];
			this.onGameEnd(winner);
		} else if (this.scoreCallback) {
			this.scoreCallback(this.scoreA, this.scoreB);
		}
	}

	private isGoalScored(): boolean {
		if (this.ball) {
			return Math.abs(this.ball.position.x) > this.PLAY_AREA.width / 2;
		}
		return false;
	}

	private resetRound(): void {
		if (this.ball) {
			this.ball.position.set(0, this.mapXToY(0), 0);

			const randomDirection = Math.random() < 0.5 ? -1 : 1;

			this.ballVelocity.set(0.1 * randomDirection, 0, 0);
		}

		this.players.forEach((player, index: number) => {
			const teamIndex = index < this.playerCount / 2 ? 0 : 1;
			const xPos =
				teamIndex === 0 ? -this.PADDLE_X_POSITION : this.PADDLE_X_POSITION;
			player.paddle.position.set(
				xPos,
				this.PADDLE_Y_POSITION,
				(index % 2) * this.PADDLE_Z_OFFSET - 1
			);
		});
	}

	private mapXToY(x: number): number {
		// H 계산
		const H =
			this.PADDLE_Y_POSITION -
			(this.TABLE_POSITION.y + this.TABLE_DIMENSIONS.height + this.BALL_RADIUS);

		// L 계산
		const L =
			(this.PADDLE_X_POSITION -
				this.PADDLE_DIMENSIONS.width / 2 -
				this.BALL_RADIUS) /
			1.5;

		// 패들의 Y좌표를 기준으로 보정
		const paddleY = this.PADDLE_Y_POSITION;

		// x값을 2L을 기준으로 대칭 변환
		const adjustedX = 2 * L - Math.abs(2 * L - x);

		// 포물선 식 y = -(H / 2L^2) * x(x - L) 적용
		const y = -(H / (2 * L * L)) * adjustedX * (adjustedX - L);

		// 실제 Y 좌표로 보정
		return paddleY + y;
	}

	public getControlInstructions(): string {
		let instructions = "";

		for (let i = 0; i < this.playerCount; i++) {
			const teamIndex = i < this.playerCount / 2 ? 0 : 1;
			const playerKeys = this.controlKeys[i + 1];
			const color =
				i % 2 === 0
					? `#${this.teams[teamIndex].color1.toString(16).padStart(6, "0")}`
					: `#${this.teams[teamIndex].color2.toString(16).padStart(6, "0")}`;

			instructions += `<span style="color:${color}">■</span> ${this.teams[teamIndex].name} [Left: ${playerKeys.moveLeft}, Right: ${playerKeys.moveRight}]<br>`;
		}

		return instructions;
	}

	private render(): void {
		const width = window.innerWidth;
		const height = window.innerHeight;

		this.renderer.setScissor(0, 0, width / 2, height);
		this.renderer.setViewport(0, 0, width / 2, height);
		this.renderer.render(this.scene, this.cameraA);

		this.renderer.setScissor(width / 2, 0, width / 2, height);
		this.renderer.setViewport(width / 2, 0, width / 2, height);
		this.renderer.render(this.scene, this.cameraB);
	}

	public getElement(): HTMLElement {
		return this.renderer.domElement;
	}

	public dispose(): void {
		this.stopAnimation();

		this.removeEventListeners();

		this.scene.traverse((object) => {
			if (object instanceof THREE.Mesh) {
				object.geometry.dispose();
				if (object.material instanceof THREE.Material) {
					object.material.dispose();
				} else if (Array.isArray(object.material)) {
					object.material.forEach((material) => material.dispose());
				}
			}
		});

		this.renderer.dispose();

		if (this.renderer.domElement.parentElement) {
			this.renderer.domElement.parentElement.removeChild(
				this.renderer.domElement
			);
		}
	}
}
