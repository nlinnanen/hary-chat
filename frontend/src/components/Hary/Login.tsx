import axios from "axios";
import { usePostAuthLocal } from "src/api/users-permissions-auth/users-permissions-auth";
import Warning from "../Warning";

export default function Login({
  setIsAuthenticated,
}: {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { mutate, error, isError } = usePostAuthLocal({ axios: { params: { populate: "*" } } });

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };
    mutate(
      {
        data: {
          identifier: form.email.value,
          password: form.password.value,
        },
      },
      {
        onSuccess: (response) => {
          const jwt = response.data.jwt;
          axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
          localStorage.setItem("authToken", jwt || "");
          localStorage.setItem(
            "userId",
            response.data.user!.id!.toString() || ""
          );
          setIsAuthenticated(true);
        },
      }
    );
  };
  console.log(error)
  return (
    <div className="flex h-screen items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="mb-4 rounded-xl bg-base-200 px-8 pb-8 pt-6 text-base-content shadow-md"
      >
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold" htmlFor="email">
            Email
          </label>
          <input
            name="email"
            className="input input-bordered w-full"
            type="email"
            placeholder="Email"
            required
          />
        </div>
        <div className="mb-6">
          <label className="mb-2 block text-sm font-bold" htmlFor="password">
            Password
          </label>
          <input
            name="password"
            className="input input-bordered w-full"
            type="password"
            placeholder="Password"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button className="btn btn-primary" type="submit">
            Authenticate
          </button>
        </div>
      </form>
      {isError && (
        <div className="toast">
          <Warning
            text={
              error?.response?.data.error.message ??
              "Error in login!"
            }
          />
        </div>
      )}
    </div>
  );
}
