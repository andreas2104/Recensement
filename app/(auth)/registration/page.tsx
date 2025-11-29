'use client'

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";

interface UserFormData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

interface ValidationErrors {
  name?: string[];
  email?: string[];
  password?: string[];
  phone?: string[];
}

interface ApiError {
  message: string;
  errors?: ValidationErrors;
}

const register = async(data: UserFormData) => {
  const response = await fetch(`/api/auth/signup`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body:JSON.stringify(data), 
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw errorData; // Lancer directement l'objet d'erreur
  }
  return response.json();
}

export default function RegisterPage() {
  const queryClient = useQueryClient();
  const router = useRouter(); 
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [globalError, setGlobalError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
    
    // Effacer l'erreur du champ quand l'utilisateur commence à taper
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
    
    // Effacer l'erreur globale
    if (globalError) {
      setGlobalError("");
    }
  }

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["register"]});
      setValidationErrors({});
      setGlobalError("");
      alert("Registration successful! Redirecting...");
      startTransition(() => {
        router.push('/');
      });
    },
    onError: (error: ApiError) => {
      // Réinitialiser les erreurs précédentes
      setValidationErrors({});
      setGlobalError("");
      
      if (error.errors) {
        // Afficher les erreurs de validation par champ
        setValidationErrors(error.errors);
      } else if (error.message) {
        // Afficher l'erreur globale
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
    
    // Validation simple
    if (!formData.name || !formData.email || !formData.password) {
      setGlobalError("Please fill in all required fields");
      return;
    }

    mutation.mutate(formData);
  }

  const isLoading = mutation.isPending || isPending;

  return (
    <div className="flex  items-center justify-center  min-h-screen ">
      <form 
        onSubmit={handleSubmit}
        className="shadow-lg bg-white rounded-xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Registration</h2>
        
        {/* Message d'erreur global */}
        {globalError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {globalError}
          </div>
        )}
        
        {/* Champ Name */}
        <div className="mb-4">
          <input 
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              validationErrors.name ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
            }`}
          />
          {validationErrors.name && (
            <div className="mt-1">
              {validationErrors.name.map((error, index) => (
                <p key={index} className="text-red-500 text-sm">{error}</p>
              ))}
            </div>
          )}
        </div>

        {/* Champ Email */}
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

        {/* Champ Phone */}
        <div className="mb-4">
          <input 
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              validationErrors.phone ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
            }`}
          />
          {validationErrors.phone && (
            <div className="mt-1">
              {validationErrors.phone.map((error, index) => (
                <p key={index} className="text-red-500 text-sm">{error}</p>
              ))}
            </div>
          )}
        </div>

        {/* Champ Password */}
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
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "Creating account..." : "Create Account"}
        </button>
      </form>
    </div>
  )
}