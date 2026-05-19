import type {
  AnySelectMenuInteraction,
  AutocompleteInteraction,
  Awaitable,
  ButtonInteraction,
  CacheType,
  ChatInputCommandInteraction,
  ClientEvents,
  Interaction,
  MessageContextMenuCommandInteraction,
  ModalSubmitInteraction,
  UserContextMenuCommandInteraction,
} from "discord.js";

export type CallbackCommand = (
  interaction: ChatInputCommandInteraction,
) => Awaitable<void>;

export type CallbackAutocomplete = (
  interaction: AutocompleteInteraction,
) => Awaitable<void>;

export type CallbackAction = (
  interaction:
    | AnySelectMenuInteraction
    | ButtonInteraction
    | ModalSubmitInteraction,
) => Awaitable<void>;

export type CallbackContextMenu = (
  interaction:
    | MessageContextMenuCommandInteraction
    | UserContextMenuCommandInteraction,
) => Awaitable<void>;

export type CallbackInteractionError = (
  error: unknown,
  interaction: Interaction<CacheType>,
) => Awaitable<void>;

export type CallbackEventError<
  K extends keyof ClientEvents = keyof ClientEvents,
> = (error: unknown, event: K, args: ClientEvents[K]) => Awaitable<void>;
