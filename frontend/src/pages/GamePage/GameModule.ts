import * as THREE from "three";
import { Player } from "./Player";

export default class GameModule {
	// 카메라 관련 상수
	private readonly CAMERA_FOV = 70;
	private readonly CAMERA_NEAR = 0.1;
	private readonly CAMERA_FAR = 1000;
	private readonly CAMERA_A_POSITION = new THREE.Vector3(-17, 0.9, 0);
	private readonly CAMERA_B_POSITION = new THREE.Vector3(17, 0.9, 0);
	private readonly CAMERA_LOOK_AT = new THREE.Vector3(0, 0, 0);

	// 테이블 관련 상수
	private readonly TABLE_COLOR = 0x004400;
	private readonly TABLE_DIMENSIONS = { width: 18, height: 0.3, depth: 10 };
	private readonly TABLE_POSITION = new THREE.Vector3(0, -3, 0);

	// 패들 관련 상수
	private readonly PADDLE_DIMENSIONS = { width: 0.1, height: 0.4, depth: 1.5 };
	private readonly PADDLE_OPACITY = 0.6;
	private readonly PADDLE_X_OFFSET = 5;
	private readonly PADDLE_Y_POSITION = -1;
	private readonly PADDLE_Z_OFFSET = 2;
	private readonly PADDLE_MOVE_DISTANCE = 0.78;
	private readonly PADDLE_COLORS = [
		[0x0000ff, 0x6666ff], // 팀 A의 색상
		[0xff0000, 0xff6666], // 팀 B의 색상
	];
	private readonly PADDLE_X_POSITION =
		this.CAMERA_B_POSITION.x - this.PADDLE_X_OFFSET; // 패들의 X 좌표 위치

	// 공 관련 상수
	private readonly BALL_COLOR = 0xff00ff;
	private readonly BALL_RADIUS = 0.08;
	private readonly BALL_SEGMENTS = 32;
	private readonly BALL_INITIAL_VELOCITY = new THREE.Vector3(0.14, 0, 0);

	// 조명 관련 상수
	private readonly LIGHT_INTENSITY = 5.5;
	private readonly LIGHT_DISTANCE = 100;
	private readonly LIGHT_POSITION = new THREE.Vector3(0, 30, 0);
	private readonly AMBIENT_LIGHT_INTENSITY = 0x404040;

	// 플레이 구역 설정
	private readonly FLOOR_Y_POSITION = -5; // 바닥의 Y 좌표를 상수로 정의
	private readonly PLAY_AREA = {
		width: (this.PADDLE_X_POSITION + 2) * 2,
		depth: this.TABLE_DIMENSIONS.depth + 1,
	};

	// Class properties
	private animationFrameId: number | null = null;
	private players: Player[] = [];
	private scene: THREE.Scene;
	private cameraA: THREE.PerspectiveCamera;
	private cameraB: THREE.PerspectiveCamera;
	private renderer: THREE.WebGLRenderer;
	private ball: THREE.Mesh | undefined;
	private ballVelocity: THREE.Vector3;
	private controlKeys: ReturnType<typeof Player.getControlKeys>;
	private playerCount: number;
	private scoreCallback: ((scoreA: number, scoreB: number) => void) | null =
		null;
	private scoreA = 0;
	private scoreB = 0;
	private keyState: { [key: string]: boolean } = {};

	constructor(playerCount: number) {
		this.playerCount = playerCount;
		this.controlKeys = Player.getControlKeys();

		this.scene = new THREE.Scene();

		// 카메라 A: A팀 시점
		this.cameraA = new THREE.PerspectiveCamera(
			this.CAMERA_FOV,
			window.innerWidth / window.innerHeight,
			this.CAMERA_NEAR,
			this.CAMERA_FAR
		);
		this.cameraA.position.copy(this.CAMERA_A_POSITION);
		this.cameraA.lookAt(this.CAMERA_LOOK_AT);

		// 카메라 B: B팀 시점
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
		this.renderer.shadowMap.enabled = true; // 그림자 활성화
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 부드러운 그림자

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
		const lightDistance = 500; // 광원의 거리를 크게 설정
		const lightPositions = [
			new THREE.Vector3(-50, 100, -50), // 왼쪽 앞
			new THREE.Vector3(50, 100, -50), // 오른쪽 앞
			new THREE.Vector3(-50, 100, 50), // 왼쪽 뒤
			new THREE.Vector3(50, 100, 50), // 오른쪽 뒤
		];

		lightPositions.forEach((position) => {
			const light = new THREE.PointLight(0xffffff, 1.5, lightDistance);
			light.position.copy(position);
			light.castShadow = true; // 광원이 그림자를 드리우게 설정
			light.shadow.mapSize.width = 2048; // 그림자 해상도 설정
			light.shadow.mapSize.height = 2048;
			light.shadow.camera.near = 0.5;
			light.shadow.camera.far = 500;
			this.scene.add(light);
		});

		const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
		this.scene.add(ambientLight);
	}

	private setupEnvironment(): void {
		// 바닥 추가
		const floorGeometry = new THREE.PlaneGeometry(100, 100);
		const floorMaterial = new THREE.MeshStandardMaterial({
			color: 0x050505, // 어두운 색상으로 바닥 설정
			roughness: 1.0,
		});
		const floor = new THREE.Mesh(floorGeometry, floorMaterial);
		floor.rotation.x = -Math.PI / 2; // 바닥이 수평으로 놓이도록 회전
		floor.position.y = this.FLOOR_Y_POSITION; // 바닥 높이 설정
		floor.receiveShadow = true; // 바닥이 그림자를 받게 설정
		this.scene.add(floor);

		// 배경 벽 추가
		const wallGeometry = new THREE.PlaneGeometry(100, 50);
		const wallMaterial = new THREE.MeshStandardMaterial({
			color: 0x111111, // 어두운 색상으로 벽 설정
			roughness: 1.0,
		});

		// 벽 1 - 탁구대 뒤쪽
		const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
		backWall.position.set(0, 25, -50); // 탁구대 뒤쪽에 배치
		backWall.receiveShadow = true; // 벽이 그림자를 받게 설정
		this.scene.add(backWall);

		// 벽 2 - 탁구대 왼쪽
		const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
		leftWall.position.set(-50, 25, 0);
		leftWall.rotation.y = Math.PI / 2; // 왼쪽으로 90도 회전
		leftWall.receiveShadow = true; // 벽이 그림자를 받게 설정
		this.scene.add(leftWall);

		// 벽 3 - 탁구대 오른쪽
		const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
		rightWall.position.set(50, 25, 0);
		rightWall.rotation.y = -Math.PI / 2; // 오른쪽으로 90도 회전
		rightWall.receiveShadow = true; // 벽이 그림자를 받게 설정
		this.scene.add(rightWall);

		// 벽 4 - 탁구대 앞쪽
		const frontWall = new THREE.Mesh(wallGeometry, wallMaterial);
		frontWall.position.set(0, 25, 50);
		frontWall.rotation.y = Math.PI; // 180도 회전
		frontWall.receiveShadow = true; // 벽이 그림자를 받게 설정
		this.scene.add(frontWall);
	}

	private setupTable(): void {
		// 테이블 표면 텍스처 추가
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
		table.castShadow = true; // 테이블이 그림자를 드리우게 설정
		this.scene.add(table);

		// 탁구대 다리 추가
		const legHeight =
			this.TABLE_POSITION.y -
			this.FLOOR_Y_POSITION -
			this.TABLE_DIMENSIONS.height / 2;
		const legGeometry = new THREE.BoxGeometry(
			this.TABLE_DIMENSIONS.width * 0.05, // 다리의 너비
			legHeight, // 다리의 높이
			this.TABLE_DIMENSIONS.depth * 0.05 // 다리의 깊이
		);
		const legMaterial = new THREE.MeshStandardMaterial({
			color: 0x333333, // 다리의 색상 (어두운 색)
			roughness: 1.0,
		});

		// 다리 위치 설정
		const positions = [
			new THREE.Vector3(
				this.TABLE_DIMENSIONS.width / 2 - legGeometry.parameters.width / 2,
				this.FLOOR_Y_POSITION + legHeight / 2, // 바닥에 맞게 위치 조정
				this.TABLE_DIMENSIONS.depth / 2 - legGeometry.parameters.depth / 2
			), // 앞 왼쪽
			new THREE.Vector3(
				this.TABLE_DIMENSIONS.width / 2 - legGeometry.parameters.width / 2,
				this.FLOOR_Y_POSITION + legHeight / 2, // 바닥에 맞게 위치 조정
				-this.TABLE_DIMENSIONS.depth / 2 + legGeometry.parameters.depth / 2
			), // 뒤 왼쪽
			new THREE.Vector3(
				-this.TABLE_DIMENSIONS.width / 2 + legGeometry.parameters.width / 2,
				this.FLOOR_Y_POSITION + legHeight / 2, // 바닥에 맞게 위치 조정
				this.TABLE_DIMENSIONS.depth / 2 - legGeometry.parameters.depth / 2
			), // 앞 오른쪽
			new THREE.Vector3(
				-this.TABLE_DIMENSIONS.width / 2 + legGeometry.parameters.width / 2,
				this.FLOOR_Y_POSITION + legHeight / 2, // 바닥에 맞게 위치 조정
				-this.TABLE_DIMENSIONS.depth / 2 + legGeometry.parameters.depth / 2
			), // 뒤 오른쪽
		];

		// 다리 생성 및 추가
		positions.forEach((position) => {
			const leg = new THREE.Mesh(legGeometry, legMaterial);
			leg.position.copy(position);
			leg.castShadow = true; // 다리가 그림자를 드리우게 설정
			this.scene.add(leg);
		});

		// 가름망 추가
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
		net.castShadow = true; // 가름망도 그림자를 드리우게 설정
		this.scene.add(net);
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
				color: this.PADDLE_COLORS[teamIndex][i % 2],
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

			// Player 클래스의 인스턴스를 생성하고 관리
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
			console.log("Animation loop stopped.");
		}
	}

	private playGame(): void {
		this.movePaddles(); // 패들 이동 처리
		this.moveBall(); // 공 이동 처리
		this.checkCollisions(); // 충돌 체크 및 처리

		// 득점 발생 시 라운드 리셋
		if (this.isGoalScored()) {
			this.resetRound();
		}

		this.render(); // 화면 렌더링
	}

	private movePaddles(): void {
		this.players.forEach((player, index) => {
			const teamIndex = index < this.playerCount / 2 ? 0 : 1;
			const directionMultiplier = teamIndex === 0 ? 1 : -1;

			// 각 플레이어의 패들을 이동
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
			// X축을 따라 공을 이동
			this.ball.position.add(this.ballVelocity);

			// 진행 방향에 따라 기준점을 설정하고 진행 거리를 계산
			let progressX = 0;

			if (this.ballVelocity.x > 0) {
				// 팀 A -> 팀 B 방향
				const startX =
					-this.PADDLE_X_POSITION +
					this.BALL_RADIUS +
					this.PADDLE_DIMENSIONS.width / 2;
				progressX = this.ball.position.x - startX;
			} else {
				// 팀 B -> 팀 A 방향
				const startX =
					this.PADDLE_X_POSITION -
					this.BALL_RADIUS -
					this.PADDLE_DIMENSIONS.width / 2;
				progressX = startX - this.ball.position.x;
			}

			// 공의 y좌표를 진행 거리에 따라 매핑된 값으로 설정
			this.ball.position.y = this.mapXToY(progressX);

			// 벽 충돌 및 득점 체크
			this.handleWallCollisions();
		}
	}

	private checkCollisions(): void {
		if (this.ball) {
			const ballX = this.ball.position.x;
			const ballZ = this.ball.position.z;

			this.players.forEach((player) => {
				const paddle = player.paddle; // 각 플레이어의 패들 가져오기
				const paddleX = paddle.position.x;
				const paddleZ = paddle.position.z;

				// 패들의 범위 내에서 x축 충돌 여부 확인
				const paddleMinX =
					paddleX - this.BALL_RADIUS / 2 - this.PADDLE_DIMENSIONS.width / 2;
				const paddleMaxX =
					paddleX + this.BALL_RADIUS / 2 + this.PADDLE_DIMENSIONS.width / 2;

				if (ballX >= paddleMinX && ballX <= paddleMaxX) {
					// x축 충돌이 발생한 경우, z축 충돌 여부 확인
					const paddleMinZ = paddleZ - this.PADDLE_DIMENSIONS.depth / 2;
					const paddleMaxZ = paddleZ + this.PADDLE_DIMENSIONS.depth / 2;

					if (ballZ >= paddleMinZ && ballZ <= paddleMaxZ) {
						// 공이 패들의 범위 내에 들어온 경우 충돌 처리
						this.handlePaddleCollision(paddle);
					}
				}
			});

			// 골이 발생했는지 체크하고 득점 처리
			this.handleGoalScoring();
		}
	}

	private handleWallCollisions(): void {
		if (this.ball) {
			// 공이 좌우 경계(옆면) 또는 상하 경계(테이블 끝)에 도달했는지 확인
			if (
				Math.abs(this.ball.position.z) > this.PLAY_AREA.depth / 2 || // 옆면에 도달
				Math.abs(this.ball.position.x) > this.PLAY_AREA.width / 2 // 테이블 끝에 도달
			) {
				// 플레이 구역을 벗어나면 득점 처리 및 라운드 리셋
				if (this.ball.position.x > this.PLAY_AREA.width / 2) {
					this.updateScore("A"); // B팀의 골대에 공이 들어갔으므로 A팀 득점
				} else if (this.ball.position.x < -this.PLAY_AREA.width / 2) {
					this.updateScore("B"); // A팀의 골대에 공이 들어갔으므로 B팀 득점
				}
			}
		}
	}

	private handlePaddleCollision(paddle: THREE.Mesh): void {
		if (this.ball) {
			const targetX = -paddle.position.x; // 상대편 방향
			const targetZ =
				Math.random() * this.TABLE_DIMENSIONS.depth -
				this.TABLE_DIMENSIONS.depth / 2;

			// 패들 위치로 도달할 때의 y축 높이를 맵핑 함수로 계산
			const targetY = this.mapXToY(targetX);

			// 목표 지점으로 향하는 방향 벡터 계산
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

			// 공이 플레이 영역을 벗어나면 득점 처리
			if (ballPositionX > boundaryX) {
				// A팀 득점
				this.updateScore("A");
			} else if (ballPositionX < -boundaryX) {
				// B팀 득점
				this.updateScore("B");
			}
		}
	}

	private updateScore(team: "A" | "B"): void {
		if (team === "A") {
			this.scoreA++;
		} else {
			this.scoreB++;
		}

		if (this.scoreCallback) {
			this.scoreCallback(this.scoreA, this.scoreB);
		}
	}

	private isGoalScored(): boolean {
		if (this.ball) {
			// 공이 플레이 가능 구역을 벗어났는지 체크하여 득점을 확인
			return Math.abs(this.ball.position.x) > this.PLAY_AREA.width / 2;
		}
		return false;
	}

	private resetRound(): void {
		// 공의 위치 초기화
		if (this.ball) {
			this.ball.position.set(0, this.mapXToY(0), 0); // 공의 초기 위치를 맵핑된 y로 설정

			// x축 속도의 방향을 랜덤하게 결정 (A팀 방향 또는 B팀 방향)
			const randomDirection = Math.random() < 0.5 ? -1 : 1;

			this.ballVelocity.set(0.1 * randomDirection, 0, 0); // 공의 초기 속도를 설정
		}

		// 패들 위치 초기화
		this.players.forEach((player, index: number) => {
			// index의 타입 명시
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

	// 맵핑 함수: X좌표에 따라 Y좌표를 계산
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

		// 팀 A (플레이어 1, 2)
		for (let i = 0; i < this.playerCount; i++) {
			const teamIndex = i < this.playerCount / 2 ? 0 : 1; // 팀 A 또는 B를 선택
			const playerKeys = this.controlKeys[i + 1];
			const color = `#${this.PADDLE_COLORS[teamIndex][i % 2].toString(16).padStart(6, "0")}`;

			instructions += `<span style="color:${color}">■</span> : [Left: ${playerKeys.moveLeft}, Right: ${playerKeys.moveRight}]<br>`;
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
}
