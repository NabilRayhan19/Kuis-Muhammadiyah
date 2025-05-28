import { cn } from "@/lib/utils";

const MaxWidthWrapper = ({ className, children }) => {
    return (
        <div className={cn("mx-auto w-full max-w-5xl 2xl:max-w-6xl", className)}>
            {children}
        </div>
    );
};

export default MaxWidthWrapper;