import { Link } from "react-router";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { BreadcrumbStyle } from "./breadcrumbStyle";

type BreadcrumbItem = {
  label: string;
  to?: string;
  Icon?: LucideIcon;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export default function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <BreadcrumbStyle aria-label="현재 위치" className={className}>
      <ol>
        {items.map(({ label, to, Icon }, index) => {
          const isCurrentPage = index === items.length - 1;

          const content = (
            <>
              {Icon && <Icon size={18} aria-hidden="true" />}
              <span className="breadcrumb-label">{label}</span>
            </>
          );

          return (
            <li key={`${to ?? "current"}-${label}`}>
              {index > 0 && <ChevronRight size={16} aria-hidden="true" />}

              {to ? (
                <Link
                  to={to}
                  className="breadcrumb-item"
                  aria-current={isCurrentPage ? "page" : undefined}
                >
                  {content}
                </Link>
              ) : (
                <span
                  className="breadcrumb-item"
                  aria-current={isCurrentPage ? "page" : undefined}
                >
                  {content}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </BreadcrumbStyle>
  );
}
