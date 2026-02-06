// Environment configuration
const ENV = {
	development: {
		API_URL: "http://localhost:5000/api/v1",
		SOCKET_URL: "http://localhost:5000",
	},
	staging: {
		API_URL: "https://staging-api.example.com/api/v1",
		SOCKET_URL: "https://staging-api.example.com",
	},
	production: {
		API_URL: "https://api.example.com/api/v1",
		SOCKET_URL: "https://api.example.com",
	},
};

const getEnvVars = () => {
	// You can use __DEV__ or process.env.NODE_ENV to determine the environment
	if (__DEV__) {
		return ENV.development;
	}
	return ENV.production;
};

export const Config = getEnvVars();

export default Config;
