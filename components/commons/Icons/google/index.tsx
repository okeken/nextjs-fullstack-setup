import Icons from "..";
import { BsGoogle } from "react-icons/bs";

const Google = ({ className = "" }) => {
  return (
    <>
      <Icons className={`text-3xl ${className}`}>
        <BsGoogle />
      </Icons>
    </>
  );
};

export default Google;
