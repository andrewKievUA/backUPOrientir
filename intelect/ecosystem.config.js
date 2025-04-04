module.exports = {
    apps: [
        {
            name: "photoServerX4",
            script: "photoServer.js",
            instances: 4, // Можно поставить 8, если сервер не сильно загружает CPU
            exec_mode: "cluster",
            watch: true,
            max_memory_restart: "500M"
        }
    ]
};
