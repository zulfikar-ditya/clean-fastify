import { AppConfig } from "config/app.config";
import { createAppInstance } from "./app";

const app = createAppInstance();
app.listen({ port: AppConfig.APP_PORT }, (err, address) => {
	if (err) {
		console.error("Error starting server:", err);
		app.log.error(err);
		process.exit(1);
	}

	console.log(`Server listening at ${address}`);
});
