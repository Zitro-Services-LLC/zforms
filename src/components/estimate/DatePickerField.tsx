
import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  value,
  onChange,
  disabled,
}) => {
  const asDate = value ? new Date(value) : undefined;

  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium text-gray-800">{label}</label>}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className="w-full justify-start text-left font-normal"
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4 opacity-60" />
            {asDate ? format(asDate, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={asDate}
            onSelect={(date) => date && onChange(date.toISOString().split("T")[0])}
            initialFocus
            className="p-3 pointer-events-auto"
            disabled={(date) => date > new Date("2100-12-31") || date < new Date("2000-01-01")}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePickerField;

