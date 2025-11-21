import {
    Popover,
    PopoverAnchor,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface PopoverActionItemProps {
    trigger: React.ReactNode;
    content: React.ReactNode;
    contentWidth?: string;
    className?: string;
}

const PopoverActionItem = ({
    trigger,
    content,
    contentWidth = "w-fit",
    className,
}: PopoverActionItemProps) => {
    return (
        <Popover>
            <PopoverAnchor asChild>
                <div className="inline-flex items-center gap-2 cursor-pointer">
                    <PopoverTrigger asChild>
                        {trigger}
                    </PopoverTrigger>
                </div>
            </PopoverAnchor>
            <PopoverContent
                align="start"
                side="bottom"
                className={cn(contentWidth, className)}
            >
                {content}
            </PopoverContent>
        </Popover>
    );
};

export default PopoverActionItem;
