import { Provider as ReduxProvider } from "react-redux";
// import { SessionProvider } from "next-auth/react"
import store from "@state/index";

interface IProps {
  children: React.ReactNode;
}
const ProviderIndex = ({ children }: IProps) => {
  return (
    <>
      <ReduxProvider store={store}>
        {/* <SessionProvider > */}
        {children}
        {/* </Session/Provider>   */}
      </ReduxProvider>
    </>
  );
};

export default ProviderIndex;
