import {
  checkingCredentials,
  login,
  logout,
  showSnackbar,
  setToken,
} from "./authSlice";
import { AppDispatch } from "../store";
import { authService } from "../../api/authService";
import { AppThunk } from "../store/store";

interface UserCredentials {
  email: string;
  password: string;
  name: string;
  lastName: string;
  role: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

export const startLogin =
  (loginCredentials: UserCredentials): AppThunk =>
  async (dispatch) => {
    dispatch(checkingCredentials());
    const { email, password } = loginCredentials;

    try {
      const userData = await authService.login(email, password);

      if (userData.ok === false) {
        dispatch(showSnackbar({ message: userData.response, type: "error" }));
        dispatch(logout(userData.response));
        return { wasSuccessful: false, messageType: "error" };
      } else {
        localStorage.setItem("token", userData.response.user.token);
        localStorage.setItem("name", userData.response.user.name);
        localStorage.setItem("lastName", userData.response.user.lastName);
        localStorage.setItem("email", userData.response.user.email);
        localStorage.setItem("status", userData.response.user.status);
        localStorage.setItem("role", userData.response.user.role);
        localStorage.setItem(
          "menu",
          JSON.stringify(userData.response.user.menu)
        );
        dispatch(setToken(userData.response.user.token));
        dispatch(login(userData.response.user));
        return { wasSuccessful: true, messageType: "success" };
      }
    } catch (error) {
      dispatch(logout(error.message));
      dispatch(showSnackbar({ message: error.message, type: "error" }));
      return { wasSuccessful: false, messageType: "error" };
    }
  };

export const startCreatingUser =
  (userCredentials: UserCredentials): AppThunk =>
  async (dispatch) => {
    dispatch(checkingCredentials());

    const { email, password, name, lastName, role } = userCredentials;

    const { ok, uid, response } = await authService.register(
      email,
      password,
      name,
      lastName,
      role
    );

    if (!ok) {
      dispatch(logout(response));
      dispatch(showSnackbar({ message: response, type: "error" }));
      return { wasSuccessful: false, messageType: "error" };
    }

    dispatch(login({ uid, email, name, lastName, role }));
    dispatch(
      showSnackbar({ message: "Usuario registrado con éxito", type: "success" })
    );
    return { wasSuccessful: true, messageType: "success" };
  };

export const startLogout = () => {
  return async (dispatch) => {
    localStorage.clear();
    dispatch(logout());
  };
};
