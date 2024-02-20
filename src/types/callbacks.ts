import type {
  AnySelectMenuInteraction,
  AutocompleteInteraction,
  Awaitable,
  ButtonInteraction,
  ChatInputCommandInteraction,
  MessageContextMenuCommandInteraction,
  ModalSubmitInteraction,
  UserContextMenuCommandInteraction,
} from "discord.js";

export type CallbackCommand = (
  interaction: ChatInputCommandInteraction
) => Awaitable<void>;

export type CallbackAutocomplete = (
  interaction: AutocompleteInteraction
) => Awaitable<void>;

export type CallbackAction = (
  interaction:
    | AnySelectMenuInteraction
    | ButtonInteraction
    | ModalSubmitInteraction
) => Awaitable<void>;

export type CallbackContextMenu = (
  interaction:
    | MessageContextMenuCommandInteraction
    | UserContextMenuCommandInteraction
) => Awaitable<void>;
