interface IProps {
  children: React.ReactElement;
  className?: string;
}

const Icons = ({ className, children }: IProps) => {
  return <div className={className}>{children}</div>;
};

export default Icons;
