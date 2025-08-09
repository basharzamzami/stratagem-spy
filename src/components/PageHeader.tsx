import { ReactNode } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export default function PageHeader({
  title,
  subtitle,
  crumbs,
  actions,
}: {
  title: string;
  subtitle?: string;
  crumbs?: Array<{ label: string; href?: string }>;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6">
      {crumbs && crumbs.length ? (
        <Breadcrumb className="mb-3">
          <BreadcrumbList>
            {crumbs.map((c, i) => (
              <>
                <BreadcrumbItem key={`crumb-${i}`}>
                  {c.href ? (
                    <BreadcrumbLink href={c.href}>{c.label}</BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{c.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {i < crumbs.length - 1 && <BreadcrumbSeparator />}
              </>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      ) : null}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
