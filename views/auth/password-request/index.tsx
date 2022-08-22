import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import Input from "@components/Input";
import useAuth from "../hooks/useAuth";
import ErrorBlock from "@components/ErrorBlock";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { IConfirmToken } from "Types";
import LoaderOne from "@components/commons/loader/loader-one";

const formSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password length should be at least 4 characters")
    .matches(
      /[*@!#%&()^~{}]+/,
      "Must Contain At Least One Special Case Character"
    ),
  passwordConfirm: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password")], "Passwords must and should match"),
});
const validationOpt = { mode: "onTouched", resolver: yupResolver(formSchema) };

const defaultState = {
  loading: false,
  error: "",
  message: "",
  isMounting: true,
  tokenStatus: false,
};
const PasswordResetView = () => {
  const router = useRouter();
  const route = useRouter();
  const { userId = "", token = "" } = route.query;
  const query = { userId, token } as IConfirmToken;

  const { resetPassword, confirmToken, resendPasswordRequestEmail } = useAuth();
  const fetchToken = async () => {
    try {
      const response = await confirmToken(query);
      if (response.status) {
        setStatus((prev) => ({ ...prev, tokenStatus: response }));
      }

      setStatus((prev) => ({ ...prev, error: response.error }));
    } catch (e) {
      console.log(e);
      setStatus((prev) => ({
        ...prev,
        tokenStatus: false,
        error: "invalid or expired token",
      }));
      console.log("error check", e);
    } finally {
      setStatus((prev) => ({ ...prev, isMounting: false }));
    }
  };
  useEffect(() => {
    if (userId && token) {
      fetchToken();
    }
  }, [userId, token]);

  const [status, setStatus] = useState(defaultState);
  const [resend, setResend] = useState(defaultState);
  const {
    register,
    handleSubmit,
    formState: { errors },
    // @ts-ignore
  } = useForm<any>(validationOpt);

  interface IResetPassword {
    password: string;
    passwordConfirm: string;
    token: string;
    userId: string;
  }

  const onSubmit = async (data: IResetPassword) => {
    setStatus((prev) => ({ ...prev, loading: true, error: "" }));
    try {
      const info = {
        ...data,
        ...query,
      };
      const response = await resetPassword(info);
      if (!!response?.error)
        return setStatus((prev) => ({
          ...prev,
          loading: false,
          error: response?.error as string,
        }));
      router.push("/login");
    } catch (e) {
      setStatus((prev) => ({ ...prev, loading: false }));
    } finally {
      setStatus((prev) => ({ ...prev, loading: false }));
    }
  };

  const resendToken = async () => {
    setResend((prev) => ({ ...prev, loading: true, error: "" }));
    try {
      const response = await resendPasswordRequestEmail(userId as string);

      if (!!response.error)
        return setResend((prev) => ({
          ...prev,
          loading: false,
          error: response.error as string,
        }));

      setResend((prev) => ({ ...prev, message: response.message }));
    } catch (e) {
      console.log(e, "error sending");
      setResend((prev) => ({ ...prev, error: "error sending token" }));
    } finally {
      setResend((prev) => ({ ...prev, loading: false }));
    }
  };
  const { error, loading, isMounting, tokenStatus } = status;
  const {
    error: resendError,
    loading: resendLoading,
    message: resendingMsg,
  } = resend;
  return (
    <>
      {!!isMounting && (
        <div className="min-h-screen flex justify-center items-center">
          <LoaderOne />
        </div>
      )}
      {!tokenStatus && !isMounting && (
        <div className="min-h-screen flex justify-center items-center">
          <div className="flex flex-col justify-center">
            <ErrorBlock
              error={
                !!resendError
                  ? resendError
                  : !!resendingMsg
                  ? resendingMsg
                  : error
              }
              className="my-1 p-4"
            />
            <button
              onClick={resendToken}
              className="border inline-block p-2 "
              disabled={resendLoading || !!resendingMsg}
            >
              {resendLoading ? "Sending" : "Resend"}
            </button>
          </div>
        </div>
      )}

      {!isMounting && tokenStatus && (
        <div className="max-w-screen-xl px-4 pt-16 mx-auto sm:px-6 lg:px-8">
          <div className="max-w-lg mx-auto">
            <h1 className="text-2xl font-bold text-center text-indigo-600 sm:text-3xl">
              Reset Password
            </h1>

            <ErrorBlock error={error} className="my-1" />

            <form
              className="p-8 mb-0 space-y-4 rounded-lg shadow-2xl"
              onSubmit={handleSubmit(onSubmit)}
            >
              <p className="text-lg font-medium">Reset your password</p>
              <input hidden name="mode" />
              <div>
                <Input
                disabled={loading}
                  errors={errors}
                  register={register}
                  label="password"
                  required
                  name="password"
                  type="password"
                  useRegexPattern={false}
                  placeholder="Password"
                  className="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
                  id="password"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </Input>
              </div>
              <div>
                <Input
                  disabled={loading}
                  errors={errors}
                  register={register}
                  label="Confirm Password"
                  required
                  name="passwordConfirm"
                  type="password"
                  useRegexPattern={false}
                  placeholder="Password"
                  className="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
                  id="password"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </Input>
              </div>
              <button
                disabled={loading}
                type="submit"
                className={`block w-full px-5 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg ${
                  loading ? "cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Loading..." : "Reset Password"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default PasswordResetView;
