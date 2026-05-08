// components/pos/CustomerCombobox.jsx

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
          className="w-full justify-between h-[38px] border-[#e8ecf0] bg-white text-[0.82rem] font-normal"
        >
          {selectedCustomer
            ? customers.find((cus) => cus._id === selectedCustomer)?.name
            : "গ্রাহক নির্বাচন করুন (ঐচ্ছিক)"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[340px] p-0">
        <Command>
          <CommandInput placeholder="নাম বা ফোন নম্বর দিয়ে খুঁজুন..." />
          <CommandList>
            <CommandEmpty>কোনো গ্রাহক পাওয়া যায়নি।</CommandEmpty>
            <CommandGroup>
              {customers.map((cus) => (
                <CommandItem
                  key={cus._id}
                  value={`${cus.name} ${cus.phone}`} // সার্চ করার জন্য নাম ও ফোন নম্বর
                  onSelect={() => {
                    onSelectCustomer(cus._id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCustomer === cus._id
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  <div>
                    <div>{cus.name}</div>
                    <div className="text-xs text-gray-400">{cus.phone}</div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup onClick={() => setIsModalOpen(true)}>
              <CommandItem className="text-blue-600 cursor-pointer">
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
