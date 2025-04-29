// Stylesheets
import "./main.scss";

// Javascript or Typescript
import A11y from "../site/scripts/a11y";
new A11y();

import { Initializer } from "../framework/initializer";
new Initializer();

import animation from "./scripts/animation";
animation.init();

import VidaApp from "../site/scripts/vidaApp";
VidaApp.init();
