import { Client } from "discord.js";
import type {
  CallbackEventError,
  CallbackInteractionError,
} from "./types/callbacks";
import type { Component, ComponentModule } from "./types/component";
import { CommandManager } from "./managers/command";
import { InteractionManager } from "./managers/interactions";
import { EventManager } from "./managers/event";

export default class ComponentManager {
  private commandManager = new CommandManager();
  private interactionManager = new InteractionManager();
  private eventManager = new EventManager();

  public addModules(...modules: ComponentModule[]) {
    for (const module of modules) {
      if (module.disabled) {
        continue;
      }

      this.addComponents(...module.components);
    }
  }

  public addComponents(...components: Component[]) {
    for (const component of components) {
      if (component.disabled) {
        continue;
      }

      this.commandManager.registerComponent(component);

      this.interactionManager.registerComponent(component);

      this.eventManager.registerComponent(component);
    }
  }

  public async registerForGuild(
    client: Client,
    applicationId: string,
    guildId: string,
    token: string,
  ) {
    this.interactionManager.registerHandlers(client);
    this.eventManager.registerHandlers(client);

    await this.commandManager.updateGuild(applicationId, guildId, token);
  }

  public async registerGlobally(
    client: Client,
    applicationId: string,
    token: string,
  ) {
    this.interactionManager.registerHandlers(client);
    this.eventManager.registerHandlers(client);

    await this.commandManager.updateGlobal(applicationId, token);
  }

  public setInteractionErrorHandler(handler: CallbackInteractionError) {
    this.interactionManager.setErrorHandler(handler);
  }

  public setEventErrorHandler(handler: CallbackEventError) {
    this.eventManager.setErrorHandler(handler);
  }
}
