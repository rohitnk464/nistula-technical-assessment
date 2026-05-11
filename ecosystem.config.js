module.exports = {
  apps: [{
    name: "nistula-backend",
    script: "./backend/server.js",
    instances: "max", // Utilize all available CPU cores
    exec_mode: "cluster", // Enable clustering for zero-downtime reloads
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
};
