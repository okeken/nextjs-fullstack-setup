import { IElementProps, IPattern } from "Types";

interface IInputProps extends IElementProps {
  placeholder?: string;
  type: string;
  name: string;
  register: any;
  required: boolean;
  label: string;
  errors: any;
  pattern?: IPattern;
  useRegexPattern?: boolean;
  disabled?: boolean;
}

const Input = ({
  placeholder = "",
  type = "text",
  className = "",
  name,
  register = () => {},
  required,
  label,
  errors,
  pattern,
  children,
  useRegexPattern = true,
  disabled = false,
}: IInputProps) => {
  const err =
    errors[name]?.type === "required" ||
    errors[name]?.type === "pattern" ||
    !!errors[name]?.message;
  return (
    <>
      {err && (
        <span className="text-sm text-red-500 label-text-alt">
          {errors[name]?.message}
        </span>
      )}

      <label
        className={`relative block p-3 border-2 border-gray-200 rounded-lg ${
          err ? "border-red-300" : ""
        }`}
        htmlFor={name}
      >
        <input
          disabled={disabled}
          placeholder={placeholder}
          name={name}
          id={name}
          type={type}
          className={`w-full px-0 pt-3.5 pb-0 text-sm placeholder-transparent border-none focus:ring-0 peer ${
            err
              ? "focus:ring-red-500 focus:border-red-500 ring-red-500 border-red-500"
              : ""
          } ${className}`}
          {...(useRegexPattern
            ? {
                ...register(name, {
                  required: {
                    value: required,
                    message: `${name} Required !!!`,
                  },
                  pattern: { ...pattern },
                }),
              }
            : { ...register(name) })}
        />

        <span className="absolute text-xs font-medium text-gray-500 capitalize transition-all left-3 peer-focus:text-xs peer-focus:top-3 peer-focus:translate-y-0 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm">
          {label}
        </span>
        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none top-1/2 right-4">
          {children}
        </span>
      </label>
    </>
  );
};

export default Input;
