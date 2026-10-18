// PM2 process definition for the API.
// Used by deploy/deploy.sh via `pm2 startOrReload`, so the process always runs
// with the settings of the commit that was just deployed.
const path = require('path');

module.exports = {
  apps: [
    {
      name: 'vedessa-backend',
      script: 'src/server.js',
      cwd: path.join(__dirname, '..', 'backend'), // dotenv reads backend/.env from here
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      min_uptime: '10s',
      max_restarts: 10,
      exp_backoff_restart_delay: 100,
      kill_timeout: 5000,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
