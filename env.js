export function loadEnv() {
    const requiredEnvVars = ['MATRIX_HOMESERVER', 'MATRIX_ACCESS_TOKEN', 'MATRIX_ROOM_ID'];
    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

    if (missingEnvVars.length > 0) {
        console.error("Error: Missing required environment variables:", missingEnvVars.join(", "));
        process.exit(1);
    }

    return{
        homeserver: process.env.MATRIX_HOMESERVER,
        accessToken: process.env.MATRIX_ACCESS_TOKEN,
        roomId: process.env.MATRIX_ROOM_ID
    }
}