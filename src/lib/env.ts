import { z } from "zod";

const EnvSchema = z.object({
	OLLAMA_URL: z.string().url().optional(),
	NODE_ENV: z.enum(["development", "production", "test"]).catch("development"),
});

const _env = EnvSchema.parse({
	OLLAMA_URL: process.env.OLLAMA_URL,
	NODE_ENV: process.env.NODE_ENV,
});

export const OLLAMA_DEFAULT_URL = _env.OLLAMA_URL ?? "http://localhost:11434";
export const IS_PRODUCTION = _env.NODE_ENV === "production";
