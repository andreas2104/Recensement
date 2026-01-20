'use client'

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import Link from "next/link";

interface LoginFormData {
  email: string;
  password: string;
}

interface ValidationErrors {
  email?: string[];
  password?: string[];
}

interface ApiError {
  message: string;
  errors?: ValidationErrors;
}

const login = async (data: LoginFormData) => {
  const response = await fetch(`/api/auth/login`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    credentials: 'include', // ✅ Ajouté pour les cookies
    body: JSON.stringify(data), 
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }
  return response.json();
}

export default function LoginPage() {
  const queryClient = useQueryClient();
  const router = useRouter(); 
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [globalError, setGlobalError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
    
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
    
    if (globalError) {
      setGlobalError("");
    }
  }

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      console.log("✅ Login successful, invalidating user query");
      
      // ✅ Invalider la query avec la bonne clé
      queryClient.invalidateQueries({queryKey: ["user"]});
      
      setValidationErrors({});
      setGlobalError("");
      
      // ✅ Optionnel : précharger les données utilisateur
      queryClient.refetchQueries({queryKey: ["user"]});
      
      startTransition(() => {
        router.push('/persons');
      });
    },
    onError: (error: ApiError) => {
      console.error("❌ Login error:", error);
      setValidationErrors({});
      setGlobalError("");
      
      if (error.errors) {
        setValidationErrors(error.errors);
      } else if (error.message) {
        setGlobalError(error.message);
      } else {
        setGlobalError("An unknown error occurred");
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});
    setGlobalError("");
    
    if (!formData.email || !formData.password) {
      setGlobalError("Please fill in all required fields");
      return;
    }

    mutation.mutate(formData);
  }

  const isLoading = mutation.isPending || isPending;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form 
        onSubmit={handleSubmit}
        className="shadow-lg bg-white rounded-xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        
        {globalError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {globalError}
          </div>
        )}
        
        <div className="mb-4">
          <input 
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              validationErrors.email ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
            }`}
          />
          {validationErrors.email && (
            <div className="mt-1">
              {validationErrors.email.map((error, index) => (
                <p key={index} className="text-red-500 text-sm">{error}</p>
              ))}
            </div>
          )}
        </div>

        <div className="mb-6">
          <input 
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              validationErrors.password ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
            }`}
          />
          {validationErrors.password && (
            <div className="mt-1">
              {validationErrors.password.map((error, index) => (
                <p key={index} className="text-red-500 text-sm">{error}</p>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed mb-4"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>

        <div className="text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link 
              href="/registration" 
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign up
            </Link>
          </p>
          <Link href="/forgot-password" className="text-red-500 text-sm hover:text-red-600">
            Forgot password?
          </Link>
        </div>
      </form>
    </div>
  )
}