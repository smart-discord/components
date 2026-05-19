import {
  Collection,
  Client,
  Events,
  ChatInputCommandInteraction,
  AutocompleteInteraction,
  ButtonInteraction,
  ModalSubmitInteraction,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
} from "discord.js";
import type {
  Interaction,
  CacheType,
  AnySelectMenuInteraction,
} from "discord.js";
import type {
  CallbackAction,
  CallbackAutocomplete,
  CallbackCommand,
  CallbackContextMenu,
  CallbackInteractionError,
} from "../types/callbacks";
import type { Component } from "../types/component";

export class InteractionManager {
  private commandHandlers = new Collection<string, CallbackCommand>();
  private autocompleteHandlers = new Collection<string, CallbackAutocomplete>();
  private actionHandlers = new Collection<
    string,
    { regex?: RegExp; handler: CallbackAction }
  >();
  private contextMenuHandlers = new Collection<string, CallbackContextMenu>();

  private errorHandler?: CallbackInteractionError;

  // Components

  public registerComponent(component: Component) {
    this.registerCommands(component);

    this.registerAutocompletes(component);

    this.registerActions(component);

    this.registerContextMenus(component);
  }

  private registerCommands(component: Component) {
    if (component.command) {
      const command = component.command;
      this.commandHandlers.set(command.definition.name, command.handler);
    }

    if (component.commands) {
      for (const command of component.commands) {
        this.commandHandlers.set(command.definition.name, command.handler);
      }
    }
  }

  private registerAutocompletes(component: Component) {
    if (component.autocomplete) {
      const autocomplete = component.autocomplete;
      this.autocompleteHandlers.set(autocomplete.key, autocomplete.handler);
    }

    if (component.autocompletes) {
      for (const autocomplete of component.autocompletes) {
        this.autocompleteHandlers.set(autocomplete.key, autocomplete.handler);
      }
    }
  }

  private registerActions(component: Component) {
    if (component.action) {
      const action = component.action;

      if ("key" in action) {
        this.actionHandlers.set(action.key, { handler: action.handler });
      }

      if ("keyRegex" in action) {
        this.actionHandlers.set(action.keyRegex, {
          regex: new RegExp(action.keyRegex),
          handler: action.handler,
        });
      }
    }

    if (component.actions) {
      for (const action of component.actions) {
        if ("key" in action) {
          this.actionHandlers.set(action.key, { handler: action.handler });
        }

        if ("keyRegex" in action) {
          this.actionHandlers.set(action.keyRegex, {
            regex: new RegExp(action.keyRegex),
            handler: action.handler,
          });
        }
      }
    }
  }

  private registerContextMenus(component: Component) {
    if (component.contextMenu) {
      const contextMenu = component.contextMenu;

      this.contextMenuHandlers.set(
        contextMenu.definition.name,
        contextMenu.handler,
      );
    }

    if (component.contextMenus) {
      for (const contextMenu of component.contextMenus) {
        this.contextMenuHandlers.set(
          contextMenu.definition.name,
          contextMenu.handler,
        );
      }
    }
  }

  // Handlers

  public registerHandlers(client: Client) {
    client.on(
      Events.InteractionCreate,
      async (interaction: Interaction<CacheType>) => {
        try {
          if (interaction.isChatInputCommand()) {
            await this.handleCommand(interaction);
          } else if (interaction.isAutocomplete()) {
            await this.handleAutocomplete(interaction);
          } else if (interaction.isAnySelectMenu()) {
            await this.handleAction(interaction);
          } else if (interaction.isButton()) {
            await this.handleAction(interaction);
          } else if (interaction.isModalSubmit()) {
            await this.handleAction(interaction);
          } else if (interaction.isMessageContextMenuCommand()) {
            await this.handleContextMenu(interaction);
          } else if (interaction.isUserContextMenuCommand()) {
            await this.handleContextMenu(interaction);
          } else {
            throw "Interaction not implemented";
          }
        } catch (error) {
          try {
            if (this.errorHandler) {
              await this.errorHandler(error, interaction);
            }
          } catch {}
        }
      },
    );
  }

  private async handleCommand(interaction: ChatInputCommandInteraction) {
    const commandHandler = this.commandHandlers.get(interaction.commandName);

    if (!commandHandler) {
      return;
    }

    await commandHandler(interaction);
  }

  private async handleAutocomplete(interaction: AutocompleteInteraction) {
    const focusedOption = interaction.options.getFocused(true);
    const autocompleteHandler = this.autocompleteHandlers.get(
      `${interaction.commandName}/${focusedOption.name}`,
    );

    if (!autocompleteHandler) {
      return;
    }

    await autocompleteHandler(interaction);
  }

  private async handleAction(
    interaction:
      | AnySelectMenuInteraction
      | ButtonInteraction
      | ModalSubmitInteraction,
  ) {
    let actionHandler = this.actionHandlers.get(interaction.customId);

    if (!actionHandler) {
      actionHandler = this.actionHandlers.find(
        (value) => value.regex && value.regex.test(interaction.customId),
      );
    }

    if (!actionHandler) {
      return;
    }

    await actionHandler.handler(interaction);
  }

  private async handleContextMenu(
    interaction:
      | MessageContextMenuCommandInteraction
      | UserContextMenuCommandInteraction,
  ) {
    const contextMenuHandler = this.contextMenuHandlers.get(
      interaction.commandName,
    );

    if (!contextMenuHandler) {
      return;
    }

    await contextMenuHandler(interaction);
  }

  // Error handler

  public setErrorHandler(handler: CallbackInteractionError) {
    this.errorHandler = handler;
  }
}
