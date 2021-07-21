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
		"config.js",
		"manifest.v3.json",
	],
};
