"use client";

import { useEffect, useRef, useState } from "react";
import { IconButton } from "./icon-button";
import { KuadraIcon } from "./kuadra-icon";
import clsx from "clsx";
import { Typography } from "../typography";

type CounterV2Props = {
  onUpdate?: (count: number) => void;
  onRemove?: () => void;
  value?: number;
  isEditable?: boolean;
  disableMinus?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

function CounterV2({
  onUpdate,
  onRemove,
  value,
  isEditable,
  disableMinus = false,
  className,
  ...props
}: CounterV2Props) {
  const [count, setCount] = useState(value ?? 0);

  useEffect(() => {
    setCount(value ?? 0);
  }, [value]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.textContent = count.toString();
    }
  }, [count]);

  const increment = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setCount((prevCount) => {
      const updatedCount = prevCount + 1;
      onUpdate && onUpdate(updatedCount);
      return updatedCount;
    });
  };

  const decrement = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (count === 1 && !disableMinus && onRemove) {
      onRemove();
      return;
    }

    setCount((prevCount) => {
      const updatedCount = disableMinus
        ? Math.max(prevCount - 1, 1)
        : Math.max(prevCount - 1, 0);
      onUpdate && onUpdate(updatedCount);
      return updatedCount;
    });
  };

  const handleBlur = (e: React.FocusEvent<HTMLSpanElement>) => {
    if (!isEditable) return;
    const newValue = parseInt(e.currentTarget.textContent || "0", 10);
    if (isNaN(newValue)) {
      setUpdateTrigger((prev) => prev + 1);
    } else {
      const validValue = disableMinus ? Math.max(newValue, 1) : newValue;
      setCount(validValue);
      onUpdate && onUpdate(validValue);
    }
  };

  const [updateTrigger, setUpdateTrigger] = useState(0);
  const inputRef = useRef<HTMLSpanElement>(null);

  const isMinusDisabled = disableMinus && count === 1;

  return (
    <div
      className={clsx(
        "relative z-10 flex h-[48px] w-fit items-center justify-between gap-xs bg-white",
        className
      )}
      {...props}
    >
      <IconButton
        onClick={decrement}
        size="s"
        variant="secondary"
        disabled={isMinusDisabled}
        className={isMinusDisabled ? "cursor-not-allowed opacity-50" : ""}
      >
        {count === 1 && !disableMinus ? (
          <KuadraIcon name="icon-bin" size="s" className="text-error" />
        ) : (
          <KuadraIcon name="icon-minus" size="s" />
        )}
      </IconButton>

      <span
        contentEditable={isEditable}
        suppressContentEditableWarning={true}
        onBlur={handleBlur}
        ref={inputRef}
        key={updateTrigger}
        className="flex w-[64px] items-center justify-center"
      >
        <Typography size="xs" weight="bold">
          {count}
        </Typography>
      </span>
      <IconButton variant="secondary" onClick={increment} size="s">
        <KuadraIcon name="icon-add" size="s" />
      </IconButton>
    </div>
  );
}

export default CounterV2;
