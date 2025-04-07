module.exports = {
    apps: [
      {
        name: 'react-app',
        script: 'npx',
        args: 'serve -s build -p 3003',
        env: {
          NODE_ENV: 'production',
        },
      },
    ],
  };