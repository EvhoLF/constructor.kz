import Arrow, { IconNamesArrow } from "./Arrow";
import Buildings, { IconNamesBuildings } from "./Buildings";
import Business, { IconNamesBusiness } from "./Business";
import Default, { IconNamesDefault } from "./Default";
import Design, { IconNamesDesign } from "./Design";
import Development, { IconNamesDevelopment } from "./Development";
import Device, { IconNamesDevice } from "./Device";
import Document, { IconNamesDocument } from "./Document";
import Finance, { IconNamesFinance } from "./Finance";
import Food, { IconNamesFood } from "./Food";
import Logos, { IconNamesLogos } from "./Logos";
import Media, { IconNamesMedia } from "./Media";
import Medical, { IconNamesMedical } from "./Medical";
import Movement, { IconNamesMovement } from "./Movement";
import Others, { IconNamesOthers } from "./Others";
import System, { IconNamesSystem } from "./System";
import User, { IconNamesUser } from "./User";
import Weather, { IconNamesWeather } from "./Weather";

export type IconName =
  typeof IconNamesDefault[number] |
  typeof IconNamesArrow[number] |
  typeof IconNamesBuildings[number] |
  typeof IconNamesBusiness[number] |
  typeof IconNamesDesign[number] |
  typeof IconNamesDevelopment[number] |
  typeof IconNamesDevice[number] |
  typeof IconNamesDocument[number] |
  typeof IconNamesFinance[number] |
  typeof IconNamesFood[number] |
  typeof IconNamesLogos[number] |
  typeof IconNamesMedia[number] |
  typeof IconNamesMedical[number] |
  typeof IconNamesMovement[number] |
  typeof IconNamesOthers[number] |
  typeof IconNamesSystem[number] |
  typeof IconNamesUser[number] |
  typeof IconNamesWeather[number];

export const IconsNames: IconName[] = [
  ...IconNamesDefault,
  ...IconNamesArrow,
  ...IconNamesBuildings,
  ...IconNamesBusiness,
  ...IconNamesDesign,
  ...IconNamesDevelopment,
  ...IconNamesDevice,
  ...IconNamesDocument,
  ...IconNamesFinance,
  ...IconNamesFood,
  ...IconNamesLogos,
  ...IconNamesMedia,
  ...IconNamesMedical,
  ...IconNamesMovement,
  ...IconNamesOthers,
  ...IconNamesSystem,
  ...IconNamesUser,
  ...IconNamesWeather,
]

export const Icons = {
  ...Default,
  ...Arrow,
  ...Buildings,
  ...Business,
  ...Design,
  ...Development,
  ...Device,
  ...Document,
  ...Finance,
  ...Food,
  ...Logos,
  ...Media,
  ...Medical,
  ...Movement,
  ...Others,
  ...System,
  ...User,
  ...Weather,
}

export const IconsGrpups = {
  ...Default,
  ...Arrow,
  ...Buildings,
  ...Business,
  ...Design,
  ...Development,
  ...Device,
  ...Document,
  ...Finance,
  ...Food,
  ...Logos,
  ...Media,
  ...Medical,
  ...Movement,
  ...Others,
  ...System,
  ...User,
  ...Weather,
}