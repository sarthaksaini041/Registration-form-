// ==============================================================================
// GOOGLE APPS SCRIPT FOR ONLINE WORKSHOP REGISTRATION
// ==============================================================================
// 
// HOW TO DEPLOY:
// 1. Go to Google Sheets, create a new spreadsheet for responses.
// 2. Format columns as: Timestamp | Name | Email | Phone | University | Year | Course | Transaction ID | Image URL
// 3. In the top menu, go to: Extensions > Apps Script.
// 4. Delete existing code and paste this ENTIRE block.
// 5. Click Save (Ctrl+S / Cmd+S).
// 6. Click on "Deploy" > "New deployment" in the top right.
// 7. Select type: "Web app" (click the gear icon to add if not visible).
// 8. Set Description: "Registration Form v1".
// 9. Execute as: "Me".
// 10. Who has access: "Anyone". (CRITICAL)
// 11. Click "Deploy". Authorize any necessary Google Drive/Sheets permissions.
// 12. Copy the "Web app URL" and paste it in your frontend `script.js` file.
// ==============================================================================

function doPost(e) {
  try {
    // Get the active sheet
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getActiveSheet();
    
    // Parse incoming JSON payload from frontend
    var data = JSON.parse(e.postData.contents);
    var imageUrl = "No Image Provided";
    
    // Process image file upload (Base64)
    if (data.image) {
      // Isolate base64 hash from the data URI scheme
      var base64Data = data.image.split(',')[1];
      var decode = Utilities.base64Decode(base64Data);
      
      // Clean up the name for the file and configure blob
      var filename = data.name.replace(/\s+/g, '_') + '_Payment_' + new Date().getTime();
      var blob = Utilities.newBlob(decode, data.imageMimeType, filename);
      
      // Look for/create the designated payment proofs folder in Google Drive
      var folderName = "Workshop_Payments";
      var folders = DriveApp.getFoldersByName(folderName);
      var folder;
      
      if (folders.hasNext()) {
        folder = folders.next();
      } else {
        folder = DriveApp.createFolder(folderName);
      }
      
      // Add the file to the active folder
      var file = folder.createFile(blob);
      
      // Grant wide view access so it can be easily clicked in Google Sheets and viewed
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      imageUrl = file.getUrl();
    }
    
    // Log row data sequentially
    sheet.appendRow([
      new Date(),
      data.name,
      data.email,
      data.phone,
      data.university,
      data.year,
      data.course,
      data.transactionId,
      imageUrl
    ]);
    
    // Output success result
    var response = { "result": "success", "message": "Records logged successfully" };
    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(error) {
    // Handle error result gracefully
    var errResponse = { "result": "error", "error": error.toString() };
    return ContentService.createTextOutput(JSON.stringify(errResponse))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doOptions(e) {
  // CORS configuration options if requested
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  // Helpful debugging output when clicking Web App URL natively
  return ContentService.createTextOutput("Testing GET request. The Cyber Security Web App is running correctly!");
}
