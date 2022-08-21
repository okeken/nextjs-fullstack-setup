import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useForm } from "react-hook-form";
import Input from "@components/Input";
import { IPattern, IRegister } from "Types";
import useAuth from "../hooks/useAuth";
import ErrorBlock from "@components/ErrorBlock";

const defaultValue = {
  loading: false,
  error: "",
  message: "",
};
const RegisterView = () => {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [status, setStatus] = useState(defaultValue);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegister>();

  const onSubmit = async (data: IRegister) => {
    setStatus((prev) => ({
      ...prev,
      error: "",
      loading: true,
    }));
    try {
      const result = await registerUser(data);
      setStatus((prev) => ({
        ...prev,
        message: result.data,
      }));
      console.log(result, "result network try");
      router.push("/login");
    } catch (e: any) {
      console.log(e, "error register catch");
      setStatus((prev) => ({
        ...prev,
        error: e,
      }));
    } finally {
      setStatus((prev) => ({
        ...prev,
        loading: false,
      }));
    }
    //    const resp =  await signIn("credentials", { ...data, redirect: false });
  };

  const emailPattern: IPattern = {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
    message: "Invalid Email Provided !!!",
  };

  const passwordPattern: IPattern = {
    value: /(?=.*[!#$%&?^*@~() "])(?=.{8,})/,
    message: "Password Must be 8 char including a special char !!!",
  };

  const { loading, error } = status;
  return (
    <>
      <div className="max-w-screen-xl px-4 pt-16 mx-auto sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-center text-indigo-600 sm:text-3xl">
            Register to get Started
          </h1>
          <p className="max-w-md mx-auto mt-4  mb-2 text-center text-gray-500">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Obcaecati
            sunt dolores deleniti inventore quaerat mollitia?
          </p>
          <ErrorBlock error={error} className="my-1" />
          <form
            className="p-8
     mb-0 space-y-4 rounded-lg shadow-2xl"
            onSubmit={handleSubmit(onSubmit)}
          >
            <p className="text-lg font-medium">Register</p>
            <div>
              <div className="relative m">
                <Input
                disabled={loading}
                  errors={errors}
                  register={register}
                  label="email"
                  required
                  name="email"
                  type="email"
                  pattern={emailPattern}
                  placeholder="Email address"
                  className="w-full pr-12 text-sm border-gray-200 rounded-lg shadow-sm p-4"
                  id="email"
                >
                  <svg
                    className="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </Input>
              </div>
            </div>

            <div>
              <Input
                errors={errors}
                register={register}
                label="password"
                required
                name="password"
                type="password"
                pattern={passwordPattern}
                placeholder="Password"
                className="w-full pr-12 text-sm border-gray-200 rounded-lg shadow-sm p-4"
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
              {loading ? "Loading..." : "Register"}
            </button>
            <p className="text-sm text-center text-gray-500">
              Already have an account?{" "}
              <Link href="/login">
                <a className="underline">login</a>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterView;
