module.exports = {
	verbose: true,
	build: {
		overwriteDest: true,
	},
	ignoreFiles: [
		"package-lock.json",
		"yarn.lock",
		"**/*.sketch",
		"**/*.md",
		"**/*.txt",
		"package.json",
		"**/*config.js",
		"tsconfig.json"
	],
};
