import { useEffect } from "react";
import axios from "axios";
import { useSession, signIn, signOut } from "next-auth/react";
import { IConfirmToken, IRegister, IResetPassword } from "Types";

const defaultState = {
  loading: false,
  error: "",
  message: "",
};
const register = async (data: IRegister) => {
  try {
    const result = await axios.post("/api/auth/register", data);
    return result.data;
  } catch (e: any) {
    throw e.response.data.error;
  }
};

const requestResetPassword = async (email: string) => {
  try {
    const result = await axios.post(`/api/auth/forgot-password?email=${email}`);
    return result.data;
  } catch (e: any) {
    throw e.response.data.error;
  }
};

const resetPassword = async (resetObj: IResetPassword) => {
  try {
    const result = await axios.post(`/api/auth/reset-password`, resetObj);
    return result.data;
  } catch (e: any) {
    throw e.response.data.error;
  }
};
const confirmToken = async (tokenObj: IConfirmToken) => {
  const { token, userId } = tokenObj;
  try {
    const result = await axios.post(
      `/api/auth/confirm-token?token=${token}&userId=${userId}`
    );
    return result.data;
  } catch (e: any) {
    throw e.response.data.error;
  }
};

const resendPasswordRequestEmail = async (userId: string) => {
  try {
    const result = await axios.post(
      `/api/auth/resend-password-request?userId=${userId}`
    );
    return result.data;
  } catch (e: any) {
    throw e.response.data.error;
  }
};

const useAuth = () => {
  const { data: session } = useSession();

  return {
    session,
    signIn,
    signOut,
    register,
    requestResetPassword,
    resetPassword,
    confirmToken,
    resendPasswordRequestEmail,
  };
};

export default useAuth;
