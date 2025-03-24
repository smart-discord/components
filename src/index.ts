import { Client } from "discord.js";
import type { Component, ComponentModule } from "./types/component";
import { CommandManager } from "./managers/command";
import { InteractionManager } from "./managers/interactions";
import { EventManager } from "./managers/event";

export function component(component: Component) {
  return component;
}

export function componentModule(componentModule: ComponentModule) {
  return componentModule;
}

export default class ComponentManager {
  private commandManager = new CommandManager();
  private interactionManager = new InteractionManager();
  private eventManager = new EventManager();

  public registerModules(...modules: ComponentModule[]) {
    for (const module of modules) {
      if (module.disabled) {
        continue;
      }

      this.registerComponents(...module.components);
    }
  }

  public registerComponents(...components: Component[]) {
    for (const component of components) {
      if (component.disabled) {
        continue;
      }

      this.commandManager.registerComponent(component);

      this.interactionManager.registerComponent(component);

      this.eventManager.registerComponent(component);
    }
  }

  public registerHandlers(client: Client) {
    this.interactionManager.registerHandlers(client);

    this.eventManager.registerHandlers(client);
  }

  public getCommands() {
    return this.commandManager.getCommands();
  }

  public async updateGuildCommands(
    applicationId: string,
    guildId: string,
    token: string,
  ) {
    await this.commandManager.updateGuild(applicationId, guildId, token);
  }

  public async updateGlobalCommands(applicationId: string, token: string) {
    await this.commandManager.updateGlobal(applicationId, token);
  }
}
