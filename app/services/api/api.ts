/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://docs.infinite.red/ignite-cli/boilerplate/app/services/Services.md)
 * documentation for more details.
 */
import { ApiResponse, ApisauceInstance, create } from "apisauce"
import Config from "../../config"
import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem"
import type { ApiConfig, ApiFeedResponse } from "./api.types"

/**
 * Configuring the apisauce instance.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 100000,
  apiKey: Config.API_KEY,
  apiVersion: Config.API_VERSION,
  model: Config.MODEL
}

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class Api {
  apisauce: ApisauceInstance
  config: ApiConfig

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: `${this.config.url}/${this.config.model}`,
      timeout: this.config.timeout,
      params: {
        "api-version": config.apiVersion,
      },
      headers: {
        "api-key": config.apiKey,
        Accept: "application/json",
      },
    })
  }

  async makeThreeJsGame(
    text: string,
  ): Promise<{  html: string, content: string , kind: "ok" } | GeneralApiProblem> {
    console.log("makeThreeJsGame", text)
    // make the api call
    const messages = [
      {
        role: "system",
        content: 
`you are the best software engineer that exist, base on user request create a html.
response example:
\`\`\`html
<!doctype html>
<html>
  <head>
    <title>This is the title of the webpage!</title>
  </head>
  <body>
    <p>This is an example paragraph. Anything in the <strong>body</strong> tag will appear on the page, just like this <strong>p</strong> tag and its contents.</p>
  </body>
</html>
\`\`\``
      },
      {
        role: "user",
        content: text,
      }
    ]

    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.post(
      `chat/completions`,
      {
        messages: messages,
        temperature: 0.6,
        max_tokens: 800,
        top_p: 0.95,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: null,
      },
    )

    console.log("response", response)
    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const rawData = (response.data as any).choices[0].message.content
      console.log(rawData)
      let htmlStr = ""

      // This is where we transform the data into the shape we expect for our MST model.
      const htmlMatch = rawData.match(/```html([\s\S]*?)```/);
      if (htmlMatch && htmlMatch[1]) {
          htmlStr = htmlMatch[1].trim();
          console.log(htmlStr);
      } else {
          console.log("No HTML code block found.");
      }

      return { kind: "ok", html: htmlStr, content: rawData }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      console.log(response.data)
      return { kind: "bad-data" }
    }
  }


}

// Singleton instance of the API for convenience
export const api = new Api()
