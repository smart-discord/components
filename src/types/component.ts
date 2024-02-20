import type { Awaitable, ClientEvents, SlashCommandBuilder } from "discord.js";
import type {
  CallbackAction,
  CallbackAutocomplete,
  CallbackCommand,
  CallbackContextMenu,
} from "./callbacks";

export type ComponentCommand = {
  definition: SlashCommandBuilder;
  handler: CallbackCommand;
};

export type ComponentAutocomplete = {
  key: string;
  handler: CallbackAutocomplete;
};

export type ComponentAction =
  | {
      key: string;
      handler: CallbackAction;
    }
  | {
      keyRegex: string;
      handler: CallbackAction;
    };

export type ComponentContextMenu = {
  key: string;
  handler: CallbackContextMenu;
};

export type ComponentEvent = {
  [Event in keyof ClientEvents]: {
    key: Event;
    handler: (...args: ClientEvents[Event]) => Awaitable<void>;
  };
}[keyof ClientEvents];

export type Component = {
  disabled?: boolean;

  command?: ComponentCommand;
  commands?: ComponentCommand[];

  autocomplete?: ComponentAutocomplete;
  autocompletes?: ComponentAutocomplete[];

  contextMenu?: ComponentContextMenu;
  contextMenus?: ComponentContextMenu[];

  action?: ComponentAction;
  actions?: ComponentAction[];

  event?: ComponentEvent;
  events?: ComponentEvent[];
};

export type ComponentModule = {
  disabled?: boolean;

  components: Component[];
};
