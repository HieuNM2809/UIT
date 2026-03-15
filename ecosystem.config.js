module.exports = {
  apps: [
    {
      name: "studymate",
      script: "npm",
      args: "run dev",
      cwd: "/srv/UIT",
      env: {
        NODE_ENV: "development",
        PORT: 3000
      }
    }
  ]
};
