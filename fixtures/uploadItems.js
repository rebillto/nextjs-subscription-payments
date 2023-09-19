import fs from 'fs/promises';
import fetch from 'node-fetch';

const args = process.argv.slice(2);
const apiUrl = 'https://api.rebill.com/v2/item';
const API_KEY = args[0];
const successPaymentUrl = args[1];
const authHeader = 'Bearer ' + API_KEY;
const responsesFilePath = 'responses.json';

(async () => {
  const priceLinkExpiration = "2024-12-14T21:05:27.701Z";
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
            Authorization: authHeader,
          },
          body: JSON.stringify(item),
        });

        if (response.status === 201) {
          const responseBody = await response.json();

          for (const newPrice of responseBody.prices) {
            try {
              const priceLinkResponse = await fetch(
                `${apiUrl}/price/${newPrice.id}/settings`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: authHeader,
                  },
                  body: JSON.stringify({
                    "documentRequired": true,
                    "phoneRequired": true,
                    "billingAddressRequired": true,
                    "showImage": false,
                    "redirectUrl": successPaymentUrl,
                    "paymentMethods": [
                      "CARD"
                    ],
                    "expirationDate": priceLinkExpiration,
                    "priceId": newPrice.id
                  }),
                }
              );

              if (priceLinkResponse.status === 201) {
                console.log(`Price link created for item with ID: ${newPrice.id}`);
              } else {
                console.error(
                  `Error creating price link for item with ID: ${newPrice.id} ${newPrice.currency}`,
                  await priceLinkResponse.json()
                );
              }
            } catch (priceLinkError) {
              console.error('Error creating price link:', priceLinkError.message);
            }
          }

          successfulResponses.push(responseBody);
        }
      } catch (error) {
        console.error('Error uploading item:', error.message);
      }
    }

    if (successfulResponses.length > 0) {
      let existingResponses = [];
      try {
        const existingData = await fs.readFile(responsesFilePath, 'utf-8');
        existingResponses = JSON.parse(existingData);
      } catch (error) {
        // File doesn't exist or couldn't be parsed, that's okay
      }

      const combinedResponses = [...existingResponses, ...successfulResponses];

      await fs.writeFile(responsesFilePath, JSON.stringify(combinedResponses, null, 2));
      console.log('Successful Responses written to', responsesFilePath);
    } else {
      console.log('No successful responses to write.');
    }
  } catch (error) {
    console.error('Error reading JSON file:', error.message);
  }
})();