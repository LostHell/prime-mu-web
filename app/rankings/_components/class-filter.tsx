"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CHARACTER_CLASS_BY_ID } from "@/lib/game/constants/characters";
import { useState } from "react";

const ALL_CLASSES = "all";

const ClassFilter = ({ classId }: { classId?: number }) => {
  const [value, setValue] = useState(
    classId === undefined ? ALL_CLASSES : String(classId),
  );

  return (
    <>
      {value !== ALL_CLASSES ? (
        <input type="hidden" name="class" value={value} />
      ) : null}
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger id="player-class" className="w-full">
          <SelectValue placeholder="All classes" />
        </SelectTrigger>
        <SelectContent position="popper" align="start">
          <SelectGroup>
            <SelectItem value={ALL_CLASSES}>All classes</SelectItem>
            {Object.entries(CHARACTER_CLASS_BY_ID).map(([id, label]) => (
              <SelectItem key={id} value={id}>
                {label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
};

export default ClassFilter;
