import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import Label from "../Label";
import { LabelVariant } from "@/components/Label";

interface PopoverDropboxOption {
    id: string;
    label: string;
    variant?: LabelVariant;
    leftIcon?: React.ReactNode; // 프로필 이미지, leftIcon 위치
    onClick?: () => void;
}

interface PopoverDropboxProps {
    options: PopoverDropboxOption[];
    className?: string;
    height?: "default" | "fit";
}

const heightClasses = {
    default: "h-8",
    fit: "h-fit",
};

const PopoverDropbox = ({
    options,
    className,
    height = "default",
}: PopoverDropboxProps) => {
    return (
        <ScrollArea className={heightClasses[height]}>
            <div
                className={cn(
                    className,
                    "flex flex-wrap gap-3 items-center translate-y-0.5"
                )}
            >
                {options.map((option) => (
                    <Label
                        key={option.id}
                        label={option.label}
                        variant={option.variant}
                        leftIcon={option.leftIcon}
                        onClick={option.onClick}
                    />
                ))}
            </div>
        </ScrollArea>
    );
};

export default PopoverDropbox;
