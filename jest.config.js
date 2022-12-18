module.exports = {
	
	transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    //transformIgnorePatterns: ['/node_modules/', 'global-setup\\.js$'],
    testRegex: ".+\\.test\\.tsx?$",
    testPathIgnorePatterns: ["/lib/", "/node_modules/"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    collectCoverage: true,
    //testEnvironment: 'node'
}
