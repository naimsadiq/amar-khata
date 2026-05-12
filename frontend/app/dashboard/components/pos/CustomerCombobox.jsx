"use client";
import * as React from "react";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function CustomerCombobox({
  customers,
  selectedCustomer,
  onSelectCustomer,
  setIsModalOpen,
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-10 border-border bg-background text-sm font-normal text-foreground hover:bg-muted/50"
        >
          {selectedCustomer
            ? customers.find((cus) => cus._id === selectedCustomer)?.name
            : "গ্রাহক নির্বাচন করুন (ঐচ্ছিক)"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[340px] p-0 border-border bg-popover text-popover-foreground">
        <Command>
          <CommandInput
            placeholder="নাম বা ফোন নম্বর দিয়ে খুঁজুন..."
            className="border-none focus:ring-0"
          />
          <CommandList className="custom-scrollbar">
            <CommandEmpty>কোনো গ্রাহক পাওয়া যায়নি।</CommandEmpty>
            <CommandGroup>
              {customers.map((cus) => (
                <CommandItem
                  key={cus._id}
                  value={`${cus.name} ${cus.phone}`}
                  onSelect={() => {
                    onSelectCustomer(cus._id);
                    setOpen(false);
                  }}
                  className="aria-selected:bg-muted aria-selected:text-foreground cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 text-primary",
                      selectedCustomer === cus._id
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  <div>
                    <div className="font-medium">{cus.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {cus.phone}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator className="bg-border" />
            <CommandGroup
              onClick={() => {
                setIsModalOpen(true);
                setOpen(false);
              }}
            >
              <CommandItem className="text-primary hover:text-primary/80 cursor-pointer font-medium mt-1">
                <PlusCircle className="mr-2 h-4 w-4" />
                নতুন গ্রাহক যোগ করুন
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
