interface IProps {
  error: String;
  className?: string;
}

const ErrorBlock = ({ error, className = "" }: IProps) => {
  return (
    <>
      {!!error ? (
        <div
          className={`p-1 text-red-900  text-center mb-2 bg-red-200  rounded-sm ${className}`}
        >
          {error}
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default ErrorBlock;
