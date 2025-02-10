/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://docs.infinite.red/ignite-cli/boilerplate/app/services/#backend-api-integration)
 * documentation for more details.
 */
import { ApisauceInstance, create } from "apisauce"
import Config from "../../config"
import type { ApiConfig, GeminiApiConfig } from "./api.types"

/**
 * Configuring the apisauce instance.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
}

export const DEFAULT_GEMINI_API_CONFIG: GeminiApiConfig = {
  url: Config.GEMINI_API_URL,
  timeout: 10000,
  apiKey: Config.GEMINI_API_KEY,
}

export type GeminiResponse = {
  candidates: {
    content: {
      parts: { text: string }[]
    }
  }[]
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
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }
}

export class GeminiApi {
  apisauce: ApisauceInstance
  config: GeminiApiConfig

  constructor(config: GeminiApiConfig = DEFAULT_GEMINI_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    })
  }

  async generateContent(prompt: string) {
    try {
      const response = (
        await this.apisauce.post(this.config.url, {
          contents: [{ parts: [{ text: prompt }] }],
        })
      ).data as GeminiResponse
      const parsed = JSON.parse(
        response.candidates[0].content.parts[0].text.replace("```json", "").replace("```", ""),
      )
      return parsed
    } catch (error) {
      console.error("Error generating content:", error)
      throw error
    }
  }
}

// Singleton instance of the API for convenience
export const api = new Api()
export const geminiApi = new GeminiApi()
