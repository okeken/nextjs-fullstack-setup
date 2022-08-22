import Button from "@components/Button";
import Head from "next/head";
import useCounter from "./hooks/useCounter";

const Home = () => {
  const { decrementCount, incrementCount, count } = useCounter();
  return (
    <>
      <div className="grid h-screen place-items-center">
        <div>
          <Button className="mr-6" onClick={incrementCount}>
            <>
            Plus
            </>
          </Button>
          <span
            className={`${
              Number(count) >= 0
                ? "text-green-700 bg-green-200"
                : "text-red-700 bg-red-200"
            } p-3 rounded-md`}
          >
            {count}
          </span>
          <Button className="ml-6" onClick={decrementCount}>
            <>
            Minus
            </>
          </Button>
        </div>
      </div>
    </>
  );
};

export default Home;
