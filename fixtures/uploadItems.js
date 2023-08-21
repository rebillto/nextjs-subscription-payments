const fs = require('fs/promises'); // Node.js built-in module for file operations
const path = require('path'); // Node.js built-in module for working with file paths

// Require node-fetch using a relative path
const fetch = require(path.join(__dirname, '..', 'node_modules', 'node-fetch'));

const apiUrl = 'https://api.rebill.dev/v2/item'; // Replace with your API endpoint URL
const responsesFilePath = 'responses.json'; // Path to store responses JSON file
const API_KEY = 'API_KEY_e6360079-7723-48dd-b2df-bc00cce48b2d';
const authHeader = 'Bearer ' + API_KEY;

(async () => {
  try {
    const jsonData = await fs.readFile('itemsToUpload.json', 'utf-8');
    const items = JSON.parse(jsonData);

    const successfulResponses = [];

    for (const item of items) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: authHeader
          },
          body: JSON.stringify(item)
        });

        if (response.status === 201) {
          const responseBody = await response.json();
          successfulResponses.push(responseBody); // Store successful response
          console.log('Item uploaded successfully:', item);
        }
        console.log(response);
      } catch (error) {
        console.error('Error uploading item:', error.message);
      }
    }

    // Write successfulResponses array to responses.json
    if (successfulResponses.length > 0) {
      // Read existing responses from responses.json (if it exists)
      let existingResponses = [];
      try {
        const existingData = await fs.readFile(responsesFilePath, 'utf-8');
        existingResponses = JSON.parse(existingData);
      } catch (error) {
        // File doesn't exist or couldn't be parsed, that's okay
      }

      // Combine existing and new successful responses
      const combinedResponses = [...existingResponses, ...successfulResponses];

      // Write combinedResponses array to responses.json
      await fs.writeFile(responsesFilePath, JSON.stringify(combinedResponses, null, 2));
      console.log('Successful Responses written to', responsesFilePath);
    } else {
      console.log('No successful responses to write.');
    }
  } catch (error) {
    console.error('Error reading JSON file:', error.message);
  }
})();