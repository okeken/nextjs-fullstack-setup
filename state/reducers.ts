import { combineReducers } from "@reduxjs/toolkit";
import counter from "@views/Home/state";

export const store = combineReducers({
  counter,
});
