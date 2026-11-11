module.exports = {
  apps: [
    {
      name: 'smart-waste-app',
      script: '/home/mrj/.local/bin/node',
      args: 'node_modules/next/dist/bin/next start --port 3100',
      cwd: '/home/mrj/smart-waste-management/frontend-web',
      interpreter: 'none',
      env: {
        NODE_ENV: 'production',
        NEXT_PUBLIC_API_URL: '',
        NEXT_API_PROXY_ORIGIN: 'http://127.0.0.1:8000'
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
