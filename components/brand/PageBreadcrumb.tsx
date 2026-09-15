import Link from "next/link";

export function PageBreadcrumb({
  items,
}: {
  items: readonly { href?: string; label: string }[];
}) {
  return (
    <nav className="mh-breadcrumb" aria-label="Breadcrumb">
      <ol>
        {items.map((item) => (
          <li key={item.label}>
            {item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
