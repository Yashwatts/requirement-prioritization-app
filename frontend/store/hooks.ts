import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";

/** Typed version of useDispatch — use this instead of plain useDispatch */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/** Typed version of useSelector — use this instead of plain useSelector */
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector(selector);
