import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import Input from "@components/Input";
import { IEmail, IPattern } from "Types";
import useAuth from "../hooks/useAuth";
import ErrorBlock from "@components/ErrorBlock";
import CheckMark from "@components/commons/Icons/checkMark";

const defaultState = {
  loading: false,
  error: "",
  message: "",
};
const ForgotPasswordView = () => {
  const router = useRouter();
  const { requestResetPassword } = useAuth();
  const [status, setStatus] = useState(defaultState);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IEmail>();

  const onSubmit = async ({ email }: IEmail) => {
    setStatus({ loading: true, error: "", message: "" });
    try {
      const response = await requestResetPassword(email);
      console.log(response);
      if (!!response?.error)
        return setStatus((prev) => ({
          ...prev,
          error: response?.error as string,
        }));
      setStatus((prev) => ({ ...prev, message: response?.message }));
    } catch (e) {
      setStatus((prev) => ({ ...prev, loading: false }));
    } finally {
      setStatus((prev) => ({ ...prev, loading: false }));
    }
  };

  const emailPattern: IPattern = {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
    message: "Invalid Email Provided !!!",
  };

  const { error, loading, message } = status;
  return (
    <>
      <div>
        <div className="flex items-center justify-center min-h-full px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <div>
              <img
                className="w-auto h-12 mx-auto"
                src="https://tailwindui.com/img/logos/workflow-mark.svg?color=indigo&shade=600"
                alt="Workflow"
              />
              <h2 className="mt-6 text-3xl font-bold tracking-tight text-center text-gray-900">
                Reset Your Password
              </h2>
            </div>

            {!!message ? (
              <div className="items-center justify-center p-2 mx-auto text-center bg-green-400 md:flex">
                <div className="flex justify-center mx-auto text-center">
                  <CheckMark />
                </div>
                <div>
                  <span className="ml-2 text-lg font-semibold text-green-800">
                    <wbr />
                    {message}
                  </span>
                </div>
              </div>
            ) : (
              <form
                className="mt-8 space-y-6"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="-space-y-px rounded-md shadow-sm">
                  <ErrorBlock error={error} />
                  <div>
                    <Input
                      errors={errors}
                      register={register}
                      label="email"
                      required
                      name="email"
                      type="email"
                      pattern={emailPattern}
                      placeholder="Email address"
                      className=""
                    />
                  </div>
                </div>

                <div>
                  <button
                    disabled={loading}
                    className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        className="w-5 h-5 text-indigo-500 group-hover:text-indigo-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    {loading ? "Loading..." : "Reset"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordView;
