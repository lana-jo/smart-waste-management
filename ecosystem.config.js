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
    },
    {
      name: 'smart-waste-backend',
      script: '/home/mrj/smart-waste-management/backend/.venv/bin/python3',
      args: '-m uvicorn app.main:app --host 127.0.0.1 --port 8000',
      cwd: '/home/mrj/smart-waste-management/backend',
      interpreter: 'none',
      env: {
        PYTHONUNBUFFERED: '1'
      }
    }
  ]
};
