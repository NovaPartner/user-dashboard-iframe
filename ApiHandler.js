function doGet(e) {
  // Якщо це API запит (action=getData)
  if (e.parameter.action === 'getData') {
    const driverId = e.parameter.driverId;
    
    if (!driverId) {
      return ContentService.createTextOutput(JSON.stringify({
        error: 'Brak ID kierowcy'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const driverData = Chatbot.getDriverByIdentifier(driverId);
    
    if (!driverData) {
      return ContentService.createTextOutput(JSON.stringify({
        driver_identifier: '',
        full_name: 'Nie znaleziono',
        balance: 0,
        city: '',
        phone_number: ''
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify(driverData))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // Якщо це звичайний запит для HTML
  const template = HtmlService.createTemplateFromFile('Login');
  const userId = e.parameter.driverid || e.parameter.id || '';
  
  // Перевіряємо кеш
  const cache = CacheService.getScriptCache();
  const cacheKey = `driver_${userId}`;
  let userData = JSON.parse(cache.get(cacheKey) || 'null');
  
  if (!userData) {
    // Якщо немає в кеші - завантажуємо з бази
    const usersData = Chatbot.getDriverByIdentifier(userId);
    userData = usersData || {
      fullName: 'Користувача не знайдено в базі',
      salary: '0.00',
      debts: '0.00',
      phone: '',
      city: ''
    };
    
    // Зберігаємо в кеш на 5 хвилин
    cache.put(cacheKey, JSON.stringify(userData), 300);
  }

  template.userId = userId;
  template.fullName = userData.full_name;
  template.salary = userData.balance;
  template.city = userData.city;
  template.phone = userData.phone_number;
  template.driverId = userId;

  return template.evaluate()
    .setTitle('Panel Osobisty')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const operationName = data.operationName;
    
    if (operationName === 'get_driver_info')
      return getDriverInfo(data.driverId);
    
    if (operationName === 'post_driver_info')
      return postDriverInfo(data.driverData);
    
    return ContentService.createTextOutput(JSON.stringify({
      error: 'Невідома операція'
    })).setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      error: 'Błąd serwera: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getDriverInfo(driverId) {
  if (!driverId) {
    return ContentService.createTextOutput(JSON.stringify({
      error: 'Brak ID kierowcy'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  const driverData = Chatbot.getDriverByIdentifier(driverId);
  
  if (!driverData) {
    return ContentService.createTextOutput(JSON.stringify({
      driver_identifier: '',
      full_name: 'Nie znaleziono',
      balance: 0,
      city: '',
      phone_number: ''
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput(JSON.stringify(driverData))
    .setMimeType(ContentService.MimeType.JSON);
}

function postDriverInfo(driverData) {
  if (!driverData) {
    return ContentService.createTextOutput(JSON.stringify({
      error: 'Brak danych kierowcy'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  const spreadsheet = SpreadsheetApp.openById('1GfjZY4o-J_ocHUkd2Lj7_mq6OcLMmk6yt7g9gBMwYak');
  const sheet = spreadsheet.getSheetByName('Sheet2');
  
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({
      error: 'Sheet2 не знайдено'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  const rowData = [
    new Date(),
    driverData.driver_identifier || '',
    driverData.full_name || '',
    driverData.balance || 0,
    driverData.city || '',
    driverData.phone_number || '',
    driverData.email || '',
    driverData.driver_id || '',
    driverData.driver_bolt_name || ''
  ];
  
  sheet.appendRow(rowData);
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'Wniosek został przyjęty'
  })).setMimeType(ContentService.MimeType.JSON);
}

function getDriverData(driverId) {
  const driverData = Chatbot.getDriverByIdentifier(driverId);
  
  if (!driverData)
    return {
      driver_identifier: '',
      full_name: 'Nie znaleziono',
      balance: 0,
      city: '',
      phone_number: ''
    };
  
  return driverData;
}


