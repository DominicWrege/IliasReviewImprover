module.exports = {
	verbose: false,
	build: {
		overwriteDest: true,
	},
	ignoreFiles: [
		"package-lock.json",
		"yarn.lock",
		"**/*.sketch",
		"dist/main.js",
		"src/*.ts",
		"**/*.md",
		"**/*.txt",
		"package.json",
		"**/*config.js",
		"tsconfig.json",
	],
};
