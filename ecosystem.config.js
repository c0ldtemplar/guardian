module.exports = {
  apps: [
    {
      name: "guardian-app",
      script: "npm",
      args: "start",
      port: 3002,
      env: {
        NODE_ENV: "production",
        PORT: 3002
      }
    }
  ]
};
