import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import type { User } from "../types/Types";
import { authService } from "../api/services/AuthService";

interface CustomJwtPayload {
  sub: string;
  payrollNumber: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  exp: number;
  iss: string;
  aud: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payrollNumber: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedSession = localStorage.getItem("mesa_user_session");
    if (storedSession) {
      setUser(JSON.parse(storedSession));
    }
    setIsLoading(false);
  }, []);

  const login = async (payrollNumber: string, password: string) => {
    try {
      const response = await authService.login(payrollNumber, password);

      const token = response.data?.token || response.token;

      const decodedToken = jwtDecode<CustomJwtPayload>(token);

      const extractedRole =
        decodedToken[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];
      const extractedPayroll = decodedToken.payrollNumber;

      const userData: User = {
        token: token,
        payrollNumber: extractedPayroll,
        role: extractedRole,
      };

      setUser(userData);
      localStorage.setItem("mesa_user_session", JSON.stringify(userData));

      return true;
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error);

      const errorMessage =
        error.response?.data?.message ||
        "Número de nómina o contraseña incorrectos.";

      toast.error("Acceso denegado", {
        description: errorMessage,
      });

      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("mesa_user_session");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
