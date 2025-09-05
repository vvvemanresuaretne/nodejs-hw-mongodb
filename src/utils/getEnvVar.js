// src/utils/getEnvVar.js

export function getEnvVar(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable "${name}" is not defined`);
  }
  return value;
}
