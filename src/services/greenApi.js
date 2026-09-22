const API_URL = 'https://api.green-api.com';

class GreenApiService {
  constructor(idInstance, apiTokenInstance) {
    this.idInstance = idInstance;
    this.apiTokenInstance = apiTokenInstance;
    // Для MAX используется waInstance (WhatsApp-совместимый API)
    this.baseUrl = `${API_URL}/waInstance${idInstance}`;
  }

  // Отправка текстового сообщения
  async sendMessage(chatId, message) {
    try {
      const response = await fetch(
        `${this.baseUrl}/sendMessage/${this.apiTokenInstance}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chatId: chatId,
            message: message,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
      throw error;
    }
  }

  // Получение уведомления (сообщения)
  async receiveNotification() {
    try {
      const response = await fetch(
        `${this.baseUrl}/receiveNotification/${this.apiTokenInstance}`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Ошибка получения уведомления:', error);
      throw error;
    }
  }

  // Удаление уведомления после обработки
  async deleteNotification(receiptId) {
    try {
      const response = await fetch(
        `${this.baseUrl}/deleteNotification/${this.apiTokenInstance}/${receiptId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Ошибка удаления уведомления:', error);
      throw error;
    }
  }

  // Проверка состояния аккаунта
  async getStateInstance() {
    try {
      const response = await fetch(
        `${this.baseUrl}/getStateInstance/${this.apiTokenInstance}`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Ошибка проверки состояния:', error);
      throw error;
    }
  }
}

export default GreenApiService;
