import {
	OpenAIChatLanguageModel,
	OpenAIChatSettings,
	OpenAIEmbeddingModel,
	OpenAIEmbeddingSettings,
	OpenAICompletionSettings,
	OpenAICompletionLanguageModel,
} from "@ai-sdk/openai/internal";
import { loadApiKey, loadSetting } from "@ai-sdk/provider-utils";

export interface HeliconeAzureOpenAIProvider {
	(deploymentId: string, settings?: HeliconeAzureOpenAIChatSettings): OpenAIChatLanguageModel;

	/**
  Creates an Azure OpenAI chat model for text generation.
	 */
	languageModel(deploymentId: string, settings?: HeliconeAzureOpenAIChatSettings): OpenAIChatLanguageModel;

	/**
  Creates an Azure OpenAI chat model for text generation.
	 */
	chat(deploymentId: string, settings?: HeliconeAzureOpenAIChatSettings): OpenAIChatLanguageModel;

	/**
  Creates an Azure OpenAI model for text embeddings.
	 */
	embedding(deploymentId: string, settings?: HeliconeAzureOpenAIEmbeddingSettings): OpenAIEmbeddingModel;

	/**
  Creates an Azure OpenAI model for text embeddings.
	 */
	textEmbedding(deploymentId: string, settings?: HeliconeAzureOpenAIEmbeddingSettings): OpenAIEmbeddingModel;

	/**
	 * Creates an Azure OpenAI completion model for text generation.
	 */
	completion(deploymentId: string, settings?: HeliconeAzureOpenAICompletionSettings): OpenAICompletionLanguageModel;
}

interface HeliconeAzureOpenAIChatSettings extends OpenAIChatSettings {
	/**
  Helicone Model Override.
	   */
	modelOverride?: string;
}
interface HeliconeAzureOpenAIEmbeddingSettings extends OpenAIEmbeddingSettings {
	/**
  Helicone Model Override.
	   */
	modelOverride?: string;
}
interface HeliconeAzureOpenAICompletionSettings extends OpenAICompletionSettings {
	/**
  Helicone Model Override.
	   */
	modelOverride?: string;
}

export interface HeliconeAzureOpenAIProviderSettings {
	/**
  Name of the Azure OpenAI resource.
	   */
	resourceName?: string;

	/**
  Azure API key for authenticating requests.
	   */
	azureApiKey?: string;

	/**
 Helicone API key for authenticating requests.
	   */
	heliconeApiKey?: string;

	/**
  Custom headers to include in the requests.
	   */
	headers?: Record<string, string>;

	/**
  Custom fetch implementation. You can use it as a middleware to intercept requests,
  or to provide a custom fetch implementation for e.g. testing.
	  */
	fetch?: typeof fetch;
}

/**
  Create an Azure OpenAI provider instance.
   */
export function createHeliconeAzure(options: HeliconeAzureOpenAIProviderSettings = {}): HeliconeAzureOpenAIProvider {
	const getHeaders = (modelOverride?: string) => () => {
		return {
			"api-key": loadApiKey({
				apiKey: options.azureApiKey,
				environmentVariableName: "AZURE_API_KEY",
				description: "Azure OpenAI",
			}),
			...(modelOverride ? { "Helicone-Model-Override": modelOverride } : {}),
			"Helicone-OpenAI-Api-Base": `https://${getResourceName()}.openai.azure.com`,
			"Helicone-Auth": `Bearer ${loadApiKey({
				apiKey: options.heliconeApiKey,
				environmentVariableName: "HELICONE_API_KEY",
				description: "Helicone OpenAI",
			})}`,
			...options.headers,
		};
	};

	const getResourceName = () =>
		loadSetting({
			settingValue: options.resourceName,
			settingName: "resourceName",
			environmentVariableName: "AZURE_RESOURCE_NAME",
			description: "Azure OpenAI resource name",
		});

	const url = ({ path, modelId }: { path: string; modelId: string }) =>
		`https://oai.helicone.ai/openai/deployments/${modelId}${path}?api-version=2024-05-01-preview`;

	const createChatModel = (deploymentName: string, settings: HeliconeAzureOpenAIChatSettings = {}) =>
		new OpenAIChatLanguageModel(deploymentName, settings, {
			provider: "azure-openai.chat",
			url,
			headers: getHeaders(settings.modelOverride),
			compatibility: "compatible",
			fetch: options.fetch,
		});

	const createCompletionModel = (modelId: string, settings: HeliconeAzureOpenAICompletionSettings = {}) =>
		new OpenAICompletionLanguageModel(modelId, settings, {
			provider: "azure-openai.completion",
			url,
			compatibility: "compatible",
			headers: getHeaders(settings.modelOverride),
			fetch: options.fetch,
		});

	const createEmbeddingModel = (modelId: string, settings: HeliconeAzureOpenAIEmbeddingSettings = {}) =>
		new OpenAIEmbeddingModel(modelId, settings, {
			provider: "azure-openai.embeddings",
			headers: getHeaders(settings.modelOverride),
			url,
			fetch: options.fetch,
		});

	const provider = function (deploymentId: string, settings?: OpenAIChatSettings | OpenAICompletionSettings) {
		if (new.target) {
			throw new Error("The Azure OpenAI model function cannot be called with the new keyword.");
		}

		return createChatModel(deploymentId, settings as OpenAIChatSettings);
	};

	provider.languageModel = createChatModel;
	provider.chat = createChatModel;
	provider.completion = createCompletionModel;
	provider.embedding = createEmbeddingModel;
	provider.textEmbedding = createEmbeddingModel;

	return provider as HeliconeAzureOpenAIProvider;
}

/**
  Default Helicone Azure OpenAI provider instance.
   */
export const HeliconeAzure = createHeliconeAzure({});
