import React from "react";
import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";

type SeverityBadgeProps = {
    severity: string;
    size?: string;
    className?: string;
};

export function SeverityBadge({severity, size = "sm", className}: SeverityBadgeProps) {
    // Determine variant based on severity
    const variant = severity === "强制"
        ? "destructive"
        : severity === "建议"
            ? "default"
            : "secondary";

    // Map size to appropriate classes
    const sizeClasses = {
        "xs": "text-xs h-4",
        "sm": "text-xs h-5",
        "md": "text-sm",
    }[size] || "text-xs";

    return (
        <Badge
            variant={variant as "default" | "destructive" | "outline" | "secondary"}
            className={cn(sizeClasses, className)}
        >
            {severity}
        </Badge>
    );
}