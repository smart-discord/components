import { type ClientEvents, type Awaitable, Client } from "discord.js";
import type { Component, ComponentEvent } from "../types/component";

export class EventManager {
  private eventHandlers = new Array<ComponentEvent>();

  public registerComponent(component: Component) {
    if (component.event) {
      const event = component.event;
      this.eventHandlers.push(event);
    }

    if (component.events) {
      for (const event of component.events) {
        this.eventHandlers.push(event);
      }
    }
  }

  public registerHandlers(client: Client) {
    for (const eventHandler of this.eventHandlers) {
      const key = eventHandler.key;
      const handler = eventHandler.handler as (
        ...args: ClientEvents[keyof ClientEvents]
      ) => Awaitable<void>;

      client.on(key, handler);
    }
  }
}
