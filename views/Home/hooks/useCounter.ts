import { AppDispatch, AppState } from "@state/index";
import { useDispatch, useSelector } from "react-redux";
import { counter } from "../selector";
import { increment, decrement } from "../state";

const useCounter = () => {
  const dispatch = useDispatch<AppDispatch>();
  const count = useSelector<AppState, "counter">(counter);
  const decrementCount = () => dispatch(decrement());
  const incrementCount = () => dispatch(increment());

  return { count, incrementCount, decrementCount };
};

export default useCounter;
