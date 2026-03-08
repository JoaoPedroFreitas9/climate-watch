"use client"; 

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react"; 

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button 
      type="submit" 
      disabled={pending} 
      // Altura ajustada para h-12, cantos arredondados e fonte encorpada
      className="h-12 px-6 md:px-8 rounded-xl shadow-sm hover:shadow-md transition-all min-w-[120px] font-semibold text-base"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Buscando...
        </>
      ) : (
        "Buscar"
      )}
    </Button>
  );
}