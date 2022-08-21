import { IElementProps } from "Types";

const Button = ({
  children,
  className = "",
  ...props
}: JSX.IntrinsicElements["button"] & IElementProps) => {
  return (
    <button className={`${className} p-2 border`} {...props}>
      {children}
    </button>
  );
};

export default Button;
