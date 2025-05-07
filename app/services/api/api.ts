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
      baseURL: `${this.config.url}`,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }

  async makeThreeJsGame(
    history: { role: string; content: string }[],
    prompt: string,
  ): Promise<{  content: string , kind: "ok" } | GeneralApiProblem> {
    // make the api call
    const messages = [
      {
        role: "system",
        content: 
`you are the best software engineer that exist, base on user request create a mobile responsive html.
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
      ...history,
      {
        role: "user",
        content: prompt,
      }
    ]

    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.post(
      `chat/completions`,
      {
        messages: messages,
        temperature: 0.6,
        // max_tokens: 800,
        top_p: 0.95,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: null,
      },
    )

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const rawData = (response.data as any).choices[0].message.content

      return { kind: "ok", content: rawData }
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
