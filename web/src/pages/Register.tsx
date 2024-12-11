import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import useAuth from "../hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const Signup = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;  
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    
    const result = await register(email, username, password);
    if (!result.success) {
      toast.error(result.error, {
        position: "bottom-left",
      });
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex items-center justify-center h-[100vh]">
      <div className="w-full max-w-sm space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-center text-foreground">
            Create a new account
          </h2>
          <p className="mt-2 text-sm text-center text-muted-foreground">
            Or{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:text-primary/80 hover:underline"
            >
              sign in to your existing account
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
            <Label htmlFor="username">Username</Label>
            <div className="mt-1">
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                placeholder="Enter a username"
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
              Sign up
            </Button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;