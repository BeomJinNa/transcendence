const path = require("path");

module.exports = {
	entry: "./src/index.ts", // 프로젝트의 진입점
	module: {
		rules: [
			{
				test: /\.ts$/, // .ts 확장자로 끝나는 파일을 처리
				use: "ts-loader",
				exclude: /node_modules/, // node_modules 디렉토리는 제외
			},
			{
				test: /\.css$/, // .css 확장자 파일을 처리
				use: ["style-loader", "css-loader"], // CSS 로더 및 스타일 로더 추가
			},
		],
	},
	resolve: {
		extensions: [".ts", ".js"], // 처리할 파일 확장자
	},
	output: {
		filename: "index.js", // 번들 파일 이름
		path: path.resolve(__dirname, "dist"), // 번들 파일이 생성될 경로
	},
};
