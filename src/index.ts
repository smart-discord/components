import type { Component, ComponentModule } from "./types/component";
import ComponentManager from "./manager";

export function component(component: Component) {
  return component;
}

export function componentModule(componentModule: ComponentModule) {
  return componentModule;
}

export default ComponentManager;
