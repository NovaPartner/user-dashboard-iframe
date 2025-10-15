const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Дозволяємо CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Обробка preflight запиту
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const API_URL = 'https://script.google.com/macros/s/AKfycbyAoJDUyFRpRR-J1jbod2CVw4Z7xSf7ydq1OtXTwv5zXuj7Hms8vKTm39bl5wYWJUG3Sw/exec';
    
    // Отримуємо дані з запиту
    const requestData = JSON.parse(event.body);
    
    // Відправляємо запит до Google Apps Script
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });

    const data = await response.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};

