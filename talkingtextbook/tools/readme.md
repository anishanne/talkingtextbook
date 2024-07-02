In order to get gpt-4 access, you must first generate $5 in charges for the OpenAI API. Below is sample code which will generate the necessary requests.

Option 1: `openaiLoop` - Hits Azure OpenAI on loop

To run, `node --env-file=.env openaiLoop.js`

Option 2: `openai_helicone` - Hits Helicone + Azure OpenAI on loop

To run, `node --env-file=.env openai_helicone.js`

Option 2 is recommended as progress can be monitored from the Helicone Dashboard.
