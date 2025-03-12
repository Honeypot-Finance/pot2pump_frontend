import React, { useState, useRef, useEffect } from "react";
import { ReactTyped } from "react-typed";
import { cn } from "@nextui-org/theme";

interface ProjectDescriptionProps {
  description?: string | null;
  className?: string;
}

const ProjectDescription: React.FC<ProjectDescriptionProps> = ({
  description,
  className,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowMore, setShouldShowMore] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (textRef.current) {
      const lineHeight = parseInt(
        window.getComputedStyle(textRef.current).lineHeight
      );
      const height = textRef.current.offsetHeight;
      setShouldShowMore(height > lineHeight * 3);
    }
  }, [description]);

  if (!description) return null;

  if (isMobile) {
    return (
      <div
        className={cn(
          "text-xs flex flex-col items-center justify-center shadow-inner rounded-md p-2 border border-[#202020]/5",
          className
        )}
      >
        <div
          ref={textRef}
          className={cn(
            "text-center transition-all duration-300",
            !isExpanded && shouldShowMore ? "line-clamp-3" : ""
          )}
        >
          {description}
        </div>
        {shouldShowMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-[#5C5C5C] hover:text-black text-xs font-medium"
          >
            {isExpanded ? "Show less" : "Show more"}
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "text-xs shadow-inner rounded-xl p-4 border border-[#202020]/5",
        className
      )}
    >
      <ReactTyped
        strings={[description]}
        typeSpeed={25}
        showCursor={false}
      />
    </div>
  );
};

export default ProjectDescription;
