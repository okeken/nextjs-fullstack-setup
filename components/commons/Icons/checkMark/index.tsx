import Icons from "..";
import { HiBadgeCheck } from "react-icons/hi";

const CheckMark = ({ className = "" }) => {
  return (
    <>
      <Icons className={`text-3xl ${className}`}>
        <HiBadgeCheck />
      </Icons>
    </>
  );
};

export default CheckMark;
