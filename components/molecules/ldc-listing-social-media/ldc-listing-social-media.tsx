import { FaFacebookF, FaInstagram, FaXTwitter, FaYoutube, FaTiktok } from "react-icons/fa6";
import { Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IListingSocialMedia } from "@/interfaces/listing";

interface LDCListingSocialMediaProps {
  socialMedia: IListingSocialMedia;
  className?: string;
}

const socialConfig = {
  facebook: {
    icon: FaFacebookF,
    label: "Facebook",
  },
  instagram: {
    icon: FaInstagram,
    label: "Instagram",
  },
  twitter: {
    icon: FaXTwitter,
    label: "X",
  },
  youtube: {
    icon: FaYoutube,
    label: "YouTube",
  },
  tiktok: {
    icon: FaTiktok,
    label: "TikTok",
  },
};

/**
 * LDCListingSocialMedia - Social Media Links for Listings
 *
 * Displays social media links for a listing in a vertical list style.
 * Supports both simple URL strings and objects with url + followers.
 */
export function LDCListingSocialMedia({
  socialMedia,
  className,
}: LDCListingSocialMediaProps) {
  const activeSocials = Object.entries(socialMedia).filter(([, value]) => value);

  if (activeSocials.length === 0) return null;

  return (
    <div className={cn("bg-card rounded-xl border border-border p-5", className)}>
      <h3 className="text-lg font-bold font-mulish text-foreground mb-4 flex items-center gap-2">
        <Share2 className="w-5 h-5 text-pink" />
        Redes Sociales
      </h3>

      <div className="flex flex-col gap-3">
        {activeSocials.map(([platform, value]) => {
          const config = socialConfig[platform as keyof typeof socialConfig];
          if (!config || !value) return null;

          const Icon = config.icon;
          const isObject = typeof value === "object";
          const url = isObject ? value.url : value;
          const followers = isObject ? value.followers : undefined;

          return (
            <a
              key={platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-pink/10 dark:bg-purple/20 flex items-center justify-center group-hover:bg-pink/20 dark:group-hover:bg-purple/30 transition-colors">
                  <Icon className="w-5 h-5 text-pink dark:text-purple" />
                </div>
                <p className="text-foreground font-medium group-hover:text-pink dark:group-hover:text-yellow transition-colors">
                  {config.label}
                </p>
              </div>
              {followers && (
                <p className="text-sm text-muted-foreground">
                  {followers} seguidores
                </p>
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
}
