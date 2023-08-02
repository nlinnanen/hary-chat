import axios from "axios";
import { useMutation } from "react-query";
import { usePostAuthLocal } from "src/api/users-permissions-auth/users-permissions-auth";

const authenticate = async ({ email, password }: {email: string, password: string}) => {
  const response = await axios.post("/auth/local", );

};


export default function Login({setIsAuthenticated}: {setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>}) {
  const mutation = useMutation("authenticate", authenticate);
  const { mutate } = usePostAuthLocal({axios: {params: {populate: '*'}}});

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };
    mutate({
      data: {
        identifier: form.email.value,
        password: form.password.value,
      },
    }, {
      onSuccess: (response) => {
        const jwt = response.data.jwt;
        axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
        localStorage.setItem("authToken", jwt || "");
        localStorage.setItem("userId", response.data.user?.id?.toString() || "");
        setIsAuthenticated(true);
      }
    });
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleLogin}
        className="bg-gray-700 text-gray-400 shadow-md rounded-xl px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="email">
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
          <label className="block text-sm font-bold mb-2" htmlFor="password">
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
          <button
            className="btn btn-primary"
            type="submit"
          >
            Authenticate
          </button>
        </div>
      </form>
    </div>
  )
}