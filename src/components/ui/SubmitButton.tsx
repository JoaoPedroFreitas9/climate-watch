"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function SubmitButton() {
  const [pending, setPending] = useState(false);

  return (
    <Button 
      type="submit" 
      onClick={(e) => {
      
        const form = e.currentTarget.closest("form");
        if (form && form.checkValidity()) {
          setTimeout(() => setPending(true), 10);
        }
      }}
      disabled={pending}
      className="h-12 px-6 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white transition-all disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          A procurar...
        </>
      ) : (
        "Buscar"
      )}
    </Button>
  );
} 