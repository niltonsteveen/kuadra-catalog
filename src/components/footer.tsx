import { useRouter } from "next/navigation";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "./typography";

const FOOTER_SECTIONS = [
  {
    title: "Legales",
    links: [
      { label: "Política de tratamiento de datos", href: "#" },
      { label: "Términos y condiciones", href: "#" },
      { label: "Cookies", href: "#" },
    ],
  },
  {
    title: "Kuadra",
    links: [
      { label: "Ayuda", href: "#" },
      { label: "Contacto", href: "#" },
      { label: "Blog", href: "#" },
    ],
  },
  {
    title: "Síguenos",
    links: [
      { label: "Facebook", href: "#" },
      { label: "Instagram", href: "#" },
      { label: "Linked In", href: "#" },
    ],
  },
] as const;

export function Footer() {
  const router = useRouter();

  return (
    <footer className="w-full bg-gray-50 p-xl dark:bg-[#383838] modern:rounded-t-radius-l classic:rounded-none">
      <div className="flex gap-4xl justify-center">
        {FOOTER_SECTIONS.map((section) => (
          <div key={section.title} className="space-y-s">
            <Typography
              size="xs"
              weight="regular"
              className="!text-gray-900 dark:!text-gray-500 pl-s"
            >
              {section.title}
            </Typography>
            <ul className="space-y-xs ">
              {section.links.map((link) => (
                <li key={link.label}>
                  <Button
                    onClick={() => router.push(link.href)}
                    size="s"
                    variant="text"
                    suffixIcon={
                      <ExternalLink className="h-4 w-4 transition hover:translate-x-0.5" />
                    }
                  >
                    {link.label}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-16 flex flex-col items-center gap-6 text-center">
        <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          <Image
            src="/image/logo-light.svg"
            alt="Kuadra"
            width={128}
            height={32}
            className="dark:hidden"
          />
          <Image
            src="/image/logo-dark.svg"
            alt="Kuadra"
            width={128}
            height={32}
            className="hidden dark:block"
          />
        </div>
        <Typography
          size="xs"
          weight="regular"
          className="!text-gray-900 dark:!text-gray-500 pl-s"
        >
          © Catálogo diseñado y desarrollado por Kuadra S.A.S. todos los
          derechos reservados 2025
        </Typography>
        <Button size="m">Registra tu negocio en Kuadra</Button>
      </div>
    </footer>
  );
}
