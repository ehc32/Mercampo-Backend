import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginRequest } from "../api/users";
import AsideFilter from "../components/tienda/AsideFilter/AsideFilter";
import {
  IconButton,
  InputAdornment,
  Button,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useAuthStore } from "../hooks/auth";

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuth } = useAuthStore();
  const setToken = useAuthStore((state) => state.setToken);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useMutation({
    mutationFn: () => loginRequest(email, password),
    onSuccess: (response) => {
      setToken(response.data.access, response.data.refresh);
      toast.success("Inicio de sesión exitoso!");
      navigate("/");
    },
    onError: () => {
      toast.error("Hubo un error, intenta de nuevo");
    },
  });

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loginMutation.mutate();
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "#39A900",
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            textTransform: 'none',
            padding: '10px',
          },
        },
      },
    },
  });

  if (loginMutation.isLoading) return <p>Cargando...</p>;
  if (isAuth) return <Navigate to="/" />;

  return (
    <ThemeProvider theme={theme}>
      <AsideFilter />
      <div className="flex flex-col justify-center items-center fondo-login min-h-screen">
        <div className="w-96 bg-slate-300 bg-opacity-20 backdrop-filter backdrop-blur-md rounded-lg shadow dark:border md:mt-0 xl:p-0 dark:bg-gray-800 dark:bg-opacity-20 dark:backdrop-blur-md dark:border-gray-700 flex flex-row">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8 w-full">
            <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-gray-100">
              Inicia sesión
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <Typography
                  variant="subtitle1"
                  component="div"
                  className="font-bold text-black dark:text-gray-200 mb-1"
                >
                  Correo electrónico
                </Typography>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="correo@email.com"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                />
              </div>

              <div>
                <Typography
                  variant="subtitle1"
                  component="div"
                  className="font-bold text-black dark:text-gray-200 mb-1"
                >
                  Contraseña
                </Typography>
                <div className="relative">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña"
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                  />
                  <InputAdornment position="end" className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      className="focus:outline-none relative top-6"
                    >
                      {showPassword ? (
                        <VisibilityOff style={{ color: "#39A900" }} />
                      ) : (
                        <Visibility style={{ color: "#39A900" }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                </div>
              </div>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                style={{
                  backgroundColor: "#39A900",
                  color: "white",
                }}
                className="hover:bg-lime-700 focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800"
              >
                Ingresar
              </Button>
              <p className="text-sm font-light text-black dark:text-gray-300">
                ¿No tienes cuenta?{" "}
                <Link
                  to={"/register"}
                  className="font-medium text-white hover:underline dark:text-lime-400"
                >
                  Regístrate
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default LoginPage;
