import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import useAuth from "../hooks/use-auth.js";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // handle form submission
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;  
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    const result = await login(email, password);
    if (!result.success) {
      toast.error("Incorrect email or password", {
        position: "bottom-left",
      });
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex items-center justify-center h-[100vh]">
      <div className="w-full max-w-sm mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-center text-foreground">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-center text-muted-foreground">
            Or{" "}
            <Link
              to={"/register"}
              className="font-medium text-primary hover:text-primary/80 hover:underline"
            >
              create a new account
            </Link>
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit} method="POST">
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="mt-1">
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Enter your email"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="mt-1">
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Enter a password"
              />
            </div>
          </div>
          <div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
