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
		if (keyState[this.controlKeys.moveLeft]) {
			this.paddle.position.z = Math.max(
				this.paddle.position.z - moveDistance * directionMultiplier,
				-playAreaDepth / 2
			);
		}
		if (keyState[this.controlKeys.moveRight]) {
			this.paddle.position.z = Math.min(
				this.paddle.position.z + moveDistance * directionMultiplier,
				playAreaDepth / 2
			);
		}
	}
}
