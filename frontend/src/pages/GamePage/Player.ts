import * as THREE from "three";

export class Player {
	paddle: THREE.Mesh;
	controlKeys: { moveLeft: string; moveRight: string };

	constructor(
		paddle: THREE.Mesh,
		controlKeys: { moveLeft: string; moveRight: string }
	) {
		this.paddle = paddle;
		this.controlKeys = controlKeys;
	}

	static getControlKeys(): {
		[playerId: number]: { moveLeft: string; moveRight: string };
	} {
		return {
			1: { moveLeft: "a", moveRight: "s" },
			2: { moveLeft: "f", moveRight: "g" },
			3: { moveLeft: "j", moveRight: "k" },
			4: { moveLeft: ";", moveRight: "'" },
		};
	}

	movePaddle(
		directionMultiplier: number,
		moveDistance: number,
		playAreaDepth: number,
		keyState: { [key: string]: boolean }
	): void {
		const minZ = -playAreaDepth / 2;
		const maxZ = playAreaDepth / 2;

		if (keyState[this.controlKeys.moveLeft]) {
			const newZ = this.paddle.position.z - moveDistance * directionMultiplier;
			this.paddle.position.z = Math.max(Math.min(newZ, maxZ), minZ);
		}
		if (keyState[this.controlKeys.moveRight]) {
			const newZ = this.paddle.position.z + moveDistance * directionMultiplier;
			this.paddle.position.z = Math.max(Math.min(newZ, maxZ), minZ);
		}
	}
}
