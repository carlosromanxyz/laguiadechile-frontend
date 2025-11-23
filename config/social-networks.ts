/**
 * Social Networks configuration for La Guía de Chile
 * Defines social media links and their associated icons
 */

import { IconType } from "react-icons";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export interface SocialNetwork {
  name: string;
  url: string;
  icon: IconType;
  colorClass: string;
}

export const socialNetworks: SocialNetwork[] = [
  {
    name: "Facebook",
    url: "https://www.facebook.com/laguiadechilecl",
    icon: FaFacebook,
    colorClass: "hover:text-blue-500",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/laguiadechilecl",
    icon: FaInstagram,
    colorClass: "hover:text-pink-500",
  },
  {
    name: "X",
    url: "https://www.twitter.com/laguiadechilecl",
    icon: FaXTwitter,
    colorClass: "hover:text-gray-400",
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/channel/UCVbJ0J5QzYv1w9bXvJQ9W5A",
    icon: FaYoutube,
    colorClass: "hover:text-red-500",
  },
];
