import { spawn } from "node:child_process";

const scripts = [
	"node_modules/@db-ux/db-theme/build/scripts/index.js",
	"node_modules/@db-ux/db-theme-fonts/build/scripts/index.js",
	"node_modules/@db-ux/db-theme-icons/build/scripts/index.js",
	"node_modules/@db-ux/db-theme-illustrative-icons/build/scripts/index.js",
];

function decodeDbThemeAssets() {
	const processes = scripts.map((script) =>
		spawn("node", [script], { stdio: "inherit", shell: false }),
	);

	return Promise.all(
		processes.map(
			(child, index) =>
				new Promise((resolve, reject) => {
					child.on("close", (code) => {
						if (code === 0) {
							resolve(code);
						} else {
							reject(
								new Error(
									`Script "${scripts[index]}" exited with code ${code}`,
								),
							);
						}
					});
					child.on("error", reject);
				}),
		),
	);
}

decodeDbThemeAssets().catch((err) => {
	console.error(err.message);
	process.exit(1);
});

