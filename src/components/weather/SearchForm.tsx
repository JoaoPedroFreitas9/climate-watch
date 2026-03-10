import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { SubmitButton } from "@/components/ui/SubmitButton";

interface Props {
  cidade?: string;
}

export default function SearchForm({ cidade }: Props) {
  return (
    <form className="flex w-full max-w-md gap-2 mt-2 lg:mt-3" action="/">
      <div className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />

        <Input
          name="cidade"
          defaultValue={cidade}
          placeholder="Buscar cidade..."
          className="bg-white dark:bg-slate-900 shadow-sm h-12 text-base rounded-xl border-slate-200 dark:border-slate-800 pl-11 capitalize text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-blue-500"
          required
        />
      </div>

      <SubmitButton />
    </form>
  );
}