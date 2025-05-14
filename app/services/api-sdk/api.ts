import "@vhybzUX/api"
import { AzureApi, AuthApi, Configuration } from "@vhybzUX/api"
import { ApiConfig } from "./api.types"
import Config from "../../config"

const DEFAULT_API_CONFIG: ApiConfig = {
    baseUrl: Config.API_URL,
}

export class Api {
    public api: AzureApi
    public auth: AuthApi
    private config: ApiConfig

    /**
     * Set up our API instance. Keep this lightweight!
     */
    constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
        this.config = config
        let sdkConfig = new Configuration({ basePath: config.baseUrl })
        this.api = new AzureApi(sdkConfig)
        this.auth = new AuthApi(sdkConfig)
    }

    private isTokenExpired(token: string): boolean {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]))
            return payload.exp * 1000 < Date.now()
        } catch {
            return true
        }
    }

    async call<TRequest, TResponse>(
        func: (request: TRequest, options?: { headers?: Record<string, string> }) => Promise<TResponse>,
        request: TRequest
    ): Promise<TResponse> {
        if (this.config.accessToken && this.isTokenExpired(this.config.accessToken)) {
            await this.refreshAccessToken()
        }
        return func.call(this.api, request, { headers: { "Authorization": `${this.config.accessToken}` } })
    }

    setAccessToken(token: string, refreshToken: string) {
        console.log("setting token", token)
        this.config.accessToken = token
        this.config.refreshToken = refreshToken
    }

    async refreshAccessToken() {
        if (!this.config.refreshToken) {
            throw new Error("No refresh token found")
        }
        let res = await this.auth.authRefreshPost({refresh:{
            refresh_token: this.config.refreshToken
        }})
        if (res.status === 200) {
            this.config.accessToken = res.data.access_token
            this.config.refreshToken = res.data.refresh_token
        }
    }

    async makeThreeJsGame(
        history: { role: string; content: string }[],
        prompt: string,
    ): Promise<{ content: string, kind: "ok" } | { kind: "bad-data" }> {

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
        let response: any
        try {
            console.log("call before")
            response = await this.call(this.api.azureChatCompletionsPost,{ request: { messages: messages }})
            console.log("call after")
            console.log(response)

            if (response.status !== 200) {
                return { kind: "bad-data" }
            }
        } catch (e) {
            console.log("error", e instanceof Error ? e.stack : e)
            return { kind: "bad-data" }
        }

        // the typical ways to die when calling an api
        // if (!response.ok) {
        //   const problem = getGeneralApiProblem(response)
        //   if (problem) return problem
        // }

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

export const api = new Api()

