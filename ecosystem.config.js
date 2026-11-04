module.exports = {
  apps: [
    {
      name: 'smart-waste-app',
      script: 'pnpm',
      args: 'start --port 3100',
      cwd: '/home/mrj/smart-waste-management/frontend-web',
      env: {
        NODE_ENV: 'production',
        NEXT_PUBLIC_API_URL: ''
      }
    }
  ]
};
