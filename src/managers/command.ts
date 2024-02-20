import { REST, Routes } from "discord.js";
import type { RESTPostAPIApplicationCommandsJSONBody } from "discord.js";
import type { Component } from "../types/component";

export class CommandManager {
  private commandDefinitions =
    new Array<RESTPostAPIApplicationCommandsJSONBody>();

  public registerComponent(component: Component) {
    if (component.command) {
      const command = component.command;
      this.commandDefinitions.push(command.definition.toJSON());
    }

    if (component.commands) {
      for (const command of component.commands) {
        this.commandDefinitions.push(command.definition.toJSON());
      }
    }
  }

  public getCommands() {
    return this.commandDefinitions;
  }

  public async updateGuild(
    applicationId: string,
    guildId: string,
    token: string
  ) {
    const rest = new REST().setToken(token);

    const route = Routes.applicationGuildCommands(applicationId, guildId);

    await rest.put(route, {
      body: this.commandDefinitions,
    });
  }

  public async updateGlobal(applicationId: string, token: string) {
    const rest = new REST().setToken(token);

    const route = Routes.applicationCommands(applicationId);

    await rest.put(route, {
      body: this.commandDefinitions,
    });
  }
}
