interface IProps {
  children: React.ReactNode;
}

const Layout = ({ children }: IProps) => {
  return <>{children}</>;
};

export default Layout;
