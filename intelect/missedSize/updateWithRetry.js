async function updateWithRetry(connection, info, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        await updateMysql(connection, info);
        return; // Если операция успешна, выходим из функции
      } catch (error) {
        if (error.code === 'ER_LOCK_DEADLOCK') {
          console.warn(`Deadlock encountered. Retrying... (${i + 1}/${retries})`);
          await new Promise(resolve => setTimeout(resolve, 100)); // Задержка перед повтором
        } else {
          throw error; // Если это не deadlock, выбрасываем ошибку
        }
      }
    }
    throw new Error('Max retries reached. Could not complete the operation.');
  }
  