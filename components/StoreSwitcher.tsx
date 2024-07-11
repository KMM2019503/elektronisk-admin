"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Store } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useStoreModal } from "@/hooks/use-store-modal";
import { CommandList } from "cmdk";

type PopoverTriggerProps = React.ComponentPropsWithRef<typeof PopoverTrigger>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Store[];
}

interface StoreType {
  value: string;
  label: string;
}

export function StoreSwitcher({ className, items = [] }: StoreSwitcherProps) {
  const storeModal = useStoreModal();
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = React.useState(false);

  const FormetedStores = items.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const currentStore = FormetedStores.find(
    (item) => item.value === params.storeId
  );

  const onStoreSelect = (store: { value: string; label: string }) => {
    setOpen(false);
    router.push(`/${store.value}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size={"sm"}
          role="combobox"
          aria-expanded={open}
          aria-label="Select a Store"
          className="w-[200px] justify-between"
        >
          {currentStore?.label || "Select a Store"}

          <ChevronsUpDown className="ml-2 h-5 w-5 shrink-0 opacity-40" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] lg:w-[300px] p-0 translate-x-5    ">
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem></CommandItem>
              <ul className="w-auto text-surface dark:text-white">
                {FormetedStores.map((store) => (
                  <li
                    onClick={() => {
                      onStoreSelect(store);
                    }}
                    value={store.value}
                    key={store.value}
                    className={cn(
                      "w-full text-xs lg:text-sm px-10 border-b-2 border-neutral-100 py-2 dark:border-white/10 flex items-center justify-between gap-3 hover:bg-neutral-300 cursor-pointer",
                      currentStore?.value === store.value && "bg-neutral-300"
                    )}
                  >
                    {store.label}
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        currentStore?.value === store.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </li>
                ))}
              </ul>
            </CommandGroup>
          </CommandList>
        </Command>
        <Button
          onClick={() => {
            setOpen(false);
            storeModal.onOpen();
          }}
          className="w-full rounded-none"
          variant={"ghost"}
        >
          {/* <FaPlus className="mr-3 h-4 w-4 opacity-50" /> */}
          <p className="text-sm">Add Store</p>
        </Button>
      </PopoverContent>
    </Popover>
  );
}

// <CommandItem
//   key={store.value}
//   value={store.value}
//   onSelect={() => onStoreSelect(store)}
//   className="flex items-center justify-center gap-3"
// >
//   {store.label}
//   <Check
//     className={cn(
//       "mr-2 h-4 w-4",
//       currentStore?.value === store.value
//         ? "opacity-100"
//         : "opacity-0"
//     )}
//   />
// </CommandItem>
