In order to get gpt-4 access, you must first generate $5 in charges for the OpenAI API. Below is sample code which will generate the necessary requests.

Option 1: `openai.js` - Hits Azure OpenAI on loop

To run, `node --env-file=.env openai.js`

Option 2: `helicone` - Hits Helicone + Azure OpenAI on loop

To run, `node --env-file=.env helicone.js`

Option 2 is recommended as progress can be monitored from the Helicone Dashboard.

Additionally, if using Azure OpenAI, go into the Azure AI Studio and create deployments for necessary models.
