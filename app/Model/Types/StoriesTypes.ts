import { Project } from "../Projects";

export enum Priority {
  niski  = 0,
  sredni = 1,
  wysoki = 2
}
export enum State {
  todo  = 1,
  doing = 2,
  done  = 3
}

// 2) Plain-TS interface
export interface Story {
  id: string;
  nazwa: string;
  opis: string;
  priorytet: Priority;
  projekt: Project;
  projektId:string;
  data_utworzenia: string;
  stan: State;
  wlasciciel: string;
}