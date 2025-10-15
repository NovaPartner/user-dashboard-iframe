function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const operationName = data.operationName;
    
    if (operationName === 'get_driver_info')
      return getDriverInfo(data.driverId);
    
    if (operationName === 'post_driver_info')
      return postDriverInfo(data.driverData);
    
    if (operationName === 'create_driver')
      return createNewDriver(data.driverData);
    
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

function createNewDriver(driverData) {
  if (!driverData)
    return ContentService.createTextOutput(JSON.stringify({
      error: 'Brak danych kierowcy'
    })).setMimeType(ContentService.MimeType.JSON);
  
  if (!driverData.driver_identifier || !driverData.full_name)
    return ContentService.createTextOutput(JSON.stringify({
      error: 'ID i imię kierowcy są wymagane'
    })).setMimeType(ContentService.MimeType.JSON);
  
  const spreadsheet = SpreadsheetApp.openById('1GfjZY4o-J_ocHUkd2Lj7_mq6OcLMmk6yt7g9gBMwYak');
  const sheet = spreadsheet.getSheetByName('Drivers') || spreadsheet.getSheetByName('Sheet1');
  
  if (!sheet)
    return ContentService.createTextOutput(JSON.stringify({
      error: 'Arkusz Drivers не знайдено'
    })).setMimeType(ContentService.MimeType.JSON);
  
  const existingDriver = Chatbot.getDriverByIdentifier(driverData.driver_identifier);
  if (existingDriver)
    return ContentService.createTextOutput(JSON.stringify({
      error: 'Kierowca z takim ID już istnieje'
    })).setMimeType(ContentService.MimeType.JSON);
  
  const rowData = [
    driverData.driver_identifier || '',
    driverData.full_name || '',
    driverData.phone_number || '',
    driverData.city || '',
    driverData.email || '',
    0,
    new Date()
  ];
  
  sheet.appendRow(rowData);
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'Kierowca został pomyślnie dodany',
    driver_id: driverData.driver_identifier
  })).setMimeType(ContentService.MimeType.JSON);
}

