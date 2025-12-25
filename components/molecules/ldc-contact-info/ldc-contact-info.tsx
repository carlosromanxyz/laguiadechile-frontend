import { FaFacebookF, FaInstagram, FaXTwitter, FaLinkedinIn, FaTiktok, FaYoutube } from "react-icons/fa6";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LDCContactInfoProps {
  /** Optional className for custom styling */
  className?: string;
}

const socialLinks = [
  {
    icon: FaFacebookF,
    href: "https://facebook.com/laguiadechile",
    label: "Facebook",
    followers: "12.5K",
  },
  {
    icon: FaInstagram,
    href: "https://instagram.com/laguiadechile",
    label: "Instagram",
    followers: "28.3K",
  },
  {
    icon: FaXTwitter,
    href: "https://x.com/laguiadechile",
    label: "X",
    followers: "8.2K",
  },
  {
    icon: FaLinkedinIn,
    href: "https://linkedin.com/company/laguiadechile",
    label: "LinkedIn",
    followers: "5.1K",
  },
  {
    icon: FaTiktok,
    href: "https://tiktok.com/@laguiadechile",
    label: "TikTok",
    followers: "15.7K",
  },
  {
    icon: FaYoutube,
    href: "https://youtube.com/@laguiadechile",
    label: "YouTube",
    followers: "3.4K",
  },
];

/**
 * LDCContactInfo - Social Media Links Component
 *
 * Displays social media links as horizontal badges.
 */
export function LDCContactInfo({ className }: LDCContactInfoProps) {
  return (
    <div
      className={cn(
        "bg-card dark:bg-neutral-800 rounded-lg border border-border p-6 md:p-8",
        className
      )}
    >
      <h2 className="text-2xl font-bold font-mulish text-foreground mb-2">
        Síguenos en redes sociales
      </h2>
      <p className="text-muted-foreground mb-6">
        Mantente al día con las últimas novedades y contenido exclusivo.
      </p>

      {/* Social Links */}
      <div className="flex flex-col gap-4">
        {socialLinks.map((social) => (
          <Link
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-4 group"
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-pink/10 dark:bg-purple/20 flex items-center justify-center group-hover:bg-pink/20 dark:group-hover:bg-purple/30 transition-colors">
                <social.icon className="w-5 h-5 text-pink dark:text-purple" />
              </div>
              <p className="text-foreground font-medium group-hover:text-pink dark:group-hover:text-yellow transition-colors">
                {social.label}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              {social.followers} seguidores
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
