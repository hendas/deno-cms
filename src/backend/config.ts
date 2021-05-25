import { config as configDotenv } from './deps.ts';

configDotenv({ export: true, safe: true });

type ConfigVarGenericType<T> = T extends string
  ? string
  : T extends number
  ? number
  : T extends boolean
  ? boolean
  : unknown;

type ConfigVarType = string | number | boolean;

class Config {
  get PORT() {
    return Config.getVariable('PORT', 8000);
  }
  set PORT(value) {
    Config.setVariable('PORT', value);
  }

  private static setVariable(key: string, value: ConfigVarType) {
    Deno.env.set(key, value.toString());
  }

  static getVariable<T extends ConfigVarType>(
    key: string,
    defaultValue: T,
    validateValues?: string[]
  ): ConfigVarGenericType<T> {
    let value;
    const envVar = Deno.env.get(key);
    switch (typeof defaultValue) {
      case 'string':
        value = envVar ?? defaultValue;
        break;
      case 'number':
        value = Number(envVar ?? defaultValue);
        if (isNaN(value)) {
          throw new Error(`Incorrect config variable ${key} - must be number!`);
        }
        break;
      case 'boolean':
        switch (envVar) {
          case 'true':
            value = true;
            break;
          case 'false':
            value = false;
            break;
          case undefined:
            value = defaultValue;
            break;
          default:
            throw new Error(
              `Incorrect config variable ${key} - must be boolean!`
            );
        }
        break;
      default:
        throw new Error(`Incorrect config variable ${key}`);
    }
    if (validateValues && !validateValues.includes(value.toString())) {
      throw new Error(
        `Incorrect config variable ${key} - must be [${validateValues.join(
          ', '
        )}]`
      );
    }

    return value as ConfigVarGenericType<T>;
  }
}

const config = new Config();

export default config;
