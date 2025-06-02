
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Phone, Lock, UserPlus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

// Define the validation schema for sign in
const signInSchema = z.object({
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  isDriver: z.boolean().default(false),
});

// Define the validation schema for sign up
const signUpSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  isDriver: z.boolean().default(false),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Define the types for our form data
type SignInFormValues = z.infer<typeof signInSchema>;
type SignUpFormValues = z.infer<typeof signUpSchema>;

const Auth = () => {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialize the sign-in form
  const signInForm = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      phone: "",
      password: "",
      isDriver: false,
    },
  });

  // Initialize the sign-up form
  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      phone: "",
      password: "",
      confirmPassword: "",
      isDriver: false,
    },
  });

  // Handle sign-in form submission
  const onSignInSubmit = (data: SignInFormValues) => {
    console.log("Sign In Data:", data);
    toast({
      title: "Sign In Successful",
      description: `Welcome back${data.isDriver ? " driver" : ""}!`,
    });
    
    // Redirect to driver panel if signed in as driver, otherwise to home
    if (data.isDriver) {
      navigate("/driver");
    } else {
      navigate("/");
    }
  };

  // Handle sign-up form submission
  const onSignUpSubmit = (data: SignUpFormValues) => {
    console.log("Sign Up Data:", data);
    toast({
      title: "Sign Up Successful",
      description: `Account created successfully${data.isDriver ? " as driver" : ""}!`,
    });
    
    // Redirect to driver panel if signed up as driver, otherwise to home
    if (data.isDriver) {
      navigate("/driver");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="p-4">
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Back to Home</span>
        </Link>
      </div>
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold text-porter-black">
              {activeTab === "signin" ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              {activeTab === "signin" 
                ? "Sign in to access your account" 
                : "Sign up to start your journey with Delivery Partner"}
            </p>
          </div>

          <Tabs 
            defaultValue="signin" 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as "signin" | "signup")}
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin" className="text-lg">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="text-lg">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="space-y-4">
              <Form {...signInForm}>
                <form onSubmit={signInForm.handleSubmit(onSignInSubmit)} className="space-y-4">
                  <FormField
                    control={signInForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Phone className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input placeholder="1234567890" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signInForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input type="password" placeholder="Your password" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signInForm.control}
                    name="isDriver"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 py-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Log in as driver</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full bg-porter-red hover:bg-red-700" 
                    size="lg"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                </form>
              </Form>

              <div className="text-center mt-4">
                <p className="text-sm text-gray-500">
                  Don't have an account?{" "}
                  <button 
                    type="button" 
                    onClick={() => setActiveTab("signup")} 
                    className="text-porter-red hover:text-red-700 font-medium"
                  >
                    Create one
                  </button>
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              <Form {...signUpForm}>
                <form onSubmit={signUpForm.handleSubmit(onSignUpSubmit)} className="space-y-4">
                  <FormField
                    control={signUpForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signUpForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Phone className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input placeholder="1234567890" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signUpForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input type="password" placeholder="Create a password" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signUpForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input type="password" placeholder="Confirm your password" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signUpForm.control}
                    name="isDriver"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 py-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Sign up as driver</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full bg-porter-red hover:bg-red-700" 
                    size="lg"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Account
                  </Button>
                </form>
              </Form>

              <div className="text-center mt-4">
                <p className="text-sm text-gray-500">
                  Already have an account?{" "}
                  <button 
                    type="button" 
                    onClick={() => setActiveTab("signin")} 
                    className="text-porter-red hover:text-red-700 font-medium"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Auth;
